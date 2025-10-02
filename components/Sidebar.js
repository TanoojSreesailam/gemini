"use client";

import DarkModeToggle from "./DarkModeToggle";
import ChatList from "./ChatList";
import DebouncedSearchBar from "./DebouncedSearchBar";
import { useState } from "react";
import { useAppStore } from "../store/useAppStore";

const AddIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const Sidebar = () => {
  const userName = useAppStore((state) => state.authState.user?.name);
  const addChat = useAppStore((state) => state.addChat);
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const [filterText, setFilterText] = useState("");

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };
    addChat(newChat);
    if (isSidebarOpen) toggleSidebar();
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 z-20 flex flex-col bg-white shadow-lg transition-transform duration-300
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Top: New Chat */}
        <div className="mb-4">
          <button
            onClick={handleNewChat}
            className="w-full py-2 px-4 flex items-center justify-center space-x-2 rounded-full transition-colors"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <AddIcon className="h-6 w-6" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <DebouncedSearchBar onSearch={setFilterText} />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto pr-2">
          <ChatList filterText={filterText} />
        </div>

        {/* Bottom: User + DarkMode */}
        <div
          className="pt-4 border-t"
          style={{ borderColor: "var(--background)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {userName ? userName[0].toUpperCase() : "U"}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {userName || "User"}
              </span>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
