// src/hooks/useNotes.js
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const notesData = await apiService.getAllNotes();
      setNotes(notesData);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    try {
      const response = await apiService.createNote(noteData);
      // Handle gaming response format
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
      const response = await apiService.updateNote(id, noteData);
      // Handle gaming response format
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
      const results = await apiService.searchNotes(query);
      setNotes(results);
    } catch (err) {
      setError('Failed to search notes');
    } finally {
      setLoading(false);
    }
  }, []);

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
  };
};