import projects from "@/data/projects";
import { abs } from "@/lib/seo";

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: abs("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: abs("/recruiter"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: abs(`/projects/${p.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
