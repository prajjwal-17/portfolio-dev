"use client";

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IdCardFallback from "@/components/IdCardFallback";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The swinging ID badge. Uses the WebGL lanyard when the browser supports it
 * and the viewport is at least `minWidth` wide; otherwise shows `fallback`
 * (the CSS card by default).
 */
export default function IdBadge({ className = "", minWidth = 768, fallback, hint = true, cameraZ, offsetX, contentWidth, eventSource }) {
  const [mode, setMode] = useState("pending"); // pending | webgl | fallback

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const decide = () => setMode(mq.matches && hasWebGL() ? "webgl" : "fallback");
    decide();
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, [minWidth]);

  const plain = fallback === undefined ? <IdCardFallback /> : fallback;

  if (mode === "pending") return <div className={className} />;
  if (mode === "fallback") return <div className={className}>{plain}</div>;

  return (
    <Boundary fallback={<div className={className}>{plain}</div>}>
      <div className={`relative ${className}`}>
        <Lanyard className="absolute inset-0" cameraZ={cameraZ} offsetX={offsetX} contentWidth={contentWidth} eventSource={eventSource} />
        {hint && (
          <p className="term-muted pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs select-none">
            [drag the badge]
          </p>
        )}
      </div>
    </Boundary>
  );
}
