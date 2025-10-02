import React, { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore.js"; // ADDED .js
import { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";

// Icons (using lucide-react)
import {
  Moon,
  Sun,
  Loader2,
  LogOut,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

// Import the actual components built in Phase 2, 3 & 4
import { AuthScreen } from "./components/Auth/AuthScreen.jsx"; // ADDED .jsx
import { ChatList } from "./components/Dashboard/ChatList.jsx"; // ADDED .jsx
import { ChatInterface } from "./components/Chat/ChatInterface.jsx"; // ADDED .jsx

// --- 1. Utility Components (Reusable UI elements) ---

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  icon: Icon,
  disabled = false,
  type = "button",
  "aria-label": ariaLabel,
}) => {
  let baseStyles =
    "px-3 py-2 rounded-xl flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm font-medium";

  if (variant === "primary") {
    baseStyles +=
      " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed";
  } else if (variant === "secondary") {
    baseStyles +=
      " bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed";
  } else if (variant === "ghost") {
    baseStyles +=
      " text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? "mr-2" : ""}`} />}
      {children}
    </button>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppStore();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="w-10 h-10 p-0 rounded-full"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </Button>
  );
};

// --- Main App Component (App.jsx) ---

export default function App() {
  const theme = useAppStore((state) => state.theme);
  const { isAuthenticated, logout, chats } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  // 1. Theme Application Effect
  useEffect(() => {
    if (typeof window !== "undefined" && window.document.documentElement) {
      const root = window.document.documentElement;
      // Ensure classes are correctly toggled
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      // Apply a base background color to prevent flashes during loading
      const bgColor = theme === "dark" ? "#111827" : "#f9fafb";
      root.style.backgroundColor = bgColor;
    }
  }, [theme]);

  // 2. Hydration/Loading State (Wait for Zustand/localStorage to load)
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Zustand persistence hook to know when local storage data is loaded
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // Fallback for immediate hydration if state is already loaded
    if (useAppStore.persist.has(useAppStore.persist.getOptions().name)) {
      setIsHydrated(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isHydrated) {
    // Loading skeleton display while waiting for persistence layer
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-700 dark:text-gray-300">
          Loading App Data...
        </span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${theme}`}>
      <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="flex h-screen overflow-hidden">
          {/* --- Sidebar (Desktop & Mobile Overlay) --- */}
          {isAuthenticated && (
            <>
              {/* Desktop Sidebar (Always visible on md and up) */}
              <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 flex-col transition-all duration-300">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h1 className="text-xl font-bold text-blue-600">
                    Gemini Clone
                  </h1>
                  <ThemeToggle />
                </div>
                <div className="flex-1 min-h-0 pb-4">
                  <ChatList closeSidebar={closeSidebar} />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                  <Button
                    onClick={logout}
                    variant="secondary"
                    className="w-full"
                    icon={LogOut}
                  >
                    Log Out ({chats.length} chats)
                  </Button>
                </div>
              </aside>

              {/* Mobile Sidebar Overlay (Click to close) */}
              <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
                  isSidebarOpen
                    ? "opacity-100 pointer-events-auto bg-black bg-opacity-50"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              ></div>

              {/* Mobile Sidebar Panel (Conditionally translated) */}
              <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 flex flex-col transition-transform duration-300 transform md:hidden ${
                  isSidebarOpen
                    ? "translate-x-0 shadow-2xl"
                    : "-translate-x-full"
                }`}
              >
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h1 className="text-xl font-bold text-blue-600">
                    Gemini Clone
                  </h1>
                  <Button
                    onClick={() => setIsSidebarOpen(false)}
                    variant="ghost"
                    className="w-10 h-10 p-0 rounded-full"
                    icon={X}
                    aria-label="Close menu"
                  />
                </div>
                <div className="flex-1 min-h-0 pb-4">
                  <ChatList closeSidebar={closeSidebar} />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                  <ThemeToggle />
                  <Button
                    onClick={logout}
                    variant="secondary"
                    className="flex-1 ml-4"
                    icon={LogOut}
                  >
                    Log Out
                  </Button>
                </div>
              </aside>
            </>
          )}

          {/* --- Main Content Area --- */}
          <main className="flex-1 flex flex-col relative">
            {isAuthenticated ? (
              <>
                {/* Mobile Header/Menu Button */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                  <Button
                    onClick={() => setIsSidebarOpen(true)}
                    variant="ghost"
                    className="w-10 h-10 p-0 rounded-full"
                    icon={Menu}
                    aria-label="Open menu"
                  />
                  <h1 className="text-lg font-bold text-blue-600">
                    Gemini Clone
                  </h1>
                  <ThemeToggle />
                </header>
                <ChatInterface />{" "}
                {/* Renders the full chat UI (Header, List, Input) */}
              </>
            ) : (
              <AuthScreen /> /* Renders the full-screen login form */
            )}
          </main>
        </div>
      </div>

      {/* Toast Notifications Provider */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === "dark" ? "#374151" : "#fff",
            color: theme === "dark" ? "#f3f4f6" : "#111827",
            borderRadius: "12px",
            padding: "16px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </div>
  );
}
