import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Plus, Edit, Tag, Trash2 } from 'lucide-react';
import NoteModal from '../notes/NoteModal';

const NotebookView = ({ 
  notebook, 
  onBack, 
  onCreateNote, 
  onEditNote, 
  onDeleteNotebook, // Add this prop
  folders, 
  notebooks, 
  notes 
}) => {
  const [notebookNotes, setNotebookNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    filterNotebookNotes();
  }, [notebook.id, notes]);

  const filterNotebookNotes = () => {
    try {
      setLoading(true);
      // Filter notes that belong to this notebook
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
      onBack(); // Navigate back to library after deletion
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

  if (loading) {
    return (
      <div className="text-center py-8 font-mono text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <BookOpen size={32} style={{ color: notebook.colorCode || '#87CEEB' }} />
        </motion.div>
        <div>Loading collection...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
              style={{
                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>BACK TO LIBRARY</span>
              </div>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-gray-900 border-2 border-red-500 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-mono font-bold text-red-500"
              style={{
                boxShadow: '0 0 5px rgba(239, 68, 68, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
              title="Delete Collection"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={16} className="text-red-500" />
                <span className="text-red-500">DELETE COLLECTION</span>
              </div>
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <BookOpen size={32} style={{ color: notebook.colorCode || '#87CEEB' }} />
            <div>
              <h1 className="font-mono text-3xl font-bold text-white mb-2">{notebook.name}</h1>
              <p className="text-gray-400 font-mono text-sm">{notebook.description}</p>
            </div>
          </div>

          <button
            onClick={handleCreateNote}
            className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
            style={{
              boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="flex items-center gap-2">
              <Plus size={16} />
              <span>NEW LOG</span>
            </div>
            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Collection Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="bg-gray-900 border-2 border-cyan-400 p-4" style={{
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold">TOTAL LOGS</div>
                <div className="text-2xl font-mono font-bold text-cyan-400">{notebookNotes.length}</div>
              </div>
              <FileText className="text-cyan-400" size={20} />
            </div>
          </div>
          
          <div className="bg-gray-900 border-2 border-cyan-400 p-4" style={{
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold">TOTAL WORDS</div>
                <div className="text-2xl font-mono font-bold text-cyan-400">
                  {notebookNotes.reduce((total, note) => total + (note.content ? note.content.split(' ').length : 0), 0)}
                </div>
              </div>
              <Edit className="text-cyan-400" size={20} />
            </div>
          </div>
          
          <div className="bg-gray-900 border-2 border-cyan-400 p-4" style={{
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold">UNIQUE TAGS</div>
                <div className="text-2xl font-mono font-bold text-cyan-400">
                  {[...new Set(notebookNotes.flatMap(note => getTags(note.tags)))].length}
                </div>
              </div>
              <Tag className="text-cyan-400" size={20} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Collection Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            LOG ENTRIES
            <span className="ml-3 text-sm text-cyan-400">
              [{notebookNotes.length}]
            </span>
          </h3>

          {notebookNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notebookNotes.map((note, index) => {
                const tagsArray = getTags(note.tags);
                const noteColor = note.color || note.colorCode || '#4ADE80';
                
                const hexToRgb = (hex) => {
                  if (!hex || !hex.startsWith('#')) return '74, 222, 128';
                  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                  return result ? 
                    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
                    '74, 222, 128';
                };
                
                const rgbColor = hexToRgb(noteColor);
                
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-900 border-2 p-4 cursor-pointer group relative transition-all duration-300"
                    style={{
                      borderColor: noteColor,
                      boxShadow: `0 0 10px rgba(${rgbColor}, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)`,
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 20px rgba(${rgbColor}, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEditNote(note)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <FileText size={24} style={{ color: noteColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                        {tagsArray.length} TAGS
                      </div>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate" title={note.title}>
                      {note.title}
                    </h4>
                    <p className="text-xs text-gray-400 mb-3">
                      {note.content && note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content}
                    </p>
                    
                    {/* Classification Tags */}
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tagsArray.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 text-xs font-mono text-cyan-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {tagsArray.length > 2 && (
                          <span className="text-xs text-gray-500 font-mono px-2 py-1">
                            +{tagsArray.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit log entry"
                    >
                      <Edit size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 p-8 text-center">
              <BookOpen size={64} style={{ color: notebook.colorCode || '#87CEEB' }} className="mx-auto mb-4" />
              <h3 className="font-mono text-xl font-bold text-white mb-2">
                No logs yet in "{notebook.name}"
              </h3>
              <p className="text-gray-400 font-mono mb-6">
                Start writing your first log entry in this collection!
              </p>
              
              <button
                onClick={handleCreateNote}
                className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>CREATE FIRST LOG</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 border-2 border-red-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md mx-4 relative"
              style={{
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Trash2 size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="font-mono text-xl font-bold text-white mb-2">DELETE COLLECTION</h3>
                <p className="text-gray-300 font-mono mb-4">
                  Are you sure you want to permanently delete<br />
                  <span className="text-cyan-400 font-bold">"{notebook.name}"</span>?
                </p>
                <p className="text-red-400 text-sm font-mono mb-6">
                  All logs in this collection will become unorganized. This action cannot be undone.
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-900 border border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleDeleteNotebook}
                    className="bg-gray-900 border-2 border-red-500 px-4 py-2 font-mono text-red-500 hover:bg-red-900 transition-colors"
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