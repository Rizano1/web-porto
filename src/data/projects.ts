export interface Project {
  title: string;
  slug: string;
  image: string;
  /** One-sentence summary, shown as the lead on the project page. */
  overview: string;
  role: string;
  /** Where / for whom, e.g. a company, team or event. */
  context?: string;
  period?: string;
  techStack: string[];
  /** What I built or achieved, one bullet each. */
  highlights: string[];
  /** Background paragraphs, separated by a blank line. */
  fullDescription: string;
}

export const PROJECTS: Project[] = [
  {
    title: "ATLAS",
    slug: "atlas",
    image: "/assets/works/atlas.jpg",
    overview:
      "ATLAS is a SaaS AI operating engine for businesses: it connects operational data, understands how a business works, and helps teams make faster, explainable decisions. I work on the AI side, building the multi-tenant agent at its core.",
    role: "AI Engineer",
    context: "PT. Altimeda Cipta Visitama",
    period: "Aug 2026 – Present",
    techStack: ["Python", "LLM", "AI Agents", "Knowledge Graphs", "Ontologies", "SQL", "Python Sandboxing"],
    highlights: [
      "Architected a multi-tenant AI agent for the SaaS ERP platform, integrating ontology knowledge graphs and tabular database schemas for context-rich, tenant-specific reasoning that goes beyond traditional RAG.",
      "Implemented a modular, skill-based architecture that dynamically partitions system prompts and toolsets, significantly reducing token usage and eliminating agent confusion and hallucinations.",
      "Engineered an isolated Python sandbox execution tool that lets the agent generate and run its own scripts over large row datasets, without passing raw data into the LLM context.",
    ],
    fullDescription: `ATLAS, by Altimeda, connects a company's operational data, from ERP, CRM, spreadsheets and legacy systems, and turns it into decisions teams can explain.

My work is on the AI side of the platform: the agent that reasons over each tenant's data. The image shows the public landing page, because the internal work itself is confidential.`,
  },
  {
    title: "Apex Automation",
    slug: "apex-automation",
    image: "/assets/works/apex.jpg",
    overview:
      "A B2B lead generation platform built on UiPath: it finds real businesses on Google Maps, reads their reviews, scores how much each one needs what you sell, and drafts a personal outreach message for the best ones. Every message quotes real evidence, and nothing is sent until a person approves it.",
    role: "Team Project",
    context: "UiPath Hackathon",
    period: "Oct 2026",
    techStack: [
      "UiPath Maestro",
      "UiPath Studio",
      "Agent Builder",
      "Data Fabric",
      "Action Center",
      "Integration Service",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "SerpApi",
      "OpenRouter",
    ],
    highlights: [
      "Designed an end-to-end Maestro (BPMN) pipeline of five serverless robots: Harvest, Cleanse, ScoreRules, Evaluate and Dispatch.",
      "Built the Apex Score (0–100), a weighted mix of need, fit, contact and activity, with rule-based signals checked in code and review-based signals judged by an AI agent.",
      "Enforced zero hallucination: a robot checks every quoted review word for word against stored evidence and discards anything it can't find.",
      "Kept a human in the loop with an Action Center approval task and a custom Coded Action App to review each draft next to its evidence, plus a global Stop-All switch.",
      "Made AI scoring resilient on free LLMs, with fallback models and batched evaluation so runs always finish within the serverless job limit.",
      "Built a six-screen Coded Web App for business profiles, runs, reports and the approval cockpit, with all data stored in nine Data Fabric entities.",
    ],
    fullDescription: `A seller, such as a web agency or a coffee-bean supplier, describes their business once: what they sell, who their ideal customer is, and the need signals that show a business needs them, for example "no website" or "reviews complain about slow WhatsApp replies".

For each run, Apex searches Google Maps for an industry in a city, cleans and deduplicates the results, and skips anyone contacted in the last 90 days. It then scores every prospect, and an AI agent writes a draft in Bahasa Indonesia for the strongest ones. The run pauses for a person to approve, edit or reject each draft. Approved emails go out through Gmail, and WhatsApp drafts become click-to-chat links for a person to send. A live run of 8 prospects reaches the approval step in about 6 minutes.

We built it as a team for the UiPath hackathon.`,
  },
  {
    title: "Visual Inspection Automation",
    slug: "visual-inspection-automation",
    image: "/assets/works/robodog.png",
    overview:
      "An embodied AI inspection pipeline for quadruped robots that connects multimodal LLMs to ROS through MCP, enabling autonomous navigation, SOP reasoning and visual anomaly detection.",
    role: "Solo Project",
    context: "Final capstone project",
    techStack: [
      "ROS",
      "Python",
      "LLM",
      "Quadruped Robot",
      "RAG",
      "MCP",
      "Next.js",
      "Tailwind CSS",
      "React",
      "FastAPI",
    ],
    highlights: [
      "Connected Google Gemini, a large multimodal model, to a DeepRobotics Jueying Lite 3 quadruped robot through ROS and MCP tools.",
      "Built an AI agent that turns natural-language commands into inspection missions it plans, researches and executes on its own.",
      "Integrated Standard Operating Procedure documents with Retrieval-Augmented Generation for visual inspection and real-time anomaly detection from the robot's camera.",
      "Added a Human-in-the-Loop step so operators validate plans and action results before execution.",
      "Built a web interface with an LLM chatbot for robot control, SOP document upload and live camera capture monitoring.",
    ],
    fullDescription: `This project implements an autonomous visual inspection system using a DeepRobotics Jueying Lite 3 quadruped robot, with Google Gemini as the central reasoning engine.

The goal is to bridge communication between human operators and the robot through natural language. The AI agent plans, retrieves supporting information and executes inspection missions by itself, while the operator stays in control of what actually runs.

This was my final capstone project, developed independently.`,
  },
  {
    title: "JAGA",
    slug: "jaga",
    image: "/assets/works/jaga.jpg",
    overview:
      "JAGA is an AI-based re-identification system for motorcycle theft investigation. It follows a suspect across multiple CCTV feeds and turns the sightings into an evidence report with a reconstructed escape route.",
    role: "Machine Learning Engineer",
    context: "Team Project",
    techStack: ["Python", "YOLO", "OpenCV", "Object Detection", "Person Re-ID", "Vehicle Re-ID"],
    highlights: [
      "Built an automated computer vision surveillance pipeline combining YOLO object detection, person re-identification and vehicle re-identification.",
      "Tracked suspects across multiple CCTV feeds, matching each sighting to the reference with a similarity score and flagging the best match.",
      "Produced the detection scores, locations and timestamps that feed the team's evidence report and route visualization.",
    ],
    fullDescription: `When a motorcycle is stolen, investigators often have to scroll through hours of footage from many separate CCTV cameras to find where the suspect went.

JAGA automates that search: it detects people and vehicles in each feed, re-identifies the same suspect across cameras, and orders the sightings by time to reconstruct the route, so investigators start from ranked evidence instead of raw video. Each case ends in an evidence report with every sighting, a route on the map, and a downloadable report.

We built JAGA as a team. My part was the machine learning side: the detection and re-identification models and the pipeline that runs them.`,
  },
  {
    title: "Adex AI Assistant",
    slug: "adex-ai-assistant",
    image: "/assets/works/adex.png",
    overview:
      "An AI assistant integrated into an enterprise ERP system. It uses LLMs and MCP to understand user commands and answer questions about internal ERP data by querying internal tools on its own.",
    role: "AI Engineer Intern",
    context: "PT. Altimeda Cipta Visitama",
    period: "Jul 2025 – Nov 2025",
    techStack: ["LLM", "MCP", "FastMCP", "Python", "FastAPI", "RAG", "python-docx"],
    highlights: [
      "Designed and deployed an AI orchestrator using FastAPI and FastMCP, integrating 120+ RESTful APIs to enable natural-language CRUD operations across enterprise ERP modules.",
      "Developed the LLM pipeline and custom MCP tools that give the model access to internal ERP data.",
      "Engineered an automated contract comparison system using python-docx and python-redlines that generates track-change diffs between sub and head contracts, speeding up legal review.",
    ],
    fullDescription: `Adex is an AI assistant integrated into an enterprise ERP system. It helps users operate the platform by using LLMs to understand natural-language commands and provide relevant context.

The LLM is equipped with tools through the Model Context Protocol (MCP), which gives it access to internal ERP data so it can retrieve accurate, relevant answers to user queries by itself.

My role was AI Engineer Intern, focusing on the LLM pipeline and custom MCP tools.`,
  },
  {
    title: "Qobiltu",
    slug: "qobiltu",
    image: "/assets/works/qobiltu.jpg",
    overview:
      "Qobiltu is a ta'aruf platform that helps people find a life partner in a way that follows Islamic values. I build the admin dashboard that runs the platform behind the scenes.",
    role: "Front-End Web Developer (Web Admin)",
    context: "PT. Qobiltu Nikah Indonesia",
    period: "Jul 2025 – Present",
    techStack: [],
    highlights: [
      "Developed an administrative web portal serving 870+ active users and 75+ matchmaking users, and managing 50+ preparation modules.",
      "Implemented responsive CRUD, search and dynamic filtering across the admin portal.",
      "Engineered an interactive DIY quiz and exam builder UI, plus rich-text editors.",
      "Built analytics charts to monitor user learning metrics and platform engagement.",
    ],
    fullDescription: `Qobiltu Indonesia is a safe, trusted ta'aruf platform where members prepare for marriage through learning modules and find a partner through guided matchmaking.

My role is on the admin side: the dashboard the team uses to manage users, matchmaking and learning content. The image shows the public landing page, because the admin dashboard itself is confidential.`,
  },
  {
    title: "Banyubramanta",
    slug: "banyubramanta",
    image: "/assets/works/banyubramanta.jpg",
    overview:
      "An underwater robotics team building autonomous underwater robots for national and international competitions. I worked on the robot's vision and autonomy software.",
    role: "Senior Programmer",
    context: "Banyubramanta Underwater Robotics Team",
    period: "Jan 2023 – May 2025",
    techStack: ["ROS", "Python", "OpenCV", "PyTorch", "Behavior Trees", "Computer Vision"],
    highlights: [
      "Implemented underwater image enhancement and deep learning object detection pipelines using OpenCV and PyTorch, enabling real-time autonomous visual alignment and target tracking.",
      "Architected a modular autonomous decision framework using ROS and Behavior Trees, with over 10 reusable behavior nodes for motion control, waypoint navigation and visual centering.",
      "Won 1st place at the National Kontes Robot Bawah Air Indonesia 2024 (PUSPRESNAS) among 18 competing universities.",
      "Won 1st place at MATE ROV ASEAN 2023 with a remotely operated underwater robot built for precision subaquatic missions.",
    ],
    fullDescription: `Banyubramanta builds underwater robots that have to see, decide and move on their own in murky, low-contrast water.

As Senior Programmer, I worked on the software stack: cleaning up camera images underwater, detecting targets, and turning those detections into reliable autonomous behavior.`,
  },
  {
    title: "Jagoteknik",
    slug: "jagoteknik",
    image: "/assets/works/jagoteknik.png",
    overview:
      "An on-demand online and offline tutoring platform, a peer-to-peer edtech product focused on engineering courses.",
    role: "Front-end Developer",
    context: "Jago Teknik",
    period: "Jan 2024 – Mar 2025",
    techStack: ["Vite.js", "Tailwind CSS", "React", "React Query"],
    highlights: [
      "Built responsive web architecture and interactive dashboards for a peer-to-peer edtech platform spanning 20+ courses.",
      "Implemented dynamic course catalogs, checkout flows and user dashboards.",
    ],
    fullDescription: `Jagoteknik is an on-demand online and offline tutoring platform tailored to engineering courses, connecting students with peer tutors.

My role in the team was Front-end Developer.`,
  },
  {
    title: "SRE ITS",
    slug: "sre-its",
    image: "/assets/works/sre.png",
    overview:
      "An interactive \"About\" web portal for the SRE ITS organization, presenting its vision, structure and activities with high-end animations.",
    role: "Front-end Developer",
    context: "SRE ITS Student Chapter",
    techStack: ["Next.js", "Tailwind CSS", "React", "GSAP"],
    highlights: [
      "Crafted a responsive interface presenting the organization's vision, mission, structure and activities.",
      "Implemented engaging GSAP animations to elevate the user experience.",
    ],
    fullDescription: `SRE ITS is an interactive web portal and "About" page for the Student Chapter of SRE ITS. It conveys organizational information, including the chapter's vision, mission, structure and activities.

My role was Front-end Developer, focusing on a responsive interface and engaging animations.`,
  },
  {
    title: "MAGE X",
    slug: "mage-x",
    image: "/assets/works/mage.png",
    overview:
      "The official web platform for MAGE X, ITS's annual national computer engineering competition, covering event schedules, competition tracks and registration.",
    role: "Head of Web Development",
    context: "MAGE X · ITS",
    period: "Jan 2024 – Jan 2025",
    techStack: ["Vite.js", "Tailwind CSS", "React", "Framer Motion"],
    highlights: [
      "Led an 8-member cross-functional engineering team to build and deploy the platform.",
      "Delivered a high-traffic event platform covering participant registration, verification and live event management.",
    ],
    fullDescription: `MAGE X is the official web platform for the annual national computer engineering competition held by ITS. It provides event schedules, competition tracks and registration forms.

As Head of Web Development, I led the team and worked hands-on as a front-end developer.`,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
