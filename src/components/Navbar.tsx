"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("content-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        // Show navbar when the top of the content section reaches the top of the viewport
        if (rect.top <= 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    const tickerHandler = () => {
      handleScroll();
    };
    gsap.ticker.add(tickerHandler);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.ticker.remove(tickerHandler);
    };
  }, []);

  useEffect(() => {
    // Initialize GSAP timeline
    tl.current = gsap.timeline({ paused: true });

    tl.current
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
      if (tl.current) {
        tl.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isVisible) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isVisible]);

  const navLinks = ["About", "Works", "Contact"];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 pt-8 pb-4 text-[#e8dcc8]">
      <div className="relative flex justify-between items-end pb-4">
        {/* The thin line that appears from the left */}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-[#e8dcc8]/40 origin-left scale-x-0"
        />

        {/* Left Logo */}
        <div className="overflow-hidden">
          <div
            ref={logoRef}
            className="text-2xl tracking-widest font-chomsky uppercase translate-y-[100%]"
          >
            Rizano
          </div>
        </div>

        {/* Right Links */}
        <div className="flex gap-8 text-sm md:text-base font-light tracking-wide uppercase">
          {navLinks.map((link, idx) => (
            <div key={link} className="overflow-hidden">
              <a
                href={`#${link.toLowerCase()}`}
                ref={(el) => {
                  linksRef.current[idx] = el;
                }}
                className="inline-block translate-y-[100%] hover:opacity-70 transition-opacity"
              >
                {link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
