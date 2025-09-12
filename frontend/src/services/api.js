// src/services/api.js
const API_BASE = 'http://localhost:8080/api';

const apiService = {
  // Notes API calls
  async fetchNotes() {
    const response = await fetch(`${API_BASE}/notes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async createNote(noteData) {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async updateNote(id, noteData) {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async deleteNote(id) {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  async searchNotes(query) {
    const response = await fetch(
      `${API_BASE}/notes/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // // Player API calls
  // async getPlayerStats(username) {
  //   const response = await fetch(`${API_BASE}/players/${username}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  //   }
  //   return response.json();
  // },

  async getTasks(username) {
    const response = await fetch(`${API_BASE}/tasks?username=${username}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async getTaskLists(username) {
    const response = await fetch(
      `${API_BASE}/task-lists?username=${username}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // =================== FOCUS SESSIONS API ===================
  
  // Get focus sessions
  async getFocusSessions(username, options = {}) {
    const params = new URLSearchParams({ username });
    if (options.category) params.append('category', options.category);
    if (options.activeOnly !== undefined) params.append('activeOnly', options.activeOnly);
    
    const response = await fetch(`${API_BASE}/focus/sessions?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get single focus session
  async getFocusSession(sessionId) {
    const response = await fetch(`${API_BASE}/focus/sessions/${sessionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Create focus session
  async createFocusSession(sessionData) {
    const response = await fetch(`${API_BASE}/focus/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Update focus session
  async updateFocusSession(sessionId, sessionData) {
    const response = await fetch(`${API_BASE}/focus/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Delete focus session (deactivate)
  async deleteFocusSession(sessionId) {
    const response = await fetch(`${API_BASE}/focus/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get session stats
  async getFocusSessionStats(username) {
    const response = await fetch(`${API_BASE}/focus/sessions/stats?username=${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // =================== FOCUS ENTRIES API ===================

  // Get focus entries
  async getFocusEntries(username, options = {}) {
    const params = new URLSearchParams({ username });
    if (options.sessionId) params.append('sessionId', options.sessionId);
    if (options.date) params.append('date', options.date);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    
    const response = await fetch(`${API_BASE}/focus/entries?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Create focus entry
  async createFocusEntry(entryData) {
    const response = await fetch(`${API_BASE}/focus/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Update focus entry
  async updateFocusEntry(entryId, entryData) {
    const response = await fetch(`${API_BASE}/focus/entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Delete focus entry
  async deleteFocusEntry(entryId) {
    const response = await fetch(`${API_BASE}/focus/entries/${entryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get entry stats
  async getFocusEntryStats(username, date = null) {
    const params = new URLSearchParams({ username });
    if (date) params.append('date', date);
    
    const response = await fetch(`${API_BASE}/focus/entries/stats?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // =================== FOCUS TRACKER API ===================

  // Get focus tracker analytics
  async getFocusTracker(username, period = 'week') {
    const response = await fetch(`${API_BASE}/focus/tracker?username=${username}&period=${period}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get daily focus tracker
  async getDailyFocusTracker(username, date = null) {
    const params = new URLSearchParams({ username });
    if (date) params.append('date', date);
    
    const response = await fetch(`${API_BASE}/focus/tracker/daily?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get focus tracker range
  async getFocusTrackerRange(username, startDate, endDate) {
    const params = new URLSearchParams({ username, startDate, endDate });
    
    const response = await fetch(`${API_BASE}/focus/tracker/range?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get recent focus tracker
  async getRecentFocusTracker(username, days = 7) {
    const response = await fetch(`${API_BASE}/focus/tracker/recent?username=${username}&days=${days}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get focus analytics
  async getFocusAnalytics(username, period = 'week') {
    const response = await fetch(`${API_BASE}/focus/tracker/analytics?username=${username}&period=${period}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Generate daily stats
  async generateDailyFocusStats(username, date = null) {
    const params = new URLSearchParams({ username });
    if (date) params.append('date', date);
    
    const response = await fetch(`${API_BASE}/focus/tracker/generate?${params}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Update daily goal
  async updateDailyGoal(username, date, goalMet) {
    const params = new URLSearchParams({ username, date, goalMet });
    
    const response = await fetch(`${API_BASE}/focus/tracker/goal?${params}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get streak data
  async getFocusStreaks(username) {
    const response = await fetch(`${API_BASE}/focus/tracker/streaks?username=${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get dashboard data
  async getFocusDashboard(username) {
    const response = await fetch(`${API_BASE}/focus/tracker/dashboard?username=${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Add this method:
  async getAchievements(username) {
    try {
      const response = await fetch(`${API_BASE}/achievements?username=${username || 'user'}`);
      if (!response.ok) {
        // Return mock data if API fails
        return {
          achievements: [],
          summary: { completed: 0, inProgress: 0, locked: 0 }
        };
      }
      return response.json();
    } catch (error) {
      console.warn('Achievements API not available, using mock data');
      return {
        achievements: [],
        summary: { completed: 0, inProgress: 0, locked: 0 }
      };
    }
  },

  // UPDATE the getPlayerStats function:
  async getPlayerStats(username = 'user') {
    try {
      if (!username) {
        console.warn('No username provided for player stats, using default');
        username = 'user';
      }
      
      const response = await fetch(`${API_BASE}/players/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
      throw error;
    }
  },

  // =================== FOCUS CATEGORIES API ===================
  
  // Save focus session with category
  async saveFocusSessionWithCategory(sessionData) {
    const response = await fetch(`${API_BASE}/focus/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...sessionData,
        // Ensure category is included in the session data
        category: sessionData.category || 'OTHER'
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Get categories with XP totals
  async getFocusCategories(username) {
    try {
      // First try to get from backend
      const response = await fetch(`${API_BASE}/focus/sessions/stats?username=${username}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const stats = await response.json();
      
      // Convert backend stats to category format
      const categories = [];
      if (stats.categoryBreakdown) {
        Object.entries(stats.categoryBreakdown).forEach(([categoryName, minutes]) => {
          categories.push({
            id: categoryName.toLowerCase(),
            name: categoryName,
            xp: minutes,
            iconName: this.getCategoryIcon(categoryName)
          });
        });
      }
      
      return categories;
    } catch (error) {
      console.warn('Using localStorage categories as fallback');
      // Fallback to localStorage
      const saved = localStorage.getItem('focusCategories');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Helper method to get icon for category
  getCategoryIcon(categoryName) {
    const iconMap = {
      // NEW 9 Default Branches
      'SCHOLAR': 'BookOpen',      // Scholar (Study)
      'PROFESSION': 'Briefcase',  // Profession (Work)
      'ARTISAN': 'Palette',       // Artisan (Creating)
      'SCRIBE': 'PenTool',        // Scribe (Writing)
      'PROGRAMMING': 'Code',      // Programming (Coding)
      'LITERACY': 'Target',       // Literacy (Reading)
      'STRATEGIST': 'Calendar',   // Strategist (Planning)
      'MINDFULNESS': 'Heart',     // Mindfulness (Rest)
      'KNOWLEDGE': 'Search',      // Knowledge (Researching)
      
      // Legacy mappings (for backward compatibility)
      'STUDY': 'BookOpen',
      'WORK': 'Briefcase',
      'LEARNING': 'BookOpen',
      'CODE': 'Code',
      'CREATE': 'Palette',
      'CREATIVE': 'Palette',
      'PERSONAL': 'User',
      'HEALTH': 'User',
      'OTHER': 'User'
    };
    return iconMap[categoryName.toUpperCase()] || 'User';
  },

  // =================== ACHIEVEMENTS API ===================
  
  // Get all achievements  
  async getAllAchievements() {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  // Get player achievements with progress
  async getPlayerAchievements(username) {
    if (!username || username === 'undefined') {
      console.log("No username provided for player achievements");
      return [];
    }
    
    try {
      const response = await fetch(`${API_BASE}/achievements/player/${username}`);
      if (!response.ok) throw new Error('Failed to fetch player achievements');
      return await response.json();
    } catch (error) {
      console.error('Error fetching player achievements:', error);
      return [];
    }
  },

  // Get achievement player stats
  async getAchievementPlayerStats(username) {
    if (!username || username === 'undefined') {
      console.log("No username provided for achievement player stats");
      return {
        completedAchievements: 0,
        totalAchievements: 0,
        totalXp: 0,
        completionPercentage: 0.0
      };
    }
    
    try {
      const response = await fetch(`${API_BASE}/achievements/player/${username}/stats`);
      if (!response.ok) throw new Error('Failed to fetch achievement player stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching achievement player stats:', error);
      return {
        completedAchievements: 0,
        totalAchievements: 0,
        totalXp: 0,
        completionPercentage: 0.0
      };
    }
  },

  // Update achievement progress
  async updateAchievementProgress(username, achievementId, progress) {
    try {
      const response = await fetch(`${API_BASE}/achievements/player/${username}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          achievementId: achievementId,
          progress: progress
        })
      });
      if (!response.ok) throw new Error('Failed to update achievement progress');
      return await response.text();
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      throw error;
    }
  },

  // Populate test achievement data
  async populateTestAchievements(username) {
    try {
      const response = await fetch(`${API_BASE}/achievements/test/populate/${username}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to populate test achievements');
      return await response.text();
    } catch (error) {
      console.error('Error populating test achievements:', error);
      throw error;
    }
  },

  // Add this method to your api.js if it's missing:
  async checkAllAchievements(username) {
    const response = await fetch(`${API_BASE}/achievements/player/${username}/check`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to check achievements');
    return response.text();
  },

  // ADD this method to your apiService object:

  async updateTask(taskId, taskData, username = 'user') {
    const requestData = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate, // YYYY-MM-DD format
      tags: taskData.tags,
      taskListId: taskData.taskListId,
      completed: taskData.completed
    };

    const response = await fetch(`${API_BASE}/tasks/${taskId}?username=${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update task error:', errorText);
      throw new Error(`Failed to update task: ${response.status} - ${errorText}`);
    }

    return await response.json();
  },
};

export default apiService;