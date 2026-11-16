"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BOOT, CHIP_COMMANDS, THEMES, complete, resolveCommand, welcome } from "@/lib/commands";

const PROMPT = "prajjwal@portfolio";
const LINE_MS = 160; // longest time spent typing a single line
const TICK_MS = 14;

// Split a line into typing units: whole HTML tags/entities, or single characters.
const toUnits = (line) => line.match(/<[^>]*>|&[a-z#0-9]+;|[\s\S]/giu) || [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Terminal() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [queued, setQueued] = useState(0);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const queue = useRef([]); // commands waiting for the current one to finish
  const running = useRef(false);
  const job = useRef({ cancelled: false }); // the command currently printing
  const cmdHistory = useRef([]);
  const historyIndex = useRef(-1);
  const booted = useRef(false);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const applyTheme = useCallback((name) => {
    if (name === "green") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = name;
    try {
      localStorage.setItem("term-theme", name);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  }, []);

  // Type one block of output, line by line. Stops early if the job is cancelled.
  const typeOutput = useCallback(async (text, token) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const line of text.split("\n")) {
      if (token.cancelled) return;
      const units = toUnits(line);
      setHistory((prev) => [...prev, { type: "output", text: "" }]);
      const step = reduced ? units.length : Math.max(1, Math.ceil(units.length / (LINE_MS / TICK_MS)));
      for (let i = step; ; i += step) {
        const shown = units.slice(0, i).join("");
        setHistory((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { type: "output", text: shown };
          return next;
        });
        if (i >= units.length || token.cancelled) break;
        await sleep(TICK_MS);
      }
    }
  }, []);

  const runCommand = useCallback(
    async ({ command, echo }) => {
      const token = { cancelled: false };
      job.current = token;

      if (command === "__boot") {
        await typeOutput(BOOT + welcome(), token);
        return;
      }

      if (echo) setHistory((prev) => [...prev, { type: "command", text: command }]);
      const { text, effect } = await resolveCommand(command, {
        theme: document.documentElement.dataset.theme || "green",
        history: cmdHistory.current,
      });
      if (token.cancelled) return;

      if (effect?.type === "clear") {
        setHistory([]);
        return;
      }
      if (effect?.type === "theme") applyTheme(effect.name);
      if (text) await typeOutput(text, token);
      if (effect?.type === "navigate" && !token.cancelled) {
        await sleep(350);
        if (effect.href.endsWith(".pdf")) window.open(effect.href, "_blank", "noopener");
        else router.push(effect.href);
      }
    },
    [applyTheme, router, typeOutput]
  );

  // Run queued commands strictly one after another.
  const pump = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    while (queue.current.length) {
      const next = queue.current.shift();
      setQueued(queue.current.length);
      await runCommand(next);
    }
    running.current = false;
    setBusy(false);
  }, [runCommand]);

  const submit = useCallback(
    (raw, { echo = true } = {}) => {
      const command = raw.trim();
      if (!command) return;
      if (echo && command !== "__boot") {
        cmdHistory.current.push(command);
        historyIndex.current = -1;
      }
      queue.current.push({ command, echo });
      setQueued(queue.current.length);
      pump();
    },
    [pump]
  );

  // Ctrl+C: stop the current output and drop everything that was waiting.
  const cancel = useCallback(() => {
    if (!running.current && !queue.current.length) return;
    job.current.cancelled = true;
    queue.current = [];
    setQueued(0);
    setHistory((prev) => [...prev, { type: "output", text: '<span class="term-muted">^C</span>' }]);
  }, []);

  useEffect(() => {
    // Guard against React Strict Mode running this effect twice in dev.
    if (booted.current) return;
    booted.current = true;
    try {
      const saved = localStorage.getItem("term-theme");
      if (saved && THEMES.includes(saved)) applyTheme(saved);
    } catch {}
    submit("__boot", { echo: false });
    // Don't pop the on-screen keyboard open on phones.
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, [applyTheme, submit]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const list = cmdHistory.current;
      if (!list.length) return;
      historyIndex.current = historyIndex.current < 0 ? list.length - 1 : Math.max(0, historyIndex.current - 1);
      setInput(list[historyIndex.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const list = cmdHistory.current;
      if (historyIndex.current < 0) return;
      historyIndex.current += 1;
      if (historyIndex.current >= list.length) {
        historyIndex.current = -1;
        setInput("");
      } else {
        setInput(list[historyIndex.current]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (input.trim()) setInput(complete(input));
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      cancel();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      submit("clear");
    }
  };

  const focusInput = () => {
    // Keep text selection working: only refocus on a plain click.
    if (!window.getSelection()?.toString()) inputRef.current?.focus();
  };

  return (
    <div className="crt h-full flex flex-col bg-term-bg text-term-fg font-mono text-sm border border-term-dim rounded-lg overflow-hidden">
      {/* Command chips */}
      <div className="no-scrollbar relative z-10 flex gap-2 overflow-x-auto border-b border-term-dim p-2 md:flex-wrap md:gap-x-1 md:gap-y-0 md:overflow-visible">
        {CHIP_COMMANDS.map((cmd, idx) => (
          <span key={cmd} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => submit(cmd)}
              className="rounded border border-term-dim px-3 py-1.5 hover:text-term-accent active:text-term-accent md:rounded-none md:border-0 md:px-1 md:py-0 md:underline-offset-2 md:hover:underline"
            >
              {cmd}
            </button>
            {idx < CHIP_COMMANDS.length - 1 && <span className="hidden md:inline">|</span>}
          </span>
        ))}
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 whitespace-pre-wrap break-words leading-relaxed"
        onClick={focusInput}
      >
        {history.map((item, idx) =>
          item.type === "command" ? (
            <div key={idx} className="mt-5">
              <span className="text-term-accent">{PROMPT}</span>:~$ {item.text}
            </div>
          ) : (
            <div key={idx} className="min-h-[1.625em]" dangerouslySetInnerHTML={{ __html: item.text }} />
          )
        )}

        <div className="mt-5 flex items-center">
          <label htmlFor="terminal-input" className="shrink-0">
            <span className="text-term-accent">{PROMPT}</span>:~$
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-2 min-w-0 flex-1 bg-transparent text-term-fg caret-term-fg outline-none"
            style={{ textShadow: "inherit" }}
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="send"
            aria-label="Terminal command input"
          />
          {(busy || queued > 0) && (
            <span className="term-muted ml-2 shrink-0 text-xs" aria-live="polite">
              {queued > 0 ? `running · ${queued} queued` : "running"}
              <span className="caret">_</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
