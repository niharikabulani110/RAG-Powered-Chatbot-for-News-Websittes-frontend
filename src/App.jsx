import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("session_id");
    if (savedSession) {
      setSessionId(savedSession);
    } else {
      const newSession = uuidv4();
      setSessionId(newSession);
      localStorage.setItem("session_id", newSession);
    }
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        query,
        session_id: sessionId,
      });

      const answer = res.data.answer;
      const botMessage = { type: "bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);

      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= answer.length) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = answer.slice(0, i);
            return updated;
          });
          i++;
        } else {
          clearInterval(typeInterval);
          setLoading(false);
        }
      }, 20);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Failed to fetch response." },
      ]);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await axios.post(`http://localhost:8000/reset/${sessionId}`);
    const newSession = uuidv4();
    localStorage.setItem("session_id", newSession);
    setSessionId(newSession);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">📰 AI News Assistant</h1>

        <div
          ref={chatContainerRef}
          className="h-[400px] overflow-y-auto border rounded p-4 bg-gray-50 mb-4"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 p-2 rounded ${
                msg.type === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Ask something about the news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSend}
            disabled={loading}
          >
            Send
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;