"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

export const TOTAL_FRAMES = 180;
const FRAME_PATH = "/assets/play-on-scroll/frame_";

const framePaths = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const num = String(i + 1).padStart(4, "0");
  return `${FRAME_PATH}${num}.png`;
});

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:hello@example.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

// Module-level cache for preloaded images
let cachedImages: HTMLImageElement[] | null = null;
let preloadPromise: Promise<HTMLImageElement[]> | null = null;

export function preloadContactFrames(onItemLoaded?: () => void): Promise<HTMLImageElement[]> {
  if (cachedImages) return Promise.resolve(cachedImages);
  if (preloadPromise) return preloadPromise;

  let loadedCount = 0;
  const images: HTMLImageElement[] = [];

  preloadPromise = new Promise((resolve) => {
    framePaths.forEach((src, i) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (onItemLoaded) onItemLoaded();
        if (loadedCount === TOTAL_FRAMES) {
          cachedImages = images;
          resolve(images);
        }
      };
      img.src = src;
      images[i] = img;
    });
  });

  return preloadPromise;
}

// Jarak scroll window (dalam pixel) selama ContactSection berada dalam posisi ter-pin
export const CONTACT_PIN_SCROLL_PX = 2400;

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  // Preload images
  useEffect(() => {
    if (cachedImages) {
      imagesRef.current = cachedImages;
      setImagesLoaded(true);
      drawFrame(0);
      return;
    }

    preloadContactFrames().then((images) => {
      imagesRef.current = images;
      setImagesLoaded(true);
      drawFrame(0);
    });
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasW / canvasH;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesLoaded) {
        drawFrame(currentFrameRef.current);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [imagesLoaded, drawFrame]);

  // Synchronized pin logic inside ParallaxHero container
  useEffect(() => {
    if (!imagesLoaded) return;

    const updatePin = () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      const scrolledPx = window.scrollY || window.pageYOffset || 0;
      const offsetTop = container.offsetTop;
      const initialY = window.innerHeight * 1.5 + offsetTop;
      const startPinPx = initialY / 0.5;

      const scrollDelta = scrolledPx - startPinPx;

      if (scrollDelta <= 0) {
        inner.style.transform = "translate3d(0, 0px, 0)";
        if (currentFrameRef.current !== 0) {
          currentFrameRef.current = 0;
          drawFrame(0);
        }
      } else if (scrollDelta <= CONTACT_PIN_SCROLL_PX) {
        const pinOffsetY = scrollDelta * 0.5;
        inner.style.transform = `translate3d(0, ${pinOffsetY}px, 0)`;

        const progress = scrollDelta / CONTACT_PIN_SCROLL_PX;
        const frameIndex = Math.min(
          Math.floor(progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      } else {
        const maxPinOffsetY = CONTACT_PIN_SCROLL_PX * 0.5;
        inner.style.transform = `translate3d(0, ${maxPinOffsetY}px, 0)`;

        if (currentFrameRef.current !== TOTAL_FRAMES - 1) {
          currentFrameRef.current = TOTAL_FRAMES - 1;
          drawFrame(TOTAL_FRAMES - 1);
        }
      }
    };

    gsap.ticker.add(updatePin);
    return () => gsap.ticker.remove(updatePin);
  }, [imagesLoaded, drawFrame]);

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
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-chomsky tracking-widest text-[#e8dcc8]/90 drop-shadow-lg mb-4">
            LET&apos;S TOUCH
          </h2>
          <p className="text-lg md:text-xl text-[#e8dcc8]/50 font-light tracking-wide max-w-xl mb-12">
            Have a project in mind? Let&apos;s create something extraordinary together.
          </p>

          {/* Social Media Buttons */}
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full border border-[#e8dcc8]/20 bg-white/5 text-[#e8dcc8]/70 hover:text-[#e8dcc8] hover:bg-white/10 hover:border-[#e8dcc8]/40 hover:scale-110 transition-all duration-300"
                aria-label={link.name}
              >
                {link.icon}
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-xs text-[#e8dcc8]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-light tracking-wider">
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
