import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const SignatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
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
        { scale: 1.12, y: '6vh', opacity: 0 },
        { scale: 1, y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        titleRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        labelRef.current,
        { x: '20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        descRef.current,
        { x: '30vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        linkRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // SETTLE (30-70%): Hold positions

      // EXIT (70-100%)
      scrollTl.fromTo(
        imageRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1.06, y: '-8vh', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        titleRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '-18vw', y: '-6vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        descRef.current,
        { x: 0, y: 0, opacity: 1 },
        { x: '18vw', y: '10vh', opacity: 0.2, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [labelRef.current, linkRef.current],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-20"
    >
      {/* Full-bleed background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-[1]"
      >
        <img
          src="/images/signature_face.jpg"
          alt="Signature AURA Care"
          className="img-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F6F2]/90 via-[#F6F6F2]/40 to-transparent" />
      </div>

      {/* Top-left headline */}
      <div className="absolute left-[7vw] top-[10vh] w-[44vw] z-[3]">
        <p ref={labelRef} className="micro-label mb-4">
          {t('signature.label')}
        </p>
        <h2 ref={titleRef} className="headline-section">
          {t('signature.title')}
        </h2>
      </div>

      {/* Bottom-right paragraph */}
      <div className="absolute left-[58vw] top-[68vh] w-[35vw] z-[3]">
        <p ref={descRef} className="body-text mb-6">
          {t('signature.description')}
        </p>
        <a
          ref={linkRef}
          href="#team"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="link-underline flex items-center gap-2"
        >
          {t('signature.link')}
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
};