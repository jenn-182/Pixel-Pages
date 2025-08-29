// src/hooks/useNotes.js
import { useState, useEffect } from 'react';

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
      console.log('useNotes: Creating note with data:', noteData); // Debug log
      
      // Convert tags string to array for the backend
      const dataToSend = {
        ...noteData,
        tags: noteData.tags ? noteData.tags.split(',').map(tag => tag.trim()) : [],
        username: 'user' // Add default username
      };
      
      console.log('useNotes: Data being sent to backend:', dataToSend); // Debug log

      const response = await fetch('/api/notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('useNotes: Response status:', response.status); // Debug log

      if (response.ok) {
        const newNote = await response.json();
        console.log('useNotes: Note created successfully:', newNote); // Debug log
        setNotes(prevNotes => [newNote, ...prevNotes]);
        return newNote;
      } else {
        const errorText = await response.text();
        console.error('useNotes: Backend error:', errorText); // Debug log
        throw new Error(`Failed to create note: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('useNotes: Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      console.log('Original noteData:', noteData); // Debug log
      
      // Convert tags array to string if needed
      const dataToSend = {
        ...noteData,
        tags: Array.isArray(noteData.tags) 
          ? noteData.tags.join(',') 
          : noteData.tags
      };

      console.log('Data being sent to backend:', dataToSend); // Debug log
      console.log('Updating note with ID:', id); // Debug log

      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      if (response.ok) {
        const updatedNote = await response.json();
        console.log('Updated note received:', updatedNote); // Debug log
        
        setNotes(prevNotes => 
          prevNotes.map(note => note.id === id ? updatedNote : note)
        );
        return updatedNote;
      } else {
        const errorText = await response.text();
        console.error('Backend error response:', errorText); // Debug log
        throw new Error(`Failed to update note: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
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