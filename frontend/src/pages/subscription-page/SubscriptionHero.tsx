import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Calendar, Sparkles, Wallet, Shield, Gift } from 'lucide-react';
import { HERO_SLIDES } from '../../data/siteData';

interface HeroProps {
  setView: (v: any) => void;
}

export function SubscriptionHero({ setView }: HeroProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5400);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[currentSlideIndex];

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 150]);

  return (
    <section id="top" className="relative z-20 min-h-screen flex items-center bg-[#f4f7f6] overflow-hidden pt-28 pb-16">
      {/* Background with Parallax (Brightened) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#f4f7f6]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlideIndex}
            style={{ y: yParallax }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.tagline} className="w-full h-full object-cover" fetchPriority="high" width="1920" height="1080" />
          </motion.div>
        </AnimatePresence>
        {/* Soft, light overlays to guarantee high contrast without darkening the beautiful image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-[#f4f7f6]/95 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/15 to-transparent z-[2]" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-[0.03] z-[1]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Cursive Tagline, Animated Heading, Description, and CTA */}
        <div className="lg:col-span-6 text-left flex flex-col justify-center relative min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-start"
            >
              {/* Company Name & Secondary Tagline */}
              <div className="mb-2 flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#0096C7] font-extrabold font-mono">
                  BEDUINE TOUR & TRAVELS
                </span>
                <span className="font-pacifico text-3xl md:text-4xl text-[#0096C7] leading-relaxed drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] mt-1">
                  {slide.tagline}
                </span>
              </div>

              {/* Headline (Main Tagline) */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] uppercase mb-4 flex flex-col">
                <span className="text-[#0B1F2E] drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
                  {slide.title1}
                </span>
                <span className="bg-gradient-to-r from-[#0096C7] via-[#00B4D8] to-[#0077B6] bg-clip-text text-transparent drop-shadow-[0_1.5px_4px_rgba(255,255,255,0.4)]">
                  {slide.title2}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-700/95 font-bold leading-relaxed max-w-md mb-6 drop-shadow-[0_1.5px_3px_rgba(255,255,255,0.9)]">
                {slide.desc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center mb-8">
                <a href="#plans" className="cursor-pointer">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#00A2FF] to-[#00D9FF] hover:from-[#0088D1] hover:to-[#00C2E6] text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider border-none cursor-pointer flex items-center gap-1.5">
                    View Plans <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </a>
                <button 
                  onClick={() => {
                    setView('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider border-none cursor-pointer flex items-center gap-1.5"
                >
                  Read Terms
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  Contact Us
                </button>
              </div>

              {/* Polaroid-Style Photo Prints Overlay in Bottom Left */}
              <div className="flex items-center gap-3 mt-2 select-none pointer-events-none">
                {/* Polaroid 1 */}
                <div
                  className="bg-white p-2.5 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)] rounded border border-slate-100/50 w-32 rotate-[-8deg] transform hover:rotate-[-4deg] transition-transform duration-300"
                >
                  <img
                    src="/images/kashmir_dal_lake_1779521728036.png"
                    alt="Kashmir"
                    className="w-full h-18 object-cover rounded-sm"
                  />
                  <div className="text-[9px] text-slate-800 font-pacifico mt-1.5 text-center">Kashmir Dal Lake</div>
                </div>

                {/* Polaroid 2 */}
                <div
                  className="bg-white p-2.5 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)] rounded border border-slate-100/50 w-32 rotate-[6deg] -ml-5 transform hover:rotate-[2deg] transition-transform duration-300 z-10"
                >
                  <img
                    src="/images/darjeeling_tea_1779521805614.png"
                    alt="Darjeeling"
                    className="w-full h-18 object-cover rounded-sm"
                  />
                  <div className="text-[9px] text-slate-800 font-pacifico mt-1.5 text-center">Darjeeling Tea</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Dynamic Circular/Oval Frame + Floating Airplane + Clouds + Hearts */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
          {/* Animated clouds in the background */}
          <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
            {/* Cloud 1 (Left-Top) */}
            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [-8, 8, -8]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-20px] top-[15%] w-28 h-8 bg-white/45 backdrop-blur-md rounded-full filter blur-[1px] shadow-[0_4px_12px_rgba(255,255,255,0.4)] border border-white/30"
            />

            {/* Cloud 2 (Right-Bottom) */}
            <motion.div
              animate={{
                x: [15, -15, 15],
                y: [8, -8, 8]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-[-10px] bottom-[20%] w-32 h-10 bg-white/50 backdrop-blur-md rounded-full filter blur-[1px] shadow-[0_4px_12px_rgba(255,255,255,0.4)] border border-white/30"
            />
          </div>

          {/* Large Oval Frame with Active Slide Image */}
          <div className="relative z-10 w-76 h-[360px] sm:w-84 sm:h-[400px] rounded-[150px] border-[10px] border-white shadow-[0_25px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-white/10 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlideIndex}
                src={slide.image}
                alt={slide.tagline}
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

            {/* Red Heart on Left Frame Border */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[15px] top-[42%] z-20"
            >
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-[0_4px_8px_rgba(244,63,94,0.45)]" />
            </motion.div>
          </div>

          {/* Floating Hearts around the bottom-right frame */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Blue Heart 1 */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute right-[15px] bottom-[28%]"
            >
              <Heart className="w-8 h-8 text-[#00D9FF] fill-[#00D9FF] drop-shadow-[0_4px_8px_rgba(0,217,255,0.4)]" />
            </motion.div>

            {/* Blue Heart 2 */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              className="absolute right-[45px] bottom-[15%]"
            >
              <Heart className="w-6 h-6 text-[#00A2FF] fill-[#00A2FF] drop-shadow-[0_3px_6px_rgba(0,162,255,0.3)]" />
            </motion.div>
          </div>

          {/* Floating airplane flying out from the circular frame */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              rotate: [1, 3, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute right-[-50px] sm:right-[-90px] top-[12%] sm:top-[6%] w-96 h-96 sm:w-[460px] sm:h-[460px] z-30 pointer-events-none drop-shadow-[0_25px_40px_rgba(0,0,0,0.28)]"
          >
            <img
              src="/images/airplane_nobg.png"
              alt="Airplane"
              className="w-full h-full object-contain"
              style={{ transform: "rotate(-25deg)" }}
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-800/40 text-[10px] tracking-[0.3em] uppercase z-10">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-[#00A2FF] to-transparent" />
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: Calendar, t: '12 Month Validity' },
    { icon: Sparkles, t: 'Weekly Promotional Selection' },
    { icon: Wallet, t: '₹500 Non-Winner DC' },
    { icon: Shield, t: '18+ Membership Only' },
    { icon: Gift, t: 'Non-Cash Benefits' },
  ];
  return (
    <section className="trust-strip relative py-5 lg:py-6 border-y border-slate-line scanline z-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
          {items.map((it) => (
            <div key={it.t} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-cyan/12 border border-cyan/25 flex items-center justify-center shrink-0 shadow-sm shadow-cyan/10 transition-all duration-300 hover:scale-105 hover:bg-cyan/18">
                <it.icon className="w-5 h-5 text-cyan" />
              </div>
              <div className="text-xs lg:text-sm font-semibold">{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
