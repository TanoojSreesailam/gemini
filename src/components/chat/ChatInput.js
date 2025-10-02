"use client";

import { useState, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { shallow } from "zustand/shallow";
import toast from "react-hot-toast";
import ImagePreview from "./ImagePreview";

// Icon components using the fetched path data
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

const SendIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const ChatInput = ({ activeChatId }) => {
  const [text, setText] = useState("");
  const [base64Image, setBase64Image] = useState(null);
  const fileInputRef = useRef(null);

  const addMessage = useAppStore((state) => state.addMessage);
  const setAiTyping = useAppStore((state) => state.setAiTyping);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBase64Image(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = text.trim();

    if (!messageText && !base64Image) {
      toast.error("Please enter a message or attach an image.");
      return;
    }

    const userMessage = {
      id: Date.now().toString() + "u",
      text: messageText,
      role: "user",
      timestamp: Date.now(),
      type: base64Image ? "image" : "text",
      image: base64Image,
    };

    addMessage(activeChatId, userMessage);

    setText("");
    setBase64Image(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setAiTyping(true);

    const minDelay = 2000;
    const maxDelay = 5000;
    const thinkingTime =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      const responsePrefix = base64Image
        ? "Based on the image and your request: "
        : "Here is your detailed answer: ";
      const aiResponseText =
        responsePrefix +
        `I'm delighted to assist you with your request regarding "${
          messageText || "the attached image"
        }." This response simulates the complete, throttled output after a ${
          thinkingTime / 1000
        } second generation delay.`;

      const aiMessage = {
        id: Date.now().toString() + "a",
        text: aiResponseText,
        role: "ai",
        timestamp: Date.now() + 100,
        type: "text",
      };

      addMessage(activeChatId, aiMessage);
      setAiTyping(false);
    }, thinkingTime);
  };

  return (
    <div className="w-full px-4 pb-4">
      <div className="max-w-4xl w-full mx-auto relative">
        <ImagePreview base64Image={base64Image} onRemove={handleRemoveImage} />
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-2 rounded-full shadow-lg"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            aria-label="Attach Image"
          >
            <AddIcon className="h-6 w-6" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Message Gemini..."
            rows={1}
            className="flex-grow max-h-40 resize-none border-none bg-transparent focus:ring-0 text-base placeholder-gray-500 py-2 px-3"
            style={{ color: "var(--foreground)" }}
          />
          <button
            type="submit"
            className="p-3 ml-2 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                text.trim() || base64Image
                  ? "var(--primary)"
                  : "var(--surface-dark)",
            }}
            disabled={!text.trim() && !base64Image}
            aria-label="Send Message"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
