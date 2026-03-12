import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        imageRef.current,
        { x: '-60vw', rotate: -2, opacity: 0 },
        { x: 0, rotate: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: '45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        statsRef.current?.children || [],
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, ease: 'none' },
        0.1
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        imageRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '-26vw', y: '-10vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '18vw', y: '6vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        statsRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0.2, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned z-30"
    >
      {/* Left portrait card */}
      <div
        ref={imageRef}
        className="absolute left-[6vw] top-[14vh] w-[38vw] h-[72vh] card-media"
      >
        <img
          src="/images/about_portrait.jpg"
          alt="About AURA"
          className="img-cover"
        />
      </div>

      {/* Right content */}
      <div
        ref={contentRef}
        className="absolute left-[54vw] top-[22vh] w-[40vw]"
      >
        <h2 className="headline-section mb-8">
          {t('about.title')}
        </h2>
        <p className="body-text mb-10 max-w-lg">
          {t('about.description')}
        </p>
        <a
          href="#"
          className="link-underline flex items-center gap-2"
        >
          {t('about.cta')}
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Stats row */}
      <div
        ref={statsRef}
        className="absolute left-[54vw] top-[66vh] w-[40vw] flex gap-16"
      >
        <div className="stat-item">
          <p className="stat-number">{t('about.stats.years')}</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{t('about.stats.clients')}</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{t('about.stats.rating')}</p>
        </div>
      </div>
    </section>
  );
};