// components/ui/HeartProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const HeartProgressBar = ({ progress, maxHearts = 18, size = 50, className = "" }) => {
  const { currentTheme } = useTheme();
  
  if (currentTheme !== 'pink') {
    // Fallback to regular progress bar for other themes
    return (
      <div className={`w-full h-4 bg-gray-700 rounded-full overflow-hidden ${className}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    );
  }

  // Calculate how many hearts should be filled
  const filledHearts = Math.floor((progress / 100) * maxHearts);
  const partialHeart = ((progress / 100) * maxHearts) % 1;

  return (
    <div className={`flex items-center gap-6 flex-wrap justify-center ${className}`}>
      {Array.from({ length: maxHearts }, (_, index) => {
        let heartState = 'empty';
        
        if (index < filledHearts) {
          heartState = 'filled';
        } else if (index === filledHearts && partialHeart > 0) {
          heartState = 'partial';
        }

        return (
          <HeartIcon
            key={index}
            state={heartState}
            size={size}
            partialProgress={heartState === 'partial' ? partialHeart : 0}
            delay={index * 0.08}
          />
        );
      })}
    </div>
  );
};

const HeartIcon = ({ state, size, partialProgress, delay }) => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        delay, 
        duration: 0.4, 
        type: "spring",
        stiffness: 200,
        damping: 10
      }}
      style={{ width: size, height: size }}
    >
      {/* Background heart (empty) */}
      <Heart
        size={size}
        className="absolute inset-0 text-gray-600"
        fill="rgba(75, 85, 99, 0.2)"
        stroke="rgba(244, 114, 182, 0.4)"
        strokeWidth="2"
      />
      
      {/* Filled heart */}
      {state !== 'empty' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: state === 'filled' ? 1 : partialProgress }}
          transition={{ 
            delay: delay + 0.2, 
            duration: 0.5, 
            type: "spring",
            stiffness: 150
          }}
          className="absolute inset-0"
        >
          <Heart
            size={size}
            className="text-pink-400"
            fill="url(#heartGradient)"
            stroke="#f472b6"
            strokeWidth="2"
          />
        </motion.div>
      )}
      
      {/* Extra sparkle effect for filled hearts */}
      {state === 'filled' && (
        <>
          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.9, 1.2, 0.9]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + 0.5
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <Heart
              size={size}
              className="text-white"
              fill="none"
              stroke="rgba(248, 250, 252, 0.8)"
              strokeWidth="1"
              filter="blur(2px)"
            />
          </motion.div>
          
          {/* Pulsing glow effect */}
          <motion.div
            animate={{
              opacity: [0, 0.6, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + 1
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, transparent 70%)',
              borderRadius: '50%'
            }}
          />
        </>
      )}
      
      {/* SVG gradient definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="25%" stopColor="#e879f9" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="75%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default HeartProgressBar;