// utils/projects.js
const projects = [
  {
    name: "Real-Time Fraud Detection & Risk Scoring System",
    description: "Production-style fintech fraud operations platform built with React, Node.js, MongoDB, Redis, and a Python ML microservice. Simulates UPI-like transactions, scores risk in real time using a hybrid Isolation Forest + rule-based engine, and provides fraud analysts a full internal dashboard with alerts, case management, explainable AI, audit trails, and user investigation workflows. Features graceful degradation with Redis fallback and ML failure handling.",
    github: "https://github.com/prajjwal-17/fraud-detection-system",
  },
  {
    name: "DebateForge: Autonomous Multi-Agent AI Debate System",
    description: "Stateful multi-agent AI debate platform built with Next.js, FastAPI, and locally-run Ollama (Llama 3). Features autonomous AI-vs-AI debates with dynamic personas, real-time human interruption with fallacy detection and Steelman argument rewriting, LLM-as-a-Judge scoring with a persistent leaderboard, multilingual support, and voice audio via Web Speech API and gTTS.",
    github: "https://github.com/prajjwal-17/AI-Debate-System",
  },
  {
    name: "Chat Application using MERN Stack",
    description: "Full-stack real-time chat app using React, Node.js, Express, Socket.io, and MongoDB with JWT and bcrypt authentication. Supports low-latency messaging, responsive UI, and a scalable backend for efficient data handling.",
    github: "https://github.com/prajjwal-17/FULL-STACK-chat-app",
    liveDemo: "https://full-stack-chat-app.vercel.app",
  },
  {
    name: "Graphical DBMS Explorer",
    description: "Interactive graph-based DBMS explorer using Neo4j, Node.js, Selenium, React, and D3.js to visualize and query relationships across 500+ companies with automated data extraction and dynamic node-link exploration.",
    github: "https://github.com/prajjwal-17/Graphical-DBMS",
  },
  {
    name: "Image Enhancer",
    description: "Image processing app built with React, Python, Tailwind CSS, and Framer Motion. Includes filters, edge detection, and color manipulation with a responsive UI and efficient backend.",
    github: "https://github.com/prajjwal-17/Image-Enhancer",
    liveDemo: "https://image-enhancer-txe3.vercel.app",
  },
];

export default projects;
