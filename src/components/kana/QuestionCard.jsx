"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - question: { id, mode, prompt, correctValue, choices?[], meta }
 * - onAnswer(value: string): record correctness (does NOT advance)
 * - onNext(): advance to next question
 * - sfxCorrectUrl?: string
 * - sfxIncorrectUrl?: string
 */
export default function QuestionCard({
  question,
  onAnswer,
  onNext,
  sfxCorrectUrl = "/sounds/correct.mp3",
  sfxIncorrectUrl = "/sounds/incorrect.mp3",
}) {
  if (!question) {
    return (
      <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
        No question to show.
      </div>
    );
  }

  const { mode, prompt, choices, correctValue } = question;

  // UI state
  const [selected, setSelected] = useState(null); // value string (for MC/typing)
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState("");

  // audio refs
  const correctAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);

  // focus target for accessibility (helps keyboard users)
  const containerRef = useRef(null);

  // (re)create audio elements on mount / URL change
  useEffect(() => {
    correctAudioRef.current = new Audio(sfxCorrectUrl);
    incorrectAudioRef.current = new Audio(sfxIncorrectUrl);
  }, [sfxCorrectUrl, sfxIncorrectUrl]);

  // Reset per question
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setInput("");
    // put focus on the container so keydown works without clicking
    containerRef.current?.focus?.();
  }, [question?.id]);

  const isTyping = mode === "typing";

  // --- Actions ---------------------------------------------------------------

  function revealAndReport(value) {
    if (revealed) return;
    setSelected(value);
    setRevealed(true);

    const isCorrect = normalize(value) === normalize(correctValue);
    (isCorrect ? correctAudioRef.current : incorrectAudioRef.current)?.play?.();
    onAnswer?.(value);
  }

  function handleChoiceClick(value) {
    if (revealed) return;
    revealAndReport(value);
  }

  function handleSubmitTyping(e) {
    e.preventDefault();
    if (revealed) return;
    revealAndReport(input);
  }

  // --- Keyboard handling -----------------------------------------------------
  useEffect(() => {
    function onKeyDown(e) {
      // If user is typing in the input, let native behavior happen in typing mode
      if (isTyping && document.activeElement?.id === "typing-answer" && !revealed) {
        // Enter will be handled by form submit
        return;
      }

      // ENTER: after reveal, go Next; before reveal in typing mode, submit
      if (e.key === "Enter") {
        if (!revealed && isTyping) {
          e.preventDefault();
          revealAndReport(input);
          return;
        }
        if (revealed) {
          e.preventDefault();
          onNext?.();
          return;
        }
      }

      // Number keys 1..4 map to choices (only when MC and not revealed)
      if (!isTyping && choices?.length && !revealed) {
        const idxFromKey = keyToIndex(e.key);
        if (idxFromKey != null && idxFromKey < choices.length) {
          e.preventDefault();
          revealAndReport(choices[idxFromKey].value);
        }
      }
    }

    // attach to window so it works even if a button isn't focused
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choices, revealed, isTyping, input, correctValue]);

  // --- Render ----------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="space-y-4 outline-none"
      aria-live="polite"
    >
      <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
        Mode: {mode} {choices?.length && "· press 1–4"} {isTyping && "· press Enter"}
      </div>

      <div className="text-4xl text-center">{prompt}</div>

      {/* Multiple choice */}
      {choices?.length ? (
        <div className="grid grid-cols-2 gap-2">
          {choices.map((c, i) => {
            const picked = selected === c.value;
            const isCorrect = normalize(c.value) === normalize(correctValue);

            // post-reveal colors
            const bg =
              revealed && isCorrect
                ? "var(--correct-bg, #e6ffed)"
                : revealed && picked && !isCorrect
                ? "var(--incorrect-bg, #ffefef)"
                : "var(--card-bg)";
            const border =
              revealed && isCorrect
                ? "var(--correct-border, #86efac)"
                : revealed && picked && !isCorrect
                ? "var(--incorrect-border, #fca5a5)"
                : "var(--card-border)";

            return (
              <button
                key={c.id}
                onClick={() => handleChoiceClick(c.value)}
                disabled={revealed}
                className="rounded px-3 py-2 text-left transition focus:outline-none focus:ring-2"
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  opacity: revealed && !picked && !isCorrect ? 0.9 : 1,
                  cursor: revealed ? "default" : "pointer",
                }}
                aria-pressed={picked}
                aria-keyshortcuts={`${i + 1}`}
                title={`Press ${i + 1}`}
              >
                <span className="text-xs mr-2 opacity-60">{i + 1}.</span>
                {c.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Typing */}
      {isTyping && (
        <form className="flex items-center gap-2" onSubmit={handleSubmitTyping}>
          <input
            id="typing-answer"
            name="typing-answer"
            className="w-full rounded border px-3 py-2"
            style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
            placeholder="Type romaji here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            disabled={revealed}
          />
          <button
            type="submit"
            className="rounded px-3 py-2 button-theme disabled:opacity-60"
            disabled={revealed}
            title="Press Enter"
          >
            Submit
          </button>
        </form>
      )}

      {/* Reveal helper for typing */}
      {isTyping && revealed && (
        <div className="text-sm">
          {normalize(selected) === normalize(correctValue) ? (
            <span style={{ color: "var(--correct-fg, #14532d)" }}>Correct!</span>
          ) : (
            <span style={{ color: "var(--incorrect-fg, #7f1d1d)" }}>
              Incorrect. Correct answer: <b>{correctValue}</b>
            </span>
          )}
        </div>
      )}

      {/* Next button (after reveal) */}
      {revealed && (
        <div className="pt-1">
          <button onClick={onNext} className="rounded px-4 py-2 button-theme" title="Press Enter">
            Next
          </button>
        </div>
      )}

      {/* Preload audio (hidden) */}
      <audio src={sfxCorrectUrl} preload="auto" className="hidden" />
      <audio src={sfxIncorrectUrl} preload="auto" className="hidden" />
    </div>
  );
}

function keyToIndex(key) {
  if (key === "1") return 0;
  if (key === "2") return 1;
  if (key === "3") return 2;
  if (key === "4") return 3;
  return null;
}

function normalize(s) {
  return String(s || "").trim().toLowerCase();
}
