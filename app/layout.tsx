import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { NavBar } from "@/components/nav/NavBar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "abdrehim | software engineer",
  description:
    "portfolio of abdrehim: flutter-first engineer building secure, impactful software and mentoring future developers.",
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
      className={`${manrope.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col relative">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
