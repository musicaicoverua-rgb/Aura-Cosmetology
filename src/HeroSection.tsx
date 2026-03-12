import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-play entrance animation on load
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Image entrance
      tl.fromTo(
        imageRef.current,
        { opacity: 0, x: '-12vw', y: '6vh', scale: 0.96 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1 }
      );

      // Label entrance
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.6'
      );

      // Title entrance (word by word)
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );

      // Subtitle entrance
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );

      // CTA entrance
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
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
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([imageRef.current, labelRef.current, titleRef.current, subtitleRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
          },
        },
      });

      // ENTRANCE (0-30%): Hold position (content already visible from load animation)
      // SETTLE (30-70%): Hold position
      
      // EXIT (70-100%): Elements exit
      scrollTl.fromTo(
        imageRef.current,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        { x: '-55vw', y: '-10vh', scale: 0.92, opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '18vw', y: '-6vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10"
    >
      <div className="relative w-full h-full flex items-center">
        {/* Left Image Card */}
        <div
          ref={imageRef}
          className="absolute left-[6vw] top-[14vh] w-[38vw] h-[72vh] card-media"
        >
          <img
            src="/images/hero_portrait.jpg"
            alt="AURA Luxe Clinic"
            className="img-cover"
          />
        </div>

        {/* Right Content */}
        <div
          ref={contentRef}
          className="absolute left-[54vw] top-[22vh] w-[40vw]"
        >
          {/* Micro Label */}
          <p ref={labelRef} className="micro-label mb-6">
            {t('hero.location')}
          </p>

          {/* Title */}
          <h1 ref={titleRef} className="headline-hero mb-8">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="body-text max-w-md mb-10">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button 
              onClick={() => scrollToSection('booking')}
              className="btn-primary flex items-center gap-2"
            >
              {t('hero.cta_primary')}
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="btn-secondary"
            >
              {t('hero.cta_secondary')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};