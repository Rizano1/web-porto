import ContactSection from "@/components/ContactSection";
import LiquidReveal from "@/components/LiquidReveal";
import ParallaxHero from "@/components/ParallaxHero";
import SkillsTree from "@/components/SkillsTree";
import Works from "@/components/Works";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <ParallaxHero>
        <section
          id="content-section"
          className="relative w-full min-h-screen bg-black z-10 flex flex-col"
        >
          <LiquidReveal
            topImage="/assets/bottom.png"
            bottomImage="/assets/top.png"
          />
          <Works />
          <SkillsTree />
          <ContactSection />
        </section>
      </ParallaxHero>
    </main>
  );
}
