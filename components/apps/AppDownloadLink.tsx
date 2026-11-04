"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

export function AppDownloadLink({ href, name, platform, children }: {
  href: string;
  name: string;
  platform: string;
  children: ReactNode;
}) {
  const external = href.startsWith("https://");
  return (
    <a
      className="home-button apps-download"
      href={href}
      download={external ? undefined : true}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => {
        try {
          track("App Download", { appName: name, platform });
        } catch {
          // Downloads remain available when analytics is unavailable.
        }
      }}
    >
      {children}
      <span aria-hidden="true">{external ? "↗" : "↓"}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
