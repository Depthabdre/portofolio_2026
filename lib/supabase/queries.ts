import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type {
  BlogPost,
  ChallengeTrack,
  JournalData,
} from "@/lib/types/journal";
import { createAdminSupabaseClient } from "./server";
import { isSchemaSetupError, schemaSetupMessage } from "./errors";

function publicClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
}

const emptyData = (error: string | null): JournalData => ({
  posts: [],
  tracks: [],
  challenges: [],
  nowStatus: null,
  error,
});

export const getJournalData = cache(
  async (admin = false): Promise<JournalData> => {
    try {
      const client = admin ? await createAdminSupabaseClient() : publicClient();
      if (!client)
        return emptyData(
          admin
            ? "Publishing is not connected. Complete the Supabase setup to save and manage content."
            : null,
        );

      let postsQuery = client
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      let tracksQuery = client
        .from("challenge_tracks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!admin) {
        postsQuery = postsQuery.eq("published", true).is("archived_at", null);
        tracksQuery = tracksQuery.neq("status", "archived");
      }
      const results = await Promise.all([
        postsQuery,
        tracksQuery,
        client
          .from("challenges")
          .select("*")
          .order("completed_date", { ascending: false })
          .order("created_at", { ascending: false }),
        client
          .from("now_status")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      const errors = results.flatMap((result) =>
        result.error ? [result.error] : [],
      );
      if (errors.length) {
        if (errors.every(isSchemaSetupError)) {
          return emptyData(admin ? schemaSetupMessage(errors) : null);
        }
        console.warn(
          "Journal query failed",
          errors.map((error) => error.code),
        );
        return emptyData(
          admin
            ? "Content could not be loaded. Check your database connection and run the journal migration."
            : "The journal is temporarily unavailable. Please try again shortly.",
        );
      }
      const tracks = results[1].data as ChallengeTrack[];
      const visibleTracks = new Set(tracks.map((track) => track.slug));
      const posts = results[0].data as BlogPost[];
      return {
        posts: admin
          ? posts
          : posts.sort((a, b) =>
              (b.published_at || b.created_at).localeCompare(
                a.published_at || a.created_at,
              ),
            ),
        tracks,
        challenges: (results[2].data || []).filter(
          (entry) =>
            admin || (entry.track_slug && visibleTracks.has(entry.track_slug)),
        ),
        nowStatus: results[3].data,
        error: null,
      };
    } catch {
      return emptyData(
        "Content is temporarily unavailable. Please try again shortly.",
      );
    }
  },
);

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const client = publicClient();
    if (!client) return null;
    const { data, error } = await client
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .is("archived_at", null)
      .maybeSingle();
    if (error && isSchemaSetupError(error)) return null;
    if (error)
      throw new Error("The article could not be loaded. Please try again.");
    return data;
  },
);
