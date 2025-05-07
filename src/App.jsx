import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize session and fetch history
  useEffect(() => {
    const existingSessionId = localStorage.getItem("session_id");
    const currentSessionId = existingSessionId || uuidv4();
    setSessionId(currentSessionId);
    if (!existingSessionId) {
      localStorage.setItem("session_id", currentSessionId);
    }

    axios
      .get(`http://localhost:8000/history/${currentSessionId}`)
      .then((res) => {
        const historyMessages = res.data.map((entry, index) => ({
          id: index,
          type: entry.startsWith("User:") ? "question" : "answer",
          text: entry.replace(/^User: |^Bot: /, ""),
        }));
        setMessages(historyMessages);
      })
      .catch((err) => {
        console.error("Failed to fetch chat history:", err);
      });
  }, []);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMessage = { id: Date.now(), type: "question", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        query,
        session_id: sessionId,
      });

      const botMessage = {
        id: Date.now() + 1,
        type: "answer",
        text: res.data.answer,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "answer",
          text: "Error: Could not get response from server.",
        },
      ]);
      console.error("Chat API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`http://localhost:8000/reset/${sessionId}`);
      const newSessionId = uuidv4();
      localStorage.setItem("session_id", newSessionId);
      setSessionId(newSessionId);
      setMessages([]);
      setQuery("");
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">
          News Chatbot 🤖
        </h1>

        <div className="h-96 overflow-y-auto border rounded p-4 space-y-2 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.type === "question"
                  ? "bg-blue-100 text-left"
                  : "bg-green-100 text-right"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-500">Typing...</div>}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ask something..."
            className="flex-1 border rounded p-2 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSend}
          >
            Send
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
