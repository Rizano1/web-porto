"use client";

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

// Types
type Category = "ai" | "robotics" | "web" | "tools" | "core";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: Category;
  size?: "large" | "medium" | "small";
}

interface SkillEdge {
  source: string;
  target: string;
}

// Data Map
const SKILL_NODES: SkillNode[] = [
  // Core Hubs
  {
    id: "ai_core",
    label: "AI Engineer",
    x: 0,
    y: -200,
    category: "ai",
    size: "large",
  },
  {
    id: "rob_core",
    label: "Robotics",
    x: -300,
    y: 150,
    category: "robotics",
    size: "large",
  },
  {
    id: "web_core",
    label: "Web Dev",
    x: 300,
    y: 150,
    category: "web",
    size: "large",
  },
  {
    id: "tools_core",
    label: "Tools & DevOps",
    x: 0,
    y: 50,
    category: "tools",
    size: "large",
  },

  // AI Branch
  {
    id: "ai",
    label: "Artificial Intelligence",
    x: -50,
    y: -300,
    category: "ai",
    size: "medium",
  },
  {
    id: "dl",
    label: "Deep Learning",
    x: -120,
    y: -380,
    category: "ai",
    size: "medium",
  },
  {
    id: "cv",
    label: "Computer Vision",
    x: -220,
    y: -360,
    category: "ai",
    size: "medium",
  },
  {
    id: "opencv",
    label: "OpenCV",
    x: -300,
    y: -400,
    category: "ai",
    size: "small",
  },
  {
    id: "llm",
    label: "Large Language Models",
    x: 20,
    y: -420,
    category: "ai",
    size: "medium",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    x: -40,
    y: -500,
    category: "ai",
    size: "small",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    x: 30,
    y: -520,
    category: "ai",
    size: "small",
  },
  {
    id: "prompt",
    label: "Prompt Engineering",
    x: 100,
    y: -470,
    category: "ai",
    size: "small",
  },
  {
    id: "finetuned",
    label: "Fine-tuned",
    x: 90,
    y: -560,
    category: "ai",
    size: "small",
  },
  {
    id: "unsloth",
    label: "Unsloth",
    x: 160,
    y: -520,
    category: "ai",
    size: "small",
  },
  {
    id: "python",
    label: "Python",
    x: 150,
    y: -250,
    category: "ai",
    size: "medium",
  },
  {
    id: "fastapi",
    label: "FastAPI",
    x: 250,
    y: -300,
    category: "ai",
    size: "small",
  },
  {
    id: "docx",
    label: "Python-Docx",
    x: 280,
    y: -220,
    category: "ai",
    size: "small",
  },
  {
    id: "mas",
    label: "Multi-agent Systems",
    x: -150,
    y: -220,
    category: "ai",
    size: "medium",
  },
  {
    id: "a2a",
    label: "A2A Communication",
    x: -250,
    y: -260,
    category: "ai",
    size: "small",
  },
  { id: "mcp", label: "MCP", x: -220, y: -160, category: "ai", size: "small" },

  // Robotics Branch
  {
    id: "ros",
    label: "ROS",
    x: -420,
    y: 50,
    category: "robotics",
    size: "medium",
  },
  {
    id: "quadruped",
    label: "Quadruped Robot",
    x: -550,
    y: 80,
    category: "robotics",
    size: "medium",
  },
  {
    id: "robot_prog",
    label: "Robot Programming",
    x: -450,
    y: 220,
    category: "robotics",
    size: "medium",
  },
  {
    id: "cpp",
    label: "C++",
    x: -550,
    y: 280,
    category: "robotics",
    size: "small",
  },
  {
    id: "control_sys",
    label: "Basic Control system",
    x: -350,
    y: 300,
    category: "robotics",
    size: "medium",
  },
  {
    id: "rtos",
    label: "RTOS",
    x: -200,
    y: 280,
    category: "robotics",
    size: "medium",
  },

  // Web Dev Branch
  {
    id: "frontend",
    label: "Front-End Development",
    x: 400,
    y: 50,
    category: "web",
    size: "medium",
  },
  {
    id: "react",
    label: "React.js",
    x: 500,
    y: -20,
    category: "web",
    size: "medium",
  },
  {
    id: "nextjs",
    label: "Next.js",
    x: 580,
    y: -80,
    category: "web",
    size: "small",
  },
  {
    id: "vite",
    label: "Vite.js",
    x: 620,
    y: 0,
    category: "web",
    size: "small",
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    x: 520,
    y: 70,
    category: "web",
    size: "small",
  },
  {
    id: "js",
    label: "JavaScript",
    x: 450,
    y: 150,
    category: "web",
    size: "medium",
  },
  {
    id: "backend",
    label: "Back-End Web Development",
    x: 400,
    y: 280,
    category: "web",
    size: "medium",
  },
  {
    id: "nodejs",
    label: "Node.js",
    x: 520,
    y: 250,
    category: "web",
    size: "small",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    x: 500,
    y: 350,
    category: "web",
    size: "small",
  },

  // Tools / Shared
  {
    id: "docker",
    label: "Docker",
    x: -100,
    y: -20,
    category: "tools",
    size: "medium",
  },
  {
    id: "git",
    label: "Git",
    x: 120,
    y: -20,
    category: "tools",
    size: "medium",
  },
  {
    id: "github",
    label: "GitHub",
    x: 220,
    y: -10,
    category: "tools",
    size: "small",
  },
  {
    id: "pm",
    label: "Project Management",
    x: -120,
    y: 80,
    category: "tools",
    size: "medium",
  },
  {
    id: "n8n",
    label: "N8N",
    x: 150,
    y: 100,
    category: "tools",
    size: "medium",
  },
];

const SKILL_EDGES: SkillEdge[] = [
  // AI Connections
  { source: "ai_core", target: "ai" },
  { source: "ai_core", target: "python" },
  { source: "ai_core", target: "mas" },
  { source: "ai", target: "dl" },
  { source: "dl", target: "cv" },
  { source: "cv", target: "opencv" },
  { source: "dl", target: "llm" },
  { source: "llm", target: "gemini" },
  { source: "llm", target: "chatgpt" },
  { source: "llm", target: "prompt" },
  { source: "llm", target: "finetuned" },
  { source: "llm", target: "unsloth" },
  { source: "python", target: "fastapi" },
  { source: "python", target: "docx" },
  { source: "mas", target: "a2a" },
  { source: "mas", target: "mcp" },

  // Robotics Connections
  { source: "rob_core", target: "ros" },
  { source: "rob_core", target: "robot_prog" },
  { source: "rob_core", target: "control_sys" },
  { source: "rob_core", target: "rtos" },
  { source: "ros", target: "quadruped" },
  { source: "robot_prog", target: "cpp" },
  { source: "robot_prog", target: "quadruped" },

  // Web Dev Connections
  { source: "web_core", target: "frontend" },
  { source: "web_core", target: "backend" },
  { source: "web_core", target: "js" },
  { source: "frontend", target: "react" },
  { source: "frontend", target: "tailwind" },
  { source: "react", target: "nextjs" },
  { source: "react", target: "vite" },
  { source: "backend", target: "nodejs" },
  { source: "backend", target: "postgresql" },

  // Cross Connections & Tools
  { source: "tools_core", target: "docker" },
  { source: "tools_core", target: "git" },
  { source: "tools_core", target: "pm" },
  { source: "tools_core", target: "n8n" },
  { source: "git", target: "github" },
  { source: "docker", target: "ai_core" },
  { source: "docker", target: "web_core" },
  { source: "docker", target: "rob_core" },
  { source: "n8n", target: "mas" },
  { source: "n8n", target: "backend" },
  { source: "pm", target: "rob_core" },
  { source: "pm", target: "ai_core" },
  { source: "pm", target: "web_core" },
];

export default function SkillsTree() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [autoHoveredNode, setAutoHoveredNode] = useState<string | null>(null);

  // Random hover animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random node
      const randomNode =
        SKILL_NODES[Math.floor(Math.random() * SKILL_NODES.length)];
      setAutoHoveredNode(randomNode.id);

      // Clear the auto hover after 2 seconds
      setTimeout(() => {
        setAutoHoveredNode(null);
      }, 2000);
    }, 2100); // Trigger every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Determine active hover (prioritize manual mouse hover over auto hover)
  const activeHover = hoveredNode || autoHoveredNode;

  // Colors based on theme (white and golden white)
  const getCategoryColor = (category: Category, size?: string) => {
    return size === "large" ? "#ffffff" : "#e8dcc8";
  };

  const getGlowColor = () => {
    return "rgba(232, 220, 200, 0.4)";
  };

  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(2, prev.scale + 0.2),
    }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.3, prev.scale - 0.2),
    }));
  };

  const handleReset = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTransform({
        x: rect.width / 2,
        y: rect.height / 2,
        scale: 0.8,
      });
    }
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center the constellation on mount
  useEffect(() => {
    handleReset();
  }, []);

  return (
    <section
      id="skills-section"
      className="relative w-full h-[120vh] min-h-[600px] bg-black overflow-hidden select-none"
    >
      <div className="absolute top-0 left-8 md:left-16 lg:left-24 z-20 pointer-events-none">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-chomsky tracking-widest text-[#e8dcc8]/90 drop-shadow-md">
          SKILL CONSTELLATION
        </h2>
        <p className="text-[#e8dcc8]/50 mt-2 font-light text-sm md:text-base">
          Click and drag to explore. Hover over stars to reveal skills.
        </p>
      </div>

      {/* Zoom Controls UI */}
      <div className="absolute top-40 right-8 md:right-16 lg:right-24 z-30 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-[#e8dcc8] transition-colors"
          aria-label="Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-[#e8dcc8] transition-colors"
          aria-label="Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-[#e8dcc8] transition-colors mt-2"
          aria-label="Reset View"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>
      </div>

      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute top-0 left-0 origin-center transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {/* SVG Lines Layer */}
          <svg
            className="absolute top-0 left-0 overflow-visible"
            style={{ width: 0, height: 0 }}
          >
            {SKILL_EDGES.map((edge, i) => {
              const sourceNode = SKILL_NODES.find((n) => n.id === edge.source);
              const targetNode = SKILL_NODES.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                activeHover === edge.source || activeHover === edge.target;

              return (
                <line
                  key={i}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={
                    isHighlighted
                      ? getCategoryColor(sourceNode.category, sourceNode.size)
                      : "rgba(232, 220, 200, 0.3)"
                  }
                  strokeWidth={isHighlighted ? 2 : 1}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Nodes Layer */}
          {SKILL_NODES.map((node) => {
            const isHovered = activeHover === node.id;
            const size =
              node.size === "large" ? 16 : node.size === "medium" ? 10 : 6;
            const color = getCategoryColor(node.category, node.size);
            const glow = getGlowColor();

            return (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group w-16 h-16 cursor-pointer"
                style={{ left: node.x, top: node.y }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Dot */}
                <div
                  className="rounded-full relative transition-all duration-300"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: isHovered
                      ? `0 0 20px 5px ${glow}`
                      : `0 0 10px 2px ${glow}`,
                    transform: isHovered ? "scale(1.5)" : "scale(1)",
                  }}
                >
                  {/* Pulse Effect for large nodes */}
                  {node.size === "large" && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-50"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>

                {/* Node Label */}
                <div
                  className={`absolute top-[60%] mt-3 whitespace-nowrap text-sm tracking-wider font-light transition-all duration-300 pointer-events-none ${
                    isHovered || node.size === "large"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                  }`}
                  style={{
                    color: node.size === "large" ? color : "#e8dcc8",
                    textShadow: `0 0 10px ${glow}`,
                    fontSize: node.size === "large" ? "1.1rem" : "0.875rem",
                    fontWeight: node.size === "large" ? 500 : 300,
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
