// src/components/skeletons/MessageSkeleton.js
import React from "react";

const MessageSkeleton = ({ role = "ai" }) => {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl p-4 rounded-xl shadow-md flex flex-col space-y-2 animate-pulse 
          ${
            isUser
              ? "bg-blue-300 dark:bg-blue-800 rounded-br-none"
              : "bg-gray-200 dark:bg-gray-800 rounded-tl-none"
          }
        `}
      >
        {/* Line 1 (Main content line) */}
        <div
          className={`h-4 rounded-full ${
            isUser
              ? "bg-blue-400 dark:bg-blue-700 w-48"
              : "bg-gray-300 dark:bg-gray-700 w-64"
          }`}
        ></div>

        {/* Line 2 (Shorter line) */}
        <div
          className={`h-4 rounded-full ${
            isUser
              ? "bg-blue-400 dark:bg-blue-700 w-32 self-end"
              : "bg-gray-300 dark:bg-gray-700 w-40"
          }`}
        ></div>

        {/* Line 3 (Timestamp placeholder) */}
        <div
          className={`h-2 rounded-full mt-1 ${
            isUser
              ? "bg-blue-500 dark:bg-blue-600 w-12 self-end"
              : "bg-gray-400 dark:bg-gray-600 w-12 self-end"
          }`}
        ></div>
      </div>
    </div>
  );
};

// Component to render multiple skeletons (useful for loading pagination)
export const MessageSkeletonGroup = () => (
  <>
    <MessageSkeleton role="ai" />
    <MessageSkeleton role="user" />
    <MessageSkeleton role="ai" />
  </>
);

export default MessageSkeleton;
