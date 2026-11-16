// High-level architecture diagram rendered as SVG from project data.
// Colors come from the site theme tokens, so it follows light and dark mode.

const NODE_W = 220;
const NODE_H = 70;
const COL_W = 356;
const ROW_H = 120;
const PAD_X = 34;
const TOP = 58;
const PAD_BOTTOM = 34;

const center = (n) => ({
  x: PAD_X + n.col * COL_W + NODE_W / 2,
  y: TOP + n.row * ROW_H + NODE_H / 2,
});

// Point where the line from a node's center toward (tx, ty) leaves its box.
function edgePoint(n, tx, ty, gap = 5) {
  const c = center(n);
  const dx = tx - c.x;
  const dy = ty - c.y;
  if (!dx && !dy) return c;
  const hw = NODE_W / 2 + gap;
  const hh = NODE_H / 2 + gap;
  const scale = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return { x: c.x + dx * scale, y: c.y + dy * scale };
}

const NODE_STYLE = {
  actor: { className: "fill-ink stroke-ink", text: "fill-paper", sub: "fill-paper", rx: 32 },
  service: { className: "fill-paper stroke-ink", text: "fill-ink", sub: "fill-ink-2", rx: 10 },
  store: { className: "fill-paper-2 stroke-ink", text: "fill-ink", sub: "fill-ink-2", rx: 32 },
  external: { className: "fill-paper stroke-ink", text: "fill-ink", sub: "fill-ink-2", rx: 10, dash: "6 5" },
};

const LEGEND = [
  ["actor", "Person"],
  ["service", "Service I built"],
  ["store", "Data store"],
  ["external", "External / separate service"],
];

export default function ArchitectureDiagram({ architecture, title }) {
  const { lanes, nodes, groups = [], edges } = architecture;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = PAD_X * 2 + (lanes.length - 1) * COL_W + NODE_W;
  const height = TOP + (rows - 1) * ROW_H + NODE_H + PAD_BOTTOM;
  const markerId = `arrow-${title.replace(/\W+/g, "-")}`;

  return (
    <figure>
      <div className="overflow-x-auto rounded-3xl border border-rule bg-paper-2/40">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`High-level architecture of ${title}`}
          className="block h-auto w-full min-w-[980px] font-body"
        >
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-ink" />
            </marker>
          </defs>

          {/* Lane headings */}
          {lanes.map((lane, i) => (
            <text
              key={lane}
              x={PAD_X + i * COL_W + NODE_W / 2}
              y={28}
              textAnchor="middle"
              className="fill-ink-2 font-label"
              style={{ fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {lane}
            </text>
          ))}

          {/* Deployable-unit boundaries */}
          {groups.map((g) => {
            const members = g.ids.map((id) => byId[id]);
            const cols = members.map((n) => n.col);
            const rws = members.map((n) => n.row);
            const x = PAD_X + Math.min(...cols) * COL_W - 16;
            const y = TOP + Math.min(...rws) * ROW_H - 16;
            const w = (Math.max(...cols) - Math.min(...cols)) * COL_W + NODE_W + 32;
            const h = (Math.max(...rws) - Math.min(...rws)) * ROW_H + NODE_H + 32;
            return (
              <rect
                key={g.label}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={18}
                className="fill-leaf/5 stroke-leaf"
                strokeWidth={1.5}
                strokeDasharray="3 6"
              />
            );
          })}

          {/* Connections */}
          {edges.map(([from, to, label]) => {
            const a = byId[from];
            const b = byId[to];
            const ca = center(a);
            const cb = center(b);
            const p1 = edgePoint(a, cb.x, cb.y, 2);
            const p2 = edgePoint(b, ca.x, ca.y, 6);
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const lw = label ? label.length * 7.1 + 18 : 0;
            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  className="stroke-ink"
                  strokeWidth={1.4}
                  markerEnd={`url(#${markerId})`}
                />
                {label && (
                  <>
                    <rect x={mx - lw / 2} y={my - 12} width={lw} height={24} rx={12} className="fill-paper stroke-rule" />
                    <text x={mx} y={my + 4} textAnchor="middle" className="fill-ink-2 font-label" style={{ fontSize: 12 }}>
                      {label}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Components */}
          {nodes.map((n) => {
            const s = NODE_STYLE[n.kind] || NODE_STYLE.service;
            const x = PAD_X + n.col * COL_W;
            const y = TOP + n.row * ROW_H;
            return (
              <g key={n.id}>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={s.rx}
                  className={s.className}
                  strokeWidth={1.5}
                  strokeDasharray={s.dash}
                />
                <text x={x + NODE_W / 2} y={y + 30} textAnchor="middle" className={`${s.text} font-display`} style={{ fontSize: 17, fontWeight: 700 }}>
                  {n.label}
                </text>
                <text x={x + NODE_W / 2} y={y + 51} textAnchor="middle" className={s.sub} style={{ fontSize: 13, opacity: n.kind === "actor" ? 0.75 : 1 }}>
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-label text-[11px] text-ink-2">
        {LEGEND.map(([kind, text]) => {
          const s = NODE_STYLE[kind];
          return (
            <span key={kind} className="flex items-center gap-2">
              <svg width="22" height="12" aria-hidden>
                <rect x="1" y="1" width="20" height="10" rx={s.rx > 12 ? 5 : 2} className={s.className} strokeWidth="1.2" strokeDasharray={s.dash ? "3 2" : undefined} />
              </svg>
              {text}
            </span>
          );
        })}
        <span className="flex items-center gap-2">
          <svg width="22" height="12" aria-hidden>
            <rect x="1" y="1" width="20" height="10" rx="3" className="fill-leaf/5 stroke-leaf" strokeWidth="1.2" strokeDasharray="2 3" />
          </svg>
          One deployable unit
        </span>
      </figcaption>
    </figure>
  );
}
