"use client";

import { useState } from "react";
import ModeSelector from "@/components/kana/ModeSelector";
import KanaTable from "@/components/kana/KanaTable";

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
      {/* Top-right back chip */}
      {notMenu && (
        <button
          onClick={() => setView(VIEWS.MENU)}
          className="sticky top-2 float-right rounded-md px-3 py-1 text-sm transition"
          aria-label="Return to selection menu"
          style={{
            background: "var(--nav-clickable-bg)",
            border: `1px solid var(--card-border)`,
          }}
        >
          ← Back to menu
        </button>
      )}

      <h1 className="text-2xl font-semibold">Kana Study</h1>

      {/* Selection menu */}
      {view === VIEWS.MENU && (
        <section className="flex justify-center">
          <div className="w-full max-w-md grid gap-4">
            <BigAction onClick={() => setView(VIEWS.REVIEW_HIRA)} label="Review Hiragana Table" />
            <BigAction onClick={() => setView(VIEWS.REVIEW_KATA)} label="Review Katakana Table" />
            <BigAction onClick={() => setView(VIEWS.QUIZ_SETUP)} label="Start a Quiz" variant="primary" />
          </div>
        </section>
      )}

      {/* Hiragana review */}
      {view === VIEWS.REVIEW_HIRA && (
        <section className="flex justify-center">
          <Card>
            <KanaTable script="hiragana" />
          </Card>
        </section>
      )}

      {/* Katakana review */}
      {view === VIEWS.REVIEW_KATA && (
        <section className="flex justify-center">
          <Card>
            <KanaTable script="katakana" />
          </Card>
        </section>
      )}

      {/* Quiz setup */}
      {view === VIEWS.QUIZ_SETUP && (
        <section className="flex justify-center">
          <Card>
            <ModeSelector onBegin={handleBeginQuiz} />
          </Card>
        </section>
      )}

      {/* Quiz running placeholder */}
      {view === VIEWS.QUIZ_RUNNING && (
        <section className="flex justify-center">
          <Card>
            <div className="space-y-2">
              <div
                className="text-sm mb-1"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Quiz Running (stub)
              </div>
              <pre className="text-xs overflow-auto rounded p-2" style={{ background: "rgba(0,0,0,0.05)" }}>
                {JSON.stringify(quizConfig, null, 2)}
              </pre>
              <p className="text-sm">We’ll render questions here after generators are in.</p>
            </div>
          </Card>
        </section>
      )}
    </main>
  );
}

function BigAction({ label, onClick, variant = "default" }) {
  const base =
    "w-full rounded-xl px-5 py-6 text-center text-lg font-medium transition";
  const styleDefault = {
    background: "var(--card-bg)",
    border: `1px solid var(--card-border)`,
  };
  return (
    <button
      onClick={onClick}
      className={base}
      style={
        variant === "primary"
          ? { background: "var(--button-bg)", color: "var(--button-text)" }
          : styleDefault
      }
    >
      {label}
    </button>
  );
}

function Card({ children }) {
  return (
    <div
      className="w-full max-w-md rounded-xl p-4 shadow-sm"
      style={{
        background: "var(--card-bg)",
        border: `1px solid var(--card-border)`,
      }}
    >
      {children}
    </div>
  );
}
