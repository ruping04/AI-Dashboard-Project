import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUser, FaRobot } from 'react-icons/fa';
import API from '../services/api';

export default function QAPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! Ask me anything about your notes, and I'll do my best to find the answer for you." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await API.post('/ai/chat-with-notes', { query: input, user_id: userId });
      const aiMessage = { sender: 'ai', text: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { sender: 'ai', text: "Sorry, I ran into an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold text-white mb-2">Chat with Your Notes</h1>
      <p className="text-slate-400 text-lg mb-6">Your personal AI assistant, powered by the knowledge in your notes.</p>
      
      <div className="flex-grow bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col overflow-y-auto">
        <div className="flex-grow space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {msg.sender === 'ai' && <div className="bg-teal-500 p-3 rounded-full"><FaRobot /></div>}
                <div className={`max-w-xl p-4 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === 'user' && <div className="bg-slate-600 p-3 rounded-full"><FaUser /></div>}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="bg-teal-500 p-3 rounded-full"><FaRobot /></div>
              <div className="max-w-xl p-4 rounded-xl bg-slate-700">
                <div className="flex gap-2 items-center">
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your notes..."
          className="flex-grow p-4 bg-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="submit" className="p-4 bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-slate-700" disabled={isLoading}>
          <FaPaperPlane />
        </button>
      </form>
    </motion.div>
  );
}