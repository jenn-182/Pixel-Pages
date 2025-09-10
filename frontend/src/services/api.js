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

  // Fix this method:
  async getPlayerStats(username) {
    if (!username || username === 'undefined') {
      console.warn('No username provided for player stats');
      return { level: 1, xp: 0, totalNotes: 0, totalTasks: 0 };
    }
    
    try {
      const response = await fetch(`${API_BASE}/players/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          return { level: 1, xp: 0, totalNotes: 0, totalTasks: 0 };
        }
        throw new Error('Failed to fetch player stats');
      }
      return response.json();
    } catch (error) {
      console.warn('Player stats API not available, using defaults');
      return { level: 1, xp: 0, totalNotes: 0, totalTasks: 0 };
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
      'WORK': 'Briefcase',
      'STUDY': 'BookOpen',
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
};

export default apiService;