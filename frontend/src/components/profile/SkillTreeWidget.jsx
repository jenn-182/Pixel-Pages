import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Palette, Code, Target, Calendar, Heart, Search, PenTool, Plus, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SkillTreeWidget = () => {
  const { currentTheme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Get categories from localStorage
  const getCategories = () => {
    try {
      return JSON.parse(localStorage.getItem('focusCategories') || '[]');
    } catch (error) {
      return [];
    }
  };

  // XP calculation for levels (same as HexagonalSkillTree)
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

  const getIconComponent = (iconName) => {
    const iconMap = {
      'BookOpen': BookOpen,
      'Briefcase': Briefcase,
      'Palette': Palette,
      'PenTool': PenTool,
      'Code': Code,
      'Target': Target,
      'Calendar': Calendar,
      'Heart': Heart,
      'Search': Search,
      'Plus': Plus
    };
    return iconMap[iconName] || Plus;
  };

  // Get branch color
  const getBranchColor = (categoryName, customColor = null) => {
    if (customColor) return customColor;
    
    const colorMap = {
      'scholar': '#FF1493',
      'profession': '#00FFFF',
      'artisan': '#8A2BE2',
      'scribe': '#FF6347',
      'programming': '#00FF7F',
      'literacy': '#FFD700',
      'strategist': '#FF4500',
      'mindfulness': '#40E0D0',
      'knowledge': '#DA70D6'
    };
    
    return colorMap[categoryName.toLowerCase()] || '#6B7280';
  };

  const categories = getCategories().filter(cat => (cat.xp || 0) >= 0);
  const sortedCategories = categories.sort((a, b) => {
    const order = ['scholar', 'profession', 'artisan', 'scribe', 'programming', 'literacy', 'strategist', 'mindfulness', 'knowledge'];
    const aIndex = order.indexOf(a.name.toLowerCase());
    const bIndex = order.indexOf(b.name.toLowerCase());
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 relative overflow-hidden"
      style={{
        backgroundColor: themeColors.backgroundColor,
        border: `2px solid ${themeColors.borderColor}`,
        borderRadius: currentTheme === 'default' ? themeColors.borderRadius : '8px', // Use default rounding for pink theme
        boxShadow: currentTheme === 'default' 
          ? `0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)` 
          : `0 0 3px ${themeColors.primary}50, 4px 4px 0px 0px rgba(0,0,0,1)` // Add box shadow like default
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: currentTheme === 'default' 
               ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
               : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
             borderRadius: currentTheme === 'default' ? themeColors.borderRadius : '8px' // Match container rounding
           }} />

      <div className="relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-mono font-bold text-white flex items-center">
            {currentTheme === 'pink' ? (
              <Heart 
                size={16} 
                className="mr-2" 
                style={{ color: themeColors.secondary }}
              />
            ) : (
              <Star 
                size={16} 
                className="mr-2" 
                style={{ color: themeColors.secondary }}
              />
            )}
            PLAYER SKILLS
          </h3>
          <div className="text-xs font-mono text-gray-400">
            {sortedCategories.length} BRANCHES
          </div>
        </div>

        {/* Compact Skills List */}
        <div className="space-y-2">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-3">
              <div className="text-gray-500 font-mono text-xs">
                Start focusing to unlock skills!
              </div>
            </div>
          ) : (
            sortedCategories.map((category, index) => {
              const currentLevel = getCurrentLevel(category.xp || 0);
              const branchColor = getBranchColor(category.name, category.customColor);
              const isMaxLevel = currentLevel === 10;

              return (
                <div key={category.id} className="flex items-center gap-3">
                  {/* Skill Name - Full Length */}
                  <div className="w-32 text-xs font-mono font-bold text-white">
                    {category.name.toUpperCase()}
                  </div>

                  {/* Progress Bar with Maximum Spacing - Full Width */}
                  <div className="flex-1 flex justify-between items-center px-2">
                    {Array.from({ length: 10 }, (_, segmentIndex) => {
                      const segmentLevel = segmentIndex + 1;
                      const isCompleted = currentLevel > segmentLevel;
                      const isCurrent = currentLevel === segmentLevel;
                      
                      return (
                        <div
                          key={segmentIndex}
                          className="h-2 border"
                          style={{
                            backgroundColor: isCompleted || isCurrent ? branchColor : 'rgba(0,0,0,0.8)',
                            borderColor: branchColor,
                            width: '90px'
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Compact Level */}
                  <div 
                    className="px-1 py-0.5 text-xs font-mono font-bold w-6 text-center"
                    style={{ 
                      color: isMaxLevel ? '#FFD700' : branchColor
                    }}
                  >
                    {currentLevel}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Compact Footer */}
        {sortedCategories.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-700">
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>XP: {sortedCategories.reduce((sum, cat) => sum + (cat.xp || 0), 0)}</span>
              <span>MAX: {sortedCategories.filter(cat => getCurrentLevel(cat.xp || 0) === 10).length}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillTreeWidget;