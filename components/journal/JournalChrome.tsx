import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft, FiArrowUpRight, FiBookOpen } from "react-icons/fi";

export function JournalFooter() {
  return (
    <footer className="journal-wrap journal-footer">
      <span>© {new Date().getFullYear()} Abdrehim Misbah</span>
      <Link href="/" className="inline-flex items-center gap-2">
        Back to portfolio <FiArrowUpRight aria-hidden="true" />
      </Link>
    </footer>
  );
}

export function BackLink({
  href = "/journal",
  children = "Back to journal",
}: {
  href?: string;
  children?: ReactNode;
}) {
  return (
    <Link className="journal-back" href={href}>
      <FiArrowLeft aria-hidden="true" />
      {children}
    </Link>
  );
}

export function EmptyState({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="journal-empty">
      <div className="journal-empty-icon" aria-hidden="true">
        {icon || <FiBookOpen size={20} />}
      </div>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="journal-badge" data-status={status}>
      {status}
    </span>
  );
}
