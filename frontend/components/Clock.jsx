"use client";

import { useEffect, useState } from "react";

// Rendered only after mount so the server and client markup match.
export default function Clock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span suppressHydrationWarning>{now ? now.toLocaleString() : ""}</span>;
}
