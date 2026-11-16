import Link from "next/link";
import { notFound } from "next/navigation";
import projects from "@/data/projects";
import { siteFonts } from "@/lib/fonts";
import { JsonLd, OG_IMAGES, projectJsonLd } from "@/lib/seo";
import SiteNav from "@/components/site/SiteNav";
import Reveal from "@/components/site/Reveal";
import ArchitectureDiagram from "@/components/site/ArchitectureDiagram";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.short}: Architecture and Deep Dive`;
  const description = `${project.tagline}. High-level architecture and technical deep dive of ${project.short}, built by Prajjwal Rawat.`;
  return {
    title,
    description,
    keywords: [project.short, ...project.tech, "architecture", "system design", "Prajjwal Rawat"],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
      siteName: "Prajjwal Rawat",
      images: OG_IMAGES,
    },
    twitter: { card: "summary_large_image", title, description, images: OG_IMAGES },
  };
}

const NAV = [
  { href: "#architecture", label: "Architecture" },
  { href: "#overview", label: "Overview" },
  { href: "#deep-dive", label: "Deep dive" },
];

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className={`${siteFonts} min-h-dvh bg-paper font-body text-ink antialiased`}>
      <JsonLd data={projectJsonLd(project)} />
      <SiteNav links={NAV} />
      <main className="pb-24 pt-12 md:pt-16">
        <article>
          <header className="mx-auto max-w-4xl px-5 md:px-8">
            <Link href="/recruiter#projects" className="font-label text-xs uppercase tracking-widest text-ink-2 hover:text-ink">
              ← All projects
            </Link>

            <p className="mt-10 font-label text-xs uppercase tracking-[0.25em] text-leaf">
              Project {String(index + 1).padStart(2, "0")} · {project.date}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight">
              {project.short}
              <span className="text-leaf">.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink-2">{project.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-3 font-label text-sm">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-6 py-3.5 text-paper transition-colors hover:bg-leaf">
                View code on GitHub ↗
              </a>
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-paper">
                  Live demo ↗
                </a>
              )}
            </div>
          </header>

          {/* Architecture: wider than the text column so the diagram stays readable */}
          <section id="architecture" className="mx-auto mt-16 max-w-6xl scroll-mt-20 px-5 md:px-8">
            <h2 className="mb-6 border-b border-ink pb-3 font-display text-3xl font-extrabold tracking-tight">
              High-level architecture
            </h2>
            <ArchitectureDiagram architecture={project.architecture} title={project.short} />
          </section>

          <div className="mx-auto mt-16 grid max-w-4xl gap-12 px-5 md:grid-cols-[1fr_240px] md:px-8">
            <section id="overview" className="scroll-mt-20">
              <h2 className="border-b border-ink pb-3 font-display text-3xl font-extrabold tracking-tight">Overview</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-2">{project.description}</p>

              <h2 className="mt-12 border-b border-ink pb-3 font-display text-3xl font-extrabold tracking-tight">
                What I built
              </h2>
              <ul>
                {project.highlights.map((h, i) => (
                  <Reveal as="li" key={h} delay={i * 60} className="grid grid-cols-[40px_1fr] border-b border-rule py-5">
                    <span className="pt-1 font-label text-xs text-leaf">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg leading-relaxed">{h}</span>
                  </Reveal>
                ))}
              </ul>
            </section>

            <aside>
              <h2 className="font-label text-xs uppercase tracking-widest text-ink-2">Built with</h2>
              <ul className="mt-4 flex flex-wrap gap-2 font-label text-xs md:flex-col md:items-start">
                {project.tech.map((t) => (
                  <li key={t} className="rounded-full border border-rule bg-paper-2 px-3 py-1.5">
                    {t}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* Deep dive */}
          <section id="deep-dive" className="mx-auto mt-20 max-w-4xl scroll-mt-20 px-5 md:px-8">
            <p className="font-label text-xs uppercase tracking-[0.25em] text-leaf">Deep dive</p>
            <h2 className="mt-3 border-b border-ink pb-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              How it works under the hood
            </h2>
            <ol>
              {project.deepDive.map((d, i) => (
                <Reveal as="li" key={d.title} delay={i * 50} className="grid gap-3 border-b border-rule py-8 md:grid-cols-[64px_1fr]">
                  <span className="font-display text-3xl font-extrabold text-leaf">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">{d.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-ink-2">{d.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </section>
        </article>

        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Link href={`/projects/${next.slug}`} className="group mt-20 flex items-end justify-between gap-6 border-t border-ink pt-6">
            <span>
              <span className="font-label text-xs uppercase tracking-widest text-ink-2">Next project</span>
              <span className="mt-2 block font-display text-4xl font-extrabold tracking-tight group-hover:text-leaf">
                {next.short}
              </span>
            </span>
            <span className="font-display text-4xl group-hover:text-leaf">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
