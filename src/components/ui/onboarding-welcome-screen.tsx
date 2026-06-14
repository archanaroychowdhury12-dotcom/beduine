import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

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
        'flex h-full w-full flex-col items-center justify-between bg-cosmos/90 text-ink',
        className
      )}
    >
      {/* Top Image Section with a curved clip-path */}
      <motion.div 
        className="relative w-full max-h-[300px] overflow-hidden"
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
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Title */}
        <motion.h1
          className="text-3xl font-display font-black tracking-tight text-ink md:text-4xl"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-md text-ink/75 text-sm md:text-base leading-relaxed"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      </motion.div>
      
      {/* Actions Section */}
      <motion.div 
        className="w-full space-y-4 p-8 pt-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Primary Button */}
        <motion.div variants={itemVariants}>
          <Button onClick={onButtonClick} className="w-full text-cosmos font-bold" size="lg">
            {buttonText}
          </Button>
        </motion.div>

        {/* Secondary Action Link */}
        {secondaryActionText && onSecondaryActionClick && (
          <motion.div variants={itemVariants} className="text-center">
            <Button
              variant="link"
              onClick={onSecondaryActionClick}
              className="text-sm text-ink/65 hover:text-ink transition-colors cursor-pointer border-none bg-transparent"
            >
              {secondaryActionText}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
