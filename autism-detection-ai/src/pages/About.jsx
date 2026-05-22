import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800 dark:text-white">
          {t('about.title')}<span className="text-sky-500 dark:text-teal-400">{t('about.title_highlight')}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{t('about.overview_title')}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {t('about.overview_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{t('about.tech_title')}</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-sky-500 dark:text-teal-400 mt-1">▹</span>
                <div><strong>{t('about.tech_ml')}</strong>{t('about.tech_ml_desc')}</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 dark:text-teal-400 mt-1">▹</span>
                <div><strong>{t('about.tech_backend')}</strong>{t('about.tech_backend_desc')}</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 dark:text-teal-400 mt-1">▹</span>
                <div><strong>{t('about.tech_frontend')}</strong>{t('about.tech_frontend_desc')}</div>
              </li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{t('about.process_title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-2">
              {t('about.process_desc')}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200 text-sm shadow-sm">
              <strong className="block mb-1 text-amber-600 dark:text-amber-400">{t('about.disclaimer_title')}</strong>
              {t('about.disclaimer_desc')}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
