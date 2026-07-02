import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, RefreshCw, ArrowLeft, Compass, MapPin, Search } from 'lucide-react';

interface ErrorPageProps {
  errorCode?: number | string;
  errorTitle?: string;
  errorMessage?: string;
  onGoHome: () => void;
  onGoBack?: () => void;
}

/* Floating particle for ambient desert effect */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(255,107,75,0.25) 0%, transparent 70%)',
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function ErrorPage({
  errorCode = 404,
  errorTitle = 'Page Not Found',
  errorMessage = "Oops! Looks like you've wandered off the trail. The page you're looking for doesn't exist or has been moved to a new destination.",
  onGoHome,
  onGoBack,
}: ErrorPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeOnPage, setTimeOnPage] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeOnPage((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 40 + Math.random() * 80,
  }));

  const funMessages = [
    "Don't worry, even the best explorers get lost sometimes! 🧭",
    'This desert is vast, but home is just one click away! 🏠',
    'No oasis here... but your dashboard awaits! 🌴',
    "The compass is spinning — let's get you back on track! 🗺️",
    'Even Marco Polo took wrong turns! 🐪',
  ];

  const randomFunMessage = funMessages[timeOnPage % funMessages.length];

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(145deg, #FFF8F2 0%, #FFF0E6 25%, #FFE8D9 50%, #FFF5EE 75%, #FFFAF5 100%)',
        }}
      />

      {/* Subtle desert pattern overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FF6B4A 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #F7B500 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Atmospheric blurs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full filter blur-[150px] pointer-events-none opacity-20 z-[1]"
        style={{
          background: 'radial-gradient(circle, #FF6B4A, transparent)',
          left: '10%',
          top: '20%',
        }}
        animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
        transition={{ type: 'spring', stiffness: 50 }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none opacity-15 z-[1]"
        style={{
          background: 'radial-gradient(circle, #F7B500, transparent)',
          right: '15%',
          bottom: '15%',
        }}
        animate={{ x: mousePos.x * -0.3, y: mousePos.y * -0.3 }}
        transition={{ type: 'spring', stiffness: 50 }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        {/* Animated 404 number with parallax */}
        <motion.div
          className="relative mb-4"
          style={{ perspective: 800 }}
          animate={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          {/* Giant error code */}
          <motion.div
            className="relative flex items-center justify-center gap-2 sm:gap-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 60 }}
          >
            <span
              className="text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8E53 40%, #F7B500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 20px rgba(255,107,74,0.2))',
              }}
            >
              {String(errorCode).charAt(0)}
            </span>

            {/* Traveler image in middle */}
            <motion.div
              className="relative w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full overflow-hidden flex-shrink-0"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <img
                src="/images/error_traveler.png"
                alt="Lost Traveler"
                className="w-full h-full object-cover rounded-full"
                style={{
                  border: '4px solid rgba(255,107,74,0.2)',
                  boxShadow: '0 8px 32px rgba(255,107,74,0.15)',
                }}
              />
              {/* Compass icon overlay */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Compass className="w-5 h-5 text-[#FF6B4A]" />
              </motion.div>
            </motion.div>

            <span
              className="text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #F7B500 0%, #FF8E53 40%, #FF6B4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 20px rgba(247,181,0,0.2))',
              }}
            >
              {String(errorCode).charAt(String(errorCode).length - 1)}
            </span>
          </motion.div>
        </motion.div>

        {/* Error title & message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">
            Don't Panic!{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF6B4A, #F7B500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {errorTitle}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            {errorMessage}
          </p>
        </motion.div>

        {/* Fun rotating message */}
        <motion.div
          key={randomFunMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-8 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm"
        >
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
            {randomFunMessage}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md"
        >
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full text-white font-bold text-sm uppercase tracking-wider border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #FF6B4A, #FF8E53, #F7B500)',
              boxShadow: '0 8px 24px rgba(255,107,74,0.3)',
            }}
          >
            <Home className="w-4 h-4" />
            Go To Home
          </button>

          {onGoBack && (
            <button
              onClick={onGoBack}
              className="w-full sm:w-auto flex-1 py-3.5 px-8 rounded-full text-slate-700 font-bold text-sm uppercase tracking-wider border-2 border-slate-200 cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:border-slate-300 hover:bg-white/80 active:scale-[0.98] bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {[
            { icon: Search, label: 'Explore Plans', action: onGoHome },
            { icon: MapPin, label: 'Destinations', action: onGoHome },
            { icon: RefreshCw, label: 'Refresh Page', action: () => window.location.reload() },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#FF6B4A] transition-colors cursor-pointer bg-transparent border-none group"
            >
              <link.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              {link.label}
            </button>
          ))}
        </motion.div>

        {/* BEDUINE branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-md bg-white">
            <img src="/images/bedune_logo_cropped.png" alt="BEDUINE" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">BEDUINE</p>
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#FF6B4A] font-bold">Tour & Travels</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
