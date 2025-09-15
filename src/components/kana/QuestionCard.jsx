"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Props:
 * - question: { mode, prompt, correctValue, choices?[], meta }
 * - onAnswer(value: string): parent records correctness (but does NOT advance)
 * - onNext(): parent advances to next question
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

  // local UI state for reveal
  const [selected, setSelected] = useState(null); // value string
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState("");

  const correctAudioRef = useRef(null);
  const incorrectAudioRef = useRef(null);

  // Lazy create audio elements only on client
  useEffect(() => {
    correctAudioRef.current = new Audio(sfxCorrectUrl);
    incorrectAudioRef.current = new Audio(sfxIncorrectUrl);
  }, [sfxCorrectUrl, sfxIncorrectUrl]);

  // When question changes, reset local UI
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setInput("");
  }, [question?.id]);

  const isTyping = mode === "typing";

  function handleChoiceClick(value) {
    if (revealed) return; // locked after reveal
    setSelected(value);
    setRevealed(true);

    const isCorrect = normalize(value) === normalize(correctValue);
    // play sound
    (isCorrect ? correctAudioRef.current : incorrectAudioRef.current)?.play?.();
    // report to parent
    onAnswer?.(value);
  }

  function handleSubmitTyping(e) {
    e.preventDefault();
    if (revealed) return;
    const value = input;
    setSelected(value);
    setRevealed(true);

    const isCorrect = normalize(value) === normalize(correctValue);
    (isCorrect ? correctAudioRef.current : incorrectAudioRef.current)?.play?.();
    onAnswer?.(value);
  }

  return (
    <div className="space-y-4">
      <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
        Mode: {mode}
      </div>

      <div className="text-4xl text-center">{prompt}</div>

      {/* Multiple choice */}
      {choices?.length ? (
        <div className="grid grid-cols-2 gap-2">
          {choices.map((c) => {
            const picked = selected === c.value;
            const isCorrect = normalize(c.value) === normalize(correctValue);

            // color logic after reveal:
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
                disabled={revealed} // lock after a pick
                className="rounded px-3 py-2 text-left transition"
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  opacity: revealed && !picked && !isCorrect ? 0.9 : 1,
                  cursor: revealed ? "default" : "pointer",
                }}
              >
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

      {/* Next button appears only after reveal */}
      {revealed && (
        <div className="pt-1">
          <button onClick={onNext} className="rounded px-4 py-2 button-theme">
            Next
          </button>
        </div>
      )}

      {/* preload audio elements (invisible) */}
      <audio src={sfxCorrectUrl} preload="auto" className="hidden" />
      <audio src={sfxIncorrectUrl} preload="auto" className="hidden" />
    </div>
  );
}

function normalize(s) {
  return String(s || "").trim().toLowerCase();
}
