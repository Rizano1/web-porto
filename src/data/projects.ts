export interface Project {
  title: string;
  slug: string;
  image: string;
  overview: string;
  role: string;
  techStack: string[];
  fullDescription: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Visual Inspection Automation",
    slug: "visual-inspection-automation",
    image: "/assets/works/robodog.png",
    overview:
      "Implemented an autonomous visual inspection system bridging human operators and a DeepRobotics Jueying Lite 3 quadruped robot via natural language. Uses Gemini LMM as reasoning engine and dynamic SOP integration via RAG for real-time anomaly detection. Integrated an LLM chatbot to control the robot via a web interface with SOP upload and camera capture viewing features.",
    role: "Solo Project",
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
    fullDescription: `This project implements an advanced autonomous visual inspection system utilizing a DeepRobotics Jueying Lite 3 quadruped robot and Google Gemini Large Multimodal Model (LMM) as the central reasoning engine.

The primary objective of this system is to bridge communication between human operators and the robot through natural language commands. The AI Agent autonomously plans, retrieves supporting information, and executes inspection missions. The system dynamically integrates Standard Operating Procedure (SOP) documents using Retrieval-Augmented Generation (RAG) to perform visual inspection and real-time anomaly detection via the robot's camera. Additionally, it incorporates a Human-in-the-Loop (HITL) mechanism to ensure operators can validate plans and action results before execution. The platform includes a web interface featuring an LLM chatbot for robot control, SOP document upload functionality, and real-time visual capture inspection monitoring.

This was my final capstone project, developed independently.`,
  },
  {
    title: "Jagoteknik",
    slug: "jagoteknik",
    image: "/assets/works/jagoteknik.png",
    overview:
      "An on-demand, online, and offline tutoring platform focusing on engineering courses.",
    role: "Front-end Developer",
    techStack: ["Vite.js", "Tailwind CSS", "React", "React Query"],
    fullDescription: `Jagoteknik is an on-demand online and offline tutoring platform tailored specifically for engineering courses.

My role in the team was as a Front-end Developer.`,
  },
  {
    title: "Adex AI Assistant",
    slug: "adex-ai-assistant",
    image: "/assets/works/adex.png",
    overview:
      "An AI assistant integrated into a company's ERP system. Leverages LLM and MCP to understand user commands and answer questions relevant to internal ERP data by autonomously querying internal tools.",
    role: "AI Engineer Intern",
    techStack: ["LLM", "MCP", "Python", "FastAPI", "RAG"],
    fullDescription: `Adex is an AI assistant integrated into an enterprise ERP system, designed to assist users in operating the ERP platform by leveraging LLMs to understand natural language commands and provide relevant context.

In this system, the LLM is equipped with tools via Model Context Protocol (MCP), granting it access to internal ERP data so that it can autonomously retrieve accurate and relevant answers to user queries.

My role was as an AI Engineer, focusing on the development of the LLM pipeline and custom MCP tools.`,
  },
  {
    title: "SRE ITS",
    slug: "sre-its",
    image: "/assets/works/sre.png",
    overview:
      "An interactive 'About' page web portal for the SRE ITS organization, conveying their vision, organizational structure, and activities with high-end animations.",
    role: "Front-end Developer",
    techStack: ["Next.js", "Tailwind CSS", "React", "GSAP"],
    fullDescription: `SRE ITS is an interactive web portal and "About" page for the Student Chapter of SRE ITS. It serves to convey organizational information, including their vision, mission, structure, and activities.

My role was as a Front-end Developer, focusing on crafting a responsive interface and implementing engaging animations to elevate the user experience.`,
  },
  {
    title: "MAGE X",
    slug: "mage-x",
    image: "/assets/works/mage.png",
    overview:
      "A dedicated web platform for MAGE X, an annual computer engineering competition at ITS, providing event schedules, information, and registration forms.",
    role: "Front-end Developer & Project Manager",
    techStack: ["Vite.js", "Tailwind CSS", "React", "Framer Motion"],
    fullDescription: `MAGE X is the official web platform for the annual national computer engineering competition held by ITS. It provides essential information regarding event schedules, competition tracks, and registration forms.

My role was as a Front-end Developer and Project Manager.`,
  },
];
