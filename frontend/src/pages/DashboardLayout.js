import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaThLarge, 
  FaStickyNote, 
  FaCompressAlt, 
  FaImage, 
  FaLink, 
  FaPencilAlt, 
  FaQuestionCircle,
  FaSignOutAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/dashboard/notes", label: "AI Notes", icon: <FaStickyNote /> },
    { path: "/dashboard/summarizer", label: "AI Summarizer", icon: <FaCompressAlt /> },
    { path: "/dashboard/image-generator", label: "Picture Generator", icon: <FaImage /> },
    { path: "/dashboard/scraper", label: "Web Summarizer", icon: <FaLink /> },
    { path: "/dashboard/writer", label: "Content Writer", icon: <FaPencilAlt /> },
   { path: "/dashboard/qa", label: "Q&A with AI", icon: <FaQuestionCircle /> }, // Placeholder
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* New Professional Sidebar */}
      <motion.div 
        className="w-64 bg-slate-900 p-4 flex flex-col justify-between flex-shrink-0"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div>
          <div className="p-3 mb-6">
            <h1 className="text-2xl font-bold text-white tracking-wider">AI Dashboard ✨</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                to={item.path}
                key={item.label}
                // The 'end' prop is important for the main dashboard link
                end={item.path === "/dashboard"} 
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? "bg-teal-500 text-white font-semibold shadow-lg" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="mr-4 text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <motion.button 
          onClick={handleLogout} 
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-4 text-lg"><FaSignOutAlt /></span>
          <span>Logout</span>
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}