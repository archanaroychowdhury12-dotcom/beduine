import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Compass } from 'lucide-react';

// Define the props for the WelcomeScreen component
interface WelcomeScreenProps {
  imageUrl: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  secondaryActionText?: React.ReactNode;
  onSecondaryActionClick?: () => void;
  className?: string;
}

/* Decorative floating shape */
function FloatingShape({ delay, x, y, size, color, rotate }: {
  delay: number; x: number; y: number; size: number; color: string; rotate?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      animate={{
        y: [-8, 8, -8],
        x: [-4, 4, -4],
        rotate: [rotate || 0, (rotate || 0) + 15, rotate || 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

/**
 * A responsive and animated welcome screen component.
 * It uses framer-motion for animations and is styled with shadcn/ui theme variables.
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  imageUrl,
  title,
  description,
  buttonText,
  onButtonClick,
  secondaryActionText,
  onSecondaryActionClick,
  className,
}) => {
  // Animation variants for the container and its children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };
  
  const imageVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        duration: 0.8,
      },
    },
  };

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-between text-slate-800 relative overflow-hidden',
        className
      )}
      style={{ background: 'linear-gradient(170deg, #FFFAF6 0%, #FFF5EE 35%, #FFF0E8 60%, #FDE8DF 100%)' }}
    >
      {/* ===== Decorative Background Elements ===== */}

      {/* Floating gradient orbs */}
      <FloatingShape delay={0} x={-5} y={45} size={120} color="rgba(255,107,107,0.12)" />
      <FloatingShape delay={1} x={85} y={30} size={90} color="rgba(139,92,246,0.1)" rotate={45} />
      <FloatingShape delay={2} x={75} y={70} size={70} color="rgba(247,181,0,0.12)" rotate={-20} />
      <FloatingShape delay={0.5} x={10} y={75} size={60} color="rgba(255,142,83,0.1)" rotate={30} />

      {/* Geometric decorative ring — top right */}
      <motion.div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-2 border-[#FF6B6B]/10 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -top-2 -right-2 w-14 h-14 rounded-full border border-dashed border-[#F7B500]/15 pointer-events-none"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Small dot cluster — bottom left */}
      <div className="absolute bottom-16 left-5 pointer-events-none">
        <div className="flex gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#FF6B6B]/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#F7B500]/25"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]/15"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
      </div>

      {/* Floating travel icon — plane */}
      <motion.div
        className="absolute top-[42%] right-4 text-[#FF6B6B]/10 pointer-events-none"
        animate={{ y: [-5, 5, -5], x: [-3, 3, -3], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Plane className="w-8 h-8" />
      </motion.div>

      {/* Floating compass — bottom right */}
      <motion.div
        className="absolute bottom-28 right-8 text-[#F7B500]/12 pointer-events-none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <Compass className="w-6 h-6" />
      </motion.div>

      {/* Floating map pin — left side */}
      <motion.div
        className="absolute top-[55%] left-4 text-[#8B5CF6]/10 pointer-events-none"
        animate={{ y: [-4, 4, -4], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <MapPin className="w-6 h-6" />
      </motion.div>

      {/* Subtle diagonal lines pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            #FF6B6B 20px,
            #FF6B6B 21px
          )`,
        }}
      />

      {/* ===== Main Content ===== */}

      {/* Top Image Section with a curved clip-path */}
      <motion.div 
        className="relative w-full max-h-[300px] overflow-hidden z-[1]"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <img
          src={imageUrl}
          alt="Welcome"
          className="h-auto w-full object-cover"
          style={{ clipPath: 'ellipse(100% 65% at 50% 35%)' }}
        />
        {/* Shimmer overlay on image */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center relative z-[1]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Title */}
        <motion.h1
          className="text-3xl font-display font-black tracking-tight text-slate-800 md:text-4xl"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-md text-slate-500 text-sm md:text-base leading-relaxed"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      </motion.div>
      
      {/* Actions Section */}
      <motion.div 
        className="w-full space-y-4 p-8 pt-0 relative z-[1]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Primary Button */}
        <motion.div variants={itemVariants}>
          <Button onClick={onButtonClick} className="w-full text-white font-bold cursor-pointer" size="lg">
            {buttonText}
          </Button>
        </motion.div>

        {/* Secondary Action Link */}
        {secondaryActionText && onSecondaryActionClick && (
          <motion.div variants={itemVariants} className="text-center">
            <button
              onClick={onSecondaryActionClick}
              className="text-sm text-slate-500 hover:text-[#FF6B6B] transition-colors cursor-pointer border-none bg-transparent font-semibold"
            >
              {secondaryActionText}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
