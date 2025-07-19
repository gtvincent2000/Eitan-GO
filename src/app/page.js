'use client';

import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">
            Master Japanese Vocabulary
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-[var(--foreground-secondary)]">
            AI-powered study tools, sentence generation, translations, and a personalized notebook.
          </p>
          <Link href="/translate">
            <button className="button-theme px-6 py-3 rounded-xl text-lg font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
          Soon you’ll be able to track your study streaks and saved vocab history!
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
            <p className="text-2xl font-bold">✨ 0</p>
            <p className="text-sm text-[var(--foreground-secondary)]">Words Saved</p>
          </div>
          <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
            <p className="text-2xl font-bold">🔥 0</p>
            <p className="text-sm text-[var(--foreground-secondary)]">Day Streak</p>
          </div>
          <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
            <p className="text-2xl font-bold">🧪 0</p>
            <p className="text-sm text-[var(--foreground-secondary)]">Study Sessions</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
          Eitan-GO gives you everything you need to master Japanese vocabulary — powered by AI.
        </p>
        {/* Feature Cards (placeholder) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded shadow bg-[var(--card-bg)]">📘 Notebook</div>
          <div className="p-6 rounded shadow bg-[var(--card-bg)]">🧠 Flashcards</div>
          <div className="p-6 rounded shadow bg-[var(--card-bg)]">📝 Quiz Mode</div>
          <div className="p-6 rounded shadow bg-[var(--card-bg)]">💬 Translation</div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 text-center bg-[var(--section-bg)]">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
          Type a word, generate a sentence, and add it to your personal notebook — then study with flashcards or quizzes!
        </p>
        {/* Placeholder for screen recording or GIF */}
        <div className="w-full max-w-3xl mx-auto h-64 bg-gray-300 rounded shadow-inner flex items-center justify-center">
          <span className="text-gray-600">[Video or GIF Placeholder]</span>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-[var(--foreground-secondary)]">
        <p>
          Built by <a href="https://www.linkedin.com/in/gary-vincent-ab1542290/" target="_blank" className="underline">Gary Vincent</a> ·{" "}
          <a href="https://github.com/gtvincent2000" target="_blank" className="underline">GitHub</a>
        </p>
      </footer>
    </main>
  );
}
