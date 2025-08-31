import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Archive, Trophy, User, CheckSquare, Target } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'notes', label: 'LOGS', icon: FileText, color: '#22D3EE' },        // Cyan 400 - Bright cyan
    { id: 'tasks', label: 'MISSIONS', icon: CheckSquare, color: '#0EA5E9' },       // Sky 500 - Cyan-blue bridge
    { id: 'library', label: 'VAULT', icon: Archive, color: '#3B82F6' },         // Blue 500 - True blue  
    { id: 'focus', label: 'FOCUS', icon: Target, color: '#6366F1' },            // Indigo 500 - Blue-purple bridge
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Trophy, color: '#8B5CF6' }, // Purple 500 - Medium purple
    { id: 'profile', label: 'PROFILE', icon: User, color: '#A78BFA' }           // Purple 400 - Light purple
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
      
      <div className="tab-container">
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
              
              {/* Enhanced active indicator with starfield theme */}
              {isActive && (
                <>
                  <motion.div
                    className="tab-indicator"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  {/* Add pulsing constellation effect */}
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
      
      {/* Add shooting star across navigation */}
      <div className="nav-shooting-star"></div>
    </div>
  );
};

export default TabNavigation;