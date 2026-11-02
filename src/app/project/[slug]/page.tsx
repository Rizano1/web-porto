import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProject, PROJECTS } from "@/data/projects";

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.indexOf(project);
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
  const meta = [
    { label: "Role", value: project.role },
    { label: "Context", value: project.context },
    { label: "Period", value: project.period },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <main className="min-h-screen bg-black text-cream flex flex-col font-sans pt-24 px-6 sm:px-8 md:px-16 lg:px-24">
      <div className="mb-12">
        <Link
          href="/#works-section"
          className="inline-flex items-center text-cream/70 hover:text-cream transition-colors border border-cream/20 hover:border-cream/50 px-6 py-2 rounded-full"
        >
          <span className="mr-2">←</span> Back to Works
        </Link>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-chomsky tracking-widest text-cream/90 drop-shadow-md mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-cream/50 font-light">
            {[project.role, project.context].filter(Boolean).join(" · ")}
          </p>
        </header>

        <div className="w-full aspect-[16/9] relative mb-16 rounded-xl overflow-hidden border border-cream/10 bg-white/[0.02]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
          />
        </div>

        <p className="text-2xl md:text-3xl font-light text-cream/90 leading-snug mb-20 max-w-4xl">
          {project.overview}
        </p>

        <div className="grid gap-16 lg:grid-cols-[1fr_18rem] mb-24">
          <section>
            <h2 className="text-sm uppercase tracking-[0.3em] text-cream/40 mb-8">What I did</h2>
            <ul className="space-y-6">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="flex gap-6 text-lg md:text-xl font-light text-cream/80 leading-relaxed">
                  <span className="text-cream/30 font-mono text-sm pt-1.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-10 lg:border-l lg:border-cream/10 lg:pl-10">
            {meta.map((item) => (
              <div key={item.label}>
                <h2 className="text-sm uppercase tracking-[0.3em] text-cream/40 mb-2">{item.label}</h2>
                <p className="text-lg font-light text-cream/80">{item.value}</p>
              </div>
            ))}
            {project.techStack.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-[0.3em] text-cream/40 mb-4">Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border border-cream/20 rounded-full text-sm tracking-wider text-cream/80 bg-white/[0.02]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <section className="mb-24">
          <h2 className="text-sm uppercase tracking-[0.3em] text-cream/40 mb-8">About the project</h2>
          <div className="text-lg md:text-xl font-light text-cream/70 leading-relaxed space-y-6 max-w-3xl">
            {project.fullDescription.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        <Link
          href={`/project/${nextProject.slug}`}
          className="group block border-t border-cream/10 py-12 mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-cream/40">Next project</span>
          <span className="mt-4 flex items-center justify-between gap-6 text-3xl md:text-5xl font-extralight text-cream/70 group-hover:text-cream transition-colors duration-500">
            {nextProject.title}
            <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
          </span>
        </Link>
      </div>
    </main>
  );
}
