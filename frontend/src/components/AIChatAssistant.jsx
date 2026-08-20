import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { Send, Bot, User } from 'lucide-react';

export default function AIChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am KumbhAI — powered by Groq AI with real-time Nashik Kumbh Mela data. I have access to live crowd, traffic, medical, and safety information. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', { message: userMsg.content });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errDetail = error?.response?.data?.detail || error?.message || 'Unknown error';
      setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Error: ${errDetail}\n\nMake sure GROQ_API_KEY is set correctly in backend/.env and the backend server is running.` }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content) => {
    if (!content) return null;
    // Strip out the <think> block completely, even if </think> is missing
    const cleanContent = content.replace(/<think>[\s\S]*?(?:<\/think>|$)/, '').trim();
    if (!cleanContent) {
      return <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'var(--text-secondary)' }}>The AI's response was interrupted while processing. Please try asking again.</div>;
    }
    return <div style={{ whiteSpace: 'pre-wrap' }}>{cleanContent}</div>;
  };

  return (
    <div className="chat-container">
      <h2 className="page-title">KumbhAI Assistant (Groq + RAG)</h2>
      <p className="page-subtitle">Powered by Groq AI with real-time Kumbh Mela data. Ask about crowd prediction, traffic, medical alerts, or emergency response.</p>
      
      <div className="glass-card chat-history" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '60vh', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                {msg.role === 'ai' ? 'KumbhAI' : 'Admin'}
            </div>
            {renderMessageContent(msg.content)}
          </div>
        ))}
        {loading && (
          <div className="chat-message ai">
             <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                <Bot size={16} /> KumbhAI
            </div>
             <em>Analyzing data...</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          className="chat-input"
          placeholder="e.g., Which sectors need more medical staff today?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-primary" onClick={handleSend} disabled={loading}>
          <Send size={18} /> Send
        </button>
      </div>
    </div>
  );
}
