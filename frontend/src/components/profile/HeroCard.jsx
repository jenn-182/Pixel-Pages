import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Trophy, X, ChevronDown, Palette, Camera, Code, Heart } from 'lucide-react';
import PixelPageJenn from '../../assets/icons/PixelPageJenn.PNG';
import { getRankByXP, getNextRank } from '../../data/ranks';
import { useTheme } from '../../contexts/ThemeContext';
import backendAchievementService from '../../services/backendAchievementService';
import { defaultProfilePics, getSelectedProfilePic, saveProfilePicSelection, getProfilePicById } from '../../data/profilePics';

const HeroCard = ({ player, notes = [], tasks = [], taskLists = [] }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showProfilePicEditor, setShowProfilePicEditor] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(() => getSelectedProfilePic());
  const { currentTheme, themes, switchTheme, getThemeColors } = useTheme();
  
  const themeColors = getThemeColors();

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

  // Get achievement stats first
  const achievementStats = backendAchievementService.getStats();

  // Calculate total XP from all sources
  const calculateTotalXP = () => {
    let totalXP = 0;
    
    // 1. Achievement XP
    const achievementXP = achievementStats.totalXP || 0;
    totalXP += achievementXP;
    
    // 2. Notes XP
    let notesXP = 0;
    for (const note of notes) {
      notesXP += 10; // Base XP per note
      const wordCount = note.content ? note.content.split(/\s+/).length : 0;
      notesXP += Math.min(Math.floor(wordCount / 10), 50);
      const tags = note.tagsString ? note.tagsString.split(',').filter(tag => tag.trim()) : [];
      notesXP += tags.length * 5;
      if (note.title && note.title.length > 20) {
        notesXP += 5;
      }
    }
    totalXP += notesXP;
    
    // 3. Focus Timer XP
    try {
      const categories = JSON.parse(localStorage.getItem('focusCategories') || '[]');
      let focusXP = categories.reduce((sum, category) => sum + (category.xp || 0), 0);
      // Remove the cap to allow proper leveling
      totalXP += focusXP;
    } catch (error) {
      console.error('Error calculating focus XP:', error);
    }
    
    // 4. Mission XP (Tasks)
    const completedTasks = tasks.filter(task => task.completed);
    totalXP += completedTasks.length * 50; // Increased from 2 to 50 for better progression
    
    // Add bonus XP for active users to ensure proper progression
    const bonusXP = Math.min(notes.length * 20 + completedTasks.length * 100, 1500); // Generous bonus for progression
    totalXP += bonusXP;
    
    // Debug logging
    console.log('🎯 XP Breakdown:', {
      achievementXP,
      notesXP,
      focusXP: JSON.parse(localStorage.getItem('focusCategories') || '[]').reduce((sum, category) => sum + (category.xp || 0), 0),
      taskXP: completedTasks.length * 50,
      bonusXP,
      totalXP,
      notes: notes.length,
      completedTasks: completedTasks.length,
      targetForLevel5: 2000
    });
    
    return totalXP;
  };

  // Calculate player stats
  const totalXP = calculateTotalXP();
  const currentRank = getRankByXP(totalXP);
  const nextRank = getNextRank(currentRank.level);

  // XP progress calculation for current rank (aligned with ranks.js)
  const currentRankMinXP = currentRank.minXP;
  const nextRankMinXP = nextRank ? nextRank.minXP : currentRank.minXP + 1000;
  const xpInCurrentRank = totalXP - currentRankMinXP;
  const xpNeededForNextRank = nextRankMinXP - currentRankMinXP;
  
  // Calculate progress percentage with safety checks
  const progressPercentage = nextRank ? 
    Math.min(100, Math.max(0, Math.floor((xpInCurrentRank / xpNeededForNextRank) * 100))) :
    100; // If at max level, show 100%

  // Debug: Log XP and rank info for balancing
  console.log(`🎮 DETAILED XP SYSTEM STATUS:
    === XP SOURCES ===
    Achievement XP: ${achievementStats.totalXP || 0}
    Notes XP: ${totalXP - (achievementStats.totalXP || 0) - JSON.parse(localStorage.getItem('focusCategories') || '[]').reduce((sum, category) => sum + (category.xp || 0), 0) - tasks.filter(t => t.completed).length * 50}
    Focus Timer XP: ${JSON.parse(localStorage.getItem('focusCategories') || '[]').reduce((sum, category) => sum + (category.xp || 0), 0)}
    Task XP: ${tasks.filter(t => t.completed).length * 50}
    
    === TOTALS ===
    Total XP: ${totalXP}
    Current Rank: Level ${currentRank.level} - ${currentRank.name} (requires ${currentRank.minXP} XP)
    Next Rank: ${nextRank ? `Level ${nextRank.level} - ${nextRank.name} (requires ${nextRank.minXP} XP)` : 'MAX RANK'}
    
    === PROGRESS ===
    XP needed for next rank: ${nextRank ? nextRank.minXP - totalXP : 0}
    Progress: ${progressPercentage}%
    
    === DATA COUNTS ===
    Notes: ${notes.length}
    Completed Tasks: ${tasks.filter(t => t.completed).length}
    Achievement Stats: ${JSON.stringify(achievementStats)}`);
    
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
        
        {/* Profile Controls - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className="px-3 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-2"
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
                    borderRadius: '12px', // Fixed - use consistent rounding for all themes
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
                            console.log(`Switching to theme: ${key}`);
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
                            borderRadius: '12px', // Fixed - use consistent rounding for all themes
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
                     borderRadius: '12px', // Fixed - use consistent rounding for all themes
                     boxShadow: currentTheme === 'default' 
                       ? '0 0 15px rgba(255, 255, 255, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)' 
                       : `0 0 10px ${themeColors.secondary}30, 6px 6px 0px 0px rgba(0,0,0,1)`
                   }}>

                {/* Custom Pixel Profile Image */}
                <img 
                  src={getProfilePicById(selectedProfilePic).imagePath}
                  alt="Pixel Profile Avatar"
                  className="w-full h-full object-cover relative z-10"
                  style={{ 
                    imageRendering: 'pixelated',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.src = PixelPageJenn;
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
                    borderRadius: '12px' // Fixed - use consistent rounding for all themes
                  }}
                />

                {/* Level ring around avatar for high levels */}
                {currentRank.level >= 5 && (
                  <div className="absolute inset-0 border-2 opacity-60 animate-pulse z-40" 
                       style={{ 
                         borderColor: themeColors.secondary,
                         borderRadius: '12px' // Fixed - use consistent rounding for all themes
                       }} />
                )}
              </div>
            </div>

            {/* Level Badge */}
            <div className="mt-4 relative">
              <div className="text-center px-4 py-2 relative overflow-hidden group"
                   style={{
                     background: currentTheme === 'pink' 
                       ? 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #c084fc 100%)'
                       : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)',
                     border: currentTheme === 'pink' 
                       ? `2px solid #a855f7` 
                       : `2px solid #0891b2`,
                     borderRadius: '12px', // Fixed - use consistent rounding for all themes
                     boxShadow: currentTheme === 'pink'
                       ? '0 0 15px rgba(168, 85, 247, 0.5), 4px 4px 0px 0px rgba(0,0,0,1)'
                       : '0 0 15px rgba(6, 182, 212, 0.5), 4px 4px 0px 0px rgba(0,0,0,1)'
                   }}>
                <span className="font-mono font-bold text-lg relative z-10 text-white" style={{ 
                  textShadow: currentTheme === 'pink'
                    ? '0 0 10px rgba(168, 85, 247, 0.8)'
                    : '0 0 10px rgba(6,182,212,0.8)' 
                }}>
                  LVL {currentRank.level}
                </span>
              </div>
              
              {/* Online Status Indicator */}
              <div className="mt-2 flex items-center justify-center gap-2 px-3 py-1"
                   style={{
                     backgroundColor: themeColors.backgroundColor,
                     border: `1px solid ${themeColors.borderColor}`,
                     borderRadius: '12px', // Fixed - use consistent rounding for all themes
                     boxShadow: currentTheme === 'default' 
                       ? '0 0 8px rgba(255, 255, 255, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' 
                       : `0 0 4px ${themeColors.primary}50, 2px 2px 0px 0px rgba(0,0,0,1)`
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
              
              {/* Profile Pic Edit Button */}
              <div className="mt-2">
                <button
                  onClick={() => setShowProfilePicEditor(true)}
                  className="w-full px-3 py-1 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: themeColors.backgroundColor,
                    border: `1px solid ${themeColors.controlColor}`,
                    borderRadius: '12px', // Fixed - use consistent rounding for all themes
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
            
            {/* Player Title section */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative">
                <div className="px-5 py-3 relative overflow-hidden group"
                     style={{
                       background: currentTheme === 'pink' 
                         ? 'linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #a855f7 100%)'
                         : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #06b6d4 100%)',
                       border: currentTheme === 'pink' 
                         ? `4px solid #d946ef` 
                         : `4px solid #0891b2`,
                       borderRadius: '12px', // Fixed - use consistent rounding for all themes
                       boxShadow: currentTheme === 'pink'
                         ? '0 0 20px rgba(217, 70, 239, 0.6), 6px 6px 0px 0px rgba(0,0,0,1)'
                         : '0 0 20px rgba(6, 182, 212, 0.6), 6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  {/* Theme-specific striped background */}
                  <div 
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: currentTheme === 'pink' 
                        ? `repeating-linear-gradient(45deg, #a855f7, #a855f7 2px, transparent 2px, transparent 4px)`
                        : `repeating-linear-gradient(45deg, #06b6d4, #06b6d4 2px, transparent 2px, transparent 4px)`,
                      borderRadius: '12px' // Fixed - use consistent rounding for all themes
                    }}
                  />

                  {/* Twinkling Stars/Hearts - Theme specific */}
                  <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                    {currentTheme === 'pink' ? (
                      // Pink theme - Twinkling Hearts (MOVED TO EDGES/CORNERS)
                      <>
                        <Heart 
                          size={16} 
                          className="absolute top-1 left-1 text-white animate-pulse opacity-90" 
                          style={{ 
                            animationDelay: '0s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                        <Heart 
                          size={14} 
                          className="absolute top-1 right-1 text-white animate-pulse opacity-85" 
                          style={{ 
                            animationDelay: '1s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                        <Heart 
                          size={15} 
                          className="absolute bottom-1 left-1 text-white animate-pulse opacity-80" 
                          style={{ 
                            animationDelay: '0.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                        <Heart 
                          size={12} 
                          className="absolute bottom-1 right-1 text-white animate-pulse opacity-95" 
                          style={{ 
                            animationDelay: '1.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                        <Heart 
                          size={10} 
                          className="absolute top-1/2 left-0 text-white animate-pulse opacity-75" 
                          style={{ 
                            animationDelay: '2s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                        <Heart 
                          size={8} 
                          className="absolute top-1/2 right-0 text-white animate-pulse opacity-70" 
                          style={{ 
                            animationDelay: '2.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(217, 70, 239, 0.8))'
                          }} 
                        />
                      </>
                    ) : (
                      // Default theme - Twinkling Stars (MOVED TO EDGES/CORNERS)
                      <>
                        <Star 
                          size={16} 
                          className="absolute top-1 left-1 text-white animate-pulse opacity-90" 
                          style={{ 
                            animationDelay: '0s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                        <Star 
                          size={14} 
                          className="absolute top-1 right-1 text-white animate-pulse opacity-85" 
                          style={{ 
                            animationDelay: '1s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                        <Star 
                          size={15} 
                          className="absolute bottom-1 left-1 text-white animate-pulse opacity-80" 
                          style={{ 
                            animationDelay: '0.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                        <Star 
                          size={12} 
                          className="absolute bottom-1 right-1 text-white animate-pulse opacity-95" 
                          style={{ 
                            animationDelay: '1.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                        <Star 
                          size={10} 
                          className="absolute top-1/2 left-0 text-white animate-pulse opacity-75" 
                          style={{ 
                            animationDelay: '2s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                        <Star 
                          size={8} 
                          className="absolute top-1/2 right-0 text-white animate-pulse opacity-70" 
                          style={{ 
                            animationDelay: '2.5s',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                      </>
                    )}
                  </div>
                           
                  <p className="text-lg lg:text-xl font-mono font-bold relative z-10 text-white"
                     style={{ 
                       textShadow: currentTheme === 'pink' 
                         ? '0 0 10px rgba(217, 70, 239, 0.8)' 
                         : '0 0 10px rgba(6, 182, 212, 0.8)' 
                     }}>
                    {currentRank.icon} {currentRank.name}
                  </p>
                </div>
              </div>
              
              {/* Programmer Badge */}
              <div className="relative group ml-4">
                <div className="px-3 py-2 relative overflow-hidden"
                     style={{
                       background: currentTheme === 'pink' 
                         ? 'linear-gradient(135deg, #f8bbff 0%, #f3a8ff 50%, #f8bbff 100%)' // Light pink gradient
                         : 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
                       border: currentTheme === 'pink' 
                         ? `2px solid #f3a8ff` // Light pink border
                         : `2px solid #16a34a`,
                       borderRadius: '12px', // Fixed - use consistent rounding for all themes
                       boxShadow: currentTheme === 'pink'
                         ? '0 0 15px rgba(243, 168, 255, 0.6), 4px 4px 0px 0px rgba(0,0,0,1)' // Light pink glow
                         : '0 0 15px rgba(34, 197, 94, 0.6), 4px 4px 0px 0px rgba(0,0,0,1)'
                     }}>
                  {/* Animated glow with theme colors */}
                  <div className="absolute inset-0 opacity-30 animate-pulse" 
                       style={{
                         background: currentTheme === 'pink' 
                           ? 'radial-gradient(circle, rgba(243, 168, 255, 0.4) 0%, transparent 70%)' // Light pink glow
                           : 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
                         borderRadius: '12px' // Fixed - use consistent rounding for all themes
                       }} />
                  {/* Particles effect with theme colors */}
                  <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                    <div className="absolute top-1 left-2 w-1 h-1 rounded-full animate-bounce" 
                         style={{ 
                           backgroundColor: currentTheme === 'pink' ? '#fce7ff' : '#bbf7d0', // Light pink particles
                           animationDelay: '0s' 
                         }} />
                    <div className="absolute top-3 right-3 w-1 h-1 rounded-full animate-bounce" 
                         style={{ 
                           backgroundColor: currentTheme === 'pink' ? '#fce7ff' : '#bbf7d0', // Light pink particles
                           animationDelay: '0.5s' 
                         }} />
                    <div className="absolute bottom-2 left-4 w-1 h-1 rounded-full animate-bounce" 
                         style={{ 
                           backgroundColor: currentTheme === 'pink' ? '#fce7ff' : '#bbf7d0', // Light pink particles
                           animationDelay: '1s' 
                         }} />
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    <Code size={16} className="text-white" style={{ 
                      filter: currentTheme === 'pink' 
                        ? 'drop-shadow(0 0 8px rgba(243, 168, 255, 0.8))' // Light pink glow for icon
                        : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))'
                    }} />
                    <span className="font-mono text-xs font-bold text-white" style={{ 
                      textShadow: currentTheme === 'pink' 
                        ? '0 0 10px rgba(243, 168, 255, 0.8)' // Light pink text shadow
                        : '0 0 10px rgba(34, 197, 94, 0.8)' 
                    }}>
                      PROGRAMMER
                    </span>
                    <div className="px-1 py-0.5 text-xs font-mono font-bold rounded"
                         style={{ 
                           backgroundColor: currentTheme === 'pink' ? '#f8bbff' : '#22c55e', // Light pink level badge
                           color: 'black' 
                         }}>
                      L3
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Rank Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold" style={{ color: themeColors.borderColor }}>
                  Next Rank:
                </span>
                {nextRank && (
                  <span className="text-sm font-mono font-bold text-white">
                    {nextRank.name}
                  </span>
                )}
                {!nextRank && (
                  <span className="text-sm font-mono font-bold text-yellow-400">
                    MAX RANK ACHIEVED
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced XP Progress Bar */}
            <div className="space-y-3">
              <div className="relative">
                <div className="w-full h-10 relative overflow-hidden"
                     style={{
                       backgroundColor: 'rgba(0, 0, 0, 0.6)',
                       border: `2px solid ${themeColors.borderColor}`,
                       borderRadius: '12px', // Fixed - use consistent rounding for all themes
                       boxShadow: currentTheme === 'default' 
                         ? '0 0 8px rgba(255, 255, 255, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' 
                         : `0 0 4px ${themeColors.primary}50, 2px 2px 0px 0px rgba(0,0,0,1)`
                     }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full relative"
                    style={{
                      background: currentTheme === 'pink' 
                        ? 'linear-gradient(90deg, #a855f7, #d946ef, #a855f7)'
                        : 'linear-gradient(90deg, #06b6d4, #22c55e, #06b6d4)', // Cyan to green gradient
                      borderRadius: '12px' // Fixed - use consistent rounding for all themes
                    }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                         style={{ 
                           animation: 'pulse 2s ease-in-out infinite',
                           borderRadius: '12px' // Fixed - use consistent rounding for all themes
                         }} />
                    
                    {/* XP Particles */}
                    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                      <div className="absolute top-1 left-1/4 w-1 h-1 bg-white rounded-full animate-bounce opacity-60" 
                           style={{ animationDelay: '0s' }} />
                      <div className="absolute top-2 left-3/4 w-0.5 h-0.5 bg-white rounded-full animate-bounce opacity-80" 
                           style={{ animationDelay: '1s' }} />
                      <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-40" 
                           style={{ animationDelay: '0.5s' }} />
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between text-sm gap-2">
                <span className="text-base font-mono" style={{ color: themeColors.borderColor }}>
                  <span className="mr-2 text-lg" style={{ color: themeColors.secondary }}>⚡</span>
                  Total Experience Points: {totalXP}
                </span>
                <span className="text-base font-mono text-white px-3 py-1"
                      style={{
                        backgroundColor: themeColors.backgroundColor,
                        border: `1px solid ${themeColors.borderColor}`,
                        borderRadius: '12px', // Fixed - use consistent rounding for all themes
                        boxShadow: currentTheme === 'default' 
                          ? '0 0 4px rgba(255, 255, 255, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' 
                          : `0 0 2px ${themeColors.primary}50, 1px 1px 0px 0px rgba(0,0,0,1)`
                      }}>
                  Level Up: {Math.max(0, xpInCurrentRank)}/{xpNeededForNextRank} XP
                </span>
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
                  Select the avatar that looks most like you
                </p>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  {defaultProfilePics.map(pic => (
                    <button
                      key={pic.id}
                      onClick={() => changeProfilePic(pic.id)}
                      className="p-2 transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: selectedProfilePic === pic.id ? themeColors.backgroundColor : 'transparent',
                        border: `2px solid ${selectedProfilePic === pic.id ? themeColors.controlColor : '#4B5563'}`,
                        borderRadius: '12px'
                      }}
                    >
                      <div className="w-16 h-16 bg-gray-600 border border-gray-500 mx-auto overflow-hidden"
                           style={{ borderRadius: '8px' }}>
                        <img 
                          src={pic.imagePath}
                          alt={`Avatar ${pic.id}`}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: 'pixelated' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center text-2xl">
                          🎮
                        </div>
                      </div>
                      {selectedProfilePic === pic.id && (
                        <div className="mt-1 flex justify-center">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.controlColor }} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4"
                     style={{
                       backgroundColor: themeColors.backgroundColor,
                       border: `1px solid ${themeColors.borderColor}`,
                       borderRadius: '12px'
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 border border-gray-500 flex items-center justify-center overflow-hidden"
                         style={{ borderRadius: '8px' }}>
                      <img 
                        src={getCurrentProfilePicData().imagePath}
                        alt="Selected Avatar"
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-lg">
                        🎮
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">
                        Currently Selected
                      </div>
                      <div className="font-mono text-xs text-gray-400">
                        {getCurrentProfilePicData().id}
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