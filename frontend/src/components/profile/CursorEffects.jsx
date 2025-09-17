// components/profile/DataStreamCursor.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const DataStreamCursor = () => {
  const { currentTheme } = useTheme();
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    if (currentTheme !== 'default') return;

    const handleMouseMove = (e) => {
      // Generate binary data stream
      const chars = '01';
      const stream = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        data: Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)])
      };
      
      setStreams(prev => [...prev.slice(-10), stream]); // Keep last 10 streams
      
      // Remove stream after animation
      setTimeout(() => {
        setStreams(prev => prev.filter(s => s.id !== stream.id));
      }, 1500);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [currentTheme]);

  // Only show for default (cyan) theme
  if (currentTheme !== 'default') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {streams.map(stream => (
          <motion.div
            key={stream.id}
            initial={{ 
              x: stream.x - 30,
              y: stream.y - 10,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              y: stream.y + 50,
              opacity: 0,
              scale: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute font-mono text-xs text-cyan-400"
            style={{
              textShadow: '0 0 4px #06b6d4'
            }}
          >
            {stream.data.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.3, 1, 0] }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DataStreamCursor;