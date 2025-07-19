"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 shadow sticky top-0 z-50"
     style={{ background: "var(--navbar-bg)", color: "var(--navbar-text)" }}>
      {/* Logo */}
      <div className="flex items-center">
        <img src="/assets/eitango-logo-1_1.png" alt="Eitan-GO Logo" className="h-10 w-10 rounded" />
      </div>


      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
          aria-label="Open dropdown menu"
        >
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">E</span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 rounded shadow-md z-50 p-2 border"
              style={{
                background: "var(--dropdown-bg)",
                color: "var(--foreground)",
              }}
            >
              <div className="flex flex-col gap-2 p-2">
                {/* Navigation Buttons */}
                <Link href="/" className="hover:text-blue-500">
                  <button
                    className="w-full text-left px-2 py-1 rounded transition-colors duration-200"
                    style={{
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--nav-clickable-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Home
                  </button>
                </Link>
                <Link href="/vocab" className="hover:text-blue-500">
                  <button
                    className="w-full text-left px-2 py-1 rounded transition-colors duration-200"
                    style={{
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--nav-clickable-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Vocab Notebook
                  </button>
                </Link>
                <Link href="/translate" className="hover:text-blue-500">
                  <button
                    className="w-full text-left px-2 py-1 rounded transition-colors duration-200"
                    style={{
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--nav-clickable-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Translate
                  </button>
                </Link>
                <Link href="/study" className="hover:text-blue-500">
                  <button
                    className="w-full text-left px-2 py-1 rounded transition-colors duration-200"
                    style={{
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--nav-clickable-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Study
                  </button>
                </Link>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm">Theme</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                      darkMode ? "bg-blue-800" : "bg-yellow-200"
                    }`}
                  >
                    <span className="absolute left-1 text-xs">🌙</span>
                    <span className="absolute right-1 text-xs">☀️</span>
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
