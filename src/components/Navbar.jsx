"use client";

import { useState, useEffect, useRef } from "react";

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

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-md z-50 p-2">
            <div className="flex items-center justify-between p-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                  darkMode ? 'bg-blue-800' : 'bg-pink-200'
                }`}
              >
                {/* Sun Icon - Left */}
                <span className="absolute left-1 text-xs">
                  🌙
                </span>

                {/* Moon Icon - Right */}
                <span className="absolute right-1 text-xs">
                  ☀️
                </span>

                {/* Slider circle */}
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
