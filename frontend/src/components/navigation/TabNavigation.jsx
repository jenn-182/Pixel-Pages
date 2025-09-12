import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Archive, Trophy, User, CheckSquare, Clock, LayoutGrid, Timer, BarChart3 } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid, color: '#67E8F9' },
    { id: 'notes', label: 'LOGS', icon: FileText, color: '#22D3EE' },
    { id: 'tasks', label: 'MISSIONS', icon: CheckSquare, color: '#0EA5E9' },
    { id: 'library', label: 'VAULT', icon: Archive, color: '#3B82F6' },
    { id: 'focus', label: 'GRIND', icon: Timer, color: '#8B5CF6' },        // ADD THIS
    { id: 'tracker', label: 'SKILLS', icon: BarChart3, color: '#F59E0B' }, // ADD THIS
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy, color: '#8B5CF6' },
    { id: 'profile', label: 'PROFILE', icon: User, color: '#A78BFA' }
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
                  '--tab-color': tab.color,
                  '--tab-shadow': isActive 
                    ? `0 0 25px ${tab.color}80, 0 0 50px ${tab.color}40, 0 8px 16px rgba(0, 0, 50, 0.4)` 
                    : `0 0 5px ${tab.color}30`
                }}
              >
                <div className="tab-content">
                  <IconComponent size={16} className="tab-icon" />
                  <span className="tab-label">{tab.label}</span>
                </div>
                
                {isActive && (
                  <>
                    <motion.div
                      className="tab-indicator"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                      className="tab-constellation"
                      animate={{ 
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}
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