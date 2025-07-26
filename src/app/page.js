'use client';

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import FadeInOnCenter from "../components/FadeInOnCenter";

export default function LandingPage() {

  const [stats, setStats] = useState({
    saved_word_count: 0,
    daily_study_streak: 0,
    total_study_sessions: 0,
  });
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Fetch user stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setStats({
          saved_word_count: data.saved_word_count || 0,
          daily_study_streak: data.daily_study_streak || 0,
          total_study_sessions: data.total_study_sessions || 0,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <main style={{ background: "var(--background)", color: "var(--foreground)" }}>
      
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

      {/* Stats Section */}
      <FadeInOnCenter
        className="relative z-20 min-h-screen pt-[20vh] flex flex-col items-center justify-center text-center px-4"
      >
          <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
          <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
            Study Streaks and Vocab Stats coming soon! This is a placeholder for your personal stats.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
              <p className="text-2xl font-bold">✨ {stats.saved_word_count}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Words Saved</p>
            </div>
            <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
              <p className="text-2xl font-bold">🔥 {stats.daily_study_streak}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Day Streak</p>
            </div>
            <div className="p-4 rounded-lg shadow bg-[var(--card-bg)] w-48">
              <p className="text-2xl font-bold">🧪 {stats.total_study_sessions}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Study Sessions</p>
            </div>
          </div>
      </FadeInOnCenter>

      {/* Features Section */}
      <FadeInOnCenter
        className="relative z-20 min-h-screen pt-[20vh] flex flex-col items-center justify-center text-center px-4"
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
        className="relative z-20 min-h-screen pt-[10vh] flex flex-col items-center justify-center text-center px-4"
      >
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
          Type a word, generate a sentence, and add it to your personal notebook — then study with flashcards or quizzes!
        </p>
        {/* Placeholder for screen recording or GIF */}
        <div className="w-full max-w-3xl mx-auto h-64 bg-gray-300 rounded shadow-inner flex items-center justify-center">
          <span className="text-gray-600">[Video or GIF Placeholder]</span>
        </div>
      </FadeInOnCenter>


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
