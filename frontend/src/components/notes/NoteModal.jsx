import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Tag, Folder, BookOpen, Palette, Save, Plus, ArrowLeft, Download, FileDown, Archive, Bold, Italic, Underline, List, ListOrdered, Quote, Code, Highlighter, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { insertFormatting, handleFormattingKeyDown } from '../../utils/markdownUtils';
import MarkdownPreview from '../markdown/MarkdownPreview';

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, // ✅ Add delete callback
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

  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ Add delete confirmation state
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

  // Helper function to insert formatting (using imported utility)
  const insertFormattingHandler = (before, after = '', placeholder = 'text') => {
    const textarea = document.getElementById('content-textarea');
    const result = insertFormatting(textarea, noteData.content, before, after, placeholder);
    
    setNoteData({ ...noteData, content: result.newContent });
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
    }, 0);
  };

  // Keyboard shortcuts for formatting (using imported utility)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      return;
    }
    
    const textarea = document.getElementById('content-textarea');
    handleFormattingKeyDown(e, textarea, noteData.content, (newContent) => {
      setNoteData({ ...noteData, content: newContent });
    });
  };

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

  // ✅ Add delete handler
  const handleDelete = async () => {
    try {
      await onDelete(existingNote.id);
      showNotification(`"${existingNote.title}" deleted successfully!`, 'success');
      onClose();
    } catch (error) {
      console.error('Failed to delete note:', error);
      showNotification('Failed to delete note. Please try again.', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
        >
          {/* Header Bar */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800 border-b-2 border-cyan-400 p-4 flex items-center justify-between flex-shrink-0"
            style={{
              boxShadow: '0 2px 20px rgba(34,211,238,0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              {/* Back button - already correct */}
              <button
                onClick={onClose}
                className="bg-gray-900 border-2 border-cyan-400 p-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-400"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
                title="Back to Library (ESC)"
              >
                <ArrowLeft size={20} className="text-cyan-400" />
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
              
              {/* ✅ Add delete button for editing mode */}
              {isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-gray-900 border-2 border-red-500 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-mono font-bold text-red-500"
                  style={{
                    boxShadow: '0 0 5px rgba(239, 68, 68, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                  title="Delete Log Entry"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 size={16} className="text-red-500" />
                    <span className="text-red-500">DELETE</span>
                  </div>
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              )}
              
              {/* Save/Create button - fix the text color */}
              <button
                type="submit"
                form="note-form"
                className="bg-gray-900 border-2 border-cyan-400 px-6 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center gap-2">
                  {isEditing ? <Save size={18} className="text-cyan-400" /> : <Plus size={18} className="text-cyan-400" />}
                  <span className="text-cyan-400">{isEditing ? 'SAVE CHANGES' : 'CREATE ENTRY'}</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          </motion.div>

          {/* Main Content Area - Full screen usage */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full h-full p-3 overflow-hidden flex flex-col"
            >
              <form id="note-form" onSubmit={handleSubmit} className="h-full flex flex-col space-y-3">
                {/* Title Input */}
                <div className="flex-shrink-0">
                  <input
                    value={noteData.title}
                    onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                    placeholder="Enter your log title..."
                    className="w-full text-3xl font-mono font-bold bg-transparent border-none outline-none text-white placeholder-gray-500 p-0"
                    style={{ 
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff',
                      textFillColor: '#ffffff'
                    }}
                    required
                    autoFocus
                  />
                  <div className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mt-2" />
                </div>

                {/* Main Content Layout - More space for content, smaller sidebar */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-3 overflow-hidden">
                  {/* Content Area - Takes up 5/6 of space */}
                  <div className="lg:col-span-5 flex flex-col overflow-hidden">
                    <div className="bg-gray-800 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex-1 flex flex-col overflow-hidden">
                      <div className="absolute inset-0 border-2 border-cyan-400 opacity-20 animate-pulse pointer-events-none" />
                      
                      {/* Header with formatting toolbar */}
                      <div className="flex items-center justify-between p-3 border-b-2 border-gray-700 relative z-10 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-cyan-400" />
                          <span className="font-mono text-sm font-bold text-cyan-400">LOG CONTENT</span>
                        </div>
                        
                        {/* Formatting Toolbar */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('**', '**', 'bold text')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Bold (Ctrl+B)"
                          >
                            <Bold size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('*', '*', 'italic text')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Italic (Ctrl+I)"
                          >
                            <Italic size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('<u>', '</u>', 'underlined text')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Underline (Ctrl+U)"
                          >
                            <Underline size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('==', '==', 'highlighted text')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Highlight"
                          >
                            <Highlighter size={14} />
                          </button>
                          
                          <div className="w-px h-5 bg-gray-600" />
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('- ', '', '')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Bullet List"
                          >
                            <List size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('1. ', '', '')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Numbered List"
                          >
                            <ListOrdered size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('> ', '', '')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Quote"
                          >
                            <Quote size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('`', '`', 'code')}
                            className="p-1.5 bg-gray-700 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                            title="Inline Code (Ctrl+`)"
                          >
                            <Code size={14} />
                          </button>
                          
                          <div className="w-px h-5 bg-gray-600" />
                          
                          <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className={`p-1.5 bg-gray-700 border border-gray-600 transition-colors ${
                              showPreview 
                                ? 'text-cyan-400 border-cyan-400' 
                                : 'text-gray-300 hover:text-cyan-400 hover:border-cyan-400'
                            }`}
                            title="Toggle Preview"
                          >
                            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="flex-1 flex relative z-10 overflow-hidden">
                        {/* Editor Side */}
                        <div className={`${showPreview ? 'w-1/2 border-r-2 border-gray-700' : 'w-full'} flex flex-col`}>
                          <textarea
                            id="content-textarea"
                            value={noteData.content}
                            onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                            onKeyDown={handleKeyDown}
                            placeholder="Start writing your log entry...

**Bold text** or *italic text*
- Bullet points
1. Numbered lists
> Quoted text
`inline code`
==highlighted text==

Use the toolbar above or keyboard shortcuts:
- Ctrl/Cmd + B: Bold
- Ctrl/Cmd + I: Italic  
- Ctrl/Cmd + U: Underline
- Ctrl/Cmd + `: Code"
                            className="w-full flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 font-mono text-base resize-none leading-relaxed overflow-y-auto p-4"
                            style={{ 
                              color: '#ffffff !important',
                              WebkitTextFillColor: '#ffffff',
                              textFillColor: '#ffffff'
                            }}
                            required
                          />
                        </div>
                        
                        {/* Preview Side */}
                        {showPreview && (
                          <div className="w-1/2 overflow-y-auto p-4 bg-gray-900">
                            <div className="font-mono text-white leading-relaxed text-base">
                              <MarkdownPreview content={noteData.content || '*Start typing to see preview...*'} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Takes up 1/6 of space, much smaller and compact */}
                  <div className="lg:col-span-1 overflow-y-auto">
                    <div className="space-y-2">
                      {/* Tags */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400 mb-1">
                          <Tag size={12} className="inline mr-1" />
                          TAGS
                        </label>
                        <input
                          value={noteData.tags}
                          onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
                          placeholder="work, ideas..."
                          className="w-full px-2 py-1 bg-gray-900 border-2 border-gray-600 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        />
                      </div>

                      {/* Color Picker */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400 mb-1">
                          <Palette size={12} className="inline mr-1" />
                          COLOR
                        </label>
                        
                        {/* Current Color Display */}
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-6 h-4 border-2 border-gray-600"
                            style={{ backgroundColor: noteData.color }}
                            title="Current color"
                          />
                          <input
                            type="color"
                            value={noteData.color}
                            onChange={(e) => setNoteData({ ...noteData, color: e.target.value })}
                            className="w-6 h-4 border-2 border-gray-600 bg-transparent cursor-pointer"
                            title="Custom color picker"
                          />
                          <span className="text-xs font-mono text-gray-400">Custom</span>
                        </div>

                        {/* Preset Colors Grid */}
                        <div className="grid grid-cols-2 gap-1">
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
                                className={`w-full h-6 border-2 transition-all duration-300 relative ${
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
                      <div className="bg-gray-800 border-2 border-gray-600 p-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400 mb-1">
                          <Folder size={12} className="inline mr-1" />
                          ARCHIVE
                        </label>
                        <select
                          value={noteData.folderId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            folderId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-2 py-1 bg-gray-900 border-2 border-gray-600 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        >
                          <option value="">None</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Collection Assignment */}
                      <div className="bg-gray-800 border-2 border-gray-600 p-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400 mb-1">
                          <BookOpen size={12} className="inline mr-1" />
                          COLLECTION
                        </label>
                        <select
                          value={noteData.notebookId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            notebookId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-2 py-1 bg-gray-900 border-2 border-gray-600 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff',
                            textFillColor: '#ffffff'
                          }}
                        >
                          <option value="">None</option>
                          {notebooks.map(notebook => (
                            <option key={notebook.id} value={notebook.id}>
                              {notebook.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Export Section - More compact */}
                      {isEditing && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gray-800 border-2 border-gray-600 p-2"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <h3 className="font-mono text-xs font-bold text-cyan-400">EXPORT</h3>
                          </div>
                          
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
                            className="w-full bg-gray-900 border-2 border-cyan-400 px-2 py-1 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 text-xs"
                            style={{
                              boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                            }}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <FileDown size={10} className="text-cyan-400" />
                              <span className="text-cyan-400">EXPORT</span>
                            </div>
                            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* ✅ Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 border-2 border-red-500 p-6 max-w-md mx-4"
                style={{
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="text-center">
                  <Trash2 size={48} className="text-red-500 mx-auto mb-4" />
                  <h3 className="font-mono text-xl font-bold text-white mb-2">DELETE LOG ENTRY</h3>
                  <p className="text-gray-300 font-mono mb-4">
                    Are you sure you want to permanently delete<br />
                    <span className="text-cyan-400 font-bold">"{existingNote?.title}"</span>?
                  </p>
                  <p className="text-red-400 text-sm font-mono mb-6">
                    This action cannot be undone.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-900 border-2 border-gray-600 px-4 py-2 font-mono font-bold text-gray-300 hover:border-gray-500 transition-colors"
                    >
                      <span className="text-gray-300">CANCEL</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-gray-900 border-2 border-red-500 px-4 py-2 font-mono font-bold text-red-500 hover:border-red-400 transition-colors"
                    >
                      <span className="text-red-500">DELETE</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;