import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'hero', label: 'nav.home' },
  { id: 'about', label: 'nav.about' },
  { id: 'services', label: 'nav.services' },
  { id: 'treatments', label: 'nav.price' },
  { id: 'results', label: 'nav.gallery' },
  { id: 'reviews', label: 'nav.reviews' },
  { id: 'booking', label: 'nav.booking' },
  { id: 'contact', label: 'nav.contacts' },
];

export const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power3.out',
        }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[2000] bg-[#F6F6F2] opacity-0"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-10">
          <span className="logo">AURA</span>
          <button
            onClick={onClose}
            className="p-2 hover:opacity-70 transition-opacity"
          >
            <X size={28} />
          </button>
        </div>

        {/* Menu Items */}
        <div
          ref={contentRef}
          className="flex-1 flex flex-col justify-center px-6 md:px-20"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center gap-6 py-4 md:py-5 text-left"
            >
              <span className="text-sm text-[#6F6F6F] font-medium w-8">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-wide group-hover:text-[#D4A24F] transition-colors duration-300">
                {t(item.label)}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 flex justify-between items-end">
          <div className="text-sm text-[#6F6F6F]">
            <p>hello@auraclinic.ua</p>
            <p>+38 044 000 00 00</p>
          </div>
          <div className="text-sm text-[#6F6F6F]">
            <p>12B Reitarska St</p>
            <p>Kyiv, Ukraine</p>
          </div>
        </div>
      </div>
    </div>
  );
};