"use client";

import { useEffect, useState } from "react";
import ModeSelector from "@/components/kana/ModeSelector";
import KanaTable from "@/components/kana/KanaTable";
import QuestionCard from "@/components/kana/QuestionCard";
import { buildPool } from "@/lib/kana/pool";
import { makeQuestions } from "@/lib/kana/generator";
import { isCorrectChoice } from "@/lib/kana/graders";

const VIEWS = {
  MENU: "menu",
  REVIEW_HIRA: "review-hiragana",
  REVIEW_KATA: "review-katakana",
  QUIZ_SETUP: "quiz-setup",
  QUIZ_RUNNING: "quiz-running",
};

export default function KanaStudyPage() {
  const [view, setView] = useState(VIEWS.MENU);
  const [quizConfig, setQuizConfig] = useState(null);

  function handleBeginQuiz(config) {
    setQuizConfig(config);
    setView(VIEWS.QUIZ_RUNNING);
  }

  const notMenu = view !== VIEWS.MENU;

  return (
    <main className="relative mx-auto max-w-3xl p-6 space-y-6">
      {notMenu && (
        <button
          onClick={() => setView(VIEWS.MENU)}
          className="sticky top-2 float-right rounded-md px-3 py-1 text-sm transition"
          aria-label="Return to selection menu"
          style={{ background: "var(--nav-clickable-bg)", border: `1px solid var(--card-border)` }}
        >
          ← Back to menu
        </button>
      )}

      <h1 className="text-2xl font-semibold">Kana Study</h1>

      {view === VIEWS.MENU && (
        <section className="flex justify-center">
          <div className="w-full max-w-md grid gap-4">
            <BigAction onClick={() => setView(VIEWS.REVIEW_HIRA)} label="Review Hiragana Table" />
            <BigAction onClick={() => setView(VIEWS.REVIEW_KATA)} label="Review Katakana Table" />
            <BigAction onClick={() => setView(VIEWS.QUIZ_SETUP)} label="Start a Quiz" variant="primary" />
          </div>
        </section>
      )}

      {view === VIEWS.REVIEW_HIRA && (
        <section className="flex justify-center">
          <Card><KanaTable script="hiragana" /></Card>
        </section>
      )}

      {view === VIEWS.REVIEW_KATA && (
        <section className="flex justify-center">
          <Card><KanaTable script="katakana" /></Card>
        </section>
      )}

      {view === VIEWS.QUIZ_SETUP && (
        <section className="flex justify-center">
          <Card><ModeSelector onBegin={handleBeginQuiz} /></Card>
        </section>
      )}

      {view === VIEWS.QUIZ_RUNNING && (
        <section className="flex justify-center">
          <Card>
            <QuizRunner
              config={quizConfig}
              onExit={() => setView(VIEWS.MENU)}
            />
          </Card>
        </section>
      )}
    </main>
  );
}

function BigAction({ label, onClick, variant = "default" }) {
  const base = "w-full rounded-xl px-5 py-6 text-center text-lg font-medium transition";
  const styleDefault = { background: "var(--card-bg)", border: `1px solid var(--card-border)` };
  return (
    <button
      onClick={onClick}
      className={base}
      style={variant === "primary" ? { background: "var(--button-bg)", color: "var(--button-text)" } : styleDefault}
    >
      {label}
    </button>
  );
}

function Card({ children }) {
  return (
    <div
      className="w-full max-w-md rounded-xl p-4 shadow-sm"
      style={{ background: "var(--card-bg)", border: `1px solid var(--card-border)` }}
    >
      {children}
    </div>
  );
}

/* -------------------- QUIZ RUNNER -------------------- */

function QuizRunner({ config, onExit }) {
  const [questions] = useState(() => {
    const pool = buildPool(config);
    return makeQuestions(pool, config, 10);
  });
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const done = index >= questions.length;
  const current = questions[index];

  // Confetti on results mount
  useEffect(() => {
    if (!done) return;
    (async () => {
      try {
        const confetti = (await import("canvas-confetti")).default;
        const pct = score / questions.length;            // 0..1
        const particleCount = Math.max(40, Math.floor(300 * pct)); // scale by % correct
        confetti({
          particleCount,
          spread: 75,
          origin: { y: 0.6 },
          scalar: 0.9,
        });
      } catch {}
    })();
  }, [done, score, questions.length]);

  // Called by QuestionCard when user answers (but we do NOT advance yet)
  function recordAnswer(given) {
    const correct = isCorrectChoice(given, current.correctValue);
    setAnswers((a) => [
      ...a,
      { id: current.id, mode: current.mode, given, correct, expected: current.correctValue, meta: current.meta },
    ]);
    if (correct) setScore((s) => s + 1);
  }

  // Advance only on explicit Next
  function nextQuestion() {
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="space-y-3">
        <div className="text-lg font-semibold">Results</div>
        <div className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
          Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
        </div>

        <div className="grid gap-2 max-h-64 overflow-auto pr-1">
          {answers.map((a, idx) => (
            <div
              key={a.id}
              className="rounded border p-2 text-sm"
              style={{
                borderColor: "var(--card-border)",
                background: a.correct ? "var(--correct-bg, #e6ffed)" : "var(--incorrect-bg, #ffefef)",
              }}
            >
              <div className="font-medium">Q{idx + 1} • {a.mode}</div>
              <div>Prompt: <b>{a.meta.kana}</b> ({a.meta.romaji})</div>
              <div>
                Your answer: <code>{String(a.given)}</code> {a.correct ? "✓" : `✗ → ${a.expected}`}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="rounded px-4 py-2 button-theme" onClick={() => location.reload()}>
            Retake (same settings)
          </button>
          <button
            className="rounded px-4 py-2"
            style={{ border: "1px solid var(--card-border)" }}
            onClick={onExit}
          >
            Back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuestionCard
      question={current}
      onAnswer={recordAnswer}
      onNext={nextQuestion}
      // point to your existing SFX files used elsewhere
      sfxCorrectUrl="/sounds/correct.mp3"
      sfxIncorrectUrl="/sounds/incorrect.mp3"
    />
  );
}
