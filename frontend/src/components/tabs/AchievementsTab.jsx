import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Lock, Shield, CheckCircle, Target, BarChart3, Award, Grid, List, ChevronDown, TrendingUp, Settings, X, Calendar } from 'lucide-react';
import { allAchievements, achievementsByTier, tierInfo } from '../../data/achievements';
import achievementService from '../../services/achievementService';
import AchievementBadge from '../ui/AchievementBadge';
import apiService from '../../services/api'; 
import backendAchievementService from '../../services/backendAchievementService';

const AchievementsTab = React.memo(({ username = 'user', tabColor = '#F59E0B' }) => {
  const [selectedTier, setSelectedTier] = useState('all');
  const [achievementStats, setAchievementStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [lockedSortBy, setLockedSortBy] = useState('rarity');
const [showLockedAchievements, setShowLockedAchievements] = useState(false); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievementData();
  }, [username]);

  const loadAchievementData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading achievement data for:', username);
      
      // Load from backend (skip the auto-trigger for now)
      await backendAchievementService.loadData(username);
      
      // Get stats from backend service
      const stats = backendAchievementService.getStats();
      setAchievementStats(stats);
      
      // Set user stats for progress calculations
      setUserStats({
        totalNotes: backendAchievementService.playerStats.totalNotes || 0,
        totalWords: backendAchievementService.playerStats.totalWords || 0,
        totalTasks: backendAchievementService.playerStats.completedAchievements || 0,
        totalSessions: backendAchievementService.playerStats.totalSessions || 0,
        totalFocusTime: backendAchievementService.playerStats.totalFocusTime || 0,
        totalXP: backendAchievementService.playerStats.totalXp || 0
      });

      console.log('🎯 Achievement data loaded:', {
        stats,
        unlocked: backendAchievementService.getUnlockedAchievements().length,
        inProgress: backendAchievementService.getInProgressAchievements().length
      });

    } catch (error) {
      console.error('Failed to load achievements:', error);
      // Fallback to local service
      const localStats = achievementService.getStats();
      setAchievementStats(localStats);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Add this useEffect after your existing useEffect:
  useEffect(() => {
    const handleAchievementsUpdated = () => {
      console.log('🎯 Achievement update detected, reloading...');
      loadAchievementData();
    };

    // Listen for achievement updates
    window.addEventListener('achievementsUpdated', handleAchievementsUpdated);

    return () => {
      window.removeEventListener('achievementsUpdated', handleAchievementsUpdated);
    };
  }, [loadAchievementData]);

  // Memoize expensive calculations
  const tabColorRgb = useMemo(() => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
        '245, 158, 11';
    };
    return hexToRgb(tabColor);
  }, [tabColor]);

  // Memoize sorting function
  const getRarityOrder = useCallback((tier) => {
    const order = { 'common': 1, 'uncommon': 2, 'rare': 3, 'legendary': 4 };
    return order[tier?.toLowerCase()] || 0;
  }, []);

  const sortAchievements = useCallback((achievements, sortBy) => {
    return [...achievements].sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          return getRarityOrder(a.tier) - getRarityOrder(b.tier);
        case 'progress':
          // Use backend progress data instead of local service
          const playerAchA = backendAchievementService.playerAchievements.find(pa => pa.achievementId === a.id);
          const playerAchB = backendAchievementService.playerAchievements.find(pa => pa.achievementId === b.id);
          const progressA = (playerAchA?.progress || 0) / 100;
          const progressB = (playerAchB?.progress || 0) / 100;
          return progressB - progressA;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [getRarityOrder]);

  // Memoize achievement arrays
  const unlockedAchievements = useMemo(() => 
    backendAchievementService.getUnlockedAchievements() || []
  , [achievementStats]);
  
  const lockedAchievements = useMemo(() => 
    backendAchievementService.getLockedAchievements() || []
  , [achievementStats]);

  const inProgressAchievements = useMemo(() => 
    backendAchievementService.getInProgressAchievements() || []
  , [achievementStats]);

  const filteredAchievements = useMemo(() => {
    if (selectedTier === 'all') return unlockedAchievements;
    return unlockedAchievements.filter(a => a.tier === selectedTier);
  }, [unlockedAchievements, selectedTier]);

  const filteredLockedAchievements = useMemo(() => {
    if (selectedTier === 'all') return lockedAchievements;
    return lockedAchievements.filter(a => a.tier === selectedTier);
  }, [lockedAchievements, selectedTier]);

  // Memoize progress metrics
  const progressMetrics = useMemo(() => ({
    inProgressCount: inProgressAchievements.length,
    lockedCount: lockedAchievements.length - inProgressAchievements.length
  }), [inProgressAchievements.length, lockedAchievements.length]);

  // Memoize click handler
  const handleBadgeClick = useCallback((achievement, event) => {
    setSelectedAchievement(achievement); // Remove clickPosition
  }, []);

  // Performance-optimized Achievement Modal Component
  const AchievementModal = React.memo(({ achievement, onClose }) => {
    // Move all hooks BEFORE any conditional returns
    const rarityStyles = useMemo(() => ({
      common: {
        color: '#06B6D4',
        bgColor: 'rgba(6, 182, 212, 0.15)',
        shadowColor: 'rgba(6, 182, 212, 0.6)',
        name: 'COMMON'
      },
      uncommon: {
        color: '#EC4899',
        bgColor: 'rgba(236, 72, 153, 0.15)',
        shadowColor: 'rgba(236, 72, 153, 0.6)',
        name: 'UNCOMMON'
      },
      rare: {
        color: '#8B5CF6',
        bgColor: 'rgba(139, 92, 246, 0.15)',
        shadowColor: 'rgba(139, 92, 246, 0.6)',
        name: 'RARE'
      },
      legendary: {
        color: '#FFCB2E',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        shadowColor: 'rgba(245, 158, 11, 0.6)',
        name: 'LEGENDARY'
      }
    }), []);

    const rarityIcons = useMemo(() => ({
      common: Star,
      uncommon: Award,
      rare: Shield,
      legendary: Crown
    }), []);

    const formatUnlockDate = useCallback(() => {
      if (achievement?.unlockedAt) {
        const date = new Date(achievement.unlockedAt);
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return 'Achievement Date Unknown';
    }, [achievement?.unlockedAt]);

    // NOW we can do the early return after all hooks are called
    if (!achievement) return null;

    const style = rarityStyles[achievement.tier?.toLowerCase()] || rarityStyles.common;
    const IconComponent = rarityIcons[achievement.tier?.toLowerCase()] || Trophy;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center p-4"
        style={{
          alignItems: 'flex-start',
          paddingTop: '65vh' //centers it in the badge section area
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "tween",
            duration: 0.2
          }}
          className="bg-black border-2 p-8 relative max-w-2xl w-full overflow-hidden"
          style={{
            width: '600px',
            height: 'auto',
            minHeight: '300px',
            borderColor: style.color,
            boxShadow: `0 0 40px ${style.shadowColor}, 0 0 80px ${style.color}30, 2px 2px 0px 0px rgba(0,0,0,1)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Static overlay effects - no pulse */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ 
              background: `linear-gradient(135deg, ${style.color}40, ${style.color}20, ${style.color}60)` 
            }} 
          />

          {/* Initial shimmer effect - only on load */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              delay: 0.2
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${style.color}40, transparent)`,
              width: '100%'
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

          {/* Modal Content */}
          <div className="relative z-10 flex items-center h-full">
            {/* Left side - Large Icon Circle - no pulse */}
            <div className="flex-shrink-0 mr-8">
              <div 
                className="w-24 h-24 rounded-full border-4 flex items-center justify-center relative overflow-hidden"
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
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 min-w-0">
              <h2 className="font-mono font-bold text-3xl text-white mb-3 leading-tight">
                {achievement.name}
              </h2>

              <p className="text-gray-300 font-mono text-lg mb-4 leading-relaxed">
                {achievement.description}
              </p>

              {/* Bottom Row - Rarity Badge and Unlock Date */}
              <div className="flex items-center justify-between gap-6">
                <div 
                  className="px-4 py-2 text-base font-mono font-bold border-2 flex items-center gap-2"
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
                      {formatUnlockDate().split(',')[0]}
                    </div>
                  </div>
                </div>
              </div>

              {achievement.xpReward && (
                <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm mt-4">
                  <Star size={16} />
                  <span>+{achievement.xpReward} XP EARNED</span>
                  <Star size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Celebration Banner */}
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

          {/* Special effects for legendary - no pulse */}
          {achievement.tier === 'legendary' && (
            <div className="absolute top-6 left-6 text-yellow-400 text-2xl">⭐</div>
          )}
        </motion.div>
      </motion.div>
    );
  });

  // Memoized Achievement Badge Component
  const MemoizedAchievementBadge = React.memo(AchievementBadge);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="font-mono text-white">Loading achievements...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div 
              className="w-6 h-6 border border-gray-600" 
              style={{ backgroundColor: tabColor }}
            />
            ACHIEVEMENT SHOWCASE
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            View your badges and unlock achievements by completing logs and missions.
          </p>
        </div>
        
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
          {showLockedAchievements ? 'SHOW MY BADGES' : 'VIEW LOCKED BADGES'} 
          <motion.div
            animate={{ rotate: showLockedAchievements ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Progress Summary - Simplified animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 pointer-events-none" 
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
              {/* Badges Earned */}
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

              {/* Badges In Progress */}
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
                    {progressMetrics.inProgressCount}
                  </div>
                </div>
              </div>

              {/* Badges Locked */}
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
                    {progressMetrics.lockedCount}
                  </div>
                </div>
              </div>

              {/* Completion Percentage */}
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(251, 191, 36, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.12))' }} />
                <div className="relative z-10">
                  <Trophy size={20} className="text-yellow-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">COMPLETION RATE</div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">
                    {Math.round((unlockedAchievements.length / allAchievements.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievement Sections */}
      <AnimatePresence mode="wait">
        {!showLockedAchievements ? (
          <motion.div key="main-achievements">
            {/* User's Badges Section */}
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
              <div className="absolute inset-0 border-2 opacity-30 pointer-events-none" 
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
                      {/*{username.toUpperCase()}'S BADGES*/}
                      JROC_182's BADGES
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
                  {filteredAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredAchievements.map((achievement, index) => (
                        <div 
                          key={achievement.id}
                          onClick={(e) => handleBadgeClick(achievement, e)}
                          className="cursor-pointer"
                        >
                          <MemoizedAchievementBadge
                            achievement={achievement}
                            isUnlocked={true}
                            onClick={() => {}}
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

            {/* Badges in Progress Section */}
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
              <div className="absolute inset-0 border-2 opacity-30 pointer-events-none" 
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
                    BADGES IN PROGRESS ({progressMetrics.inProgressCount})
                  </h3>
                </div>
                
                <div className="p-6">
                  {inProgressAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {inProgressAchievements.map((achievement, index) => (
                        <MemoizedAchievementBadge
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
          /* Locked Achievements View */
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
            <div className="absolute inset-0 border-2 opacity-30 pointer-events-none" 
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
                  LOCKED ACHIEVEMENTS ({filteredLockedAchievements.length})
                </h3>
                
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
                  {sortAchievements(filteredLockedAchievements, lockedSortBy).map((achievement, index) => {
                    // Get progress from backend instead of local service
                    const playerAchievement = backendAchievementService.playerAchievements.find(
                      pa => pa.achievementId === achievement.id
                    );
                    const progress = playerAchievement ? playerAchievement.progress : 0;
                    
                    return (
                      <MemoizedAchievementBadge
                        key={achievement.id}
                        achievement={{ ...achievement, progress }}
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
{selectedAchievement && backendAchievementService.isUnlocked(selectedAchievement.id) && (
          <AchievementModal 
            achievement={selectedAchievement} 
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
{/* 
      CLEAN debug section
      <div className="mb-4 p-4 bg-gray-900 border border-gray-600">
        <h3 className="text-gray-300 font-mono font-bold mb-2">🔍 DEBUG STATUS:</h3>
        <div className="text-gray-400 font-mono text-sm space-y-1">
          <div>Backend loaded: {backendAchievementService.loaded ? 'YES' : 'NO'}</div>
          <div>Total achievements: {backendAchievementService.allAchievements.length}</div>
          <div>Player achievements: {backendAchievementService.playerAchievements.length}</div>
          <div>Unlocked: {backendAchievementService.getUnlockedAchievements().length}</div>
          <div>In progress: {backendAchievementService.getInProgressAchievements().length}</div>
          <div>Locked: {backendAchievementService.getLockedAchievements().length}</div>
        </div>
        
        <button
          onClick={() => {
            console.log('🔍 Sample player achievement:', backendAchievementService.playerAchievements[0]);
            console.log('🔍 First 3 achievements:', backendAchievementService.allAchievements.slice(0, 3));
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 font-mono text-sm mt-2"
        >
          LOG SAMPLE DATA
        </button>
      </div> */}
    </div>
  );
});

export default AchievementsTab;