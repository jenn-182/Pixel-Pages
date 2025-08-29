import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import NoteCard from '../notes/NoteCard';
import NoteModal from '../notes/NoteModal';
import useNotes from '../../hooks/useNotes';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';

const NotesTab = () => {
  const { notes, loading, error, deleteNote, createNote, updateNote } = useNotes();
  const { folders } = useFolders();
  const { notebooks } = useNotebooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

  // Filter notes based on search
  const filteredNotes = searchTerm
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.tags && Array.isArray(note.tags) && note.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : notes;

  const handleDeleteNote = async (note) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handleCreateNote = () => {
    setIsCreateNoteModalOpen(true);
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      console.log('NotesTab: Creating note:', noteData); // Debug log
      await createNote(noteData);
      setIsCreateNoteModalOpen(false);
      console.log('Note created successfully from NotesTab!');
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('Failed to create note: ' + error.message);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      console.log('NotesTab: Saving note data:', noteData); // Debug log
      
      if (activeNote && activeNote.id) {
        console.log('NotesTab: Updating existing note:', activeNote.id); // Debug log
        await updateNote(activeNote.id, noteData);
      } else {
        console.log('NotesTab: Creating new note'); // Debug log
        await createNote(noteData);
      }
      
      setIsEditing(false);
      setActiveNote(null);
      
      console.log('NotesTab: Note saved successfully'); // Debug log
    } catch (error) {
      console.error('NotesTab: Failed to save note:', error);
      alert('Failed to save note: ' + error.message);
    }
  };

  return (
    <div className="notes-tab-container p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white mb-2">Your Notes</h1>
          <p className="text-gray-400 font-mono text-sm">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
          </p>
        </div>
        
        <div className="flex gap-3">
          <PixelButton
            onClick={handleCreateNote}
            color="bg-green-400"
            hoverColor="hover:bg-green-500"
            icon={<Plus size={18} />}
          >
            New Note
          </PixelButton>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <PixelInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-400 mt-2 font-mono">
            Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-2 border-red-500 bg-red-100 p-4 mb-4 font-mono text-red-800">
          Error: {error}
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="text-center py-8 font-mono text-white">Loading notes...</div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map(note => (
            <NoteCard
              key={note.id || note.filename || note.title}
              note={note}
              onView={setActiveNote}
              onEdit={(note) => {
                setActiveNote(note);
                setIsEditing(true);
              }}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-8 text-center">
          {searchTerm ? (
            <div>
              <h3 className="font-mono text-lg font-bold mb-2 text-white">No notes found</h3>
              <p className="text-gray-400 mb-4">Try a different search term or create a new note</p>
              <div className="flex gap-2 justify-center">
                <PixelButton
                  onClick={() => setSearchTerm('')}
                  color="bg-blue-400"
                  hoverColor="hover:bg-blue-500"
                >
                  Clear Search
                </PixelButton>
                <PixelButton
                  onClick={handleCreateNote}
                  color="bg-green-400"
                  hoverColor="hover:bg-green-500"
                  icon={<Plus size={18} />}
                >
                  Create Note
                </PixelButton>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-mono text-lg font-bold mb-2 text-white">No notes yet</h3>
              <p className="text-gray-400 mb-4">Create your first note to get started on your digital adventure!</p>
              <PixelButton
                onClick={handleCreateNote}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<Plus size={18} />}
              >
                Create Your First Note
              </PixelButton>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => setIsCreateNoteModalOpen(false)}
        onSave={handleCreateNoteSubmit}  
        folders={folders}
        notebooks={notebooks}
        existingNote={null}
      />
      <NoteModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setActiveNote(null);
        }}
        onSave={handleSaveNote}  
        folders={folders}
        notebooks={notebooks}
        existingNote={activeNote}
      />
    </div>
  );
};

export default NotesTab;