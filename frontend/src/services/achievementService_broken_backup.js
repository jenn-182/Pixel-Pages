// DEPRECATED - This service is being migrated to backend-only storage
// Use backendAchievementService instead
import backendAchievementService from './backendAchievementService';
import { allAchievements } from '../data/achievements';

console.warn('⚠️ achievementService is deprecated - use backendAchievementService instead');

class AchievementService {
  constructor() {
    console.warn('⚠️ This service is deprecated. Use backendAchievementService for all achievement operations.');
    this.listeners = [];
  }

  // Redirect all methods to backend service
  async loadUnlockedAchievements() {
    console.warn('⚠️ Use backendAchievementService.loadData() instead');
    return [];
  }

  isUnlocked(achievementId) {
    console.warn('⚠️ Use backendAchievementService.isUnlocked() instead');
    return backendAchievementService.isUnlocked(achievementId);
  }

  getUnlockedAchievements() {
    console.warn('⚠️ Use backendAchievementService.getUnlockedAchievements() instead');
    return backendAchievementService.getUnlockedAchievements();
  }

  async unlockAchievement(achievementId) {
    console.warn('⚠️ Use backendAchievementService.unlockAchievement() instead');
    return false;
  }

  getStats() {
    console.warn('⚠️ Use backendAchievementService.getStats() instead');
    return backendAchievementService.getStats();
  }

  resetAchievements() {
    console.warn('⚠️ Use backendAchievementService.resetAchievements() instead');
  }

  // Event listeners for backward compatibility
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(achievement) {
    this.listeners.forEach(callback => callback(achievement));
  }
}

// Export singleton instance
const achievementService = new AchievementService();
export default achievementService;
      
      // Store with timestamp
      const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
      achievementData.unlockDates = {
        ...achievementData.unlockDates,
        [achievementId]: new Date().toISOString()
      };
      
      localStorage.setItem('achievementData', JSON.stringify(achievementData));
      localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlockedIds)); // ✅ Store IDs only
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
      // Focus/Session requirements (existing)
      case 'session_count':
        return (userStats.totalSessions || 0) >= requirement.target;
      
      case 'total_time':
        return (userStats.totalFocusTime || userStats.totalFocusMinutes || 0) >= requirement.target;
      
      case 'max_session':
        return (userStats.maxSessionDuration || 0) >= requirement.target;
      
      case 'category_focus':
        const categoryTime = userStats.categoryTime || {};
        return (categoryTime[requirement.category] || 0) >= requirement.target;
      
      case 'all_categories_time':
        const allCategoryTime = userStats.categoryTime || {};
        const totalTimeAllCategories = Object.values(allCategoryTime).reduce((sum, time) => sum + time, 0);
        return totalTimeAllCategories >= requirement.target;
      
      case 'unique_categories':
        return (userStats.uniqueCategories || 0) >= requirement.target;

      // NOTE REQUIREMENTS
      case 'note_count':
        return (userStats.totalNotes || 0) >= requirement.target;
      
      case 'word_count':
        return (userStats.totalWords || 0) >= requirement.target;
      
      case 'tag_count':
      case 'unique_tags':
        return (userStats.uniqueTags || 0) >= requirement.target;
      
      case 'note_edits':
        return (userStats.totalEdits || 0) >= requirement.target;
      
      case 'single_note_edits':
        return (userStats.maxNoteEdits || userStats.maxEditsInNote || 0) >= requirement.target;
      
      case 'single_note_words':
        return (userStats.maxWordsInNote || 0) >= requirement.target;
      
      case 'single_note_tags':
        return (userStats.maxTagsInNote || 0) >= requirement.target;
      
      case 'weekend_notes':
        return (userStats.weekendNotes || 0) >= requirement.target;
      
      case 'weekly_notes':
        return (userStats.notesThisWeek || 0) >= requirement.target;
      
      case 'streak':
        return (userStats.noteStreak || 0) >= requirement.target;
      
      case 'time_range':
        return (userStats.timeRangeNotes || 0) >= 1;
      
      case 'speed_writing':
        return (userStats.speedWriting || 0) >= requirement.target;

      // TASK REQUIREMENTS
      case 'task_count':
        return (userStats.completedTasks || 0) >= requirement.target;
      
      case 'tasks_created':
        return (userStats.totalTasks || 0) >= requirement.target;
      
      case 'daily_tasks':
        return (userStats.tasksToday || 0) >= requirement.target;
      
      case 'weekly_tasks':
        return (userStats.tasksThisWeek || 0) >= requirement.target;
      
      case 'monthly_tasks':
        return (userStats.tasksThisMonth || 0) >= requirement.target;
      
      case 'high_priority_tasks':
        return (userStats.highPriorityTasks || 0) >= requirement.target;
      
      case 'early_completions':
        return (userStats.earlyCompletions || 0) >= requirement.target;
      
      case 'completion_streak':
        return (userStats.taskStreak || 0) >= requirement.target;
      
      case 'task_categories':
        return (userStats.taskCategories || 0) >= requirement.target;
      
      case 'priority_usage':
        return (userStats.priorityUsage || 0) >= requirement.target;
      
      case 'due_date_usage':
        return (userStats.dueDateUsage || 0) >= requirement.target;
      
      case 'completion_ratio':
        const totalTasks = userStats.totalTasks || 0;
        const completedTasks = userStats.completedTasks || 0;
        return totalTasks > 0 && (completedTasks / totalTasks) >= requirement.ratio;
      
      case 'morning_completions':
        return (userStats.morningCompletions || 0) >= requirement.target;
      
      case 'evening_completions':
        return (userStats.eveningCompletions || 0) >= requirement.target;
      
      case 'active_lists':
        return (userStats.activeLists || 0) >= requirement.target;
      
      case 'urgent_tasks':
        return (userStats.urgentTasks || 0) >= requirement.target;
      
      case 'ontime_rate':
        const totalWithDueDate = userStats.tasksWithDueDate || 0;
        const onTimeCompletions = userStats.onTimeCompletions || 0;
        return totalWithDueDate >= requirement.tasks && 
               (onTimeCompletions / totalWithDueDate) >= requirement.rate;
      
      case 'concurrent_tasks':
        return (userStats.maxConcurrentTasks || 0) >= requirement.target;

      // FOCUS/SESSION REQUIREMENTS (additional)
      case 'session_duration_range':
        return (userStats.sessionDurationRange || 0) >= 1;
      
      case 'break_session':
        return (userStats.breakSessions || 0) >= requirement.target;
      
      case 'time_before':
        return (userStats.timeBefore || 0) >= requirement.target;
      
      case 'time_after':
        return (userStats.timeAfter || 0) >= requirement.target;
      
      case 'pomodoro_count':
        return (userStats.pomodoroSessions || 0) >= requirement.target;
      
      case 'daily_streak':
        return (userStats.currentStreak || userStats.dailyStreak || 0) >= requirement.target;
      
      case 'category_sessions':
        const categorySessions = userStats.categorySessions || {};
        return (categorySessions[requirement.category] || 0) >= requirement.target;
      
      case 'duration_variety':
        return (userStats.durationVariety || 0) >= requirement.target;
      
      case 'category_time':
        const categoryTimeStats = userStats.categoryTime || {};
        return (categoryTimeStats[requirement.category] || 0) >= requirement.target;
      
      case 'long_sessions':
        return (userStats.longSessions || 0) >= requirement.target;
      
      case 'monthly_sessions':
        return (userStats.monthlyFocusSessions || 0) >= requirement.target;
      
      case 'time_variety':
        return (userStats.timeVariety || 0) >= requirement.target;

      // COMBO/SPECIAL REQUIREMENTS
      case 'daily_combo':
        return (userStats.dailyCombo || false);
      
      case 'weekly_combo':
        return (userStats.weeklyCombo || false);
      
      case 'achievement_count':
        return (userStats.completedAchievements || 0) >= requirement.target;
      
      case 'activity_consistency':
        return (userStats.currentStreak || 0) >= requirement.target;

      case 'category_mastery':
        return (userStats.categoryMastery || 0) >= requirement.target;
      
      case 'super_combo':
        return (userStats.superCombo || false);
      
      case 'weekend_activity':
        return (userStats.weekendActivity || 0) >= requirement.target;
      
      case 'late_night_activity':
        return (userStats.lateNightActivity || 0) >= requirement.target;
      
      case 'early_morning_activity':
        return (userStats.earlyMorningActivity || 0) >= requirement.target;
      
      case 'combo_streak':
        return (userStats.comboStreak || 0) >= requirement.target;
      
      case 'category_completion':
        return (userStats.categoryCompletion || 0) >= requirement.target;
      
      case 'daily_activity_streak':
        return (userStats.dailyActivityStreak || 0) >= requirement.target;
      
      case 'feature_usage':
        return (userStats.featureUsage || 0) >= requirement.target;
      
      case 'daily_activity_count':
        return (userStats.dailyActivityCount || 0) >= requirement.target;
      
      case 'monthly_activity_count':
        return (userStats.monthlyActivityCount || 0) >= requirement.target;
      
      case 'player_level':
        return (userStats.playerLevel || 0) >= requirement.target;
      
      case 'total_xp':
        return (userStats.totalXP || 0) >= requirement.target;
      
      case 'completion_percentage':
        return (userStats.completionPercentage || 0) >= requirement.target;
      
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

  // Force unlock an achievement (for testing)
  forceUnlock(achievementId) {
    console.log(`🧪 FORCE UNLOCK: ${achievementId}`);
    
    // Get current unlocked achievements and filter out nulls
    const currentUnlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      .filter(id => id !== null && id !== undefined);
    
    if (!currentUnlocked.includes(achievementId)) {
      const newUnlocked = [...currentUnlocked, achievementId];
      localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
      
      // Store with timestamp
      const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
      achievementData[achievementId] = {
        unlockedAt: new Date().toISOString(),
        progress: 100
      };
      localStorage.setItem('achievementData', JSON.stringify(achievementData));
      
      console.log(`✅ Force unlocked: ${achievementId}`);
      
      // Sync with backend
      this.syncAchievementWithBackend(achievementId);
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('achievementsUpdated'));
    } else {
      console.log(`⚠️ ${achievementId} already unlocked`);
    }
  }

  // Reset all achievements (for testing)
  resetAchievements() {
    console.log('🧪 RESET: Clearing all achievements');
    localStorage.removeItem('unlockedAchievements');
    localStorage.removeItem('achievementData');
    window.dispatchEvent(new CustomEvent('achievementsUpdated'));
  }

  // Clean up localStorage (remove null values)
  cleanupLocalStorage() {
    const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      .filter(id => id !== null && id !== undefined);
    
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedIds));
    console.log('🧹 Cleaned up localStorage, removed null values');
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
    const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      .filter(id => id !== null && id !== undefined);
    
    return unlockedIds.map(id => {
      const achievement = allAchievements.find(a => a.id === id);
      if (!achievement) {
        console.warn(`⚠️ Achievement with id ${id} not found`);
        return null;
      }
      
      const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
      const data = achievementData[id] || {};
      
      return {
        ...achievement,
        unlockedAt: data.unlockedAt || new Date().toISOString(),
        progress: data.progress || 100
      };
    }).filter(Boolean);
  }

  // Recalculate and unlock all achievements based on current user stats
  async recalculateAchievements(userStats) {
    console.log('🔄 RECALCULATING ACHIEVEMENTS based on current stats:', userStats);
    
    const previouslyUnlocked = this.getUnlockedAchievements().map(a => a.id);
    const newlyUnlocked = [];
    
    // Check every achievement against current stats
    allAchievements.forEach(achievement => {
      if (!previouslyUnlocked.includes(achievement.id)) {
        if (this.meetsRequirement(achievement.requirement, userStats)) {
          console.log(`🏆 Should unlock: ${achievement.id} - ${achievement.name}`);
          if (this.unlockAchievement(achievement.id)) {
            newlyUnlocked.push(achievement);
          }
        } else {
          // Show progress for close achievements
          const progress = this.getAchievementProgress(achievement.id, userStats);
          if (progress > 0.5) {
            console.log(`📈 Close to unlocking: ${achievement.id} - ${Math.round(progress * 100)}%`);
          }
        }
      }
    });
    
    console.log(`✅ Recalculation complete! Unlocked ${newlyUnlocked.length} new achievements:`, 
      newlyUnlocked.map(a => a.name));
    
    return newlyUnlocked;
  }

  // Enhanced data gathering that checks multiple possible storage keys
  async getCurrentUserStats() {
    console.log('📊 GATHERING USER STATS FROM ALL SOURCES...');
    
    try {
      const username = 'user';
      
      const [notesResponse, tasksResponse, focusEntriesResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/notes?username=${username}`).catch(() => ({ ok: false })),
        fetch(`http://localhost:8080/api/tasks?username=${username}`).catch(() => ({ ok: false })), // ✅ Add tasks
        fetch(`http://localhost:8080/api/focus/entries?username=${username}`).catch(() => ({ ok: false })) // ✅ Use entries
      ]);
      
      const notes = notesResponse.ok ? await notesResponse.json() : [];
      const tasks = tasksResponse.ok ? await tasksResponse.json() : []; // ✅ Get real tasks
      const focusSessions = focusEntriesResponse.ok ? await focusEntriesResponse.json() : [];
      
      console.log(`📝 Found notes from backend: ${notes.length} notes`);
      console.log(`✅ Found tasks from backend: ${tasks.length} tasks`); // ✅ Real task count
      console.log(`⏱️ Found focus entries from backend: ${focusSessions.length} sessions`);
      
      // Calculate comprehensive stats
      const stats = {
        // Notes stats (from backend)
        totalNotes: notes.length,
        totalWords: this.calculateTotalWords(notes),
        uniqueTags: this.calculateUniqueTags(notes),
        notesToday: this.calculateNotesToday(notes),
        noteStreak: this.calculateNoteStreak(notes),
        maxWordsInNote: this.calculateMaxWords(notes),
        maxTagsInNote: this.calculateMaxTags(notes),
        maxNoteEdits: this.calculateMaxEditsInNote(notes),
        totalEdits: this.calculateTotalEdits(notes),
        notesThisWeek: this.calculateNotesThisWeek(notes),
        weekendNotes: this.calculateWeekendNotes(notes),
        
        // Tasks stats (from backend) ✅ Now will work!
        totalTasks: tasks.length,
        completedTasks: this.calculateCompletedTasks(tasks),
        tasksToday: this.calculateTasksToday(tasks),
        taskStreak: this.calculateTaskStreak(tasks),
        highPriorityTasks: this.calculateHighPriorityTasks(tasks),
        earlyCompletions: this.calculateEarlyCompletions(tasks),
        tasksThisWeek: this.calculateTasksThisWeek(tasks),
        tasksThisMonth: this.calculateTasksThisMonth(tasks),
        taskCategories: this.calculateTaskCategories(tasks),
        priorityUsage: this.calculatePriorityUsage(tasks),
        dueDateUsage: this.calculateDueDateUsage(tasks),
        
        // Focus stats (from backend)
        totalSessions: focusSessions.length,
        totalFocusTime: this.calculateTotalFocusTime(focusSessions),
        totalFocusMinutes: this.calculateTotalFocusMinutes(focusSessions),
        maxSessionDuration: this.calculateMaxSessionDuration(focusSessions),
        focusStreak: this.calculateFocusStreak(focusSessions),
        averageSessionLength: this.calculateAverageSessionLength(focusSessions),
        categoryTime: this.calculateCategoryTime(focusSessions),
        categorySessions: this.calculateCategorySessions(focusSessions),
        uniqueCategories: this.calculateUniqueCategories(focusSessions),
        
        // Combined stats
        daysActive: this.calculateDaysActive(notes, tasks, focusSessions),
        currentStreak: this.calculateCurrentStreak(notes, tasks, focusSessions),
        completedAchievements: this.getUnlockedAchievements().length
      };
      
      console.log('📊 CALCULATED STATS:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Error fetching user stats from backend:', error);
      
      // Fallback to localStorage
      console.log('🔄 Falling back to localStorage...');
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const focusSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      
      console.log(`📝 Found notes data in localStorage: ${notes.length} notes`);
      console.log(`✅ Found tasks data in localStorage: ${tasks.length} tasks`);
      console.log(`⏱️ Found focus sessions data in localStorage: ${focusSessions.length} sessions`);
      
      // ... same stats calculation with fallback data ...
      return this.calculateStatsFromLocalStorage(notes, tasks, focusSessions);
    }
  }

  // Helper calculation methods
  calculateTotalWords(notes) {
    return notes.reduce((total, note) => {
      const content = note.content || note.text || note.body || '';
      const words = content.split(/\s+/).filter(word => word.length > 0);
      return total + words.length;
    }, 0);
  }

  calculateUniqueTags(notes) {
    const allTags = new Set();
    notes.forEach(note => {
      const tags = note.tags || note.categories || [];
      if (Array.isArray(tags)) {
        tags.forEach(tag => allTags.add(tag));
      }
    });
    return allTags.size;
  }

  calculateNotesToday(notes) {
    const today = new Date().toDateString();
    return notes.filter(note => {
      const date = note.createdAt || note.created || note.date;
      return date && new Date(date).toDateString() === today;
    }).length;
  }

  calculateNoteStreak(notes) {
    if (notes.length === 0) return 0;
    
    const notesByDate = {};
    notes.forEach(note => {
      const date = note.createdAt || note.created || note.date;
      if (date) {
        const dateStr = new Date(date).toDateString();
        notesByDate[dateStr] = true;
      }
    });
    
    const sortedDates = Object.keys(notesByDate).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const noteDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate - noteDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateMaxWords(notes) {
    return Math.max(...notes.map(note => {
      const content = note.content || note.text || note.body || '';
      return content.split(/\s+/).filter(word => word.length > 0).length;
    }), 0);
  }

  calculateMaxTags(notes) {
    return Math.max(...notes.map(note => {
      const tags = note.tags || note.categories || [];
      return Array.isArray(tags) ? tags.length : 0;
    }), 0);
  }

  calculateMaxEditsInNote(notes) {
    return Math.max(...notes.map(note => {
      return note.editCount || note.edits || 1;
    }), 0);
  }

  calculateTotalEdits(notes) {
    return notes.reduce((total, note) => {
      return total + (note.editCount || note.edits || 1);
    }, 0);
  }

  calculateNotesThisWeek(notes) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return notes.filter(note => {
      const date = note.createdAt || note.created || note.date;
      return date && new Date(date) >= oneWeekAgo;
    }).length;
  }

  calculateWeekendNotes(notes) {
    return notes.filter(note => {
      const date = new Date(note.createdAt || note.created || note.date);
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    }).length;
  }

  calculateCompletedTasks(tasks) {
    return tasks.filter(task => 
      task.completed || task.done || task.status === 'completed' || task.status === 'done'
    ).length;
  }

  calculateTasksToday(tasks) {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      const date = task.completedAt || task.createdAt || task.created || task.date;
      return date && new Date(date).toDateString() === today;
    }).length;
  }

  calculateTaskStreak(tasks) {
    const completedTasks = tasks.filter(task => 
      task.completed || task.done || task.status === 'completed'
    );
    
    if (completedTasks.length === 0) return 0;
    
    const tasksByDate = {};
    completedTasks.forEach(task => {
      const date = task.completedAt || task.createdAt || task.created || task.date;
      if (date) {
        const dateStr = new Date(date).toDateString();
        tasksByDate[dateStr] = true;
      }
    });
    
    const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const taskDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate - taskDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateHighPriorityTasks(tasks) {
    return tasks.filter(task => 
      (task.completed || task.done || task.status === 'completed') &&
      (task.priority === 'high' || task.priority === 'urgent' || task.priority === 3)
    ).length;
  }

  calculateEarlyCompletions(tasks) {
    return tasks.filter(task => {
      if (!task.completed && !task.done) return false;
      
      const completedDate = new Date(task.completedAt || task.created);
      const dueDate = new Date(task.dueDate || task.due || task.deadline);
      
      return dueDate && completedDate < dueDate;
    }).length;
  }

  calculateTasksThisWeek(tasks) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(task => {
      const date = task.completedAt || task.createdAt || task.created || task.date;
      return date && new Date(date) >= oneWeekAgo;
    }).length;
  }

  calculateTasksThisMonth(tasks) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return tasks.filter(task => {
      const date = task.completedAt || task.createdAt || task.created;
      return date && new Date(date) >= oneMonthAgo;
    }).length;
  }

  calculateTaskCategories(tasks) {
    const categories = new Set();
    tasks.forEach(task => {
      if (task.category) {
        categories.add(task.category);
      }
    });
    return categories.size;
  }

  calculatePriorityUsage(tasks) {
    return tasks.filter(task => task.priority && task.priority !== 'none').length;
  }

  calculateDueDateUsage(tasks) {
    return tasks.filter(task => task.dueDate || task.due || task.deadline).length;
  }

  calculateTotalFocusTime(sessions) {
    return sessions.reduce((total, session) => {
      return total + (session.timeSpent || session.duration || session.time || 0);
    }, 0);
  }

  calculateMaxSessionDuration(sessions) {
    return Math.max(...sessions.map(session => 
      session.timeSpent || session.duration || session.time || 0
    ), 0);
  }

  calculateFocusStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const sessionsByDate = {};
    sessions.forEach(session => {
      const date = session.createdAt || session.date || session.timestamp;
      if (date) {
        const dateStr = new Date(date).toDateString();
        sessionsByDate[dateStr] = true;
      }
    });
    
    const sortedDates = Object.keys(sessionsByDate).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const sessionDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateAverageSessionLength(sessions) {
    if (sessions.length === 0) return 0;
    const totalTime = this.calculateTotalFocusTime(sessions);
    return Math.round(totalTime / sessions.length);
  }

  calculateTotalFocusMinutes(sessions) {
    return sessions.reduce((total, session) => {
      const duration = session.duration || session.time || session.minutes || 0;
      // Convert to minutes if it's in seconds
      return total + (duration > 300 ? Math.round(duration / 60) : duration);
    }, 0);
  }

  calculateCategoryTime(sessions) {
    const categoryTime = {};
    sessions.forEach(session => {
      const category = session.category || 'general';
      const time = session.timeSpent || session.duration || session.time || 0;
      categoryTime[category] = (categoryTime[category] || 0) + time;
    });
    return categoryTime;
  }

  calculateCategorySessions(sessions) {
    const categorySessions = {};
    sessions.forEach(session => {
      const category = session.category || 'general';
      categorySessions[category] = (categorySessions[category] || 0) + 1;
    });
    return categorySessions;
  }

  calculateUniqueCategories(sessions) {
    const categories = new Set();
    sessions.forEach(session => {
      if (session.category) {
        categories.add(session.category);
      }
    });
    return categories.size;
  }

  calculateSessionsByDuration(sessions) {
    const sessionsByDuration = {};
    sessions.forEach(session => {
      const duration = session.timeSpent || session.duration || session.time || 0;
      sessionsByDuration[duration] = (sessionsByDuration[duration] || 0) + 1;
    });
    return sessionsByDuration;
  }

  // Override the total focus time calculation for your data structure
  calculateTotalFocusTime(sessions) {
    return sessions.reduce((total, session) => {
      return total + (session.timeSpent || session.duration || session.time || session.minutes || 0);
    }, 0);
  }

  // Override max session duration for your data structure
  calculateMaxSessionDuration(sessions) {
    return Math.max(...sessions.map(session => 
      session.timeSpent || session.duration || session.time || session.minutes || 0
    ), 0);
  }

  calculateDaysActive(notes, tasks, sessions) {
    const allDates = new Set();
    
    [...notes, ...tasks, ...sessions].forEach(item => {
      const date = item.createdAt || item.created || item.date || item.timestamp;
      if (date) {
        allDates.add(new Date(date).toDateString());
      }
    });
    
    return allDates.size;
  }

  calculateCurrentStreak(notes, tasks, sessions) {
    // Combined activity streak
    const allDates = new Set();
    
    [...notes, ...tasks, ...sessions].forEach(item => {
      const date = item.createdAt || item.created || item.date || item.timestamp;
      if (date) {
        allDates.add(new Date(date).toDateString());
      }
    });
    
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const activityDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const achievementService = new AchievementService();
export default achievementService;