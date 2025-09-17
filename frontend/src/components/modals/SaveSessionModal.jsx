import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Plus, Trophy, Code, BookOpen, Briefcase, Palette, User, PenTool, Search, Calendar, Heart, Target } from 'lucide-react';
import apiService from '../../services/api';
import achievementService from '../../services/achievementService';

const SaveSessionModal = ({ 
  isOpen, 
  onSave, 
  onDiscard, 
  timeSpent, 
  sessionType = 'session',
  username = 'user'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [savedCategories, setSavedCategories] = useState([]);

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

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = async () => {
      // NEW Default categories with your 9 branches
      const defaultCategories = [
        { id: 'scholar', name: 'Scholar', iconName: 'BookOpen', color: '#FF1493', xp: 0 },
        { id: 'profession', name: 'Profession', iconName: 'Briefcase', color: '#00FFFF', xp: 0 },
        { id: 'artisan', name: 'Artisan', iconName: 'Palette', color: '#8A2BE2', xp: 0 },
        { id: 'scribe', name: 'Scribe', iconName: 'PenTool', color: '#FF6347', xp: 0 },
        { id: 'programming', name: 'Programming', iconName: 'Code', color: '#00FF7F', xp: 0 },
        { id: 'literacy', name: 'Literacy', iconName: 'Target', color: '#FFD700', xp: 0 },
        { id: 'strategist', name: 'Strategist', iconName: 'Calendar', color: '#FF4500', xp: 0 },
        { id: 'mindfulness', name: 'Mindfulness', iconName: 'Heart', color: '#40E0D0', xp: 0 },
        { id: 'knowledge', name: 'Knowledge', iconName: 'Search', color: '#DA70D6', xp: 0 }
      ];

      // Get categories from localStorage
      const saved = localStorage.getItem('focusCategories');
      if (saved) {
        setSavedCategories(JSON.parse(saved));
      } else {
        // Initialize with new defaults
        localStorage.setItem('focusCategories', JSON.stringify(defaultCategories));
        setSavedCategories(defaultCategories);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, username]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCustomInput(false);
    setCustomCategoryName('');
  };

  // Handle custom category
  const handleCustomCategory = () => {
    setShowCustomInput(true);
    setSelectedCategory('custom');
  };

  // Save session with category to localStorage
  const handleSave = async () => {
    let finalCategory = selectedCategory;
    
    if (selectedCategory === 'custom' && customCategoryName.trim()) {
      // Create new custom category
      const newCategory = {
        id: customCategoryName.toLowerCase().replace(/\s+/g, '_'),
        name: customCategoryName.trim(),
        iconName: 'User',
        color: '#6B7280',
        xp: 0,
        isCustom: true
      };
      
      const updatedCategories = [...savedCategories, newCategory];
      setSavedCategories(updatedCategories);
      localStorage.setItem('focusCategories', JSON.stringify(updatedCategories));
      
      finalCategory = newCategory.id;
    }
    
    if (finalCategory && finalCategory !== 'custom') {
      // Update local XP tracking
      const updatedCategories = savedCategories.map(cat => 
        cat.id === finalCategory 
          ? { ...cat, xp: (cat.xp || 0) + timeSpent }
          : cat
      );
      setSavedCategories(updatedCategories);
      localStorage.setItem('focusCategories', JSON.stringify(updatedCategories));
      
      // Save individual session for history tracking
      const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      const newSession = {
        id: Date.now(),
        username,
        category: finalCategory,
        timeSpent,
        sessionType,
        createdAt: new Date().toISOString(),
        date: new Date().toDateString()
      };
      sessions.push(newSession);
      localStorage.setItem('focusSessions', JSON.stringify(sessions));
      
      // Check achievements after saving session
      const userStats = calculateFocusStats(sessions, updatedCategories);
      const newAchievements = achievementService.checkAchievements(userStats);
      
      if (newAchievements.length > 0) {
        console.log(`🎉 Unlocked ${newAchievements.length} achievement(s)!`);
        newAchievements.forEach(achievement => {
          showAchievementToast(achievement);
        });
      }
      
      console.log(`💾 Saved ${timeSpent} minutes to ${finalCategory} category`);
      onSave(finalCategory);
    }
  };

  // Reset modal state
  const resetModal = () => {
    setSelectedCategory('');
    setCustomCategoryName('');
    setShowCustomInput(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCategoryData = savedCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-lg relative rounded-lg bg-black/40 backdrop-blur-md"
      >
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              {sessionType === 'partial' ? 'PARTIAL SESSION COMPLETE!' : 'SESSION COMPLETE!'}
            </h3>
            <p className="font-mono text-white text-lg">
              +{timeSpent} minutes earned
            </p>
            <p className="font-mono text-gray-400 text-sm mt-1">
              Choose a skill branch to gain XP or discard
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <div className="text-sm font-mono text-white mb-3">SELECT CATEGORY:</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {savedCategories.map(category => {
                const IconComponent = getIconComponent(category.iconName || category.icon);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-3 border-2 border-white rounded-lg transition-all duration-200 font-mono text-xs bg-black/20 hover:bg-black/40 relative overflow-hidden"
                    style={{
                      boxShadow: selectedCategory === category.id ? `0 0 20px ${category.color}, 0 0 40px ${category.color}` : 'none'
                    }}
                  >
                    <div 
                      className={`absolute inset-0 transition-all duration-300 ${
                        selectedCategory === category.id 
                          ? 'opacity-30' 
                          : 'opacity-10 hover:opacity-20'
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`
                      }}
                    />
                    <div className="flex flex-col items-center gap-1 relative z-10">
                      <IconComponent size={16} style={{ color: category.color }} />
                      <span className="text-white font-bold truncate w-full">{category.name}</span>
                      <div 
                        className="text-xs font-bold"
                        style={{ color: category.color }}
                      >
                        {category.xp || 0}m XP
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Button */}
            <button
              onClick={handleCustomCategory}
              className="w-full p-3 border-2 border-white rounded-lg transition-all duration-200 font-mono text-sm bg-black/20 hover:bg-black/40 relative overflow-hidden"
              style={{
                boxShadow: selectedCategory === 'custom' ? '0 0 20px #8B5CF6, 0 0 40px #8B5CF6' : 'none'
              }}
            >
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transition-all duration-300 ${
                  selectedCategory === 'custom' ? 'opacity-30' : 'opacity-10 hover:opacity-20'
                }`}
              />
              <div className="flex items-center justify-center gap-2 relative z-10">
                <Plus size={16} className="text-gray-400" />
                <span className="text-white">Create New Skill Branch</span>
              </div>
            </button>

            {/* Custom Category Input */}
            {showCustomInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3"
              >
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full p-3 bg-black/60 border-2 border-white/30 rounded-lg text-white font-mono text-sm focus:border-white focus:outline-none backdrop-blur-sm"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          {/* XP Preview */}
          {selectedCategoryData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-white/30 rounded-lg p-3 mb-6 bg-black/20 backdrop-blur-sm"
            >
              <div className="text-center font-mono">
                <div className="text-sm text-gray-400">XP GAIN PREVIEW:</div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: selectedCategoryData.color }}
                >
                  {selectedCategoryData.name}: {(selectedCategoryData.xp || 0)}m → {(selectedCategoryData.xp || 0) + timeSpent}m
                </div>
                <div className="text-xs text-white font-bold">+{timeSpent} XP gained!</div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!selectedCategory || (selectedCategory === 'custom' && !customCategoryName.trim())}
              className="flex-1 border-2 border-white px-4 py-3 font-mono font-bold text-white transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: (!selectedCategory || (selectedCategory === 'custom' && !customCategoryName.trim())) ? 'none' : '0 0 20px #00FF7F, 0 0 40px #00FF7F'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 transition-all duration-300 ${
                (!selectedCategory || (selectedCategory === 'custom' && !customCategoryName.trim())) ? 'opacity-0' : 'opacity-20 hover:opacity-40'
              }`} />
              <div className="flex items-center justify-center gap-2 relative z-10">
                <Save size={16} />
                <span>SAVE +{timeSpent} XP</span>
              </div>
            </button>

            <button
              onClick={onDiscard}
              className="flex-1 border-2 border-white px-4 py-3 font-mono font-bold text-white transition-all duration-300 bg-black/20 hover:bg-black/40 rounded-lg relative overflow-hidden"
              style={{
                boxShadow: '0 0 20px #FF1493, 0 0 40px #FF1493'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-20 hover:opacity-40 transition-all duration-300" />
              <div className="flex items-center justify-center gap-2 relative z-10">
                <Trash2 size={16} />
                <span>DISCARD</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Add helper function to calculate focus stats
const calculateFocusStats = (sessions, categories) => {
  const now = new Date();
  const today = now.toDateString();
  const thisWeek = getWeekStart(now);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Calculate focus statistics
  const totalSessions = sessions.length;
  const totalFocusTime = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
  const maxSessionDuration = Math.max(...sessions.map(s => s.timeSpent), 0);
  
  // Sessions by duration
  const sessionsByDuration = {};
  sessions.forEach(session => {
    sessionsByDuration[session.timeSpent] = (sessionsByDuration[session.timeSpent] || 0) + 1;
  });
  
  // Category statistics
  const categorySessions = {};
  const categoryTime = {};
  sessions.forEach(session => {
    categorySessions[session.category] = (categorySessions[session.category] || 0) + 1;
    categoryTime[session.category] = (categoryTime[session.category] || 0) + session.timeSpent;
  });
  
  // Time-based sessions
  const sessionsByTime = {};
  sessions.forEach(session => {
    const hour = new Date(session.createdAt).getHours();
    sessionsByTime[hour] = (sessionsByTime[hour] || 0) + 1;
  });
  
  // Streaks (simplified - you may want more sophisticated streak calculation)
  const focusStreak = calculateFocusStreak(sessions);
  
  // Today's sessions
  const todaySessions = sessions.filter(s => 
    new Date(s.createdAt).toDateString() === today
  ).length;
  
  // Week sessions
  const weekSessions = sessions.filter(s => 
    new Date(s.createdAt) >= thisWeek
  ).length;
  
  // Month sessions
  const monthSessions = sessions.filter(s => 
    new Date(s.createdAt) >= thisMonth
  ).length;
  
  // Long sessions (90+ minutes)
  const sessionsOver90Min = sessions.filter(s => s.timeSpent >= 90).length;
  
  // Break sessions (5-15 minutes)
  const breakSessions = sessions.filter(s => s.timeSpent >= 5 && s.timeSpent <= 15).length;
  
  return {
    totalSessions,
    totalFocusTime,
    maxSessionDuration,
    sessionsByDuration,
    categorySessions,
    categoryTime,
    sessionsByTime,
    focusStreak,
    todaySessions,
    weekSessions,
    monthSessions,
    sessionsOver90Min,
    breakSessions,
    uniqueCategories: Object.keys(categorySessions).length
  };
};

// Helper function for focus streak calculation
const calculateFocusStreak = (sessions) => {
  if (sessions.length === 0) return 0;
  
  const dates = [...new Set(sessions.map(s => new Date(s.createdAt).toDateString()))].sort();
  let streak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currentDate = new Date(dates[i]);
    const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return streak;
};

// Helper function for week start
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Add achievement toast notification function
const showAchievementToast = (achievement) => {
  // You can integrate with react-toastify or create custom notification
  console.log(`🏆 Achievement Unlocked: ${achievement.name}!`);
  // Example with custom notification (you'll need to implement this component)
  // toast.success(`🏆 ${achievement.name} unlocked! +${achievement.xpReward} XP`);
};

export default SaveSessionModal;