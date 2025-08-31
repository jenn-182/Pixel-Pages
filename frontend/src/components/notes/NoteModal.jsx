import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Tag, Folder, BookOpen, Palette, Save, Plus, ArrowLeft, Download, FileDown, Archive } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  folders, 
  notebooks, 
  existingNote = null,
  defaultFolderId = null,
  defaultNotebookId = null,
  title: customTitle = null
}) => {
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    tags: '',
    color: '#4ADE80',
    folderId: null,
    notebookId: null
  });

  const { showNotification } = useNotification();

  const isEditing = existingNote !== null;
  const modalTitle = customTitle || (isEditing ? 'MODIFY LOG ENTRY' : 'CREATE NEW LOG ENTRY');

  const colors = [
    '#4ADE80', '#60A5FA', '#F472B6', '#FBBF24',
    '#A78BFA', '#FB7185', '#34D399', '#FCD34D'
  ];

  // Load existing note data when editing
  useEffect(() => {
    if (existingNote) {
      setNoteData({
        title: existingNote.title || '',
        content: existingNote.content || '',
        tags: Array.isArray(existingNote.tags) ? existingNote.tags.join(', ') : (existingNote.tags || ''),
        color: existingNote.color || '#4ADE80',
        folderId: existingNote.folderId || null,
        notebookId: existingNote.notebookId || null
      });
    } else {
      setNoteData({
        title: '',
        content: '',
        tags: '',
        color: '#4ADE80',
        folderId: defaultFolderId,
        notebookId: defaultNotebookId,
      });
    }
  }, [existingNote, isOpen, defaultFolderId, defaultNotebookId]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Ctrl/Cmd + Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, noteData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting note data:', noteData);
      await onSave(noteData);
      onClose(); // ✅ Close modal after successful save
    } catch (error) {
      console.error('Failed to save note:', error);
      showNotification('Failed to save note. Please try again.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 z-50 flex flex-col" // ✅ Changed to flex column
        >
          {/* Header Bar */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800 border-b-2 border-cyan-400 p-4 flex items-center justify-between flex-shrink-0" // ✅ Added flex-shrink-0
            style={{
              boxShadow: '0 2px 20px rgba(34,211,238,0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="bg-gray-900 border-2 border-cyan-400 p-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-400"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
                title="Back to Library (ESC)"
              >
                <ArrowLeft size={20} />
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
              
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-2xl font-bold text-white">
                  {modalTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-gray-400 hidden sm:flex gap-4">
                <span>ESC: Back</span>
                <span>CTRL+ENTER: Save</span>
              </div>
              
              <button
                type="submit"
                form="note-form"
                className="bg-gray-900 border-2 border-cyan-400 px-6 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center gap-2">
                  {isEditing ? <Save size={18} /> : <Plus size={18} />}
                  <span>{isEditing ? 'SAVE CHANGES' : 'CREATE ENTRY'}</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col"> {/* ✅ Changed overflow and added flex */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-6xl mx-auto flex-1 p-6 overflow-hidden flex flex-col" // ✅ Added flex and overflow handling
            >
              <form id="note-form" onSubmit={handleSubmit} className="h-full flex flex-col space-y-6">
                {/* Title Input - Prominent */}
                <div className="flex-shrink-0">
                  <input
                    value={noteData.title}
                    onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                    placeholder="Enter your log title..."
                    className="w-full text-4xl font-mono font-bold bg-transparent border-none outline-none text-white placeholder-gray-500 p-0"
                    style={{ 
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff',
                      textFillColor: '#ffffff'
                    }}
                    required
                    autoFocus
                  />
                  <div className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mt-3" />
                </div>

                {/* Main Content Layout - Adjusted proportions */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden"> {/* ✅ Changed from 3 to 4 columns */}
                  {/* Content Area - Takes up 3/4 of space */}
                  <div className="lg:col-span-3 flex flex-col overflow-hidden"> {/* ✅ Changed from 2 to 3 spans */}
                    <div className="bg-gray-800 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative flex-1 flex flex-col overflow-hidden">
                      <div className="absolute inset-0 border-2 border-cyan-400 opacity-20 animate-pulse pointer-events-none" />
                      
                      <div className="flex items-center gap-2 mb-4 relative z-10 flex-shrink-0">
                        <FileText size={20} className="text-cyan-400" />
                        <span className="font-mono text-sm font-bold text-cyan-400">LOG CONTENT</span>
                      </div>
                      
                      <textarea
                        value={noteData.content}
                        onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                        placeholder="Start writing your log entry...

You can write as much as you need here. This expanded space gives you even more room to work with your thoughts, ideas, and detailed notes.

- Use bullet points for quick lists
- Write long paragraphs for detailed explanations  
- Document your processes step by step
- Keep track of important information and references
- Brainstorm ideas and concepts freely

The interface is designed to get out of your way and let you focus on writing. The sidebar keeps all your organizational tools within easy reach while maximizing your writing space."
                        className="w-full flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 font-mono text-base resize-none relative z-10 leading-relaxed overflow-y-auto"
                        style={{ 
                          color: '#ffffff !important',
                          WebkitTextFillColor: '#ffffff',
                          textFillColor: '#ffffff'
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Metadata Sidebar - 1/4 of space */}
                  <div className="lg:col-span-1 overflow-y-auto"> {/* ✅ Still 1 span but now 1/4 instead of 1/3 */}
                    <div className="space-y-4">
                      {/* Tags */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-4">
                        <label className="block text-sm font-mono font-bold text-cyan-400 mb-3">
                          <Tag size={16} className="inline mr-2" />
                          TAGS
                        </label>
                        <input
                          value={noteData.tags}
                          onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
                          placeholder="work, ideas, important..."
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        />
                      </div>

                      {/* Color Picker - Optimized for narrower space */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-4">
                        <label className="block text-sm font-mono font-bold text-cyan-400 mb-3">
                          <Palette size={16} className="inline mr-2" />
                          COLOR
                        </label>
                        <div className="grid grid-cols-2 gap-2"> {/* ✅ Changed from 4 to 2 columns for better fit */}
                          {colors.map(color => {
                            const hexToRgb = (hex) => {
                              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                              return result ? 
                                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
                                '74, 222, 128';
                            };
                            const rgbColor = hexToRgb(color);
                            
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setNoteData({ ...noteData, color })}
                                className={`w-full h-10 border-2 transition-all duration-300 relative ${
                                  noteData.color === color 
                                    ? 'border-white scale-105' 
                                    : 'border-gray-600 hover:border-gray-400'
                                }`}
                                style={{ 
                                  backgroundColor: color,
                                  boxShadow: noteData.color === color 
                                    ? `0 0 15px rgba(${rgbColor}, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)`
                                    : `0 0 5px rgba(${rgbColor}, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)`
                                }}
                                title={color}
                              >
                                {noteData.color === color && (
                                  <div className="absolute inset-0 border-2 border-white opacity-60" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Archive Assignment */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-4">
                        <label className="block text-sm font-mono font-bold text-cyan-400 mb-3">
                          <Folder size={16} className="inline mr-2" />
                          ARCHIVE
                        </label>
                        <select
                          value={noteData.folderId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            folderId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        >
                          <option value="">None</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              📁 {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Collection Assignment */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-4">
                        <label className="block text-sm font-mono font-bold text-cyan-400 mb-3">
                          <BookOpen size={16} className="inline mr-2" />
                          COLLECTION
                        </label>
                        <select
                          value={noteData.notebookId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            notebookId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        >
                          <option value="">None</option>
                          {notebooks.map(notebook => (
                            <option key={notebook.id} value={notebook.id}>
                              📖 {notebook.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Export Section - Only show when editing */}
                      {isEditing && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          style={{
                            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), 3px 3px 0px 0px rgba(0,0,0,1)'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-mono text-sm font-bold text-white">EXPORT</h3>
                          </div>
                          
                          <div className="space-y-2">
                            {/* Single Note Export */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/notes/${existingNote.id}/export`);
                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${existingNote.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.md`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                    showNotification(`"${existingNote.title}" exported successfully!`, 'success');
                                  }
                                } catch (error) {
                                  showNotification('Export failed. Please try again.', 'error');
                                }
                              }}
                              className="w-full bg-gray-900 border-2 border-cyan-400 px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 text-xs"
                              style={{
                                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                              }}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <FileDown size={14} />
                                <span>THIS ENTRY</span>
                              </div>
                              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                            
                            {/* Export All Notes */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/notes/export/all?username=user`);
                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `all_notes_${new Date().toISOString().slice(0, 10)}.md`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                    showNotification('All entries exported successfully!', 'success');
                                  }
                                } catch (error) {
                                  showNotification('Export failed. Please try again.', 'error');
                                }
                              }}
                              className="w-full bg-gray-900 border-2 border-cyan-400 px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 text-xs"
                              style={{
                                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                              }}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Archive size={14} />
                                <span>ALL ENTRIES</span>
                              </div>
                              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;