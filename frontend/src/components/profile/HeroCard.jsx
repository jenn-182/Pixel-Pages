import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, Target, Star, Trophy, X } from 'lucide-react';
import PixelPageJenn from '../../assets/icons/PixelPageJenn.PNG';
import TaskStats from './TaskStats';

const HeroCard = ({ player, notes = [], tasks = [], taskLists = [] }) => {
  const [showEasterEgg, setShowEasterEgg] = useState(false);

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
      case 2: return "Apprentice Writer";
      case 3: return "Skilled Chronicler";
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
      {/* Main Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <div className="flex items-start gap-8 lg:gap-12">
          {/* Avatar and Level Badge section */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 border-2 border-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden bg-gray-700"
                 style={{
                   boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)'
                 }}>
              {/* Custom Pixel Profile Image */}
              <img 
                src={PixelPageJenn} 
                alt="Pixel Profile Avatar"
                className="w-full h-full object-cover"
                style={{ 
                  imageRendering: 'pixelated',
                  imageRendering: '-moz-crisp-edges',
                  imageRendering: 'crisp-edges'
                }}
              />
              
              {/* Level decorations overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
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
                <div className="absolute inset-0 border-2 border-cyan-400 opacity-60 animate-pulse" />
              )}
            </div>
            
            {/* Level Badge */}
            <div className="mt-4 relative">
              <div className="bg-gray-900 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center px-4 py-2 relative overflow-hidden group"
                   style={{
                     boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="font-mono font-bold text-lg text-cyan-400 relative z-10">LVL {currentLevel}</span>
              </div>
              
              {/* Online Status Indicator - Now with hidden easter egg button */}
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

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="text-lg font-mono text-cyan-400 block">USERNAME:</span>
              <h2 className="text-3xl lg:text-4xl font-bold font-mono text-white break-words">
                {currentPlayer.username}
              </h2>
            </div>
            
            {/* Player Title section */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <div className="bg-gray-900 border-4 border-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 relative overflow-hidden"
                     style={{
                       boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `
                        repeating-linear-gradient(
                          45deg,
                          #22d3ee,
                          #22d3ee 2px,
                          transparent 2px,
                          transparent 4px
                        )
                      `
                    }}
                  />
                  <p className="text-lg lg:text-xl font-mono font-bold text-cyan-300 relative z-10">
                    {playerTitle}
                  </p>
                </div>
                {/* Corner decoration */}
                <div className="absolute -top-2 -left-2">
                  <div className="relative w-5 h-5">
                    <span className="absolute top-0 left-1 text-purple-400 text-sm animate-pulse font-bold">✦</span>
                    <span className="absolute top-1 left-3 text-purple-300 text-xs animate-pulse font-bold" style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-3 left-0 text-purple-500 text-xs animate-pulse font-bold" style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="relative w-5 h-5">
                    <span className="absolute top-0 right-1 text-purple-400 text-sm animate-pulse font-bold">✦</span>
                    <span className="absolute top-1 right-3 text-purple-300 text-xs animate-pulse font-bold" style={{ animationDelay: '0.5s' }}>★</span>
                    <span className="absolute top-3 right-0 text-purple-500 text-xs animate-pulse font-bold" style={{ animationDelay: '1s' }}>✧</span>
                  </div>
                </div>
              </div>
              {currentLevel >= 8 && (
                <div className="bg-cyan-400 text-black px-3 py-1 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-mono font-bold text-sm">ELITE</span>
                </div>
              )}
            </div>

            {/* Next Rank */}
            <div className="mb-6">
              <span className="font-mono text-gray-400 flex items-center text-sm">
                <Target size={14} className="inline mr-1" />
                Next Rank: <span className="text-purple-400 ml-1">{nextLevelTitle}</span>
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-3">
              <div className="relative">
                <div className="w-full h-10 bg-gray-900 border border-cyan-400 relative overflow-hidden"
                     style={{
                       clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)'
                     }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                         style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  </motion.div>
                  
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
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

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          LOG STATS
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Notes */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">LOGS</div>
            <div className="text-2xl font-mono font-bold text-white">{notes.length}</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Total XP */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">TOTAL XP</div>
            <div className="text-2xl font-mono font-bold text-white">{totalXP.toLocaleString()}</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Total Tasks */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">QUESTS</div>
            <div className="text-2xl font-mono font-bold text-white">{tasks.length}</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Days Active */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">STREAK</div>
            <div className="text-2xl font-mono font-bold text-white">7</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Task Statistics Section */}
      <TaskStats tasks={tasks} taskLists={taskLists} />

      {/* Easter Egg Modal */}
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
              className="bg-gray-800 border-2 border-purple-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md mx-4 relative"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated border */}
              <div className="absolute inset-0 border-2 border-purple-400 opacity-50 animate-pulse pointer-events-none" />
              
              {/* Close button */}
              <button
                onClick={() => setShowEasterEgg(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  className="mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy size={64} className="text-purple-400 mx-auto" />
                </motion.div>

                <h2 className="text-2xl font-mono font-bold text-white mb-2">
                  SECRET ACHIEVEMENTS
                </h2>
                
                <p className="text-purple-400 font-mono text-sm mb-6">
                  You found the hidden section!
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-900 border border-purple-400 p-4 mb-6"
                >
                  <h3 className="text-xl font-mono font-bold text-purple-400 mb-4">
                    COMING SOON
                  </h3>
                </motion.div>

                <div className="flex items-center justify-center gap-1">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroCard;