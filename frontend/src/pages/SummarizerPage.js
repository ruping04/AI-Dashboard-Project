import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { FaRegSave } from 'react-icons/fa'; // Import a new icon

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false); // ✅ New state to track if note is saved

  // Get the user ID from localStorage to know who is saving the note
  const userId = localStorage.getItem('user_id');

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');
    setIsNoteSaved(false); // Reset the saved state on new summary
    try {
      // Pass the user_id to the backend
      const res = await API.post('/ai/summarize', { text, user_id: userId });
      setSummary(res.data.summary);
    } catch (err) {
      setError('Failed to get summary from AI. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  };

  // ✅ --- NEW FUNCTION TO SAVE THE SUMMARY AS A NOTE ---
  const handleSaveToNotes = async () => {
    if (!summary) {
      alert("There's no summary to save!");
      return;
    }

    // We'll create a title from the first few words of the summary
    const noteTitle = "Summary: " + summary.split(' ').slice(0, 5).join(' ') + '...';
    
    try {
      // We call the *existing* endpoint for creating a note
      await API.post('/notes', {
        title: noteTitle,
        content: summary,
        user_id: userId
      });
      setIsNoteSaved(true); // Set state to show a "Saved!" message
      setTimeout(() => setIsNoteSaved(false), 3000); // Reset after 3 seconds
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Could not save the note. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold text-white mb-2">AI Text Summarizer</h1>
      <p className="text-slate-400 text-lg mb-8">Paste your text below to get a concise summary.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <textarea
            className="w-full h-80 p-4 bg-slate-900 rounded-lg text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your long text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="w-full mt-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Summarizing...' : 'Summarize Text'}
          </button>
        </div>

        {/* Output Area */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          {/* ✅ --- NEW HEADER WITH SAVE BUTTON --- */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Summary</h2>
            {summary && ( // Only show the button if there is a summary
              <button
                onClick={handleSaveToNotes}
                disabled={isNoteSaved}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-all"
              >
                <FaRegSave />
                {isNoteSaved ? 'Saved!' : 'Save to Notes'}
              </button>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {summary && (
            <div className="text-slate-300 whitespace-pre-wrap">{summary}</div>
          )}
          {!summary && !error && (
            <p className="text-slate-500">Your summary will appear here...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}