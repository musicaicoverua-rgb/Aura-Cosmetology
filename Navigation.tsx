import { useState, useEffect } from 'react';
import { Menu, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { languages } from '@/i18n';

interface NavigationProps {
  onMenuClick: () => void;
}

export const Navigation = ({ onMenuClick }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { t, currentLanguage, changeLanguage, getCurrentLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLang = getCurrentLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`nav-fixed ${isScrolled ? 'nav-scrolled' : ''}`}>
        <a href="#" className="logo">AURA</a>
        
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{currentLang.flag}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg p-2 min-w-[160px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onMenuClick}
            className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase hover:opacity-70 transition-opacity"
          >
            <Menu size={20} />
            <span className="hidden sm:inline">{t('nav.menu')}</span>
          </button>
          
          <button 
            onClick={() => scrollToSection('booking')}
            className="btn-secondary py-3 px-6"
          >
            {t('nav.book')}
          </button>
        </div>
      </nav>

      {/* Click outside to close language dropdown */}
      {showLangDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLangDropdown(false)}
        />
      )}
    </>
  );
};