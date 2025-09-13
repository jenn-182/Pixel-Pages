import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Search, Plus, Edit3, Eye, Trash2 } from 'lucide-react';
import NoteViewModal from '../notes/NoteViewModal';

const NoteListView = ({ 
  notes, 
  onBack, 
  onCreateNote, 
  onEditNote,
  onDeleteNote,
  folders = [],
  notebooks = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  // Helper function to safely handle tags
  const getNoteTagsAsString = (tags) => {
    if (!tags) return '';
    
    if (Array.isArray(tags)) {
      return tags.filter(tag => tag && typeof tag === 'string').join(' ');
    }
    
    if (typeof tags === 'string') {
      return tags;
    }
    
    return '';
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    const titleMatch = note.title?.toLowerCase().includes(searchLower) || false;
    const contentMatch = note.content?.toLowerCase().includes(searchLower) || false;
    const tagsMatch = getNoteTagsAsString(note.tags).toLowerCase().includes(searchLower);
    
    return titleMatch || contentMatch || tagsMatch;
  });

  const getTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim());
    return [];
  };

  const handleViewNote = (note) => {
    setViewingNote(note);
    setIsNoteViewModalOpen(true);
  };

  const handleEditNoteFromView = () => {
    const noteToEdit = viewingNote;
    setIsNoteViewModalOpen(false);
    setViewingNote(null);
    onEditNote(noteToEdit);
  };

  const handleDeleteNoteFromView = async () => {
    if (viewingNote && onDeleteNote) {
      await onDeleteNote(viewingNote.id);
      setIsNoteViewModalOpen(false);
      setViewingNote(null);
    }
  };

  const handleDeleteNoteFromCard = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await onDeleteNote(note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-black border-2 border-white p-2 font-mono font-bold text-white hover:scale-105 transition-transform"
                title="Back to Storage Vault"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="font-mono font-bold text-white text-2xl">ALL LOG ENTRIES</h1>
                <p className="font-mono text-sm text-gray-400">
                  Complete log entry management interface
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <span>
                <span className="text-white font-bold">{filteredNotes.length}</span> 
                / {notes.length} LOGS
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <button
              onClick={onCreateNote}
              className="bg-black border-2 border-white/60 px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus size={16} />
              <FileText size={16} />
              <span>NEW LOG</span>
            </button>
            
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search log entries..."
                className="w-full pl-10 pr-3 py-2 bg-black border-2 border-gray-600 text-white font-mono text-sm focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => {
                const noteColor = note.color || note.colorCode || '#4ADE80';
                const rgbColor = noteColor.startsWith('#') 
                  ? `${parseInt(noteColor.slice(1, 3), 16)}, ${parseInt(noteColor.slice(3, 5), 16)}, ${parseInt(noteColor.slice(5, 7), 16)}`
                  : '74, 222, 128';
                
                const tagsArray = getTags(note.tags);

                return (
                  <motion.div
                    key={note.id}
                    className="bg-black bg-opacity-60 border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                    style={{
                      boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 40px rgba(${rgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
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
                          onEditNote(note);
                        }}
                        className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                        title="Edit log entry"
                      >
                        <Edit3 size={14} />
                      </button>

                      {onDeleteNote && (
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
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-black bg-opacity-60 border border-white p-8 text-center rounded-lg">
              {searchTerm ? (
                <>
                  <Search size={48} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-mono mb-2">
                    No log entries found matching "{searchTerm}"
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Try adjusting your search terms
                  </p>
                </>
              ) : (
                <>
                  <FileText size={48} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-mono mb-2">
                    No log entries found
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Create your first log entry to begin storing information
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note View Modal */}
      <NoteViewModal
        isOpen={isNoteViewModalOpen}
        onClose={() => setIsNoteViewModalOpen(false)}
        onEdit={handleEditNoteFromView}
        onDelete={handleDeleteNoteFromView}
        note={viewingNote}
      />
    </div>
  );
};

export default NoteListView;