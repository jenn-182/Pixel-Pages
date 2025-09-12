import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Palette, Code, User, Trophy, Star, Zap, Crown, Shield } from 'lucide-react';

const SkillTree = ({ categories, tabColor, tabColorRgb }) => {
  
  // XP calculation for levels (exponential growth)
  const calculateXPRequired = (level) => {
    const base = 60; // 1 hour for level 1
    return Math.floor(base * Math.pow(1.4, level - 1));
  };

  // Get current level from total XP
  const getCurrentLevel = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;
    
    while (level <= 10) {
      xpNeeded += calculateXPRequired(level);
      if (totalXP < xpNeeded) break;
      level++;
    }
    
    return Math.min(level, 10);
  };

  // Get XP progress for current level
  const getLevelProgress = (totalXP) => {
    const currentLevel = getCurrentLevel(totalXP);
    if (currentLevel === 10) return { current: 100, max: 100, percentage: 100 };
    
    let xpUsed = 0;
    for (let i = 1; i < currentLevel; i++) {
      xpUsed += calculateXPRequired(i);
    }
    
    const currentLevelXP = totalXP - xpUsed;
    const maxLevelXP = calculateXPRequired(currentLevel);
    const percentage = Math.floor((currentLevelXP / maxLevelXP) * 100);
    
    return { current: currentLevelXP, max: maxLevelXP, percentage };
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'BookOpen': BookOpen,
      'Briefcase': Briefcase,
      'Palette': Palette,
      'Code': Code,
      'User': User
    };
    return iconMap[iconName] || User;
  };

  const getLevelTitle = (category, level) => {
    const titles = {
      study: ['ROOKIE', 'NOVICE', 'STUDENT', 'SCHOLAR', 'RESEARCHER', 'EXPERT', 'SPECIALIST', 'PROFESSOR', 'GENIUS', 'MASTERMIND'],
      work: ['INTERN', 'TRAINEE', 'WORKER', 'SPECIALIST', 'VETERAN', 'ELITE', 'MANAGER', 'DIRECTOR', 'EXECUTIVE', 'LEGEND'],
      creative: ['DREAMER', 'ARTIST', 'MAKER', 'CREATOR', 'DESIGNER', 'INNOVATOR', 'VISIONARY', 'PIONEER', 'VIRTUOSO', 'GODLIKE'],
      code: ['NOOB', 'CODER', 'PROGRAMMER', 'DEVELOPER', 'ENGINEER', 'ARCHITECT', 'GURU', 'NINJA', 'WIZARD', 'HACKER'],
      personal: ['SEEKER', 'EXPLORER', 'JOURNEYER', 'WANDERER', 'PATHFINDER', 'GUARDIAN', 'WARRIOR', 'CHAMPION', 'HERO', 'LEGEND']
    };
    
    const categoryKey = category.name.toLowerCase();
    return titles[categoryKey]?.[level - 1] || `LEVEL ${level}`;
  };

  // Gaming rank colors based on level
  const getRankStyle = (level) => {
    if (level >= 10) return { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)', name: 'LEGENDARY' };
    if (level >= 8) return { color: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.6)', name: 'EPIC' };
    if (level >= 6) return { color: '#A78BFA', glow: 'rgba(167, 139, 250, 0.6)', name: 'RARE' };
    if (level >= 4) return { color: '#34D399', glow: 'rgba(52, 211, 153, 0.6)', name: 'UNCOMMON' };
    return { color: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.6)', name: 'COMMON' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories
        .filter(cat => (cat.xp || 0) >= 0)
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .map((category, index) => {
          const IconComponent = getIconComponent(category.iconName);
          const currentLevel = getCurrentLevel(category.xp || 0);
          const progress = getLevelProgress(category.xp || 0);
          const levelTitle = getLevelTitle(category, currentLevel);
          const rankStyle = getRankStyle(currentLevel);
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 20px ${category.color}40, 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              {/* Animated background effects - matching other tabs */}
              <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
                   style={{ borderColor: category.color }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${category.color.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.15), rgba(${category.color.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2))` }} />
              
              {/* Cyberpunk grid pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundImage: `
                      linear-gradient(90deg, transparent 79px, ${category.color}30 81px, ${category.color}30 82px, transparent 84px),
                      linear-gradient(transparent 79px, ${category.color}30 81px, ${category.color}30 82px, transparent 84px)
                    `,
                    backgroundSize: '80px 80px'
                  }}
                />
              </div>
              
              {/* Header - matching other tabs styling */}
              <div 
                className="px-4 py-3 border-b-2 relative z-10"
                style={{ 
                  borderColor: category.color,
                  backgroundColor: '#1A0E26'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent 
                      size={24} 
                      style={{ color: category.color }}
                    />
                    <div>
                      <div className="font-mono font-bold text-white text-lg">
                        {category.name.toUpperCase()} SKILL
                      </div>
                      <div 
                        className="font-mono text-xs font-bold tracking-wider"
                        style={{ color: rankStyle.color }}
                      >
                        {levelTitle}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rank badge with gaming style */}
                  <div className="flex flex-col items-end gap-1">
                    <div 
                      className="px-3 py-1 font-mono font-bold border-2 bg-black flex items-center gap-1"
                      style={{ 
                        borderColor: rankStyle.color,
                        color: rankStyle.color,
                        boxShadow: `0 0 10px ${rankStyle.glow}`
                      }}
                    >
                      {currentLevel >= 10 ? <Crown size={12} /> : 
                       currentLevel >= 8 ? <Trophy size={12} /> :
                       currentLevel >= 6 ? <Shield size={12} /> :
                       <Star size={12} />}
                      LVL {currentLevel}
                    </div>
                    <div 
                      className="text-xs font-mono font-bold"
                      style={{ color: rankStyle.color }}
                    >
                      {rankStyle.name}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skill Tree Nodes - Gaming styled */}
              <div className="p-6 relative z-10">
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {Array.from({ length: 10 }, (_, index) => {
                    const nodeLevel = index + 1;
                    const isUnlocked = currentLevel >= nodeLevel;
                    const isCurrent = currentLevel === nodeLevel && currentLevel < 10;
                    const isMilestone = nodeLevel === 5 || nodeLevel === 10;
                    
                    return (
                      <motion.div
                        key={nodeLevel}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          relative w-12 h-12 border-2 flex items-center justify-center font-mono font-bold text-xs
                          transition-all duration-300
                          ${isUnlocked 
                            ? 'bg-black shadow-inner' 
                            : 'bg-gray-900'
                          }
                          ${isCurrent ? 'animate-pulse' : ''}
                        `}
                        style={{
                          borderColor: isUnlocked ? category.color : '#4B5563',
                          color: isUnlocked ? category.color : '#6B7280',
                          boxShadow: isUnlocked ? `0 0 15px ${category.color}60, inset 0 0 10px ${category.color}20` : '0 0 3px rgba(75, 85, 99, 0.3)',
                          backgroundColor: isUnlocked ? '#000000' : '#1F2937'
                        }}
                      >
                        {isMilestone && isUnlocked ? (
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'loop'
                            }}
                          >
                            {nodeLevel === 10 ? <Crown size={16} /> : <Trophy size={16} />}
                          </motion.div>
                        ) : isUnlocked ? (
                          <motion.div
                            animate={{ 
                              scale: isCurrent ? [1, 1.1, 1] : 1
                            }}
                            transition={{ 
                              duration: 1.5,
                              repeat: isCurrent ? Infinity : 0,
                              repeatType: 'loop'
                            }}
                          >
                            <Zap size={12} />
                          </motion.div>
                        ) : (
                          <div className="text-gray-500">{nodeLevel}</div>
                        )}
                        
                        {/* Connecting line to next node */}
                        {index < 9 && (
                          <div 
                            className={`
                              absolute top-1/2 -right-1 w-2 h-0.5 transform -translate-y-1/2
                              transition-all duration-500
                            `}
                            style={{
                              backgroundColor: currentLevel > nodeLevel ? category.color : '#4B5563',
                              boxShadow: currentLevel > nodeLevel ? `0 0 4px ${category.color}` : 'none'
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Progress Bar - Gaming styled */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">
                      {currentLevel < 10 ? `NEXT RANK: LEVEL ${currentLevel + 1}` : 'MAX LEVEL ACHIEVED'}
                    </span>
                    <span style={{ color: category.color }}>
                      {currentLevel < 10 ? `${progress.current}/${progress.max} XP` : 'MASTERED'}
                    </span>
                  </div>
                  
                  {/* XP Bar with gaming effects */}
                  <div className="relative">
                    <div 
                      className="w-full h-4 border-2 bg-gray-900"
                      style={{ borderColor: category.color }}
                    >
                      <div 
                        className="h-full transition-all duration-1000 relative overflow-hidden"
                        style={{ 
                          width: `${progress.percentage}%`,
                          background: `linear-gradient(90deg, ${category.color}, ${category.color}CC, ${category.color})`
                        }}
                      >
                        {/* Animated scan line */}
                        <motion.div 
                          className="absolute inset-0 opacity-60"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)`
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'linear'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* XP text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-mono font-bold text-white drop-shadow-lg">
                        {progress.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats - Gaming themed */}
                  <div className="bg-black border-2 p-3" style={{ borderColor: category.color }}>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div 
                          className="text-xl font-mono font-bold"
                          style={{ color: category.color }}
                        >
                          {category.xp || 0}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">TOTAL XP</div>
                      </div>
                      <div>
                        <div 
                          className="text-xl font-mono font-bold"
                          style={{ color: category.color }}
                        >
                          {Math.floor((category.xp || 0) / 60)}h {(category.xp || 0) % 60}m
                        </div>
                        <div className="text-xs text-gray-400 font-mono">TIME GRINDED</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
};

export default SkillTree;