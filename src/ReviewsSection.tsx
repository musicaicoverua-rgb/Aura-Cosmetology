import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const ReviewsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
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
        contentRef.current,
        { x: '-45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: '60vw', scale: 0.98, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        quoteRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        contentRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '-18vw', y: '-6vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '26vw', y: '10vh', opacity: 0.25, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        quoteRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0.2, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="section-pinned z-[100]"
    >
      {/* Left content */}
      <div
        ref={contentRef}
        className="absolute left-[7vw] top-[22vh] w-[40vw]"
      >
        <h2 className="headline-section mb-8">
          {t('reviews.title')}
        </h2>
        <p className="body-text mb-10 max-w-md">
          {t('reviews.description')}
        </p>

        <a
          href="#"
          className="link-underline flex items-center gap-2"
        >
          {t('reviews.cta')}
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Right portrait card */}
      <div
        ref={imageRef}
        className="absolute left-[54vw] top-[14vh] w-[40vw] h-[72vh] card-media"
      >
        <img
          src="/images/reviews_portrait.jpg"
          alt="Reviews"
          className="img-cover"
        />
      </div>

      {/* Quote */}
      <div
        ref={quoteRef}
        className="absolute left-[7vw] top-[62vh] w-[40vw]"
      >
        <Quote size={32} className="text-[#D4A24F] mb-4" />
        <p className="quote-text mb-4">
          {t('reviews.quote')}
        </p>
        <p className="quote-author">
          {t('reviews.author')}
        </p>
      </div>
    </section>
  );
};