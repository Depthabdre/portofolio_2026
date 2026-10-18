import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight, FiLock } from "react-icons/fi";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in | Journal Studio" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="studio-login">
      <section className="studio-login-story">
        <div className="studio-brand !p-0">
          <div className="studio-brand-mark">a.</div>
          <div>
            <p>Journal Studio</p>
            <span>Abdrehim Misbah</span>
          </div>
        </div>
        <div>
          <p className="journal-eyebrow !mb-6 !text-[10px]">
            Your ideas, in motion
          </p>
          <h1>
            A little thought.
            <br />A little practice.
            <br />
            <span>Something worth sharing.</span>
          </h1>
          <p>
            A quiet space to write, follow your curiosity, and turn small
            commitments into meaningful progress.
          </p>
        </div>
        <Link href="/journal" className="studio-text-button">
          Explore the journal <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
      <section className="studio-login-form">
        <div>
          <div className="inline-grid h-11 w-11 place-items-center rounded-xl border border-[var(--j-border)] text-[var(--j-accent)]">
            <FiLock size={18} aria-hidden="true" />
          </div>
          <h2>Welcome back.</h2>
          <p>Your next article, challenge, or idea is waiting.</p>
          {error && (
            <div className="studio-notice" data-error="true" role="alert">
              {error}
            </div>
          )}
          <LoginForm configured={!!process.env.ADMIN_PASSWORD} />
          <div className="mt-8 border-t border-[var(--j-border)] pt-6">
            <Link href="/journal" className="studio-text-button">
              <FiArrowLeft aria-hidden="true" />
              Back to journal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
