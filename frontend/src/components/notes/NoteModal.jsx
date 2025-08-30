import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Tag, Folder, BookOpen, Palette, Save, Plus, Maximize2, Minimize2, Download, FileDown, Archive } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
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
  isFullscreen: propIsFullscreen = false,
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
  const [isFullscreen, setIsFullscreen] = useState(propIsFullscreen);
  const [notification, setNotification] = useState(null);

  const { showNotification } = useNotification();

  const isEditing = existingNote !== null;
  const modalTitle = customTitle || (isEditing ? 'MODIFY MISSION ENTRY' : 'CREATE MISSION ENTRY');

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

  // Set fullscreen state from prop
  useEffect(() => {
    setIsFullscreen(propIsFullscreen);
  }, [propIsFullscreen]);

  // Keyboard shortcuts for NoteModal
  useEffect(() => {
    if (!isOpen) return; // Only add listeners when modal is open

    const handleKeyDown = (e) => {
      // Escape to close modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Ctrl/Cmd + Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }
      // F11 to toggle fullscreen (only if not forced fullscreen)
      if (e.key === 'F11' && !propIsFullscreen) {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, propIsFullscreen, noteData]); // Include noteData for submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting note data:', noteData);
      await onSave(noteData); 
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transition-all duration-300 relative ${
              isFullscreen 
                ? 'w-full h-full max-w-none max-h-none m-0 overflow-y-auto' 
                : 'w-full max-w-2xl max-h-[90vh] overflow-y-auto'
            }`}
            style={{
              boxShadow: isFullscreen 
                ? '0 0 30px rgba(34, 211, 238, 0.4), 8px 8px 0px 0px rgba(0,0,0,1)'
                : '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-400 border border-gray-600" />
                <h2 className="font-mono text-2xl font-bold text-white">
                  {modalTitle}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {!propIsFullscreen && (
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-gray-900 border border-cyan-400 p-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] text-cyan-400"
                    style={{
                      boxShadow: '0 0 3px rgba(34, 211, 238, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)'
                    }}
                    title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-900 border border-cyan-400 p-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] text-cyan-400"
                  style={{
                    boxShadow: '0 0 3px rgba(34, 211, 238, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)'
                  }}
                  title="Close (ESC)"
                >
                  <X size={20} />
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-6 ${isFullscreen ? 'max-w-6xl mx-auto' : ''}`}>
              {/* Title */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  TITLE *
                </label>
                <input
                  value={noteData.title}
                  onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                  placeholder="Enter note title..."
                  className={`w-full px-4 py-3 transition-colors placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono focus:border-cyan-400 focus:outline-none ${
                    isFullscreen ? 'text-lg py-4 px-6' : 'text-sm'
                  }`}
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                  required
                  autoFocus
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  CONTENT *
                </label>
                <textarea
                  value={noteData.content}
                  onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                  placeholder="Start entering your note content..."
                  className={`w-full px-4 py-3 transition-colors resize-none placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono focus:border-cyan-400 focus:outline-none ${
                    isFullscreen ? 'h-[60vh] text-lg py-4 px-6' : 'h-48 text-sm'
                  }`}
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  TAGS (comma-separated)
                </label>
                <input
                  value={noteData.tags}
                  onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
                  placeholder="work, ideas, important, project..."
                  className={`w-full px-4 py-3 transition-colors placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono focus:border-cyan-400 focus:outline-none ${
                    isFullscreen ? 'text-lg py-4 px-6' : 'text-sm'
                  }`}
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  DATA COLOR CODE
                </label>
                <div className="flex gap-3 flex-wrap">
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
                        className={`w-10 h-10 border-2 transition-all duration-300 relative ${
                          noteData.color === color 
                            ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                            : 'border-gray-600 hover:border-gray-400 hover:scale-105'
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
                          <div className="absolute inset-0 border border-white opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Folder/Notebook Selection */}
              <div className={`${isFullscreen ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}`}>
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    <Folder size={16} className="inline mr-1" />
                    FOLDER SYSTEM
                  </label>
                  <select
                    value={noteData.folderId || ''}
                    onChange={(e) => setNoteData({ 
                      ...noteData, 
                      folderId: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className={`w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 font-mono focus:border-cyan-400 focus:outline-none transition-colors ${
                      isFullscreen ? 'text-lg py-4 px-6' : 'text-sm'
                    }`}
                    style={{ 
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff',
                      textFillColor: '#ffffff'
                    }}
                  >
                    <option value="">No folder assignment</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        📁 {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    <BookOpen size={16} className="inline mr-1" />
                    MISSION COLLECTION
                  </label>
                  <select
                    value={noteData.notebookId || ''}
                    onChange={(e) => setNoteData({ 
                      ...noteData, 
                      notebookId: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className={`w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 font-mono focus:border-cyan-400 focus:outline-none transition-colors ${
                      isFullscreen ? 'text-lg py-4 px-6' : 'text-sm'
                    }`}
                    style={{ 
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff',
                      textFillColor: '#ffffff'
                    }}
                  >
                    <option value="">No collection assignment</option>
                    {notebooks.map(notebook => (
                      <option key={notebook.id} value={notebook.id}>
                        📖 {notebook.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-4 pt-6 ${isFullscreen ? 'justify-center' : ''}`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`bg-gray-900 border-2 border-cyan-400 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 ${
                    isFullscreen ? 'px-8 py-4 text-lg' : 'px-6 py-3 flex-1'
                  }`}
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                  title="Cancel (ESC)"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X size={isFullscreen ? 20 : 18} className="text-cyan-400" />
                    <span className="text-cyan-400">CANCEL</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <button
                  type="submit"
                  className={`bg-gray-900 border-2 border-cyan-400 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 ${
                    isFullscreen ? 'px-8 py-4 text-lg' : 'px-6 py-3 flex-1'
                  }`}
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                  title="Save (CTRL/CMD + ENTER)"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isEditing ? <Save size={isFullscreen ? 20 : 18} /> : <Plus size={isFullscreen ? 20 : 18} />}
                    <span className="text-cyan-400">
                      {isEditing ? 'SAVE CHANGES' : 'CREATE ENTRY'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>

              {/* Keyboard Shortcuts Help - Show in both modes */}
              <div className="text-xs font-mono text-gray-500 pt-4 border-t border-gray-600 text-center">
                <div className="flex flex-wrap gap-4 justify-center">
                  <span>ESC: Close modal</span>
                  <span>CTRL/CMD + ENTER: Save Progress</span>
                  {!propIsFullscreen && <span>F11: Toggle fullscreen</span>}
                  <span>TAB: Navigate fields</span>
                </div>
              </div>
            </form>

            {/* Export Section - Enhanced cyber theme */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t-2 border-cyan-400">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-purple-400 border border-gray-600" />
                  <h3 className="font-mono text-lg font-bold text-white">EXPORT MISSIONS</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Single Note Export */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Exporting note:', existingNote.id);
                        
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
                        } else {
                          throw new Error('Export failed');
                        }
                      } catch (error) {
                        console.error('Export error:', error);
                        showNotification('Failed to export note. Please try again.', 'error');
                      }
                    }}
                    className="bg-gray-900 border-2 border-cyan-400 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                    style={{
                      boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileDown size={16} className="text-cyan-400" />
                      <span className="text-cyan-400">EXPORT THIS ENTRY (.md)</span>
                    </div>
                    <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                  
                  {/* Export All Notes */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Exporting all notes for user');
                        
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
                          
                          showNotification('All entries exported successfully! Ready for backup or sharing.', 'success');
                        } else {
                          throw new Error('Export failed');
                        }
                      } catch (error) {
                        console.error('Export error:', error);
                        showNotification('Export failed. Please check your connection and try again.', 'error');
                      }
                    }}
                    className="bg-gray-900 border-2 border-cyan-400 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                    style={{
                      boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Archive size={16} className="text-cyan-400" />
                      <span className="text-cyan-400">EXPORT ALL ENTRIES (.md)</span>
                    </div>
                    <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-3 font-mono text-center">
                  Files will be downloaded to your Downloads directory
                </p>
              </div>
            )}

            {/* Notification Display - Enhanced */}
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-4 right-4 p-4 border-2 font-mono text-sm z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  notification.type === 'success' 
                    ? 'bg-green-400 border-green-600 text-black' 
                    : 'bg-red-400 border-red-600 text-black'
                }`}
                style={{
                  boxShadow: notification.type === 'success'
                    ? '0 0 15px rgba(74, 222, 128, 0.4), 4px 4px 0px 0px rgba(0,0,0,1)'
                    : '0 0 15px rgba(248, 113, 113, 0.4), 4px 4px 0px 0px rgba(0,0,0,1)'
                }}
              >
                {notification.message}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;