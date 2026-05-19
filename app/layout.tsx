import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { NavBar } from "@/components/nav/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdrehim | Software Engineer",
  description:
    "Portfolio of Abdrehim: Software engineer building secure, impactful mobile and web applications.",
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
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col relative font-sans">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
