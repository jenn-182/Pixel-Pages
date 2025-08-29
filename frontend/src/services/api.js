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
};

export default apiService;