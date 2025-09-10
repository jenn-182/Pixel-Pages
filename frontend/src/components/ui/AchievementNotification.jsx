import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { tierInfo } from '../../data/achievements';

const AchievementNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const { achievement, tier } = event.detail;
      
      const notification = {
        id: Date.now() + Math.random(),
        achievement,
        tier,
        timestamp: Date.now()
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    return () => window.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
  }, []);

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'legendary': return Crown;
      case 'rare': return Star;
      case 'uncommon': return Zap;
      default: return Trophy;
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { achievement, tier } = notification;
          const TierIcon = getTierIcon(tier.name.toLowerCase());
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gray-900 border-2 p-4 max-w-sm cursor-pointer relative overflow-hidden"
              style={{
                borderColor: tier.color,
                boxShadow: `0 0 20px ${tier.color}40, 4px 4px 0px 0px rgba(0,0,0,1)`
              }}
              onClick={() => removeNotification(notification.id)}
            >
              {/* Animated background */}
              <div 
                className="absolute inset-0 opacity-10 animate-pulse"
                style={{ backgroundColor: tier.color }}
              />
              
              {/* Glowing border animation */}
              <div 
                className="absolute inset-0 border-2 opacity-50 animate-pulse"
                style={{ borderColor: tier.color }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-8 h-8 border-2 flex items-center justify-center"
                    style={{ 
                      borderColor: tier.color,
                      backgroundColor: `${tier.color}20`
                    }}
                  >
                    <TierIcon size={16} style={{ color: tier.color }} />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs" style={{ color: tier.color }}>
                      {tier.emoji} {tier.name.toUpperCase()} UNLOCKED!
                    </div>
                  </div>
                </div>
                
                <div className="font-mono font-bold text-white text-sm mb-1">
                  {achievement.name}
                </div>
                
                <div className="font-mono text-xs text-gray-400 mb-2">
                  {achievement.description}
                </div>
                
                <div className="flex justify-between items-center">
                  <div 
                    className="font-mono text-xs font-bold"
                    style={{ color: tier.color }}
                  >
                    +{achievement.xpReward} XP
                  </div>
                  <div className="font-mono text-xs text-gray-500">
                    Click to dismiss
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AchievementNotification;