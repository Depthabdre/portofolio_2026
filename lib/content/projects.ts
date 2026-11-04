export const projects = {
  aplus: {
    name: "A+ Tutorial Class",
    platform: "Android · Education",
    summary: "A classroom that goes where the connection doesn't.",
    description:
      "An offline-first learning app I built for a tutorial agency. Students can download course materials, keep learning without internet, and access their courses in one place.",
    stack: "Flutter / BLoC / Clean Architecture",
    images: [
      {
        src: "/APlus/Screenshot_20260413-170625.jpg",
        width: 1080,
        height: 2371,
        alt: "A+ course library with university subjects",
        label: "Course library",
      },
      {
        src: "/APlus/Screenshot_20260413-170650.jpg",
        width: 1080,
        height: 2374,
        alt: "A+ offline library with a downloaded philosophy lesson",
        label: "Saved for offline learning",
      },
    ],
    links: [
      {
        label: "View on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.aplus.depthabdre.tutorial",
      },
      {
        label: "Visit download site",
        href: "https://a-plus-download-platform.vercel.app",
      },
    ],
    decision:
      "Course access needed to work offline while protecting subscription content. I implemented downloadable materials and single-device access controls, including screenshot prevention and checks against device-time manipulation.",
  },
  english: {
    name: "Real English",
    platform: "Mobile · Language learning",
    summary: "A little reading. A daily habit.",
    description:
      "An app that turns English practice into a feed of stories. I built the Flutter app and AI-powered backend, with a virtual garden that grows alongside the reader's daily habit.",
    stack: "Flutter / Node.js / Express / Gemini API",
    images: [
      {
        src: "/RealEnglish/photo_2026-01-01_10-27-15.jpg",
        width: 601,
        height: 1280,
        alt: "Real English story reader with an illustration, text and playback controls",
        label: "The story reader",
      },
      {
        src: "/RealEnglish/photo_2026-01-01_10-27-09.jpg",
        width: 596,
        height: 1280,
        alt: "Real English completion screen showing a mastered story and earned experience",
        label: "Progress after a story",
      },
    ],
    links: [
      {
        label: "App source",
        href: "https://github.com/Depthabdre/real_english",
      },
      {
        label: "Backend source",
        href: "https://github.com/Depthabdre/RealEnglish",
      },
    ],
    decision:
      "I connected AI-generated stories to a scrollable reading experience and a daily progress system. The backend uses a modular monolith, keeping related features together within one application.",
  },
  focus: {
    name: "Student Focus",
    platform: "Web · Productivity",
    summary: "Make room for uninterrupted work.",
    description:
      "A study tool with focus sessions, custom breaks, and a dashboard for tracking consistency. I built the app around a simple loop: choose a session, focus, and see your progress.",
    stack: "Next.js / PostgreSQL / Drizzle / Better Auth",
    images: [
      {
        src: "/FocusModeweb/Screenshot 2026-04-29 at 6.12.06 in the evening.png",
        width: 2911,
        height: 1621,
        alt: "Student Focus deep mode with a session timer and study consistency calendar",
        label: "Focus session and study history",
      },
    ],
    links: [
      { label: "Open app", href: "https://focus-mode-xi.vercel.app/login" },
      {
        label: "Source code",
        href: "https://github.com/Depthabdre/fullfocusmode",
      },
    ],
    decision:
      "The focus timer supports custom breaks and a stricter distraction-blocking mode. Session history is presented visually so students can review their study habits over time.",
  },
};

export type PortfolioProject = (typeof projects)[keyof typeof projects];
