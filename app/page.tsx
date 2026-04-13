import { CustomCursor } from "@/components/hero/CustomCursor";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { QuickStatsBento } from "@/components/stats/QuickStatsBento";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";

export default function Home() {
  return (
    <main className="page-shell cursor-shell relative isolate overflow-hidden"> 
      <CustomCursor />
      <HeroSection />
      <QuickStatsBento />
      <FeaturedProjects />
      <ExperienceTimeline />
    </main>
  );
}
