import { create } from "zustand";

// Helper to get initial state from localStorage for persistence
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "dark"; // Default to dark theme
  }
  return "dark";
};

export const useAppStore = create((set) => ({
  // --- 1. Auth State (Phase 1.3, 2.4) ---
  authState: {
    isLoggedIn: false,
    user: null, // Holds user info after login
  },

  // Action to update auth state
  setAuthState: (newState) =>
    set((state) => ({
      authState: { ...state.authState, ...newState },
    })),

  // --- 2. Theme State (Phase 1.3) ---
  theme: getInitialTheme(), // 'dark' or 'light'

  // Action to toggle the theme and persist it
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    }),

  // --- 3. UI / Mobile Sidebar State (Phase 6.2) ---
  isSidebarOpen: false, // Default to closed on mobile
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // --- 4. AI Typing State (Phase 5.2) ---
  isAiTyping: false,
  setAiTyping: (isTyping) => set({ isAiTyping: isTyping }),

  // --- 5. Chats State & CRUD (Phase 1.3, 3.4) ---
  chats: [
    // Placeholder chat for initial load
    {
      id: "1",
      title: "Initial Conversation",
      messages: [
        {
          id: "1u",
          text: "Hello, can you help me understand how to build a Next.js frontend?",
          role: "user",
          timestamp: Date.now() - 50000,
          type: "text",
        },
        {
          id: "1a",
          text: "I'd be happy to! Building a Next.js frontend involves using React components, routing, and typically styling with Tailwind CSS. We're currently following a plan to cover state management with Zustand and forms with react-hook-form. What part are you most interested in learning about first?",
          role: "ai",
          timestamp: Date.now() - 40000,
          type: "text",
        },
      ],
      createdAt: Date.now(),
    },
  ],
  activeChatId: "1",

  // Action to set the active chat
  setActiveChatId: (id) => set({ activeChatId: id }),

  // Action to add a new chat
  addChat: (newChat) =>
    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChatId: newChat.id,
    })),

  // Action to delete a chat
  deleteChat: (chatIdToDelete) =>
    set((state) => {
      const updatedChats = state.chats.filter(
        (chat) => chat.id !== chatIdToDelete
      );
      let newActiveChatId = state.activeChatId;

      // If the deleted chat was the active one, switch to the most recent chat or null
      if (chatIdToDelete === state.activeChatId) {
        newActiveChatId = updatedChats.length > 0 ? updatedChats[0].id : null;
      }

      return {
        chats: updatedChats,
        activeChatId: newActiveChatId,
      };
    }),

  // Action to add a new message to the active chat
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),
}));
