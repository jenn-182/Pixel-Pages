// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import achievementService from '../services/achievementService';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ✅ ADD THIS MISSING STATE

  // ✅ ADD MISSING API_BASE CONSTANT
  const API_BASE = 'http://localhost:8080/api/notes';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      // ✅ FIX: Use consistent API endpoint
      const response = await fetch(`${API_BASE}?username=user`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setError(null);  // ✅ Clear error on success
      } else {
        console.error('Failed to fetch notes:', response.statusText);
        setError('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // REPLACE the createNote method:
  const createNote = async (noteData) => {
    try {
      console.log('useNotes: Creating note with data:', noteData);
      
      // ✅ FIX: Ensure proper tags format
      const noteWithTimestamp = {
        ...noteData,
        // ✅ Convert empty/null tags to empty array, not empty string
        tags: noteData.tags ? 
          (Array.isArray(noteData.tags) ? noteData.tags : 
           noteData.tags.split(',').map(t => t.trim()).filter(t => t)) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('📝 Note with timestamp and fixed tags:', noteWithTimestamp);
      
      const response = await fetch(`${API_BASE}?username=user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteWithTimestamp),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        console.error('❌ Response status:', response.status);
        throw new Error(`Failed to create note: ${response.status} - ${errorText}`);
      }

      const newNote = await response.json();
      console.log('📝 Backend returned note:', newNote);  // ✅ DEBUG LOG
      
      // ✅ FIX: Ensure the returned note has proper timestamp
      const noteWithProperTimestamp = {
        ...newNote,
        createdAt: newNote.createdAt || new Date().toISOString(),
        updatedAt: newNote.updatedAt || new Date().toISOString()
      };
      
      console.log('📝 Final note for state:', noteWithProperTimestamp);  // ✅ DEBUG LOG
      
      setNotes(prevNotes => [...prevNotes, noteWithProperTimestamp]);
      setError(null);

      // Check for achievements after a short delay to ensure state is updated
      setTimeout(() => {
        checkNoteAchievements();
      }, 100);

      return noteWithProperTimestamp;
    } catch (err) {
      console.error('useNotes: Error creating note:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      console.log('useNotes: Updating note with ID:', id, 'Data:', noteData);
      
      const dataToSend = {
        ...noteData,
        tags: Array.isArray(noteData.tags) ? noteData.tags : 
              typeof noteData.tags === 'string' ? noteData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        updatedAt: new Date().toISOString()  // ✅ ADD TIMESTAMP
      };

      // ✅ FIX: Use consistent API endpoint
      const response = await fetch(`${API_BASE}/${id}?username=user`, {
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
        
        setError(null);  // ✅ Clear error on success
        
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
      setError(error.message);  // ✅ Set error state
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      console.log('useNotes: Deleting note with ID:', id);
      
      // ✅ FIX: Use consistent API endpoint
      const response = await fetch(`${API_BASE}/${id}?username=user`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        setError(null);  // ✅ Clear error on success
      } else {
        throw new Error(`Failed to delete note: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message);  // ✅ Set error state
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
    
    console.log(`📅 Today is: ${today}`); // ✅ DEBUG LOG
    
    // Calculate note statistics
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => sum + (note.content?.split(' ').length || 0), 0);
    
    // ✅ FIX: Get all unique tags properly
    const allTags = new Set();
    notes.forEach(note => {
      // Handle both array and string tags
      if (Array.isArray(note.tags)) {
        note.tags.forEach(tag => allTags.add(tag.toLowerCase().trim()));
      } else if (typeof note.tags === 'string' && note.tags.trim()) {
        note.tags.split(',').forEach(tag => {
          const cleanTag = tag.toLowerCase().trim();
          if (cleanTag) allTags.add(cleanTag);
        });
      }
      // Also check tagsString field
      if (note.tagsString && typeof note.tagsString === 'string') {
        note.tagsString.split(',').forEach(tag => {
          const cleanTag = tag.toLowerCase().trim();
          if (cleanTag) allTags.add(cleanTag);
        });
      }
    });
    const uniqueTags = allTags.size;
    
    // ✅ FIX: Today's notes with better debugging
    const notesToday = notes.filter(note => {
      if (!note.createdAt) {
        console.warn('❌ Note missing createdAt:', note);
        return false;
      }
      
      // Parse both dates consistently
      const noteDate = new Date(note.createdAt);
      const todayDate = new Date();
      
      // Compare dates only (ignore time)
      const noteDateString = noteDate.toDateString();
      const todayDateString = todayDate.toDateString();
      
      const isToday = noteDateString === todayDateString;
      
      if (isToday) {
        console.log(`✅ TODAY's note found: "${note.title}" created ${note.createdAt}`);
      } else {
        console.log(`📅 Note "${note.title}": created ${note.createdAt} -> ${noteDateString} | Today: ${todayDateString} | Match: ${isToday}`);
      }
      
      return isToday;
    }).length;

    console.log(`📊 Notes today: ${notesToday} out of ${notes.length} total`);
    
    // Week notes
    const notesThisWeek = notes.filter(note => 
      note.createdAt && new Date(note.createdAt) >= thisWeek
    ).length;
    
    // Weekend notes
    const weekendNotes = notes.filter(note => {
      if (!note.createdAt) return false;
      const day = new Date(note.createdAt).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).length;
    
    // Max words in a single note
    const maxWordsInNote = Math.max(...notes.map(note => 
      note.content?.split(' ').length || 0
    ), 0);
    
    // Max tags in a single note
    const maxTagsInNote = Math.max(...notes.map(note => {
      if (Array.isArray(note.tags)) return note.tags.length;
      if (typeof note.tags === 'string' && note.tags.trim()) {
        return note.tags.split(',').length;
      }
      return 0;
    }), 0);
    
    // Note streak (simplified)
    const noteStreak = calculateNoteStreak(notes);
    const totalEdits = notes.reduce((sum, note) => sum + (note.editCount || 1), 0);

    return {
      totalNotes,
      totalWords,
      uniqueTags,
      notesToday,        // ✅ NOW PROPERLY CALCULATED
      notesThisWeek,
      weekendNotes,
      maxWordsInNote,
      maxTagsInNote,
      noteStreak,
      totalEdits,
      maxEditsOnNote: Math.max(...notes.map(note => note.editCount || 1), 0)
    };
  };

  return {
    notes,
    loading,
    error,           // ✅ ADD ERROR TO RETURN
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};

export default useNotes;