import React, { useState, useEffect } from "react";

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="bg-primary-100 border border-border rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 text-lg ml-2 hover:bg-primary-300 hover:scale-105 focus:outline-none focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="block leading-none">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};
