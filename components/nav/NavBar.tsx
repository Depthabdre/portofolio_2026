"use client";

import { usePathname } from "next/navigation";
import { HomeNav } from "./HomeNav";

export function NavBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <HomeNav />;
}
