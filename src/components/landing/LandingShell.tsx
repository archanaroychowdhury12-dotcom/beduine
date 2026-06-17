import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Calendar,
  Crown,
  HelpCircle,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  Tag,
  Tv,
  Users,
  Video,
  X,
} from 'lucide-react';
import { DESKTOP_NAV, NAV } from '../../data/siteData';
import { ParticleButton, StarField } from './LandingExperience';
import { openCookiePreferenceModal } from '../legal/CookieConsentBanner';

/* ---------- Navbar ---------- */
interface NavbarProps {
  view: string;
  setView: (v: any) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  setLoginInitialMode: (mode: 'login' | 'register') => void;
  onSelectPlan?: (planName: string) => void;
  introComplete?: boolean;
}

export function Navbar({ view, setView, currentUser, setCurrentUser, setLoginInitialMode, introComplete }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (view !== 'landing' || !introComplete) {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection('');
        return;
      }

      const sections = ['about', 'plans', 'destinations', 'contact'];
      let closestSection = '';
      let minDistance = Infinity;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 120);
          
          if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 120) {
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = id;
            }
          }
        }
      }

      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [view, introComplete]);

  const isDashboard = view === 'dashboard';
  const bookingNav = [
    { id: 'step-2', label: 'Tours', icon: Calendar },
    { id: 'step-4', label: 'Travelers', icon: Users },
    { id: 'step-6', label: 'Vouchers', icon: Tag },
    { id: 'step-11', label: 'Support', icon: HelpCircle },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-[26px] border transition-all duration-500"
          style={{
            background: isDashboard
              ? 'linear-gradient(135deg, rgba(250,242,230,0.96), rgba(255,255,255,0.9))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(234,247,251,0.86))',
            backdropFilter: 'blur(18px) saturate(160%)',
            borderColor: isDashboard ? 'rgba(231,220,207,0.92)' : 'rgba(24, 215, 242, 0.22)',
            boxShadow: scrolled
              ? '0 16px 44px rgba(22,35,58,0.14), inset 0 1px 0 rgba(255,255,255,0.85)'
              : '0 24px 70px rgba(22,35,58,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="pointer-events-none absolute -left-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#18D7F2]/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#F7B500]/10 blur-2xl" />

          <div className="relative flex items-center justify-between px-3 sm:px-4 lg:px-5 h-14 lg:h-16">
            <div className="flex items-center gap-4 lg:gap-5 min-w-0">
              <a 
                href="#top" 
                className="group flex items-center gap-3 rounded-2xl pr-2 no-underline" 
                data-magnetic
                onClick={(e) => {
                  if (view !== 'landing') {
                    e.preventDefault();
                    setView('landing');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                <div 
                  className="relative w-11 h-11 rounded-2xl overflow-hidden border bg-white flex items-center justify-center p-1.5 shadow-lg shadow-cyan-900/10 transition-transform duration-300 group-hover:scale-105"
                  style={{ borderColor: isDashboard ? '#E7DCCF' : 'rgba(24, 215, 242, 0.32)' }}
                >
                  <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
                  <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00A676]" />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-display text-base lg:text-lg font-black tracking-normal" style={{ color: '#1E3147' }}>BEDUINE</div>
                  <div className="hidden sm:block text-[9px] uppercase tracking-[0.22em] font-black whitespace-nowrap" style={{ color: '#138A8A' }}>Tour & Travels</div>
                </div>
              </a>
              <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/70 bg-white/55 p-1 shadow-inner shadow-slate-200/40">
                {view === 'paid-tour' ? bookingNav.map((n) => (
                  <a
                    key={n.id}
                    href={`#${n.id}`}
                    data-magnetic
                    className="relative inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap px-3.5 py-2 rounded-full transition-all duration-300 hover:scale-[1.03] text-[#1E3147] hover:text-[#138A8A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18D7F2]/45"
                  >
                    <n.icon className="relative z-10 w-3.5 h-3.5" strokeWidth={2.3} />
                    <span className="relative z-10">{n.label}</span>
                  </a>
                )) : DESKTOP_NAV.map((n) => (
                  <a 
                    key={n.id} 
                    href={`#${n.id}`} 
                    data-magnetic 
                    onClick={(e) => {
                      if (n.id === 'terms') {
                        e.preventDefault();
                        setView('terms');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                        return;
                      }
                      e.preventDefault();
                      if (view !== 'landing') {
                        setView('landing');
                        setTimeout(() => {
                          const el = document.getElementById(n.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        const el = document.getElementById(n.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="relative inline-flex items-center gap-1.5 text-sm font-bold whitespace-nowrap px-3.5 py-2 rounded-full transition-all duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18D7F2]/45"
                    style={{ 
                      color: activeSection === n.id || hoveredId === n.id 
                        ? '#138A8A' 
                        : isDashboard ? '#1E3147' : '#7E919D' 
                    }}
                    onMouseEnter={() => setHoveredId(n.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {activeSection === n.id && (
                      <motion.div 
                        layoutId="activeNavBackground" 
                        className="absolute inset-0 bg-gradient-to-r from-[#EAF7FB] to-white border border-[#138A8A]/20 rounded-full shadow-sm" 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <n.icon className="relative z-10 w-3.5 h-3.5" strokeWidth={2.3} />
                    <span className="relative z-10">{n.label}</span>
                  </a>
                ))}
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-2.5">
              {currentUser ? (
                <>
                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-xs transition-colors font-bold px-3 py-2 whitespace-nowrap bg-white/45 border border-slate-200/70 rounded-full cursor-pointer text-slate-500 hover:text-red-500 hover:border-red-200"
                  >
                    Log Out
                  </button>
                  <a 
                    href="#plans"
                    onClick={(e) => {
                      if (view !== 'landing') {
                        e.preventDefault();
                        setView('landing');
                        setTimeout(() => {
                          const el = document.getElementById('plans');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                  >
                    <ParticleButton variant={isDashboard ? 'teal' : 'cyan'} className="px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-1.5 text-white">
                      Subscribe Now <ArrowRight className="w-3.5 h-3.5" />
                    </ParticleButton>
                  </a>
                  <button 
                    onClick={() => {
                      setView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="rounded-full w-10 h-10 bg-gradient-to-br from-[#0096C7] to-[#00B4D8] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 hover:shadow-md transition-all cursor-pointer border-2 border-white uppercase"
                    title={currentUser.fullName || 'My Dashboard'}
                  >
                    {currentUser.fullName ? currentUser.fullName.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2) : 'U'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setLoginInitialMode('login');
                      setView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-sm transition-colors font-bold px-4 py-2 whitespace-nowrap bg-white/45 border border-slate-200/70 rounded-full cursor-pointer"
                    style={{ color: isDashboard ? '#1E3147' : '#7E919D' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#138A8A'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDashboard ? '#1E3147' : '#7E919D'}
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => {
                      setLoginInitialMode('register');
                      setView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-xs transition-all font-extrabold px-5 py-2.5 rounded-full border whitespace-nowrap uppercase tracking-wider cursor-pointer premium-register-btn shadow-lg shadow-[#FF6B4A]/15"
                  >
                    Create Account
                  </button>
                  <a 
                    href="#plans"
                    onClick={(e) => {
                      if (view !== 'landing') {
                        e.preventDefault();
                        setView('landing');
                        setTimeout(() => {
                          const el = document.getElementById('plans');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                  >
                    <ParticleButton variant={isDashboard ? 'teal' : 'cyan'} className="px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-1.5 text-white">
                      Subscribe Now <ArrowRight className="w-3.5 h-3.5" />
                    </ParticleButton>
                  </a>
                </>
              )}
            </div>

            <div className="lg:hidden ml-auto flex shrink-0 items-center">
              <button
                className="relative z-10 w-10 h-10 rounded-2xl border border-white/70 bg-[#1E3147] text-white shadow-lg shadow-slate-900/15 cursor-pointer inline-flex items-center justify-center shrink-0"
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t" style={{ borderColor: 'rgba(231,220,207,0.9)' }}>
                <div className="px-4 py-4" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,242,230,0.96))' }}>
                  <div className="grid grid-cols-2 gap-2">
                    {NAV.map((n) => (
                      <a 
                        key={n.id} 
                        href={`#${n.id}`} 
                        onClick={(e) => {
                          setOpen(false);
                          if (n.id === 'terms') {
                            e.preventDefault();
                            setView('terms');
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                            return;
                          }
                          if (view !== 'landing') {
                            e.preventDefault();
                            setView('landing');
                            setTimeout(() => {
                              const el = document.getElementById(n.id);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          } else {
                            const el = document.getElementById(n.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }} 
                        className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-3 text-sm font-bold no-underline shadow-sm transition-all hover:border-[#138A8A]/30 hover:bg-[#EAF7FB]"
                        style={{ color: '#1E3147' }}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#138A8A] transition-colors group-hover:bg-[#138A8A] group-hover:text-white">
                          <n.icon className="w-4 h-4" strokeWidth={2.3} />
                        </span>
                        <span className="leading-tight">{n.label}</span>
                      </a>
                    ))}
                  </div>
                  {currentUser ? (
                    <div className="mt-3 flex flex-col gap-2 p-3 border border-slate-200/80 bg-white rounded-2xl shadow-sm">
                      <div 
                        onClick={() => {
                          setOpen(false);
                          setView('dashboard');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0096C7] to-[#00B4D8] text-white flex items-center justify-center text-xs font-extrabold uppercase shadow-sm">
                          {currentUser.fullName ? currentUser.fullName.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2) : 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {currentUser.fullName || 'My Profile'}
                          </span>
                          <span className="text-[9px] font-semibold text-[#138A8A] uppercase tracking-wider">
                            View Dashboard
                          </span>
                        </div>
                      </div>
                      <div className="h-px bg-slate-100 my-0.5" />
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setCurrentUser(null);
                          setView('landing');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-center py-2 rounded-xl text-xs font-bold transition-all bg-red-50 text-red-500 border border-red-100 hover:bg-red-100/60 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setLoginInitialMode('login');
                          setView('login');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-3 w-full text-center py-2.5 rounded-full border text-xs font-bold transition-all bg-transparent cursor-pointer"
                        style={{ borderColor: '#E7DCCF', color: '#1E3147' }}
                      >
                        Log In
                      </button>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setLoginInitialMode('register');
                          setView('login');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-2 w-full text-center py-2.5 rounded-full text-xs font-extrabold transition-all premium-register-btn uppercase tracking-wider text-white border-none cursor-pointer"
                      >
                        Create Account
                      </button>
                    </>
                  )}
                  <a 
                    href="#plans" 
                    onClick={(e) => {
                      setOpen(false);
                      if (view !== 'landing') {
                        e.preventDefault();
                        setView('landing');
                        setTimeout(() => {
                          const el = document.getElementById('plans');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        const el = document.getElementById('plans');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }} 
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm no-underline"
                    style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
                  >
                    Subscribe Now <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

interface FooterProps {
  setView?: (v: any) => void;
}

export function Footer({ setView }: FooterProps) {
  const companyLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Contact Support', href: '#contact' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Membership Plans', href: '#plans' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', slug: 'privacy-policy' },
    { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
    { label: 'Refund Policy', slug: 'refund-policy' },
    { label: 'Cancellation Policy', slug: 'cancellation-policy' },
    { label: 'Membership Rules', slug: 'membership-rules' },
    { label: 'Website Disclaimer', slug: 'website-disclaimer' }
  ];

  const privacyLinks = [
    { label: 'Cookie Policy', slug: 'cookie-policy' },
    { label: 'Affiliate Partner Policy', slug: 'affiliate-agent-policy' },
    { label: 'Grievance Redressal', slug: 'grievance-redressal' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (setView) {
      e.preventDefault();
      setView(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && setView) {
      e.preventDefault();
      const id = href.replace('#', '');
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="bg-[#030C15] border-t border-slate-900/80 pt-16 pb-10 relative z-20 select-none">
      <StarField count={40} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900/80">
          
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos flex items-center justify-center p-1.5">
                <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-white">BEDUINE</div>
                <div className="text-[10px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div>
              </div>
            </div>
            <p className="font-serif italic text-neon-gold text-lg mb-3">Safar jo yaad rahe.</p>
            <p className="text-sm text-[#D8E4EA] leading-relaxed max-w-sm mb-6 opacity-85">
              India's subscription-first travel company - built on transparency, guaranteed value, and journeys that live forever.
            </p>
            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
              <MapPin className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
              <div className="text-sm text-[#D8E4EA] leading-relaxed">
                <div className="font-semibold text-white">Registered Office</div>
                Fulia, Nadia,<br />West Bengal, India<br />Pin - 741402
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Company</div>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => handleAnchorClick(e, l.href)}
                    className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all no-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Legal & Policies</div>
            <ul className="space-y-2.5 font-sans">
              {legalLinks.map((l) => (
                <li key={l.slug}>
                  <a
                    href={`/${l.slug}`}
                    onClick={(e) => handleLinkClick(e, l.slug)}
                    className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all no-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Privacy & Partners</div>
            <ul className="space-y-2.5 font-sans">
              {privacyLinks.map((l) => (
                <li key={l.slug}>
                  <a
                    href={`/${l.slug}`}
                    onClick={(e) => handleLinkClick(e, l.slug)}
                    className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all no-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => openCookiePreferenceModal()}
                  className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all no-underline bg-transparent border-none p-0 cursor-pointer font-sans outline-none text-left"
                >
                  Cookie Settings
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="/legal"
                  onClick={(e) => handleLinkClick(e, 'legal')}
                  className="text-xs font-semibold neon-cyan inline-flex items-center gap-1 font-mono no-underline"
                >
                  &gt; Legal Center <ArrowRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#AFC0CA] uppercase tracking-widest">Connect</span>
            <div className="flex gap-2">
              {[Video, Camera, Send, Tv, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan/50 hover:bg-cyan/10 transition-all text-[#D8E4EA]">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#AFC0CA]/60">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-neon-gold" /> RNG Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan" /> E2E Encrypted</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-neon-gold" /> Audited</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/80 text-center text-xs text-[#AFC0CA]/40 font-mono">
          <div className="mb-4 text-[#AFC0CA]/60 leading-relaxed font-sans max-w-4xl mx-auto">
            🍪 Cookie Notice: Beduine Tour & Travels uses essential cookies to operate and secure this website. With your permission, we may also use analytics and marketing cookies to improve your experience and provide relevant travel offers. You can accept, reject, or manage optional cookies at any time.
          </div>
          <div className="mt-4 leading-relaxed font-sans text-[11px] text-[#AFC0CA]/50">
            © 2026 Beduine Tour & Travels. All rights reserved. 
            <br />
            <span className="text-[10px] text-amber-500/80 font-semibold">
              ⚠️ Membership eligibility: 18 years and above. Membership does not guarantee promotional selection or travel rewards.
            </span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-[#AFC0CA]/35 font-mono">
            <span>Secure Payment</span>
            <span>•</span>
            <span>Privacy Protected</span>
            <span>•</span>
            <span>Support Contact: +91 87689 03565</span>
            <span>•</span>
            <span>Policy Version: 1.0.0 (Draft)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <div className="hidden lg:flex fixed left-6 bottom-6 flex-col gap-3 z-40">
      <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform" title="WhatsApp" style={{ width: 52, height: 52 }}><MessageCircle className="w-5 h-5" /></a>
      <a href="tel:+918768903565" className="w-13 h-13 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep text-cosmos flex items-center justify-center shadow-xl shadow-neon-gold/40 hover:scale-110 transition-transform" title="Call" style={{ width: 52, height: 52 }}><Phone className="w-5 h-5" /></a>
    </div>
  );
}

export function MobileSticky({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-4">
      <div className="glass rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/60 border border-slate-line">
        <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <a href="tel:+918768903565" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass-light border border-slate-line text-ink text-xs font-bold"><Phone className="w-4 h-4" /> Call</a>
        <button 
          onClick={() => onSelectPlan('Silver')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-neon-gold to-gold text-[#0B1F2E] text-xs font-bold cursor-pointer border-none"
        >
          <Crown className="w-4 h-4" /> Join
        </button>
      </div>
    </div>
  );
}
