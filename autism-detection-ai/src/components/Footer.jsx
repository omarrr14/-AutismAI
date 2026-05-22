import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto py-8 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.rights')}
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
            <FaGithub className="text-xl" />
          </a>
          <a href="#" className="text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
            <FaTwitter className="text-xl" />
          </a>
          <a href="#" className="text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
            <FaLinkedin className="text-xl" />
          </a>
        </div>
        
        <div className="text-slate-400 dark:text-slate-500 text-xs text-center md:text-right md:rtl:text-left max-w-xs whitespace-pre-line">
          {t('footer.disclaimer')}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
