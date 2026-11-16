"use client";

import { useRef, useState } from "react";

/** Shows a credential ID with a one-click copy button and brief "Copied" feedback. */
export default function CopyCredential({ id }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      // Older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = id;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 font-label text-xs">
      <span className="text-ink-2">Credential ID</span>
      <code className="rounded-md border border-rule bg-paper-2 px-2 py-1 break-all">{id}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy credential ID ${id}`}
        className={`rounded-full border px-3 py-1 transition-colors ${
          copied ? "border-leaf bg-leaf text-paper" : "border-ink hover:bg-ink hover:text-paper"
        }`}
      >
        <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
      </button>
    </div>
  );
}
