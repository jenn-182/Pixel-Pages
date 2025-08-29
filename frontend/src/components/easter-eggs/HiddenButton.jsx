import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HiddenButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFound, setIsFound] = useState(false);

  const handleClick = () => {
    setIsFound(true);
    // TODO: Open easter egg page
    alert('Easter egg found! Secret page coming soon...');
    console.log('Easter egg discovered!');
  };

  return (
    <motion.div
      className="absolute bottom-1 right-1 w-3 h-3 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      style={{
        background: isHovered || isFound 
          ? 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)' 
          : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1px',
        boxShadow: isHovered || isFound 
          ? '0 0 8px rgba(255, 107, 107, 0.6)' 
          : 'none',
        transition: 'all 0.3s ease'
      }}
      title={isHovered ? "Secret discovered!" : ""}
    >
      {/* Tiny pixel that's barely visible unless hovered */}
      <div 
        className="w-full h-full"
        style={{
          background: isFound 
            ? 'radial-gradient(circle, #fff 30%, transparent 30%)'
            : isHovered 
              ? 'radial-gradient(circle, #fff 50%, transparent 50%)'
              : 'transparent'
        }}
      />
    </motion.div>
  );
};

export default HiddenButton;