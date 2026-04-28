import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { initScrollDefaults } from "@/lib/scroll-init";
import { ContactModalProvider } from "@/components/contact/ContactModalContext";
import { ContactModal } from "@/components/contact/ContactModal";
import { Navbar } from "@/components/sections/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Guilherme Aires — NOC Analyst · DevOps · Developer" },
      {
        name: "description",
        content:
          "Portfólio de Guilherme Aires — Analista NOC, DevOps e Desenvolvedor de Software em São Paulo. Infraestrutura sólida. Código que entrega.",
      },
      { property: "og:title", content: "Guilherme Aires — NOC · DevOps · Dev" },
      {
        property: "og:description",
        content: "Do monitoramento à produção. NOC, DevOps e desenvolvimento de software.",
      },
    ],
  }),
});

function Index() {
  useEffect(() => {
    initScrollDefaults();
  }, []);
  return (
    <ContactModalProvider>
      <main className="relative min-h-screen bg-background text-foreground">
        {/* Noise grain overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[60] noise"
          style={{ opacity: 0.04, mixBlendMode: "overlay" }}
        />
        <CustomCursor />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <TimelineSection />
        <ClosingSection />
        <Footer />
        <ContactModal />
      </main>
    </ContactModalProvider>
  );
}
