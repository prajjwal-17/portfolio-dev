import { useState, useEffect, useRef } from "react";

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const terminalInputRef = useRef(null);

  const handleCommand = (command) => {
    let newHistory = [...history, { type: "command", text: command }];

    if (command === "help") {
      newHistory.push({
        type: "output",
        text: `Available commands:\nabout       - Learn about me\nprojects    - View my projects\nskills      - See my technical skills`,
      });
    } else if (command === "about") {
      newHistory.push({
        type: "output",
        text: "Hi, I'm Prajjwal Rawat, a Web Developer & Tech Enthusiast.",
      });
    } else if (command === "welcome") {
      newHistory.push({
        type: "output",
        text: `Hi, I'm Prajjwal Rawat, a Web Developer & Tech Enthusiast.\n\nWelcome to my interactive 'AI powered' portfolio terminal!\nType 'help' to see available commands.`,
      });
    } else if (command.trim() === "") {
      // skip empty commands
    } else {
      newHistory.push({ type: "output", text: `Command not found: ${command}` });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = terminalInputRef.current.innerText.trim();
      handleCommand(command);
      terminalInputRef.current.innerText = "";
    }
  };

  useEffect(() => {
    // Run welcome command on load
    handleCommand("welcome");
    if (terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm border border-green-600 rounded-lg overflow-hidden">
      {/* Top nav bar */}
      <div className="bg-black border-b border-green-600 p-2 text-green-400">
        help | about | projects | skills | experience | contact | education | certifications | leadership | sudo | clear
      </div>

      {/* Scrollable terminal content */}
      <div
        className="flex-1 overflow-y-auto p-3 whitespace-pre-wrap leading-relaxed"
        onClick={() => terminalInputRef.current.focus()}
      >
        {history.map((item, idx) => (
          <div key={idx} className="mb-4">
            {item.type === "command" ? (
              <span>
                <span className="text-blue-400">prajjwal@portfolio</span>:~$ {item.text}
              </span>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}

        {/* Live input line */}
        <div>
          <span className="text-blue-400">prajjwal@portfolio</span>:~$
          <span
            ref={terminalInputRef}
            contentEditable
            onKeyDown={handleKeyDown}
            className="bg-black text-green-400 outline-none ml-2"
            spellCheck="false"
          />
          <span className="animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
}
