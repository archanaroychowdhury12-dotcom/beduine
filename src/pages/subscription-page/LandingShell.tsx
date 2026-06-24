import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Calendar,
  Compass,
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
  Sun,
  Moon,
  Bot,
} from 'lucide-react';
import { NAV } from '../../data/siteData';
import { ParticleButton, StarField } from './SubscriptionHelpers';
import { openCookiePreferenceModal } from '../../components/legal/CookieConsentBanner';

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

export function Navbar({ view, setView, currentUser, setCurrentUser: _setCurrentUser, setLoginInitialMode, introComplete }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('beduine-theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('beduine-theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

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
  const isDark = theme === 'dark';

  const navBg = isDashboard
    ? 'linear-gradient(135deg, rgba(250,242,230,0.96), rgba(255,255,255,0.9))'
    : isDark 
      ? 'linear-gradient(135deg, rgba(6, 14, 24, 0.85), rgba(3, 12, 22, 0.75))'
      : 'linear-gradient(135deg, rgba(255,255,255,0.94), rgba(234,247,251,0.86))';

  const navBorder = isDashboard 
    ? 'rgba(231,220,207,0.92)' 
    : isDark 
      ? 'rgba(24, 215, 242, 0.3)' 
      : 'rgba(24, 215, 242, 0.22)';

  const navTextColor = isDark ? '#F8FAFC' : '#1E3147';
  const navMutedColor = isDark ? '#AFC0CA' : '#7E919D';

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
            background: navBg,
            backdropFilter: 'blur(20px) saturate(160%)',
            borderColor: navBorder,
            boxShadow: scrolled
              ? isDark 
                ? '0 16px 44px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 16px 44px rgba(22,35,58,0.14), inset 0 1px 0 rgba(255,255,255,0.85)'
              : isDark
                ? '0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 24px 70px rgba(22,35,58,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="pointer-events-none absolute -left-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#18D7F2]/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#F7B500]/10 blur-2xl" />

          <div className="relative flex items-center justify-between gap-1 lg:gap-1.5 xl:gap-3 px-2 sm:px-4 lg:px-3 xl:px-4 h-14 lg:h-16">
            <div className="flex items-center gap-1 lg:gap-1.5 xl:gap-3 min-w-0">
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
                  className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-2xl overflow-hidden border bg-white flex items-center justify-center p-1.5 shadow-lg shadow-cyan-900/10 transition-transform duration-300 group-hover:scale-105"
                  style={{ borderColor: isDashboard ? '#E7DCCF' : 'rgba(24, 215, 242, 0.32)' }}
                >
                  <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
                  <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00A676]" />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-display text-sm lg:text-[13.5px] xl:text-[15px] font-black tracking-normal" style={{ color: navTextColor }}>BEDUINE</div>
                  <div className="hidden sm:block lg:hidden text-[9px] uppercase tracking-[0.22em] font-black whitespace-nowrap" style={{ color: '#138A8A' }}>Tour & Travels</div>
                </div>
              </a>
              <nav className="hidden lg:flex items-center gap-[3px] xl:gap-1 rounded-full border border-white/70 bg-white/55 p-1 shadow-inner shadow-slate-200/40">
                {view === 'paid-tour' ? bookingNav.map((n) => (
                  <a
                    key={n.id}
                    href={`#${n.id}`}
                    data-magnetic
                    style={{ color: navTextColor }}
                    className="relative inline-flex items-center gap-1 text-xs xl:text-sm font-bold whitespace-nowrap px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-full transition-all duration-300 hover:scale-[1.03] hover:text-[#138A8A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18D7F2]/45"
                  >
                    <n.icon className="relative z-10 w-3 h-3 xl:w-3.5 xl:h-3.5" strokeWidth={2.3} />
                    <span className="relative z-10">{n.label}</span>
                  </a>
                )) : NAV.map((n) => (
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
                    className="relative inline-flex items-center gap-1 text-[10px] xl:text-[11px] font-bold whitespace-nowrap px-[6px] py-[4px] xl:px-2.5 xl:py-1.5 rounded-full transition-all duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18D7F2]/45"
                    style={{ 
                      color: activeSection === n.id || hoveredId === n.id 
                        ? isDark ? '#18D7F2' : '#138A8A' 
                        : isDashboard ? '#1E3147' : navMutedColor 
                    }}
                    onMouseEnter={() => setHoveredId(n.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {activeSection === n.id && (
                      <motion.div 
                        layoutId="activeNavBackground" 
                        className={`absolute inset-0 border rounded-full shadow-sm ${
                          isDark 
                            ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border-cyan/30' 
                            : 'bg-gradient-to-r from-[#EAF7FB] to-white border-[#138A8A]/20'
                        }`} 
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{n.label}</span>
                  </a>
                ))}
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {/* Theme Toggle Button (Desktop) */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm mr-1"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDark ? 'rgba(24, 215, 242, 0.3)' : 'rgba(24, 215, 242, 0.15)',
                  color: isDark ? '#F7B500' : '#1E3147'
                }}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {currentUser ? (
                <>
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
                    <ParticleButton variant={isDashboard ? 'teal' : 'cyan'} className="px-2 xl:px-3 py-1.5 rounded-full font-bold text-[10px] xl:text-[11.5px] inline-flex items-center gap-1 xl:gap-1.5 text-white">
                      Subscribe Now <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                    </ParticleButton>
                  </a>
                   <button 
                    onClick={() => {
                      setView('paid-tour');
                      window.location.hash = 'customize';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-magnetic
                    className="text-[9.5px] xl:text-[11px] transition-all font-extrabold px-2 xl:px-3 py-1.5 xl:py-2 rounded-full border whitespace-nowrap uppercase tracking-wider cursor-pointer shadow-lg hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FF6B4A, #E8590C)', color: '#fff', borderColor: 'transparent', boxShadow: '0 4px 15px rgba(232,89,12,0.25)' }}
                  >
                    <span className="inline-flex items-center gap-1"><Compass className="w-3 h-3 xl:w-3.5 xl:h-3.5" /> Customize Plan</span>
                  </button>
                  <button 
                    onClick={() => {
                      setView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="rounded-full w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-[#0096C7] to-[#00B4D8] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 hover:shadow-md transition-all cursor-pointer border-2 border-white uppercase"
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
                    className="text-[10px] xl:text-xs transition-colors font-bold px-2 xl:px-3 py-1.5 whitespace-nowrap bg-white/45 border border-slate-200/70 rounded-full cursor-pointer"
                    style={{ color: isDashboard ? '#1E3147' : navTextColor }}
                  >
                    Log In / <span className="font-extrabold text-slate-800">Register</span>
                  </button>
 
                  <button 
                    onClick={() => {
                      setView('paid-tour');
                      window.location.hash = 'customize';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-magnetic
                    className="text-[9.5px] xl:text-[11px] transition-all font-extrabold px-2 xl:px-3 py-1.5 xl:py-2 rounded-full border whitespace-nowrap uppercase tracking-wider cursor-pointer shadow-lg hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FF6B4A, #E8590C)', color: '#fff', borderColor: 'transparent', boxShadow: '0 4px 15px rgba(232,89,12,0.25)' }}
                  >
                    <span className="inline-flex items-center gap-1"><Compass className="w-3 h-3 xl:w-3.5 xl:h-3.5" /> Customize Plan</span>
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
                    <ParticleButton variant={isDashboard ? 'teal' : 'cyan'} className="px-2 xl:px-3 py-1.5 rounded-full font-bold text-[10px] xl:text-[11.5px] inline-flex items-center gap-1 xl:gap-1.5 text-white">
                      Subscribe Now <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                    </ParticleButton>
                  </a>
                </>
              )}
            </div>

            <div className="lg:hidden ml-auto flex shrink-0 items-center gap-2">
              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-2xl border flex items-center justify-center cursor-pointer shadow-lg"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderColor: isDark ? 'rgba(24, 215, 242, 0.3)' : 'rgba(24, 215, 242, 0.15)',
                  color: isDark ? '#F7B500' : '#1E3147'
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

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
              <>
                {/* Backdrop blur overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99] lg:hidden"
                />
                
                {/* Right Slide-in Drawer */}
                <motion.div
                  id="mobile-menu"
                  initial={{ x: '100%', opacity: 0.9 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] h-full z-[100] border-l shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden"
                  style={{
                    background: isDark ? 'rgba(6, 14, 24, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    borderColor: isDark ? 'rgba(24, 215, 242, 0.2)' : 'rgba(24, 215, 242, 0.15)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="flex flex-col gap-6">
                    {/* Header of Mobile Menu with logo and close button */}
                    <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                      <div className="flex items-center gap-2.5">
                        <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-display font-black text-sm uppercase tracking-wider" style={{ color: navTextColor }}>Beduine</span>
                      </div>
                      <button 
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 rounded-full flex items-center justify-center border bg-slate-900 text-white cursor-pointer"
                        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Menu links grid */}
                    <div className="flex flex-col gap-3">
                      {NAV.map((n) => (
                        <a 
                          key={n.id} 
                          href={`#${n.id}`} 
                          onClick={(e) => {
                            setOpen(false);
                            if (n.id === 'terms') {
                              e.preventDefault();
                              setView('terms');
                              return;
                            }
                            e.preventDefault();
                            setView('landing');
                            setTimeout(() => {
                              const el = document.getElementById(n.id);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }} 
                          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all hover:bg-cyan/10"
                          style={{
                            color: navTextColor,
                            borderColor: activeSection === n.id 
                              ? 'rgba(24, 215, 242, 0.3)' 
                              : 'transparent',
                            background: activeSection === n.id
                              ? isDark ? 'rgba(24, 215, 242, 0.08)' : 'rgba(24, 215, 242, 0.05)'
                              : 'transparent'
                          }}
                        >
                          <n.icon className="w-4 h-4" style={{ color: activeSection === n.id ? '#18D7F2' : '#138A8A' }} strokeWidth={2.3} />
                          <span className="font-bold text-sm">{n.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex flex-col gap-2.5 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                    {currentUser ? (
                      <div className="flex items-center gap-3 p-2 border rounded-2xl bg-white/5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0096C7] to-[#00B4D8] text-white flex items-center justify-center text-xs font-black uppercase">
                          {currentUser.fullName ? currentUser.fullName.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2) : 'U'}
                        </div>
                        <span className="text-xs font-bold truncate" style={{ color: navTextColor }}>{currentUser.fullName}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setOpen(false); setLoginInitialMode('login'); setView('login'); }}
                        className="w-full text-center py-2.5 rounded-full border text-xs font-bold bg-transparent cursor-pointer"
                        style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E7DCCF', color: navTextColor }}
                      >
                        Log In / <span className="font-extrabold">Register</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => { setOpen(false); setView('paid-tour'); window.location.hash = 'customize'; }}
                      className="w-full text-center py-2.5 rounded-full text-xs font-extrabold transition-all uppercase tracking-wider text-white border-none cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #FF6B4A, #E8590C)' }}
                    >
                      Customize Plan
                    </button>
                    
                    <a 
                      href="#plans" 
                      onClick={(e) => {
                        setOpen(false);
                        e.preventDefault();
                        const el = document.getElementById('plans');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }} 
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-bold text-xs no-underline"
                      style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
                    >
                      Subscribe Now <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </>
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
              ⚠️ 18+ Membership Required. Beduine operates a travel membership & reward program. All benefits, discounts, and travel services are subject to company policies and terms.
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

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 lg:bottom-28 z-40 w-11 h-11 rounded-full bg-slate-900 border border-[#18D7F2]/40 text-white flex items-center justify-center shadow-xl cursor-pointer hover:bg-[#18D7F2] hover:text-slate-950 transition-colors focus:outline-none"
          title="Back to Top"
        >
          <ArrowRight className="w-5 h-5 -rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Namaskar! 🙏 Welcome to Beduine Tour & Travels. I am your Beduine Assistant. How can I help you today?', timestamp: 'Just now' }
  ]);
  const [typing, setTyping] = useState(false);

  const botResponses = {
    credits: {
      text: "Every INR 500 in your Beduine membership maps directly to a fixed travel discount credit. You can redeem these credits for guaranteed deductions on our domestic or international paid tours! Zero loss.",
      options: ['plans', 'booking']
    },
    plans: {
      text: "We offer Silver (INR 499), Gold (INR 799), and Platinum (INR 1,499) domestic plans, as well as premium International plans. Each membership offers weekly eligible entries and fixed discount credits.",
      options: ['credits', 'booking']
    },
    booking: {
      text: "Booking is simple! Head over to the 'Customize Plan' portal to submit your desired destinations and dates, or browse through our Handpicked Packages and click 'Book Now' to complete your details.",
      options: ['credits', 'plans']
    }
  };

  const handleOptionClick = (optionKey: 'credits' | 'plans' | 'booking') => {
    // Add user message
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: optionKey === 'credits' ? 'How do Discount Credits work?' : optionKey === 'plans' ? 'What are the membership plans?' : 'How do I book a tour?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botResponses[optionKey].text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Chat Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-cyan via-[#00C7A3] to-cyan-deep text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer border-none"
        style={{ width: 52, height: 52 }}
        title="Beduine Live Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            className="absolute bottom-16 right-0 w-[330px] max-w-[calc(100vw-32px)] h-[440px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col justify-between"
            style={{
              background: 'rgba(6, 14, 24, 0.98)',
              borderColor: 'rgba(24, 215, 242, 0.25)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/80 to-slate-900/60 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#18D7F2]/10 border border-[#18D7F2]/30 flex items-center justify-center text-[#18D7F2]">
                <Bot className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-display font-black text-sm text-white">Beduine Assistant</div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Support
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`chat-message-bubble ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan to-cyan-deep text-slate-955 font-semibold'
                        : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}
              
              {typing && (
                <div className="flex flex-col items-start">
                  <div className="chat-message-bubble bg-white/5 border border-white/10 text-slate-400 flex items-center gap-1 py-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Options Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex flex-col gap-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black text-center mb-1">Quick Questions</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button
                  onClick={() => handleOptionClick('credits')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#18D7F2]/10 border border-white/10 hover:border-[#18D7F2]/30 text-[11px] font-bold text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  Discount Credits
                </button>
                <button
                  onClick={() => handleOptionClick('plans')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#18D7F2]/10 border border-white/10 hover:border-[#18D7F2]/30 text-[11px] font-bold text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  Membership Plans
                </button>
                <button
                  onClick={() => handleOptionClick('booking')}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#18D7F2]/10 border border-white/10 hover:border-[#18D7F2]/30 text-[11px] font-bold text-slate-350 hover:text-white transition-all cursor-pointer"
                >
                  How to Book?
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
