import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

function AIAssistant() {
  const [available, setAvailable] = useState(true);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your BOUTIQ assistant. Ask me anything about running your shop.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const checkStatus = async () => {
    try {
      const { data } = await api.get('/ai/status');
      setAvailable(data.available);
    } catch (error) {
      setAvailable(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: input });
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      if (data.available === false) setAvailable(false);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'AI Assistant is currently unavailable. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4">AI Assistant</h3>

      {!available && (
        <div className="alert alert-warning">
          AI Assistant is currently unavailable. Ask the admin to add an OPENAI_API_KEY in the backend .env file to enable this feature.
        </div>
      )}

      <div className="card shadow-sm" style={{ maxWidth: '700px' }}>
        <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
          {messages.map((m, index) => (
            <div key={index} className={`d-flex mb-2 ${m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-2 rounded ${m.sender === 'user' ? 'bg-dark text-white' : 'bg-light'}`} style={{ maxWidth: '75%' }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <div className="card-footer">
          <form onSubmit={handleSend} className="d-flex gap-2">
            <input
              className="form-control"
              placeholder={available ? 'Type your question...' : 'AI Assistant unavailable'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!available || loading}
            />
            <button className="btn btn-dark" type="submit" disabled={!available || loading}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
