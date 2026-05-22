import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBrain, FaRobot, FaMicroscope, FaChartLine } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const stats = [
    { label: t('home.stat_acc_label'), value: t('home.stat_acc_val'), icon: <FaChartLine /> },
    { label: t('home.stat_time_label'), value: t('home.stat_time_val'), icon: <FaRobot /> },
    { label: t('home.stat_data_label'), value: t('home.stat_data_val'), icon: <FaMicroscope /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <motion.div 
        className="w-full max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-teal-900/30 border border-sky-200 dark:border-teal-500/30 text-sky-600 dark:text-teal-400 text-sm font-medium shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 dark:bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500 dark:bg-teal-500"></span>
          </span>
          {t('home.badge')}
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-800 dark:text-white"
        >
          <span>{t('home.title_main')}</span>
          <br className="hidden md:block" />
          <span className="text-gradient">
            {t('home.title_highlight')}
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {t('home.subtitle')}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <Link 
            to="/predict" 
            className="btn-primary w-full sm:w-auto text-lg px-8 py-4 rounded-2xl"
          >
            {t('home.btn_start')}
          </Link>
          <Link 
            to="/about" 
            className="px-8 py-4 rounded-2xl text-slate-700 dark:text-white font-bold text-lg bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors w-full sm:w-auto border border-slate-200 dark:border-white/10 shadow-sm"
          >
            {t('home.btn_learn')}
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent dark:from-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-3xl text-sky-500 dark:text-teal-400 mb-4 transition-transform group-hover:scale-110 duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-slate-800 dark:text-white mb-2" dir="ltr">{stat.value}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home;
