import { useState, useEffect, useRef } from "react";
import projects from "../utils/projects";
import certifications from "../utils/certifications";
import experience from "../utils/experience";
import skills from "../utils/skills";
import milestones from "../utils/milestones"; // Ensure this is the correct path and file name

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const terminalInputRef = useRef(null);
  const typingQueue = useRef(Promise.resolve());
  const terminalEndRef = useRef(null);
  const welcomeMessage = `Hi, I'm Prajjwal Rawat, a Web Developer & Tech Enthusiast.
Welcome to my interactive portfolio terminal!
Type 'help' to see available commands.`;

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

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
                setTimeout(typeChar, 3);
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
    setHistory((prev) => [...prev, { type: "command", text: command }]);
    let output = "";
    if (command === "help") {
      output = `Available commands:
about           - Learn about me
projects        - View my projects
certifications  - View my certifications
experience      - View my work experience
education       - View my academic history
skills          - See my technical skills
contact         - View my contact details
resume          - View my resume details
milestones      - View my milestones and honors
clear           - Clear terminal screen`;
    } else if (command === "about") {
      output = "I’m Prajjwal Rawat, an aspiring Full-Stack Web Developer with a solid foundation in React, JavaScript, and the MERN stack, driven by a passion for creating intuitive, high-performance web applications. Currently pursuing my B.Tech in Computer Science at SRM University with a 9.43 GPA, I combine strong academic performance with hands-on project experience to deliver solutions that are both technically robust and user-centric. My goal is to leverage my skills to develop innovative products that solve real-world problems and elevate user experiences.";
    } else if (command === "welcome") {
      output = welcomeMessage;
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
        .join("\n\n");
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
        .join("\n\n");
    } else if (command === "experience") {
      output = experience
        .map((exp, i) => {
          let str = `${i + 1}. ${exp.role}, ${exp.company}
   Location: ${exp.location}
   Duration: ${exp.duration}
   Description: ${exp.description}`;
          if (exp.proof && exp.proof.trim() !== "") {
            str += `\n   Proof: <a href="${exp.proof}" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">${exp.proof}</a>`;
          }
          return str;
        })
        .join("\n\n");
    } else if (command === "education") {
      output = `1. 📚 Summer Valley School, Dehradun
   Board       : ISC / CISCE
   Class 10    : 95%
   Class 11    : 97.6%
   Duration    : April 2009 - May 2023
2. 🎓 SRM Institute of Science and Technology, Kattankulathur
   Degree      : Bachelor of Technology (B.Tech)
   Major       : Computer Science & Engineering
   CGPA        : 9.4 / 10
   Duration    : Aug 2023 - May 2027`;
    } else if (command === "skills") {
      output = `🛠 Technical Skills:
• Programming Languages : ${skills.programmingLanguages.join(", ")}
• Frontend Technologies : ${skills.frontend.join(", ")}
• Backend Technologies  : ${skills.backend.join(", ")}
• Databases             : ${skills.databases.join(", ")}
• Tools & Platforms     : ${skills.toolsAndPlatforms.join(", ")}
• Concepts              : ${skills.concepts.join(", ")}`;
    } else if (command === "contact") {
      output = `Contact Details:
📞 Phone : <a href="tel:+918433244827" style="color:#00afff; text-decoration: underline;">+91 8433244827</a>
📧 Email : <a href="mailto:prajjwalrawat1711@gmail.com" style="color:#00afff; text-decoration: underline;">prajjwalrawat1711@gmail.com</a>
🔗 LinkedIn : <a href="https://www.linkedin.com/in/prajjwal-rawat-886151278/" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">linkedin.com/in/prajjwal-rawat-886151278</a>
💻 GitHub : <a href="https://github.com/prajjwal-17" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">https://github.com/prajjwal-17</a>
📸 Instagram : <a href="https://www.instagram.com/prajjwal_17_/" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">instagram.com/prajjwal_17_</a>`;
    } else if (command === "resume") {
      output = `📄 Resume Details:
Last Updated: <span style="color:#00ff00;">August 15, 2023</span>
Download: <a href="https://drive.google.com/file/d/17IqU41qBD-CEP85HaqdOMvES38lYHWD0/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">https://drive.google.com/file/d/17IqU41qBD-CEP85HaqdOMvES38lYHWD0/view?usp=sharingf</a>`;
    } else if (command === "milestones") {
      output = milestones
        .map((milestone, i) => {
          let str = `${i + 1}. 🏆 ${milestone.name}
   Event: ${milestone.event}
   Date: ${milestone.date}
   Description: ${milestone.description}`;
          if (milestone.proof && milestone.proof.trim() !== "") {
            str += `\n   Proof: <a href="${milestone.proof}" target="_blank" rel="noopener noreferrer" style="color:#00afff; text-decoration: underline;">${milestone.proof}</a>`;
          }
          return str;
        })
        .join("\n\n");
    } else if (command === "clear") {
      setHistory([{ type: "output", text: welcomeMessage }]);
      return;
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
      <div className="bg-black border-b border-green-600 p-2 text-green-400">
        help | about | projects | skills | experience | contact | education | certifications | milestones | resume | clear
      </div>
      <div
        className="flex-1 overflow-y-auto p-3 whitespace-pre-wrap leading-relaxed"
        onClick={() => terminalInputRef.current.focus()}
      >
        {history.map((item, idx) => (
          <div key={idx} className={`${item.type === "command" ? "mt-6" : ""}`}>
            {item.type === "command" ? (
              <span>
                <span className="text-blue-400">prajjwal@portfolio</span>:~$ {item.text}
              </span>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            )}
          </div>
        ))}
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
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
