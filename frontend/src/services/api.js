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

  // Achievement-related methods
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

  async getAllAchievements() {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch all achievements:', error);
      // Return empty array as fallback
      return [];
    }
  },

  async getPlayerAchievements(username = 'Jroc_182') {
    try {
      const url = `${API_BASE}/achievements/player/${username}`;
      console.log('🌐 API: Calling getPlayerAchievements URL:', url);
      
      const response = await fetch(url);
      console.log('🌐 API: getPlayerAchievements response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🌐 API: getPlayerAchievements parsed data:', {
        type: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        firstItem: data?.[0]
      });
      
      return data;
    } catch (error) {
      console.error('🌐 API: Failed to fetch player achievements:', error);
      // Return empty array as fallback
      return [];
    }
  },

  async getAchievementPlayerStats(username = 'Jroc_182') {
    try {
      const url = `${API_BASE}/achievements/player/${username}/stats`;
      console.log('🌐 API: Calling getAchievementPlayerStats URL:', url);
      
      const response = await fetch(url);
      console.log('🌐 API: getAchievementPlayerStats response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🌐 API: getAchievementPlayerStats parsed data:', {
        type: typeof data,
        keys: Object.keys(data || {}),
        data: data
      });
      
      return data;
    } catch (error) {
      console.error('🌐 API: Failed to fetch achievement player stats:', error);
      // Return empty object as fallback
      return {};
    }
  },

  // UPDATE the getPlayerStats function:
  async getPlayerStats(username = 'Jroc_182') { // Changed default
    try {
      if (!username) {
        console.warn('No username provided for player stats, using default');
        username = 'Jroc_182'; // Changed default
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

  async updateTask(taskId, taskData, username = 'Jroc_182') { // Changed default
    const requestData = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
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