import React from 'react';
import { motion } from 'framer-motion';

const AchievementCard = ({ achievement }) => {
  const getRarityStyle = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700' };
      case 'epic': return { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700' };
      case 'rare': return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700' };
      default: return { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-700' };
    }
  };

  const isCompleted = achievement.isCompleted;
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 1;
  const progressPercentage = achievement.progressPercentage || 0;
  const styles = getRarityStyle(achievement.achievement?.rarity || achievement.rarity);

  return (
    <motion.div
      className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 ${styles.bg} ${
        isCompleted ? 'opacity-100' : 'opacity-75'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-start gap-3">
        {/* Achievement Icon */}
        <div className={`border-2 ${styles.border} w-12 h-12 flex items-center justify-center bg-white`}>
          <span className="text-2xl">
            {achievement.achievement?.icon || achievement.icon || '🏆'}
          </span>
        </div>
        
        <div className="flex-1">
          {/* Title and Completion Status */}
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-mono font-bold text-sm">
              {achievement.achievement?.name || achievement.title}
            </h4>
            {isCompleted && <span className="text-green-600 text-xl">✓</span>}
          </div>
          
          {/* Description */}
          <p className="text-xs text-gray-600 mb-2">
            {achievement.achievement?.description || achievement.description}
          </p>
          
          {/* Rarity and Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono px-2 py-1 border ${styles.border} ${styles.text}`}>
              {(achievement.achievement?.rarity || achievement.rarity || 'COMMON').toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {progress}/{maxProgress}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="border-2 border-black bg-gray-200 h-3">
            <div 
              className={`h-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Unlock Date */}
          {achievement.unlockedAt && (
            <div className="text-xs text-gray-500 mt-1">
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;