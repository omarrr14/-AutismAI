import React from 'react';
import { motion } from 'framer-motion';
import { FaMicroscope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060b14]/90 backdrop-blur-md" dir="ltr">
      <motion.div 
        className="relative flex items-center justify-center w-32 h-32 mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-blue-500 border-b-transparent border-l-transparent"></div>
        <div className="absolute inset-2 rounded-full border-4 border-b-cyan-400 border-l-blue-500 border-t-transparent border-r-transparent opacity-50"></div>
        <FaMicroscope className="text-4xl text-cyan-400" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-2xl font-bold text-white tracking-widest uppercase mb-2 neon-text text-center"
      >
        {t('loading.analyzing')}
      </motion.div>
      
      <div className="text-cyan-400/70 text-sm tracking-widest uppercase mb-8 text-center">
        {t('loading.running')}
      </div>

      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
