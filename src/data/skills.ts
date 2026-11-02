export type SkillCategory = "ai" | "robotics" | "web" | "tools";
export type SkillSize = "large" | "medium" | "small";

export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: SkillCategory;
  size: SkillSize;
}

export interface SkillEdge {
  source: string;
  target: string;
}

const node = (
  id: string,
  label: string,
  x: number,
  y: number,
  category: SkillCategory,
  size: SkillSize,
): SkillNode => ({ id, label, x, y, category, size });

export const SKILL_NODES: SkillNode[] = [
  // Core hubs
  node("ai_core", "AI Engineer", 0, -200, "ai", "large"),
  node("rob_core", "Robotics", -300, 150, "robotics", "large"),
  node("web_core", "Web Dev", 300, 150, "web", "large"),
  node("tools_core", "Tools & DevOps", 0, 50, "tools", "large"),

  // AI branch
  node("ai", "Artificial Intelligence", -50, -300, "ai", "medium"),
  node("dl", "Deep Learning", -120, -380, "ai", "medium"),
  node("cv", "Computer Vision", -220, -360, "ai", "medium"),
  node("opencv", "OpenCV", -300, -400, "ai", "small"),
  node("llm", "Large Language Models", 20, -420, "ai", "medium"),
  node("gemini", "Google Gemini", -40, -500, "ai", "small"),
  node("chatgpt", "ChatGPT", 30, -520, "ai", "small"),
  node("prompt", "Prompt Engineering", 100, -470, "ai", "small"),
  node("finetuned", "Fine-tuned", 90, -560, "ai", "small"),
  node("unsloth", "Unsloth", 160, -520, "ai", "small"),
  node("python", "Python", 150, -250, "ai", "medium"),
  node("fastapi", "FastAPI", 250, -300, "ai", "small"),
  node("docx", "Python-Docx", 280, -220, "ai", "small"),
  node("mas", "Multi-agent Systems", -150, -220, "ai", "medium"),
  node("a2a", "A2A Communication", -250, -260, "ai", "small"),
  node("mcp", "MCP", -220, -160, "ai", "small"),

  // Robotics branch
  node("ros", "ROS", -420, 50, "robotics", "medium"),
  node("quadruped", "Quadruped Robot", -550, 80, "robotics", "medium"),
  node("robot_prog", "Robot Programming", -450, 220, "robotics", "medium"),
  node("cpp", "C++", -550, 280, "robotics", "small"),
  node("control_sys", "Basic Control system", -350, 300, "robotics", "medium"),
  node("rtos", "RTOS", -200, 280, "robotics", "medium"),

  // Web dev branch
  node("frontend", "Front-End Development", 400, 50, "web", "medium"),
  node("react", "React.js", 500, -20, "web", "medium"),
  node("nextjs", "Next.js", 580, -80, "web", "small"),
  node("vite", "Vite.js", 620, 0, "web", "small"),
  node("tailwind", "Tailwind CSS", 520, 70, "web", "small"),
  node("js", "JavaScript", 450, 150, "web", "medium"),
  node("backend", "Back-End Web Development", 400, 280, "web", "medium"),
  node("nodejs", "Node.js", 520, 250, "web", "small"),
  node("postgresql", "PostgreSQL", 500, 350, "web", "small"),

  // Tools / shared
  node("docker", "Docker", -100, -20, "tools", "medium"),
  node("git", "Git", 120, -20, "tools", "medium"),
  node("github", "GitHub", 220, -10, "tools", "small"),
  node("pm", "Project Management", -120, 80, "tools", "medium"),
  node("n8n", "N8N", 150, 100, "tools", "medium"),
];

const edges = (source: string, targets: string[]): SkillEdge[] =>
  targets.map((target) => ({ source, target }));

export const SKILL_EDGES: SkillEdge[] = [
  // AI
  ...edges("ai_core", ["ai", "python", "mas"]),
  ...edges("ai", ["dl"]),
  ...edges("dl", ["cv", "llm"]),
  ...edges("cv", ["opencv"]),
  ...edges("llm", ["gemini", "chatgpt", "prompt", "finetuned", "unsloth"]),
  ...edges("python", ["fastapi", "docx"]),
  ...edges("mas", ["a2a", "mcp"]),

  // Robotics
  ...edges("rob_core", ["ros", "robot_prog", "control_sys", "rtos"]),
  ...edges("ros", ["quadruped"]),
  ...edges("robot_prog", ["cpp", "quadruped"]),

  // Web dev
  ...edges("web_core", ["frontend", "backend", "js"]),
  ...edges("frontend", ["react", "tailwind"]),
  ...edges("react", ["nextjs", "vite"]),
  ...edges("backend", ["nodejs", "postgresql"]),

  // Tools & cross connections
  ...edges("tools_core", ["docker", "git", "pm", "n8n"]),
  ...edges("git", ["github"]),
  ...edges("docker", ["ai_core", "web_core", "rob_core"]),
  ...edges("n8n", ["mas", "backend"]),
  ...edges("pm", ["rob_core", "ai_core", "web_core"]),
];
