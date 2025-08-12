import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink } from 'react-icons/fa';
import API from '../services/api';
import LoadingSpinner from '../components/Loadspinner';

export default function WebScraperPage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrapeAndSummarize = async () => {
    if (!url.trim() || !url.startsWith('http')) {
      setError('Please enter a valid URL (starting with http or https).');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const res = await API.post('/ai/scrape-and-summarize', { url });
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'An unknown error occurred.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold text-white mb-2">Web Article Summarizer</h1>
      <p className="text-slate-400 text-lg mb-8">Paste the URL of an article and get a summary in seconds.</p>
      
      {/* Input Section */}
      <div className="flex items-center gap-4 p-6 bg-slate-800 rounded-xl border border-slate-700">
        <FaLink className="text-slate-500 text-xl" />
        <input
          type="url"
          className="w-full p-3 bg-slate-900 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="https://example.com/news/my-article..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleScrapeAndSummarize}
          disabled={isLoading}
          className="py-3 px-6 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Working...' : 'Summarize'}
        </button>
      </div>

      {/* Output Section */}
      <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
        <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loader"><LoadingSpinner /></motion.div>
          ) : error ? (
            <motion.p key="error" className="text-red-500">{error}</motion.p>
          ) : summary ? (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 whitespace-pre-wrap">{summary}</motion.div>
          ) : (
            <motion.p key="placeholder" className="text-slate-500">The summary of the article will appear here...</motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}