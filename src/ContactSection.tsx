import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Flowing section animation (not pinned)
      gsap.fromTo(
        leftRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#F6F6F2] z-[110] py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          {/* Left column - Contact info */}
          <div ref={leftRef}>
            <h2 className="headline-section mb-10">
              {t('contact.title')}
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin size={22} className="text-[#D4A24F] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#6F6F6F] mb-1 uppercase tracking-wider">
                  Address
                </p>
                <p className="text-lg font-medium">{t('contact.address')}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 mb-10">
              <Clock size={22} className="text-[#D4A24F] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-[#6F6F6F] mb-1 uppercase tracking-wider">
                  Working Hours
                </p>
                <p className="text-base">{t('contact.hours.weekdays')}</p>
                <p className="text-base">{t('contact.hours.saturday')}</p>
                <p className="text-base text-[#6F6F6F]">{t('contact.hours.sunday')}</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              {t('contact.cta')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Right column - Form */}
          <div ref={rightRef}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder={t('contact.form.name')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder={t('contact.form.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder={t('contact.form.phone')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <textarea
                  placeholder={t('contact.form.message')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input min-h-[140px] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {t('contact.form.submit')}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="mt-20 pt-10 border-t border-[#111]/10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-[#6F6F6F]">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-[#6F6F6F] hover:text-[#111] transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-sm text-[#6F6F6F] hover:text-[#111] transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};