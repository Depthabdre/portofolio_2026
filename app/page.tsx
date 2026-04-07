import { CustomCursor } from "@/components/hero/CustomCursor";
import { HeroSection } from "@/components/hero/HeroSection";
import { QuickStatsBento } from "@/components/stats/QuickStatsBento";

export default function Home() {
  return (
    <main className="page-shell cursor-shell relative isolate overflow-hidden">
      <CustomCursor />
      <HeroSection />
      <QuickStatsBento />
    </main>
  );
}
