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
/** On touch screens the preview sits behind the titles, dimmed so they stay readable. */
const TOUCH_PREVIEW_OPACITY = 0.55;

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
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

  // Mouse/trackpad: the preview follows the cursor and shows the hovered project.
  // Touch: it sits at the vertical middle of the screen and shows the project whose
  // row is closest to it, changing as you scroll.
  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    const list = listRef.current;
    if (!container || !preview || !list) return;

    if (!canHover()) {
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0, zIndex: 0 });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.4, ease: "power3" });
      const rows = Array.from(list.children) as HTMLElement[];
      let shown: number | null = null;

      const tick = () => {
        const rect = container.getBoundingClientRect();
        const middle = window.innerHeight / 2;
        gsap.set(preview, { x: rect.width / 2 });
        yTo(middle - rect.top);

        // Closest row to the middle of the screen, if one is actually there
        let closest: number | null = null;
        let best = Infinity;
        rows.forEach((row, i) => {
          const r = row.getBoundingClientRect();
          const distance = Math.abs(r.top + r.height / 2 - middle);
          if (distance < r.height && distance < best) {
            best = distance;
            closest = i;
          }
        });

        if (closest !== shown) {
          shown = closest;
          if (closest === null) setPreview((prev) => ({ ...prev, visible: false }));
          else setPreview({ index: closest, visible: true });
        }
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        gsap.killTweensOf(preview);
      };
    }

    gsap.set(preview, { yPercent: -50, scale: 0.6, autoAlpha: 0, zIndex: 20 });
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
    if (!el) return;
    const shownOpacity = canHover() ? 1 : TOUCH_PREVIEW_OPACITY;
    gsap.to(el, {
      scale: preview.visible ? 1 : 0.6,
      autoAlpha: preview.visible ? shownOpacity : 0,
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
        ref={listRef}
        className="relative z-10 flex flex-col w-full px-6 sm:px-8 md:px-16 lg:px-24 border-t border-cream/10 mt-8"
        onMouseLeave={() => setPreview((prev) => ({ ...prev, visible: false }))}
      >
        {PROJECTS.map((project, index) => (
          <Link
            key={project.slug}
            href={`/project/${project.slug}`}
            data-active={preview.visible && preview.index === index}
            onMouseEnter={() => canHover() && setPreview({ index, visible: true })}
            className="work-item-anim opacity-0 hover:scale-x-105 translate-y-8 transition-all duration-500 ease-out group block w-full py-5 md:py-10 border-b border-cream/10 hover:border-cream/30 hover:bg-white/[0.02]"
          >
            <div className="flex flex-row items-center justify-between gap-4 transition-transform duration-500 ease-out md:group-hover:translate-x-12">
              <div className="flex flex-col min-w-0">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-cream/80 group-hover:text-cream group-data-[active=true]:text-cream transition-colors duration-500">
                  {project.title}
                </h3>
                <p className="text-lg md:text-xl text-cream/50 group-hover:text-cream/80 group-data-[active=true]:text-cream/80 transition-colors duration-500 font-light">
                  {project.role}
                </p>
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

      {/* Floating preview: next to the cursor, or mid-screen on touch devices */}
      <div
        ref={previewRef}
        aria-hidden
        className="invisible absolute top-0 left-0 w-[80vw] max-w-[22rem] md:w-[22rem] md:max-w-none lg:w-[26rem] aspect-[16/10] pointer-events-none rounded-lg overflow-hidden border border-cream/15 shadow-[0_30px_80px_rgba(0,0,0,0.8)] will-change-transform"
      >
        {PROJECTS.map((project, index) => (
          <Image
            key={project.slug}
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 80vw"
            className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
              index === preview.index ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
