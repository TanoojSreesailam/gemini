// src/components/chat/TypingIndicator.js
const TypingIndicator = () => {
  return (
    <div className="flex justify-start w-full">
      <div className="max-w-4xl p-4 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800 rounded-tl-none">
        <div className="flex items-center space-x-1.5">
          {/* Simple three-dot pulsing animation */}
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300"></div>
          <span className="text-sm dark:text-gray-300 ml-2">
            Gemini is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
