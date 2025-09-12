import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Palette, Code, User, Trophy, Star } from 'lucide-react';

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
      study: ['NOVICE', 'STUDENT', 'LEARNER', 'SCHOLAR', 'RESEARCHER', 'EXPERT', 'SPECIALIST', 'PROFESSOR', 'GENIUS', 'MASTER'],
      work: ['INTERN', 'EMPLOYEE', 'WORKER', 'SPECIALIST', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE', 'CEO'],
      creative: ['DREAMER', 'ARTIST', 'MAKER', 'CREATOR', 'DESIGNER', 'INNOVATOR', 'VISIONARY', 'PIONEER', 'LEGEND', 'GODLIKE'],
      code: ['NOOB', 'CODER', 'PROGRAMMER', 'DEVELOPER', 'ENGINEER', 'ARCHITECT', 'GURU', 'NINJA', 'WIZARD', 'HACKER'],
      personal: ['SEEKER', 'EXPLORER', 'JOURNEYER', 'WANDERER', 'PATHFINDER', 'GUARDIAN', 'WARRIOR', 'CHAMPION', 'HERO', 'LEGEND']
    };
    
    const categoryKey = category.name.toLowerCase();
    return titles[categoryKey]?.[level - 1] || `LEVEL ${level}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {categories
        .filter(cat => (cat.xp || 0) >= 0) // Show all categories
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .map(category => {
          const IconComponent = getIconComponent(category.iconName);
          const currentLevel = getCurrentLevel(category.xp || 0);
          const progress = getLevelProgress(category.xp || 0);
          const levelTitle = getLevelTitle(category, currentLevel);
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border-2 relative overflow-hidden"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 20px ${category.color}40, 4px 4px 0px 0px rgba(0,0,0,1)`
              }}
            >
              {/* Cyberpunk background effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${category.color}30 0%, transparent 50%, ${category.color}20 100%)`,
                    backgroundImage: `
                      linear-gradient(90deg, transparent 79px, ${category.color}20 81px, ${category.color}20 82px, transparent 84px),
                      linear-gradient(transparent 79px, ${category.color}20 81px, ${category.color}20 82px, transparent 84px)
                    `,
                    backgroundSize: '80px 80px'
                  }}
                />
              </div>
              
              {/* Header */}
              <div 
                className="px-4 py-3 border-b-2 relative z-10"
                style={{ 
                  borderColor: category.color,
                  backgroundColor: '#0a0a0a'
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
                        {category.name.toUpperCase()}
                      </div>
                      <div 
                        className="font-mono text-xs font-bold tracking-wider"
                        style={{ color: category.color }}
                      >
                        {levelTitle}
                      </div>
                    </div>
                  </div>
                  
                  {/* Level badge */}
                  <div 
                    className="px-3 py-1 font-mono font-bold border-2 bg-black"
                    style={{ 
                      borderColor: category.color,
                      color: category.color
                    }}
                  >
                    LVL {currentLevel}
                  </div>
                </div>
              </div>
              
              {/* Skill Tree Nodes */}
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
                          ${isUnlocked 
                            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-green-400 text-green-400' 
                            : 'bg-gray-800 border-gray-600 text-gray-600'
                          }
                          ${isCurrent ? 'animate-pulse' : ''}
                          ${isMilestone ? 'border-yellow-400' : ''}
                        `}
                        style={{
                          borderColor: isUnlocked ? category.color : undefined,
                          color: isUnlocked ? category.color : undefined,
                          boxShadow: isUnlocked ? `0 0 10px ${category.color}40` : undefined
                        }}
                      >
                        {isMilestone && isUnlocked ? (
                          <Trophy size={16} />
                        ) : isUnlocked ? (
                          <Star size={12} />
                        ) : (
                          nodeLevel
                        )}
                        
                        {/* Connecting line to next node */}
                        {index < 9 && (
                          <div 
                            className={`
                              absolute top-1/2 -right-1 w-2 h-0.5 transform -translate-y-1/2
                              ${currentLevel > nodeLevel ? category.color.replace('#', 'bg-') : 'bg-gray-600'}
                            `}
                            style={{
                              backgroundColor: currentLevel > nodeLevel ? category.color : undefined
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">
                      {currentLevel < 10 ? `TO LEVEL ${currentLevel + 1}` : 'MAX LEVEL'}
                    </span>
                    <span style={{ color: category.color }}>
                      {currentLevel < 10 ? `${progress.current}/${progress.max} XP` : 'MASTERED'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 h-3 border border-gray-600">
                    <div 
                      className="h-full transition-all duration-500 relative overflow-hidden"
                      style={{ 
                        width: `${progress.percentage}%`,
                        backgroundColor: category.color
                      }}
                    >
                      {/* Animated scan line */}
                      <div 
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)`,
                          animation: 'scan 2s linear infinite'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold" style={{ color: category.color }}>
                      {category.xp || 0} TOTAL XP
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.floor((category.xp || 0) / 60)}h {(category.xp || 0) % 60}m grinded
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