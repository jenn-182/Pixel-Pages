// components/effects/SparkleTrail.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const SparkleTrail = () => {
  const { currentTheme } = useTheme();
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (currentTheme !== 'pink') return;

    const handleMouseMove = (e) => {
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4
      };
      
      setSparkles(prev => [...prev, newSparkle]);
      
      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [currentTheme]);

  if (currentTheme !== 'pink') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              x: sparkle.x - sparkle.size/2, 
              y: sparkle.y - sparkle.size/2,
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              background: 'radial-gradient(circle, #f472b6, #e879f9)',
              borderRadius: '50%',
              boxShadow: '0 0 6px #f472b6'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SparkleTrail;