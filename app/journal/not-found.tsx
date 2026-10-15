import { BackLink, EmptyState } from "@/components/journal/JournalChrome";

export default function JournalNotFound() {
  return (
    <main className="article-layout pb-32">
      <BackLink />
      <div className="mt-10">
        <EmptyState title="This page isn’t here.">
          It may have moved, or it hasn’t been published yet.
        </EmptyState>
      </div>
    </main>
  );
}
