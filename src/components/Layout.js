// src/components/Layout.js
"use client"; // This component manages state and interactivity

import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import DarkModeToggle from "./DarkModeToggle";

const Layout = ({ children }) => {
  const theme = useAppStore((state) => state.theme);

  // Apply theme to the <html> element to avoid hydration mismatch
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    // The main wrapper provides global styling but no longer manages the theme class
    <div
      className={`min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
    >
      {/* We can place the toggle somewhere for testing */}
      <div className="absolute top-4 right-4 z-50">
        <DarkModeToggle />
      </div>

      {/* Main content of the application */}
      <main className="flex min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;