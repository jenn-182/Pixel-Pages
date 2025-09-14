import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, X } from 'lucide-react';
import { tierInfo } from '../../data/achievements';

const AchievementNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      console.log('🎉 Achievement notification received:', event.detail);
      
      const { achievement, tier } = event.detail;
      
      const notification = {
        id: Date.now() + Math.random(),
        achievement,
        tier,
        timestamp: Date.now()
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 6000);
    };

    // Listen for achievement events
    window.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    document.addEventListener('achievementUnlocked', handleAchievementUnlocked);
    
    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
      document.removeEventListener('achievementUnlocked', handleAchievementUnlocked);
    };
  }, []);

  const getTierIcon = (tier) => {
    const tierName = typeof tier === 'string' ? tier : tier?.name?.toLowerCase();
    switch (tierName) {
      case 'legendary': return Crown;
      case 'rare': return Star;
      case 'uncommon': return Zap;
      default: return Trophy;
    }
  };

  const getTierInfo = (tier) => {
    const tierName = typeof tier === 'string' ? tier : tier?.name?.toLowerCase();
    return tierInfo[tierName] || tierInfo.common;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const { achievement, tier } = notification;
          const tierData = getTierInfo(tier);
          const TierIcon = getTierIcon(tier);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 400, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.8 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
                duration: 0.6 
              }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm relative overflow-hidden rounded-lg bg-black/80 backdrop-blur-md pointer-events-auto"
              style={{
                boxShadow: `0 0 30px ${tierData.color}60, 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              {/* Matching theme background layers */}
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              {/* Tier color glow overlay */}
              <div 
                className="absolute inset-0 opacity-20 animate-pulse rounded-lg"
                style={{ backgroundColor: tierData.color }}
              />
              
              {/* Animated glow border */}
              <motion.div 
                className="absolute inset-0 border-2 opacity-60 rounded-lg pointer-events-none"
                style={{ borderColor: tierData.color }}
                animate={{ 
                  boxShadow: [
                    `0 0 10px ${tierData.color}40`,
                    `0 0 20px ${tierData.color}80`,
                    `0 0 10px ${tierData.color}40`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Sweep animation */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tierData.color}40, transparent)`,
                  width: '100%'
                }}
              />
              
              <div className="relative z-10">
                {/* Close button */}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={14} />
                </button>
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 border-2 border-white flex items-center justify-center rounded-lg relative overflow-hidden"
                    style={{ 
                      backgroundColor: `${tierData.color}20`,
                      boxShadow: `0 0 15px ${tierData.color}40`
                    }}
                  >
                    <TierIcon size={20} className="text-white" style={{ 
                      filter: `drop-shadow(0 0 8px ${tierData.color})`
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono font-bold text-xs text-white mb-1">
                      🎉 ACHIEVEMENT UNLOCKED!
                    </div>
                    <div 
                      className="font-mono font-bold text-xs flex items-center gap-1"
                      style={{ color: tierData.color }}
                    >
                      {tierData.emoji} {tierData.name.toUpperCase()} TIER
                    </div>
                  </div>
                </div>
                
                {/* Achievement details */}
                <div className="mb-3">
                  <div className="font-mono font-bold text-white text-sm mb-1">
                    {achievement.name}
                  </div>
                  <div className="font-mono text-xs text-gray-300">
                    {achievement.description}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Star size={14} style={{ color: tierData.color }} />
                    <span 
                      className="font-mono text-sm font-bold"
                      style={{ color: tierData.color }}
                    >
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                  <div className="font-mono text-xs text-gray-400">
                    Click × to dismiss
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