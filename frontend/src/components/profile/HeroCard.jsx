import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, Target, Star, Trophy, X, ChevronDown, Palette } from 'lucide-react';
import PixelPageJenn from '../../assets/icons/PixelPageJenn.PNG';
import TaskStats from './TaskStats';

const HeroCard = ({ player, notes = [], tasks = [], taskLists = [] }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);

  // Calculate XP and level (matching your GameUtilities.java logic)
  const calculateTotalXP = (notes) => {
    let totalXP = 0;
    
    for (const note of notes) {
      // Base XP per note
      totalXP += 10;
      
      // Bonus XP for content length
      const wordCount = note.content ? note.content.split(/\s+/).length : 0;
      totalXP += Math.min(Math.floor(wordCount / 10), 50);
      
      // Bonus XP for using tags
      const tags = note.tagsString ? note.tagsString.split(',').filter(tag => tag.trim()) : [];
      totalXP += tags.length * 5;
      
      // Bonus XP for longer titles
      if (note.title && note.title.length > 20) {
        totalXP += 5;
      }
    }
    
    return totalXP;
  };

  const calculateLevelFromXP = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 50.0)) + 1;
  };

  const getRankNameForLevel = (level) => {
    switch (level) {
      case 1: return "Novice Scribe";
      case 2: return "Skilled Chronicler";
      case 3: return "Apprentice Writer";
      case 4: return "Expert Documentarian";
      case 5: return "Master Archivist";
      case 6: return "Elite Wordsmith";
      case 7: return "Distinguished Author";
      case 8: return "Legendary Scribe";
      case 9: return "Mythical Chronicler";
      case 10: return "Grandmaster of Words";
      default: return level < 15 ? `Ascended Writer` : `Transcendent Scribe`;
    }
  };

  // Calculate player stats
  const totalXP = calculateTotalXP(notes);
  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 50;
  const nextLevelXP = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = totalXP - currentLevelBaseXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelBaseXP;
  const progressPercentage = Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);

  const playerTitle = getRankNameForLevel(currentLevel);
  const nextLevelTitle = getRankNameForLevel(currentLevel + 1);

  // Generate pixel avatar based on username
  const generatePixelAvatar = (username) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    
    const initial = username ? username.charAt(0).toUpperCase() : 'P';
    const colorIndex = username ? username.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return { initial, bgColor };
  };

  // Mock player data if no player provided
  const mockPlayer = {
    username: "Jroc_182",
    level: 1,
    experience: 0
  };

  const currentPlayer = player || mockPlayer;

  return (
    <div className="space-y-6">
      {/* Main Profile Section - Updated with purple theme to match LOG STATS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-purple-400 p-8 relative overflow-hidden"
        style={{
          boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Gradient overlay with purple theme to match LOG STATS */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-purple-600/20 pointer-events-none" />
        
        {/* Profile Style Button - Top Right - Updated to pink theme */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className="bg-gray-900 border border-pink-400 px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:border-pink-300 hover:shadow-[0_0_8px_rgba(244,114,182,0.4)] font-mono font-bold text-pink-400 overflow-hidden flex items-center gap-2"
              style={{
                boxShadow: '0 0 3px rgba(244, 114, 182, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/8 to-pink-600/12 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-2">
                <Palette size={14} className="text-pink-400" />
                <span className="text-pink-400 text-xs">PROFILE THEME</span>
                <ChevronDown 
                  size={12} 
                  className={`text-pink-400 transition-transform duration-200 ${showStyleDropdown ? 'rotate-180' : ''}`} 
                />
              </div>
              <div className="absolute inset-0 bg-pink-400 opacity-0 group-hover:opacity-5 transition-opacity" />
            </button>

            {/* Dropdown Menu - Updated to pink theme */}
            <AnimatePresence>
              {showStyleDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-gray-900 border border-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[200px] z-30"
                  style={{
                    boxShadow: '0 0 10px rgba(244, 114, 182, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/8 to-pink-600/12 pointer-events-none" />
                  <div className="relative z-10 p-3">
                    <div className="text-xs font-mono text-pink-400 font-bold mb-2">CHOOSE THEME:</div>
                    
                    {/* Style Options */}
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-xs font-mono text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors border border-gray-600 hover:border-pink-400">
                        CYBER PINK HEARTS
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs font-mono text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition-colors border border-gray-600 hover:border-cyan-400">
                        NEON CYAN DEFAULT
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs font-mono text-gray-400 hover:text-purple-400 hover:bg-gray-800 transition-colors border border-gray-600 hover:border-purple-400">
                        RETRO GREEN TERMINAL
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs font-mono text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors border border-gray-600 hover:border-indigo-400">
                        DIGITAL RED MATRIX
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="relative z-10 flex items-start gap-8 lg:gap-12">
          {/* Avatar and Level Badge section - Updated with purple theme */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 border-2 border-purple-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden bg-gray-700"
                 style={{
                   boxShadow: '0 0 10px rgba(139, 92, 246, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)'
                 }}>

              {/* Custom Pixel Profile Image */}
              <img 
                src={PixelPageJenn} 
                alt="Pixel Profile Avatar"
                className="w-full h-full object-cover relative z-10"
                style={{ 
                  imageRendering: 'pixelated',
                  imageRendering: '-moz-crisp-edges',
                  imageRendering: 'crisp-edges'
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
                  backgroundSize: '200% 100%'
                }}
              />
              
              {/* Level decorations overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                {/* Crown for high levels */}
                {currentLevel >= 8 && (
                  <Crown size={20} className="absolute -top-4 -right-3 text-yellow-400 drop-shadow-lg" />
                )}
                {/* Star effects for legendary levels */}
                {currentLevel >= 10 && (
                  <>
                    <Star size={16} className="absolute -top-2 -left-4 text-yellow-300 animate-pulse drop-shadow-lg" />
                    <Star size={14} className="absolute -bottom-2 -right-4 text-yellow-300 animate-pulse drop-shadow-lg" style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>
              
              {/* Level ring around avatar for high levels */}
              {currentLevel >= 5 && (
                <div className="absolute inset-0 border-2 border-purple-400 opacity-60 animate-pulse z-40" />
              )}
            </div>
            
            {/* Level Badge - updated with pink theme and shiny effects */}
            <div className="mt-4 relative">
              <div className="bg-gray-900 border-2 border-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center px-4 py-2 relative overflow-hidden group"
                   style={{
                     boxShadow: '0 0 10px rgba(244, 114, 182, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
                   }}>
                {/* Shiny sweep animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-30 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                {/* Additional shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-transparent to-pink-500/20 animate-pulse" />
                <span className="font-mono font-bold text-lg text-pink-400 relative z-10">LVL {currentLevel}</span>
              </div>
              
              {/* Online Status Indicator - unchanged */}
              <div className="mt-2 flex items-center justify-center gap-2 bg-gray-900 border border-gray-600 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
            </div>
          </div>

          {/* Player Info - updated with purple theme */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="text-lg font-mono text-purple-400 block">USERNAME:</span>
              <h2 className="text-3xl lg:text-4xl font-bold font-mono text-white break-words">
                {currentPlayer.username}
              </h2>
            </div>
            
            {/* Player Title section - updated with pink shiny rank badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <div className="bg-gray-900 border-4 border-pink-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 relative overflow-hidden group"
                     style={{
                       boxShadow: '0 0 15px rgba(244, 114, 182, 0.4), 6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  {/* Shiny striped background */}
                  <div 
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          45deg,
                          #f472b6,
                          #f472b6 2px,
                          transparent 2px,
                          transparent 4px
                        )
                      `
                    }}
                  />           
                  <p className="text-lg lg:text-xl font-mono font-bold text-pink-300 relative z-10">
                    {playerTitle}
                  </p>
                </div>
                {/* Corner decorations - BIGGER stars with mixed theme colors */}
                <div className="absolute -top-3 -left-3">
                  <div className="relative w-8 h-8">
                    <span className="absolute top-0 left-2 text-white-400 text-xl animate-pulse font-bold">✦</span>
                    <span className="absolute top-2 left-5 text-purple-300 text-lg animate-pulse font-bold" style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-5 left-0 text-cyan-500 text-lg animate-pulse font-bold" style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <div className="relative w-8 h-8">
                    <span className="absolute top-0 right-2 text-white-400 text-xl animate-pulse font-bold">✦</span>
                    <span className="absolute top-2 right-5 text-purple-300 text-lg animate-pulse font-bold" style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-5 right-0 text-cyan-500 text-lg animate-pulse font-bold" style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
              </div>
              {currentLevel >= 8 && (
                <div className="bg-pink-400 text-black px-3 py-1 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-mono font-bold text-sm">ELITE</span>
                </div>
              )}
            </div>

            {/* Next Rank - updated to pink */}
            <div className="mb-6">
              <span className="font-mono text-gray-400 flex items-center text-sm">
                <Target size={14} className="inline mr-1" />
                Next Rank: <span className="text-pink-400 ml-1">{nextLevelTitle}</span>
              </span>
            </div>

            {/* XP Progress Bar - updated with purple/pink to cyan gradient */}
            <div className="space-y-3">
              <div className="relative">
                <div className="w-full h-10 bg-gray-900 border border-purple-400 relative overflow-hidden"
                     style={{
                       clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)'
                     }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 relative"
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                         style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                    {/* Additional sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 -skew-x-12 animate-pulse" />
                  </motion.div>
                  
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-400" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-400" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-400" />
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
                <span className="text-base font-mono text-gray-300">
                  <Zap size={18} className="inline mr-2 text-white" />
                  Experience Points
                </span>
                <span className="text-base font-mono text-white bg-gray-700 px-3 py-1 border border-gray-600">
                  {xpInCurrentLevel}/{xpNeededForNextLevel} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* LOG STATS Section - Updated with purple theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-purple-400 p-6 relative overflow-hidden"
        style={{
          boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Gradient overlay with purple theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-purple-600/20 pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <span className="text-pink-400 mr-2 text-xl">♥</span>
            LOG STATS
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Notes */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">LOGS</div>
                <div className="text-2xl font-mono font-bold text-white">{notes.length}</div>
              </div>
            </div>

            {/* Total XP */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-500/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">TOTAL XP</div>
                <div className="text-2xl font-mono font-bold text-white">{totalXP.toLocaleString()}</div>
              </div>
            </div>

            {/* Total Words - Updated from QUESTS */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-700/15 pointer-events-none" />
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

            {/* Days Active - Updated with 'd' suffix */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-800/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">STREAK</div>
                <div className="text-2xl font-mono font-bold text-white">7 days</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* MISSION STATS Section - Updated to match LOG STATS theme (cyan -> purple) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-purple-400 p-6 relative overflow-hidden"
        style={{
          boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Gradient overlay with purple theme to match LOG STATS */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-purple-600/20 pointer-events-none" />
        
        <div className="relative z-10">
          <TaskStats tasks={tasks} taskLists={taskLists} />
        </div>
      </motion.div>

      {/* ACHIEVEMENT STATS Section - Updated stats and removed badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-purple-400 p-6 relative overflow-hidden"
        style={{
          boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Gradient overlay with purple theme to match other sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/15 to-purple-600/20 pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <span className="text-pink-400 mr-2 text-xl">♥</span>
            ACHIEVEMENT STATS
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unlocked Achievements */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">UNLOCKED</div>
                <div className="text-2xl font-mono font-bold text-white">12</div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-500/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">COMPLETION</div>
                <div className="text-2xl font-mono font-bold text-white">24%</div>
              </div>
            </div>

            {/* Rare Achievements */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-700/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">RARE</div>
                <div className="text-2xl font-mono font-bold text-white">3</div>
              </div>
            </div>

            {/* Legendary Achievements */}
            <div className="bg-gray-900 border border-gray-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-800/15 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs font-mono text-gray-400">LEGENDARY</div>
                <div className="text-2xl font-mono font-bold text-white">1</div>
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