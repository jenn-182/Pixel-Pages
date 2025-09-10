import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield, Crown, Lock, Trophy } from 'lucide-react';
import { tierInfo } from '../../data/achievements';

const AchievementBadge = ({ achievement, size = 'medium', isUnlocked = false, onClick, showProgress = false }) => {
  const unlocked = isUnlocked || achievement.unlockedAt;
  
  // Updated color scheme: cyan, pink, purple, gold
  const getRarityStyle = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'common':
        return {
          color: '#06B6D4', // Cyan
          bgColor: 'rgba(6, 182, 212, 0.15)',
          shadowColor: 'rgba(6, 182, 212, 0.6)',
          name: 'COMMON'
        };
      case 'uncommon':
        return {
          color: '#EC4899', // Pink
          bgColor: 'rgba(236, 72, 153, 0.15)',
          shadowColor: 'rgba(236, 72, 153, 0.6)',
          name: 'UNCOMMON'
        };
      case 'rare':
        return {
          color: '#8B5CF6', // Purple
          bgColor: 'rgba(139, 92, 246, 0.15)',
          shadowColor: 'rgba(139, 92, 246, 0.6)',
          name: 'RARE'
        };
      case 'legendary':
        return {
          color: '#F59E0B', // Gold
          bgColor: 'rgba(245, 158, 11, 0.15)',
          shadowColor: 'rgba(245, 158, 11, 0.6)',
          name: 'LEGENDARY'
        };
      default:
        return {
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.15)',
          shadowColor: 'rgba(107, 114, 128, 0.6)',
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
      className="bg-black border-2 p-4 relative transition-all duration-300 hover:scale-105 cursor-pointer group"
      style={{
        borderColor: unlocked ? style.color : '#4B5563',
        boxShadow: unlocked 
          ? `0 0 20px ${style.shadowColor}, 0 0 40px ${style.color}30, 2px 2px 0px 0px rgba(0,0,0,1)`
          : '0 0 3px rgba(75, 85, 99, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shiny overlay for unlocked badges */}
      {unlocked && (
        <>
          {/* Main shiny background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 animate-pulse"
            style={{ 
              background: `linear-gradient(135deg, ${style.color}40, ${style.color}20, ${style.color}60)` 
            }} 
          />
          
          {/* Shimmer effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ 
              background: `linear-gradient(45deg, transparent 30%, ${style.color}20 50%, transparent 70%)`,
              animation: 'shimmer 2s infinite'
            }} 
          />
        </>
      )}
      
      <div className="relative z-10 text-center">
        {/* Badge Icon Circle */}
        <div className="mb-3 flex justify-center">
          <div 
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative overflow-hidden ${
              unlocked ? 'animate-pulse' : ''
            }`}
            style={{
              borderColor: unlocked ? style.color : '#6B7280',
              background: unlocked 
                ? `radial-gradient(circle, ${style.color}40, ${style.color}20)`
                : 'radial-gradient(circle, #37414940, #37414920)',
              boxShadow: unlocked 
                ? `0 0 25px ${style.shadowColor}, inset 0 0 15px ${style.color}30`
                : 'none'
            }}
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
            ) : (
              <Lock size={16} className="text-gray-500" />
            )}
            
            {/* Inner glow for completed badges */}
            {unlocked && (
              <div 
                className="absolute inset-0 rounded-full opacity-30 animate-ping"
                style={{ 
                  background: `radial-gradient(circle, ${style.shadowColor}, transparent 70%)`
                }}
              />
            )}
          </div>
        </div>

        {/* Badge Title */}
        <h4 className={`font-mono font-bold text-sm mb-2 ${
          unlocked ? 'text-white' : 'text-gray-500'
        }`}>
          {achievement.name}
        </h4>
        
        {/* Badge Description */}
        <p className={`text-xs font-mono mb-3 ${
          unlocked ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {achievement.description}
        </p>

        {/* Rarity Badge */}
        <div className="flex justify-center">
          <div 
            className={`px-2 py-1 text-xs font-mono font-bold border flex items-center gap-1 ${
              unlocked ? 'animate-pulse' : 'opacity-50'
            }`}
            style={{
              color: unlocked ? style.color : '#6B7280',
              borderColor: unlocked ? style.color : '#6B7280',
              backgroundColor: unlocked ? style.bgColor : 'transparent',
              boxShadow: unlocked ? `0 0 10px ${style.color}30` : 'none'
            }}
          >
            <IconComponent size={10} />
            {style.name}
          </div>
        </div>

        {/* Progress Bar for incomplete achievements */}
        {!unlocked && showProgress && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 h-1 border border-gray-600 rounded">
              <div 
                className="h-full rounded transition-all duration-500"
                style={{ 
                  width: `${achievement.progress || 0}%`,
                  background: `linear-gradient(to right, ${style.color}80, ${style.color})`
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
      {unlocked && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"
          style={{ 
            background: `radial-gradient(circle, ${style.shadowColor}, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
};

export default AchievementBadge;