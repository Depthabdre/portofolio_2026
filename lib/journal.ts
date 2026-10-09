import type { BlogPost, Challenge, ChallengeTrack } from "@/lib/types/journal";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function formatDate(value?: string | null, long = false) {
  if (!value) return "";
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function todayInTimezone(
  timezone = "Africa/Addis_Ababa",
  now = new Date(),
) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function dateRangeDays(start: string, end: string) {
  return (
    Math.round(
      (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
        86400000,
    ) + 1
  );
}

export function suggestedTarget(
  start: string,
  end: string,
  frequency: number,
  preferredDays: number[] = [],
) {
  const days = dateRangeDays(start, end);
  if (!Number.isFinite(days) || days < 1) return 1;
  if (preferredDays.length) {
    let count = 0;
    const current = new Date(`${start}T00:00:00Z`);
    for (let index = 0; index < days; index++) {
      if (preferredDays.includes(current.getUTCDay())) count++;
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return Math.max(1, count);
  }
  return Math.max(1, Math.ceil((days / 7) * frequency));
}

export function trackFrequency(track: ChallengeTrack) {
  return (
    track.days_per_week ??
    (track.cadence.toLowerCase() === "daily"
      ? 7
      : Number.parseInt(track.cadence, 10) || 1)
  );
}

export function cadenceLabel(track: ChallengeTrack) {
  const frequency = trackFrequency(track);
  return frequency === 7
    ? "Every day"
    : `${frequency} ${frequency === 1 ? "day" : "days"} / week`;
}

export function trackProgress(
  track: ChallengeTrack,
  entries: Challenge[],
  now = new Date(),
) {
  const dates = new Set(
    entries
      .filter(
        (entry) =>
          entry.track_slug === track.slug &&
          (!track.start_date || entry.completed_date >= track.start_date) &&
          (!track.end_date || entry.completed_date <= track.end_date),
      )
      .map((entry) => entry.completed_date),
  );
  const today = todayInTimezone(track.timezone || "Africa/Addis_Ababa", now);
  const monday = new Date(`${today}T00:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const weekStart = monday.toISOString().slice(0, 10);
  const weekEnd = new Date(monday.getTime() + 6 * 86400000)
    .toISOString()
    .slice(0, 10);
  const weekly = [...dates].filter(
    (date) => date >= weekStart && date <= weekEnd,
  ).length;
  return {
    completed: dates.size,
    weekly,
    percent: Math.min(
      100,
      Math.round((dates.size / Math.max(1, track.target_count)) * 100),
    ),
  };
}

export function postDate(post: BlogPost) {
  return post.published_at || (post.published ? post.created_at : null);
}
