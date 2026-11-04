"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { HomeNav } from "./HomeNav";

const LegacyNavBar = dynamic(() => import("./LegacyNavBar"));

export function NavBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return pathname === "/" || pathname?.startsWith("/journal") ? (
    <HomeNav />
  ) : (
    <LegacyNavBar />
  );
}
