'use client';

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import FadeInOnCenter from "../components/FadeInOnCenter";

export default function LandingPage() {
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <main className="font-sans"
          style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      
      <section className="relative h-screen">
        {/* The background image stays fixed */}
        <motion.img
          src="../assets/eitango-banner-7.jpg"
          alt="Eitan-GO Banner"
          className="fixed top-0 left-0 w-full h-screen object-cover object-center z-0"
          style={{ opacity }}
        />
        {/* Optional overlay */}
        <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none bg-gradient-to-b from-transparent to-[var(--background)]" />
      </section>

      {/* Hero Text Slides Up Over Image */}
      <motion.section
        ref={heroRef}
        className="relative z-20 min-h-[70vh] -mt-[60vh] flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div style={{ y, opacity: opacityText }}>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">
              Master Japanese Vocabulary
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-[var(--foreground-secondary)]">
              AI-powered tools, translations, and a personalized study system.
            </p>
            <Link href="/translate">
              <button className="button-theme px-6 py-3 rounded-xl text-lg font-semibold">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <FadeInOnCenter
        className="relative z-20 min-h-[80vh] pt-[8vh] flex flex-col items-center justify-center text-center px-4"
      >
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
      </FadeInOnCenter>

      {/* How It Works Section */}
      <FadeInOnCenter
        className="relative z-10 min-h-[80vh] pt-[4vh] flex flex-col items-center justify-center text-center px-4"
      >
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
          Type a word, generate a sentence, and add it to your personal notebook — then study with flashcards or quizzes!
        </p>

        <video
          src="/assets/eitan-go-tutorial.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-lg shadow-lg w-full max-w-3xl"
        />
      </FadeInOnCenter>


      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-[var(--foreground-secondary)] bg-[var(--background)] z-50 relative">
        <p className="space-x-2">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/gary-vincent-dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            Gary Vincent
          </a>
          ·
          <a
            href="https://github.com/gtvincent2000"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
