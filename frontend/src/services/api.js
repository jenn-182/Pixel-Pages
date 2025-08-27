// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', url); // Debug log
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Note operations
  async getAllNotes() {
    return this.request('/api/notes');
  }

  async getNoteById(filename) {
    return this.request(`/api/notes/${encodeURIComponent(filename)}`);
  }

  async createNote(note) {
    return this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateNote(filename, note) {
    return this.request(`/api/notes/${encodeURIComponent(filename)}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteNote(filename) {
    return this.request(`/api/notes/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
  }

  async searchNotes(query) {
    return this.request(`/api/notes/search?query=${encodeURIComponent(query)}`);
  }

  // Player operations - Fix the endpoint paths
  async getPlayerStats() {
    return this.request('/api/stats'); // Changed from /api/player/stats
  }

  async getAchievements() {
    return this.request('/api/achievements'); // Changed from /api/player/achievements
  }
}

export const apiService = new ApiService();