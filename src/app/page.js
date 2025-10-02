// src/app/page.js
"use client";

// Import Dashboard

import PhoneInputForm from "../components/Auth/PhoneInputForm";
import Dashboard from "../components/Dashboard";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
  // We use shallow comparison for performance if needed, but simple access is fine here
  const isLoggedIn = useAppStore((state) => state.authState.isLoggedIn);

  // Conditional Rendering: Display Dashboard if logged in, otherwise display Auth Form
  if (isLoggedIn) {
    return (
      // The Dashboard handles the two-column layout
      <Dashboard />
    );
  }

  // Login/Signup View (Phase 2)
  return (
    <div className="flex items-center justify-center w-full py-12">
      <PhoneInputForm />
    </div>
  );
}
