import { ImageResponse } from "next/og";

export const alt = "Prajjwal Rawat, software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#4ade80",
          padding: 72,
          fontFamily: "monospace",
          border: "6px solid #16a34a",
        }}
      >
        <div style={{ display: "flex", fontSize: 30 }}>
          <span style={{ color: "#60a5fa" }}>prajjwal@portfolio</span>
          <span>:~$ whoami</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -2 }}>Prajjwal Rawat</div>
          <div style={{ display: "flex", fontSize: 38, marginTop: 16, color: "#86efac" }}>
            Software Engineer · Backend and AI systems
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span>prajjwalrawat.xyz</span>
          <span>FastAPI · Node.js · Next.js · PostgreSQL</span>
        </div>
      </div>
    ),
    size
  );
}
