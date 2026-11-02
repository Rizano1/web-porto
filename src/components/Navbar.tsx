"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { NAV_ITEMS } from "@/data/site";
import { contentOffsetToScrollY } from "@/lib/scroll";

/** Show the navbar once the content section is this close (px) to the top of the viewport. */
const REVEAL_THRESHOLD_PX = 200;

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Lenis drives scrolling through the GSAP ticker, so poll there instead of on "scroll"
  useEffect(() => {
    const checkVisibility = () => {
      const section = document.getElementById("content-section");
      if (!section) return;
      setIsVisible(section.getBoundingClientRect().top <= REVEAL_THRESHOLD_PX);
    };

    gsap.ticker.add(checkVisibility);
    return () => gsap.ticker.remove(checkVisibility);
  }, []);

  useEffect(() => {
    tl.current = gsap
      .timeline({ paused: true })
      .to(lineRef.current, {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(
        [logoRef.current, ...linksRef.current],
        {
          y: "0%",
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.4",
      );

    return () => {
      tl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (isVisible) tl.current?.play();
    else tl.current?.reverse();
  }, [isVisible]);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    window.scrollTo({
      top: contentOffsetToScrollY(targetEl.offsetTop),
      behavior: "smooth",
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-5 sm:px-8 md:px-16 pt-6 md:pt-8 pb-4 text-cream">
      <div className="relative flex justify-between items-end pb-4">
        {/* Thin line that grows in from the left */}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-cream/40 origin-left scale-x-0"
        />

        <div className="overflow-hidden">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            ref={logoRef}
            className="block text-xl md:text-2xl tracking-widest font-chomsky uppercase translate-y-[100%] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Rizano
          </a>
        </div>

        <div className="flex gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-base font-light tracking-wide uppercase">
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.id} className="overflow-hidden">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                ref={(el) => {
                  linksRef.current[idx] = el;
                }}
                className="inline-block translate-y-[100%] hover:opacity-70 transition-opacity cursor-pointer"
              >
                {item.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
