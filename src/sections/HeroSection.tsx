// ============================================================================
// HERO SECTION - PREMIUM GSAP ANIMATIONS
// ============================================================================

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const { getHeroContent, settings, isLoading } = useContent();
  const heroContent = getHeroContent();

  const extraData = (heroContent?.extra_data as Record<string, unknown>) || {};
  const stats = (extraData.stats as Array<{ value: string; label: string }>) || [];
  const ctaPrimary = (extraData.cta_primary as string) || 'Book Consultation';
  const ctaSecondary = (extraData.cta_secondary as string) || 'Explore Services';

  useLayoutEffect(() => {
    if (isLoading) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const badge = badgeRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    const stats = statsRef.current;
    const image = imageRef.current;
    const decor = decorRef.current;

    if (!section || !container) return;

    const ctx = gsap.context(() => {
      gsap.set([badge, subtitle, description, cta, stats], { opacity: 0, y: 40 });
      gsap.set(title, { opacity: 0, y: 60, scale: 0.95 });
      gsap.set(image, { opacity: 0, x: 100, scale: 1.1 });
      gsap.set(decor?.children || [], { opacity: 0, scale: 0 });

      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 });

      entranceTl.to(decor?.children || [], { opacity: 0.6, scale: 1, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.5)' });
      entranceTl.to(badge, { opacity: 1, y: 0, duration: 0.8 }, '-=0.8');
      entranceTl.to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
      entranceTl.to(title, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' }, '-=0.5');
      entranceTl.to(description, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
      entranceTl.to(cta, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
      entranceTl.to(stats?.children || [], { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
      entranceTl.to(image, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power2.out' }, '-=1');

      gsap.to(image, {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 }
      });

      gsap.to(decor?.children || [], {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.5 }
      });

      gsap.to([badge, subtitle, title, description, cta], {
        opacity: 0,
        y: -50,
        ease: 'power2.in',
        stagger: 0.05,
        scrollTrigger: { trigger: section, start: 'top top', end: '50% top', scrub: 1 }
      });

      gsap.to(stats?.children || [], {
        opacity: 0,
        y: -30,
        ease: 'power2.in',
        stagger: 0.03,
        scrollTrigger: { trigger: section, start: '20% top', end: '60% top', scrub: 1 }
      });

      ScrollTrigger.create({ trigger: section, start: 'top top', end: '+=100%', pin: false, pinSpacing: false });
    }, section);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>

      <div ref={containerRef} className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Text Content */}
            <div className="order-2 lg:order-1 space-y-8">
              <div ref={badgeRef}>
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-rose-500/30 bg-rose-500/10 text-rose-400 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {heroContent?.subtitle || 'Premium Aesthetic Medicine'}
                </Badge>
              </div>

              <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                <span className="block bg-gradient-to-r from-rose-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                  {heroContent?.title || 'Мій Заголовок'}
                </span>
              </h1>

              <p ref={subtitleRef} className="text-xl sm:text-2xl text-slate-300 font-light">
                Experience the art of beauty with our cutting-edge treatments
              </p>

              <p ref={descriptionRef} className="text-slate-400 text-lg max-w-xl leading-relaxed">
                {heroContent?.description || 'Our expert team combines medical precision with artistic vision to enhance your natural glow.'}
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 group">
                  <Calendar className="w-5 h-5 mr-2" />
                  {ctaPrimary}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg transition-all duration-300">
                  {ctaSecondary}
                </Button>
              </div>

              <div ref={statsRef} className="flex flex-wrap gap-8 pt-8 border-t border-slate-800">
                {stats.length > 0 ? (
                  stats.map((stat, index) => (
                    <div key={index} className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">15+</div>
                      <div className="text-sm text-slate-500 mt-1">Years Experience</div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">10K+</div>
                      <div className="text-sm text-slate-500 mt-1">Happy Clients</div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">50+</div>
                      <div className="text-sm text-slate-500 mt-1">Expert Treatments</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div ref={imageRef} className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl shadow-purple-500/10">
                {heroContent?.image_url ? (
                  <img src={heroContent.image_url} alt="Aura Cosmetology" className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-amber-500/20" />
                )}
                
                {/* Floating badges on image */}
                <div className="absolute top-8 right-8 px-4 py-2 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Premium Care
                  </span>
                </div>
              </div>

              {/* Decorative rings behind image */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border border-rose-500/20 rounded-full -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-amber-500/20 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
