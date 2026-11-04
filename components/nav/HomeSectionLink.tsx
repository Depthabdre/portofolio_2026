"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { queueHomeAnchor } from "@/lib/home-anchor-navigation";
import { scrollToSection } from "@/lib/scroll-to-section";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

export function HomeSectionLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey ||
          props.target === "_blank" || props.download
        ) return;
        let id: string;
        try {
          id = decodeURIComponent(href.slice(href.indexOf("#") + 1));
        } catch {
          return;
        }
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        if (window.location.hash !== `#${encodeURIComponent(id)}`) {
          window.history.pushState(null, "", `/#${encodeURIComponent(id)}`);
        }
        scrollToSection(target);
      }}
    />
  );

  return (
    <Link
      {...props}
      onClick={onClick}
      href={href.startsWith("#") ? `/${href}` : href}
      scroll={false}
      onNavigate={(event) => {
        event.preventDefault();
        queueHomeAnchor(href);
        // Mount the destination first; its header applies the fragment and scroll.
        // Passing a hash through a restored Next.js route can duplicate it.
        router.push("/", { scroll: false });
      }}
    />
  );
}
