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
    const response = await this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return response.data || response; // Extract note from gaming response
  }

  async updateNote(id, note) {
    const response = await this.request(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
    return response.data || response;
  }

  async deleteNote(id) {
    const response = await this.request(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    return response.data || response;
  }

  async searchNotes(query) {
    return this.request(`/api/notes/search?query=${encodeURIComponent(query)}`);
  }

  // Player operations - Fix the endpoint paths
  async getPlayerStats() {
    return this.request('/api/stats'); // Changed from /api/player/stats
  }

  // Achievement operations
  async getAchievements() {
    const response = await this.request('/api/achievements');
    return response.data ? response : { data: response }; // Handle gaming response format
  }

  async getAchievementsByCategory(category) {
    return this.request(`/api/achievements/category/${category}`);
  }

  async getAchievementsByRarity(rarity) {
    return this.request(`/api/achievements/rarity/${rarity}`);
  }
}

export const apiService = new ApiService();