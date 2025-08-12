import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStickyNote, FaCompressAlt, FaImage, 
  FaQuestionCircle, FaLink, FaPencilAlt 
} from 'react-icons/fa';

const widgetList = [
  { to: "/dashboard/notes", icon: <FaStickyNote />, title: "AI Notes", description: "Your existing smart note-taking application.", color: "teal" },
  { to: "/dashboard/summarizer", icon: <FaCompressAlt />, title: "AI Summarizer", description: "Summarize long articles or texts into key points.", color: "blue" },
  { to: "/dashboard/image-generator", icon: <FaImage />, title: "Picture Generator", description: "Create stunning images from text descriptions.", color: "purple" },
  { to: "/dashboard/scraper", icon: <FaLink />, title: "Web Summarizer", description: "Paste any article URL to get a quick summary.", color: "green" },
  { to: "/dashboard/writer", icon: <FaPencilAlt />, title: "Content Writer", description: "Expand a simple idea or bullet points into a full paragraph.", color: "orange" },
  { to: "/dashboard/qa", icon: <FaQuestionCircle />, title: "Q&A with AI", description: "Ask questions and get answers from an intelligent AI.", color: "red" }
];

const Widget = ({ to, icon, title, description, color }) => {
  const iconColor = `text-${color}-400`;
  const hoverBorderColor = `hover:border-${color}-400/50`;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
    >
      <Link 
        to={to} 
        className={`block p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 ${hoverBorderColor} transition-colors shadow-lg h-full`}
      >
        <motion.div whileHover={{ scale: 1.2 }} className={`text-4xl ${iconColor} mb-4 w-fit`}>{icon}</motion.div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 mt-1">{description}</p>
      </Link>
    </motion.div>
  );
};

export default function DashboardHome() {
  const userEmail = localStorage.getItem('user_email') || 'User';
  const welcomeText = `Welcome, ${userEmail}!`;

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora-background">
        <div className="aurora-shape aurora-shape1"></div>
        <div className="aurora-shape aurora-shape2"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10" 
        initial="hidden" 
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.h1 className="text-4xl font-bold text-white tracking-tight">
          {welcomeText.split("").map((char, i) => (
            <motion.span key={i} variants={textVariants} custom={i}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          className="text-slate-400 mt-2 text-lg" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: welcomeText.length * 0.05 + 0.2 }}
        >
          Choose a tool from your AI dashboard to get started.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {widgetList.map((widget, index) => (
            <Widget key={index} {...widget} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}