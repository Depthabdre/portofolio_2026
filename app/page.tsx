import { portfolioFont } from "./typography";
import { HeroSection } from "@/components/hero/HeroSection";
import { PortfolioMotion } from "@/components/hero/PortfolioMotion";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { AboutSection } from "@/components/about/AboutSection";
import { FooterSection } from "@/components/footer/FooterSection";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`portfolio-home ${portfolioFont.className}`}
    >
      <PortfolioMotion />
      <HeroSection />
      <FeaturedProjects />
      <ExperienceTimeline />
      <AboutSection />
      <FooterSection />
    </main>
  );
}
