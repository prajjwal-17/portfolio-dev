import projects from "@/data/projects";
import certifications from "@/data/certifications";
import { getExperience, getRole } from "@/lib/role";
import skills from "@/data/skills";
import milestones from "@/data/milestones";
import profile from "@/data/profile";

export const THEMES = ["green", "amber", "ice", "mono", "paper"];
const THEME_ALIASES = { dark: "green", light: "paper" };

// Commands shown as clickable chips above the terminal.
export const CHIP_COMMANDS = [
  "help",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "certifications",
  "milestones",
  "github",
  "contact",
  "resume",
  "gui",
  "clear",
];

export const ALL_COMMANDS = [
  ...CHIP_COMMANDS,
  "neofetch",
  "open",
  "theme",
  "recruiter",
  "history",
  "whoami",
  "ls",
  "sudo",
  "welcome",
];

export const welcome = () => `Hi, I'm ${profile.name}, a ${profile.title} and ${getRole().status}.
Welcome to my interactive portfolio terminal!
Type 'help' to see available commands, or click a command above.
Prefer a regular website? Type 'gui' for the recruiter view.`;

export const BOOT = `<span class="term-ok">[ OK ]</span> Mounting /home/prajjwal
<span class="term-ok">[ OK ]</span> Loading projects, experience, certifications
<span class="term-ok">[ OK ]</span> Starting interactive shell
`;

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const link = (href, label = href) => {
  const external = /^https?:/.test(href);
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a class="term-link" href="${href}"${attrs}>${label}</a>`;
};

const HELP = `Available commands:
about           - Learn about me
projects        - View my projects
open &lt;project&gt;  - Open a project page (e.g. open meridian)
skills          - See my technical skills
experience      - View my work experience
education       - View my academic history
certifications  - View my certifications
milestones      - View my milestones and honors
github          - Live stats from my GitHub
contact         - View my contact details
resume          - View my resume
neofetch        - System-style summary
theme &lt;name&gt;    - Change colors (light, dark, ${THEMES.join(", ")})
gui             - Switch to the recruiter view
history         - Show commands you have run
clear           - Clear terminal screen

Tips: Up/Down recalls commands, Tab autocompletes, Ctrl+C cancels output.`;

const projectList = () =>
  projects
    .map((p, i) => {
      let str = `${i + 1}. ${p.name}
   ${p.description}
   GitHub : ${link(p.github)}`;
      if (p.liveDemo) str += `\n   Live Demo : ${link(p.liveDemo)}`;
      str += `\n   Details : ${link(`/projects/${p.slug}`, `open ${p.slug}`)}`;
      return str;
    })
    .join("\n\n");

const certList = () =>
  certifications
    .map((cert, i) => {
      let str = `${i + 1}. ${cert.name}
   Issued By: ${cert.issuedBy}
   Date: ${cert.issueDate}
   Description: ${cert.description}`;
      if (cert.link) str += `\n   Link: ${link(cert.link)}`;
      return str;
    })
    .join("\n\n");

const experienceList = () =>
  getExperience()
    .map((exp, i) => {
      let str = `${i + 1}. ${exp.role}, ${exp.company}`;
      if (exp.location) str += `\n   Location: ${exp.location}`;
      str += `\n   Duration: ${exp.duration}
   Description: ${exp.description}`;
      if (exp.proof) str += `\n   Proof: ${link(exp.proof)}`;
      return str;
    })
    .join("\n\n");

const milestoneList = () =>
  milestones
    .map((m, i) => {
      let str = `${i + 1}. 🏆 ${m.name}
   Event: ${m.event}
   Date: ${m.date}
   Description: ${m.description}`;
      if (m.proof) str += `\n   Proof: ${link(m.proof)}`;
      return str;
    })
    .join("\n\n");

const education = () =>
  profile.education
    .map((e, i) => {
      const rows = e.rows.map(([k, v]) => `   ${k.padEnd(12)}: ${v}`);
      return [`${i + 1}. ${e.icon} ${e.school}`, ...rows].join("\n");
    })
    .join("\n");

const skillList = () => `🛠 Technical Skills:
• Programming Languages : ${skills.programmingLanguages.join(", ")}
• Frontend Technologies : ${skills.frontend.join(", ")}
• Backend Technologies  : ${skills.backend.join(", ")}
• Databases             : ${skills.databases.join(", ")}
• Tools & Platforms     : ${skills.toolsAndPlatforms.join(", ")}
• Concepts              : ${skills.concepts.join(", ")}`;

const contact = () => `Contact Details:
📞 Phone : ${link(`tel:${profile.phone.split(" ").join("")}`, profile.phone)}
📧 Email : ${link(`mailto:${profile.email}`, profile.email)}
🔗 LinkedIn : ${link(profile.linkedin, "linkedin.com/in/prajjwal-rawat-886151278")}
💻 GitHub : ${link(profile.github)}
📸 Instagram : ${link(profile.instagram, "instagram.com/prajjwal_17_")}`;

const resume = () => `📄 Resume Details:
Last Updated: ${profile.resume.lastUpdated}
View (Google Drive): ${link(profile.resume.drive)}
Download (PDF): ${link(profile.resume.local, "prajjwalrawat.xyz/resume.pdf")}`;

const neofetch = (theme) => {
  const art = [
    "  ____  ____  ",
    " |  _ \\|  _ \\ ",
    " | |_) | |_) |",
    " |  __/|  _ < ",
    " |_|   |_| \\_\\",
    "              ",
    "              ",
    "              ",
  ];
  void theme;
  const info = [
    `<span class="term-ok">prajjwal@portfolio</span>`,
    "------------------",
    `Role      : ${profile.title}`,
    `Status    : ${getRole().status}`,
    `Education : B.Tech CSE, SRM IST (9.37 CGPA)`,
    `Languages : ${skills.programmingLanguages.join(", ")}`,
    `Backend   : ${skills.backend.slice(0, 3).join(", ")}`,
    `Projects  : ${projects.length} featured, ${certifications.length} certifications`,
  ];
  return art.map((a, i) => `${a}   ${info[i] || ""}`).join("\n");
};

const githubStats = async () => {
  const res = await fetch("/api/github");
  if (!res.ok) return `Could not reach GitHub right now. Profile: ${link(profile.github)}`;
  const g = await res.json();
  const langs = g.languages.map((l) => `${l.name} (${l.count})`).join(", ");
  const recent = g.recent
    .map((r) => `   ${link(r.url, r.name)}${r.language ? ` [${r.language}]` : ""}${r.stars ? ` ★${r.stars}` : ""}`)
    .join("\n");
  return `💻 GitHub: ${link(g.url, "@" + g.username)}
Public repos : ${g.publicRepos}
Stars        : ${g.stars}
Followers    : ${g.followers}
Top languages: ${langs}
Recently active:
${recent}`;
};

const findProject = (arg) => {
  const q = arg.toLowerCase();
  const n = Number(q);
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1];
  return (
    projects.find((p) => p.slug === q) ||
    projects.find((p) => p.slug.startsWith(q) || p.short.toLowerCase().startsWith(q))
  );
};

/**
 * Turn raw input into terminal output.
 * Returns { text, effect } where effect is an optional side effect for the UI:
 * { type: "clear" } | { type: "navigate", href } | { type: "theme", name }
 */
export async function resolveCommand(raw, ctx) {
  const input = raw.trim();
  const [name, ...rest] = input.split(/\s+/);
  const cmd = name.toLowerCase();
  const arg = rest.join(" ");

  switch (cmd) {
    case "help":
      return { text: HELP };
    case "about":
      return { text: profile.about };
    case "welcome":
      return { text: welcome() };
    case "projects":
      return { text: projectList() };
    case "certifications":
      return { text: certList() };
    case "experience":
      return { text: experienceList() };
    case "education":
      return { text: education() };
    case "skills":
      return { text: skillList() };
    case "contact":
      return { text: contact() };
    case "resume":
      return { text: resume() };
    case "milestones":
      return { text: milestoneList() };
    case "github":
      try {
        return { text: await githubStats() };
      } catch {
        return { text: `Could not reach GitHub right now. Profile: ${link(profile.github)}` };
      }
    case "neofetch":
      return { text: neofetch(ctx.theme) };
    case "whoami":
      return { text: "visitor (but you could be my next teammate)" };
    case "ls":
      return { text: projects.map((p) => p.slug + "/").join("  ") + "  resume.pdf" };
    case "history":
      return {
        text: ctx.history.length
          ? ctx.history.map((h, i) => `${String(i + 1).padStart(3)}  ${escapeHtml(h)}`).join("\n")
          : "No commands yet.",
      };
    case "open": {
      if (!arg) {
        return { text: `Usage: open &lt;project&gt;\nProjects: ${projects.map((p) => p.slug).join(", ")}` };
      }
      if (arg.toLowerCase() === "resume.pdf" || arg.toLowerCase() === "resume") {
        return { text: "Opening resume...", effect: { type: "navigate", href: profile.resume.local } };
      }
      const p = findProject(arg);
      if (!p) {
        return {
          text: `No project matches '${escapeHtml(arg)}'. Try: ${projects.map((x) => x.slug).join(", ")}`,
        };
      }
      return { text: `Opening ${p.short}...`, effect: { type: "navigate", href: `/projects/${p.slug}` } };
    }
    case "theme": {
      if (!arg) {
        return { text: `Current theme: ${ctx.theme}\nAvailable: ${THEMES.join(", ")}\nUsage: theme &lt;name&gt;` };
      }
      const t = THEME_ALIASES[arg.toLowerCase()] || arg.toLowerCase();
      if (!THEMES.includes(t)) {
        return { text: `Unknown theme '${escapeHtml(arg)}'. Available: ${THEMES.join(", ")}` };
      }
      return { text: `Theme set to ${t}.`, effect: { type: "theme", name: t } };
    }
    case "gui":
    case "recruiter":
      return { text: "Switching to the recruiter view...", effect: { type: "navigate", href: "/recruiter" } };
    case "sudo":
      if (arg.toLowerCase().replace(/[\s_]/g, "-") === "hire-me") {
        return {
          text: `[sudo] password for recruiter: ********
Access granted.
Candidate : ${profile.name}
Status    : ${getRole().status}
Next step : ${link(`mailto:${profile.email}`, profile.email)}
Resume    : ${link(profile.resume.local, "resume.pdf")}`,
        };
      }
      return { text: "Permission denied. (Try: sudo hire-me)" };
    case "clear":
      return { text: "", effect: { type: "clear" } };
    default:
      return { text: `Command not found: ${escapeHtml(input)}. Type 'help' to see available commands.` };
  }
}

/** Tab completion: returns the completed input, or the input unchanged. */
export function complete(input) {
  const parts = input.split(/\s+/);
  const common = (list) => {
    if (!list.length) return "";
    let prefix = list[0];
    for (const item of list) {
      while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
  };
  if (parts.length <= 1) {
    const matches = ALL_COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
    if (!matches.length) return input;
    return matches.length === 1 ? matches[0] + " " : common(matches);
  }
  const head = parts[0].toLowerCase();
  const tail = parts.slice(1).join(" ").toLowerCase();
  const options =
    head === "open" ? projects.map((p) => p.slug) : head === "theme" ? [...THEMES, "light", "dark"] : head === "sudo" ? ["hire-me"] : [];
  const matches = options.filter((o) => o.startsWith(tail));
  if (!matches.length) return input;
  return `${head} ${matches.length === 1 ? matches[0] : common(matches)}`;
}
