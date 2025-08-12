import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout'; // New Layout Component
import DashboardHome from './pages/DashboardHome'; // New Widgets Hub
import NotesPage from './pages/NotesPage'; // The original notes app
import SummarizerPage from './pages/SummarizerPage'; // New Tool
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import WebScraperPage from './pages/WebScraperPage';
import ContentWriterPage from './pages/ContentWriterPage';
import QAPage from './pages/QAPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* New Nested Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="summarizer" element={<SummarizerPage />} />
          <Route path="image-generator" element={<ImageGeneratorPage />} /> {/* 👈 2. ADD the new route */}
          {/* You will add routes for image-generator and qa here later */}
          <Route path="scraper" element={<WebScraperPage />} />
          <Route path="writer" element={<ContentWriterPage />} /> 
          <Route path="qa" element={<QAPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;