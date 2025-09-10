import { allAchievements, tierInfo } from '../data/achievements';

class AchievementService {
  constructor() {
    this.unlockedAchievements = this.loadUnlockedAchievements();
    this.listeners = [];
  }

  // Load unlocked achievements from localStorage
  loadUnlockedAchievements() {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  }

  // Save unlocked achievements to localStorage
  saveUnlockedAchievements() {
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
  }

  // Add event listener for achievement unlocks
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  // Remove event listener
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify listeners of achievement unlock
  notifyListeners(achievement) {
    this.listeners.forEach(callback => callback(achievement));
  }

  // Check if achievement is unlocked
  isUnlocked(achievementId) {
    return this.unlockedAchievements.some(a => a.id === achievementId);
  }

  // Unlock achievement
  unlockAchievement(achievementId) {
    if (this.isUnlocked(achievementId)) return false;
    
    const achievement = allAchievements.find(a => a.id === achievementId);
    if (!achievement) return false;

    const unlockedAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString()
    };

    this.unlockedAchievements.push(unlockedAchievement);
    this.saveUnlockedAchievements();
    
    // Trigger achievement notification
    this.triggerAchievementNotification(achievement);
    this.notifyListeners(achievement);
    
    // Track when achievements are unlocked
    this.trackAchievementUnlock(achievementId);
    
    return true;
  }

  // Track when achievements are unlocked
  trackAchievementUnlock(achievementId) {
    const unlockedAchievements = this.getUnlockedAchievements();
    
    if (!unlockedAchievements.includes(achievementId)) {
      const newUnlocked = [...unlockedAchievements, achievementId];
      
      // Store with timestamp
      const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
      achievementData.unlockedAchievements = newUnlocked;
      achievementData.unlockDates = {
        ...achievementData.unlockDates,
        [achievementId]: new Date().toISOString()
      };
      
      localStorage.setItem('achievementData', JSON.stringify(achievementData));
      localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
    }
  }

  // Check achievements based on user stats
  checkAchievements(userStats) {
    const newlyUnlocked = [];

    allAchievements.forEach(achievement => {
      if (!this.isUnlocked(achievement.id)) {
        if (this.meetsRequirement(achievement.requirement, userStats)) {
          if (this.unlockAchievement(achievement.id)) {
            newlyUnlocked.push(achievement);
          }
        }
      }
    });

    return newlyUnlocked;
  }

  // Enhanced requirement checking
  meetsRequirement(requirement, userStats) {
    switch (requirement.type) {
      // Note achievements
      case 'note_count':
        return (userStats.totalNotes || 0) >= requirement.target;
      
      case 'word_count':
        return (userStats.totalWords || 0) >= requirement.target;
      
      case 'unique_tags':
        return (userStats.uniqueTags || 0) >= requirement.target;
      
      case 'daily_notes':
        return (userStats.notesToday || 0) >= requirement.target;
      
      case 'weekend_notes':
        return (userStats.weekendNotes || 0) >= requirement.target;
      
      case 'weekly_notes':
        return (userStats.notesThisWeek || 0) >= requirement.target;
      
      case 'single_note_words':
        return (userStats.maxWordsInNote || 0) >= requirement.target;
      
      case 'single_note_tags':
        return (userStats.maxTagsInNote || 0) >= requirement.target;
      
      case 'streak':
        return (userStats.noteStreak || 0) >= requirement.target;
      
      case 'note_edits':
        return (userStats.totalEdits || 0) >= requirement.target;
      
      case 'single_note_edits':
        return (userStats.maxEditsOnNote || 0) >= requirement.target;
      
      // Task achievements
      case 'task_count':
        return (userStats.totalTasks || 0) >= requirement.target;
      
      case 'daily_tasks':
        return (userStats.tasksToday || 0) >= requirement.target;
      
      case 'weekly_tasks':
        return (userStats.tasksThisWeek || 0) >= requirement.target;
      
      case 'monthly_tasks':
        return (userStats.tasksThisMonth || 0) >= requirement.target;
      
      case 'high_priority_tasks':
        return (userStats.highPriorityTasks || 0) >= requirement.target;
      
      case 'urgent_tasks':
        return (userStats.urgentTasks || 0) >= requirement.target;
      
      case 'early_completions':
        return (userStats.earlyCompletions || 0) >= requirement.target;
      
      case 'completion_streak':
        return (userStats.taskStreak || 0) >= requirement.target;
      
      case 'task_categories':
        return (userStats.taskCategories || 0) >= requirement.target;
      
      case 'task_creation':
        return (userStats.tasksCreated || 0) >= requirement.target;
      
      case 'active_tasks':
        return (userStats.activeTasks || 0) >= requirement.target;
      
      case 'completion_rate':
        const completionRate = userStats.totalTasks > 0 ? 
          (userStats.completedTasks || 0) / userStats.totalTasks : 0;
        return completionRate >= requirement.target;
      
      // Focus achievements
      case 'session_count':
        return (userStats.totalSessions || 0) >= requirement.target;
      
      case 'total_time':
        return (userStats.totalFocusTime || 0) >= requirement.target;
      
      case 'single_session_duration':
        return (userStats.maxSessionDuration || 0) >= requirement.target;
      
      case 'session_duration_range':
        const rangeSessions = userStats.sessionsByDuration || {};
        let rangeCount = 0;
        for (let duration = requirement.minDuration; duration <= requirement.maxDuration; duration++) {
          rangeCount += rangeSessions[duration] || 0;
        }
        return rangeCount >= requirement.target;
      
      case 'pomodoro_count':
        const pomodoroSessions = userStats.sessionsByDuration?.[25] || 0;
        return pomodoroSessions >= requirement.target;
      
      case 'daily_streak':
        return (userStats.focusStreak || 0) >= requirement.target;
      
      case 'category_sessions':
        const categorySessions = userStats.categorySessions || {};
        return (categorySessions[requirement.category] || 0) >= requirement.target;
      
      case 'category_time':
        const categoryTime = userStats.categoryTime || {};
        return Math.max(...Object.values(categoryTime)) >= requirement.target;
      
      case 'all_categories_time':
        const allCategoryTime = userStats.categoryTime || {};
        return Object.values(allCategoryTime).every(time => time >= requirement.target);
      
      case 'unique_categories':
        const uniqueCategories = Object.keys(userStats.categorySessions || {}).length;
        return uniqueCategories >= requirement.target;
      
      case 'break_session':
        const breakSessions = userStats.breakSessions || 0;
        return breakSessions >= requirement.target;
      
      case 'long_sessions':
        const longSessions = userStats.sessionsOver90Min || 0;
        return longSessions >= requirement.target;
      
      case 'time_variety':
        const sessionTimes = Object.keys(userStats.sessionsByTime || {}).length;
        return sessionTimes >= requirement.target;
      
      // Combo achievements
      case 'daily_combo':
        const dailyActivities = userStats.dailyActivities || [];
        return requirement.activities.every(activity => dailyActivities.includes(activity));
      
      case 'weekly_combo':
        const weeklyActivities = userStats.weeklyActivities || [];
        return requirement.activities.every(activity => weeklyActivities.includes(activity));
      
      case 'combo_streak':
        return (userStats.comboStreak || 0) >= requirement.target;
      
      case 'activity_consistency':
        return (userStats.activityStreak || 0) >= requirement.target;
      
      case 'daily_activity_count':
        return (userStats.activitiesToday || 0) >= requirement.target;
      
      case 'monthly_activity_count':
        return (userStats.activitiesThisMonth || 0) >= requirement.target;
      
      // Meta achievements
      case 'player_level':
        return (userStats.level || 1) >= requirement.target;
      
      case 'total_xp':
        return (userStats.totalXP || 0) >= requirement.target;
      
      case 'achievement_count':
        return this.unlockedAchievements.length >= requirement.target;
      
      case 'completion_percentage':
        return (this.unlockedAchievements.length / allAchievements.length) >= requirement.target;
      
      case 'tier_completion':
        const tierAchievements = allAchievements.filter(a => a.tier === requirement.tier);
        const unlockedInTier = this.unlockedAchievements.filter(a => a.tier === requirement.tier);
        return (unlockedInTier.length / tierAchievements.length) >= requirement.target;
      
      // Time-based achievements
      case 'time_range':
        const now = new Date();
        const hour = now.getHours();
        if (requirement.startHour > requirement.endHour) {
          // Crosses midnight
          return hour >= requirement.startHour || hour < requirement.endHour;
        }
        return hour >= requirement.startHour && hour < requirement.endHour;
      
      case 'time_before':
        return new Date().getHours() < requirement.hour;
      
      case 'time_after':
        return new Date().getHours() >= requirement.hour;
      
      case 'weekend_activity':
        const dayOfWeek = new Date().getDay();
        return (dayOfWeek === 0 || dayOfWeek === 6) && (userStats.weekendActivities || 0) >= requirement.target;
      
      case 'speed_writing':
        return (userStats.fastestWordsPer5Min || 0) >= requirement.words;
      
      default:
        console.warn(`Unknown requirement type: ${requirement.type}`);
        return false;
    }
  }

  // Trigger achievement notification with enhanced styling
  triggerAchievementNotification(achievement) {
    const tier = tierInfo[achievement.tier];
    
    console.log(`🎉 ${tier.emoji} ${achievement.name} UNLOCKED! (+${achievement.xpReward} XP)`);
    
    // Dispatch custom event for UI components
    window.dispatchEvent(new CustomEvent('achievementUnlocked', {
      detail: {
        achievement,
        tier,
        timestamp: new Date().toISOString()
      }
    }));

    // Play achievement sound (if available)
    this.playAchievementSound(achievement.tier);
  }

  // Play achievement sound based on tier
  playAchievementSound(tier) {
    try {
      const audio = new Audio(`/sounds/achievement_${tier}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {
        console.log(`Sound not found for tier: ${tier}`);
      });
    } catch (error) {
      console.error('Error playing achievement sound:', error);
    }
  }

  // Get achievement progress
  getAchievementProgress(achievementId, userStats) {
    const achievement = allAchievements.find(a => a.id === achievementId);
    if (!achievement || this.isUnlocked(achievementId)) return 1;

    const req = achievement.requirement;
    let current = 0;
    let target = req.target || 1;

    switch (req.type) {
      case 'note_count':
        current = userStats.totalNotes || 0;
        break;
      case 'word_count':
        current = userStats.totalWords || 0;
        break;
      case 'task_count':
        current = userStats.totalTasks || 0;
        break;
      case 'session_count':
        current = userStats.totalSessions || 0;
        break;
      case 'total_time':
        current = userStats.totalFocusTime || 0;
        break;
      case 'unique_tags':
        current = userStats.uniqueTags || 0;
        break;
      case 'streak':
      case 'completion_streak':
      case 'daily_streak':
        current = userStats[req.type === 'streak' ? 'noteStreak' : 
                            req.type === 'completion_streak' ? 'taskStreak' : 'focusStreak'] || 0;
        break;
      default:
        return 0;
    }

    return Math.min(current / target, 1);
  }

  // Get user's next achievements to unlock
  getNextAchievements(userStats, limit = 5) {
    return allAchievements
      .filter(achievement => !this.isUnlocked(achievement.id))
      .map(achievement => ({
        ...achievement,
        progress: this.getAchievementProgress(achievement.id, userStats)
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, limit);
  }

  // Get recently unlocked achievements
  getRecentlyUnlocked(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.unlockedAchievements
      .filter(achievement => new Date(achievement.unlockedAt) >= cutoffDate)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
  }

  // Get stats summary
  getStats() {
    const total = allAchievements.length;
    const unlocked = this.unlockedAchievements.length;
    const byTier = {
      common: this.unlockedAchievements.filter(a => a.tier === 'common').length,
      uncommon: this.unlockedAchievements.filter(a => a.tier === 'uncommon').length,
      rare: this.unlockedAchievements.filter(a => a.tier === 'rare').length,
      legendary: this.unlockedAchievements.filter(a => a.tier === 'legendary').length
    };

    const totalXP = this.unlockedAchievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);

    return {
      total,
      unlocked,
      percentage: Math.round((unlocked / total) * 100),
      byTier,
      totalXP,
      recentUnlocks: this.getRecentlyUnlocked(7).length
    };
  }

  // Reset all achievements (for testing)
  resetAchievements() {
    this.unlockedAchievements = [];
    this.saveUnlockedAchievements();
    console.log('🔄 All achievements reset!');
  }

  // Manually unlock achievement (for testing)
  forceUnlock(achievementId) {
    return this.unlockAchievement(achievementId);
  }

  // Get achievement with unlock date
  getAchievementWithUnlockDate(achievement) {
    const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
    const unlockDates = achievementData.unlockDates || {};
    
    return {
      ...achievement,
      unlockedAt: unlockDates[achievement.id] || null
    };
  }

  // Get unlocked achievements
  getUnlockedAchievements() {
    return this.unlockedAchievements.map(a => a.id);
  }
}

export const achievementService = new AchievementService();
export default achievementService;