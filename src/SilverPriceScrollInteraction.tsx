import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SilverPriceScrollInteractionProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function SilverPriceScrollInteraction({ cardRef }: SilverPriceScrollInteractionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<SVGSVGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Find the price element inside the Silver card
    const priceEl = cardRef.current.querySelector('.silver-price');
    const shadowEl = shadowRef.current;

    if (prefersReducedMotion) {
      // Static state: just render child at fully visible, holding price, no movement
      gsap.set(containerRef.current, { opacity: 1, scale: isMobile ? 0.75 : 1, x: 0, y: 0 });
      if (priceEl) {
        gsap.set(priceEl, { x: -4, scaleX: 0.99 });
      }
      return;
    }

    // Set initial hidden states for the scroll animation
    gsap.set(containerRef.current, {
      opacity: 0,
      scale: 0.7,
      x: isMobile ? 15 : 35,
      y: isMobile ? 10 : 25,
      rotate: 15
    });

    if (shadowEl) {
      gsap.set(shadowEl, { opacity: 0, scale: 0.5 });
    }

    // Main scroll-linked timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: isMobile ? "top 85%" : "top 75%",
        end: isMobile ? "center 45%" : "center 35%",
        scrub: 1.2, // buttery smooth scrub tracking
        invalidateOnRefresh: true,
      }
    });

    // 1. Entry Phase (0% - 40%): Fades and scales in, steps forward
    tl.to(containerRef.current, {
      opacity: 1,
      scale: isMobile ? 0.85 : 1.05,
      x: isMobile ? 5 : 8,
      y: isMobile ? -5 : -12,
      rotate: 5,
      ease: "power2.out",
      duration: 0.4
    }, 0);

    if (shadowEl) {
      tl.to(shadowEl, {
        opacity: 0.6,
        scale: 1,
        ease: "power2.out",
        duration: 0.4
      }, 0);
    }

    // 2. Grabbing & Pulling Phase (40% - 70%): Reaches price, rotation shifts to leaning backwards
    tl.to(containerRef.current, {
      x: isMobile ? -2 : -6,
      y: isMobile ? 2 : 5,
      rotate: isMobile ? -3 : -6, // Lean backwards in full pull!
      scale: isMobile ? 0.82 : 1.0,
      ease: "back.out(1.2)",
      duration: 0.3
    }, 0.4);

    if (priceEl) {
      // The price reacts as the child pulls it tightly!
      tl.to(priceEl, {
        x: isMobile ? -3 : -7,
        scaleX: 1.05,
        skewX: isMobile ? -1 : -2,
        ease: "power1.inOut",
        duration: 0.3
      }, 0.4);
    }

    // 3. Staying & Resisting Phase (70% - 100%): Locking the pull
    tl.to(containerRef.current, {
      x: isMobile ? -4 : -10,
      rotate: isMobile ? -4 : -8,
      ease: "sine.inOut",
      duration: 0.3
    }, 0.7);

    if (priceEl) {
      tl.to(priceEl, {
        x: isMobile ? -5 : -12,
        scaleX: 0.98,
        skewX: isMobile ? -2 : -3.5,
        ease: "sine.inOut",
        duration: 0.3
      }, 0.7);
    }

    // After the scroll timeline finishes, register a subtle looping tug animation for premium touch
    // We only trigger this looping idle vibe when scroll progress is highly active or card is in viewport
    let idleTween: gsap.core.Tween | null = null;

    const triggerIdleTug = () => {
      if (idleTween) return;
      idleTween = gsap.to(containerRef.current, {
        x: "+=2",
        rotate: "-=1.5",
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      if (priceEl) {
        gsap.to(priceEl, {
          x: "-=1.2",
          skewX: "-=0.5",
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }
    };

    const stopIdleTug = () => {
      if (idleTween) {
        idleTween.kill();
        idleTween = null;
        gsap.to(containerRef.current, { x: isMobile ? -4 : -10, rotate: isMobile ? -4 : -8, duration: 0.5 });
        if (priceEl) {
          gsap.to(priceEl, { x: isMobile ? -5 : -12, skewX: isMobile ? -2 : -3.5, duration: 0.5 });
        }
      }
    };

    // Add ScrollTrigger to trigger idle tug when the section is in active view
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 60%",
      end: "bottom 30%",
      onEnter: triggerIdleTug,
      onLeave: stopIdleTug,
      onEnterBack: triggerIdleTug,
      onLeaveBack: stopIdleTug
    });

    return () => {
      tl.kill();
      if (idleTween) idleTween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === cardRef.current) t.kill();
      });
    };
  }, [cardRef]);

  return (
    <div
      ref={containerRef}
      className="silver-child-3d absolute -right-4 -top-8 w-36 h-40 z-20 pointer-events-none overflow-visible filter drop-shadow-[0_12px_28px_rgba(15,23,42,0.4)]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <svg
        ref={childRef}
        viewBox="0 0 120 140"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Realistic skin gradient with volume */}
          <radialGradient id="kidSkin3D" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF7F0" />
            <stop offset="60%" stopColor="#FED8BE" />
            <stop offset="100%" stopColor="#E99263" />
          </radialGradient>

          {/* Shaded metallic child t-shirt gradient */}
          <linearGradient id="kidShirt3D" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Jeans 3D denim texture gradient */}
          <linearGradient id="kidJeans3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Hair color */}
          <linearGradient id="kidHair3D" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1C1917" />
          </linearGradient>

          <filter id="child3DShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-2" dy="10" stdDeviation="5.5" floodColor="#0F172A" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 3D dynamic shadow underneath */}
        <ellipse
          ref={shadowRef}
          cx="68"
          cy="132"
          rx="24"
          ry="3.5"
          fill="rgba(15,23,42,0.5)"
          filter="blur(3px)"
        />

        <g filter="url(#child3DShadow)" className="overflow-visible">
          {/* Legs digging into the ground, pulling backwards to the right! */}
          {/* Left Leg */}
          <rect x="48" y="106" width="10" height="22" rx="3.5" fill="url(#kidJeans3D)" transform="rotate(-36 48 106)" />
          {/* Right Leg */}
          <rect x="58" y="108" width="10" height="22" rx="3.5" fill="url(#kidJeans3D)" transform="rotate(-26 58 108)" />

          {/* Custom White & Teal detailed sneakers */}
          <g transform="translate(18, 114) rotate(-10)">
            <path d="M 2 8 L 14 8 C 16 8 16 4 14 2 L 6 0 C 4 0 2 3 2 8 Z" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1" />
            <ellipse cx="8" cy="4" rx="4" ry="2" fill="#0D9488" />
          </g>
          <g transform="translate(32, 116) rotate(-5)">
            <path d="M 2 8 L 14 8 C 16 8 16 4 14 2 L 6 0 C 4 0 2 3 2 8 Z" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1" />
            <ellipse cx="8" cy="4" rx="4" ry="2" fill="#0D9488" />
          </g>

          {/* Torso / Shirt */}
          <path d="M 58,84 C 58,74 78,74 78,84 L 86,114 L 54,114 Z" fill="url(#kidShirt3D)" transform="rotate(22 66 99)" />

          {/* Golden Bright Star Graphic on Shirt */}
          <polygon points="68,92 69.2,94.5 71.8,94.5 69.8,96 70.5,98.5 68,97 65.5,98.5 66.2,96 64.2,94.5 66.8,94.5" fill="#FBBF24" transform="rotate(22 66 99)" />

          {/* Head & Neck */}
          <g transform="rotate(14 66 64)">
            <rect x="63" y="69" width="7" height="9" fill="url(#kidSkin3D)" />
            <circle cx="66" cy="59" r="14.5" fill="url(#kidSkin3D)" />

            {/* Detailed Brown Hair */}
            <path d="M 51.5,58 C 51.5,41 79.5,41 79.5,58 C 79.5,71 51.5,71 51.5,58 Z" fill="url(#kidHair3D)" />

            {/* Winking Struggling Expression */}
            {/* Left eye: Winking 'X' or tight curve */}
            <path d="M 54,54 L 59,59 M 59,54 L 54,59" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
            {/* Right eye: Closed tightly */}
            <path d="M 68,55 Q 72.5,51.5 76,55" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />

            {/* Blushing Cute Cheeks */}
            <circle cx="53" cy="63" r="3" fill="#F87171" opacity="0.65" filter="blur(0.5px)" />
            <circle cx="77" cy="63" r="3" fill="#F87171" opacity="0.65" filter="blur(0.5px)" />

            {/* Struggling grin showing tiny teeth */}
            <path d="M 58,68 Q 66,71.5 72,67.5" stroke="#991B1B" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 59.5,67.5 C 61,66 70,66 70.5,67 C 69,68.5 61,68.5 59.5,67.5 Z" fill="#FFFFFF" stroke="#991B1B" strokeWidth="0.5" />

            {/* Backwards Cap with Visor pointing left */}
            <path d="M 55,49 C 55,40 76,40 76,49 Z" fill="#0F766E" />
            <path d="M 57,48 C 48,46.5 40,43.5 38,44" stroke="#0F766E" strokeWidth="3.2" strokeLinecap="round" />
          </g>

          {/* Grabbing Hands: absolute stretch from right child torso to the very left edge */}
          {/* Top Arm grabbing */}
          <path d="M 62,88 Q 32,83 -12,80" stroke="url(#kidSkin3D)" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Bottom Arm grabbing */}
          <path d="M 62,93 Q 34,92 -12,89" stroke="url(#kidSkin3D)" strokeWidth="8" strokeLinecap="round" fill="none" />

          {/* Detailed gripping hands with little pinky details and volume overlay */}
          <g transform="translate(-12, -2)">
            {/* Top Hand clamp */}
            <circle cx="0" cy="82" r="5.5" fill="url(#kidSkin3D)" />
            <circle cx="1.5" cy="77.5" r="2" fill="#FED8BE" />
            <circle cx="3" cy="80" r="2" fill="#FED8BE" />
            <circle cx="3" cy="82.5" r="2" fill="#FED8BE" />
            <circle cx="2" cy="85" r="2" fill="#FED8BE" />

            {/* Bottom Hand clamp */}
            <circle cx="0" cy="91" r="5.5" fill="url(#kidSkin3D)" />
            <circle cx="1.5" cy="86.5" r="2" fill="#FED8BE" />
            <circle cx="3" cy="89" r="2" fill="#FED8BE" />
            <circle cx="3" cy="91.5" r="2" fill="#FED8BE" />
            <circle cx="2" cy="94" r="2" fill="#FED8BE" />
          </g>
        </g>
      </svg>
    </div>
  );
}
