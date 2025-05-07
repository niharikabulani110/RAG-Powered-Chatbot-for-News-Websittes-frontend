import React from "react";

function InputBar({ query, setQuery, onSend, onReset }) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask a question..."
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={onSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Send
      </button>
      <button
        onClick={onReset}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        Reset
      </button>
    </div>
  );
}

export default InputBar;
