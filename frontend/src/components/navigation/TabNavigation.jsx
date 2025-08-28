import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Trophy, User } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'notes', label: 'Notes', icon: FileText, color: '#FFD700' },
    { id: 'library', label: 'Library', icon: Folder, color: '#87CEEB' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: '#98FB98' },
    { id: 'profile', label: 'Player', icon: User, color: '#DDA0DD' }
  ];

  return (
    <div className="pixel-tab-navigation">
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
                '--tab-shadow': isActive ? `0 0 20px ${tab.color}40` : 'none'
              }}
            >
              <div className="tab-content">
                <IconComponent size={16} className="tab-icon" />
                <span className="tab-label">{tab.label}</span>
              </div>
              
              {isActive && (
                <motion.div
                  className="tab-indicator"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;