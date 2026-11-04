import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight, FiLock } from "react-icons/fi";
import { isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
        <div className="studio-login-brand-row">
          <Link href="/" className="studio-brand">
            <span className="studio-brand-mark" aria-hidden="true">
              am.
            </span>
            <span>
              <strong>Journal Studio</strong>
              <small>Abdrehim Misbah</small>
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div>
          <h1>
            Manage your
            <br />
            journal.
          </h1>
          <p>
            Write articles, follow your challenges, and share what you’re
            working on.
          </p>
        </div>
        <Link href="/journal" className="studio-text-button">
          View the journal <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
      <section className="studio-login-form" aria-labelledby="sign-in-title">
        <div>
          <div className="studio-login-icon">
            <FiLock size={20} aria-hidden="true" />
          </div>
          <h2 id="sign-in-title">Sign in</h2>
          <p>Use your admin password to open the studio.</p>
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
