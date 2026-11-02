"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PROJECTS } from "@/data/projects";

/** Gap (px) between the cursor and the left edge of the hover preview. */
const PREVIEW_OFFSET_X = 40;
/** Max tilt (deg) of the preview while the cursor moves sideways. */
const MAX_TILT_DEG = 10;

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // `index` is kept while hidden so the image doesn't vanish during the fade-out
  const [preview, setPreview] = useState({ index: 0, visible: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-8");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    container
      .querySelectorAll(".work-item-anim")
      .forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Hover preview follows the cursor (mouse/trackpad only)
  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;
    if (!canHover()) return;

    gsap.set(preview, { yPercent: -50, scale: 0.6, autoAlpha: 0 });
    const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
    const rotateTo = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });

    const pointer = { x: 0, y: 0 };
    let lastX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    // The section lives inside ParallaxHero's transformed layer and moves while
    // scrolling, so recompute the position against it every frame
    const tick = () => {
      const rect = container.getBoundingClientRect();
      xTo(pointer.x - rect.left + PREVIEW_OFFSET_X);
      yTo(pointer.y - rect.top);
      const velocity = pointer.x - lastX;
      lastX = pointer.x;
      rotateTo(gsap.utils.clamp(-MAX_TILT_DEG, MAX_TILT_DEG, velocity * 0.4));
    };

    window.addEventListener("pointermove", handlePointerMove);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.ticker.remove(tick);
      gsap.killTweensOf(preview);
    };
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !canHover()) return;
    gsap.to(el, {
      scale: preview.visible ? 1 : 0.6,
      autoAlpha: preview.visible ? 1 : 0,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [preview.visible]);

  return (
    <section
      ref={containerRef}
      id="works-section"
      className="relative w-full bg-black text-cream py-24 z-10 min-h-[130vh]"
    >
      <div className="w-full px-6 sm:px-8 md:px-16 lg:px-24 mb-16">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-chomsky tracking-widest text-cream/90 drop-shadow-md">
          SELECTED WORKS
        </h2>
      </div>

      <div
        className="flex flex-col w-full px-6 sm:px-8 md:px-16 lg:px-24 border-t border-cream/10 mt-8"
        onMouseLeave={() => setPreview((prev) => ({ ...prev, visible: false }))}
      >
        {PROJECTS.map((project, index) => (
          <Link
            key={project.slug}
            href={`/project/${project.slug}`}
            onMouseEnter={() => setPreview({ index, visible: true })}
            className="work-item-anim opacity-0 hover:scale-x-105 translate-y-8 transition-all duration-500 ease-out group block w-full py-5 md:py-10 border-b border-cream/10 hover:border-cream/30 hover:bg-white/[0.02]"
          >
            <div className="flex flex-row items-center justify-between gap-4 transition-transform duration-500 ease-out md:group-hover:translate-x-12">
              <div className="flex flex-col min-w-0">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-cream/80 group-hover:text-cream transition-colors duration-500">
                  {project.title}
                </h3>
                <p className="text-lg md:text-xl text-cream/50 group-hover:text-cream/80 transition-colors duration-500 font-light">
                  {project.role}
                </p>
              </div>

              {/* Touch screens have no hover, so show a small thumbnail instead */}
              <div className="md:hidden relative w-24 shrink-0 aspect-video rounded-md overflow-hidden border border-cream/10">
                <Image src={project.image} alt="" fill sizes="96px" className="object-cover opacity-80" />
              </div>

              <div className="hidden md:flex opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <span className="text-cream/70 text-lg border border-cream/20 px-6 py-2 rounded-full">
                  View Project
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating preview that pops in next to the cursor */}
      <div
        ref={previewRef}
        aria-hidden
        className="invisible hidden md:block absolute top-0 left-0 z-20 w-[22rem] lg:w-[26rem] aspect-[16/10] pointer-events-none rounded-lg overflow-hidden border border-cream/15 shadow-[0_30px_80px_rgba(0,0,0,0.8)] will-change-transform"
      >
        {PROJECTS.map((project, index) => (
          <Image
            key={project.slug}
            src={project.image}
            alt=""
            fill
            sizes="26rem"
            className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
              index === preview.index ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
