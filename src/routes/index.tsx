import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { initScrollDefaults } from "@/lib/scroll-init";
import { ContactModalProvider } from "@/components/contact/ContactModalContext";
import { ContactModal } from "@/components/contact/ContactModal";
import { Navbar } from "@/components/sections/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProblemsSection } from "@/components/sections/ProblemsSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Guilherme Aires — Estúdio Digital · Sites, Sistemas e Automações" },
      {
        name: "description",
        content:
          "Desenvolvo landing pages, sites institucionais, sistemas internos, dashboards e automações sob medida para empresas, profissionais autônomos e projetos digitais.",
      },
      { property: "og:title", content: "Guilherme Aires — Estúdio Digital" },
      {
        property: "og:description",
        content: "Sites, sistemas e automações para negócios que querem sair do improviso.",
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
        <div
          className="pointer-events-none fixed inset-0 z-[60] noise"
          style={{ opacity: 0.035, mixBlendMode: "overlay" }}
        />
        <CustomCursor />
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <ProblemsSection />
        <SolutionsSection />
        <ProcessSection />
        <SkillsSection />
        <ClosingSection />
        <Footer />
        <ContactModal />
      </main>
    </ContactModalProvider>
  );
}
