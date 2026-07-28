"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROJECTS } from "@/data/projects";

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const items = document.querySelectorAll(".work-item-anim");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="works-section"
      className="relative w-full bg-black text-[#e8dcc8] py-24 z-10 min-h-[130vh]"
    >
      <div className="w-full px-8 md:px-16 lg:px-24 mb-16">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-chomsky tracking-widest text-[#e8dcc8]/90 drop-shadow-md">
          SELECTED WORKS
        </h2>
      </div>

      <div className="flex flex-col w-full px-8 md:px-16 lg:px-24 border-t border-[#e8dcc8]/10 mt-8">
        {PROJECTS.map((project, index) => (
          <Link
            key={index}
            href={`/project/${project.slug}`}
            className="work-item-anim opacity-0 hover:scale-x-105 translate-y-8 transition-all duration-500 ease-out group block w-full py-5 md:py-10 border-b border-[#e8dcc8]/10 hover:border-[#e8dcc8]/30 hover:bg-white/[0.02]"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform duration-500 ease-out group-hover:translate-x-12">
              <div className="flex flex-col">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-[#e8dcc8]/80 group-hover:text-[#e8dcc8] transition-colors duration-500">
                  {project.title}
                </h3>
                <p className="text-lg md:text-xl text-[#e8dcc8]/50 group-hover:text-[#e8dcc8]/80 transition-colors duration-500 font-light">
                  {project.role}
                </p>
              </div>
              <div className="hidden md:flex opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                <span className="text-[#e8dcc8]/70 text-lg border border-[#e8dcc8]/20 px-6 py-2 rounded-full">
                  View Project
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
