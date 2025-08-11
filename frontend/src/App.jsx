import { useEffect, useState } from "react";
import Terminal from "./pages/Terminal";
import LeftPanel from "./pages/LeftPanel";

export default function App() {
  const [dateTime, setDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="p-4 border-b border-green-600">
        <h1 className="text-3xl font-bold">Prajjwal Rawat</h1>
        <p className="text-lg">Web Developer</p>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT BOX - hidden on mobile */}
        <div className="hidden md:block md:w-1/2 border-r border-green-600 overflow-y-auto min-h-0 p-4">
          <LeftPanel />
        </div>

        {/* RIGHT BOX - full width on mobile */}
        <div className="w-full md:w-1/2 overflow-y-auto min-h-0 p-4">
          <Terminal />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="p-3 border-t border-green-600 flex justify-between text-sm">
        <span>$prajjwalrawat/portfolio</span>
        <span>{dateTime.toLocaleString()}</span>
      </footer>
    </div>
  );
}
