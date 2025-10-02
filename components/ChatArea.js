"use client";

import Message from "./chat/Message";
import ChatInput from "./chat/ChatInput";
import TypingIndicator from "./chat/TypingIndicator";
import { useRef, useEffect, useState, useMemo } from "react";
import { MessageSkeletonGroup } from "./skeletons/MessageSkeleton";
import { useAppStore } from "../store/useAppStore";
import { throttle } from "../utils";

const MESSAGES_PER_PAGE = 20;

const ChatArea = () => {
  const activeChatId = useAppStore((state) => state.activeChatId);
  const activeChat = useAppStore((state) =>
    state.chats.find((chat) => chat.id === state.activeChatId)
  );
  const isAiTyping = useAppStore((state) => state.isAiTyping);

  const allMessages = activeChat ? activeChat.messages : [];

  const [messagePage, setMessagePage] = useState(1);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);

  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const prevScrollHeightRef = useRef(0);

  const totalMessages = allMessages.length;
  const startIndex = Math.max(
    0,
    totalMessages - messagePage * MESSAGES_PER_PAGE
  );
  const displayedMessages = allMessages.slice(startIndex, totalMessages);
  const hasMoreMessages = startIndex > 0;

  // Scroll effect when messages change
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    if (prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeightRef.current;
      container.scrollTop = heightDifference + container.scrollTop;
      prevScrollHeightRef.current = 0;
      setIsFetchingOlder(false);
    }

    if (!isInitialLoad.current || totalMessages > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (isInitialLoad.current && totalMessages > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoad.current = false;
    }
  }, [totalMessages]);

  // Reset page on chat change
  useEffect(() => {
    setMessagePage(1);
    isInitialLoad.current = true;
    prevScrollHeightRef.current = 0;
  }, [activeChatId]);

  // Load older messages
  const loadNextPage = () => {
    if (
      hasMoreMessages &&
      !isAiTyping &&
      messageContainerRef.current &&
      !isFetchingOlder
    ) {
      setIsFetchingOlder(true);
      prevScrollHeightRef.current = messageContainerRef.current.scrollHeight;
      setTimeout(() => {
        setMessagePage((prev) => prev + 1);
      }, 500);
    }
  };

  // Throttled scroll handler
  const handleScroll = useMemo(
    () =>
      throttle((e) => {
        if (e.target.scrollTop < 50) {
          loadNextPage();
        }
      }, 100),
    [hasMoreMessages, isAiTyping, isFetchingOlder]
  );

  if (!activeChatId || !activeChat) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <h2
          className="text-3xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Gemini Clone
        </h2>
        <p
          className="mt-2 text-md"
          style={{ color: "var(--foreground-light)" }}
        >
          Click 'New Chat' to begin a conversation.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header */}
      <header
        className="p-4 sticky top-0 z-10"
        style={{ backgroundColor: "var(--background)" }}
      >
        <h1
          className="text-lg font-bold truncate"
          style={{ color: "var(--foreground)" }}
        >
          {activeChat.title || "Conversation"}
        </h1>
      </header>

      {/* Messages - scrollable */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {isFetchingOlder && hasMoreMessages && (
          <div className="space-y-4 mb-4">
            <MessageSkeletonGroup />
          </div>
        )}

        {displayedMessages.length === 0 && !isFetchingOlder ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2
              className="text-5xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Hello!
            </h2>
            <p
              className="mt-2 text-xl"
              style={{ color: "var(--foreground-light)" }}
            >
              How can I help you today?
            </p>
          </div>
        ) : (
          displayedMessages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}

        {isAiTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0 z-10 p-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <ChatInput activeChatId={activeChatId} />
      </div>
    </div>
  );
};

export default ChatArea;
