"use client";

import { useEffect, useRef } from "react";
import TextScramble from "./TextScramble";

interface LiquidRevealProps {
  topImage: string;
  bottomImage: string;
}

interface TrailPoint {
  x: number;
  y: number;
  size: number;
  age: number;
}

export default function LiquidReveal({
  topImage,
  bottomImage,
}: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d")!;

    // === Pre-render: scale the top image once into an offscreen canvas ===
    let offscreen: HTMLCanvasElement | null = null;

    const topImg = new Image();
    topImg.crossOrigin = "anonymous";
    topImg.src = topImage;

    // Draw params for object-contain (recomputed on resize)
    let drawX = 0,
      drawY = 0,
      drawW = 0,
      drawH = 0;

    const computeContain = () => {
      if (!topImg.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = topImg.naturalWidth / topImg.naturalHeight;
      const canvasRatio = cw / ch;

      if (imgRatio > canvasRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
        drawX = 0;
        drawY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
        drawX = (cw - drawW) / 2;
        drawY = 0;
      }

      // Pre-render the contained image to an offscreen canvas
      offscreen = document.createElement("canvas");
      offscreen.width = cw;
      offscreen.height = ch;
      const offCtx = offscreen.getContext("2d")!;

      // --- PENDEKATAN OUTLINE HITAM (SOLID STROKE) ---
      // Efek shadow kadang terlalu tipis atau transparan.
      // Cara paling ampuh adalah menggambar siluet hitam murni di belakang gambar utama.

      // 1. Ubah warna menjadi hitam pekat
      offCtx.filter = "brightness(0)";

      // 2. Gambar siluet hitam digeser ke 8 arah (membentuk outline yang sangat tebal & solid)
      const outlineThickness = 20; // Ketebalan outline dalam piksel, naikkan jika kurang tebal
      const directions = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];

      directions.forEach(([dx, dy]) => {
        offCtx.drawImage(
          topImg,
          0,
          0,
          topImg.naturalWidth,
          topImg.naturalHeight,
          drawX + dx * outlineThickness,
          drawY + dy * outlineThickness,
          drawW,
          drawH,
        );
      });

      // 3. Reset filter ke normal
      offCtx.filter = "none";

      // 4. Gambar foto aslinya persis di tengah (menimpa siluet hitam)
      offCtx.drawImage(
        topImg,
        0,
        0,
        topImg.naturalWidth,
        topImg.naturalHeight,
        drawX,
        drawY,
        drawW,
        drawH,
      );
    };

    topImg.onload = () => computeContain();

    // Resize
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      computeContain();
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse state
    const mouse = { x: -9999, y: -9999, active: false };
    const smooth = { x: -9999, y: -9999 };
    const trail: TrailPoint[] = [];
    let lastActiveTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (!mouse.active) {
        // Saat user mulai hover, bersihkan jejak idle otomatis
        trail.length = 0;
        smooth.x = currentX;
        smooth.y = currentY;
      }

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      lastActiveTime = performance.now();
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      lastActiveTime = performance.now();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Constants
    const BASE_SIZE = 120;
    const TRAIL_LENGTH = 25;
    const MAX_AGE = 60;
    const LERP = 0.12;

    // Pre-create radial gradient textures for fast blob drawing (no blur needed)
    const blobCanvas = document.createElement("canvas");
    const blobSize = (BASE_SIZE + 40) * 2 + 2; // max diameter + padding
    blobCanvas.width = blobSize;
    blobCanvas.height = blobSize;
    const blobCtx = blobCanvas.getContext("2d")!;
    const halfBlob = blobSize / 2;
    const gradient = blobCtx.createRadialGradient(
      halfBlob,
      halfBlob,
      0,
      halfBlob,
      halfBlob,
      halfBlob,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.75, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    blobCtx.fillStyle = gradient;
    blobCtx.fillRect(0, 0, blobSize, blobSize);

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const now = performance.now();

      // Smooth mouse interpolation / Idle animation
      if (mouse.active) {
        if (smooth.x < -999) {
          smooth.x = mouse.x;
          smooth.y = mouse.y;
        }
        smooth.x += (mouse.x - smooth.x) * LERP;
        smooth.y += (mouse.y - smooth.y) * LERP;

        const last = trail[trail.length - 1];
        const dx = last ? smooth.x - last.x : 999;
        const dy = last ? smooth.y - last.y : 999;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const velocity = Math.min(dist, 60);
        const size = BASE_SIZE + (1 - velocity / 60) * 40;

        if (!last || dist > 3) {
          trail.push({ x: smooth.x, y: smooth.y, size, age: 0 });
        }

        while (trail.length > TRAIL_LENGTH) trail.shift();
      } else {
        // --- EFEK IDLE (AUTO WANDERER) ---
        // Aktif setiap saat (tanpa jeda tunggu) jika mouse di luar canvas.
        // Pergerakan dibuat lebih cepat dan lebih bervariasi.

        const time = now * 0.001;
        const cx = width / 2;
        const cy = height / 2;

        const rx = width * 0.35;
        const ry = height * 0.35;

        // Gelombang yang digabungkan untuk pergerakan yang lebih cepat & "sering"
        const autoX =
          cx + Math.sin(time * 1.8) * rx + Math.sin(time * 3.1) * (rx * 0.3);
        const autoY =
          cy + Math.cos(time * 1.4) * ry + Math.cos(time * 4.5) * (ry * 0.3);

        if (trail.length === 0 || smooth.x < -999) {
          smooth.x = autoX;
          smooth.y = autoY;
        }

        smooth.x += (autoX - smooth.x) * LERP;
        smooth.y += (autoY - smooth.y) * LERP;

        const size = BASE_SIZE * 0.8; // Ukuran sedikit lebih kecil untuk efek idle
        trail.push({ x: smooth.x, y: smooth.y, size, age: 0 });
        while (trail.length > TRAIL_LENGTH) trail.shift();
      }

      // Age & cull
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (!mouse.active && trail[i].age >= MAX_AGE) {
          trail.splice(i, 1);
        }
      }

      if (trail.length === 0 || !offscreen) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // === STEP 1: Draw blob mask using pre-rendered gradient texture ===
      // This is MUCH faster than ctx.filter = "blur()" every frame
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];

        let alpha: number;
        if (!mouse.active) {
          alpha = Math.max(0, 1 - point.age / MAX_AGE);
        } else {
          alpha = 0.5 + 0.5 * ((i + 1) / trail.length);
        }

        const size = point.size * alpha;
        if (size <= 0) continue;

        ctx.globalAlpha = alpha;
        const d = size * 2;
        ctx.drawImage(blobCanvas, point.x - size, point.y - size, d, d);
      }

      // === STEP 2: Composite the pre-rendered top image ===
      ctx.globalCompositeOperation = "source-in";
      ctx.globalAlpha = 1;
      ctx.drawImage(offscreen, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [topImage]);

  return (
    <div id="about-section" className="relative w-full h-screen overflow-hidden bg-black flex flex-col md:flex-row mt-48">
      {/* AREA KIRI: Ruang untuk Teks */}
      <div className="w-full md:w-[40%] h-auto md:h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0 z-10 pointer-events-none">
        <h1 className="text-[#e8dcc8] text-5xl md:text-6xl lg:text-[150px] font-chomsky leading-tight">
          RIZANO
        </h1>
        {/* <h1 className="text-[#e8dcc8] text-5xl md:text-6xl lg:text-[200px] font-chomsky mb-6 leading-tight">
          ANO
        </h1> */}
        <p className="text-[#e8dcc8] opacity-70 text-lg md:text-xl font-light max-w-md mb-80">
          A Software Engineer dedicated to crafting{" "}
          <TextScramble
            className="text-[#e8dcc8] font-semibold"
            phrases={[
              "interactive websites.",
              "intelligent AI solutions.",
              "autonomous robotics systems.",
            ]}
          />
        </p>
      </div>

      {/* AREA KANAN: Efek Liquid Reveal */}
      <div
        ref={containerRef}
        className="relative w-full md:w-[60%] h-full grow"
      >
        {/* BOTTOM LAYER: always visible background */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bottomImage}
            alt="Bottom reveal"
            className="w-full h-full object-contain"
          />
        </div>

        {/* TOP LAYER: drawn via canvas with liquid blob mask */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-2"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent to-black z-[60] pointer-events-none" />
    </div>
  );
}
