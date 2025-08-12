import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { FaPlus, FaSave, FaTrash, FaSearch, FaTag, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/Loadspinner';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  
  // ✅ --- NEW STATE MANAGEMENT FOR TAGS ---
  const [currentTags, setCurrentTags] = useState(''); // Tags for the currently edited note
  const [allTags, setAllTags] = useState([]); // List of all unique tags
  const [activeTag, setActiveTag] = useState(null); // The currently selected filter tag

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  // ✅ --- NEW FUNCTION TO FETCH ALL UNIQUE TAGS ---
  const fetchAllTags = useCallback(async () => {
    try {
      const res = await API.get(`/notes/tags?user_id=${userId}`);
      setAllTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  }, [userId]);

  // ✅ --- UPDATED LOGIC TO FETCH NOTES BY SEARCH, TAG, OR ALL ---
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    let url = `/notes?user_id=${userId}`;
    if (searchQuery.trim() !== '') {
      url = `/notes/search?user_id=${userId}&q=${searchQuery}`;
    } else if (activeTag) {
      url = `/notes?user_id=${userId}&tag=${activeTag}`;
    }
    
    try {
      const res = await API.get(url);
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
    setIsLoading(false);
  }, [userId, searchQuery, activeTag]);

  // Fetch initial data
  useEffect(() => {
    fetchNotes();
    fetchAllTags();
  }, [fetchNotes, fetchAllTags]);

  const handleSelectNote = (note) => {
    setActiveNote(note);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
    setCurrentTags(note.tags || ''); // Load tags for the selected note
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentTags('');
    setSearchQuery('');
    setActiveTag(null);
  };

  // ✅ --- UPDATE SAVE FUNCTION TO INCLUDE TAGS ---
  const handleSaveNote = async () => {
    if (!currentTitle) { alert("Please enter a title."); return; }
    const noteData = { title: currentTitle, content: currentContent, tags: currentTags };
    
    if (activeNote) {
      await API.put(`/notes/${activeNote.id}`, noteData);
    } else {
      await API.post('/notes', { ...noteData, user_id: userId });
    }
    fetchNotes(); // Refresh notes list
    fetchAllTags(); // Refresh tags list
  };

  const handleDeleteNote = async () => {
    if (activeNote) {
      if (window.confirm('Are you sure?')) {
        await API.delete(`/notes/${activeNote.id}`);
        handleNewNote(); // Reset the editor view
        fetchNotes();
        fetchAllTags();
      }
    }
  };

  const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const listItemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
   <motion.div className="flex h-[calc(100vh-4rem)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Left Column (No Changes) */}
      <div className="w-1/3 border-r border-slate-800 bg-slate-900/80 flex flex-col">
        {/* Header, Search, Tags, and Note List sections remain the same */}
        <div className="p-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-white">My Notes</h1>
            <motion.button onClick={handleNewNote} whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full text-slate-300" title="New Note"><FaPlus /></motion.button>
          </div>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-slate-500" />
            <input type="text" placeholder="Search notes..." className="w-full p-2 pl-10 bg-slate-800 rounded-lg" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setActiveTag(null); }} />
          </div>
        </div>
        <div className="p-4 border-b border-slate-800 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center"><FaTag className="mr-2" /> Tags</h2>
          <div className="flex flex-wrap gap-2">
            {activeTag && (
              <motion.button onClick={() => setActiveTag(null)} className="flex items-center gap-1 text-sm py-1 px-3 bg-red-500 text-white rounded-full">
                Clear Filter <FaTimes size={10}/>
              </motion.button>
            )}
            {allTags.map(tag => (
              <motion.button key={tag} onClick={() => { setActiveTag(tag); setSearchQuery(''); }}
                className={`text-sm py-1 px-3 rounded-full transition-colors ${activeTag === tag ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto">
          {isLoading ? <LoadingSpinner /> : (
            <motion.div variants={listContainerVariants} initial="hidden" animate="visible">
              {notes.map((note) => (
                <motion.div key={note.id} variants={listItemVariants} onClick={() => handleSelectNote(note)}
                  className={`p-4 border-b border-slate-800 cursor-pointer ${activeNote?.id === note.id ? 'bg-teal-500 text-white' : 'hover:bg-slate-800'}`} layout>
                  <h3 className="font-bold truncate">{note.title || 'Untitled'}</h3>
                  <p className={`text-sm truncate ${activeNote?.id === note.id ? 'text-teal-100' : 'text-slate-400'}`}>{note.summary || 'No content'}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ✅ --- EDITOR COLUMN WITH REFINED STYLING --- */}
      <div className="w-2/3 flex flex-col bg-slate-950">
        {/* Editor Header with Buttons */}
        <div className="p-4 border-b border-slate-800 flex justify-end items-center space-x-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveNote} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg" disabled={!currentTitle}><FaSave /><span>Save</span></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDeleteNote} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg" disabled={!activeNote}><FaTrash /><span>Delete</span></motion.button>
        </div>

        {/* Animate content switching */}
        <AnimatePresence mode="wait">
          <motion.div key={activeNote ? activeNote.id : 'new-note'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            
            {/* 1. Main Title Input with better spacing */}
            <div className="p-6">
              <input 
                type="text" 
                className="w-full text-4xl font-extrabold bg-transparent outline-none placeholder:text-slate-600" 
                placeholder="Note Title..." 
                value={currentTitle} 
                onChange={(e) => setCurrentTitle(e.target.value)} 
              />
            </div>

            {/* 2. Tags Input with an icon and clear separation */}
            <div className="px-8 pb-4 flex items-center gap-3 border-b border-slate-800">
              <FaTag className="text-slate-500" />
              <input 
                type="text" 
                className="w-full bg-transparent outline-none text-slate-400 placeholder:text-slate-500" 
                placeholder="Add tags, separated by commas..." 
                value={currentTags} 
                onChange={(e) => setCurrentTags(e.target.value)} 
              />
            </div>
            
            {/* 3. Main Content Writing Area */}
            <textarea 
              className="w-full h-full p-8 text-lg bg-transparent outline-none resize-none placeholder:text-slate-500" 
              placeholder="Start writing..." 
              value={currentContent} 
              onChange={(e) => setCurrentContent(e.target.value)} 
            />

          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}