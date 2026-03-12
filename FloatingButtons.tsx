import { useState } from 'react';
import { Phone, MessageCircle, Calendar, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const FloatingButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const buttons = [
    {
      icon: Phone,
      label: t('floating.call'),
      href: 'tel:+380440000000',
      color: 'bg-[#D4A24F]',
    },
    {
      icon: MessageCircle,
      label: t('floating.chat'),
      href: '#',
      color: 'bg-white text-[#111]',
    },
    {
      icon: Calendar,
      label: t('floating.book'),
      onClick: () => {
        const element = document.getElementById('booking');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      },
      color: 'bg-white text-[#111]',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[900] flex flex-col items-end gap-3">
      {/* Expanded buttons */}
      {isExpanded && (
        <div className="flex flex-col gap-3 mb-2">
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.href || '#'}
              onClick={(e) => {
                if (btn.onClick) {
                  e.preventDefault();
                  btn.onClick();
                }
                setIsExpanded(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${btn.color}`}
            >
              <btn.icon size={20} />
              <span className="text-sm font-medium whitespace-nowrap">
                {btn.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isExpanded ? 'bg-[#111] text-white rotate-45' : 'bg-[#D4A24F] text-white'
        }`}
      >
        {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};