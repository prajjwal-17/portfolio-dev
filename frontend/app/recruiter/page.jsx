import Link from "next/link";
import profile from "@/data/profile";
import projects from "@/data/projects";
import skills from "@/data/skills";
import certifications from "@/data/certifications";
import milestones from "@/data/milestones";
import { getGithubStats } from "@/lib/github";
import { siteFonts } from "@/lib/fonts";
import { getExperience, getRole } from "@/lib/role";
import { DESCRIPTION, JsonLd, OG_IMAGES, siteJsonLd } from "@/lib/seo";

const TITLE = "Prajjwal Rawat | Software Engineer: Projects and Resume";
import SiteNav from "@/components/site/SiteNav";
import HeroBadge from "@/components/site/HeroBadge";
import Reveal from "@/components/site/Reveal";
import TiltCard from "@/components/site/TiltCard";
import CopyCredential from "@/components/site/CopyCredential";

export const revalidate = 3600;

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/recruiter" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/recruiter",
    type: "profile",
    siteName: "Prajjwal Rawat",
    images: OG_IMAGES,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: OG_IMAGES },
};

const NAV = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
];

const SKILL_GROUPS = [
  ["Languages", skills.programmingLanguages],
  ["Backend", skills.backend],
  ["Databases", skills.databases],
  ["Frontend", skills.frontend],
  ["Tools", skills.toolsAndPlatforms],
  ["Core CS", skills.concepts],
];

function SectionHead({ index, title, note }) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6 border-b border-ink pb-4">
      <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
        <span className="mr-3 align-top font-label text-sm font-medium text-leaf">{index}</span>
        {title}
      </h2>
      {note && <p className="hidden max-w-xs text-right text-sm text-ink-2 md:block">{note}</p>}
    </Reveal>
  );
}

export default async function Recruiter() {
  const github = await getGithubStats();
  const role = getRole();
  const experience = getExperience();

  const facts = [
    { value: "9.37", label: "CGPA at SRM IST" },
    { value: String(certifications.length), label: "Certifications: AWS, SAP, GitHub" },
    { value: String(experience.length), label: "Roles and internships" },
    github
      ? { value: String(github.publicRepos), label: "Public GitHub repos" }
      : { value: String(projects.length), label: "Featured projects" },
  ];

  return (
    <div className={`${siteFonts} min-h-dvh overflow-x-clip bg-paper font-body text-ink antialiased`}>
      <JsonLd data={siteJsonLd()} />
      <SiteNav links={NAV} />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl gap-6 px-5 pt-12 md:px-8 md:pt-16 lg:grid-cols-[1.25fr_1fr] lg:pt-20">
        <div className="pb-10 lg:pb-24">
          <p className="font-label text-xs uppercase tracking-[0.25em] text-leaf">
            {role.title} · {role.status}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.2rem,10vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight">
            Prajjwal
            <br />
            Rawat<span className="text-leaf">.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
            Software engineer and final-year Computer Science student at SRM IST. I build fast, reliable backend
            systems: a sub-30ms fraud scoring engine, an enterprise RAG platform with access control, and a
            real-time AI debate system.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 font-label text-sm">
            <a
              href={profile.resume.local}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-6 py-3.5 text-paper transition-colors hover:bg-leaf"
            >
              Download resume
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full border border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-paper"
            >
              Email me
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="px-3 py-3 underline underline-offset-4 hover:text-leaf">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-3 underline underline-offset-4 hover:text-leaf">
              LinkedIn
            </a>
          </div>
        </div>

        {/* On wide screens the badge's canvas spans the full page width over the hero (and a little below it),
            layered above the text, so the card can be dragged anywhere without being clipped. */}
        <div className="relative h-[360px] lg:pointer-events-none lg:absolute lg:left-1/2 lg:w-screen lg:-translate-x-1/2 lg:-top-16 lg:-bottom-44 lg:z-20 lg:h-auto">
          <HeroBadge />
        </div>
        <p className="pointer-events-none absolute bottom-6 right-0 hidden w-[46%] text-center font-label text-[11px] uppercase tracking-widest text-ink-2 lg:block">
          Drag the badge
        </p>
      </section>

      {/* FACTS */}
      <section className="border-y border-ink bg-ink text-paper">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4 md:px-8">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80} className="border-paper/15 py-7 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
              <dt className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">{f.value}</dt>
              <dd className="mt-2 font-label text-[11px] uppercase tracking-widest text-paper/60">{f.label}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <main className="mx-auto max-w-6xl px-5 md:px-8">
        {/* EXPERIENCE */}
        <section id="experience" className="scroll-mt-20 pt-24">
          <SectionHead index="01" title="Experience" />
          <ol>
            {experience.map((e, i) => (
              <Reveal as="li" key={e.company} delay={i * 60} className="grid gap-2 border-b border-rule py-7 md:grid-cols-[220px_1fr] md:gap-10">
                <div className="font-label text-xs uppercase tracking-widest text-ink-2">
                  <p>{e.duration}</p>
                  {e.location && <p className="mt-1">{e.location}</p>}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {e.company}
                    <span className="ml-3 font-body text-base font-normal text-ink-2">{e.role}</span>
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink-2">{e.description}</p>
                  {e.proof && (
                    <a href={e.proof} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-label text-xs underline underline-offset-4 hover:text-leaf">
                      View certificate ↗
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-20 pt-24">
          <SectionHead index="02" title="Projects" note="Each card opens the architecture diagram and a technical deep dive." />

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 90} className="h-full">
                <TiltCard className="h-full rounded-3xl">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="flex h-full min-h-[340px] flex-col rounded-3xl border border-rule bg-paper-2 p-7 transition-colors hover:border-ink md:p-9"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <p className="font-label text-xs uppercase tracking-widest text-ink-2">
                      {String(i + 1).padStart(2, "0")} · {p.date}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl" style={{ transform: "translateZ(30px)" }}>
                      {p.short}
                    </h3>
                    <p className="mt-2 min-h-[3.5rem] text-lg text-ink-2" style={{ transform: "translateZ(18px)" }}>
                      {p.tagline}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2 font-label text-[11px]" style={{ transform: "translateZ(24px)" }}>
                      {p.tech.slice(0, 5).map((t) => (
                        <li key={t} className="rounded-full border border-rule bg-paper px-3 py-1">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-auto pt-7 font-label text-sm text-leaf">Architecture and deep dive →</p>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-20 pt-24">
          <SectionHead index="03" title="Skills" />
          <dl className="grid gap-x-10 md:grid-cols-2">
            {SKILL_GROUPS.map(([name, items], i) => (
              <Reveal key={name} delay={(i % 2) * 70} className="grid grid-cols-[110px_1fr] gap-4 border-b border-rule py-5">
                <dt className="pt-1 font-label text-xs uppercase tracking-widest text-ink-2">{name}</dt>
                <dd className="text-lg leading-relaxed">{items.join(" · ")}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* CREDENTIALS */}
        <section id="credentials" className="scroll-mt-20 pt-24">
          <SectionHead index="04" title="Credentials" />
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="font-label text-xs uppercase tracking-widest text-leaf">Certifications</h3>
              <ul className="mt-3">
                {certifications.map((c, i) => (
                  <Reveal as="li" key={c.name} delay={i * 50} className="border-b border-rule py-4">
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="group flex items-baseline justify-between gap-4">
                      <span className="font-display text-xl font-bold tracking-tight group-hover:text-leaf">{c.name}</span>
                      <span className="shrink-0 font-label text-xs text-ink-2">{c.issueDate}</span>
                    </a>
                    <p className="mt-1 text-sm text-ink-2">{c.issuedBy}</p>
                    {c.credentialId && (
                      <>
                        <CopyCredential id={c.credentialId} />
                        <p className="mt-2 text-xs text-ink-2">
                          Copy the ID, then paste it on the{" "}
                          <a href={c.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-leaf">
                            AWS verification page ↗
                          </a>
                        </p>
                      </>
                    )}
                  </Reveal>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-label text-xs uppercase tracking-widest text-leaf">Honors and volunteering</h3>
              <ul className="mt-3">
                {milestones.map((m, i) => (
                  <Reveal as="li" key={m.name} delay={i * 50} className="border-b border-rule py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-xl font-bold tracking-tight">{m.name}</span>
                      <span className="shrink-0 font-label text-xs text-ink-2">{m.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-2">{m.event}</p>
                    {m.proof && (
                      <a href={m.proof} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-label text-xs underline underline-offset-4 hover:text-leaf">
                        View certificate ↗
                      </a>
                    )}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          <Reveal className="mt-12 grid gap-2 rounded-3xl border border-rule bg-paper-2 p-7 md:grid-cols-[220px_1fr] md:gap-10">
            <p className="font-label text-xs uppercase tracking-widest text-ink-2">Education</p>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight">B.Tech, Computer Science and Engineering</p>
              <p className="mt-1 text-ink-2">SRM Institute of Science and Technology, Kattankulathur · 2023 to 2027 · 9.37 / 10 CGPA</p>
              <p className="mt-3 text-ink-2">Summer Valley School, Dehradun · ISC Class 12: 95%</p>
            </div>
          </Reveal>
        </section>
      </main>

      {/* CONTACT */}
      <footer id="contact" className="mt-28 scroll-mt-20 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <Reveal>
            <p className="font-label text-xs uppercase tracking-[0.25em] text-leaf-inv">05 · Contact</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 block break-all font-display text-[clamp(1.7rem,5.6vw,4.5rem)] font-extrabold leading-tight tracking-tight hover:text-leaf-inv"
            >
              {profile.email}
            </a>
          </Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-paper/20 pt-6 font-label text-sm">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a href={`tel:${profile.phone.split(" ").join("")}`} className="hover:text-leaf-inv">
                  {profile.phone}
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-leaf-inv">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-leaf-inv">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={profile.resume.drive} target="_blank" rel="noopener noreferrer" className="hover:text-leaf-inv">
                  Resume on Drive ↗
                </a>
              </li>
            </ul>
            <Link href="/" className="text-paper/60 hover:text-paper">
              &gt;_ Prefer a terminal? Switch view
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
