"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import { preloadContactFrames, TOTAL_FRAMES } from "@/lib/contactFrames";
import {
  CONTACT_PIN_SCROLL_PX,
  CONTENT_SCROLL_SPEED,
  CONTENT_TOP_CSS,
} from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layer configuration:
 * Layer 1 (back, slowest scroll parallax) — dark sky/nebula
 * Layer 2 — floating smoke/clouds
 * Layer 3 — ornate spheres
 * [RIZANO TEXT sits here, between layer 3 and layer 4]
 * Layer 4 — mountain terrain
 * Layer 5 (front, fastest scroll parallax) — ancient ruins
 *
 * scrollSpeed: how fast this layer moves when scrolling.
 *   0 = completely static, 1 = moves a full viewport height over the scroll range.
 *   Higher = faster movement (foreground feel).
 */

interface LayerConfig {
  src: string;
  zIndex: number;
  scrollSpeed: number;
  tiltFactor: number;
  /** Vertical position offset in percentage (0 = default, positive = down, negative = up) */
  verticalOffset: number;
  /** Scale factor for this layer (1 = original size, >1 = zoom in, <1 = zoom out) */
  scale: number;
  /**
   * On portrait screens, render the image this wide (% of viewport width) instead of
   * object-cover, so elements near the edges (spheres, clouds) aren't cropped away.
   */
  portraitWidth?: number;
}

const layers: LayerConfig[] = [
  {
    src: "/assets/layer_1.jpeg",
    zIndex: 10,
    scrollSpeed: 0,
    tiltFactor: 0,
    verticalOffset: 0,
    scale: 1,
  },
  {
    src: "/assets/layer_2.png",
    zIndex: 20,
    scrollSpeed: 0.08,
    tiltFactor: 0.3,
    verticalOffset: 0,
    scale: 1.01,
    portraitWidth: 170,
  },
  {
    src: "/assets/layer_3.png",
    zIndex: 30,
    scrollSpeed: 0.15,
    tiltFactor: 0.6,
    verticalOffset: 5,
    scale: 1,
    portraitWidth: 170,
  },
  {
    src: "/assets/layer_4.png",
    zIndex: 40,
    scrollSpeed: 0.3,
    tiltFactor: 0.8,
    verticalOffset: 40,
    scale: 1.05,
  },
  {
    src: "/assets/layer_5.png",
    zIndex: 50,
    scrollSpeed: 0.5,
    tiltFactor: 1.3,
    verticalOffset: 50,
    scale: 1.05,
  },
];

const RIZANO_SCROLL_SPEED = 0.2;
const RIZANO_TILT_FACTOR = 0;
/** Vertical offset for the RIZANO text layer (percentage) */
const RIZANO_VERTICAL_OFFSET = -15;

export default function ParallaxHero({
  children,
}: {
  children?: React.ReactNode;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure content height to ensure enough scroll room in the spacer
  useEffect(() => {
    if (!contentLayerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContentHeight(entries[0].contentRect.height);
    });
    observer.observe(contentLayerRef.current);
    return () => observer.disconnect();
  }, []);

  // For smooth mouse tracking
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Track scroll-driven Y offsets so we can combine with mouse offsets
  const scrollOffsets = useRef<number[]>(layers.map(() => 0));
  const textScrollOffset = useRef(0);
  const contentScrollOffset = useRef(0);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Preload all images (Parallax layers + ContactSection 180 video frames)
  useEffect(() => {
    let loadedCount = 0;
    const totalItems = layers.length + TOTAL_FRAMES;

    const incrementProgress = () => {
      loadedCount++;
      setProgress(Math.min(100, Math.floor((loadedCount / totalItems) * 100)));
    };

    const layerPromises = layers.map(
      (layer) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            incrementProgress();
            resolve();
          };
          img.src = layer.src;
        }),
    );

    const contactPromise = preloadContactFrames(incrementProgress);

    Promise.all([...layerPromises, contactPromise]).then(() => {
      setTimeout(() => setIsLoaded(true), 300);
    });
  }, []);

  // GSAP scroll parallax — no pin, wrapper is position:fixed
  // The spacer provides the scroll room, the parallax wrapper stays in view.
  // The black section (in page.tsx) scrolls OVER the fixed parallax.
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          // Calculate exactly how many pixels we've scrolled past the start
          const scrolledPx = self.scroll() - self.start;

          // Each layer moves upward continuously based on its speed multiplier
          layers.forEach((layer, i) => {
            scrollOffsets.current[i] = -scrolledPx * layer.scrollSpeed;
          });

          // RIZANO text
          textScrollOffset.current = -scrolledPx * RIZANO_SCROLL_SPEED;

          // Content layer (matches CONTENT_SCROLL_SPEED)
          contentScrollOffset.current = -scrolledPx * CONTENT_SCROLL_SPEED;
        },
      });
    }, spacerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Mouse hover tilt + positional parallax
  useEffect(() => {
    if (!isLoaded) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };

    const animate = () => {
      const lerp = 0.06;
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * lerp;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * lerp;

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      // Each layer: combine scroll offset + mouse offset + scale
      layers.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;

        const mouseOffsetX = -mx * layer.tiltFactor * 20;
        const mouseOffsetY = -my * layer.tiltFactor * 14;
        const scrollY = scrollOffsets.current[i];

        el.style.transform = `translate3d(${mouseOffsetX}px, ${scrollY + mouseOffsetY}px, 0) scale(${layer.scale})`;
      });

      // RIZANO text
      if (textLayerRef.current) {
        const mouseOffsetX = -mx * RIZANO_TILT_FACTOR * 20;
        const mouseOffsetY = -my * RIZANO_TILT_FACTOR * 14;
        const scrollY = textScrollOffset.current;

        textLayerRef.current.style.transform = `translate3d(${mouseOffsetX}px, ${scrollY + mouseOffsetY}px, 0)`;
      }

      // Content layer (scroll only, no tilt)
      if (contentLayerRef.current) {
        const scrollY = contentScrollOffset.current;
        contentLayerRef.current.style.transform = `translate3d(0px, ${scrollY}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isLoaded]);

  return (
    <>
      {/* Loading Screen */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center z-[9999] transition-all duration-800 ${
          isLoaded ? "opacity-0 invisible pointer-events-none" : ""
        }`}
      >
        <span className="font-chomsky text-3xl md:text-5xl text-cream tracking-[0.3em] animate-pulse mb-6">
          RIZANO
        </span>
        <div className="flex flex-col items-center gap-3 w-48">
          <div className="w-full h-[2px] bg-cream/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-cream transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono tracking-widest text-cream/60">
            {progress}%
          </span>
        </div>
      </div>

      {/* Fixed parallax background — stays in place while page scrolls over it */}
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden [perspective:1000px] cursor-default z-[1]"
        id="hero"
      >
        <div
          ref={sceneRef}
          className="relative w-full h-full [transform-style:preserve-3d] will-change-transform"
        >
          {layers.map((layer, index) => (
            <div
              key={index}
              ref={(el) => {
                layerRefs.current[index] = el;
              }}
              // Positioned on the shared 16:9 scene so layers stay aligned at any aspect ratio
              className="absolute left-0 w-full will-change-transform pointer-events-none"
              style={{
                zIndex: layer.zIndex,
                top: `calc(var(--scene-top) + var(--scene-h) * ${layer.verticalOffset / 100})`,
                height: "var(--scene-h)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={layer.src}
                alt=""
                draggable={false}
                className={`w-full h-full object-cover object-top block ${
                  layer.portraitWidth
                    ? "portrait:absolute portrait:top-0 portrait:left-1/2 portrait:-translate-x-1/2 portrait:max-w-none portrait:w-[var(--portrait-width)] portrait:h-auto"
                    : ""
                }`}
                style={
                  layer.portraitWidth
                    ? ({ "--portrait-width": `${layer.portraitWidth}%` } as React.CSSProperties)
                    : undefined
                }
              />
            </div>
          ))}

          {/* RIZANO Text — between layer 3 (z30) and layer 4 (z40) */}
          <div
            ref={textLayerRef}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-[35] pointer-events-none will-change-transform"
            style={{ top: `${RIZANO_VERTICAL_OFFSET}%` }}
          >
            <h1 className="font-chomsky text-[clamp(4rem,12vw,12rem)] text-cream tracking-[0.05em] select-none relative [text-shadow:0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.9),0_0_120px_rgba(232,220,200,0.08)] after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-[80%] after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-cream/40 after:to-transparent">
              RIZANO
            </h1>
          </div>

          {/* Content Section Layer — sits between layer 4 (z40) and layer 5 (z50) */}
          {children && (
            <div
              ref={contentLayerRef}
              className="absolute bg-black left-0 w-full will-change-transform z-[45]"
              style={{ top: CONTENT_TOP_CSS }}
            >
              {children}
            </div>
          )}

          {/* Bottom gradient to black */}
          <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent to-black z-[60] pointer-events-none" />
        </div>
      </div>

      {/* Scroll spacer — provides the scroll distance for the parallax effect.
          We subtract 100vh so scrolling ends when content bottom reaches viewport bottom,
          and add (CONTACT_PIN_SCROLL_PX * 0.5) to account for the pinned contact section.
          Formula: (contentTop - 100vh + contentHeight + pinDistance) / CONTENT_SCROLL_SPEED */}
      <div
        ref={spacerRef}
        className="relative w-full z-0"
        style={{
          height: `calc((${CONTENT_TOP_CSS} - 100vh + ${
            contentHeight > 0 ? contentHeight + CONTACT_PIN_SCROLL_PX * 0.5 : 0
          }px) / ${CONTENT_SCROLL_SPEED})`,
        }}
      />
    </>
  );
}
