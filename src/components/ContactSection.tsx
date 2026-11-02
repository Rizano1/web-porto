"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { SOCIAL_LINKS } from "@/data/socials";
import { preloadContactFrames, TOTAL_FRAMES } from "@/lib/contactFrames";
import {
  CONTACT_PIN_SCROLL_PX,
  CONTENT_SCROLL_SPEED,
  contentOffsetToScrollY,
} from "@/lib/scroll";

/** Draws `img` onto `canvas` with object-fit: cover semantics. */
function drawCover(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width: canvasW, height: canvasH } = canvas;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;

  let drawW: number, drawH: number;
  if (canvasRatio > imgRatio) {
    drawW = canvasW;
    drawH = canvasW / imgRatio;
  } else {
    drawH = canvasH;
    drawW = canvasH * imgRatio;
  }

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, (canvasW - drawW) / 2, (canvasH - drawH) / 2, drawW, drawH);
}

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    const canvas = canvasRef.current;
    if (!container || !inner || !canvas) return;

    let images: HTMLImageElement[] = [];
    let currentFrame = 0;
    let isActive = true;

    const drawFrame = (index: number) => {
      const img = images[index];
      if (img) drawCover(canvas, img);
    };

    const setFrame = (index: number) => {
      if (index === currentFrame) return;
      currentFrame = index;
      drawFrame(index);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrame);
    };

    // Pin the section inside ParallaxHero's content layer and scrub the frames
    const updatePin = () => {
      const scrollDelta = window.scrollY - contentOffsetToScrollY(container.offsetTop);
      const pinnedPx = Math.min(Math.max(scrollDelta, 0), CONTACT_PIN_SCROLL_PX);

      inner.style.transform = `translate3d(0, ${pinnedPx * CONTENT_SCROLL_SPEED}px, 0)`;

      const progress = pinnedPx / CONTACT_PIN_SCROLL_PX;
      setFrame(Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    preloadContactFrames().then((loaded) => {
      if (!isActive) return;
      images = loaded;
      drawFrame(currentFrame);
      gsap.ticker.add(updatePin);
    });

    return () => {
      isActive = false;
      window.removeEventListener("resize", resizeCanvas);
      gsap.ticker.remove(updatePin);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="contact-section"
      className="relative w-full h-screen bg-black"
    >
      <div
        ref={innerRef}
        className="relative w-full h-full overflow-hidden will-change-transform"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-chomsky tracking-widest text-cream/90 drop-shadow-lg mb-4">
            LET&apos;S TOUCH
          </h2>
          <p className="text-lg md:text-xl text-cream/50 font-light tracking-wide max-w-xl mb-12">
            Have a project in mind? Let&apos;s create something extraordinary together.
          </p>

          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full border border-cream/20 bg-white/5 text-cream/70 hover:text-cream hover:bg-white/10 hover:border-cream/40 hover:scale-110 transition-all duration-300"
                aria-label={link.name}
              >
                {link.icon}
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-cream/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-light tracking-wider">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
