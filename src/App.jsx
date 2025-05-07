import { useState, useEffect } from "react";

const BACKEND_URL = "http://127.0.0.1:8000"; // Change this to your deployed backend URL

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("session_id") || "");

  useEffect(() => {
    if (sessionId) {
      fetch(`${BACKEND_URL}/history/${sessionId}`)
        .then(res => res.json())
        .then(data => setMessages(data || []));
    }
  }, [sessionId]);

  const sendMessage = async () => {
    if (!query.trim()) return; // Prevent sending empty messages

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, session_id: sessionId }),
      });

      const data = await res.json();
      const newSession = data.session_id;

      if (!sessionId) {
        setSessionId(newSession);
        localStorage.setItem("session_id", newSession);
      }

      setMessages(prev => [...prev, `Q: ${query}`, `A: ${data.answer}`]);
      setQuery("");  // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const resetChat = async () => {
    if (!sessionId) return;
    await fetch(`${BACKEND_URL}/reset/${sessionId}`, { method: "POST" });
    localStorage.removeItem("session_id");
    setSessionId("");
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800">🧠 RAG Chatbot</h1>

        <div className="h-96 overflow-y-auto bg-gray-50 border rounded-md p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${msg.startsWith("Q:")
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"}`}
            >
              {msg}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-3 border border-gray-300 rounded-md"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Send
          </button>
          <button
            onClick={resetChat}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
