import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Lock, Shield, CheckCircle, Target, BarChart3, Award, Grid, List, ChevronDown, TrendingUp, Settings, X, Calendar } from 'lucide-react';
import { allAchievements, achievementsByTier, tierInfo } from '../../data/achievements';
import achievementService from '../../services/achievementService';
import AchievementBadge from '../ui/AchievementBadge';

const AchievementsTab = ({ username = 'Jroc_182', tabColor = '#F59E0B' }) => {
  const [selectedTier, setSelectedTier] = useState('all');
  const [achievementStats, setAchievementStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [lockedSortBy, setLockedSortBy] = useState('rarity'); // 'rarity', 'progress', 'name'
  const [showLockedAchievements, setShowLockedAchievements] = useState(false); // Changed from showProgressSection

  useEffect(() => {
    loadAchievementData();
  }, []);

  const loadAchievementData = () => {
    const stats = achievementService.getStats();
    setAchievementStats(stats);
    
    // Load comprehensive user stats
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    
    const calculatedStats = {
      totalNotes: notes.length,
      totalWords: notes.reduce((sum, note) => sum + (note.content?.split(' ').length || 0), 0),
      uniqueTags: new Set(notes.flatMap(note => note.tags || [])).size,
      totalTasks: tasks.filter(t => t.completed).length,
      tasksCreated: tasks.length,
      totalSessions: sessions.length,
      totalFocusTime: sessions.reduce((sum, s) => sum + s.timeSpent, 0),
      level: Math.floor(stats.totalXP / 1000) + 1,
      totalXP: stats.totalXP
    };
    
    setUserStats(calculatedStats);
  };

  // Sorting functions
  const getRarityOrder = (tier) => {
    const order = { 'common': 1, 'uncommon': 2, 'rare': 3, 'legendary': 4 };
    return order[tier?.toLowerCase()] || 0;
  };

  const sortAchievements = (achievements, sortBy) => {
    return [...achievements].sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          return getRarityOrder(a.tier) - getRarityOrder(b.tier);
        case 'progress':
          const progressA = achievementService.getAchievementProgress(a.id, userStats);
          const progressB = achievementService.getAchievementProgress(b.id, userStats);
          return progressB - progressA; // Highest progress first
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  // Get sorted achievements
  const unlockedAchievements = sortAchievements(
    allAchievements.filter(a => achievementService.isUnlocked(a.id)), 
    'rarity'
  );
  
  const lockedAchievements = sortAchievements(
    allAchievements.filter(a => !achievementService.isUnlocked(a.id)), 
    lockedSortBy
  );

  // Get in-progress achievements
  const inProgressAchievements = lockedAchievements.filter(a => {
    const progress = achievementService.getAchievementProgress(a.id, userStats);
    return progress > 0 && progress < 1;
  }).map(a => ({
    ...a,
    progress: Math.round(achievementService.getAchievementProgress(a.id, userStats) * 100)
  }));

  const getFilteredAchievements = (achievements) => {
    if (selectedTier === 'all') return achievements;
    return achievements.filter(a => a.tier === selectedTier);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '245, 158, 11';
  };

  const tabColorRgb = hexToRgb(tabColor);

  // Calculate progress metrics
  const inProgressCount = inProgressAchievements.length;
  const lockedCount = lockedAchievements.length - inProgressCount;

  // Achievement Modal Component - Large Wide Badge Version
  const AchievementModal = ({ achievement, onClose, clickPosition }) => {
    if (!achievement) return null;

    // Get rarity style for the modal
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

    // Format the unlock date
    const formatUnlockDate = () => {
      if (achievement.unlockedAt) {
        const date = new Date(achievement.unlockedAt);
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return 'Achievement Date Unknown';
    };

    // Calculate modal position - Always dead center of screen
    const getModalPosition = () => {
      return { 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)' 
      };
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center p-4"
        style={{
          alignItems: 'flex-start',
          paddingTop: clickPosition ? `${clickPosition.y - 150}px` : '50vh'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 400,
            duration: 0.3
          }}
          className="bg-black border-2 p-8 relative max-w-2xl w-full"
          style={{
            width: '600px',
            height: 'auto',
            minHeight: '300px',
            borderColor: style.color,
            boxShadow: `0 0 40px ${style.shadowColor}, 0 0 80px ${style.color}30, 2px 2px 0px 0px rgba(0,0,0,1)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shiny overlay effects - Same as badge */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 animate-pulse"
            style={{ 
              background: `linear-gradient(135deg, ${style.color}40, ${style.color}20, ${style.color}60)` 
            }} 
          />
          
          <div 
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ 
              background: `linear-gradient(45deg, transparent 30%, ${style.color}20 50%, transparent 70%)`,
              animation: 'shimmer 2s infinite'
            }} 
          />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>

          {/* Wide Horizontal Layout - Like Achievement Badge */}
          <div className="relative z-10 flex items-center h-full">
            {/* Left side - Large Icon Circle */}
            <div className="flex-shrink-0 mr-8">
              <div 
                className="w-24 h-24 rounded-full border-4 flex items-center justify-center relative overflow-hidden animate-pulse"
                style={{
                  borderColor: style.color,
                  background: `radial-gradient(circle, ${style.color}40, ${style.color}20)`,
                  boxShadow: `0 0 40px ${style.shadowColor}, inset 0 0 25px ${style.color}30`
                }}
              >
                <IconComponent 
                  size={40} 
                  className="text-white filter drop-shadow-lg"
                  style={{ 
                    color: '#ffffff',
                    filter: `drop-shadow(0 0 12px ${style.color})`
                  }}
                />
                
                {/* Inner glow for completed badges */}
                <div 
                  className="absolute inset-0 rounded-full opacity-40 animate-ping"
                  style={{ 
                    background: `radial-gradient(circle, ${style.shadowColor}, transparent 70%)`
                  }}
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 min-w-0">
              {/* Achievement Title */}
              <h2 className="font-mono font-bold text-3xl text-white mb-3 leading-tight">
                {achievement.name}
              </h2>

              {/* Achievement Description */}
              <p className="text-gray-300 font-mono text-lg mb-4 leading-relaxed">
                {achievement.description}
              </p>

              {/* Bottom Row - Rarity Badge and Unlock Date */}
              <div className="flex items-center justify-between gap-6">
                {/* Rarity Badge */}
                <div 
                  className="px-4 py-2 text-base font-mono font-bold border-2 flex items-center gap-2 animate-pulse"
                  style={{
                    color: style.color,
                    borderColor: style.color,
                    backgroundColor: style.bgColor,
                    boxShadow: `0 0 15px ${style.color}40`
                  }}
                >
                  <IconComponent size={16} />
                  {style.name}
                </div>

                {/* Unlock Date */}
                <div 
                  className="bg-gray-900 border-2 px-4 py-2 flex items-center gap-3"
                  style={{
                    borderColor: style.color,
                    boxShadow: `0 0 15px ${style.color}30`
                  }}
                >
                  <Calendar size={18} style={{ color: style.color }} />
                  <div>
                    <div className="font-mono font-bold text-white text-xs">DATE:</div>
                    <div className="font-mono text-sm" style={{ color: style.color }}>
                      {formatUnlockDate().split(',')[0]} {/* Just the day and date */}
                    </div>
                  </div>
                </div>
              </div>

              {/* XP Reward (if available) */}
              {achievement.xpReward && (
                <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm mt-4">
                  <Star size={16} />
                  <span>+{achievement.xpReward} XP EARNED</span>
                  <Star size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Celebration Banner at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-8 right-8 text-center"
          >
            <div className="font-mono text-sm text-gray-400">
              You've mastered this milestone. Keep going, {username}!
            </div>
          </motion.div>

          {/* Special effects for legendary */}
          {achievement.tier === 'legendary' && (
            <>
              <motion.div
                className="absolute top-6 left-6 text-yellow-400 text-2xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute top-6 right-16 text-yellow-400 text-xl"
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 1
                }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute bottom-20 left-12 text-yellow-400 text-lg"
                animate={{ 
                  opacity: [0, 1, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  delay: 0.5
                }}
              >
                💫
              </motion.div>
            </>
          )}

          {/* Hover glow effect - Same as original badge */}
          <div 
            className="absolute inset-0 opacity-20 transition-opacity duration-300 rounded pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${style.shadowColor}, transparent 70%)`
            }}
          />
        </motion.div>
      </motion.div>
    );
  };

  // Update your badge click handler to capture vertical position:
  const handleBadgeClick = (achievement, event) => {
    const clickPosition = {
      x: event.clientX, // We don't use this anymore but keeping for compatibility
      y: event.clientY  // This is the vertical position we want
    };
    
    setSelectedAchievement({ ...achievement, clickPosition });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Locked Achievements Toggle */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div 
              className="w-6 h-6 border border-gray-600" 
              style={{ backgroundColor: tabColor }}
            />
            ACHIEVEMENT TERMINAL
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            View your badges and unlock achievements by completing logs and missions.
          </p>
        </div>
        
        {/* View Locked Achievements Toggle Button */}
        <motion.button
          onClick={() => setShowLockedAchievements(!showLockedAchievements)}
          className="bg-black border-2 px-4 py-2 font-mono font-bold transition-all duration-200 flex items-center gap-2"
          style={{
            borderColor: tabColor,
            color: showLockedAchievements ? '#000' : tabColor,
            backgroundColor: showLockedAchievements ? tabColor : 'black',
            boxShadow: `0 0 10px rgba(${tabColorRgb}, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Lock size={16} />
          {showLockedAchievements ? 'HIDE LOCKED' : 'VIEW LOCKED BADGES'}
          <motion.div
            animate={{ rotate: showLockedAchievements ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
        
        <div className="relative z-10">
          <div className="border-b px-4 py-3"
               style={{ 
                 borderColor: tabColor,
                 backgroundColor: '#1A0E26'
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <Trophy className="mr-2" size={20} style={{ color: tabColor }} />
              BADGE METRICS
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Completed */}
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.12))' }} />
                <div className="relative z-10">
                  <CheckCircle size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">BADGES EARNED</div>
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {unlockedAchievements.length}
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(59, 130, 246, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.12))' }} />
                <div className="relative z-10">
                  <Target size={20} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">BADGES IN PROGRESS</div>
                  <div className="text-2xl font-mono font-bold text-blue-400">
                    {inProgressCount}
                  </div>
                </div>
              </div>

              {/* Locked */}
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(107, 114, 128, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(107, 114, 128, 0.08), rgba(107, 114, 128, 0.12))' }} />
                <div className="relative z-10">
                  <Lock size={20} className="text-gray-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">BADGES LOCKED</div>
                  <div className="text-2xl font-mono font-bold text-gray-400">
                    {lockedCount}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(251, 191, 36, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.12))' }} />
                <div className="relative z-10">
                  <Trophy size={20} className="text-yellow-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">BADGES TOTAL</div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">
                    {allAchievements.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conditional Rendering: Main Achievement View OR Locked Achievements View */}
      <AnimatePresence mode="wait">
        {!showLockedAchievements ? (
          <motion.div key="main-achievements">
            {/* Achievement Badges Section with Rarity Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.05 }}
              className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-6"
              style={{
                borderColor: tabColor,
                boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
                   style={{ borderColor: tabColor }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
              
              <div className="relative z-10">
                <div className="border-b px-4 py-3"
                     style={{ 
                       borderColor: tabColor,
                       backgroundColor: '#1A0E26'
                     }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-mono font-bold text-white flex items-center">
                      <Award className="mr-2" size={20} style={{ color: tabColor }} />
                      {username.toUpperCase()}'S BADGES
                    </h3>
                    
                    {/* Rarity Filter Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-400">FILTER BY RARITY:</span>
                      <div className="flex gap-1">
                        {['all', 'common', 'uncommon', 'rare', 'legendary'].map((tier) => {
                          const isActive = selectedTier === tier;
                          const getRarityColor = (t) => {
                            switch(t) {
                              case 'common': return '#06B6D4';
                              case 'uncommon': return '#EC4899';
                              case 'rare': return '#8B5CF6';
                              case 'legendary': return '#F59E0B';
                              default: return tabColor;
                            }
                          };
                          
                          return (
                            <motion.button
                              key={tier}
                              onClick={() => setSelectedTier(tier)}
                              className="px-3 py-1 text-xs font-mono font-bold border transition-all duration-200"
                              style={{
                                borderColor: isActive ? getRarityColor(tier) : '#4B5563',
                                backgroundColor: isActive ? getRarityColor(tier) : 'transparent',
                                color: isActive ? '#000' : getRarityColor(tier),
                                boxShadow: isActive ? `0 0 10px ${getRarityColor(tier)}40` : 'none'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {tier.toUpperCase()}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {getFilteredAchievements(unlockedAchievements).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {getFilteredAchievements(unlockedAchievements).map((achievement, index) => (
                        <div 
                          key={achievement.id}
                          onClick={(e) => handleBadgeClick(achievement, e)}
                          className="cursor-pointer"
                        >
                          <AchievementBadge
                            achievement={achievement}
                            isUnlocked={true}
                            onClick={() => {}} // Empty since we handle click on wrapper
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
                      <h3 className="font-mono text-lg font-bold text-white mb-2">
                        {selectedTier === 'all' ? 'NO ACHIEVEMENTS DETECTED' : `NO ${selectedTier.toUpperCase()} ACHIEVEMENTS UNLOCKED`}
                      </h3>
                      <p className="text-gray-400 mb-4 font-mono">
                        {selectedTier === 'all' 
                          ? 'Create mission logs to unlock achievements!' 
                          : `Complete more activities to unlock ${selectedTier} achievements!`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Achievements in Progress Section - Always visible on main view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
              style={{
                borderColor: tabColor,
                boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
                   style={{ borderColor: tabColor }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
              
              <div className="relative z-10">
                <div className="border-b px-4 py-3"
                     style={{ 
                       borderColor: tabColor,
                       backgroundColor: '#1A0E26'
                     }}>
                  <h3 className="text-lg font-mono font-bold text-white flex items-center">
                    <TrendingUp className="mr-2" size={20} style={{ color: tabColor }} />
                    BADGES IN PROGRESS ({inProgressCount})
                  </h3>
                </div>
                
                <div className="p-6">
                  {inProgressAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {inProgressAchievements.map((achievement, index) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          isUnlocked={false}
                          showProgress={true}
                          onClick={() => setSelectedAchievement(achievement)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target size={48} className="text-gray-500 mx-auto mb-3" />
                      <h3 className="font-mono text-lg font-bold text-white mb-2">NO ACHIEVEMENTS IN PROGRESS</h3>
                      <p className="text-gray-400 mb-4 font-mono">Complete more activities to start making progress!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Locked Achievements View - Only shows when button is clicked */
          <motion.div
            key="locked-achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.05 }}
            className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
            style={{
              borderColor: tabColor,
              boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
            }}
          >
            <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
                 style={{ borderColor: tabColor }} />
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
            
            <div className="relative z-10">
              <div className="border-b px-4 py-3 flex justify-between items-center"
                   style={{ 
                     borderColor: tabColor,
                     backgroundColor: '#1A0E26'
                   }}>
                <h3 className="text-lg font-mono font-bold text-white flex items-center">
                  <Lock className="mr-2" size={20} style={{ color: tabColor }} />
                  LOCKED ACHIEVEMENTS ({getFilteredAchievements(lockedAchievements).length})
                </h3>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-400">SORT BY:</span>
                  <select
                    value={lockedSortBy}
                    onChange={(e) => setLockedSortBy(e.target.value)}
                    className="bg-black border font-mono text-sm px-2 py-1"
                    style={{
                      borderColor: tabColor,
                      color: tabColor
                    }}
                  >
                    <option value="rarity">RARITY</option>
                    <option value="progress">PROGRESS</option>
                    <option value="name">NAME</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getFilteredAchievements(lockedAchievements).map((achievement, index) => {
                    const progress = achievementService.getAchievementProgress(achievement.id, userStats);
                    return (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={{ ...achievement, progress: Math.round(progress * 100) }}
                        isUnlocked={false}
                        showProgress={progress > 0}
                        onClick={() => setSelectedAchievement(achievement)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Modal */}
      <AnimatePresence>
        {selectedAchievement && achievementService.isUnlocked(selectedAchievement.id) && (
          <AchievementModal 
            achievement={selectedAchievement} 
            onClose={() => setSelectedAchievement(null)}
            clickPosition={selectedAchievement.clickPosition}
          />
        )}
      </AnimatePresence>

      {/* Add the shimmer animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default AchievementsTab;