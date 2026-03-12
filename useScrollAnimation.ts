import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Global snap configuration for pinned sections
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return sectionRef;
};

export const useSectionAnimation = (
  sectionRef: React.RefObject<HTMLElement | null>,
  animationConfig: {
    entrance?: gsap.TweenVars;
    settle?: gsap.TweenVars;
    exit?: gsap.TweenVars;
  }
) => {
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      if (animationConfig.entrance) {
        tl.fromTo(
          sectionRef.current,
          animationConfig.entrance,
          { ...animationConfig.settle, duration: 0.3 },
          0
        );
      }

      if (animationConfig.exit) {
        tl.to(sectionRef.current, {
          ...animationConfig.exit,
          duration: 0.3,
        }, 0.7);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, animationConfig]);
};