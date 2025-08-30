import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Target, Star } from 'lucide-react';
import PixelPageJenn from '../../assets/icons/PixelPageJenn.PNG';

const HeroCard = ({ player, notes = [] }) => {
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
          {/* Avatar and Level Badge section - keep existing code */}
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
              
              {/* Level ring around avatar for high levels - also updated to cyan */}
              {currentLevel >= 5 && (
                <div className="absolute inset-0 border-2 border-cyan-400 opacity-60 animate-pulse" />
              )}
            </div>
            
            {/* Level Badge - Futuristic style matching theme */}
            <div className="mt-4 relative">
              {/* Make level badge more dynamic */}
              <div className="bg-gray-900 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center px-4 py-2 relative overflow-hidden group"
                   style={{
                     boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
                   }}>
                {/* Animated scan line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="font-mono font-bold text-lg text-cyan-400 relative z-10">LVL {currentLevel}</span>
              </div>
              {/* Corner accents matching the futuristic theme - updated to purple */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400 border border-gray-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 border border-gray-600" />
            </div>
          </div>

          {/* Player Info - Remove the stats sections from here */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="text-lg font-mono text-cyan-400 block">USERNAME:</span>
              <h2 className="text-3xl lg:text-4xl font-bold font-mono text-white break-words">
                {currentPlayer.username}
              </h2>
            </div>
            
            {/* Player Title section - keep existing */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                {/* Background with pixel art pattern - updated to cyan theme */}
                <div className="bg-gray-900 border-4 border-cyan-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-5 py-3 relative overflow-hidden"
                     style={{
                       boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 6px 6px 0px 0px rgba(0,0,0,1)'
                     }}>
                  {/* Pixel art background pattern - updated to cyan */}
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
                {/* Corner decoration - updated to purple */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 border border-gray-600" />
              </div>
              {currentLevel >= 8 && (
                <div className="bg-cyan-400 text-black px-3 py-1 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-mono font-bold text-sm">ELITE</span>
                </div>
              )}
            </div>

            {/* Next Rank - Under the player rank badge */}
            <div className="mb-6">
              <span className="font-mono text-gray-400 flex items-center text-sm">
                <Target size={14} className="inline mr-1" />
                Next Rank: <span className="text-purple-400 ml-1">{nextLevelTitle}</span>
              </span>
            </div>

            {/* XP Progress Bar - Reorganized layout */}
            <div className="space-y-3">
              {/* Progress Bar - Futuristic HUD (right slant upward like /) */}
              <div className="relative">
                {/* Outer frame */}
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
                    {/* Animated scan lines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                         style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  </motion.div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
                </div>
                
                {/* Clean percentage text - Centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono font-bold text-white"
                        style={{
                          textShadow: '2px 2px 0px rgba(0,0,0,0.8)'
                        }}>
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              
              {/* Info below progress bar */}
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
          QUICK STATS
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Notes */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">NOTES</div>
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

          {/* Avg Words per Note */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="text-xs font-mono text-gray-400">AVG WORDS</div>
            <div className="text-2xl font-mono font-bold text-white">
              {notes.length > 0 ? Math.round(notes.reduce((acc, note) => 
                acc + (note.content ? note.content.split(/\s+/).length : 0), 0) / notes.length) : 0}
            </div>
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

      {/* Active Missions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          ACTIVE MISSIONS
        </h3>
        
        <div className="grid gap-4">
          {/* Mission 1 - Level Up */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">RANK UP</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Reach Level {currentLevel + 1} to unlock "{nextLevelTitle}"
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              {xpInCurrentLevel}/{xpNeededForNextLevel} XP ({xpNeededForNextLevel - xpInCurrentLevel} needed)
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Mission 2 - Create Notes */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">CONTENT CREATOR</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Create 5 more notes this week
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{ width: `60%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              3/5 notes created this week
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Mission 3 - Use Tags */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">ORGANIZER</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Use tags in 10 different notes
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                style={{ width: `30%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              3/10 notes with tags
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements Section - NOW BELOW Active Missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          RECENT ACHIEVEMENTS
        </h3>
        
        <div className="grid gap-3">
          {/* Achievement 1 */}
          <div className="bg-gray-900 border-l-4 border-l-yellow-400 border border-gray-600 p-4 flex items-center gap-4"
               style={{
                 boxShadow: '0 0 5px rgba(251, 191, 36, 0.2)'
               }}>
            <div className="w-10 h-10 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center">
              <Crown size={20} className="text-gray-900" />
            </div>
            <div className="flex-1">
              <div className="font-mono font-bold text-yellow-400 text-lg">Level Up!</div>
              <div className="text-sm font-mono text-gray-300">Reached Level {currentLevel}</div>
            </div>
            <div className="text-xs font-mono text-gray-400">Just now</div>
          </div>

          {/* Achievement 2 */}
          <div className="bg-gray-900 border-l-4 border-l-purple-400 border border-gray-600 p-4 flex items-center gap-4"
               style={{
                 boxShadow: '0 0 5px rgba(168, 85, 247, 0.2)'
               }}>
            <div className="w-10 h-10 bg-purple-400 border-2 border-gray-600 flex items-center justify-center">
              <Zap size={20} className="text-gray-900" />
            </div>
            <div className="flex-1">
              <div className="font-mono font-bold text-purple-400 text-lg">Power Writer</div>
              <div className="text-sm font-mono text-gray-300">Created 10 notes this week</div>
            </div>
            <div className="text-xs font-mono text-gray-400">2 days ago</div>
          </div>

          {/* Achievement 3 */}
          <div className="bg-gray-900 border-l-4 border-l-cyan-400 border border-gray-600 p-4 flex items-center gap-4"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2)'
               }}>
            <div className="w-10 h-10 bg-cyan-400 border-2 border-gray-600 flex items-center justify-center">
              <Target size={20} className="text-gray-900" />
            </div>
            <div className="flex-1">
              <div className="font-mono font-bold text-cyan-400 text-lg">First Steps</div>
              <div className="text-sm font-mono text-gray-300">Created your first note</div>
            </div>
            <div className="text-xs font-mono text-gray-400">1 week ago</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroCard;