import { SITE, abs } from "@/lib/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: abs("/sitemap.xml"),
    host: SITE,
  };
}
