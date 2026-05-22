import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto py-8 border-t border-[var(--color-glass-border)] bg-[#0a1122]/50 backdrop-blur-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.rights')}
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <FaGithub className="text-xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <FaTwitter className="text-xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
            <FaLinkedin className="text-xl" />
          </a>
        </div>
        
        <div className="text-gray-500 text-xs text-center md:text-right md:rtl:text-left max-w-xs whitespace-pre-line">
          {t('footer.disclaimer')}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
