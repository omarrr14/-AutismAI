import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaGlobe, FaSun, FaMoon } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const links = [
    { path: '/', label: t('nav.home') },
    { path: '/predict', label: t('nav.prediction') },
    { path: '/about', label: t('nav.about') }
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 rounded-none mb-8 print:hidden">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-sky-100 dark:bg-teal-900/30 border border-sky-200 dark:border-teal-500/30 shadow-sm">
              <FaBrain className="text-sky-500 dark:text-teal-400 text-xl" />
              <motion.div 
                className="absolute inset-0 rounded-xl border border-sky-400/30 dark:border-teal-400/50"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white" dir="ltr">
              Autism<span className="text-sky-500 dark:text-teal-400">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-sm font-medium transition-colors hover:text-sky-600 dark:hover:text-teal-400"
                >
                  <span className={isActive ? 'text-sky-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-6 left-0 right-0 h-[2px] bg-sky-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(14,165,233,0.5)] dark:shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors overflow-hidden"
              title="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <FaMoon className="text-teal-400" /> : <FaSun className="text-amber-500 text-lg" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Language"
            >
              <FaGlobe />
              <span className="text-sm font-bold uppercase">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            <Link 
              to="/predict"
              className="btn-primary hidden sm:block"
            >
              {t('nav.start')}
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
