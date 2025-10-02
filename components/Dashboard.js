"use client";

import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useAppStore } from "../store/useAppStore";

const Dashboard = () => {
  // Select state and actions separately (stable references, avoids infinite loop)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-72">
        <ChatArea />
      </main>
    </div>
  );
};

export default Dashboard;
