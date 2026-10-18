import type { ReactNode } from "react";
import "../journal/journal.css";
import "./studio.css";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="journal-theme studio flex-1">{children}</div>;
}
