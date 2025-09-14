import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Star, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import backendAchievementService from '../../services/backendAchievementService';
import { allAchievements, tierInfo } from '../../data/achievements';
import AchievementBadge from '../ui/AchievementBadge';

const FavoriteBadges = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [favoriteBadges, setFavoriteBadges] = useState(() => {
    const saved = localStorage.getItem('favoriteBadges');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { currentTheme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Get unlocked achievements
  const getUnlockedAchievements = () => {
    const unlockedAchievements = backendAchievementService.getUnlockedAchievements();
    return unlockedAchievements || [];
  };

  // Save favorite badges to localStorage
  const saveFavoriteBadges = (badges) => {
    localStorage.setItem('favoriteBadges', JSON.stringify(badges));
    setFavoriteBadges(badges);
  };

  // Toggle badge selection
  const toggleBadgeSelection = (achievementId) => {
    let newSelection;
    if (favoriteBadges.includes(achievementId)) {
      // Remove badge
      newSelection = favoriteBadges.filter(id => id !== achievementId);
    } else if (favoriteBadges.length < 3) {
      // Add badge (max 3)
      newSelection = [...favoriteBadges, achievementId];
    } else {
      // Replace oldest badge
      newSelection = [...favoriteBadges.slice(1), achievementId];
    }
    saveFavoriteBadges(newSelection);
  };

  // Get achievement data by ID
  const getAchievementById = (id) => {
    return allAchievements.find(achievement => achievement.id === id);
  };

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 relative overflow-hidden"
      style={{
        backgroundColor: themeColors.backgroundColor,
        border: `2px solid ${themeColors.borderColor}`,
        borderRadius: '12px', // Fixed - use consistent rounding for all themes
        boxShadow: currentTheme === 'default' 
          ? `0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)` 
          : `0 0 3px ${themeColors.primary}50, 4px 4px 0px 0px rgba(0,0,0,1)`
      }}
    >
      {/* Gradient overlay with theme colors */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: currentTheme === 'default' 
               ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
               : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
             borderRadius: '12px' // Fixed - use consistent rounding for all themes
           }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-mono font-bold text-white flex items-center">
              {currentTheme === 'pink' ? (
                <Heart 
                  size={20} 
                  className="mr-2" 
                  style={{ color: themeColors.secondary }}
                />
              ) : (
                <Star 
                  size={20} 
                  className="mr-2" 
                  style={{ color: themeColors.secondary }}
                />
              )}
              FAVORITE BADGES
            </h3>
          </div>
          
          {/* Add Badge Button */}
          {unlockedAchievements.length > 0 && (
            <button
              onClick={() => setShowSelector(true)}
              className="px-3 py-1.5 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-2"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: '12px', // Fixed - use consistent rounding for all themes
                color: themeColors.controlColor,
                boxShadow: currentTheme === 'default' 
                  ? '0 0 10px rgba(255, 255, 255, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)' 
                  : `0 0 6px ${themeColors.controlColor}50, 2px 2px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Plus size={14} style={{ color: themeColors.controlColor }} />
                <span className="text-xs">ADD BADGES</span>
              </div>
            </button>
          )}
        </div>

        {/* Favorite Badges Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoriteBadges.map(badgeId => {
            const achievement = getAchievementById(badgeId);
            if (!achievement) return null;
            
            return (
              <div key={badgeId} className="relative">
                <AchievementBadge 
                  achievement={achievement}
                  isUnlocked={true}
                  size="medium"
                  compact={false}
                />
              </div>
            );
          })}
          
          {/* Empty slots - Fixed rounding */}
          {Array.from({ length: 3 - favoriteBadges.length }, (_, index) => (
            <div
              key={`empty-${index}`}
              className="border-2 border-dashed border-gray-600 p-8 flex flex-col items-center justify-center min-h-[200px] bg-gray-900/20"
              style={{
                borderRadius: '12px' // Fixed - use consistent rounding for all themes
              }}
            >
              <Plus size={32} className="text-gray-600 mb-2" />
              <span className="text-gray-600 font-mono text-sm">Empty Slot</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-4 max-w-5xl mx-4 relative max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: '12px', // Fixed - use consistent rounding for all themes
                boxShadow: currentTheme === 'default' 
                  ? '0 0 30px rgba(255, 255, 255, 0.4), 8px 8px 0px 0px rgba(0,0,0,1)' 
                  : `0 0 20px ${themeColors.controlColor}30, 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated border */}
              <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" 
                   style={{ 
                     border: `2px solid ${themeColors.controlColor}`,
                     borderRadius: '12px' // Fixed - use consistent rounding for all themes
                   }} />
              
              {/* Close button */}
              <button
                onClick={() => setShowSelector(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  SELECT FAVORITE BADGES
                </h2>
                
                <p className="font-mono text-sm mb-4" style={{ color: themeColors.controlColor }}>
                  Choose up to 3 unlocked achievement badges to showcase ({favoriteBadges.length}/3 selected)
                </p>

                {unlockedAchievements.length === 0 ? (
                  <div className="text-center py-6">
                    {currentTheme === 'pink' ? (
                      <Heart size={40} className="text-gray-500 mx-auto mb-2" />
                    ) : (
                      <Star size={40} className="text-gray-500 mx-auto mb-2" />
                    )}
                    <div className="text-gray-500 font-mono text-sm">
                      Complete achievements to unlock badges!
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(tierInfo).map(([tierKey, tier]) => {
                      const tierAchievements = unlockedAchievements.filter(a => a.tier === tierKey);
                      if (tierAchievements.length === 0) return null;
                      
                      return (
                        <div key={tierKey}>
                          <h3 className="font-mono font-bold text-base mb-2 flex items-center gap-2">
                            <span style={{ color: tier.color }}>{tier.emoji}</span>
                            <span style={{ color: tier.color }}>{tier.name}</span>
                            <span className="text-gray-400 text-xs">({tierAchievements.length})</span>
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {tierAchievements.map(achievement => (
                              <div key={achievement.id} className="relative">
                                <div
                                  className={`cursor-pointer transition-all duration-200 ${
                                    favoriteBadges.includes(achievement.id)
                                      ? 'ring-2 ring-opacity-80'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{
                                    ringColor: favoriteBadges.includes(achievement.id) ? tier.color : 'transparent'
                                  }}
                                  onClick={() => toggleBadgeSelection(achievement.id)}
                                >
                                  <AchievementBadge 
                                    achievement={achievement}
                                    isUnlocked={true}
                                    size="small"
                                    compact={true}
                                  />
                                </div>
                                
                                {/* Selection indicator */}
                                {favoriteBadges.includes(achievement.id) && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border border-white rounded-full flex items-center justify-center">
                                    {currentTheme === 'pink' ? (
                                      <Heart size={10} className="text-white fill-current" />
                                    ) : (
                                      <Star size={10} className="text-white fill-current" />
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FavoriteBadges;
