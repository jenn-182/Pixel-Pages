import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield, Crown, Lock, Trophy } from 'lucide-react';
import { tierInfo } from '../../data/achievements';

const AchievementBadge = ({ achievement, size = 'medium', isUnlocked = false, onClick, showProgress = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldShimmer, setShouldShimmer] = useState(false);
  const unlocked = isUnlocked || achievement.unlockedAt;
  const inProgress = !unlocked && showProgress && (achievement.progress || 0) > 0;
  
  // Periodic shimmer effect every 30 seconds for unlocked badges
  useEffect(() => {
    if (!unlocked) return;
    
    const shimmerInterval = setInterval(() => {
      setShouldShimmer(true);
      setTimeout(() => setShouldShimmer(false), 2000); // Shimmer duration
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(shimmerInterval);
  }, [unlocked]);

  // Updated color scheme: cyan, pink, purple, gold
  const getRarityStyle = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'common':
        return {
          color: '#06B6D4', // Cyan
          bgColor: 'rgba(6, 182, 212, 0.15)',
          shadowColor: 'rgba(6, 182, 212, 0.6)',
          lockedColor: '#0A4A56', // Dark cyan for locked
          lockedBgColor: 'rgba(6, 182, 212, 0.05)',
          name: 'COMMON'
        };
      case 'uncommon':
        return {
          color: '#EC4899', // Pink
          bgColor: 'rgba(236, 72, 153, 0.15)',
          shadowColor: 'rgba(236, 72, 153, 0.6)',
          lockedColor: '#5A1E3D', // Dark pink for locked
          lockedBgColor: 'rgba(236, 72, 153, 0.05)',
          name: 'UNCOMMON'
        };
      case 'rare':
        return {
          color: '#8B5CF6', // Purple
          bgColor: 'rgba(139, 92, 246, 0.15)',
          shadowColor: 'rgba(139, 92, 246, 0.6)',
          lockedColor: '#3D2461', // Dark purple for locked
          lockedBgColor: 'rgba(139, 92, 246, 0.05)',
          name: 'RARE'
        };
      case 'legendary':
        return {
          color: '#FFCB2E', // Gold
          bgColor: 'rgba(245, 158, 11, 0.15)',
          shadowColor: 'rgba(245, 206, 11, 0.68)',
          lockedColor: '#5A3E0B', // Dark gold for locked 
          lockedBgColor: 'rgba(245, 158, 11, 0.05)',
          name: 'LEGENDARY'
        };
      default:
        return {
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.15)',
          shadowColor: 'rgba(107, 114, 128, 0.6)',
          lockedColor: '#374151',
          lockedBgColor: 'rgba(107, 114, 128, 0.05)',
          name: 'COMMON'
        };
    }
  };

  // Your exact icon mapping
  const getRarityIcon = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'common': return Star;
      case 'uncommon': return Award; 
      case 'rare': return Shield;
      case 'legendary': return Crown;
      default: return Trophy;
    }
  };

  const style = getRarityStyle(achievement.tier);
  const IconComponent = getRarityIcon(achievement.tier);

  return (
    <motion.div
      className="bg-black border-2 p-4 relative transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden"
      style={{
        borderColor: unlocked ? style.color : (inProgress ? style.lockedColor : '#4B5563'),
        boxShadow: unlocked 
          ? `0 0 20px ${style.shadowColor}, 0 0 40px ${style.color}30, 2px 2px 0px 0px rgba(0,0,0,1)`
          : inProgress 
            ? `0 0 8px ${style.lockedColor}40, 2px 2px 0px 0px rgba(0,0,0,1)`
            : '0 0 3px rgba(75, 85, 99, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      // REMOVED: No automatic pulse for in-progress badges
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ 
          background: unlocked 
            ? `linear-gradient(135deg, ${style.color}40, ${style.color}20, ${style.color}60)` 
            : inProgress 
              ? `linear-gradient(135deg, ${style.lockedColor}40, ${style.lockedColor}20, ${style.lockedColor}60)`
              : 'linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(75, 85, 99, 0.1))'
        }} 
      />

      {/* SMOOTHER DIAGONAL Shimmer effects - ONLY for unlocked badges */}
      {unlocked && (
        <>
          {/* Initial smooth diagonal shimmer on load */}
          <motion.div
            initial={{ x: '-200%', y: '-200%' }}
            animate={{ x: '300%', y: '300%' }}
            transition={{ 
              duration: 4.0, 
              ease: "easeInOut",
              delay: Math.random() * 2.0 // Random delay for staggered effect
            }}
            className="absolute pointer-events-none z-20 -skew-x-12"
            style={{
              top: '-60%',
              left: '-60%',
              width: '250%',
              height: '250%',
              background: `linear-gradient(45deg, transparent 0%, transparent 35%, rgba(255, 255, 255, 0.08) 50%, transparent 55%, transparent 100%)`,
            }}
          />

          {/* Periodic smooth diagonal shimmer effect */}
          {shouldShimmer && (
            <motion.div
              key={`periodic-${Date.now()}`}
              initial={{ x: '-200%', y: '-200%' }}
              animate={{ x: '300%', y: '300%' }}
              transition={{ 
                duration: 5.0, 
                ease: "easeInOut"
              }}
              className="absolute pointer-events-none z-25 -skew-x-12"
              style={{
                top: '-60%',
                left: '-60%',
                width: '250%',
                height: '250%',
                background: `linear-gradient(45deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.06) 50%, transparent 55%, transparent 100%)`,
              }}
            />
          )}

          {/* Hover smooth diagonal shimmer effect - BRIGHTER */}
          {isHovered && (
            <motion.div
              key={`hover-${Date.now()}`}
              initial={{ x: '-200%', y: '-200%' }}
              animate={{ x: '300%', y: '300%' }}
              transition={{ 
                duration: 2.5, 
                ease: "easeInOut"
              }}
              className="absolute pointer-events-none z-30 -skew-x-12"
              style={{
                top: '-60%',
                left: '-60%',
                width: '250%',
                height: '250%',
                background: `linear-gradient(45deg, transparent 0%, transparent 40%, ${style.color}25 50%, transparent 60%, transparent 100%)`,
              }}
            />
          )}
        </>
      )}
      
      <div className="relative z-10 text-center">
        {/* Badge Icon Circle - Pulse on hover for in-progress */}
        <div className="mb-3 flex justify-center">
          <motion.div 
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative overflow-hidden"
            style={{
              borderColor: unlocked ? style.color : (inProgress ? style.lockedColor : '#6B7280'),
              background: unlocked 
                ? `radial-gradient(circle, ${style.color}40, ${style.color}20)`
                : inProgress 
                  ? `radial-gradient(circle, ${style.lockedColor}40, ${style.lockedColor}20)`
                  : 'radial-gradient(circle, #37414940, #37414920)',
              boxShadow: unlocked 
                ? `0 0 25px ${style.shadowColor}, inset 0 0 15px ${style.color}30`
                : inProgress 
                  ? `0 0 10px ${style.lockedColor}40, inset 0 0 8px ${style.lockedColor}20`
                  : 'none'
            }}
            // HOVER PULSE for in-progress badges only
            animate={inProgress && isHovered ? {
              borderColor: [
                style.lockedColor,
                style.color,
                style.lockedColor
              ],
              boxShadow: [
                `0 0 10px ${style.lockedColor}40, inset 0 0 8px ${style.lockedColor}20`,
                `0 0 20px ${style.color}60, inset 0 0 15px ${style.color}30`,
                `0 0 10px ${style.lockedColor}40, inset 0 0 8px ${style.lockedColor}20`
              ]
            } : {}}
            transition={inProgress && isHovered ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {unlocked ? (
              <IconComponent 
                size={20} 
                className="text-white filter drop-shadow-lg"
                style={{ 
                  color: '#ffffff',
                  filter: `drop-shadow(0 0 8px ${style.color})`
                }}
              />
            ) : inProgress ? (
              <IconComponent 
                size={20} 
                className="filter drop-shadow-lg"
                style={{ 
                  color: style.lockedColor,
                  filter: `drop-shadow(0 0 6px ${style.lockedColor})`
                }}
              />
            ) : (
              <Lock size={16} className="text-gray-500" />
            )}
          </motion.div>
        </div>

        {/* Badge Title */}
        <h4 className={`font-mono font-bold text-sm mb-2 ${
          unlocked ? 'text-white' : inProgress ? 'text-gray-300' : 'text-gray-500'
        }`}>
          {achievement.name}
        </h4>
        
        {/* Badge Description */}
        <p className={`text-xs font-mono mb-3 ${
          unlocked ? 'text-gray-300' : inProgress ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {achievement.description}
        </p>

        {/* Rarity Badge - HOVER PULSE for in-progress */}
        <div className="flex justify-center">
          <motion.div 
            className="px-2 py-1 text-xs font-mono font-bold border flex items-center gap-1 relative overflow-hidden"
            style={{
              color: unlocked ? style.color : (inProgress ? style.lockedColor : '#6B7280'),
              borderColor: unlocked ? style.color : (inProgress ? style.lockedColor : '#6B7280'),
              backgroundColor: unlocked ? style.bgColor : (inProgress ? style.lockedBgColor : 'transparent'),
              boxShadow: unlocked ? `0 0 10px ${style.color}30` : inProgress ? `0 0 5px ${style.lockedColor}20` : 'none'
            }}
            // HOVER PULSE for in-progress rarity badge
            animate={inProgress && isHovered ? {
              borderColor: [
                style.lockedColor,
                style.color,
                style.lockedColor
              ],
              boxShadow: [
                `0 0 5px ${style.lockedColor}20`,
                `0 0 12px ${style.color}40`,
                `0 0 5px ${style.lockedColor}20`
              ]
            } : {}}
            transition={inProgress && isHovered ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {/* Smooth diagonal rarity badge shimmer on hover - BRIGHTER */}
            {unlocked && isHovered && (
              <motion.div
                key={`rarity-hover-${Date.now()}`}
                initial={{ x: '-200%', y: '-100%' }}
                animate={{ x: '300%', y: '100%' }}
                transition={{ 
                  duration: 2.0, 
                  ease: "easeInOut"
                }}
                className="absolute pointer-events-none -skew-x-12"
                style={{
                  top: '-50%',
                  left: '-60%',
                  width: '250%',
                  height: '200%',
                  background: `linear-gradient(45deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.25) 50%, transparent 55%, transparent 100%)`,
                }}
              />
            )}
            <div className="relative z-10 flex items-center gap-1">
              <IconComponent size={10} />
              {style.name}
            </div>
          </motion.div>
        </div>

        {/* Progress Bar for incomplete achievements */}
        {!unlocked && showProgress && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 h-1 border border-gray-600 rounded">
              <div 
                className="h-full rounded transition-all duration-500"
                style={{ 
                  width: `${achievement.progress || 0}%`,
                  background: `linear-gradient(to right, ${style.lockedColor}, ${style.color}60)`
                }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1">
              {achievement.progress || 0}% Complete
            </div>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      {(unlocked || inProgress) && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"
          style={{ 
            background: `radial-gradient(circle, ${unlocked ? style.shadowColor : style.lockedColor}60, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
};

export default AchievementBadge;