import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const teamListRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const teamMembers = [
    t('team.members.olena'),
    t('team.members.anastasiia'),
    t('team.members.yulia'),
  ];

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
        teamListRef.current?.children || [],
        { x: '10vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
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
        teamListRef.current,
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
      id="team"
      className="section-pinned z-[70]"
    >
      {/* Left portrait card */}
      <div
        ref={imageRef}
        className="absolute left-[6vw] top-[14vh] w-[38vw] h-[72vh] card-media"
      >
        <img
          src="/images/team_portrait.jpg"
          alt="Our Team"
          className="img-cover"
        />
      </div>

      {/* Right content */}
      <div
        ref={contentRef}
        className="absolute left-[54vw] top-[22vh] w-[40vw]"
      >
        <h2 className="headline-section mb-8">
          {t('team.title')}
        </h2>
        <p className="body-text mb-8 max-w-lg">
          {t('team.description')}
        </p>

        {/* Team list */}
        <div ref={teamListRef} className="mb-8 space-y-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm font-medium"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A24F]" />
              <span>{member}</span>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="link-underline flex items-center gap-2"
        >
          {t('team.cta')}
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
};