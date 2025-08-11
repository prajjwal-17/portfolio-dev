import { useState, useEffect, useRef } from "react";
import projects from "../utils/projects"; // <-- import projects list
import certifications from "../utils/certifications"; // <-- import certifications list

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const terminalInputRef = useRef(null);
  const typingQueue = useRef(Promise.resolve()); // ensures sequential typing

  const typeOutput = (text) => {
    const lines = text.split("\n");
    lines.forEach((line) => {
      typingQueue.current = typingQueue.current.then(
        () =>
          new Promise((resolve) => {
            let currentLine = "";
            let i = 0;

            const typeChar = () => {
              if (i < line.length) {
                currentLine += line[i];
                setHistory((prev) => {
                  const newHistory = [...prev];
                  if (
                    newHistory.length > 0 &&
                    newHistory[newHistory.length - 1].type === "typing"
                  ) {
                    newHistory[newHistory.length - 1].text = currentLine;
                  } else {
                    newHistory.push({ type: "typing", text: currentLine });
                  }
                  return newHistory;
                });
                i++;
                setTimeout(typeChar, 8); // ⏩ faster typing speed
              } else {
                setHistory((prev) => {
                  const newHistory = [...prev];
                  if (
                    newHistory.length > 0 &&
                    newHistory[newHistory.length - 1].type === "typing"
                  ) {
                    newHistory[newHistory.length - 1].type = "output";
                  }
                  return newHistory;
                });
                resolve();
              }
            };

            setHistory((prev) => [...prev, { type: "typing", text: "" }]);
            typeChar();
          })
      );
    });
  };

  const handleCommand = (command) => {
    setHistory((prev) => [
      ...prev,
      { type: "command", text: command },
    ]);

    let output = "";
    if (command === "help") {
      output = `Available commands:
about           - Learn about me
projects        - View my projects
certifications  - View my certifications
skills          - See my technical skills`;
    } else if (command === "about") {
      output = "Hi, I'm Prajjwal Rawat, a Web Developer & Tech Enthusiast.";
    } else if (command === "welcome") {
      output = `Hi, I'm Prajjwal Rawat, a Web Developer & Tech Enthusiast.

Welcome to my interactive 'AI powered' portfolio terminal!
Type 'help' to see available commands.`;
    } else if (command === "projects") {
      output = projects
        .map((p, i) => {
          let str = `${i + 1}. ${p.name}
   ${p.description}
   GitHub : <a href="${p.github}" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">${p.github}</a>`;
          if (p.liveDemo && p.liveDemo.trim() !== "") {
            str += `\n   Live Demo : <a href="${p.liveDemo}" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">${p.liveDemo}</a>`;
          }
          return str;
        })
        .join("\n\n"); // 1 line gap between projects
    } else if (command === "certifications") {
      output = certifications
        .map((cert, i) => {
          let str = `${i + 1}. ${cert.name}
   Issued By: ${cert.issuedBy}
   Date: ${cert.issueDate}
   Description: ${cert.description}`;
          if (cert.link && cert.link.trim() !== "") {
            str += `\n   Link: <a href="${cert.link}" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">${cert.link}</a>`;
          }
          return str;
        })
        .join("\n\n"); // 1 line gap between certifications
    } else if (command.trim() === "") {
      return;
    } else {
      output = `Command not found: ${command}`;
    }

    typeOutput(output);
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
    handleCommand("welcome");
    if (terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm border border-green-600 rounded-lg overflow-hidden">
      {/* Top nav bar */}
      <div className="bg-black border-b border-green-600 p-2 text-green-400">
        help | about | projects | skills | experience | contact | education |
        certifications | leadership | sudo | clear
      </div>

      {/* Scrollable terminal content */}
      <div
        className="flex-1 overflow-y-auto p-3 whitespace-pre-wrap leading-relaxed"
        onClick={() => terminalInputRef.current.focus()}
      >
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`${item.type === "command" ? "mt-6" : ""}`} // spacing between prompts
          >
            {item.type === "command" ? (
              <span>
                <span className="text-blue-400">prajjwal@portfolio</span>:~${" "}
                {item.text}
              </span>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            )}
          </div>
        ))}

        {/* Live input line */}
        <div className="mt-6">
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
