import Image from "next/image";
import Link from "next/link";
import Terminal from "@/components/Terminal";
import IdBadge from "@/components/IdBadge";
import Clock from "@/components/Clock";
import ThemeToggle from "@/components/ThemeToggle";
import profile from "@/data/profile";
import projects from "@/data/projects";
import certifications from "@/data/certifications";
import { getExperience, getRole } from "@/lib/role";
import { JsonLd, siteJsonLd } from "@/lib/seo";

// Re-rendered hourly so the role line flips on the internship start date.
export const revalidate = 3600;

export default function Home() {
  const role = getRole();
  const experience = getExperience();

  return (
    <div className="h-dvh bg-term-bg text-term-fg font-mono flex flex-col overflow-hidden">
      <JsonLd data={siteJsonLd()} />

      {/* HEADER */}
      <header className="flex items-center justify-between gap-3 border-b border-term-dim p-3 md:p-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* Compact ID for phones, where the 3D badge is hidden */}
          <Image
            src="/prajjwal.png"
            alt="Prajjwal Rawat"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded border border-term-dim object-cover md:hidden"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold md:text-3xl">{profile.name}</h1>
            <p className="truncate text-xs md:text-lg">
              {role.title}
              <span className="term-muted"> · </span>
              <span className="text-term-accent">{role.status}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs md:text-sm">
          <ThemeToggle scope="term" className="rounded border border-term-dim px-3 py-1.5 hover:text-term-accent" />
          <Link href="/recruiter" className="rounded border border-term-dim px-3 py-1.5 hover:text-term-accent">
            <span className="sm:hidden">GUI →</span>
            <span className="hidden sm:inline">Recruiter view →</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 min-h-0">
        {/* LEFT: 3D badge, desktop only */}
        <div className="hidden md:block md:w-1/2 border-r border-term-dim min-h-0">
          <IdBadge className="h-full w-full" />
        </div>

        {/* RIGHT: terminal, full width on mobile */}
        <div className="w-full md:w-1/2 min-h-0 p-2 md:p-4">
          <Terminal />
        </div>
      </main>

      {/* The same content as the terminal commands, as plain HTML for screen readers and search engines */}
      <section className="sr-only" aria-label="Portfolio summary">
        <h2>About {profile.name}</h2>
        <p>
          {profile.name}, {role.title}. {role.status}. {profile.about}
        </p>
        <h2>Experience</h2>
        <ul>
          {experience.map((e) => (
            <li key={e.company}>
              {e.role}, {e.company} ({e.duration}). {e.description}
            </li>
          ))}
        </ul>
        <h2>Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`}>{p.name}</Link>: {p.description}
            </li>
          ))}
        </ul>
        <h2>Certifications</h2>
        <ul>
          {certifications.map((c) => (
            <li key={c.name}>
              {c.name}, {c.issuedBy}, {c.issueDate}
            </li>
          ))}
        </ul>
        <p>
          <Link href="/recruiter">Recruiter view: experience, projects, skills and contact</Link>.{" "}
          <a href={profile.resume.local}>Download resume (PDF)</a>.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="flex justify-between border-t border-term-dim p-3 text-xs md:text-sm">
        <span>$prajjwalrawat/portfolio</span>
        <Clock />
      </footer>
    </div>
  );
}
