import { PROJECTS } from "@/data/projects";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-[#e8dcc8] flex flex-col font-sans pt-24 px-8 md:px-16 lg:px-24 animate-in fade-in duration-1000">
      <div className="mb-12">
        <Link
          href="/#works-section"
          className="inline-flex items-center text-[#e8dcc8]/70 hover:text-[#e8dcc8] transition-colors border border-[#e8dcc8]/20 hover:border-[#e8dcc8]/50 px-6 py-2 rounded-full"
        >
          <span className="mr-2">←</span> Back to Works
        </Link>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-chomsky tracking-widest text-[#e8dcc8]/90 drop-shadow-md mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#e8dcc8]/50 font-light mb-8">
            {project.role}
          </p>
          
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 border border-[#e8dcc8]/20 rounded-full text-sm tracking-wider text-[#e8dcc8]/80 bg-white/[0.02]"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="w-full aspect-[16/9] md:aspect-[21/9] relative mb-16 rounded-xl overflow-hidden border border-[#e8dcc8]/10 bg-white/[0.02]">
          {/* Using a standard img tag for simplicity, can be replaced with next/image if configured */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
          />
        </div>

        <section className="prose prose-invert max-w-none text-lg md:text-xl font-light text-[#e8dcc8]/80 leading-relaxed mb-32 space-y-6">
          {project.fullDescription.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      </div>
    </main>
  );
}
