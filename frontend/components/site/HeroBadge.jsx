"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import IdBadge from "@/components/IdBadge";

/** Hero visual: the 3D lanyard on wide screens, a framed photo elsewhere. */
export default function HeroBadge() {
  const ref = useRef(null);
  const [section, setSection] = useState(null);

  // Pointer events are read from the hero section, so the canvas can sit above
  // the text without blocking the buttons underneath it.
  useEffect(() => {
    setSection(ref.current?.closest("section") || null);
  }, []);

  const photo = (
    <div className="flex h-full items-center justify-center">
      <div className="rotate-2 rounded-2xl border border-rule bg-paper-2 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
        <Image
          src="/prajjwal.png"
          alt="Prajjwal Rawat"
          width={260}
          height={300}
          priority
          className="h-[300px] w-[260px] rounded-xl object-cover"
        />
      </div>
    </div>
  );

  return (
    <div ref={ref} className="h-full w-full">
      {section && (
        <IdBadge
          className="h-full w-full"
          minWidth={1024}
          fallback={photo}
          hint={false}
          cameraZ={12.5}
          offsetX={0.27}
          contentWidth={1152}
          eventSource={section}
        />
      )}
    </div>
  );
}
