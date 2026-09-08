import React, { useEffect, useRef, useState } from "react";
import customerApi from "../../utils/customerApi";

const suggestions = [
  "What fabric works for a summer wedding?",
  "How should I take my blouse measurements?",
  "Suggest a neckline for a petite frame",
  "How do I care for silk?",
];

function CustomerAIAssistant() {
  const [available, setAvailable] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Welcome to your style studio. I can help with fabrics, fit, outfit ideas, measurements, and care.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    customerApi
      .get("/customer-portal/ai/status")
      .then(({ data }) => setAvailable(data.available))
      .catch(() => setAvailable(false));
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event, text = input) => {
    event?.preventDefault();
    if (!text.trim() || loading) return;
    setMessages((current) => [
      ...current,
      { sender: "user", text: text.trim() },
    ]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await customerApi.post("/customer-portal/ai/chat", {
        message: text.trim(),
      });
      setMessages((current) => [
        ...current,
        { sender: "ai", text: data.reply },
      ]);
      if (data.available === false) setAvailable(false);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          sender: "ai",
          text:
            error.response?.data?.message ||
            "I am unavailable right now. Please try again later or contact the BOUTIQ studio.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="style-assistant-page">
      <div className="d-flex justify-content-between align-items-end mb-4 gap-3">
        <div>
          <p className="eyebrow mb-1">YOUR STYLE STUDIO</p>
          <h2 className="mb-1">Ask your style assistant</h2>
          <p className="text-muted mb-0">
            Ideas and guidance for your next BOUTIQ piece.
          </p>
        </div>
        <span className="assistant-status">
          {available ? "READY TO HELP" : "KEY NEEDED"}
        </span>
      </div>
      {!available && (
        <div className="alert alert-warning">
          The assistant is not configured yet. Add `OPENAI_API_KEY` to the
          backend environment when you are ready.
        </div>
      )}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card assistant-card">
            <div className="assistant-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`assistant-message ${message.sender}`}
                >
                  {message.text}
                </div>
              ))}
              {loading && (
                <div className="assistant-message ai">
                  Thinking about that...
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="assistant-composer">
              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  className="form-control"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    available
                      ? "Ask about fabric, fit, or your next look..."
                      : "Assistant unavailable"
                  }
                  disabled={!available || loading}
                />
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={!available || loading}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card p-4">
            <p className="eyebrow mb-2">TRY ASKING</p>
            <h5 className="mb-3">Start with an idea</h5>
            <div className="assistant-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={(event) => sendMessage(event, suggestion)}
                  disabled={!available || loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <p className="small text-muted mt-4 mb-0">
              The assistant offers general style guidance. Your BOUTIQ team
              confirms final measurements, pricing, and delivery dates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerAIAssistant;
