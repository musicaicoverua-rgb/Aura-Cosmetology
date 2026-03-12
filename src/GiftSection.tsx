import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Gift } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const GiftSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
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
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { x: '45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        badgeRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.12
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
        badgeRef.current,
        { scale: 1, opacity: 1 },
        { scale: 0.96, opacity: 0.2, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-[90]"
    >
      {/* Left portrait card */}
      <div
        ref={imageRef}
        className="absolute left-[6vw] top-[14vh] w-[38vw] h-[72vh] card-media"
      >
        <img
          src="/images/gift_portrait.jpg"
          alt="Gift Card"
          className="img-cover"
        />
      </div>

      {/* Right content */}
      <div
        ref={contentRef}
        className="absolute left-[54vw] top-[22vh] w-[40vw]"
      >
        <h2 className="headline-section mb-8">
          {t('gift.title')}
        </h2>
        <p className="body-text mb-8 max-w-lg">
          {t('gift.description')}
        </p>

        {/* Badge */}
        <div ref={badgeRef} className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A24F]/10 rounded-full text-sm font-medium">
            <Gift size={16} className="text-[#D4A24F]" />
            {t('gift.badge')}
          </span>
        </div>

        <a
          href="#"
          className="link-underline flex items-center gap-2"
        >
          {t('gift.cta')}
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
};