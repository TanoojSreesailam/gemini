// src/app/layout.js

import Layout from "../components/Layout";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// Import the Layout wrapper

export const metadata = {
  title: "Gemini Clone",
  description: "A Vibe Coded Gemini Frontend Clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove theme class from html tag, it will be applied by the Layout component */}
      <body>
        <Layout>{children}</Layout>
        {/* Toaster should remain outside the main Layout for global positioning */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
