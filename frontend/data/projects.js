// Each project carries a high-level architecture diagram:
//   lanes  - column headings, left to right
//   nodes  - { id, label, sub, col, row, kind } where kind is "actor" | "service" | "store" | "external"
//   groups - dashed boundary drawn around a set of nodes (one deployable unit)
//   edges  - [from, to, label]
const projects = [
  {
    slug: "meridian",
    name: "Meridian - Enterprise RAG Platform",
    short: "Meridian",
    tagline: "Enterprise RAG with access control enforced before retrieval",
    date: "2026",
    description:
      "Enterprise Retrieval-Augmented Generation platform built with FastAPI, PostgreSQL + pgvector, SeaweedFS, React, and Ollama. Features a PDF ingestion pipeline (extract, chunk, embed), document-level access control enforced before retrieval, BM25 / dense / hybrid / graph retrieval modes, cross-encoder reranking, and grounded local answers with citations.",
    tech: ["FastAPI", "PostgreSQL", "pgvector", "SeaweedFS", "React", "Ollama", "SentenceTransformers"],
    highlights: [
      "Ingestion pipeline: PDF upload, page-aware extraction, token-based chunking, embeddings, entity graph indexing",
      "Document-level ACLs resolved per user, team and department; unauthorized chunks are filtered before reranking or LLM context",
      "Four retrieval modes: BM25, dense, hybrid and graph, with optional cross-encoder reranking",
      "Grounded answers from a local LLM with citations mapped back to source chunks",
    ],
    architecture: {
      lanes: ["Users", "Frontend", "FastAPI backend", "Data and models"],
      nodes: [
        { id: "user", label: "Enterprise user", sub: "Signs in, asks, uploads", col: 0, row: 1, kind: "actor" },
        { id: "fe", label: "React + Vite app", sub: "Chat, upload, graph explorer", col: 1, row: 1, kind: "service" },
        { id: "auth", label: "Auth + RBAC + ACL", sub: "Builds PermissionContext", col: 2, row: 0, kind: "service" },
        { id: "ingest", label: "Document ingestion", sub: "Extract, chunk, embed", col: 2, row: 1, kind: "service" },
        { id: "retr", label: "Retrieval layer", sub: "BM25, dense, hybrid, graph", col: 2, row: 2, kind: "service" },
        { id: "rerank", label: "Cross-encoder reranker", sub: "ms-marco-MiniLM-L-6-v2", col: 2, row: 3, kind: "service" },
        { id: "gen", label: "Answer generation", sub: "Grounded, with citations", col: 2, row: 4, kind: "service" },
        { id: "fs", label: "SeaweedFS", sub: "Original document blobs", col: 3, row: 0, kind: "store" },
        { id: "pg", label: "PostgreSQL + pgvector", sub: "Chunks, ACLs, embeddings, graph", col: 3, row: 2, kind: "store" },
        { id: "llm", label: "Ollama", sub: "Local LLM", col: 3, row: 4, kind: "external" },
      ],
      groups: [{ label: "FastAPI backend", ids: ["auth", "ingest", "retr", "rerank", "gen"] }],
      edges: [
        ["user", "fe"],
        ["fe", "auth", "every request"],
        ["fe", "ingest", "/upload"],
        ["fe", "retr", "/search, /ask"],
        ["ingest", "fs", "store file"],
        ["ingest", "pg", "chunks + vectors"],
        ["retr", "pg", "ACL-filtered"],
        ["retr", "rerank"],
        ["rerank", "gen"],
        ["gen", "llm", "evidence only"],
      ],
    },
    deepDive: [
      {
        title: "Access control happens before retrieval, not after",
        body: "Every request resolves the caller into a PermissionContext from database-backed user, team and department mappings. Each retriever only ever sees chunks that context allows: the BM25 corpus is built from authorized chunks, the pgvector query filters on ACL metadata, and graph traversal applies the same filter before returning anything. Because filtering happens first, an unauthorized passage can never reach the reranker or the LLM prompt, so it cannot leak through an answer or a citation.",
      },
      {
        title: "Hybrid retrieval with Reciprocal Rank Fusion",
        body: "BM25 catches exact terms and dense retrieval catches paraphrases, and each misses what the other finds. Hybrid mode runs both independently and merges the ranked lists with Reciprocal Rank Fusion: every chunk scores the sum of 1 / (60 + rank) across the lists it appears in. RRF needs no score normalisation between two very different scoring scales. A cross-encoder (ms-marco-MiniLM-L-6-v2), loaded lazily and reused, then rescores each query and passage pair to sharpen the final order, while the RRF score is kept alongside for comparison.",
      },
      {
        title: "Idempotent, retryable ingestion",
        body: "An upload stores the original file in SeaweedFS, then extracts text page by page, chunks by tokens, embeds with SentenceTransformers and writes chunks with a permission snapshot. Processing can be retried safely: existing documents, chunks, embeddings and ACL metadata are preserved and status is tracked per document. External datasets are imported by a source name and source document id, so re-running an import never duplicates records.",
      },
      {
        title: "Graph retrieval and its limits",
        body: "A rule-based extractor pulls technologies, algorithms, organisations and concepts out of chunks and stores entities, mentions and typed relationships in PostgreSQL. A graph query matches entities in the question, walks typed relationships and returns the chunks that mention them. It deliberately does not follow loose co-occurrence edges. It is fast for narrow entity questions, but because extraction is rule-based it can produce noisy matches, so hybrid plus reranking remains the default for accuracy.",
      },
    ],
    github: "https://github.com/prajjwal-17/Meridian",
  },
  {
    slug: "debateforge",
    name: "DebateForge - Real-Time AI Debate Platform",
    short: "DebateForge",
    tagline: "A vocal, multi-agent sparring partner for debate practice",
    date: "Feb 2026",
    description:
      "Full-stack multi-agent AI debate system built with Next.js, FastAPI, Ollama (LLaMA 3.2), TypeScript, and the Web Speech API. A prefetch pipeline overlaps inference and speech to cut response delay by 30%, with local LLM tuning (context reduction, warmup, keepalive) for 15% faster tokens, plus human-in-the-loop fallacy detection and argument reconstruction.",
    tech: ["Next.js", "TypeScript", "FastAPI", "Ollama", "LLaMA 3.2", "Web Speech API", "Clerk"],
    highlights: [
      "Real-time multi-agent argument generation with near-zero latency transitions between speakers",
      "Prefetch pipeline overlaps inference with speech playback, reducing response delay by 30%",
      "Local LLM tuning: context reduction (4096 to 2048), warmup and keepalive for 15% faster tokens and no cold starts",
      "Human-in-the-loop mode with fallacy detection and argument reconstruction",
    ],
    architecture: {
      lanes: ["Users", "Next.js frontend", "FastAPI backend", "Models and state"],
      nodes: [
        { id: "user", label: "Debater", sub: "Watches, interrupts, argues", col: 0, row: 1, kind: "actor" },
        { id: "clerk", label: "Clerk", sub: "Sign-in, route protection", col: 1, row: 0, kind: "external" },
        { id: "fe", label: "Debate UI", sub: "useDebate hook, debate stage", col: 1, row: 1, kind: "service" },
        { id: "speech", label: "Web Speech API", sub: "Speaks each turn in-browser", col: 1, row: 2, kind: "external" },
        { id: "mod", label: "Moderator", sub: "Sessions, personas, turns", col: 2, row: 0, kind: "service" },
        { id: "api", label: "REST API", sub: "start, next, interrupt, judge", col: 2, row: 1, kind: "service" },
        { id: "engine", label: "AI engine", sub: "Rebuttal, fallacy, steelman, judge", col: 2, row: 2, kind: "service" },
        { id: "lb", label: "leaderboard.json", sub: "Persona wins", col: 3, row: 0, kind: "store" },
        { id: "llm", label: "Ollama", sub: "LLaMA 3.2, kept warm", col: 3, row: 2, kind: "external" },
      ],
      groups: [{ label: "FastAPI backend", ids: ["mod", "api", "engine"] }],
      edges: [
        ["user", "fe"],
        ["fe", "clerk"],
        ["fe", "speech", "speak turn"],
        ["fe", "api", "REST"],
        ["api", "mod"],
        ["api", "engine"],
        ["mod", "lb", "verdict"],
        ["engine", "llm", "prompt + context"],
      ],
    },
    deepDive: [
      {
        title: "Turn orchestration",
        body: "The backend keeps each debate as an in-memory session in the moderator: topic, the two personas, language and the running transcript. Each call to the next-turn endpoint picks the speaker, builds a persona-locked system prompt plus recent context, and asks the model for a rebuttal. Personas (Professor, Troll, Aggressor, Philosopher) are enforced purely by prompting, which keeps them swappable without retraining anything.",
      },
      {
        title: "Hiding model latency behind speech",
        body: "A local model is slow enough that waiting for each turn kills the feel of a live debate. The frontend prefetches the next speaker's argument while the current one is still being spoken, so inference and playback overlap and response delay drops by about 30%. On the model side, the context window was cut from 4096 to 2048 tokens, the model is warmed up in the FastAPI startup lifecycle and kept alive between calls, which made tokens about 15% faster and removed cold starts.",
      },
      {
        title: "Human in the loop: fallacy check, then steelman",
        body: "The user can pause the autonomous loop and argue against either persona. The input first goes through fallacy detection, which flags flaws such as false dichotomy or ad hominem. It is then rewritten into its strongest logical form and that steelmanned version, not the raw text, is injected into the debate state, so the AI responds to the best version of the argument and the debate continues without a break.",
      },
      {
        title: "Judging and what I kept simple",
        body: "A separate judge prompt reads the full transcript, declares a winner on logical merit and updates a persistent leaderboard. Persistence is a single JSON file and sessions live in memory: that was a deliberate choice for a single-machine, local-first tool, and the first thing to replace with a database if it ever ran multi-user.",
      },
    ],
    github: "https://github.com/prajjwal-17/AI-Debate-System",
  },
  {
    slug: "fraud-detection",
    name: "Real-Time Fraud Detection & Risk Scoring System",
    short: "Fraud Detection",
    tagline: "Sub-30ms risk scoring for UPI-style transactions",
    date: "Jan 2026",
    description:
      "Fraud detection system for UPI-style transactions using a hybrid ML + rule-based engine (Isolation Forest on 9 behavioral features + 5 fraud rules). Delivers sub-30ms end-to-end scoring with real-time dashboard updates via Socket.IO, explains each decision by surfacing key risk factors, and stays reliable through Redis fallback and ML failure recovery.",
    tech: ["React", "Node.js", "Express", "FastAPI", "MongoDB", "Redis", "scikit-learn", "Socket.IO"],
    highlights: [
      "Hybrid engine: Isolation Forest on 9 behavioral features combined with 5 fraud rules",
      "Sub-30ms end-to-end scoring with live dashboard updates over Socket.IO",
      "Explainability: key risk factors surfaced for every decision",
      "Fault tolerance through Redis fallback and ML failure recovery",
    ],
    architecture: {
      lanes: ["Users", "Frontend", "Node / Express server", "Data and ML"],
      nodes: [
        { id: "analyst", label: "Fraud analyst", sub: "Monitors, investigates", col: 0, row: 1, kind: "actor" },
        { id: "client", label: "React dashboard", sub: "Alerts, cases, audit trail", col: 1, row: 1, kind: "service" },
        { id: "sim", label: "Transaction simulator", sub: "UPI-style traffic", col: 1, row: 2, kind: "service" },
        { id: "feat", label: "Feature builder", sub: "Velocity, device, location", col: 2, row: 0, kind: "service" },
        { id: "orch", label: "Risk orchestrator", sub: "REST + Socket.IO", col: 2, row: 1, kind: "service" },
        { id: "rules", label: "Rule engine", sub: "5 rules + score fusion", col: 2, row: 2, kind: "service" },
        { id: "redis", label: "Redis", sub: "Recent-transaction cache", col: 3, row: 0, kind: "store" },
        { id: "mongo", label: "MongoDB", sub: "Transactions, risk logs, cases", col: 3, row: 1, kind: "store" },
        { id: "ml", label: "FastAPI ML service", sub: "Isolation Forest + calibrator", col: 3, row: 2, kind: "external" },
      ],
      groups: [{ label: "Node / Express server", ids: ["feat", "orch", "rules"] }],
      edges: [
        ["analyst", "client"],
        ["client", "orch", "REST + events"],
        ["sim", "orch", "transactions"],
        ["orch", "feat"],
        ["orch", "rules"],
        ["feat", "redis", "recent history"],
        ["orch", "mongo", "persist + audit"],
        ["orch", "ml", "POST /predict"],
      ],
    },
    deepDive: [
      {
        title: "Behavioral features from recent history",
        body: "For every transaction the server builds features from the sender's recent activity: deviation from their average amount, velocity over the last hour and the last day, device mismatch against known devices, and distance from their usual location. Recent transactions are cached in Redis so these lookups do not hit MongoDB on the hot path, which is what keeps end-to-end scoring under 30ms.",
      },
      {
        title: "Two signals, one score",
        body: "The Python service scores the features with an Isolation Forest anomaly detector, followed by a logistic calibration layer trained on SMOTE-balanced synthetic data to turn anomaly scores into a fraud probability. The Node orchestrator combines that probability with five deterministic fraud rules into a final 0 to 100 risk score, classified as SAFE, SUSPICIOUS or FRAUD. Rules catch known patterns outright; the model catches behaviour that no rule anticipated.",
      },
      {
        title: "Degrading without dropping transactions",
        body: "If Redis is unavailable the server falls back to in-memory caching. If the ML service fails or times out, scoring continues on rules alone. Neither failure blocks a transaction, and every degraded decision is recorded as such in the risk log, so an analyst reviewing it later can see it was scored in fallback mode.",
      },
      {
        title: "Explainability and the analyst workflow",
        body: "Each decision writes a risk log with the ML score, the rules that fired, the top contributing factors with baseline versus observed values, and latency. The dashboard receives it over Socket.IO in real time. Flagged transactions become cases that move through open, under review, resolved or false positive, with assignee and notes, which answers the analyst's core question: why was this flagged?",
      },
    ],
    github: "https://github.com/prajjwal-17/Fraud-Detection",
  },
  {
    slug: "graph-explorer",
    name: "Graphical DBMS Explorer",
    short: "Graph Explorer",
    tagline: "Query and visualize relationships across 500+ entities",
    date: "June 2025",
    description:
      "Interactive graph-based DBMS explorer using Neo4j, Node.js, Selenium, React, and D3.js to visualize and query relationships across 500+ companies with automated data extraction and dynamic node-link exploration.",
    tech: ["Neo4j", "Node.js", "Express", "React", "D3.js", "Selenium", "JWT"],
    highlights: [
      "Full-stack graph application to query and visualize 500+ interconnected entities",
      "REST APIs and automated ingestion pipelines that convert unstructured data into Neo4j graph formats",
      "Interactive node-link visualizations built with React and D3.js",
    ],
    architecture: {
      lanes: ["Users and sources", "Frontend and tooling", "Express backend", "Database"],
      nodes: [
        { id: "user", label: "User / admin", sub: "Browses, queries, adds data", col: 0, row: 0, kind: "actor" },
        { id: "web", label: "Public company data", sub: "Source websites", col: 0, row: 2, kind: "external" },
        { id: "fe", label: "React SPA", sub: "D3 force-directed graph", col: 1, row: 0, kind: "service" },
        { id: "scrape", label: "Selenium crawlers", sub: "Scrape and normalise to JSON", col: 1, row: 2, kind: "service" },
        { id: "auth", label: "Auth middleware", sub: "JWT, bcrypt, roles", col: 2, row: 0, kind: "service" },
        { id: "api", label: "Graph REST API", sub: "CIN / DIN lookup, queries", col: 2, row: 1, kind: "service" },
        { id: "import", label: "Import script", sub: "JSON to nodes and edges", col: 2, row: 2, kind: "service" },
        { id: "neo", label: "Neo4j", sub: "Companies, directors, links", col: 3, row: 1, kind: "store" },
      ],
      groups: [{ label: "Express backend", ids: ["auth", "api", "import"] }],
      edges: [
        ["user", "fe"],
        ["fe", "auth", "token"],
        ["fe", "api", "REST"],
        ["web", "scrape"],
        ["scrape", "import", "JSON datasets"],
        ["api", "neo", "Cypher"],
        ["import", "neo", "load"],
        ["auth", "neo", "users"],
      ],
    },
    deepDive: [
      {
        title: "Why a graph database",
        body: "The data is companies, directors and the links between them. Questions like which other companies share a director with this one are multi-hop joins in a relational model but a single traversal in Neo4j. Companies and directors are nodes keyed by CIN and DIN, and directorships are relationships, so the query matches the shape of the question.",
      },
      {
        title: "From websites to a graph",
        body: "Selenium crawlers collect company and director records from public sources and normalise them into JSON datasets. An import script turns those into nodes and relationships in Neo4j, so the pipeline from unstructured pages to a queryable graph is repeatable instead of a manual load.",
      },
      {
        title: "API and access control",
        body: "An Express REST API exposes lookups by CIN and DIN, secondary-company discovery and a set of predefined analytical queries, each backed by Cypher. Authentication uses JWT with bcrypt-hashed passwords, and role middleware restricts data entry to admins while authenticated users can browse and query.",
      },
      {
        title: "Rendering 500+ connected entities",
        body: "The frontend draws the result as a D3 force-directed graph with zoom, drag and node selection. Rather than a static picture, selecting a node drives further lookups, so exploring the network is a matter of following links.",
      },
    ],
    github: "https://github.com/prajjwal-17/Graphical-DBMS",
  },
];

export default projects;
