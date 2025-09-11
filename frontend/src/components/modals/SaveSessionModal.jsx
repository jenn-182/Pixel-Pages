import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Plus, Trophy, Code, BookOpen, Briefcase, Palette, User } from 'lucide-react';
import apiService from '../../services/api';
import achievementService from '../../services/achievementService';

const SaveSessionModal = ({ 
  isOpen, 
  onSave, 
  onDiscard, 
  timeSpent, 
  sessionType = 'session',
  username = 'user' // Add username prop
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [savedCategories, setSavedCategories] = useState([]);

  // Icon mapping function
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

  // Load categories from localStorage only
  useEffect(() => {
    const loadCategories = async () => {
      // Default categories
      const defaultCategories = [
        { id: 'study', name: 'Study', iconName: 'BookOpen', color: '#3B82F6', xp: 0 },
        { id: 'work', name: 'Work', iconName: 'Briefcase', color: '#10B981', xp: 0 },
        { id: 'read', name: 'Read', iconName: 'BookOpen', color: '#8B5CF6', xp: 0 },
        { id: 'create', name: 'Create', iconName: 'Palette', color: '#F59E0B', xp: 0 },
        { id: 'code', name: 'Code', iconName: 'Code', color: '#EF4444', xp: 0 }
      ];

      // Get categories from localStorage
      const saved = localStorage.getItem('focusCategories');
      if (saved) {
        setSavedCategories(JSON.parse(saved));
      } else {
        // Initialize with defaults
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
      
      // 🎮 CHECK ACHIEVEMENTS AFTER SAVING SESSION
      const userStats = calculateFocusStats(sessions, updatedCategories);
      const newAchievements = achievementService.checkAchievements(userStats);
      
      if (newAchievements.length > 0) {
        console.log(`🎉 Unlocked ${newAchievements.length} achievement(s)!`);
        // Show achievement notifications in UI
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
        className="bg-gray-800 border-2 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative"
        style={{
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-700/20 pointer-events-none" />
        <div className="absolute inset-0 border-2 border-purple-500 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              {sessionType === 'partial' ? 'PARTIAL SESSION COMPLETE!' : 'SESSION COMPLETE!'}
            </h3>
            <p className="font-mono text-purple-400 text-lg">
              +{timeSpent} minutes earned
            </p>
            <p className="font-mono text-gray-400 text-sm mt-1">
              Choose a category to gain XP or discard
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <div className="text-sm font-mono text-gray-300 mb-3">SELECT CATEGORY:</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {savedCategories.map(category => {
                // Fix: Get the icon component dynamically
                const IconComponent = getIconComponent(category.iconName || category.icon);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-3 border-2 transition-all duration-200 font-mono text-sm ${
                      selectedCategory === category.id
                        ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent size={16} style={{ color: category.color }} />
                      <span className="text-white font-bold">{category.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {category.xp || 0}m XP
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Button */}
            <button
              onClick={handleCustomCategory}
              className={`w-full p-3 border-2 transition-all duration-200 font-mono text-sm ${
                selectedCategory === 'custom'
                  ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={16} className="text-gray-400" />
                <span className="text-gray-300">Create New Category</span>
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
                  className="w-full p-3 bg-gray-900 border border-gray-600 text-white font-mono text-sm focus:border-purple-400 focus:outline-none"
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
              className="bg-gray-900 border border-purple-500 p-3 mb-6"
            >
              <div className="text-center font-mono">
                <div className="text-sm text-gray-400">XP GAIN PREVIEW:</div>
                <div className="text-lg text-purple-400 font-bold">
                  {selectedCategoryData.name}: {(selectedCategoryData.xp || 0)}m → {(selectedCategoryData.xp || 0) + timeSpent}m
                </div>
                <div className="text-xs text-green-400">+{timeSpent} XP gained!</div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!selectedCategory || (selectedCategory === 'custom' && !customCategoryName.trim())}
              className="flex-1 bg-gray-900 border-2 border-green-500 px-4 py-3 font-mono font-bold text-green-500 hover:bg-green-500 hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Save size={16} />
                <span>SAVE +{timeSpent} XP</span>
              </div>
            </button>

            <button
              onClick={onDiscard}
              className="flex-1 bg-gray-900 border-2 border-red-500 px-4 py-3 font-mono font-bold text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
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

export default SaveSessionModal;

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