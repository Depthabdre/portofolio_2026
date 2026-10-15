import type { ReactNode } from "react";
import "./journal.css";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return <div className="journal-theme flex-1">{children}</div>;
}
