import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Lock, Shield, CheckCircle, Target, BarChart, TrendingUp, Award, Grid, List, ChevronDown, Settings, X, Calendar } from 'lucide-react';
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
  const [showInProgressSection, setShowInProgressSection] = useState(false);
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

      console.log('🎯 Achievement data loaded (ACHIEVEMENTS TAB):', {
        stats,
        unlocked: backendAchievementService.getUnlockedAchievements().length,
        inProgress: backendAchievementService.getInProgressAchievements().length,
        unlockedAchievementIds: backendAchievementService.getUnlockedAchievements(),
        backendServiceStats: backendAchievementService.getStats()
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
          return getRarityOrder(b.tier) - getRarityOrder(a.tier); // Legendary first, common last
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

  const inProgressAchievements = useMemo(() => {
    const achievements = backendAchievementService.getInProgressAchievements() || [];
    return sortAchievements(achievements, 'rarity'); // Default sort by rarity
  }, [achievementStats, sortAchievements]);

  const filteredAchievements = useMemo(() => {
    const filtered = selectedTier === 'all' ? unlockedAchievements : unlockedAchievements.filter(a => a.tier === selectedTier);
    return sortAchievements(filtered, 'rarity'); // Default sort by rarity
  }, [unlockedAchievements, selectedTier, sortAchievements]);

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
        color: '#CD7F32', // Bronze
        bgColor: 'rgba(205, 127, 50, 0.15)',
        shadowColor: 'rgba(205, 127, 50, 0.6)',
        name: 'COMMON'
      },
      uncommon: {
        color: '#B8D4E3', // Silver with blue hint
        bgColor: 'rgba(184, 212, 227, 0.15)',
        shadowColor: 'rgba(184, 212, 227, 0.6)',
        name: 'UNCOMMON'
      },
      rare: {
        color: '#50C878', // Emerald
        bgColor: 'rgba(80, 200, 120, 0.15)',
        shadowColor: 'rgba(80, 200, 120, 0.6)',
        name: 'RARE'
      },
      legendary: {
        color: '#FFD700', // Gold
        bgColor: 'rgba(255, 215, 0, 0.15)',
        shadowColor: 'rgba(255, 215, 0, 0.6)',
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
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-start justify-center p-4"
        style={{ paddingTop: '15vh' }}
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
          className="bg-black border-2 p-8 relative overflow-hidden"
          style={{
            width: 'min(90vw, 600px)',
            height: 'auto',
            minHeight: '300px',
            maxHeight: '80vh',
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
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md">
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="font-mono text-3xl font-bold text-white mb-2">
              ACHIEVEMENT SHOWCASE
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Unlock achievements by completing logs, missions and using the focus timer.
            </p>
          </div>
          
          <motion.button
          onClick={() => setShowLockedAchievements(!showLockedAchievements)}
          className="bg-black border-2 border-white/60 px-4 py-2 font-mono font-bold transition-all duration-200 flex items-center gap-2 text-white hover:scale-105"
          style={{
            boxShadow: `2px 2px 0px 0px rgba(0,0,0,1)`
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
      </div>

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
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-6 rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/1 to-black/1 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <div className="border-b px-4 py-3 rounded-t-lg"
                     style={{ 
                       borderColor: 'white',
                       backgroundColor: 'rgba(0, 0, 0, 0.6)'
                     }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-mono font-bold text-white flex items-center">
                      <Award className="mr-2" size={20} color="white" />
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
                              case 'common': return '#CD7F32'; // Bronze
                              case 'uncommon': return '#B8D4E3'; // Silver with blue hint
                              case 'rare': return '#50C878'; // Emerald
                              case 'legendary': return '#FFD700'; // Gold
                              default: return '#FFFFFF'; // White for ALL button
                            }
                          };
                          
                          const getRarityLabel = (t) => {
                            switch(t) {
                              case 'common': return 'BRONZE';
                              case 'uncommon': return 'SILVER';
                              case 'rare': return 'EMERALD';
                              case 'legendary': return 'GOLD';
                              default: return 'ALL';
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
                                color: isActive ? (tier === 'all' ? '#000000' : '#000000') : getRarityColor(tier),
                                boxShadow: isActive ? `0 0 10px ${getRarityColor(tier)}40` : 'none'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {getRarityLabel(tier)}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {filteredAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            compact={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
                      <h3 className="font-mono text-lg font-bold text-white mb-2">
                        {selectedTier === 'all' ? 'NO ACHIEVEMENTS DETECTED' : `NO ${
                          selectedTier === 'common' ? 'BRONZE' :
                          selectedTier === 'uncommon' ? 'SILVER' :
                          selectedTier === 'rare' ? 'EMERALD' :
                          selectedTier === 'legendary' ? 'GOLD' : selectedTier.toUpperCase()
                        } ACHIEVEMENTS UNLOCKED`}
                      </h3>
                      <p className="text-gray-400 mb-4 font-mono">
                        {selectedTier === 'all' 
                          ? 'Create mission logs to unlock achievements!' 
                          : `Complete more activities to unlock ${
                            selectedTier === 'common' ? 'bronze' :
                            selectedTier === 'uncommon' ? 'silver' :
                            selectedTier === 'rare' ? 'emerald' :
                            selectedTier === 'legendary' ? 'gold' : selectedTier
                          } achievements!`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Progress Summary - Moved below user badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mb-6 rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <div className="border-b px-4 py-3 rounded-t-lg"
                     style={{ 
                       borderColor: 'white',
                       backgroundColor: 'rgba(0, 0, 0, 0.6)'
                     }}>
                  <h3 className="text-lg font-mono font-bold text-white flex items-center">
                    <Trophy className="mr-2" size={20} color="white" />
                    BADGE METRICS
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Badges Earned - No colors */}
                    <div className="border-2 border-white text-center p-4 relative transition-all duration-200 rounded-lg bg-black/60">
                      <div className="relative z-10">
                        <CheckCircle size={20} className="text-white mx-auto mb-2" />
                        <div className="text-xs font-mono text-gray-400 mb-1">BADGES EARNED</div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {unlockedAchievements.length}
                        </div>
                      </div>
                    </div>

                    {/* Badges In Progress - No colors */}
                    <div className="border-2 border-white text-center p-4 relative transition-all duration-200 rounded-lg bg-black/60">
                      <div className="relative z-10">
                        <Target size={20} className="text-white mx-auto mb-2" />
                        <div className="text-xs font-mono text-gray-400 mb-1">BADGES IN PROGRESS</div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {progressMetrics.inProgressCount}
                        </div>
                      </div>
                    </div>

                    {/* Badges Locked - No colors */}
                    <div className="border-2 border-white text-center p-4 relative transition-all duration-200 rounded-lg bg-black/60">
                      <div className="relative z-10">
                        <Lock size={20} className="text-white mx-auto mb-2" />
                        <div className="text-xs font-mono text-gray-400 mb-1">BADGES LOCKED</div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {progressMetrics.lockedCount}
                        </div>
                      </div>
                    </div>

                    {/* Completion Percentage - No colors */}
                    <div className="border-2 border-white text-center p-4 relative transition-all duration-200 rounded-lg bg-black/60">
                      <div className="relative z-10">
                        <Trophy size={20} className="text-white mx-auto mb-2" />
                        <div className="text-xs font-mono text-gray-400 mb-1">COMPLETION RATE</div>
                        <div className="text-2xl font-mono font-bold text-white">
                          {Math.round((unlockedAchievements.length / allAchievements.length) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badges in Progress Section - Collapsible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.15 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <div 
                  className="border-b px-4 py-3 rounded-t-lg cursor-pointer hover:bg-black/20 transition-colors"
                  style={{ 
                    borderColor: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                  }}
                  onClick={() => setShowInProgressSection(!showInProgressSection)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-mono font-bold text-white flex items-center">
                      <TrendingUp className="mr-2" size={20} color="white" />
                      BADGES IN PROGRESS ({progressMetrics.inProgressCount})
                    </h3>
                    <motion.div
                      animate={{ rotate: showInProgressSection ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showInProgressSection && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4">
                        {inProgressAchievements.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {inProgressAchievements.map((achievement, index) => (
                              <MemoizedAchievementBadge
                                key={achievement.id}
                                achievement={achievement}
                                isUnlocked={false}
                                showProgress={true}
                                onClick={() => setSelectedAchievement(achievement)}
                                compact={true}
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
                    </motion.div>
                  )}
                </AnimatePresence>
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
            className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg bg-black/40 backdrop-blur-md"
          >
            <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
            
            <div className="relative z-10">
              <div className="border-b px-4 py-3 flex justify-between items-center rounded-t-lg"
                   style={{ 
                     borderColor: 'white',
                     backgroundColor: 'rgba(0, 0, 0, 0.6)'
                   }}>
                <h3 className="text-lg font-mono font-bold text-white flex items-center">
                  <Lock className="mr-2" size={20} color="white" />
                  LOCKED ACHIEVEMENTS ({filteredLockedAchievements.length})
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-400">SORT BY:</span>
                  <select
                    value={lockedSortBy}
                    onChange={(e) => setLockedSortBy(e.target.value)}
                    className="bg-black border font-mono text-sm px-2 py-1 text-white border-white"
                  >
                    <option value="rarity">RARITY</option>
                    <option value="progress">PROGRESS</option>
                    <option value="name">NAME</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        compact={true}
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