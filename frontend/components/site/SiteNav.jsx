import Image from "next/image";
import Link from "next/link";
import profile from "@/data/profile";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteNav({ links = [] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <Link href="/recruiter" className="block shrink-0 rounded-full ring-1 ring-rule transition hover:ring-2 hover:ring-leaf">
          <Image
            src="/android-chrome-192x192.png"
            alt="Prajjwal Rawat, home"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <ul className="hidden items-center gap-6 font-label text-xs uppercase tracking-widest text-ink-2 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 font-label text-xs">
          <ThemeToggle scope="site" className="rounded-full border border-rule px-3 py-2 hover:border-ink" />
          <Link href="/" className="rounded-full border border-rule px-3 py-2 hover:border-ink">
            &gt;_<span className="hidden sm:inline"> Terminal</span>
          </Link>
          <a
            href={profile.resume.local}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-4 py-2 text-paper hover:bg-leaf"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
