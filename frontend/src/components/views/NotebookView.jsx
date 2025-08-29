import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Plus, Folder } from 'lucide-react';
import PixelButton from '../PixelButton';
import NoteModal from '../notes/NoteModal';

const NotebookView = ({ notebook, onBack, onCreateNote, folders, notebooks, notes }) => {
  const [notebookNotes, setNotebookNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

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
    setIsCreateNoteModalOpen(true);
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      const noteWithNotebook = {
        ...noteData,
        notebookId: notebook.id
      };
      await onCreateNote(noteWithNotebook);
      setIsCreateNoteModalOpen(false);
      filterNotebookNotes(); // Refresh the notes
    } catch (error) {
      console.error('Failed to create note:', error);
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
        <div>Loading notebook...</div>
      </div>
    );
  }

  return (
    <div className="notebook-view-container">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <PixelButton
          onClick={onBack}
          color="bg-gray-400"
          hoverColor="hover:bg-gray-500"
          icon={<ArrowLeft size={18} />}
        >
          Back to Library
        </PixelButton>
        
        <div className="flex items-center gap-3 flex-1">
          <BookOpen size={32} style={{ color: notebook.colorCode || '#87CEEB' }} />
          <div>
            <h1 className="font-mono text-2xl font-bold text-white">{notebook.name}</h1>
            <p className="text-gray-400 font-mono text-sm">{notebook.description}</p>
          </div>
        </div>

        <PixelButton
          onClick={handleCreateNote}
          color="bg-green-400"
          hoverColor="hover:bg-green-500"
          icon={<Plus size={18} />}
        >
          New Note in Notebook
        </PixelButton>
      </div>

      {/* Notebook Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-green-400" />
            <span className="font-mono text-white font-bold">Notes</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-400">
            {notebookNotes.length}
          </div>
        </div>
        
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📝</span>
            <span className="font-mono text-white font-bold">Total Words</span>
          </div>
          <div className="text-2xl font-mono font-bold text-purple-400">
            {notebookNotes.reduce((total, note) => total + (note.content ? note.content.split(' ').length : 0), 0)}
          </div>
        </div>
        
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏷️</span>
            <span className="font-mono text-white font-bold">Unique Tags</span>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">
            {[...new Set(notebookNotes.flatMap(note => getTags(note.tags)))].length}
          </div>
        </div>
      </div>

      {/* Notes Content */}
      <div className="space-y-6">
        {notebookNotes.length > 0 ? (
          <div>
            <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-green-400" />
              Notes in this notebook ({notebookNotes.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notebookNotes.map(note => {
                const tagsArray = getTags(note.tags);
                
                return (
                  <motion.div
                    key={note.id}
                    className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ borderTopColor: note.color || '#4ADE80', borderTopWidth: '4px' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <FileText size={24} style={{ color: note.color || '#4ADE80' }} />
                      <span className="text-xs text-gray-400 font-mono">
                        {tagsArray.length} tags
                      </span>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate" title={note.title}>
                      {note.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-3 mb-3">
                      {note.content && note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content}
                    </p>
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tagsArray.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-xs font-mono text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {tagsArray.length > 2 && (
                          <span className="text-xs text-gray-500 font-mono">
                            +{tagsArray.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="border-2 border-gray-600 bg-gray-800 p-8 text-center">
            <BookOpen size={64} style={{ color: notebook.colorCode || '#87CEEB' }} className="mx-auto mb-4" />
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              No notes yet in "{notebook.name}"
            </h3>
            <p className="text-gray-400 font-mono mb-6">
              Start writing your first note in this notebook!
            </p>
            
            <PixelButton
              onClick={handleCreateNote}
              color="bg-green-400"
              hoverColor="hover:bg-green-500"
              icon={<FileText size={18} />}
            >
              Create First Note
            </PixelButton>
          </div>
        )}

        {/* Notebook Tips */}
        <div className="border-2 border-gray-600 bg-gray-800 p-6">
          <h4 className="font-mono text-lg font-bold text-white mb-4">📖 Notebook Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-300">
            <div>
              <span className="text-green-400">📝</span> <strong>Notes</strong> in this notebook are automatically organized together
            </div>
            <div>
              <span className="text-blue-400">🏷️</span> <strong>Tags</strong> help you find related content across notebooks
            </div>
            <div>
              <span className="text-purple-400">🔍</span> <strong>Search</strong> within this notebook to find specific notes
            </div>
            <div>
              <span className="text-yellow-400">📁</span> <strong>Export</strong> all notes from this notebook together
            </div>
          </div>
        </div>
      </div>

      {/* Note Creation Modal with notebook pre-selected */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => setIsCreateNoteModalOpen(false)}
        onSave={handleCreateNoteSubmit}
        folders={folders}
        notebooks={notebooks}
        existingNote={null}
        defaultNotebookId={notebook.id} // Pre-select this notebook
      />

      {/* Future enhancement - Folder export */}
      <div className="mt-6">
        <PixelButton
          onClick={() => {
            console.log('Exporting folder:', notebook.id);
            window.open(`/api/folders/${notebook.id}/export`);
          }}
          color="bg-yellow-500"
          hoverColor="hover:bg-yellow-600"
          icon={<Folder size={16} />}
        >
          Export Folder
        </PixelButton>
      </div>
    </div>
  );
};

export default NotebookView;