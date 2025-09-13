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
  onDelete, 
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const { showNotification } = useNotification();

  const isEditing = existingNote !== null;
  const modalTitle = customTitle || (isEditing ? 'MODIFY LOG ENTRY' : 'CREATE NEW LOG ENTRY');

  // Calculate RGB values for dynamic theming
  const noteColor = noteData.color || '#4ADE80';
  const noteRgb = noteColor.startsWith('#') 
    ? `${parseInt(noteColor.slice(1, 3), 16)}, ${parseInt(noteColor.slice(3, 5), 16)}, ${parseInt(noteColor.slice(5, 7), 16)}`
    : '74, 222, 128';

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
      if (existingNote) {
        // For existing notes, pass the ID and data separately
        await onSave(existingNote.id, noteData);
      } else {
        // For new notes, just pass the data
        await onSave(noteData);
      }
      onClose(); // Close modal 
    } catch (error) {
      console.error('Failed to save note:', error);
      showNotification('Failed to save note. Please try again.', 'error');
    }
  };

  // delete handler
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
          className="fixed inset-0 bg-black z-[9999] flex flex-col p-2"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full h-full overflow-hidden relative"
          >
            {/* Main Container */}
            <div 
              className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg h-full flex flex-col"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: noteColor,
                boxShadow: `0 0 20px rgba(${noteRgb}, 0.6), 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              {/* Header Bar */}
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-b-2 border-white p-4 flex items-center justify-between flex-shrink-0 bg-black bg-opacity-60"
                style={{
                  borderColor: noteColor
                }}
              >
            <div className="flex items-center gap-4">
              {/* Back button */}
              <button
                onClick={onClose}
                className="bg-black border-2 border-white p-2 font-mono font-bold text-white hover:scale-105 transition-transform"
                title="Back to Library (ESC)"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 border-2 border-white rounded"
                    style={{
                      backgroundColor: noteColor,
                      boxShadow: `0 0 10px rgba(${noteRgb}, 0.6)`
                    }}
                  >
                    <FileText size={24} className="text-black" />
                  </div>
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
              
              {/* delete button for editing mode */}
              {isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-black border-2 border-red-500 px-4 py-2 font-mono font-bold text-red-400 hover:scale-105 transition-transform flex items-center gap-2"
                  title="Delete Log Entry"
                >
                  <Trash2 size={16} className="text-red-400" />
                  <span>DELETE</span>
                </button>
              )}
              
              {/* Save/Create button */}
              <button
                type="submit"
                form="note-form"
                className="bg-black border-2 border-white px-6 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2"
              >
                {isEditing ? <Save size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
                <span>{isEditing ? 'SAVE CHANGES' : 'CREATE ENTRY'}</span>
              </button>
            </div>
          </motion.div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-hidden flex flex-col p-6">
                <form id="note-form" onSubmit={handleSubmit} className="h-full flex flex-col space-y-4">
                  {/* Title Input */}
                  <div className="flex-shrink-0">
                    <input
                      value={noteData.title}
                      onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                      placeholder="Enter your log title..."
                      className="w-full text-3xl font-mono font-bold bg-transparent border-none outline-none text-white placeholder-gray-500 p-0"
                      required
                      autoFocus
                    />
                    <div 
                      className="h-1 mt-2 rounded"
                      style={{ backgroundColor: noteColor }}
                    />
                  </div>

                  {/* Main Content Layout */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-hidden">
                    {/* Content Area - Takes up 5/6 of space */}
                    <div className="lg:col-span-5 flex flex-col overflow-hidden">
                      <div 
                        className="border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex-1 flex flex-col overflow-hidden rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderColor: noteColor,
                          boxShadow: `0 0 15px rgba(${noteRgb}, 0.4), 4px 4px 0px 0px rgba(0,0,0,1)`
                        }}
                      >
                      
                        {/* Header with formatting toolbar */}
                        <div 
                          className="flex items-center justify-between p-3 border-b-2 border-white relative z-10 flex-shrink-0"
                          style={{ borderColor: noteColor }}
                        >
                          <div className="flex items-center gap-2">
                            <FileText size={18} style={{ color: noteColor }} />
                            <span className="font-mono text-sm font-bold text-white">LOG CONTENT</span>
                          </div>
                        
                        {/* Formatting Toolbar */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('**', '**', 'bold text')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Bold (Ctrl+B)"
                          >
                            <Bold size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('*', '*', 'italic text')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Italic (Ctrl+I)"
                          >
                            <Italic size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('<u>', '</u>', 'underlined text')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Underline (Ctrl+U)"
                          >
                            <Underline size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('==', '==', 'highlighted text')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Highlight"
                          >
                            <Highlighter size={14} className="text-white" />
                          </button>
                          
                          <div className="w-px h-5 bg-white" />
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('- ', '', '')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Bullet List"
                          >
                            <List size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('1. ', '', '')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Numbered List"
                          >
                            <ListOrdered size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('> ', '', '')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Quote"
                          >
                            <Quote size={14} className="text-white" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => insertFormattingHandler('`', '`', 'code')}
                            className="p-1.5 bg-black border-2 border-white text-white hover:scale-105 transition-transform rounded"
                            title="Inline Code (Ctrl+`)"
                          >
                            <Code size={14} className="text-white" />
                          </button>
                          
                          <div className="w-px h-5 bg-white" />
                          
                          <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className={`p-1.5 bg-black border-2 border-white transition-transform hover:scale-105 rounded ${
                              showPreview 
                                ? 'text-white' 
                                : 'text-white'
                            }`}
                            title="Toggle Preview"
                          >
                            {showPreview ? <EyeOff size={14} className="text-white" /> : <Eye size={14} className="text-white" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="flex-1 flex relative z-10 overflow-hidden">
                        {/* Editor Side */}
                        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
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
                          <div 
                            className="w-1/2 overflow-y-auto p-4 border-l-2 border-white"
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              borderColor: noteColor
                            }}
                          >
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
                      <div 
                        className="border-2 border-white p-3 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderColor: noteColor,
                          boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`
                        }}
                      >
                        <label className="block text-xs font-mono font-bold text-white mb-2">
                          <Tag size={12} className="inline mr-1" style={{ color: noteColor }} />
                          TAGS
                        </label>
                        <input
                          value={noteData.tags}
                          onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
                          placeholder="work, ideas..."
                          className="w-full px-2 py-1 bg-black border border-white text-white font-mono text-xs focus:border-white focus:outline-none transition-colors rounded"
                        />
                      </div>

                      {/* Color Picker */}
                      <div 
                        className="border-2 border-white p-3 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderColor: noteColor,
                          boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`
                        }}
                      >
                        <label className="block text-xs font-mono font-bold text-white mb-2">
                          <Palette size={12} className="inline mr-1" style={{ color: noteColor }} />
                          COLOR
                        </label>
                        
                        {/* Current Color Display */}
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-6 h-4 border border-white rounded"
                            style={{ backgroundColor: noteData.color }}
                            title="Current color"
                          />
                          <input
                            type="color"
                            value={noteData.color}
                            onChange={(e) => setNoteData({ ...noteData, color: e.target.value })}
                            className="w-6 h-4 border border-white bg-transparent cursor-pointer rounded"
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
                      <div 
                        className="border-2 border-white p-3 rounded"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderColor: noteColor,
                          boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`
                        }}
                      >
                        <label className="block text-xs font-mono font-bold text-white mb-2">
                          <Folder size={12} className="inline mr-1" style={{ color: noteColor }} />
                          ARCHIVE
                        </label>
                        <select
                          value={noteData.folderId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            folderId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-3 py-2 bg-black border-2 border-white text-white font-mono text-xs focus:outline-none transition-colors rounded"
                          style={{
                            borderColor: noteColor,
                            boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`,
                            color: '#ffffff',
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
                      <div 
                        className="border-2 border-white p-3 rounded"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderColor: noteColor,
                          boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`
                        }}
                      >
                        <label className="block text-xs font-mono font-bold text-white mb-2">
                          <BookOpen size={12} className="inline mr-1" style={{ color: noteColor }} />
                          COLLECTION
                        </label>
                        <select
                          value={noteData.notebookId || ''}
                          onChange={(e) => setNoteData({ 
                            ...noteData, 
                            notebookId: e.target.value ? parseInt(e.target.value) : null 
                          })}
                          className="w-full px-3 py-2 bg-black border-2 border-white text-white font-mono text-xs focus:outline-none transition-colors rounded"
                          style={{
                            borderColor: noteColor,
                            boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`,
                            color: '#ffffff',
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
                          className="border-2 border-white p-3 rounded"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: noteColor,
                            boxShadow: `0 0 10px rgba(${noteRgb}, 0.3)`
                          }}
                        >
                          <div className="flex items-center gap-1 mb-2">
                            <h3 className="font-mono text-xs font-bold text-white">EXPORT</h3>
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
                            className="w-full bg-black border-2 border-white px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white text-xs rounded"
                            style={{
                              borderColor: noteColor,
                              boxShadow: `0 0 10px rgba(${noteRgb}, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`
                            }}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <FileDown size={12} className="text-white" />
                              <span className="text-white">EXPORT</span>
                            </div>
                            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            </div>
            
            {/* Delete Confirmation Modal */}
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
              </motion.div>              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;