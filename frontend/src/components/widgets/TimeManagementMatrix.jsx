import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Target, TrendingUp, Award, Clock, BarChart3, X, BookOpen, Briefcase, Code, Palette, PenTool, Search, Calendar, Heart, User } from 'lucide-react';

const TimeManagementMatrix = ({ tabColor = '#10B981', tabColorRgb = '16, 185, 129', onClose }) => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ranges = [
    { id: 'weekly', label: 'Week', icon: Target },
    { id: 'monthly', label: 'Month', icon: BarChart3 },
    { id: 'yearly', label: 'Year', icon: TrendingUp }
  ];

  // Icon mapping function
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
      'User': User               // Custom categories
    };
    return iconMap[iconName] || User;
  };

  // XP calculation for levels (EXACT same as HexagonalSkillTree)
  const calculateXPRequired = (level) => {
    const base = 60; // 1 hour for level 1
    return Math.floor(base * Math.pow(1.4, level - 1));
  };

  // Get current level from total XP (EXACT same as HexagonalSkillTree)
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

  // Get level title (same as skill tree)
  const getLevelTitle = (categoryName, level) => {
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
    
    const categoryKey = categoryName.toLowerCase();
    return titles[categoryKey]?.[level - 1] || `Level ${level}`;
  };

  // Track mouse position for cursor-following tooltips
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    calculateTimeData();
    // Trigger animation sequence
    setTimeout(() => setAnimationPhase(1), 500);
    setTimeout(() => setAnimationPhase(2), 1000);
    
    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [timeRange]);

  // Generate pie chart with fixed hover
  const generateMatrixChart = () => {
    if (chartData.length === 0) return null;

    const size = 500;
    const center = size / 2;
    const outerRadius = 230;
    const innerRadius = 120;
    let currentAngle = 0;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* Glowing filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Scanning line gradient */}
            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor={tabColor} stopOpacity="0.8"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>

            {/* Grid pattern */}
            <pattern id="gridPattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.2"/>

          {/* Outer ring decorative circles */}
          <circle cx={center} cy={center} r={outerRadius + 15} fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
          <circle cx={center} cy={center} r={outerRadius + 5} fill="none" stroke={tabColor} strokeWidth="1" opacity="0.4"/>
          
          {/* Inner ring decorative circles */}
          <circle cx={center} cy={center} r={innerRadius - 5} fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
          <circle cx={center} cy={center} r={innerRadius - 15} fill="none" stroke={tabColor} strokeWidth="1" opacity="0.4"/>

          {/* Data segments */}
          {chartData.map((segment, index) => {
            const startAngle = currentAngle;
            const endAngle = currentAngle + (segment.percentage / 100) * 360;
            const midAngle = (startAngle + endAngle) / 2;
            currentAngle = endAngle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            const midAngleRad = (midAngle * Math.PI) / 180;

            // Outer arc points
            const x1Outer = center + outerRadius * Math.cos(startAngleRad);
            const y1Outer = center + outerRadius * Math.sin(startAngleRad);
            const x2Outer = center + outerRadius * Math.cos(endAngleRad);
            const y2Outer = center + outerRadius * Math.sin(endAngleRad);

            // Inner arc points
            const x1Inner = center + innerRadius * Math.cos(startAngleRad);
            const y1Inner = center + innerRadius * Math.sin(startAngleRad);
            const x2Inner = center + innerRadius * Math.cos(endAngleRad);
            const y2Inner = center + innerRadius * Math.sin(endAngleRad);

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            const pathData = [
              `M ${x1Inner} ${y1Inner}`,
              `L ${x1Outer} ${y1Outer}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
              `L ${x2Inner} ${y2Inner}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
              'Z'
            ].join(' ');

            return (
              <g key={segment.id}>
                <motion.path
                  d={pathData}
                  fill={segment.color}
                  stroke="#000000"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: animationPhase >= 1 ? (hoveredSegment === segment.id ? 1 : 0.8) : 0, 
                    scale: animationPhase >= 1 ? (hoveredSegment === segment.id ? 1.05 : 1) : 0 
                  }}
                  transition={{ 
                    delay: index * 0.2, 
                    type: "spring",
                    duration: 0.8 
                  }}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: `drop-shadow(0 0 12px ${segment.color}80) drop-shadow(0 0 6px ${segment.color}60)`,
                    pointerEvents: 'all'
                  }}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              </g>
            );
          })}

          {/* Animated scanning line */}
          {animationPhase >= 2 && (
            <motion.line
              x1={center}
              y1={center - outerRadius}
              x2={center}
              y2={center - innerRadius}
              stroke="url(#scanGradient)"
              strokeWidth="4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ 
                transformOrigin: `${center}px ${center}px`,
                pointerEvents: 'none'
              }}
            />
          )}
        </svg>

        {/* Floating tooltip that follows cursor */}
        <AnimatePresence>
          {hoveredSegment && animationPhase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-black border-2 rounded-lg px-4 py-3 pointer-events-none z-50"
              style={{
                left: mousePosition.x + 15,
                top: mousePosition.y - 10,
                borderColor: chartData.find(d => d.id === hoveredSegment)?.color,
                minWidth: '200px',
                boxShadow: `0 0 20px ${chartData.find(d => d.id === hoveredSegment)?.color}40`
              }}
            >
              {(() => {
                const segment = chartData.find(d => d.id === hoveredSegment);
                if (!segment) return null;
                
                return (
                  <div className="text-center">
                    <div 
                      className="font-mono font-bold text-lg mb-1"
                      style={{ color: segment.color }}
                    >
                      {segment.name.toUpperCase()} ({segment.percentage}%)
                    </div>
                    <div className="text-white font-mono text-sm">
                      {formatTime(segment.minutes)}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center stats display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-[200px]">
            <motion.div 
              className="text-4xl font-mono font-bold mb-3 text-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              {formatTime(totalTime)}
            </motion.div>
            <motion.div 
              className="text-base font-mono text-gray-400 tracking-wider leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              TOTAL GRIND TIME
            </motion.div>
            <motion.div 
              className="text-sm font-mono text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
            >
              {timeRange.toUpperCase()} ANALYSIS
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const calculateTimeData = () => {
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    const categories = JSON.parse(localStorage.getItem('focusCategories') || '[]');
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= startDate && sessionDate <= now;
    });

    const categoryTimes = {};
    let total = 0;

    filteredSessions.forEach(session => {
      const categoryName = session.category;
      const timeSpent = session.timeSpent || 0;
      
      if (!categoryTimes[categoryName]) {
        categoryTimes[categoryName] = 0;
      }
      categoryTimes[categoryName] += timeSpent;
      total += timeSpent;
    });

    const data = Object.entries(categoryTimes).map(([categoryId, minutes]) => {
      const category = categories.find(cat => cat.id === categoryId);
      const percentage = total > 0 ? (minutes / total) * 100 : 0;
      
      // Use the EXACT same XP from categories - this is what skill tree displays
      let categoryXP = 0;
      if (category && typeof category.xp === 'number') {
        categoryXP = category.xp;
      }
      
      console.log(`TimeMatrix - ${category?.name}: ${categoryXP} XP, Level: ${getCurrentLevel(categoryXP)}`);
      
      return {
        id: categoryId,
        name: category?.name || categoryId,
        minutes,
        hours: Math.floor(minutes / 60),
        remainingMinutes: minutes % 60,
        percentage: percentage.toFixed(1),
        color: category?.color || '#6B7280',
        iconName: category?.iconName || 'User',
        xp: categoryXP
      };
    }).sort((a, b) => b.minutes - a.minutes);

    setChartData(data);
    setTotalTime(total);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate stats
  const getStats = () => {
    if (chartData.length === 0) return { topSkill: 'None', avgTime: 0, totalTime: 0, leastSkill: 'None' };
    
    const topSkill = chartData[0];
    const leastSkill = chartData[chartData.length - 1];
    const avgTime = Math.round(totalTime / chartData.length);

    return {
      topSkill: topSkill.name,
      avgTime,
      totalTime,
      leastSkill: leastSkill.name
    };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
      style={{
        borderColor: tabColor,
        boxShadow: `0 0 25px ${tabColor}40, 8px 8px 0px 0px rgba(0,0,0,1)`
      }}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ 
            background: `radial-gradient(circle at 20% 20%, ${tabColor}20 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, ${tabColor}15 0%, transparent 50%)`
          }} 
        />
      </div>

      {/* Matrix-style border scan */}
      <div className="absolute inset-0 border-2 opacity-30 pointer-events-none" 
           style={{ 
             borderColor: tabColor,
             animation: 'borderScan 3s linear infinite'
           }} />

      <div className="relative z-10">
        {/* Header */}
        <div 
          className="px-6 py-4 border-b-2 bg-black bg-opacity-60"
          style={{ borderColor: tabColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-mono text-xl font-bold text-white tracking-wider">
                  TIME MATRIX
                </h2>
                <p className="font-mono text-xs text-gray-400">
                  PRODUCTIVITY ANALYSIS
                </p>
              </div>
            </div>
            
            {/* Time Range Controls */}
            <div className="flex gap-1">
              {ranges.map((range, index) => {
                const IconComponent = range.icon;
                return (
                  <motion.button
                    key={range.id}
                    onClick={() => setTimeRange(range.id)}
                    className={`px-2 py-1 border font-mono text-xs font-bold transition-all relative overflow-hidden ${
                      timeRange === range.id
                        ? 'bg-black border-current'
                        : 'bg-gray-900 border-gray-600 hover:border-gray-500'
                    }`}
                    style={{
                      color: timeRange === range.id ? tabColor : '#9CA3AF',
                      borderColor: timeRange === range.id ? tabColor : undefined,
                      boxShadow: timeRange === range.id ? `0 0 10px ${tabColor}40` : undefined
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-1">
                      <IconComponent size={12} />
                      <span>{range.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="p-1 border border-gray-600 hover:border-red-500 transition-colors"
              style={{ color: '#EF4444' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {chartData.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-center">
              
              {/* Left Column - First half of skills - Wider cards */}
              <div className="lg:col-span-2 space-y-6">
                {chartData.slice(0, Math.ceil(chartData.length / 2)).map((segment, index) => {
                  const IconComponent = getIconComponent(segment.iconName);
                  const currentLevel = getCurrentLevel(segment.xp);

                  return (
                    <motion.div
                      key={`left-${segment.id}`}
                      className="flex items-center gap-4 p-5 bg-gray-800 border border-gray-700 transition-all duration-200 rounded-lg"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 1 }}
                      style={{
                        borderColor: segment.color + '40',
                        boxShadow: `0 0 10px ${segment.color}30`
                      }}
                    >
                      <div 
                        className="p-3 rounded-full border-2 bg-gray-900 flex-shrink-0"
                        style={{ 
                          borderColor: segment.color,
                          boxShadow: `0 0 15px ${segment.color}50`
                        }}
                      >
                        <IconComponent size={24} style={{ color: segment.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-mono text-lg font-bold mb-1"
                          style={{ color: segment.color }}
                        >
                          {segment.name.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-white font-mono text-xl font-bold">
                            {formatTime(segment.minutes)}
                          </div>
                          <div className="text-gray-400 font-mono text-sm">
                            Level {currentLevel}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Center - Chart */}
              <div className="lg:col-span-3 flex justify-center">
                {generateMatrixChart()}
              </div>

              {/* Right Column - Second half of skills - Wider cards */}
              <div className="lg:col-span-2 space-y-6">
                {chartData.slice(Math.ceil(chartData.length / 2)).map((segment, index) => {
                  const IconComponent = getIconComponent(segment.iconName);
                  const currentLevel = getCurrentLevel(segment.xp);

                  return (
                    <motion.div
                      key={`right-${segment.id}`}
                      className="flex items-center gap-4 p-5 bg-gray-800 border border-gray-700 transition-all duration-200 rounded-lg"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 1.2 }}
                      style={{
                        borderColor: segment.color + '40',
                        boxShadow: `0 0 10px ${segment.color}30`
                      }}
                    >
                      <div 
                        className="p-3 rounded-full border-2 bg-gray-900 flex-shrink-0"
                        style={{ 
                          borderColor: segment.color,
                          boxShadow: `0 0 15px ${segment.color}50`
                        }}
                      >
                        <IconComponent size={24} style={{ color: segment.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-mono text-lg font-bold mb-1"
                          style={{ color: segment.color }}
                        >
                          {segment.name.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-white font-mono text-xl font-bold">
                            {formatTime(segment.minutes)}
                          </div>
                          <div className="text-gray-400 font-mono text-md">
                            Level {currentLevel}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-6 pt-4 border-t border-gray-700"
            >
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-gray-800 border" style={{ borderColor: tabColor + '40' }}>
                  <Award size={16} className="mx-auto mb-1" style={{ color: tabColor }} />
                  <div 
                    className="text-lg font-mono font-bold"
                    style={{ color: tabColor }}
                  >
                    {stats.topSkill.toUpperCase()}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    TOP SKILL
                  </div>
                </div>
                
                <div className="p-3 bg-gray-800 border" style={{ borderColor: tabColor + '40' }}>
                  <Clock size={16} className="mx-auto mb-1" style={{ color: tabColor }} />
                  <div 
                    className="text-lg font-mono font-bold"
                    style={{ color: tabColor }}
                  >
                    {formatTime(stats.avgTime)}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    AVG PER SKILL
                  </div>
                </div>

                <div className="p-3 bg-gray-800 border" style={{ borderColor: tabColor + '40' }}>
                  <Target size={16} className="mx-auto mb-1" style={{ color: tabColor }} />
                  <div 
                    className="text-lg font-mono font-bold"
                    style={{ color: tabColor }}
                  >
                    {formatTime(stats.totalTime)}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    TOTAL TIME
                  </div>
                </div>

                <div className="p-3 bg-gray-800 border" style={{ borderColor: tabColor + '40' }}>
                  <BarChart3 size={16} className="mx-auto mb-1" style={{ color: tabColor }} />
                  <div 
                    className="text-lg font-mono font-bold"
                    style={{ color: tabColor }}
                  >
                    {stats.leastSkill.toUpperCase()}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    LEAST SKILL
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Target size={64} className="text-gray-500 mx-auto mb-4" />
              <div className="text-gray-400 font-mono text-xl font-bold mb-2">
                NO DATA MATRIX FOUND
              </div>
              <div className="text-gray-500 font-mono text-sm">
                Complete focus sessions to generate time analysis data!
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Cursor-following tooltips */}
      <AnimatePresence>
        {hoveredIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bg-black border-2 px-4 py-2 rounded z-50 pointer-events-none"
            style={{ 
              left: mousePosition.x + 15,
              top: mousePosition.y - 10,
              borderColor: chartData.find(d => d.id === hoveredIcon)?.color || tabColor
            }}
          >
            {(() => {
              const segment = chartData.find(d => d.id === hoveredIcon);
              if (!segment) return null;
              
              const currentLevel = getCurrentLevel(segment.xp);
              const levelTitle = getLevelTitle(segment.name, currentLevel);
              
              return (
                <div className="text-center">
                  <div 
                    className="font-mono font-bold text-lg"
                    style={{ color: segment.color }}
                  >
                    {segment.name.toUpperCase()}
                  </div>
                  <div className="text-white font-mono text-sm">
                    Level {currentLevel} - {levelTitle}
                  </div>
                  <div className="text-gray-400 font-mono text-xs">
                    {segment.xp} XP • {formatTime(segment.minutes)} grind time
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes borderScan {
          0% { border-color: ${tabColor}20; }
          50% { border-color: ${tabColor}60; }
          100% { border-color: ${tabColor}20; }
        }
      `}</style>
    </motion.div>
  );
};

export default TimeManagementMatrix;