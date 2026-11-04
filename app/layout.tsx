import type { Metadata } from "next";
import localFont from "next/font/local";
import { NavBar } from "@/components/nav/NavBar";
import "./globals.css";
import "./design-system.css";
import "./home.css";
import { portfolioFont } from "./typography";
import { portfolioThemeScript } from "@/lib/portfolio-theme";

const inter = localFont({
  src: "./fonts/inter.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const jetBrainsMono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Abdrehim | Frontend & Mobile Developer",
  description:
    "Abdrehim Misbah’s portfolio: websites and mobile apps built with React, Next.js, and Flutter, plus projects, experience, and a little about me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetBrainsMono.variable} ${portfolioFont.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: portfolioThemeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col relative font-sans"
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
