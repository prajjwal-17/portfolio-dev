"use client";

import { useRef } from "react";

/**
 * Card that tilts toward the pointer in 3D with a moving highlight.
 * Children can use `style={{ transform: "translateZ(..)" }}` to float above the surface.
 */
export default function TiltCard({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transition = "transform 80ms linear";
      el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(8px)`;
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
      el.style.setProperty("--glare-o", "1");
    });
  };

  const onLeave = () => {
    const el = ref.current;
    cancelAnimationFrame(frame.current);
    el.style.transition = "transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1)";
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    el.style.setProperty("--glare-o", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--glare-o, 0)",
          background:
            "radial-gradient(420px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.16), transparent 60%)",
        }}
      />
    </div>
  );
}
