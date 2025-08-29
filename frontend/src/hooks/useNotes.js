// src/hooks/useNotes.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    try {
      setError(null);
      const response = await apiService.createNote(noteData);
      // Handle gaming response format from your backend
      const newNote = response.data || response;
      setNotes(prevNotes => [newNote, ...prevNotes]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id, noteData) => {
    try {
      setError(null);
      const response = await apiService.updateNote(id, noteData);
      // Handle gaming response format from your backend
      const updatedNote = response.data || response;
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === id ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      setError(null);
      await apiService.deleteNote(id);
      setNotes(prevNotes => 
        prevNotes.filter(note => note.id !== id)
      );
    } catch (err) {
      setError('Failed to delete note');
      throw err;
    }
  }, []);

  const searchNotes = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const results = await apiService.searchNotes(query);
      setNotes(results);
    } catch (err) {
      setError('Failed to search notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get notes in a specific folder
  const getNotesInFolder = async (folderId, username = 'player1') => {
    try {
      const url = folderId 
        ? `http://localhost:8080/api/notes/folder/${folderId}?username=${username}`
        : `http://localhost:8080/api/notes/no-container?username=${username}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch notes in folder');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get notes in a specific notebook
  const getNotesInNotebook = async (notebookId, username = 'player1') => {
    try {
      const response = await fetch(`http://localhost:8080/api/notes/notebook/${notebookId}?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes in notebook');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Move note to folder
  const moveNoteToFolder = async (noteId, folderId, username = 'player1') => {
    try {
      const response = await fetch(`http://localhost:8080/api/notes/${noteId}/move-to-folder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to move note to folder');
      }

      const movedNote = await response.json();
      
      // Update local state
      setNotes(prev => 
        prev.map(note => note.id === noteId ? movedNote : note)
      );
      
      return movedNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Move note to notebook
  const moveNoteToNotebook = async (noteId, notebookId, username = 'player1') => {
    try {
      const response = await fetch(`http://localhost:8080/api/notes/${noteId}/move-to-notebook`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notebookId, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to move note to notebook');
      }

      const movedNote = await response.json();
      
      // Update local state
      setNotes(prev => 
        prev.map(note => note.id === noteId ? movedNote : note)
      );
      
      return movedNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    refreshNotes: fetchNotes,
    getNotesInFolder,
    getNotesInNotebook,
    moveNoteToFolder,
    moveNoteToNotebook,
  };
};