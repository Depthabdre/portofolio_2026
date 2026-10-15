import type { Metadata } from "next";
import { FiArrowUpRight } from "react-icons/fi";
import { JournalTabsView } from "@/components/journal/JournalTabsView";
import { JournalFooter } from "@/components/journal/JournalChrome";
import { getJournalData } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Journal | Abdrehim Misbah",
  description:
    "Notes on software, lessons from building, and learning one session at a time.",
};

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const [data, params] = await Promise.all([getJournalData(), searchParams]);
  const view = params.view === "challenges" ? "challenges" : "articles";
  return (
    <>
      <main className="journal-wrap">
        <header className="journal-header">
          <div className="flex items-center justify-between gap-6">
            <p className="journal-eyebrow">The journal</p>
            <span className="hidden items-center gap-2 text-xs text-[var(--j-muted)] sm:inline-flex">
              Learning in public <FiArrowUpRight aria-hidden="true" />
            </span>
          </div>
          <h1 className="journal-title">
            Ideas into practice.
            <br />
            <span>One entry at a time.</span>
          </h1>
          <p className="journal-intro">
            Notes from building software, working through hard problems, and
            showing up for the things I want to learn.
          </p>
        </header>
        <JournalTabsView key={view} initialTab={view} {...data} />
      </main>
      <JournalFooter />
    </>
  );
}
