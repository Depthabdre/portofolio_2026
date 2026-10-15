import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiCalendar, FiTarget } from "react-icons/fi";
import {
  BackLink,
  JournalFooter,
  StatusBadge,
} from "@/components/journal/JournalChrome";
import { ChallengeEntries } from "@/components/journal/ChallengeTimeline";
import { BlogCard } from "@/components/journal/BlogCard";
import { getJournalData } from "@/lib/supabase/queries";
import {
  cadenceLabel,
  formatDate,
  trackFrequency,
  trackProgress,
} from "@/lib/journal";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const track = (await getJournalData()).tracks.find(
    (item) => item.slug === slug,
  );
  return {
    title: `${track?.title || "Challenge not found"} | Abdrehim Misbah`,
    description: track?.description,
  };
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params;
  const data = await getJournalData();
  if (data.error) throw new Error(data.error);
  const track = data.tracks.find((item) => item.slug === slug);
  if (!track) notFound();
  const entries = data.challenges.filter((item) => item.track_slug === slug);
  const posts = data.posts.filter((item) => item.track_slug === slug);
  const progress = trackProgress(track, entries);
  return (
    <>
      <main className="article-layout pb-20">
        <BackLink href="/journal?view=challenges">All challenges</BackLink>
        <header className="article-heading">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--j-accent)]">
              {track.category}
            </span>
            <StatusBadge status={track.status} />
          </div>
          <h1>{track.title}</h1>
          <p>{track.description}</p>
        </header>
        <section
          className="challenge-card !gap-6"
          aria-label="Challenge progress"
        >
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--j-muted)]">
            <span className="inline-flex items-center gap-2">
              <FiCalendar aria-hidden="true" />
              {cadenceLabel(track)}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiTarget aria-hidden="true" />
              {track.target_count} day goal
            </span>
          </div>
          {track.start_date && track.end_date && (
            <p>
              {formatDate(track.start_date)} — {formatDate(track.end_date)}{" "}
              <span className="text-white/25">
                · {track.timezone || "Africa/Addis_Ababa"}
              </span>
            </p>
          )}
          {!!track.preferred_days?.length && (
            <p>
              Preferred days:{" "}
              {track.preferred_days
                .map(
                  (day) =>
                    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
                )
                .join(", ")}
            </p>
          )}
          <div
            className="challenge-progress"
            role="progressbar"
            aria-label="Overall progress"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress.percent}%` }} />
          </div>
          <div className="challenge-metrics">
            <span>
              {progress.completed} / {track.target_count} days completed
            </span>
            <span>{progress.percent}%</span>
          </div>
          {track.status === "active" && (
            <div className="border-t border-[var(--j-border)] pt-5 text-sm">
              <span className="text-[var(--j-accent)]">
                {progress.weekly} / {trackFrequency(track)}
              </span>
              <span className="text-[var(--j-muted)]"> days this week</span>
            </div>
          )}
        </section>
        <section className="mt-14">
          <div className="mb-8 flex items-center justify-between border-b border-[var(--j-border)] pb-5">
            <h2 className="text-xl font-medium tracking-tight">
              The progress log
            </h2>
            <span className="text-xs text-[var(--j-muted)]">
              {entries.length} check-ins
            </span>
          </div>
          <ChallengeEntries track={track} entries={entries} />
        </section>
        {posts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-medium tracking-tight">
              Writing along the way
            </h2>
            <div className="article-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>
      <JournalFooter />
    </>
  );
}
