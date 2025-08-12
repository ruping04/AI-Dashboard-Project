import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaRegSave } from 'react-icons/fa';
import API from '../services/api';

export default function ContentWriterPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const userId = localStorage.getItem('user_id');

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt or some bullet points.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    setIsNoteSaved(false);
    try {
      const res = await API.post('/ai/expand-content', { text: prompt });
      setGeneratedContent(res.data.expanded_content);
    } catch (err) {
      setError('Failed to generate content from AI.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSaveToNotes = async () => {
    if (!generatedContent) return;
    const noteTitle = "AI Generated: " + prompt.split(' ').slice(0, 4).join(' ') + '...';
    try {
      await API.post('/notes', { title: noteTitle, content: generatedContent, tags: "ai-generated, writer", user_id: userId });
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 3000);
    } catch (err) {
      alert("Could not save the note.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold text-white mb-2">AI Content Writer</h1>
      <p className="text-slate-400 text-lg mb-8">Provide a few bullet points or an idea, and let the AI expand it.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Your Idea/Prompt</h2>
          <textarea
            className="w-full h-80 p-4 bg-slate-900 rounded-lg text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="- Bullet point 1&#10;- Bullet point 2&#10;- Or just a simple idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerateContent}
            disabled={isLoading}
            className="w-full mt-4 py-3 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <FaPencilAlt />
            {isLoading ? 'Writing...' : 'Expand Content'}
          </button>
        </div>

        {/* Output Area */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Generated Content</h2>
            {generatedContent && (
              <button onClick={handleSaveToNotes} disabled={isNoteSaved} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-800 transition-all">
                <FaRegSave />
                {isNoteSaved ? 'Saved!' : 'Save to Notes'}
              </button>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {generatedContent && (
            <div className="text-slate-300 whitespace-pre-wrap h-80 overflow-y-auto">{generatedContent}</div>
          )}
          {!generatedContent && !error && (
            <p className="text-slate-500">Your expanded content will appear here...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}