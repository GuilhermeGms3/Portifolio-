import { createFileRoute } from "@tanstack/react-router";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { CustomCursor } from "@/components/CustomCursor";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Guilherme Aires — NOC Analyst | DevOps | Developer" },
      {
        name: "description",
        content:
          "Portfólio de Guilherme Aires — Analista NOC, DevOps e Desenvolvedor. Infraestrutura que não dorme. Código que não falha.",
      },
      { property: "og:title", content: "Guilherme Aires — NOC | DevOps | Dev" },
      {
        property: "og:description",
        content:
          "Monitoramento, automação e desenvolvimento full stack. Do terminal à produção.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <ScanlineOverlay />
      <CustomCursor />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
      <ContactSection />
      <ClosingSection />
      <Footer />
    </main>
  );
}
