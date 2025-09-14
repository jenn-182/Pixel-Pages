import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Archive, Trophy, User, CheckSquare, Clock, LayoutGrid, Timer, BarChart3 } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid },
    { id: 'notes', label: 'LOGS', icon: FileText },
    { id: 'tasks', label: 'MISSIONS', icon: CheckSquare },
    { id: 'library', label: 'VAULT', icon: Archive },
    { id: 'focus', label: 'FOCUS', icon: Timer },
    { id: 'tracker', label: 'SKILLS', icon: BarChart3 },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy },
    { id: 'profile', label: 'PROFILE', icon: User }
  ];

  return (
    <div className="pixel-tab-navigation starfield-theme">
      {/* Add starfield particles to nav */}
      <div className="nav-stars">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
      </div>
      
      {/* ✅ Updated container to justify space between tabs and logo */}
      <div className="tab-container justify-between items-center">
        {/* Left side - Navigation tabs */}
        <div className="flex">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                className={`pixel-tab ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: isActive 
                    ? 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1))'
                    : 'transparent',
                  borderColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  boxShadow: isActive 
                    ? '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)'
                    : '0 0 5px rgba(255,255,255,0.2)',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)'
                }}
              >
                {/* Holographic shimmer effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                      transform: 'translateX(-100%)'
                    }}
                    animate={{
                      transform: ['translateX(-100%)', 'translateX(200%)']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                {/* Sparkle effects */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0
                      }}
                    />
                    <motion.div
                      className="absolute bottom-3 right-6 w-1 h-1 bg-white rounded-full"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: 0.5
                      }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-3 w-0.5 h-0.5 bg-white rounded-full"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 1
                      }}
                    />
                  </>
                )}

                <div className="tab-content relative z-10">
                  <IconComponent size={16} className="tab-icon" />
                  <span className="tab-label">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ✅ Right side - App Logo - Higher and more centered */}
        <motion.div 
          className="app-logo-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'absolute',
            right: '50px',
            top: '0px',
            zIndex: 20
          }}
        >
          <img 
            src="/PixelPageSingleHeaderDraft.png"
            alt="Pixel Pages Logo" 
            className="app-logo"
            style={{
              height: '65px',
              width: 'auto',
              maxWidth: '250px',
              filter: 'brightness(1.1) contrast(1.1)',
              opacity: 0.9,
              display: 'block',
              objectFit: 'contain'
            }}
            onLoad={() => {
              console.log('Image loaded successfully! Dimensions:', 
                document.querySelector('.app-logo').naturalWidth, 'x', 
                document.querySelector('.app-logo').naturalHeight);
            }}
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              // Show fallback text if image fails
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback text */}
          <div 
            style={{ 
              display: 'none',
              color: '#22D3EE',
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
            }}
          >
            📖 PIXEL PAGES
          </div>
        </motion.div>
      </div>
      
      {/* Add shooting star across navigation */}
      <div className="nav-shooting-star"></div>
    </div>
  );
};

export default TabNavigation;