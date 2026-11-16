"use client";

import { useEffect, useState } from "react";

const read = (scope) => {
  const d = document.documentElement.dataset;
  return scope === "site" ? d.siteTheme === "dark" : d.theme !== "paper";
};

/**
 * Light/dark switch. scope="site" controls the recruiter view and project pages,
 * scope="term" controls the terminal. Each view remembers its own choice.
 */
export default function ThemeToggle({ scope, className = "" }) {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    const sync = () => setDark(read(scope));
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, [scope]);

  const toggle = () => {
    const next = !read(scope);
    const d = document.documentElement.dataset;
    try {
      if (scope === "site") {
        if (next) d.siteTheme = "dark";
        else delete d.siteTheme;
        localStorage.setItem("site-theme", next ? "dark" : "light");
      } else {
        // Going dark restores the last dark terminal palette (green by default).
        const lastDark = localStorage.getItem("term-theme-dark") || "green";
        if (!next && d.theme && d.theme !== "paper") localStorage.setItem("term-theme-dark", d.theme);
        const name = next ? lastDark : "paper";
        if (name === "green") delete d.theme;
        else d.theme = name;
        localStorage.setItem("term-theme", name);
      }
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
    >
      <span aria-hidden>{dark === null ? "◐" : dark ? "☀" : "☾"}</span>
      <span className="ml-1.5 hidden sm:inline">{dark === null ? "Theme" : dark ? "Light" : "Dark"}</span>
    </button>
  );
}
