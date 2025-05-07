import React from "react";

function ChatMessage({ sender, text }) {
    const isUser = sender === "user";
  
    return (
      <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`px-4 py-2 rounded-lg max-w-xs whitespace-pre-line ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          {typeof text === "function" ? "[Invalid content]" : text}
        </div>
      </div>
    );
  }
  
  export default ChatMessage;
