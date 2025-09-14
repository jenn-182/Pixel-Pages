import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield, Crown, Lock, Trophy } from 'lucide-react';
import { tierInfo } from '../../data/achievements';

const AchievementBadge = ({ achievement, size = 'medium', isUnlocked = false, onClick, showProgress = false, compact = false }) => {
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

  // Updated color scheme: bronze, silver, emerald, gold
  const getRarityStyle = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'common':
        return {
          color: '#CD7F32', // Bronze
          bgColor: 'rgba(205, 127, 50, 0.15)',
          shadowColor: 'rgba(205, 127, 50, 0.6)',
          lockedColor: '#6B3E19', // Dark bronze for locked
          lockedBgColor: 'rgba(205, 127, 50, 0.05)',
          name: 'COMMON'
        };
      case 'uncommon':
        return {
          color: '#B8D4E3', // Silver with blue hint
          bgColor: 'rgba(184, 212, 227, 0.15)',
          shadowColor: 'rgba(184, 212, 227, 0.6)',
          lockedColor: '#5A6B72', // Dark silver-blue for locked
          lockedBgColor: 'rgba(184, 212, 227, 0.05)',
          name: 'UNCOMMON'
        };
      case 'rare':
        return {
          color: '#50C878', // Emerald
          bgColor: 'rgba(80, 200, 120, 0.15)',
          shadowColor: 'rgba(80, 200, 120, 0.6)',
          lockedColor: '#2A5C3C', // Dark emerald for locked
          lockedBgColor: 'rgba(80, 200, 120, 0.05)',
          name: 'RARE'
        };
      case 'legendary':
        return {
          color: '#FFD700', // Gold
          bgColor: 'rgba(255, 215, 0, 0.15)',
          shadowColor: 'rgba(255, 215, 0, 0.68)',
          lockedColor: '#665500', // Dark gold for locked 
          lockedBgColor: 'rgba(255, 215, 0, 0.05)',
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

  // Enhanced rarity-specific background effects
  const getRarityBackgroundEffects = (tier, isUnlocked) => {
    if (!isUnlocked) return null;

    switch (tier?.toLowerCase()) {
      case 'common': // Bronze - subtle metallic texture with contrast
        return (
          <>
            {/* Subtle metallic bronze base with better contrast */}
            <div className="absolute inset-0 opacity-25 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 30% 20%, rgba(205, 127, 50, 0.4) 0%, transparent 50%),
                     radial-gradient(circle at 70% 80%, rgba(160, 82, 25, 0.5) 0%, transparent 45%),
                     linear-gradient(135deg, 
                       rgba(205, 127, 50, 0.2) 0%, 
                       rgba(139, 69, 19, 0.3) 30%, 
                       rgba(205, 127, 50, 0.2) 60%, 
                       rgba(101, 67, 33, 0.4) 100%)
                   `
                 }} />
            
            {/* Subtle metallic shine points with contrast */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.6) 0%, rgba(205, 127, 50, 0.3) 15%, transparent 25%),
                     radial-gradient(circle at 75% 75%, rgba(255, 140, 0, 0.5) 0%, rgba(160, 82, 25, 0.3) 18%, transparent 30%),
                     radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, rgba(205, 127, 50, 0.2) 10%, transparent 20%)
                   `
                 }} />
            
            {/* Darker oxidation for contrast */}
            <div className="absolute inset-0 opacity-35 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 15% 85%, rgba(101, 67, 33, 0.8) 0%, rgba(139, 69, 19, 0.5) 25%, transparent 40%),
                     radial-gradient(circle at 85% 15%, rgba(139, 69, 19, 0.7) 0%, rgba(101, 67, 33, 0.4) 20%, transparent 35%),
                     radial-gradient(circle at 60% 40%, rgba(87, 51, 15, 0.6) 0%, transparent 25%)
                   `
                 }} />
          </>
        );

      case 'uncommon': // Silver - improved chrome with better text readability
        return (
          <>
            {/* Chrome base with realistic metallic reflections - reduced opacity */}
            <div className="absolute inset-0 opacity-25 pointer-events-none"
                 style={{
                   background: `
                     linear-gradient(135deg, 
                       #ffffff 0%, 
                       #e5e5e5 20%, 
                       #a0a0a0 40%, 
                       #ffffff 50%, 
                       #d0d0d0 60%, 
                       #808080 80%, 
                       #ffffff 100%)
                   `
                 }} />
            
            {/* Sharp chrome reflection lines - reduced opacity */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                 style={{
                   background: `
                     linear-gradient(45deg, 
                       transparent 0%, 
                       transparent 30%, 
                       rgba(255, 255, 255, 0.6) 35%, 
                       rgba(255, 255, 255, 0.6) 37%, 
                       transparent 42%, 
                       transparent 58%, 
                       rgba(255, 255, 255, 0.4) 63%, 
                       rgba(255, 255, 255, 0.4) 65%, 
                       transparent 70%, 
                       transparent 100%)
                   `
                 }} />
            
            {/* Subtle blue energy accent with tint */}
            <div className="absolute inset-0 opacity-15 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 70% 30%, rgba(100, 149, 237, 0.8) 0%, transparent 50%),
                     linear-gradient(90deg, transparent 0%, rgba(135, 206, 250, 0.3) 50%, transparent 100%)
                   `
                 }} />
          </>
        );

      case 'rare': // Emerald - subtle crystalline with good contrast
        return (
          <>
            {/* Toned down crystalline facets with better contrast */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                 style={{
                   background: `
                     conic-gradient(from 45deg at 50% 50%, 
                       rgba(80, 200, 120, 0.4) 0deg, 
                       rgba(34, 139, 34, 0.6) 30deg,
                       rgba(144, 238, 144, 0.3) 60deg, 
                       rgba(80, 200, 120, 0.5) 90deg,
                       rgba(34, 139, 34, 0.7) 120deg, 
                       rgba(50, 205, 50, 0.4) 150deg,
                       rgba(80, 200, 120, 0.3) 180deg, 
                       rgba(34, 139, 34, 0.5) 210deg,
                       rgba(144, 238, 144, 0.4) 240deg, 
                       rgba(80, 200, 120, 0.6) 270deg,
                       rgba(34, 139, 34, 0.4) 300deg, 
                       rgba(50, 205, 50, 0.3) 330deg,
                       rgba(80, 200, 120, 0.4) 360deg)
                   `
                 }} />
            
            {/* Subtle crystal sparkle points */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.7) 0%, rgba(144, 238, 144, 0.4) 12%, transparent 20%),
                     radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.6) 0%, rgba(50, 205, 50, 0.3) 15%, transparent 25%),
                     radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.5) 0%, rgba(80, 200, 120, 0.2) 10%, transparent 18%),
                     radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.4) 0%, rgba(144, 238, 144, 0.2) 8%, transparent 15%)
                   `
                 }} />
            
            {/* Darker areas for contrast */}
            <div className="absolute inset-0 opacity-25 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 40% 60%, rgba(34, 139, 34, 0.8) 0%, rgba(25, 100, 25, 0.6) 20%, transparent 35%),
                     radial-gradient(circle at 70% 30%, rgba(25, 100, 25, 0.7) 0%, transparent 30%),
                     linear-gradient(120deg, transparent 0%, rgba(34, 139, 34, 0.5) 2%, transparent 4%)
                   `
                 }} />
          </>
        );

      case 'legendary': // Gold - plasma-like energy flowing around edges
        return (
          <>
            {/* Plasma energy base */}
            <div className="absolute inset-0 opacity-40 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.4) 0%, rgba(255, 140, 0, 0.3) 50%, transparent 70%)
                   `
                 }} />
            {/* Flowing plasma edges */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  `conic-gradient(from 0deg at 50% 50%, 
                    rgba(255, 215, 0, 0.6) 0deg, 
                    rgba(255, 140, 0, 0.4) 90deg, 
                    rgba(255, 215, 0, 0.6) 180deg, 
                    rgba(255, 69, 0, 0.5) 270deg, 
                    rgba(255, 215, 0, 0.6) 360deg)`,
                  `conic-gradient(from 120deg at 50% 50%, 
                    rgba(255, 215, 0, 0.6) 0deg, 
                    rgba(255, 140, 0, 0.4) 90deg, 
                    rgba(255, 215, 0, 0.6) 180deg, 
                    rgba(255, 69, 0, 0.5) 270deg, 
                    rgba(255, 215, 0, 0.6) 360deg)`,
                  `conic-gradient(from 240deg at 50% 50%, 
                    rgba(255, 215, 0, 0.6) 0deg, 
                    rgba(255, 140, 0, 0.4) 90deg, 
                    rgba(255, 215, 0, 0.6) 180deg, 
                    rgba(255, 69, 0, 0.5) 270deg, 
                    rgba(255, 215, 0, 0.6) 360deg)`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ opacity: 0.3 }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`bg-black/95 border-2 ${compact ? 'p-3' : 'p-4'} relative transition-all duration-300 cursor-pointer group overflow-hidden backdrop-blur-sm`}
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
      whileHover={{ 
        scale: 1.05,
        y: -2,
        boxShadow: unlocked 
          ? `0 0 30px ${style.shadowColor}, 0 0 60px ${style.color}40, 4px 4px 0px 0px rgba(0,0,0,1)`
          : inProgress 
            ? `0 0 15px ${style.lockedColor}60, 4px 4px 0px 0px rgba(0,0,0,1)`
            : '0 0 8px rgba(75, 85, 99, 0.4), 4px 4px 0px 0px rgba(0,0,0,1)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Enhanced rarity-specific background effects */}
      {getRarityBackgroundEffects(achievement.tier, unlocked)}

      {/* Dark translucent overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

      {/* Fallback background overlay for non-enhanced tiers */}
      {!getRarityBackgroundEffects(achievement.tier, unlocked) && (
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
      )}

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
      
      <div className="relative z-20 text-center">
        {/* Badge Icon Circle - Pulse on hover for in-progress */}
        <div className={compact ? "mb-2 flex justify-center" : "mb-3 flex justify-center"}>
          <motion.div 
            className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full border-2 flex items-center justify-center relative overflow-hidden`}
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
                size={compact ? 16 : 20} 
                className="text-white filter drop-shadow-lg"
                style={{ 
                  color: '#ffffff',
                  filter: `drop-shadow(0 0 8px ${style.color})`
                }}
              />
            ) : inProgress ? (
              <IconComponent 
                size={compact ? 16 : 20} 
                className="filter drop-shadow-lg"
                style={{ 
                  color: style.lockedColor,
                  filter: `drop-shadow(0 0 6px ${style.lockedColor})`
                }}
              />
            ) : (
              <Lock size={compact ? 12 : 16} className="text-gray-500" />
            )}
          </motion.div>
        </div>

        {/* Badge Title */}
        <h4 className={`font-mono font-bold ${compact ? 'text-xs mb-1' : 'text-sm mb-2'} ${
          unlocked ? 'text-white' : inProgress ? 'text-gray-300' : 'text-gray-500'
        }`}>
          {achievement.name}
        </h4>
        
        {/* Badge Description */}
        <p className={`${compact ? 'text-xs mb-2' : 'text-xs mb-3'} font-mono ${
          unlocked ? 'text-gray-300' : inProgress ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {compact ? achievement.description.substring(0, 60) + (achievement.description.length > 60 ? '...' : '') : achievement.description}
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
              <IconComponent size={compact ? 8 : 10} />
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
                  width: `${Math.round(achievement.progressPercentage || 0)}%`,
                  background: `linear-gradient(to right, ${style.lockedColor}, ${style.color}60)`
                }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1">
              {Math.round(achievement.progressPercentage || 0)}% Complete  
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