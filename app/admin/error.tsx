"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-2xl font-medium tracking-tight">
        The workspace couldn’t load.
      </h1>
      <p className="my-6 text-sm leading-7 text-[var(--j-muted)]">
        Your saved content is still there. Please try loading the workspace
        again.
      </p>
      <button onClick={reset} className="studio-button studio-button-primary">
        Try again
      </button>
    </main>
  );
}
