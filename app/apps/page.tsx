import type { Metadata } from "next";
import Image from "next/image";
import { FiGlobe, FiMonitor, FiSmartphone } from "react-icons/fi";
import { AppDownloadLink } from "@/components/apps/AppDownloadLink";
import { HomeSectionLink } from "@/components/nav/HomeSectionLink";
import { appsList } from "@/lib/content/apps";
import "./apps.css";

export const metadata: Metadata = {
  title: "Apps & tools | Abdrehim Misbah",
  description: "Android, Mac, and web apps built by Abdrehim Misbah. Find an app, try it, or download it for your device.",
};

const platforms = {
  android: { label: "Android", icon: FiSmartphone },
  macos: { label: "macOS", icon: FiMonitor },
  web: { label: "Web app", icon: FiGlobe },
};

export default function AppsPage() {
  return (
    <div className="apps-page">
      <main id="main-content" tabIndex={-1} className="apps-main home-container">
        <header className="apps-heading">
          <h1>Apps & tools</h1>
          <p>Things I’ve built for learning, focusing, and making everyday tasks a little easier. Find one for your device below.</p>
        </header>
        <section aria-labelledby="apps-list-title">
          <div className="apps-list-heading">
            <h2 id="apps-list-title">Find an app</h2>
            <span>Android, Mac & web</span>
          </div>
          <div className="apps-grid">
            {appsList.map((app) => {
              const platform = platforms[app.platformKey];
              const PlatformIcon = platform.icon;
              return (
                <article className="apps-card" key={app.id}>
                  <div className="apps-card-top">
                    <Image className="apps-icon" src={app.localIconUrl} alt="" width={56} height={56} sizes="56px" />
                    <span className="apps-platform"><PlatformIcon size={15} aria-hidden="true" />{platform.label}</span>
                  </div>
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                  <AppDownloadLink href={app.ctaUrl} name={app.name} platform={app.platformKey}>
                    {app.ctaText}
                  </AppDownloadLink>
                </article>
              );
            })}
          </div>
        </section>
        <aside className="apps-help">
          <div><h2>Have a question about an app?</h2><p>I’d be happy to hear your feedback or help you get started.</p></div>
          <HomeSectionLink href="/#contact" className="home-text-link">Get in touch <span aria-hidden="true">↗</span></HomeSectionLink>
        </aside>
      </main>
      <footer className="apps-footer home-container">
        <span>© {new Date().getFullYear()} Abdrehim Misbah</span>
        <HomeSectionLink href="/#projects" className="home-text-link">See the work behind the apps <span aria-hidden="true">↗</span></HomeSectionLink>
      </footer>
    </div>
  );
}
