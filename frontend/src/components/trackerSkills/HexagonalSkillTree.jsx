import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Palette, Code, User, Trophy, Star, Zap, Crown, Shield, Plus, Award, Target, Clock, Flame, PenTool, Search, Calendar, Heart, Activity } from 'lucide-react';

const HexagonalSkillTree = ({ categories, tabColor, tabColorRgb }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', color: '#00FFFF' });

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
      'BookOpen': BookOpen,      // Scholar (Study)
      'Briefcase': Briefcase,    // Profession (Work)
      'Palette': Palette,        // Artisan (Creating)
      'PenTool': PenTool,        // Scribe (Writing)
      'Code': Code,              // Programming (Coding)
      'Target': Target,          // Literacy (Reading)
      'Calendar': Calendar,      // Strategist (Planning)
      'Heart': Heart,            // Mindfulness (Rest)
      'Search': Search,          // Knowledge (Researching)
      'Plus': Plus               // Custom branches
    };
    return iconMap[iconName] || Plus;
  };

  const getLevelTitle = (category, level) => {
    const titles = {
      scholar: ['STUDENT', 'LEARNER', 'THINKER', 'SCHOLAR', 'RESEARCHER', 'EXPERT', 'SAGE', 'PROFESSOR', 'GENIUS', 'MASTERMIND'],
      profession: ['INTERN', 'TRAINEE', 'WORKER', 'SPECIALIST', 'VETERAN', 'ELITE', 'MANAGER', 'DIRECTOR', 'EXECUTIVE', 'LEGEND'],
      artisan: ['DREAMER', 'ARTIST', 'MAKER', 'CREATOR', 'DESIGNER', 'INNOVATOR', 'VISIONARY', 'PIONEER', 'VIRTUOSO', 'GODLIKE'],
      scribe: ['NOVICE', 'WRITER', 'AUTHOR', 'STORYTELLER', 'WORDSMITH', 'POET', 'NOVELIST', 'MASTER', 'LAUREATE', 'IMMORTAL'],
      programming: ['NOOB', 'CODER', 'PROGRAMMER', 'DEVELOPER', 'ENGINEER', 'ARCHITECT', 'GURU', 'NINJA', 'WIZARD', 'HACKER'],
      literacy: ['READER', 'BROWSER', 'BOOKWORM', 'SCHOLAR', 'CRITIC', 'ANALYST', 'EXPERT', 'CURATOR', 'SAGE', 'ORACLE'],
      strategist: ['PLANNER', 'ORGANIZER', 'TACTICIAN', 'STRATEGIST', 'COORDINATOR', 'MASTERMIND', 'ARCHITECT', 'VISIONARY', 'COMMANDER', 'GRANDMASTER'],
      mindfulness: ['SEEKER', 'RELAXER', 'MEDITATOR', 'PEACEFUL', 'CENTERED', 'BALANCED', 'SERENE', 'ENLIGHTENED', 'TRANSCENDENT', 'ZEN MASTER'],
      knowledge: ['CURIOUS', 'SEARCHER', 'INVESTIGATOR', 'RESEARCHER', 'EXPLORER', 'DISCOVERER', 'SCHOLAR', 'EXPERT', 'AUTHORITY', 'OMNISCIENT']
    };
    
    const categoryKey = category.name.toLowerCase();
    return titles[categoryKey]?.[level - 1] || `LEVEL ${level}`;
  };

  // Bright neon colors for branches
  const getBranchColor = (categoryName, customColor = null) => {
    if (customColor) return customColor;
    
    const colorMap = {
      'scholar': '#FF1493',      // Deep Pink
      'profession': '#00FFFF',   // Cyan  
      'artisan': '#8A2BE2',      // Blue Violet
      'scribe': '#FF6347',       // Tomato Red
      'programming': '#00FF7F',  // Spring Green
      'literacy': '#FFD700',     // Gold
      'strategist': '#FF4500',   // Orange Red
      'mindfulness': '#40E0D0',  // Turquoise
      'knowledge': '#DA70D6'     // Orchid
    };
    
    const categoryKey = categoryName.toLowerCase();
    return colorMap[categoryKey] || '#6B7280';
  };

  // Get node description for hover
  const getNodeDescription = (category, nodeLevel) => {
    const descriptions = {
      scholar: ['STUDENT', 'LEARNER', 'THINKER', 'SCHOLAR', 'RESEARCHER', 'EXPERT', 'SAGE', 'PROFESSOR', 'GENIUS', 'MASTERMIND'],
      profession: ['INTERN', 'TRAINEE', 'WORKER', 'SPECIALIST', 'VETERAN', 'ELITE', 'MANAGER', 'DIRECTOR', 'EXECUTIVE', 'LEGEND'],
      artisan: ['DREAMER', 'ARTIST', 'MAKER', 'CREATOR', 'DESIGNER', 'INNOVATOR', 'VISIONARY', 'PIONEER', 'VIRTUOSO', 'GODLIKE'],
      scribe: ['NOVICE', 'WRITER', 'AUTHOR', 'STORYTELLER', 'WORDSMITH', 'POET', 'NOVELIST', 'MASTER', 'LAUREATE', 'IMMORTAL'],
      programming: ['NOOB', 'CODER', 'PROGRAMMER', 'DEVELOPER', 'ENGINEER', 'ARCHITECT', 'GURU', 'NINJA', 'WIZARD', 'HACKER'],
      literacy: ['READER', 'BROWSER', 'BOOKWORM', 'SCHOLAR', 'CRITIC', 'ANALYST', 'EXPERT', 'CURATOR', 'SAGE', 'ORACLE'],
      strategist: ['PLANNER', 'ORGANIZER', 'TACTICIAN', 'STRATEGIST', 'COORDINATOR', 'MASTERMIND', 'ARCHITECT', 'VISIONARY', 'COMMANDER', 'GRANDMASTER'],
      mindfulness: ['SEEKER', 'RELAXER', 'MEDITATOR', 'PEACEFUL', 'CENTERED', 'BALANCED', 'SERENE', 'ENLIGHTENED', 'TRANSCENDENT', 'ZEN MASTER'],
      knowledge: ['CURIOUS', 'SEARCHER', 'INVESTIGATOR', 'RESEARCHER', 'EXPLORER', 'DISCOVERER', 'SCHOLAR', 'EXPERT', 'AUTHORITY', 'OMNISCIENT']
    };
    
    const categoryKey = category.name.toLowerCase();
    return descriptions[categoryKey]?.[nodeLevel - 1] || `Level ${nodeLevel} skill`;
  };

  // Achievement system
  const checkAchievements = () => {
    const totalXP = sortedCategories.reduce((sum, cat) => sum + (cat.xp || 0), 0);
    const maxedBranches = sortedCategories.filter(cat => getCurrentLevel(cat.xp || 0) === 10).length;
    const activeBranches = sortedCategories.filter(cat => (cat.xp || 0) > 0).length;
    const totalHours = Math.floor(totalXP / 60);
    
    const newAchievements = [];
    
    if (activeBranches >= 1 && !achievements.includes('first-blood')) {
      newAchievements.push({
        id: 'first-blood',
        name: 'FIRST BLOOD',
        description: 'Reach level 1 in any branch',
        icon: Target,
        color: '#00FFFF'
      });
    }
    
    if (activeBranches >= 3 && !achievements.includes('multi-tasker')) {
      newAchievements.push({
        id: 'multi-tasker',
        name: 'MULTI-TASKER',
        description: 'Have 3+ active skill branches',
        icon: Flame,
        color: '#FF0080'
      });
    }
    
    if (totalHours >= 100 && !achievements.includes('grind-master')) {
      newAchievements.push({
        id: 'grind-master',
        name: 'GRIND MASTER',
        description: 'Log 100+ hours total',
        icon: Clock,
        color: '#FFFF00'
      });
    }
    
    if (maxedBranches >= 1 && !achievements.includes('perfectionist')) {
      newAchievements.push({
        id: 'perfectionist',
        name: 'PERFECTIONIST',
        description: 'Max out a skill branch',
        icon: Crown,
        color: '#FFD700'
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements.map(a => a.id)]);
    }
  };

  useEffect(() => {
    checkAchievements();
  }, [categories]);

  // Hexagon component with fill progress
  const HexagonShape = ({ size = 48, color = '#4B5563', fillPercentage = 0, isUnlocked = false, isCurrent = false }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
      <defs>
        <clipPath id={`hexClip-${color.replace('#', '')}-${size}`}>
          <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" />
        </clipPath>
        {isCurrent && (
          <filter id={`glow-${color.replace('#', '')}-${size}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
      </defs>
      
      {/* Glow background for current level */}
      {isCurrent && (
        <polygon
          points="50,5 85,25 85,75 50,95 15,75 15,25"
          fill={color}
          opacity="0.3"
          filter={`url(#glow-${color.replace('#', '')}-${size})`}
        />
      )}
      
      <polygon
        points="50,5 85,25 85,75 50,95 15,75 15,25"
        fill="#1F2937"
        stroke={isUnlocked ? color : '#4B5563'}
        strokeWidth="2"
      />
      
      {fillPercentage > 0 && (
        <rect
          x="0"
          y={100 - fillPercentage}
          width="100"
          height={fillPercentage}
          fill={color}
          clipPath={`url(#hexClip-${color.replace('#', '')}-${size})`}
          opacity="0.8"
        />
      )}
      
      <polygon
        points="50,5 85,25 85,75 50,95 15,75 15,25"
        fill="transparent"
        stroke={isUnlocked ? color : '#4B5563'}
        strokeWidth="2"
        style={{
          filter: isUnlocked ? `drop-shadow(0 0 8px ${color}40)` : undefined
        }}
      />
    </svg>
  );

  // Create custom branch handler
  const handleCreateBranch = () => {
    if (newBranch.name.trim()) {
      const customBranch = {
        id: Date.now().toString(),
        name: newBranch.name,
        iconName: 'Plus',
        xp: 0,
        customColor: newBranch.color,
        isCustom: true
      };
      
      const existingCategories = JSON.parse(localStorage.getItem('focusCategories') || '[]');
      const updatedCategories = [...existingCategories, customBranch];
      localStorage.setItem('focusCategories', JSON.stringify(updatedCategories));
      
      setNewBranch({ name: '', color: '#00FFFF' });
      setShowCreateBranch(false);
      window.location.reload();
    }
  };

  // Sort categories for consistent order
  const sortedCategories = categories
    .filter(cat => (cat.xp || 0) >= 0)
    .sort((a, b) => {
      const order = ['scholar', 'profession', 'artisan', 'scribe', 'programming', 'literacy', 'strategist', 'mindfulness', 'knowledge'];
      const aIndex = order.indexOf(a.name.toLowerCase());
      const bIndex = order.indexOf(b.name.toLowerCase());
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  const totalXP = sortedCategories.reduce((sum, cat) => sum + (cat.xp || 0), 0);
  const maxedBranches = sortedCategories.filter(cat => getCurrentLevel(cat.xp || 0) === 10).length;
  const totalHours = Math.floor(totalXP / 60);

  return (
    <div 
      className="translucent-panel relative overflow-hidden rounded-lg"
      style={{
        borderColor: tabColor,
        '--tab-color-rgb': tabColorRgb
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ borderColor: tabColor }} />
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{ 
             background: `radial-gradient(circle at center, ${tabColor}30 0%, transparent 70%)` 
           }} />

      {/* Header with Stats */}
      <div 
        className="px-6 py-4 border-b-2 relative z-10 bg-black bg-opacity-60"
        style={{ 
          borderColor: tabColor
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div 
                className="text-2xl font-mono font-bold"
                style={{ color: tabColor }}
              >
                {sortedCategories.length}
              </div>
              <div className="text-xs text-gray-400 font-mono">SKILLS</div>
            </div>
            <div className="text-center">
              <div 
                className="text-2xl font-mono font-bold"
                style={{ color: 'white' }}
              >
                {maxedBranches}
              </div>
              <div className="text-xs text-gray-400 font-mono">MASTERED</div>
            </div>
            <div className="text-center">
              <div 
                className="text-2xl font-mono font-bold"
                style={{ color: 'white' }}
              >
                {totalHours}h
              </div>
              <div className="text-xs text-gray-400 font-mono">TOTAL GRIND TIME</div>
            </div>
          </div>

          {/* Center - Header */}
          <div className="text-center">
            <div className="font-mono font-bold text-white text-3xl mb-2">
              SKILL TREE MATRIX
            </div>
            <div className="text-gray-400 font-mono text-sm">
              Track your grind sessions and level up your skills.
            </div>
            <div 
              className="font-mono text-sm font-bold tracking-wider mt-1"
              style={{ color: tabColor }}
            >
              {sortedCategories.length} ACTIVE SKILL BRANCHES
            </div>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-2">
            {/* Create Branch Button */}
            <motion.button
              className="px-3 py-1.5 border-2 bg-black font-mono font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform"
              style={{ 
                borderColor: tabColor,
                color: tabColor,
                boxShadow: `0 0 8px ${tabColor}40`
              }}
              whileHover={{ boxShadow: `0 0 15px ${tabColor}60` }}
              onClick={() => setShowCreateBranch(!showCreateBranch)}
            >
              <Plus size={25} />
              NEW BRANCH
            </motion.button>

            {/* View Time Matrix Button */}
            <motion.button
              className="px-3 py-1.5 border-2 bg-black font-mono font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform relative overflow-hidden"
              style={{ 
                borderColor: 'white',
                color: 'white',
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.4)`
              }}
              whileHover={{ 
                boxShadow: `0 0 15px rgba(255, 255, 255, 0.6)`,
                borderColor: 'white' 
              }}
              onClick={() => {
                // This will be passed from TrackerTab
                if (window.toggleMatrix) {
                  window.toggleMatrix();
                }
              }}
            >
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)`,
                  width: '100%',
                  animation: 'scan 3s linear infinite'
                }}
              />
              
              <Activity size={25} className="relative z-10" />
              <span className="relative z-10">TIME MATRIX</span>
            </motion.button>
          </div>
        </div>

        {/* Create Branch Form */}
        {showCreateBranch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-black-800 border-2 rounded"
            style={{ borderColor: tabColor }}
          >
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-mono text-gray-400 mb-1">BRANCH NAME</label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border-2 text-white font-mono text-sm rounded"
                  style={{ borderColor: tabColor }}
                  placeholder="Enter skill name..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">COLOR</label>
                <input
                  type="color"
                  value={newBranch.color}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 border-2 bg-black cursor-pointer rounded"
                  style={{ borderColor: tabColor }}
                />
              </div>
              <button
                onClick={handleCreateBranch}
                className="px-4 py-2 border-2 bg-black font-mono font-bold text-sm hover:scale-105 transition-transform rounded"
                style={{ 
                  borderColor: tabColor,
                  color: tabColor,
                  boxShadow: `0 0 10px ${tabColor}40`
                }}
              >
                CREATE
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Skill Tree Grid */}
      <div className="p-8 relative z-10">
        <div className="space-y-8">
          {sortedCategories.map((category, categoryIndex) => {
            const IconComponent = getIconComponent(category.iconName);
            const currentLevel = getCurrentLevel(category.xp || 0);
            const progress = getLevelProgress(category.xp || 0);
            const levelTitle = getLevelTitle(category, currentLevel);
            const branchColor = getBranchColor(category.name, category.customColor);
            const isMaxLevel = currentLevel === 10;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="relative"
              >
                {/* Branch Header */}
                <div className="flex items-center mb-4">
                  <motion.div
                    className="w-16 h-16 border-2 rounded-full flex items-center justify-center mr-6 bg-black"
                    style={{ 
                      borderColor: branchColor,
                      boxShadow: `0 0 15px ${branchColor}60`
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <IconComponent size={24} style={{ color: branchColor }} />
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-white text-xl">
                          {category.name.toUpperCase()} BRANCH
                        </div>
                        <div 
                          className="font-mono text-sm font-bold tracking-wider"
                          style={{ color: branchColor }}
                        >
                          {levelTitle}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div 
                            className="text-3xl font-mono font-bold mb-1" // Changed from text-2xl to text-3xl and added margin
                            style={{ color: branchColor }}
                          >
                            {category.xp || 0} XP
                          </div>
                          <div className="text-sm text-gray-400 font-mono"> {/* Changed from text-xs to text-sm */}
                            {Math.floor((category.xp || 0) / 60)}h {(category.xp || 0) % 60}m
                          </div>
                        </div>
                        
                        <div 
                          className="px-3 py-1 font-mono font-bold border-2 bg-black flex items-center gap-2"
                          style={{ 
                            borderColor: isMaxLevel ? '#FFD700' : branchColor,
                            color: isMaxLevel ? '#FFD700' : branchColor,
                            boxShadow: `0 0 10px ${isMaxLevel ? '#FFD700' : branchColor}60`
                          }}
                        >
                          {isMaxLevel ? <Crown size={16} /> : 
                           currentLevel >= 8 ? <Trophy size={16} /> :
                           currentLevel >= 6 ? <Shield size={16} /> :
                           <Star size={16} />}
                          LVL {currentLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined Progress Line and Skill Nodes */}
                <div className="relative">
                  {/* Background Progress Line */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-gray-700 rounded-full" />
                  
                  {/* Active Progress Line */}
                  <div 
                    className="absolute top-6 left-6 h-1 rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ 
                      width: `calc(${Math.min(((currentLevel - 1) * 10) + (progress.percentage / 10), 100)}% - 48px)`,
                      background: `linear-gradient(90deg, ${branchColor}, ${branchColor}CC)`,
                      boxShadow: `0 0 8px ${branchColor}, 0 0 4px ${branchColor}80`
                    }}
                  >
                    {/* Animated scan line for progress */}
                    <div 
                      className="absolute inset-0 opacity-80"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                        width: '20px',
                        animation: 'scan 2s linear infinite'
                      }}
                    />
                  </div>

                  {/* Skill Nodes */}
                  <div className="flex justify-between items-center">
                    {Array.from({ length: 10 }, (_, index) => {
                      const nodeLevel = index + 1;
                      const isCompleted = currentLevel > nodeLevel;
                      const isCurrent = currentLevel === nodeLevel;
                      const isMilestone = nodeLevel === 5 || nodeLevel === 10;
                      
                      let fillPercentage = 0;
                      if (isCompleted) {
                        fillPercentage = 100;
                      } else if (isCurrent) {
                        fillPercentage = progress.percentage;
                      }
                      
                      return (
                        <motion.div
                          key={nodeLevel}
                          className="relative w-12 h-12 flex items-center justify-center cursor-pointer z-10"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: (categoryIndex * 0.5) + (nodeLevel * 0.05), type: "spring" }}
                          whileHover={{ scale: 1.1 }}
                          onHoverStart={() => setHoveredNode({ category: category.name, level: nodeLevel })}
                          onHoverEnd={() => setHoveredNode(null)}
                          style={{
                            filter: isCurrent ? `drop-shadow(0 0 12px ${branchColor}) drop-shadow(0 0 24px ${branchColor}80)` : undefined
                          }}
                        >
                          <HexagonShape 
                            size={48}
                            color={nodeLevel === 10 && isCompleted ? '#FFD700' : branchColor}
                            fillPercentage={fillPercentage}
                            isUnlocked={isCompleted || isCurrent}
                            isCurrent={isCurrent}
                          />
                          
                          <div className="relative z-20">
                            {isMilestone && isCompleted ? (
                              <div
                                className={nodeLevel === 10 ? 'animate-spin' : 'animate-pulse'}
                                style={{ 
                                  color: '#000000',
                                  animationDuration: nodeLevel === 10 ? '4s' : '2s'
                                }}
                              >
                                {nodeLevel === 10 ? <Crown size={16} /> : <Trophy size={16} />}
                              </div>
                            ) : isCompleted ? (
                              <Zap size={12} style={{ color: '#000000' }} />
                            ) : (
                              <div className="font-mono font-bold text-xs text-black-400">
                                {nodeLevel}
                              </div>
                            )}
                          </div>

                          {/* Hover tooltip */}
                          {hoveredNode?.category === category.name && hoveredNode?.level === nodeLevel && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`absolute mb-3 bg-black border-2 px-3 py-2 rounded whitespace-nowrap z-50 ${
                                nodeLevel >= 8 ? 'top-full mt-3' : 'bottom-full'
                              } ${
                                nodeLevel >= 8 ? 'left-1/2 transform -translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'
                              }`}
                              style={{ 
                                borderColor: nodeLevel === 10 ? '#FFD700' : branchColor,
                                // Adjust positioning for last few nodes to prevent overflow
                                ...(nodeLevel >= 8 && {
                                  right: nodeLevel === 10 ? '0' : 'auto',
                                  left: nodeLevel === 10 ? 'auto' : '50%',
                                  transform: nodeLevel === 10 ? 'translateX(0)' : 'translateX(-50%)'
                                })
                              }}
                            >
                              <div 
                                className="text-sm font-mono font-bold"
                                style={{ color: nodeLevel === 10 ? '#FFD700' : branchColor }}
                              >
                                Level {nodeLevel} {nodeLevel === 10 ? '- MASTERY' : ''}
                                {isCurrent && ` (${fillPercentage}%)`}
                              </div>
                              <div className="text-xs text-black-300">
                                {getNodeDescription(category, nodeLevel)}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* XP Info Below Nodes */}
                <div className="mt-4 flex justify-between text-xs font-mono text-gray-400">
                  <span>
                    {currentLevel < 10 ? `NEXT: LEVEL ${currentLevel + 1}` : 'BRANCH MASTERED'}
                  </span>
                  <span style={{ color: 'branchColor' }}>
                    {currentLevel < 10 ? `${progress.current}/${progress.max} XP` : 'COMPLETED'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add CSS for scan animation */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(calc(100% + 20px)); }
        }
      `}</style>
    </div>
  );
};

export default HexagonalSkillTree;