"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCheck, FaCopy } from "react-icons/fa6";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body max-w-none break-words text-[16px] leading-[1.9] text-[#bdc8d5]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-[28px] sm:text-[34px] font-bold text-white tracking-tight border-b border-white/10 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 mb-5 text-[22px] sm:text-[26px] font-semibold text-[#edf2f7] tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-4 text-[18px] sm:text-[20px] font-medium text-[#edf2f7] tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-6 text-[#bdc8d5] leading-[1.9] text-[16px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-white/80">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-white/80">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-[var(--hero-accent)] bg-white/[0.03] px-4 py-3 text-white/75 italic rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--hero-accent)] underline decoration-[var(--hero-accent)]/40 underline-offset-4 hover:decoration-[var(--hero-accent)] transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left text-sm text-white/80">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-white">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-t border-white/5">{children}</td>
          ),
          code: ({ children }) => (
            <code className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 font-mono text-[13px] text-[var(--j-accent)]">
              {children}
            </code>
          ),
          pre: ({ children }) => {
            const code = Children.toArray(children)[0];
            if (
              !isValidElement<{ className?: string; children?: ReactNode }>(
                code,
              )
            )
              return <pre>{children}</pre>;
            const language =
              /language-([^\s]+)/.exec(code.props.className || "")?.[1] || "";
            return (
              <CodeBlock language={language}>
                {String(code.props.children || "").replace(/\n$/, "")}
              </CodeBlock>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-white/12 bg-[#090e17] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-white/60">
        <span className="uppercase text-[var(--hero-accent)] font-semibold tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-1 text-[11px] text-white/70 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
          title="Copy code"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? (
            <>
              <FaCheck className="text-[var(--hero-contrast)]" />
              <span className="text-[var(--hero-contrast)] font-medium">
                Copied!
              </span>
            </>
          ) : (
            <>
              <FaCopy />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed font-mono text-white/90">
        <code>{children}</code>
      </pre>
    </div>
  );
}
