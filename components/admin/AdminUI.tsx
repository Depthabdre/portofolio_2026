import type { ReactNode } from "react";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";

export function Field({
  label,
  name,
  hint,
  children,
  className = "",
}: {
  label: string;
  name: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`studio-field ${className}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && <p>{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`studio-panel ${className}`}>
      {title && <h3 className="studio-panel-title">{title}</h3>}
      {children}
    </section>
  );
}

export function EditorHeader({
  eyebrow,
  title,
  onBack,
  children,
}: {
  eyebrow: string;
  title: string;
  onBack: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="studio-editor-header">
      <div>
        <button
          className="studio-text-button mb-5"
          type="button"
          onClick={onBack}
        >
          <FiArrowLeft aria-hidden="true" />
          Back to {eyebrow}
        </button>
        <h1>{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function PublicLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className="studio-text-button"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <FiArrowUpRight aria-hidden="true" />
    </a>
  );
}
