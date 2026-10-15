import { FiArrowUpRight } from "react-icons/fi";
import { formatDate } from "@/lib/journal";
import type { NowStatus } from "@/lib/types/journal";

export function NowStatusCard({ status }: { status: NowStatus }) {
  return (
    <aside className="journal-focus">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="journal-eyebrow">Currently building</p>
        <time
          dateTime={status.updated_at}
          className="text-xs text-[var(--j-muted)]"
        >
          Updated {formatDate(status.updated_at)}
        </time>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="!mt-0">{status.active_project}</h2>
        <span className="journal-badge">{status.status_label}</span>
      </div>
      <p>{status.description}</p>
      <p className="!text-xs">
        Current milestone <span className="px-2 text-white/20">/</span>{" "}
        <span className="text-white/80">{status.current_milestone}</span>
      </p>
      {status.project_url && (
        <a
          href={status.project_url}
          target="_blank"
          rel="noreferrer"
          className="article-read mt-5"
        >
          Explore project <FiArrowUpRight aria-hidden="true" />
        </a>
      )}
    </aside>
  );
}
