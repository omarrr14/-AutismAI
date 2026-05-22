import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500 bg-slate-50 dark:bg-slate-900">
      
      {/* Animated glowing orbs - Soft Sky Blue / Dark Teal */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-300/30 dark:bg-teal-700/20 blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated glowing orbs - Mint Green / Dark Navy Blue */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/40 dark:bg-sky-800/20 blur-[150px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Soft Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
