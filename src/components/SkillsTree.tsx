"use client";

import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { SKILL_EDGES, SKILL_NODES, SkillSize } from "@/data/skills";

const NODE_BY_ID = new Map(SKILL_NODES.map((node) => [node.id, node]));

// Bounding box of all nodes, so the edge SVG has a real paintable area.
// A 0x0 SVG relying on overflow:visible can be culled by the browser.
const EDGE_PADDING = 20;
const BOUNDS = (() => {
  const xs = SKILL_NODES.map((n) => n.x);
  const ys = SKILL_NODES.map((n) => n.y);
  const minX = Math.min(...xs) - EDGE_PADDING;
  const minY = Math.min(...ys) - EDGE_PADDING;
  return {
    minX,
    minY,
    width: Math.max(...xs) + EDGE_PADDING - minX,
    height: Math.max(...ys) + EDGE_PADDING - minY,
  };
})();

const DOT_SIZE: Record<SkillSize, number> = { large: 16, medium: 10, small: 6 };

const LABEL_COLOR = "#e8dcc8";
const HUB_COLOR = "#ffffff";
const GLOW_COLOR = "rgba(232, 220, 200, 0.4)";
const EDGE_COLOR = "rgba(232, 220, 200, 0.3)";

const DEFAULT_SCALE = 0.8;
const MIN_SCALE = 0.2;
/** Extra room (px) around the constellation when fitting it to the viewport, for labels. */
const FIT_MARGIN_X = 140;
const FIT_MARGIN_Y = 260;
/** Fitting never zooms out past this, so labels stay readable on phones (drag to see the rest). */
const MIN_FIT_SCALE = 0.35;
const MAX_SCALE = 2;
const ZOOM_STEP = 0.2;

const AUTO_HOVER_INTERVAL_MS = 2100;
const AUTO_HOVER_DURATION_MS = 2000;

const nodeColor = (size: SkillSize) => (size === "large" ? HUB_COLOR : LABEL_COLOR);

/** Centered view that fits the whole constellation, capped at DEFAULT_SCALE. */
function fitView(rect: DOMRect) {
  const scale = Math.max(
    MIN_FIT_SCALE,
    Math.min(
      DEFAULT_SCALE,
      rect.width / (BOUNDS.width + FIT_MARGIN_X),
      rect.height / (BOUNDS.height + FIT_MARGIN_Y),
    ),
  );
  const centerX = BOUNDS.minX + BOUNDS.width / 2;
  const centerY = BOUNDS.minY + BOUNDS.height / 2;
  return {
    x: rect.width / 2 - centerX * scale,
    y: rect.height / 2 - centerY * scale,
    scale,
  };
}

function ControlButton({
  label,
  onClick,
  className = "",
  iconSize = 20,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  iconSize?: number;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-cream transition-colors ${className}`}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}

export default function SkillsTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: DEFAULT_SCALE });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [autoHoveredNode, setAutoHoveredNode] = useState<string | null>(null);

  // Highlight a random star periodically so the constellation feels alive
  useEffect(() => {
    let clearTimer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      const randomNode = SKILL_NODES[Math.floor(Math.random() * SKILL_NODES.length)];
      setAutoHoveredNode(randomNode.id);
      clearTimer = setTimeout(() => setAutoHoveredNode(null), AUTO_HOVER_DURATION_MS);
    }, AUTO_HOVER_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(clearTimer);
    };
  }, []);

  // Manual hover wins over the automatic one
  const activeHover = hoveredNode || autoHoveredNode;

  const zoomBy = (delta: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)),
    }));
  };

  const resetView = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setTransform(fitView(rect));
  };

  // Center the constellation on mount
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setTransform(fitView(rect));
  }, []);

  const handlePointerDown = (e: ReactPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <section
      id="skills-section"
      className="relative w-full h-[120vh] min-h-[600px] bg-black overflow-hidden select-none"
    >
      <div className="absolute top-0 left-8 right-8 md:left-16 lg:left-24 z-20 pointer-events-none">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-chomsky tracking-widest text-cream/90 drop-shadow-md">
          SKILL CONSTELLATION
        </h2>
        <p className="text-cream/50 mt-2 font-light text-sm md:text-base">
          Click and drag to explore. Hover over stars to reveal skills.
        </p>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-40 right-8 md:right-16 lg:right-24 z-30 flex flex-col gap-2">
        <ControlButton label="Zoom In" onClick={() => zoomBy(ZOOM_STEP)}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </ControlButton>
        <ControlButton label="Zoom Out" onClick={() => zoomBy(-ZOOM_STEP)}>
          <line x1="5" y1="12" x2="19" y2="12" />
        </ControlButton>
        <ControlButton label="Reset View" onClick={resetView} className="mt-2" iconSize={18}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </ControlButton>
      </div>

      <div
        ref={containerRef}
        // pan-y keeps vertical page scrolling on touch screens; horizontal drags pan the map
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <div
          className="absolute top-0 left-0 origin-center transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {/* Edges */}
          <svg
            className="absolute overflow-visible pointer-events-none"
            style={{ left: BOUNDS.minX, top: BOUNDS.minY }}
            width={BOUNDS.width}
            height={BOUNDS.height}
            viewBox={`${BOUNDS.minX} ${BOUNDS.minY} ${BOUNDS.width} ${BOUNDS.height}`}
          >
            {SKILL_EDGES.map((edge) => {
              const source = NODE_BY_ID.get(edge.source);
              const target = NODE_BY_ID.get(edge.target);
              if (!source || !target) return null;

              const isHighlighted =
                activeHover === edge.source || activeHover === edge.target;

              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? nodeColor(source.size) : EDGE_COLOR}
                  strokeWidth={isHighlighted ? 2 : 1}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {SKILL_NODES.map((node) => {
            const isHovered = activeHover === node.id;
            const isHub = node.size === "large";
            const size = DOT_SIZE[node.size];
            const color = nodeColor(node.size);

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group w-16 h-16 cursor-pointer"
                style={{ left: node.x, top: node.y }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div
                  className="rounded-full relative transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: isHovered
                      ? `0 0 20px 5px ${GLOW_COLOR}`
                      : `0 0 10px 2px ${GLOW_COLOR}`,
                    transform: isHovered ? "scale(1.5)" : "scale(1)",
                  }}
                >
                  {isHub && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-50"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>

                <div
                  className={`absolute top-[60%] mt-3 whitespace-nowrap text-sm tracking-wider font-light transition-all duration-300 pointer-events-none ${
                    isHovered || isHub
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                  }`}
                  style={{
                    color,
                    textShadow: `0 0 10px ${GLOW_COLOR}`,
                    fontSize: isHub ? "1.1rem" : "0.875rem",
                    fontWeight: isHub ? 500 : 300,
                  }}
                >
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
