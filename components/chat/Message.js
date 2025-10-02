/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import toast from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";

// --- Icon Components ---
const CopyIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const AiIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M19 11.5h-1.5V10c0-.55-.45-1-1-1s-1 .45-1 1v1.5H14c-.55 0-1 .45-1 1s.45 1 1 1h1.5V16c0 .55.45 1 1 1s1-.45 1-1v-1.5H19c.55 0 1-.45 1-1s-.45-1-1-1zm-7-6.5c-.55 0-1 .45-1 1v1.5H9c-.55 0-1 .45-1 1s.45 1 1 1h1.5V14c0 .55.45 1 1 1s1-.45 1-1v-1.5H14c.55 0-1 .45-1 1s-.45-1-1-1h-1.5V7c0-.55-.45-1-1-1zm-7 6.5H4c-.55 0-1 .45-1 1s.45 1 1 1h1.5V16c0 .55.45 1 1 1s1-.45 1-1v-1.5H9c.55 0 1-.45 1-1s-.45-1-1-1H7.5V10c0-.55-.45-1-1-1s-1 .45-1 1v1.5z" />
    </svg>
);


const Message = ({ message }) => {
  const { text, role, timestamp, image } = message;
  const isUser = role === "user";
  const userName = useAppStore((state) => state.authState.user?.name);

  const handleCopy = async () => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy.");
      }
    }
  };

  const Avatar = () => {
    if (isUser) {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {userName ? userName[0].toUpperCase() : "U"}
        </div>
      );
    }
    return (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <AiIcon className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <div className={`flex w-full items-start space-x-4 group ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar />}
      <div
        className={`max-w-2xl p-4 rounded-2xl flex flex-col space-y-2 relative`}
        style={{
          backgroundColor: isUser ? 'rgba(26, 115, 232, 0.1)' : 'var(--surface)',
          color: 'var(--foreground)',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {image && (
          <div className="mb-2 max-w-xs md:max-w-sm rounded-lg overflow-hidden">
            <img src={image} alt="User upload" className="w-full h-auto object-cover" />
          </div>
        )}

        <p className="whitespace-pre-wrap text-base">{text}</p>

        {!isUser && text && (
          <div className="absolute -bottom-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy to Clipboard"
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <CopyIcon className="h-4 w-4" style={{ fill: 'var(--foreground)' }} />
            </button>
          </div>
        )}
      </div>
      {isUser && <Avatar />}
    </div>
  );
};

export default Message;