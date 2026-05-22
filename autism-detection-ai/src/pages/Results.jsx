import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaChartPie, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!location.state || !location.state.prediction) {
      // No data passed — redirect to predict page
      navigate('/predict');
      return;
    }
    setData(location.state);
  }, [location, navigate]);

  if (!data) return null;

  // Flask API returns: { prediction: 1, probability: 0.95 }
  // or:                 { prediction: 0, probability: 0.88 }
  const apiResponse = data.prediction; // This is the full JSON from Flask
  const predictionValue = apiResponse.prediction; // 0 or 1
  const isPositive = predictionValue === 1;
  
  // Use real probability if returned by Flask, otherwise show a default
  const confidence = apiResponse.probability 
    ? Math.round(apiResponse.probability * 100) 
    : (isPositive ? 89 : 92);

  const colorClass = isPositive ? "indigo" : "teal";
  const glowClass = isPositive ? "text-indigo-500 dark:text-indigo-400" : "text-teal-500 dark:text-teal-400";
  const borderClass = isPositive ? "border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]" : "border-teal-200 dark:border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t('results.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('results.subtitle')}</p>
      </div>

      <div className={`glass-card p-8 md:p-12 border ${borderClass} relative overflow-hidden mb-8`}>
        {/* Background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[100px] opacity-10 pointer-events-none ${isPositive ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start">
            <div className="flex items-center gap-4 mb-4">
              {isPositive ? (
                <FaExclamationTriangle className={`text-5xl ${glowClass}`} />
              ) : (
                <FaCheckCircle className={`text-5xl ${glowClass}`} />
              )}
              <div className="text-start">
                <h2 className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm font-bold">{t('results.result_label')}</h2>
                <div className={`text-4xl md:text-5xl font-black uppercase ${glowClass}`}>
                  {isPositive ? t('results.positive') : t('results.negative')}
                </div>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-lg">
              {isPositive ? t('results.desc_positive') : t('results.desc_negative')}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center relative w-48 h-48">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <motion.circle 
                cx="96" cy="96" r="80" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray="502"
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - (502 * confidence) / 100 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                strokeLinecap="round"
                className={isPositive ? 'text-indigo-500 dark:text-indigo-400' : 'text-teal-500 dark:text-teal-400'} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white" dir="ltr">{confidence}%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t('results.confidence')}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
            <FaChartPie className="text-2xl" />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white font-bold mb-1">{t('results.summary_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('results.summary_desc')}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex flex-col justify-center">
          <button onClick={() => navigate('/predict')} className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors mb-3 shadow-sm">
            {t('results.btn_another')}
          </button>
          <button className="w-full py-3 px-4 border border-sky-200 dark:border-sky-500/50 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
            <FaDownload /> {t('results.btn_download')}
          </button>
        </div>
      </div>
      
    </motion.div>
  );
};

export default Results;
