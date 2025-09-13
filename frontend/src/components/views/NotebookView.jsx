import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Plus, Edit3, Tag, Trash2, Eye } from 'lucide-react';
import NoteModal from '../notes/NoteModal';
import NoteViewModal from '../notes/NoteViewModal';

const NotebookView = ({ 
  notebook, 
  onBack, 
  onCreateNote, 
  onEditNote, 
  onDeleteNote,
  onDeleteNotebook,
  folders, 
  notebooks, 
  notes 
}) => {
  const [notebookNotes, setNotebookNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  const notebookColor = notebook.colorCode || notebook.color || '#60A5FA';
  const rgbColor = notebookColor.startsWith('#') 
    ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
    : '96, 165, 250';

  useEffect(() => {
    filterNotebookNotes();
  }, [notebook.id, notes]);

  const filterNotebookNotes = () => {
    try {
      setLoading(true);
      const filteredNotes = notes.filter(note => note.notebookId === notebook.id);
      setNotebookNotes(filteredNotes);
    } catch (error) {
      console.error('Error filtering notebook notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsCreateNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsCreateNoteModalOpen(true);
  };

  const handleViewNote = (note) => {
    setViewingNote(note);
    setIsNoteViewModalOpen(true);
  };

  const handleEditNoteFromView = () => {
    const noteToEdit = viewingNote;
    setIsNoteViewModalOpen(false);
    setViewingNote(null);
    handleEditNote(noteToEdit);
  };

  const handleDeleteNoteFromView = async () => {
    if (viewingNote && onDeleteNote) {
      await onDeleteNote(viewingNote.id);
      setIsNoteViewModalOpen(false);
      setViewingNote(null);
      filterNotebookNotes();
    }
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      const noteWithNotebook = {
        ...noteData,
        notebookId: notebook.id
      };
      
      if (editingNote) {
        await onEditNote({ ...noteWithNotebook, id: editingNote.id });
      } else {
        await onCreateNote(noteWithNotebook);
      }
      
      setIsCreateNoteModalOpen(false);
      setEditingNote(null);
      filterNotebookNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNotebook = async () => {
    try {
      await onDeleteNotebook(notebook.id);
      setShowDeleteConfirm(false);
      onBack();
    } catch (error) {
      console.error('Failed to delete collection:', error);
      alert('Failed to delete collection. Please try again.');
    }
  };

  const getTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim());
    return [];
  };

  const handleDeleteNoteFromCard = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await onDeleteNote(note.id);
        filterNotebookNotes();
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 font-mono text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <BookOpen size={32} style={{ color: notebookColor }} />
        </motion.div>
        <div>Loading collection...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 relative rounded-lg bg-black/40 backdrop-blur-md">
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-black border-2 border-white/60 p-2 font-mono font-bold text-white hover:scale-105 transition-transform cursor-pointer"
                title="Back to Archives"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 border-2 border-white"
                  style={{
                    backgroundColor: notebookColor,
                    boxShadow: `0 0 10px rgba(${rgbColor}, 0.6)`
                  }}
                >
                  <BookOpen size={24} className="text-black" />
                </div>
                <div>
                  <h1 className="font-mono font-bold text-white text-2xl">{notebook.name}</h1>
                  <p className="font-mono text-sm text-gray-400">
                    {notebook.description || 'Collection for organized log storage'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <span>
                <span className="text-white font-bold">{notebookNotes.length}</span> LOGS
              </span>
              <span>
                <span className="text-white font-bold">
                  {notebookNotes.reduce((total, note) => total + (note.content ? note.content.split(' ').length : 0), 0)}
                </span> WORDS
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
            <button
              onClick={handleCreateNote}
              className="bg-black border-2 border-white/60 px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <FileText size={16} />
              <span>NEW LOG</span>
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-black border-2 border-white/60 px-3 py-2 font-mono font-bold text-white hover:scale-105 hover:border-red-500 hover:text-red-400 transition-all flex items-center gap-2 cursor-pointer text-sm"
              title="Delete Collection"
            >
              <Trash2 size={14} />
              <span>DELETE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg bg-black/40 backdrop-blur-md">
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-mono font-bold text-white flex items-center">
              LOG ENTRIES ({notebookNotes.length})
            </h3>
          </div>

          {notebookNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notebookNotes.map((note) => {
                const noteColor = note.color || note.colorCode || '#4ADE80';
                const noteRgbColor = noteColor.startsWith('#') 
                  ? `${parseInt(noteColor.slice(1, 3), 16)}, ${parseInt(noteColor.slice(3, 5), 16)}, ${parseInt(noteColor.slice(5, 7), 16)}`
                  : '74, 222, 128';
                
                const tagsArray = getTags(note.tags);

                return (
                  <motion.div
                    key={note.id}
                    className="bg-black bg-opacity-60 border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                    style={{
                      boxShadow: `0 0 25px rgba(${noteRgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 40px rgba(${noteRgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewNote(note)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <FileText size={24} style={{ color: noteColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-black px-2 py-1 border border-white">
                        LOG
                      </div>
                    </div>
                    
                    <h4 className="font-mono font-bold text-white mb-2 truncate" title={note.title}>
                      {note.title}
                    </h4>
                    
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {note.content && note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content || 'No content available'}
                    </p>

                    <div className="text-xs text-gray-400 mb-2">
                      {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNote(note);
                        }}
                        className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                        title="View log entry"
                      >
                        <Eye size={14} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                        className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                        title="Edit log entry"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNoteFromCard(note);
                        }}
                        className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md transition-colors text-gray-400 hover:text-red-400"
                        title="Delete log entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-black bg-opacity-60 border border-white p-8 text-center rounded-lg">
              <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono mb-2">
                No log entries in this collection
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Create your first log entry to begin storing information
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Note Creation/Edit Modal */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => {
          setIsCreateNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleCreateNoteSubmit}
        folders={folders}
        notebooks={notebooks}
        existingNote={editingNote}
        defaultNotebookId={notebook.id}
      />

      {/* Note View Modal */}
      <NoteViewModal
        isOpen={isNoteViewModalOpen}
        onClose={() => setIsNoteViewModalOpen(false)}
        onEdit={handleEditNoteFromView}
        onDelete={handleDeleteNoteFromView}
        note={viewingNote}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md mx-4 relative rounded-lg"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                boxShadow: `0 0 20px rgba(239, 68, 68, 0.6), 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Trash2 size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="font-mono text-xl font-bold text-white mb-2">DELETE COLLECTION</h3>
                <p className="text-gray-300 font-mono mb-4">
                  Are you sure you want to permanently delete<br />
                  <span className="text-red-400 font-bold">"{notebook.name}"</span>?
                </p>
                <p className="text-red-400 text-sm font-mono mb-6">
                  All logs in this collection will become unorganized. This action cannot be undone.
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-black border-2 border-white px-4 py-2 font-mono text-white hover:scale-105 transition-transform"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleDeleteNotebook}
                    className="bg-black border-2 border-red-500 px-4 py-2 font-mono text-red-400 hover:scale-105 transition-transform"
                  >
                    DELETE COLLECTION
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotebookView;