// src/components/PixelButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PixelButton = ({ 
  children, 
  onClick, 
  color = 'bg-yellow-400', 
  hoverColor = 'hover:bg-yellow-500',
  className = '',
  icon = null,
  disabled = false,
  type = 'button',
  ...props
}) => (
  <motion.button
    type={type}
    className={`
      font-mono tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      ${color} ${hoverColor} px-4 py-2 flex items-center justify-center gap-2 
      transition-colors ${className}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? {} : { scale: 1.05 }}
    whileTap={disabled ? {} : { scale: 0.95 }}
    {...props}
  >
    {icon && icon}
    {children}
  </motion.button>
);

export default PixelButton;