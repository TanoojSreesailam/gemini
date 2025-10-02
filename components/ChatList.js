"use client";

import toast from "react-hot-toast";
import { useAppStore } from "../store/useAppStore";

// Defining icons here for now.
const CloseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const ChatList = ({ filterText = "" }) => {
  const allChats = useAppStore((state) => state.chats);
  const activeChatId = useAppStore((state) => state.activeChatId);
  const setActiveChatId = useAppStore((state) => state.setActiveChatId);
  const deleteChat = useAppStore((state) => state.deleteChat);

  const lowerCaseFilter = filterText.toLowerCase();
  const filtered = allChats.filter((chat) => {
    if (chat.title && chat.title.toLowerCase().includes(lowerCaseFilter))
      return true;
    if (chat.messages.length > 0 && chat.messages[0].text) {
      return chat.messages[0].text.toLowerCase().includes(lowerCaseFilter);
    }
    return lowerCaseFilter === "";
  });

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    // Simplified toast for confirmation, can be improved later
    toast(
      (t) => (
        <div className="flex flex-col items-center space-y-2">
          <p>Delete this chat?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                deleteChat(chatId);
                toast.success("Chat deleted.", { id: t.id });
              }}
              className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm rounded-lg border"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  return (
    <div className="space-y-1">
      {filtered.length === 0 ? (
        <p className="text-sm p-2" style={{ color: "var(--foreground-light)" }}>
          No chats found.
        </p>
      ) : (
        filtered.map((chat) => {
          const isActive = chat.id === activeChatId;
          const displayTitle =
            chat.messages[0]?.text?.substring(0, 25) +
              (chat.messages[0]?.text?.length > 25 ? "..." : "") ||
            chat.title ||
            "New Chat";

          return (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`
    flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 group
    ${
      isActive
        ? "bg-blue-100 dark:bg-blue-900 font-semibold shadow-md"
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    }
  `}
              style={{
                color: "var(--foreground)",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="truncate text-sm ml-2">{displayTitle}</span>

              {!isActive && (
                <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    title="Delete Chat"
                    className="p-2 rounded-full hover:bg-slate-700 hover:text-white transition-colors duration-200"
                  >
                    <CloseIcon
                      className="h-4 w-4"
                      style={{ fill: "currentColor" }}
                    />
                  </button>
                </div>
              )}
            </button>
          );
        })
      )}
    </div>
  );
};

export default ChatList;
