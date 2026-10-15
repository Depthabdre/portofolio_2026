"use client";

import { BackLink, EmptyState } from "@/components/journal/JournalChrome";

export default function JournalError({ reset }: { reset: () => void }) {
  return (
    <main className="article-layout pb-32">
      <BackLink />
      <div className="mt-10">
        <EmptyState title="A brief interruption.">
          This page could not be loaded. Please try again in a moment.
        </EmptyState>
        <button className="journal-tag mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
