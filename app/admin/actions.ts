"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ADMIN_COOKIE,
  constantTimeEqual,
  createAdminSession,
  isAdmin,
} from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { isSchemaSetupError, schemaSetupMessage } from "@/lib/supabase/errors";
import {
  dateRangeDays,
  readingTime,
  slugify,
  todayInTimezone,
} from "@/lib/journal";
import type { ActionResult, TrackStatus } from "@/lib/types/journal";

export async function isAuthenticated() {
  return isAdmin();
}

export async function loginAdmin(form: FormData) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured)
    redirect("/admin/login?error=Admin+access+is+not+configured");
  if (!constantTimeEqual(String(form.get("password") || ""), configured)) {
    redirect("/admin/login?error=Incorrect+password.+Please+try+again.");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  store.delete("portfolio_admin_auth");
  redirect("/admin/login");
}

function text(form: FormData, key: string, required = false, max = 500) {
  const value = String(form.get(key) || "").trim();
  if (required && !value)
    throw new Error(`Please enter ${key.replaceAll("_", " ")}.`);
  if (value.length > max)
    throw new Error(
      `${key.replaceAll("_", " ")} is too long (maximum ${max} characters).`,
    );
  return value;
}

function integer(form: FormData, key: string, min: number, max: number) {
  const value = Number(form.get(key));
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(
      `${key.replaceAll("_", " ")} must be between ${min} and ${max}.`,
    );
  return value;
}

function date(form: FormData, key: string) {
  const value = text(form, key, true, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) ||
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Please choose a valid date.");
  }
  return value;
}

function url(form: FormData, key: string) {
  const value = text(form, key, false, 2000);
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") throw new Error();
    return parsed.toString();
  } catch {
    throw new Error("Please use a valid HTTPS URL.");
  }
}

function tags(form: FormData) {
  return [
    ...new Set(
      text(form, "tags", false, 500)
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean),
    ),
  ].slice(0, 12);
}

function databaseError(error: { code?: string; message: string }) {
  if (isSchemaSetupError(error)) return schemaSetupMessage([error]);
  console.warn("Journal write failed", error.code);
  if (error.code === "23505")
    return "That URL is already in use. Choose another slug.";
  if (error.code === "23503")
    return "The linked challenge no longer exists. Refresh and choose another.";
  return "Your changes could not be saved. Check the connection and try again.";
}

async function mutate(
  work: (client: SupabaseClient) => Promise<ActionResult>,
): Promise<ActionResult> {
  if (!(await isAdmin()))
    return { error: "Your session has ended. Sign in again to continue." };
  const client = await createAdminSupabaseClient();
  if (!client)
    return {
      error:
        "Publishing is not connected. Add SUPABASE_URL and SUPABASE_SECRET_KEY to the server environment before saving.",
    };
  try {
    const result = await work(client);
    if ("success" in result) {
      revalidatePath("/journal", "layout");
      revalidatePath("/admin");
    }
    return result;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong. Your changes have not been saved.",
    };
  }
}

export async function savePostAction(form: FormData): Promise<ActionResult> {
  return mutate(async (client) => {
    const id = text(form, "id");
    const title = text(form, "title", true, 200);
    const published = form.get("intent") === "publish";
    const content = text(form, "content", published, 200000);
    const excerpt = text(form, "excerpt", published, 600);
    const track_slug = text(form, "track_slug") || null;
    let slug = slugify(text(form, "slug") || title);
    if (!slug || ["challenges", "preview"].includes(slug))
      throw new Error("Choose a different article URL.");
    let published_at: string | null = published
      ? new Date().toISOString()
      : null;
    if (id) {
      const existing = await client
        .from("posts")
        .select("slug,published_at")
        .eq("id", id)
        .single();
      if (existing.error)
        return {
          error: "This article could not be found. Refresh and try again.",
        };
      slug = existing.data.slug;
      published_at = existing.data.published_at || published_at;
    }
    if (track_slug) {
      const track = await client
        .from("challenge_tracks")
        .select("slug")
        .eq("slug", track_slug)
        .maybeSingle();
      if (track.error || !track.data)
        throw new Error(
          "Choose an available challenge or leave this article standalone.",
        );
    }
    const values = {
      title,
      slug,
      excerpt,
      content,
      published,
      published_at,
      track_slug,
      cover_image: url(form, "cover_image"),
      tags: tags(form),
      reading_time: readingTime(content),
      updated_at: new Date().toISOString(),
      archived_at: null,
    };
    const result = id
      ? await client
          .from("posts")
          .update(values)
          .eq("id", id)
          .select("id,slug")
          .single()
      : await client.from("posts").insert(values).select("id,slug").single();
    if (result.error) return { error: databaseError(result.error) };
    return { success: true, ...result.data };
  });
}

export async function changePostStatusAction(
  id: string,
  status: "published" | "draft" | "archived",
): Promise<ActionResult> {
  return mutate(async (client) => {
    if (!["published", "draft", "archived"].includes(status))
      throw new Error("Invalid article status.");
    const { data: post, error } = await client
      .from("posts")
      .select("content,excerpt,published_at")
      .eq("id", id)
      .single();
    if (error || !post) throw new Error("This article could not be found.");
    if (
      status === "published" &&
      (!post.content.trim() || !post.excerpt.trim())
    )
      throw new Error("Add an excerpt and article content before publishing.");
    const result = await client
      .from("posts")
      .update({
        published: status === "published",
        archived_at: status === "archived" ? new Date().toISOString() : null,
        published_at:
          post.published_at ||
          (status === "published" ? new Date().toISOString() : null),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .single();
    return result.error
      ? { error: databaseError(result.error) }
      : { success: true };
  });
}

export async function saveTrackAction(form: FormData): Promise<ActionResult> {
  return mutate(async (client) => {
    const id = text(form, "id");
    const title = text(form, "title", true, 200);
    const start_date = date(form, "start_date");
    const end_date = date(form, "end_date");
    const days = dateRangeDays(start_date, end_date);
    if (days < 1 || days > 3660)
      throw new Error(
        "Choose an end date after the start date, within ten years.",
      );
    const days_per_week = integer(form, "days_per_week", 1, 7);
    const target_count = integer(form, "target_count", 1, days);
    const preferred_days = [
      ...new Set(form.getAll("preferred_days").map(Number)),
    ];
    if (
      preferred_days.some(
        (day) => !Number.isInteger(day) || day < 0 || day > 6,
      ) ||
      (preferred_days.length && preferred_days.length !== days_per_week)
    ) {
      throw new Error(
        "Choose the same number of preferred weekdays as your weekly goal, or leave all unselected.",
      );
    }
    const timezone = text(form, "timezone", true, 100);
    try {
      new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
    } catch {
      throw new Error("Choose a valid timezone.");
    }
    const status = text(form, "status", true) as TrackStatus;
    if (
      !["planned", "active", "paused", "completed", "archived"].includes(status)
    )
      throw new Error("Choose a valid challenge status.");
    let slug = slugify(text(form, "slug") || title);
    if (!slug)
      throw new Error("Enter a challenge URL using letters or numbers.");
    if (id) {
      const existing = await client
        .from("challenge_tracks")
        .select("slug")
        .eq("id", id)
        .single();
      if (existing.error) throw new Error("This challenge could not be found.");
      slug = existing.data.slug;
      const logs = await client
        .from("challenges")
        .select("completed_date")
        .eq("track_slug", slug);
      if (logs.error) return { error: databaseError(logs.error) };
      if (
        logs.data.some(
          (entry) =>
            entry.completed_date < start_date ||
            entry.completed_date > end_date,
        )
      )
        throw new Error("The date range must include your existing check-ins.");
    }
    const values = {
      title,
      slug,
      start_date,
      end_date,
      days_per_week,
      preferred_days,
      timezone,
      status,
      target_count,
      category: text(form, "category", true, 80),
      description: text(form, "description", true, 2000),
      cadence: days_per_week === 7 ? "Daily" : `${days_per_week}x / week`,
      duration: `${days} days`,
    };
    const result = id
      ? await client
          .from("challenge_tracks")
          .update(values)
          .eq("id", id)
          .select("id,slug")
          .single()
      : await client
          .from("challenge_tracks")
          .insert(values)
          .select("id,slug")
          .single();
    return result.error
      ? { error: databaseError(result.error) }
      : { success: true, ...result.data };
  });
}

export async function changeTrackStatusAction(
  id: string,
  status: TrackStatus,
): Promise<ActionResult> {
  return mutate(async (client) => {
    if (
      !["planned", "active", "paused", "completed", "archived"].includes(status)
    )
      throw new Error("Invalid challenge status.");
    const result = await client
      .from("challenge_tracks")
      .update({ status })
      .eq("id", id)
      .select("id")
      .single();
    return result.error
      ? { error: databaseError(result.error) }
      : { success: true };
  });
}

export async function saveCheckInAction(form: FormData): Promise<ActionResult> {
  return mutate(async (client) => {
    const id = text(form, "id");
    const track_slug = text(form, "track_slug", true);
    const { data: track, error } = await client
      .from("challenge_tracks")
      .select("*")
      .eq("slug", track_slug)
      .single();
    if (error || !track || track.status === "archived")
      throw new Error("Choose an available challenge.");
    const completed_date = date(form, "completed_date");
    if (
      completed_date > todayInTimezone(track.timezone || "Africa/Addis_Ababa")
    )
      throw new Error("Check-ins cannot be dated in the future.");
    if (
      (track.start_date && completed_date < track.start_date) ||
      (track.end_date && completed_date > track.end_date)
    )
      throw new Error("Choose a date within this challenge's schedule.");
    const latest = await client
      .from("challenges")
      .select("day_number")
      .eq("track_slug", track_slug)
      .order("day_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest.error) return { error: databaseError(latest.error) };
    const values = {
      track_slug,
      challenge_name: track.title,
      category: track.category,
      completed_date,
      title: text(form, "title", true, 200),
      summary: text(form, "summary", false, 1000),
      learnings: text(form, "learnings", false, 50000),
      tags: tags(form),
    };
    const result = id
      ? await client
          .from("challenges")
          .update(values)
          .eq("id", id)
          .eq("track_slug", track_slug)
          .select("id")
          .single()
      : await client
          .from("challenges")
          .insert({ ...values, day_number: (latest.data?.day_number || 0) + 1 })
          .select("id")
          .single();
    return result.error
      ? { error: databaseError(result.error) }
      : { success: true, ...result.data };
  });
}

export async function saveNowStatusAction(
  form: FormData,
): Promise<ActionResult> {
  return mutate(async (client) => {
    const status_label = text(form, "status_label", true);
    if (!["Building", "Shipped", "Exploring", "Paused"].includes(status_label))
      throw new Error("Choose a valid project status.");
    const result = await client
      .from("now_status")
      .insert({
        active_project: text(form, "active_project", true, 200),
        description: text(form, "description", true, 2000),
        current_milestone: text(form, "current_milestone", true, 500),
        progress_percent: integer(form, "progress_percent", 0, 100),
        status_label,
        project_url: url(form, "project_url"),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    return result.error
      ? { error: databaseError(result.error) }
      : { success: true };
  });
}
