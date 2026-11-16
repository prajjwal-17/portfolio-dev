import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { DESCRIPTION, KEYWORDS, SITE } from "@/lib/seo";

const TITLE = "Prajjwal Rawat | Software Engineer (SWE), Backend and AI";

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s | Prajjwal Rawat" },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: "Prajjwal Rawat",
  authors: [{ name: "Prajjwal Rawat", url: SITE }],
  creator: "Prajjwal Rawat",
  publisher: "Prajjwal Rawat",
  category: "technology",
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Prajjwal Rawat",
    locale: "en_IN",
    type: "profile",
    firstName: "Prajjwal",
    lastName: "Rawat",
    username: "prajjwal-17",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
  ],
};

// Applies saved themes before first paint so there is no flash.
// The recruiter view follows the system setting until the visitor picks one.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("term-theme"),s=localStorage.getItem("site-theme");if(t&&t!=="green")d.dataset.theme=t;if(s==="dark"||(!s&&matchMedia("(prefers-color-scheme: dark)").matches))d.dataset.siteTheme="dark";}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
