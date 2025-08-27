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
      const newNote = await apiService.createNote(noteData);
      setNotes(prevNotes => [newNote, ...prevNotes]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (filename, noteData) => {
    try {
      const updatedNote = await apiService.updateNote(filename, noteData);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.filename === filename ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (filename) => {
    try {
      await apiService.deleteNote(filename);
      setNotes(prevNotes => 
        prevNotes.filter(note => note.filename !== filename)
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