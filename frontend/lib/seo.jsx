import profile from "@/data/profile";
import skills from "@/data/skills";
import { getRole, SPENSE } from "@/lib/role";

export const SITE = profile.site;
export const abs = (path = "/") => new URL(path, SITE).toString();

// Kept under 160 characters so search results show it in full.
export const DESCRIPTION =
  "Prajjwal Rawat is a software engineer (SWE) and final-year CS student at SRM IST building backend and AI systems: fraud detection, enterprise RAG and more.";

// Shared social preview image; pages that set their own openGraph must include it.
export const OG_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prajjwal Rawat, software engineer" }];

export const KEYWORDS = [
  "Prajjwal Rawat",
  "Prajjwal Rawat portfolio",
  "Prajjwal Rawat software engineer",
  "Prajjwal Rawat SRM",
  "software engineer",
  "SWE",
  "SDE",
  "software development engineer",
  "SWE intern",
  "SDE intern",
  "backend engineer",
  "full stack developer",
  "Spense",
  "SRM IST Chennai",
  "FastAPI",
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "RAG",
  "retrieval augmented generation",
  "fraud detection",
  "AWS Certified",
];

/** schema.org Person for search engines. */
export function personJsonLd(now = new Date()) {
  const role = getRole(now);
  return {
    "@type": "Person",
    "@id": abs("/#person"),
    name: profile.name,
    url: SITE,
    image: abs("/prajjwal.png"),
    jobTitle: role.title,
    description: DESCRIPTION,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Dehradun", addressRegion: "Uttarakhand", addressCountry: "IN" },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "SRM Institute of Science and Technology",
      url: "https://www.srmist.edu.in",
    },
    ...(role.started ? { worksFor: { "@type": "Organization", name: SPENSE.name, url: SPENSE.url } } : {}),
    sameAs: [profile.linkedin, profile.github, profile.instagram],
    knowsAbout: [
      ...skills.programmingLanguages,
      ...skills.backend,
      ...skills.databases,
      ...skills.frontend,
      "Retrieval-Augmented Generation",
      "Machine Learning",
      "Distributed Systems",
    ],
  };
}

export function siteJsonLd(now = new Date()) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(now),
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        url: SITE,
        name: "Prajjwal Rawat",
        description: DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": abs("/#person") },
      },
      {
        "@type": "ProfilePage",
        "@id": abs("/recruiter#profile"),
        url: abs("/recruiter"),
        name: "Prajjwal Rawat | Software Engineer",
        isPartOf: { "@id": abs("/#website") },
        mainEntity: { "@id": abs("/#person") },
      },
    ],
  };
}

export function projectJsonLd(project) {
  const url = abs(`/projects/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#project`,
        name: project.name,
        description: project.description,
        url,
        codeRepository: project.github,
        programmingLanguage: project.tech,
        author: { "@id": abs("/#person") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Prajjwal Rawat", item: SITE },
          { "@type": "ListItem", position: 2, name: "Projects", item: abs("/recruiter#projects") },
          { "@type": "ListItem", position: 3, name: project.short, item: url },
        ],
      },
    ],
  };
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
