// src/components/PixelInput.jsx
import React from 'react';

const PixelInput = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  type = 'text',
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`
      font-mono tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      bg-white px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400
      ${className}
    `}
    {...props}
  />
);

export const PixelTextarea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  rows = 4,
  ...props
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`
      font-mono tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      bg-white px-4 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400
      ${className}
    `}
    {...props}
  />
);

export default PixelInput;