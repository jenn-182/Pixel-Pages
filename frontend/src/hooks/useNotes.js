// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import achievementService from '../services/achievementService';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error('Failed to fetch notes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      console.log('useNotes: Creating note with data:', noteData);
      
      const dataToSend = {
        ...noteData,
        tags: Array.isArray(noteData.tags) ? noteData.tags : 
              typeof noteData.tags === 'string' ? noteData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes(prevNotes => [...prevNotes, newNote]);
        
        // Check achievements after note creation
        setTimeout(() => {
          checkNoteAchievements();
        }, 100);
        
        return newNote;
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to create note: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      console.log('useNotes: Updating note with ID:', id, 'Data:', noteData);
      
      const dataToSend = {
        ...noteData,
        tags: Array.isArray(noteData.tags) ? noteData.tags : 
              typeof noteData.tags === 'string' ? noteData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prevNotes => 
          prevNotes.map(note => 
            (note.id === id || note.filename === id) ? updatedNote : note
          )
        );
        
        // Check achievements after note update
        setTimeout(() => {
          checkNoteAchievements();
        }, 100);
        
        return updatedNote;
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to update note: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      console.log('useNotes: Deleting note with ID:', id);
      
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      } else {
        throw new Error(`Failed to delete note: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  // Helper function for week start
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Helper function for note streak calculation
  const calculateNoteStreak = (notes) => {
    if (notes.length === 0) return 0;
    
    const dates = [...new Set(notes.map(n => new Date(n.createdAt).toDateString()))].sort();
    let streak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return streak;
  };

  const checkNoteAchievements = () => {
    const userStats = calculateNoteStats(notes);
    const newAchievements = achievementService.checkAchievements(userStats);
    
    if (newAchievements.length > 0) {
      console.log(`📝 Note achievements unlocked: ${newAchievements.map(a => a.name).join(', ')}`);
    }
    
    return newAchievements;
  };

  const calculateNoteStats = (notes) => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = getWeekStart(now);
    
    // Calculate note statistics
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => sum + (note.content?.split(' ').length || 0), 0);
    
    // Get all unique tags
    const allTags = new Set();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => allTags.add(tag));
      }
    });
    const uniqueTags = allTags.size;
    
    // Today's notes
    const notesToday = notes.filter(note => 
      new Date(note.createdAt).toDateString() === today
    ).length;
    
    // Week notes
    const notesThisWeek = notes.filter(note => 
      new Date(note.createdAt) >= thisWeek
    ).length;
    
    // Weekend notes
    const weekendNotes = notes.filter(note => {
      const day = new Date(note.createdAt).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).length;
    
    // Max words in a single note
    const maxWordsInNote = Math.max(...notes.map(note => 
      note.content?.split(' ').length || 0
    ), 0);
    
    // Max tags in a single note
    const maxTagsInNote = Math.max(...notes.map(note => 
      note.tags?.length || 0
    ), 0);
    
    // Note streak (simplified)
    const noteStreak = calculateNoteStreak(notes);
    
    // Edit statistics (if you track edits)
    const totalEdits = notes.reduce((sum, note) => sum + (note.editCount || 0), 0);
    const maxEditsOnNote = Math.max(...notes.map(note => note.editCount || 0), 0);
    
    return {
      totalNotes,
      totalWords,
      uniqueTags,
      notesToday,
      notesThisWeek,
      weekendNotes,
      maxWordsInNote,
      maxTagsInNote,
      noteStreak,
      totalEdits,
      maxEditsOnNote
    };
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};

export default useNotes;