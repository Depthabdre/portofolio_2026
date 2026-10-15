import Link from "next/link";
import {
  FiArrowUpRight,
  FiCalendar,
  FiChevronDown,
  FiTarget,
} from "react-icons/fi";
import {
  cadenceLabel,
  dateRangeDays,
  formatDate,
  trackFrequency,
  trackProgress,
} from "@/lib/journal";
import type { Challenge, ChallengeTrack } from "@/lib/types/journal";
import { EmptyState, StatusBadge } from "./JournalChrome";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function TrackCard({
  track,
  challenges,
}: {
  track: ChallengeTrack;
  challenges: Challenge[];
}) {
  const progress = trackProgress(track, challenges);
  return (
    <Link className="challenge-card" href={`/journal/challenges/${track.slug}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--j-accent)]">{track.category}</span>
        <StatusBadge status={track.status} />
      </div>
      <div>
        <h2>{track.title}</h2>
        <p className="mt-3 line-clamp-3">{track.description}</p>
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--j-muted)]">
          <span className="inline-flex items-center gap-2">
            <FiCalendar aria-hidden="true" />
            {cadenceLabel(track)}
          </span>
          {track.end_date && <span>Until {formatDate(track.end_date)}</span>}
        </div>
        <div
          className="challenge-progress"
          role="progressbar"
          aria-label={`${track.title} progress`}
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress.percent}%` }} />
        </div>
        <div className="challenge-metrics">
          <span>
            {progress.completed} / {track.target_count} days
          </span>
          <span className="inline-flex items-center gap-2">
            View challenge <FiArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ChallengeTimeline({
  challenges,
  tracks = [],
}: {
  challenges: Challenge[];
  tracks?: ChallengeTrack[];
}) {
  if (!tracks.length)
    return (
      <EmptyState
        title="A little consistency goes a long way."
        icon={<FiTarget size={20} />}
      >
        Learning challenges and the progress along the way will live here.
      </EmptyState>
    );
  return (
    <div className="challenge-grid">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} challenges={challenges} />
      ))}
    </div>
  );
}

export function ChallengeEntries({
  entries,
  track,
}: {
  entries: Challenge[];
  track: ChallengeTrack;
}) {
  if (!entries.length)
    return (
      <EmptyState title="The starting line." icon={<FiTarget size={20} />}>
        The first check-in will appear here when this challenge gets underway.
      </EmptyState>
    );
  return (
    <div className="journal-timeline">
      {entries.map((entry) => (
        <details className="journal-entry" key={entry.id}>
          <summary>
            <div className="flex items-center justify-between gap-3">
              <div className="article-card-meta">
                <span>
                  {trackFrequency(track) === 7 && track.start_date
                    ? `Day ${dateRangeDays(track.start_date, entry.completed_date)}`
                    : `Session ${entry.day_number}`}
                </span>
                <span>/</span>
                <time dateTime={entry.completed_date}>
                  {formatDate(entry.completed_date)}
                </time>
              </div>
              <FiChevronDown
                className="text-[var(--j-muted)]"
                aria-hidden="true"
              />
            </div>
            <h3>{entry.title}</h3>
            {entry.summary && <p>{entry.summary}</p>}
          </summary>
          {(entry.learnings ||
            entry.code_snippet ||
            entry.tags?.length > 0) && (
            <div className="journal-entry-content">
              {entry.learnings && (
                <MarkdownRenderer content={entry.learnings} />
              )}
              {entry.code_snippet && (
                <MarkdownRenderer
                  content={`\`\`\`\n${entry.code_snippet}\n\`\`\``}
                />
              )}
              {!!entry.tags?.length && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="journal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
