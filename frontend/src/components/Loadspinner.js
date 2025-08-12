import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: '5px solid #4A90E2', // A nice blue color
          borderTopColor: '#1E293B', // A darker color for the gap
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          ease: 'linear',
          duration: 1,
        }}
      />
      <p className="mt-4 text-slate-400">Loading Your Notes...</p>
    </div>
  );
};

export default LoadingSpinner;