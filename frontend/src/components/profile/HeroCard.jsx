import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Trophy, X, ChevronDown, Palette, Award, Camera } from 'lucide-react';
import PixelPageJenn from '../../assets/icons/PixelPageJenn.PNG';
import TaskStats from './TaskStats';
import { getRankByXP, getNextRank } from '../../data/ranks';
import achievementService from '../../services/achievementService';
import { useTheme } from '../../contexts/ThemeContext';
import { allAchievements, tierInfo } from '../../data/achievements';
import { defaultProfilePics, getSelectedProfilePic, saveProfilePicSelection, getProfilePicById } from '../../data/profilePics';

const HeroCard = ({ player, notes = [], tasks = [], taskLists = [] }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);
  const [showProfilePicEditor, setShowProfilePicEditor] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState(() => {
    const saved = localStorage.getItem('selectedProfileBadges');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProfilePic, setSelectedProfilePic] = useState(() => getSelectedProfilePic());
  const { currentTheme, themes, switchTheme, getThemeColors } = useTheme();
  
  const themeColors = getThemeColors();

  // Badge management functions
  const getUnlockedAchievements = () => {
    return achievementService.getUnlockedAchievements();
  };

  const toggleBadgeSelection = (achievementId) => {
    setSelectedBadges(prev => {
      let newSelection;
      if (prev.includes(achievementId)) {
        // Remove badge
        newSelection = prev.filter(id => id !== achievementId);
      } else if (prev.length < 3) {
        // Add badge (max 3)
        newSelection = [...prev, achievementId];
      } else {
        // Replace oldest badge
        newSelection = [...prev.slice(1), achievementId];
      }
      localStorage.setItem('selectedProfileBadges', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  // Profile pic management
  const changeProfilePic = (picId) => {
    setSelectedProfilePic(picId);
    saveProfilePicSelection(picId);
    setShowProfilePicEditor(false);
  };

  const getCurrentProfilePicData = () => {
    return getProfilePicById(selectedProfilePic);
  };

  // Get highest skill from tracker data
  const getHighestSkill = () => {
    try {
      const categories = JSON.parse(localStorage.getItem('focusCategories') || '[]');
      if (categories.length === 0) return null;
      
      // Define skill professions based on level ranges
      const getProfessionForSkill = (skillName, level) => {
        const skillProfessions = {
          'Programming': {
            1: { name: 'Code Newbie', icon: '�' },
            3: { name: 'Junior Dev', icon: '⚡' },
            5: { name: 'Programmer', icon: '🖥️' },
            8: { name: 'Senior Dev', icon: '🚀' },
            10: { name: 'Tech Lead', icon: '👑' },
            15: { name: 'Code Wizard', icon: '🧙‍♂️' }
          },
          'Writing': {
            1: { name: 'Word Smith', icon: '✏️' },
            3: { name: 'Scribe', icon: '📝' },
            5: { name: 'Author', icon: '📚' },
            8: { name: 'Novelist', icon: '✍️' },
            10: { name: 'Wordmaster', icon: '👑' },
            15: { name: 'Literary Sage', icon: '🧙‍♂️' }
          },
          'Art': {
            1: { name: 'Doodler', icon: '🎨' },
            3: { name: 'Artist', icon: '🖌️' },
            5: { name: 'Creator', icon: '🎭' },
            8: { name: 'Master Artist', icon: '🏆' },
            10: { name: 'Art Director', icon: '👑' },
            15: { name: 'Visionary', icon: '🧙‍♂️' }
          },
          'Learning': {
            1: { name: 'Student', icon: '📖' },
            3: { name: 'Scholar', icon: '🎓' },
            5: { name: 'Researcher', icon: '🔬' },
            8: { name: 'Expert', icon: '🏆' },
            10: { name: 'Mentor', icon: '👑' },
            15: { name: 'Sage', icon: '🧙‍♂️' }
          },
          'Fitness': {
            1: { name: 'Trainee', icon: '💪' },
            3: { name: 'Athlete', icon: '🏃' },
            5: { name: 'Competitor', icon: '🏆' },
            8: { name: 'Champion', icon: '🥇' },
            10: { name: 'Legend', icon: '👑' },
            15: { name: 'Titan', icon: '🧙‍♂️' }
          },
          'Music': {
            1: { name: 'Listener', icon: '🎵' },
            3: { name: 'Player', icon: '🎸' },
            5: { name: 'Musician', icon: '🎼' },
            8: { name: 'Composer', icon: '🎹' },
            10: { name: 'Maestro', icon: '👑' },
            15: { name: 'Virtuoso', icon: '🧙‍♂️' }
          },
          'Business': {
            1: { name: 'Intern', icon: '💼' },
            3: { name: 'Professional', icon: '📊' },
            5: { name: 'Manager', icon: '👔' },
            8: { name: 'Executive', icon: '🏢' },
            10: { name: 'CEO', icon: '👑' },
            15: { name: 'Mogul', icon: '🧙‍♂️' }
          }
        };
        
        // Find the appropriate profession for the level
        const professions = skillProfessions[skillName] || skillProfessions['Learning'];
        const levelKeys = Object.keys(professions).map(Number).sort((a, b) => b - a);
        
        for (const levelThreshold of levelKeys) {
          if (level >= levelThreshold) {
            return professions[levelThreshold];
          }
        }
        
        return professions[1]; // Default to level 1 profession
      };
      
      // Calculate level for each skill (using new exponential system: 100 XP per level)
      const skillsWithLevels = categories.map(category => {
        // Use same exponential system as player level but scaled down
        let level = 1;
        let requiredXP = 0;
        let xpGap = 100; // Starting gap for level 2
        let currentXP = category.xp || 0;
        
        while (currentXP >= requiredXP + xpGap) {
          requiredXP += xpGap;
          level++;
          xpGap += 200; // Each skill level requires 200 more XP than previous gap
        }
        
        const profession = getProfessionForSkill(category.name, level);
        
        return {
          ...category,
          level,
          profession
        };
      });
      
      // Find the highest level skill
      const highestSkill = skillsWithLevels.reduce((highest, current) => 
        current.level > highest.level ? current : highest
      );
      
      return highestSkill.level > 1 ? highestSkill : null;
    } catch (error) {
      console.error('Error getting highest skill:', error);
      return null;
    }
  };

  // Calculate total XP from all sources
  const calculateTotalXP = () => {
    let totalXP = 0;
    let breakdown = { notes: 0, achievements: 0, focus: 0, missions: 0 };
    
    // 1. Achievement XP (from unlocked achievements)
    const achievementXP = achievementStats.totalXP || 0;
    totalXP += achievementXP;
    breakdown.achievements = achievementXP;
    
    // 2. Notes XP
    let notesXP = 0;
    for (const note of notes) {
      // Base XP per note
      notesXP += 10;
      
      // Bonus XP for content length
      const wordCount = note.content ? note.content.split(/\s+/).length : 0;
      notesXP += Math.min(Math.floor(wordCount / 10), 50);
      
      // Bonus XP for using tags
      const tags = note.tagsString ? note.tagsString.split(',').filter(tag => tag.trim()) : [];
      notesXP += tags.length * 5;
      
      // Bonus XP for longer titles
      if (note.title && note.title.length > 20) {
        notesXP += 5;
      }
    }
    totalXP += notesXP;
    breakdown.notes = notesXP;
    
    // 3. Focus Timer XP (from tracking sessions)
    let focusXP = 0;
    try {
      const categories = JSON.parse(localStorage.getItem('focusCategories') || '[]');
      focusXP = categories.reduce((sum, category) => sum + (category.xp || 0), 0);
      
      // Debug check for focus XP inflation
      if (focusXP > 200) {
        console.warn('🚨 FOCUS XP IS TOO HIGH!', focusXP, 'Categories:', categories);
        console.warn('⚠️ TEMPORARILY CAPPING FOCUS XP FROM', focusXP, 'TO 100');
        focusXP = 100; // Temporary cap until we can fix the focus timer XP system
      }
      
      totalXP += focusXP;
    } catch (error) {
      console.error('Error calculating focus XP:', error);
    }
    breakdown.focus = focusXP;
    
    // 4. Mission Completion XP (2 XP per completed task)
    const completedTasks = tasks.filter(task => task.completed);
    const missionXP = completedTasks.length * 2;
    totalXP += missionXP;
    breakdown.missions = missionXP;
    
    // DEBUGGING: Log detailed breakdown
    console.log('🐛 DETAILED XP BREAKDOWN:');
    console.log('Notes XP:', breakdown.notes, '(from', notes.length, 'notes)');
    console.log('Achievement XP:', breakdown.achievements, '(raw achievement stats:', achievementStats, ')');
    console.log('Focus XP:', breakdown.focus);
    console.log('Mission XP:', breakdown.missions, '(from', completedTasks.length, 'completed tasks)');
    console.log('TOTAL XP:', totalXP);
    
    // Check if achievement XP is still inflated (old data in localStorage)
    if (breakdown.achievements > 500) {
      console.error('🚨 ACHIEVEMENT XP IS STILL TOO HIGH!', achievementStats);
      console.warn('⚠️ TEMPORARILY CAPPING ACHIEVEMENT XP FROM', breakdown.achievements, 'TO 200');
      breakdown.achievements = 200;
      totalXP = breakdown.notes + 200 + breakdown.focus + breakdown.missions;
    }
    
    return totalXP;
  };

  // Calculate player stats
  const achievementStats = achievementService.getStats();
  const totalXP = calculateTotalXP();
  const currentRank = getRankByXP(totalXP);
  const nextRank = getNextRank(currentRank.level);

  // Debug: Log XP and rank info for balancing (remove after testing)
  if (totalXP > 0) {
    console.log(`🎮 XP System Status:
      Total XP: ${totalXP}
      Current Rank: Level ${currentRank.level} - ${currentRank.name}
      Notes: ${notes.length}, Tasks: ${tasks.filter(t => t.completed).length}, Achievement XP: ${achievementStats.totalXP || 0}`);
  }

  // XP progress calculation for current rank (aligned with ranks.js)
  const currentRankMinXP = currentRank.minXP;
  const nextRankMinXP = nextRank ? nextRank.minXP : currentRank.minXP + 1000;
  const xpInCurrentRank = totalXP - currentRankMinXP;
  const xpNeededForNextRank = nextRankMinXP - currentRankMinXP;
  
  // Calculate progress percentage with safety checks
  const progressPercentage = nextRank ? 
    Math.min(100, Math.max(0, Math.floor((xpInCurrentRank / xpNeededForNextRank) * 100))) :
    100; // If at max level, show 100%
    
  console.log('📊 PROGRESS BAR DEBUG:');
  console.log('Current Rank XP:', currentRankMinXP);
  console.log('Next Rank XP:', nextRankMinXP);
  console.log('XP in current rank:', xpInCurrentRank);
  console.log('XP needed for next rank:', xpNeededForNextRank);
  console.log('Progress percentage:', progressPercentage);

  // Mock player data if no player provided
  const mockPlayer = {
    username: "user",
    level: 1,
    experience: 0
  };

  const currentPlayer = player || mockPlayer;
  const highestSkill = getHighestSkill();

  return (
    <div className="space-y-6">
      {/* Main Profile Section - Updated with theme system */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 relative overflow-hidden"
        style={{
          backgroundColor: themeColors.backgroundColor,
          border: `2px solid ${themeColors.borderColor}`,
          borderRadius: themeColors.borderRadius,
          boxShadow: currentTheme === 'default' 
            ? `0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)` 
            : `0 0 3px ${themeColors.primary}50, 1px 1px 0px 0px rgba(0,0,0,1)`
        }}
      >
        {/* Gradient overlay with theme colors */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: currentTheme === 'default' 
                 ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
                 : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
               borderRadius: themeColors.borderRadius
             }} />
        
        {/* Profile Controls - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {/* Select Profile Badges Button */}
          {getUnlockedAchievements().length > 0 && (
            <button
              onClick={() => setShowBadgeSelector(true)}
              className="px-3 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-2"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: themeColors.borderRadius,
                color: themeColors.controlColor,
                boxShadow: currentTheme === 'default' 
                  ? '0 0 10px rgba(255, 255, 255, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)' 
                  : `0 0 6px ${themeColors.controlColor}50, 2px 2px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Award size={14} style={{ color: themeColors.controlColor }} />
                <span className="text-xs">BADGES</span>
              </div>
            </button>
          )}
          
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className="px-3 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-2"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: themeColors.borderRadius,
                color: themeColors.controlColor,
                boxShadow: currentTheme === 'default' 
                  ? '0 0 10px rgba(255, 255, 255, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)' 
                  : `0 0 6px ${themeColors.controlColor}50, 2px 2px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Palette size={14} style={{ color: themeColors.controlColor }} />
                <span className="text-xs">THEME</span>
                <ChevronDown 
                  size={12} 
                  className={`transition-transform duration-200 ${showStyleDropdown ? 'rotate-180' : ''}`} 
                  style={{ color: themeColors.controlColor }}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showStyleDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 min-w-[200px] z-30"
                  style={{
                    backgroundColor: themeColors.backgroundColor,
                    border: `2px solid ${themeColors.controlColor}`,
                    borderRadius: themeColors.borderRadius,
                    boxShadow: currentTheme === 'default' 
                      ? '0 0 20px rgba(255, 255, 255, 0.4), 4px 4px 0px 0px rgba(0,0,0,1)' 
                      : `0 0 15px ${themeColors.controlColor}50, 4px 4px 0px 0px rgba(0,0,0,1)`
                  }}
                >
                  <div className="p-3">
                    <div className="text-xs font-mono font-bold mb-2" style={{ color: themeColors.controlColor }}>
                      CHOOSE THEME:
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(themes).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => {
                            console.log(`Switching to theme: ${key}`); // Debug log
                            switchTheme(key);
                            setShowStyleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                            currentTheme === key 
                              ? 'bg-gray-800 border-opacity-100' 
                              : 'hover:bg-gray-800'
                          }`}
                          style={{
                            color: currentTheme === key ? theme.controlColor : '#9CA3AF',
                            border: `1px solid ${currentTheme === key ? theme.controlColor : '#4B5563'}`,
                            borderRadius: theme.borderRadius,
                            backgroundColor: currentTheme === key ? theme.backgroundColor : 'transparent'
                          }}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="relative z-10 flex items-start gap-8 lg:gap-12">
          {/* Avatar and Level Badge section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 border-2 flex items-center justify-center relative overflow-hidden bg-gray-700"
                   style={{
                     borderColor: themeColors.borderColor,
                     borderRadius: themeColors.borderRadius,
                     boxShadow: currentTheme === 'default' 
                       ? '0 0 15px rgba(255, 255, 255, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)' 
                       : `0 0 10px ${themeColors.secondary}30, 6px 6px 0px 0px rgba(0,0,0,1)`
                   }}>

                {/* Custom Pixel Profile Image */}
                <img 
                  src={PixelPageJenn}
                  alt="Pixel Profile Avatar"
                  className="w-full h-full object-cover relative z-10"
                  style={{ 
                    imageRendering: 'pixelated',
                    borderRadius: themeColors.borderRadius
                  }}
                />

                {/* Shimmer Overlay */}
                <div 
                  className="absolute inset-0 opacity-20 z-20 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      90deg,
                      transparent 0%,
                      transparent 40%,
                      rgba(255, 255, 255, 0.6) 45%,
                      rgba(255, 255, 255, 0.6) 50%,
                      rgba(255, 255, 255, 0.6) 55%,
                      transparent 60%,
                      transparent 100%
                    )`,
                    animation: 'shimmer-slide 5s ease-in-out infinite',
                    backgroundSize: '200% 100%',
                    borderRadius: themeColors.borderRadius
                  }}
                />
                
                {/* Level decorations overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  {/* Crown for high levels */}
                  {currentRank.level >= 8 && (
                    <Crown size={20} className="absolute -top-4 -right-3 text-yellow-400 drop-shadow-lg" />
                  )}
                  {/* Star effects for legendary levels */}
                  {currentRank.level >= 10 && (
                    <>
                      <Star size={16} className="absolute -top-2 -left-4 text-yellow-300 animate-pulse drop-shadow-lg" />
                      <Star size={14} className="absolute -bottom-2 -right-4 text-yellow-300 animate-pulse drop-shadow-lg" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                </div>
                
                {/* Level ring around avatar for high levels */}
                {currentRank.level >= 5 && (
                  <div className="absolute inset-0 border-2 opacity-60 animate-pulse z-40" 
                       style={{ 
                         borderColor: themeColors.secondary,
                         borderRadius: themeColors.borderRadius
                       }} />
                )}
              </div>
            </div>
            
            {/* Level Badge - Updated with cyan theme and white sparkles */}
            <div className="mt-4 relative">
              <div className="text-center px-4 py-2 relative overflow-hidden group"
                   style={{
                     background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)', // Cyan gradient
                     border: `2px solid #0891b2`,
                     borderRadius: themeColors.borderRadius,
                     boxShadow: '0 0 15px rgba(6, 182, 212, 0.5), 4px 4px 0px 0px rgba(0,0,0,1)'
                   }}>
                {/* Shiny sweep animation - cyan */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                {/* Additional cyan shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-cyan-300/30 animate-pulse" />
                <span className="font-mono font-bold text-lg relative z-10 text-white" style={{ 
                  textShadow: '0 0 10px rgba(6,182,212,0.8)' 
                }}>
                  LVL {currentRank.level}
                </span>
              </div>
              
              {/* Online Status Indicator */}
              <div className="mt-2 flex items-center justify-center gap-2 px-3 py-1"
                   style={{
                     backgroundColor: themeColors.backgroundColor,
                     border: `1px solid ${themeColors.borderColor}`,
                     borderRadius: themeColors.borderRadius,
                     boxShadow: currentTheme === 'default' 
                       ? '0 0 8px rgba(255, 255, 255, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' 
                       : '2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <button
                  onClick={() => setShowEasterEgg(true)}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse cursor-pointer hover:bg-green-300 transition-colors" 
                  style={{ 
                    boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)' 
                  }}
                  title=""
                />
                <span className="font-mono text-xs font-bold text-green-400">ONLINE</span>
              </div>
              
              {/* Profile Pic Edit Button - Moved here */}
              <div className="mt-2">
                <button
                  onClick={() => setShowProfilePicEditor(true)}
                  className="w-full px-3 py-1 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: themeColors.backgroundColor,
                    border: `1px solid ${themeColors.controlColor}`,
                    borderRadius: themeColors.borderRadius,
                    color: themeColors.controlColor,
                    boxShadow: currentTheme === 'default' 
                      ? '0 0 6px rgba(255, 255, 255, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' 
                      : `0 0 4px ${themeColors.controlColor}50, 1px 1px 0px 0px rgba(0,0,0,1)`
                  }}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <Camera size={12} style={{ color: themeColors.controlColor }} />
                    <span className="text-xs">EDIT PIC</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <h2 className="text-3xl lg:text-4xl font-bold font-mono text-white break-words">
                {currentPlayer.username}
              </h2>
            </div>
            
            {/* Mini Achievement Badges */}
            {selectedBadges.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-gray-400">FEATURED BADGES:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedBadges.map(badgeId => {
                    const achievement = allAchievements.find(a => a.id === badgeId);
                    if (!achievement) return null;
                    const tier = tierInfo[achievement.tier];
                    
                    return (
                      <div
                        key={badgeId}
                        className="bg-gray-900 border px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
                        style={{
                          borderColor: tier.color,
                          boxShadow: `0 0 6px ${tier.color}40, 2px 2px 0px 0px rgba(0,0,0,1)`
                        }}
                      >
                        <div className="absolute inset-0 pointer-events-none" 
                             style={{
                               background: `linear-gradient(to bottom right, ${tier.color}10, ${tier.color}15)`
                             }} />
                        <div className="relative z-10 flex items-center gap-1">
                          <span className="text-xs">{achievement.icon}</span>
                          <span className="font-mono text-xs font-bold" style={{ color: tier.color }}>
                            {achievement.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Player Title section - Enhanced with cyan theme and white sparkles */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <div className="px-5 py-3 relative overflow-hidden group"
                     style={{
                       background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)', // Cyan gradient
                       border: `4px solid #0891b2`,
                       borderRadius: themeColors.borderRadius,
                       boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  {/* Cyan striped background */}
                  <div 
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          45deg,
                          #06b6d4,
                          #06b6d4 2px,
                          transparent 2px,
                          transparent 4px
                        )
                      `,
                      borderRadius: themeColors.borderRadius
                    }}
                  />           
                  <p className="text-lg lg:text-xl font-mono font-bold relative z-10 text-white"
                     style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}>
                    {currentRank.icon} {currentRank.name}
                  </p>
                </div>
                
                {/* Enhanced corner decorations with white sparkles */}
                <div className="absolute -top-3 -left-3">
                  <div className="relative w-8 h-8">
                    <span className="absolute top-0 left-2 text-white text-xl animate-pulse font-bold">✦</span>
                    <span className="absolute top-2 left-5 text-white text-lg animate-pulse font-bold" 
                          style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-5 left-0 text-white text-lg animate-pulse font-bold" 
                          style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <div className="relative w-8 h-8">
                    <span className="absolute top-0 right-2 text-white text-xl animate-pulse font-bold">✦</span>
                    <span className="absolute top-2 right-5 text-white text-lg animate-pulse font-bold" 
                          style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-5 right-0 text-white text-lg animate-pulse font-bold" 
                          style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
              </div>
              
              {/* Highest Skill Badge - Positioned to the right of rank */}
              {highestSkill && (
                <div className="relative group">
                  <div className="px-3 py-2 relative overflow-hidden"
                       style={{
                         background: `linear-gradient(135deg, ${highestSkill.color}20, ${highestSkill.color}40, ${highestSkill.color}20)`,
                         border: `2px solid ${highestSkill.color}`,
                         borderRadius: themeColors.borderRadius,
                         boxShadow: `0 0 15px ${highestSkill.color}60, 4px 4px 0px 0px rgba(0,0,0,1)`
                       }}>
                    {/* Animated skill glow */}
                    <div className="absolute inset-0 opacity-30 animate-pulse" 
                         style={{
                           background: `radial-gradient(circle, ${highestSkill.color}40 0%, transparent 70%)`,
                           borderRadius: themeColors.borderRadius
                         }} />
                    {/* Skill particles effect */}
                    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: themeColors.borderRadius }}>
                      <div className="absolute top-1 left-2 w-1 h-1 rounded-full animate-bounce" 
                           style={{ backgroundColor: highestSkill.color, animationDelay: '0s' }} />
                      <div className="absolute top-3 right-3 w-1 h-1 rounded-full animate-bounce" 
                           style={{ backgroundColor: highestSkill.color, animationDelay: '0.5s' }} />
                      <div className="absolute bottom-2 left-4 w-1 h-1 rounded-full animate-bounce" 
                           style={{ backgroundColor: highestSkill.color, animationDelay: '1s' }} />
                    </div>
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-lg">{highestSkill.profession.icon}</span>
                      <span className="font-mono text-xs font-bold text-white" style={{ 
                        textShadow: `0 0 10px ${highestSkill.color}` 
                      }}>
                        {highestSkill.profession.name.toUpperCase()}
                      </span>
                      <div className="px-1 py-0.5 text-xs font-mono font-bold rounded"
                           style={{ 
                             backgroundColor: highestSkill.color,
                             color: 'black' 
                           }}>
                        L{highestSkill.level}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Elite badge for high-level players */}
              {currentRank.level >= 10 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono font-bold text-sm">
                  ELITE
                </div>
              )}
              
              {/* Legendary badge for max-level players */}
              {currentRank.level >= 15 && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono font-bold text-sm">
                  LEGENDARY
                </div>
              )}
            </div>

            {/* Enhanced XP Progress Bar with cyan/pink gradient */}
            <div className="space-y-3">
              <div className="relative">
                <div className="w-full h-10 relative overflow-hidden"
                     style={{
                       backgroundColor: 'rgba(0, 0, 0, 0.6)',
                       border: `2px solid ${themeColors.borderColor}`,
                       borderRadius: themeColors.borderRadius,
                       clipPath: currentTheme === 'pink' ? 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)' : 'none'
                     }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full relative"
                    style={{
                      background: 'linear-gradient(90deg, #06b6d4, #f472b6, #06b6d4)', // Always cyan to pink to cyan
                      borderRadius: themeColors.borderRadius
                    }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                         style={{ 
                           animation: 'pulse 2s ease-in-out infinite',
                           borderRadius: themeColors.borderRadius 
                         }} />
                    {/* Additional sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 -skew-x-12 animate-pulse" />
                    
                    {/* XP Particles */}
                    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: themeColors.borderRadius }}>
                      <div className="absolute top-1 left-1/4 w-1 h-1 bg-white rounded-full animate-bounce opacity-60" 
                           style={{ animationDelay: '0s' }} />
                      <div className="absolute top-2 left-3/4 w-0.5 h-0.5 bg-white rounded-full animate-bounce opacity-80" 
                           style={{ animationDelay: '1s' }} />
                      <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-40" 
                           style={{ animationDelay: '0.5s' }} />
                    </div>
                  </motion.div>
                  
                  {/* Corner decorations with theme colors */}
                  {currentTheme === 'pink' && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" 
                           style={{ borderColor: themeColors.borderColor }} />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" 
                           style={{ borderColor: themeColors.borderColor }} />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" 
                           style={{ borderColor: themeColors.borderColor }} />
                    </>
                  )}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono font-bold text-white"
                        style={{
                          textShadow: '2px 2px 0px rgba(0,0,0,0.8)'
                        }}>
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between text-sm gap-2">
                <span className="text-base font-mono" style={{ color: themeColors.borderColor }}>
                  <span className="mr-2 text-lg" style={{ color: themeColors.secondary }}>⚡</span>
                  Experience Points
                </span>
                <span className="text-base font-mono text-white px-3 py-1"
                      style={{
                        backgroundColor: themeColors.backgroundColor,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: themeColors.borderRadius
                      }}>
                  {Math.max(0, xpInCurrentRank)}/{xpNeededForNextRank} XP
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* LOG STATS Section - Updated with theme system */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 relative overflow-hidden"
        style={{
          backgroundColor: themeColors.backgroundColor,
          border: `2px solid ${themeColors.borderColor}`,
          borderRadius: themeColors.borderRadius,
          boxShadow: currentTheme === 'default' 
            ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
            : `0 0 3px ${themeColors.primary}30, 1px 1px 0px 0px rgba(0,0,0,1)`
        }}
      >
        {/* Gradient overlay with theme system */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: currentTheme === 'default' 
                 ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
                 : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
               borderRadius: themeColors.borderRadius
             }} />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <span className="mr-2 text-xl" style={{ color: themeColors.secondary }}>
              {currentTheme === 'pink' ? '♥' : '⚡'}
            </span>
            LOG STATS
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Notes */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">LOGS</div>
                <div className="text-2xl font-mono font-bold text-white">{notes.length}</div>
              </div>
            </div>

            {/* Total XP */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">TOTAL XP</div>
                <div className="text-2xl font-mono font-bold text-white">{totalXP.toLocaleString()}</div>
              </div>
            </div>

            {/* Total Words */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">WORDS</div>
                <div className="text-2xl font-mono font-bold text-white">
                  {notes.reduce((total, note) => {
                    const wordCount = note.content ? note.content.split(/\s+/).length : 0;
                    return total + wordCount;
                  }, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Days Active */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">STREAK</div>
                <div className="text-2xl font-mono font-bold text-white">7 days</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MISSION STATS Section - Updated with theme system */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 relative overflow-hidden"
        style={{
          backgroundColor: themeColors.backgroundColor,
          border: `2px solid ${themeColors.borderColor}`,
          borderRadius: themeColors.borderRadius,
          boxShadow: currentTheme === 'default' 
            ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
            : `0 0 3px ${themeColors.primary}30, 1px 1px 0px 0px rgba(0,0,0,1)`
        }}
      >
        {/* Gradient overlay with theme system */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: currentTheme === 'default' 
                 ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
                 : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
               borderRadius: themeColors.borderRadius
             }} />
        
        <div className="relative z-10">
          <TaskStats tasks={tasks} taskLists={taskLists} />
        </div>
      </motion.div>

      {/* ACHIEVEMENT STATS Section - Updated with theme system */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 relative overflow-hidden"
        style={{
          backgroundColor: themeColors.backgroundColor,
          border: `2px solid ${themeColors.borderColor}`,
          borderRadius: themeColors.borderRadius,
          boxShadow: currentTheme === 'default' 
            ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
            : `0 0 3px ${themeColors.primary}30, 1px 1px 0px 0px rgba(0,0,0,1)`
        }}
      >
        {/* Gradient overlay with theme system */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: currentTheme === 'default' 
                 ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
                 : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
               borderRadius: themeColors.borderRadius
             }} />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <span className="mr-2 text-xl" style={{ color: themeColors.secondary }}>
              {currentTheme === 'pink' ? '♥' : '⚡'}
            </span>
            ACHIEVEMENT STATS
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unlocked Achievements */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">UNLOCKED</div>
                <div className="text-2xl font-mono font-bold text-white">{achievementStats.unlocked || 0}</div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">COMPLETION</div>
                <div className="text-2xl font-mono font-bold text-white">{achievementStats.percentage || 0}%</div>
              </div>
            </div>

            {/* Rare Achievements */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">RARE</div>
                <div className="text-2xl font-mono font-bold text-white">{achievementStats.byTier?.rare || 0}</div>
              </div>
            </div>

            {/* Legendary Achievements */}
            <div className="p-4 relative overflow-hidden"
                 style={{
                   backgroundColor: themeColors.backgroundColor,
                   border: `1px solid ${themeColors.borderColor}`,
                   borderRadius: themeColors.borderRadius
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{
                     background: currentTheme === 'default' 
                       ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                       : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                     borderRadius: themeColors.borderRadius
                   }} />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">LEGENDARY</div>
                <div className="text-2xl font-mono font-bold text-white">{achievementStats.byTier?.legendary || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Easter Egg Modal - unchanged */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEasterEgg(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md mx-4 relative"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated border */}
              <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
              
              {/* Close button */}
              <button
                onClick={() => setShowEasterEgg(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content - unchanged */}
              <div className="text-center">
                <motion.div
                  className="mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy size={64} className="text-cyan-400 mx-auto" />
                </motion.div>

                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  EASTER EGG ACHIEVEMENTS
                </h2>
                
                <p className="text-cyan-400 font-mono text-sm mb-6">
                  You found the hidden easter egg level!
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900 border border-cyan-400 p-4 mb-6"
                >
                  <h3 className="text-xl font-mono font-bold text-cyan-400 mb-4">
                    COMING SOON
                  </h3>
                </motion.div>

                <div className="flex items-center justify-center gap-1">
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Badge Selector Modal */}
      <AnimatePresence>
        {showBadgeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowBadgeSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-6 max-w-2xl mx-4 relative max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: themeColors.borderRadius,
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
                     borderRadius: themeColors.borderRadius
                   }} />
              
              {/* Close button */}
              <button
                onClick={() => setShowBadgeSelector(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  SELECT PROFILE BADGES
                </h2>
                
                <p className="font-mono text-sm mb-6" style={{ color: themeColors.controlColor }}>
                  Choose up to 3 achievement badges to display on your profile ({selectedBadges.length}/3 selected)
                </p>

                <div className="space-y-4">
                  {Object.entries(tierInfo).map(([tierKey, tier]) => {
                    const tierAchievements = getUnlockedAchievements().filter(a => a.tier === tierKey);
                    if (tierAchievements.length === 0) return null;
                    
                    return (
                      <div key={tierKey}>
                        <h3 className="font-mono font-bold text-lg mb-3 flex items-center gap-2">
                          <span style={{ color: tier.color }}>{tier.emoji}</span>
                          <span style={{ color: tier.color }}>{tier.name}</span>
                          <span className="text-gray-400 text-sm">({tierAchievements.length})</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tierAchievements.map(achievement => (
                            <button
                              key={achievement.id}
                              onClick={() => toggleBadgeSelection(achievement.id)}
                              className={`p-3 transition-all duration-200 text-left ${
                                selectedBadges.includes(achievement.id)
                                  ? 'bg-gray-700 border-opacity-100'
                                  : 'hover:bg-gray-800'
                              }`}
                              style={{
                                backgroundColor: selectedBadges.includes(achievement.id) ? themeColors.backgroundColor : 'transparent',
                                border: `1px solid ${selectedBadges.includes(achievement.id) ? tier.color : '#4B5563'}`,
                                borderRadius: themeColors.borderRadius
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{achievement.icon}</span>
                                <div className="flex-1">
                                  <div className="font-mono font-bold text-white text-sm">
                                    {achievement.name}
                                  </div>
                                  <div className="font-mono text-xs text-gray-400">
                                    {achievement.description}
                                  </div>
                                </div>
                                {selectedBadges.includes(achievement.id) && (
                                  <Star size={16} style={{ color: tier.color }} />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {getUnlockedAchievements().length === 0 && (
                    <div className="text-center py-8">
                      <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
                      <div className="text-gray-400 font-mono text-lg font-bold mb-2">
                        NO ACHIEVEMENTS UNLOCKED
                      </div>
                      <div className="text-gray-500 font-mono text-sm">
                        Complete tasks and activities to unlock achievement badges!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Pic Editor Modal */}
      <AnimatePresence>
        {showProfilePicEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowProfilePicEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-6 max-w-xl mx-4 relative"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: themeColors.borderRadius,
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
                     borderRadius: themeColors.borderRadius
                   }} />
              
              {/* Close button */}
              <button
                onClick={() => setShowProfilePicEditor(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div>
                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  CHOOSE PROFILE PICTURE
                </h2>
                
                <p className="font-mono text-sm mb-6" style={{ color: themeColors.controlColor }}>
                  Select a pixel art avatar to represent your character
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {defaultProfilePics.map(pic => (
                    <button
                      key={pic.id}
                      onClick={() => changeProfilePic(pic.id)}
                      className={`p-4 transition-all duration-200 text-center ${
                        selectedProfilePic === pic.id
                          ? 'bg-gray-700 border-opacity-100'
                          : 'hover:bg-gray-800'
                      }`}
                      style={{
                        backgroundColor: selectedProfilePic === pic.id ? themeColors.backgroundColor : 'transparent',
                        border: `1px solid ${selectedProfilePic === pic.id ? themeColors.controlColor : '#4B5563'}`,
                        borderRadius: themeColors.borderRadius
                      }}
                    >
                      <div className="w-16 h-16 bg-gray-600 border border-gray-500 mx-auto mb-2 flex items-center justify-center"
                           style={{ borderRadius: themeColors.borderRadius }}>
                        {/* Placeholder for now - in a real implementation, this would show the actual image */}
                        <span className="text-2xl">🎮</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-white">
                        {pic.name}
                      </div>
                      <div className="font-mono text-xs text-gray-400">
                        {pic.description}
                      </div>
                      {selectedProfilePic === pic.id && (
                        <Star size={16} className="mx-auto mt-1" style={{ color: themeColors.controlColor }} />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4"
                     style={{
                       backgroundColor: themeColors.backgroundColor,
                       border: `1px solid ${themeColors.borderColor}`,
                       borderRadius: themeColors.borderRadius
                     }}>
                  <div className="font-mono text-xs text-gray-400 mb-2">PREVIEW:</div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 border border-gray-500 flex items-center justify-center"
                         style={{ borderRadius: themeColors.borderRadius }}>
                      <span className="text-lg">🎮</span>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">
                        {getCurrentProfilePicData().name}
                      </div>
                      <div className="font-mono text-xs text-gray-400">
                        {getCurrentProfilePicData().description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add this style block to your component */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer-slide {
          0% {
            background-position: -200% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCard;