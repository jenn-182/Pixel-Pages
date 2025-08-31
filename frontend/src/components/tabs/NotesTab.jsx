import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Clock, Save, X, Maximize2, Minimize2 } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import NoteCard from '../notes/NoteCard';
import NoteModal from '../notes/NoteModal';
import useNotes from '../../hooks/useNotes';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';

const NotesTab = ({ tabColor = '#22D3EE' }) => {
  const { notes, loading, error, deleteNote, createNote, updateNote } = useNotes();
  const { folders } = useFolders();
  const { notebooks } = useNotebooks();
  
  // Quick entry state (for normal form)
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickTags, setQuickTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('TERMINAL READY');
  
  // Modal states
  const [activeNote, setActiveNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  // Get recent notes (last 8)
  const recentNotes = notes
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 8);

  // Auto-save functionality for normal form only
  useEffect(() => {
    if (quickTitle.trim() || quickContent.trim()) {
      setSaveStatus('INPUT DETECTED...');
    } else {
      setSaveStatus('TERMINAL READY');
    }
  }, [quickTitle, quickContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreenModalOpen) {
        e.preventDefault();
        setIsFullscreenModalOpen(false);
      }
      // Ctrl/Cmd + Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isFullscreenModalOpen) {
          handleQuickSave();
        }
      }
      // F11 to toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenModalOpen]);

  // Regular form save
  const handleQuickSave = React.useCallback(async () => {
    if (!quickTitle.trim() && !quickContent.trim()) return;
    
    setIsSaving(true);
    setSaveStatus('TRANSMITTING...');
    
    try {
      const noteData = {
        title: quickTitle.trim() || 'Untitled Log Entry',
        content: quickContent.trim(),
        tags: quickTags.trim() ? quickTags.split(',').map(tag => tag.trim()) : [],
        color: '#4ADE80',
      };
      
      await createNote(noteData);
      
      // Clear form
      setQuickTitle('');
      setQuickContent('');
      setQuickTags('');
      setSaveStatus('LOG ARCHIVED!');
      
      setTimeout(() => setSaveStatus('TERMINAL READY'), 2000);
      
    } catch (error) {
      console.error('Failed to save quick note:', error);
      setSaveStatus('TRANSMISSION FAILED');
      setTimeout(() => setSaveStatus('TERMINAL READY'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [quickTitle, quickContent, quickTags, createNote]);

  const handleClearForm = () => {
    setQuickTitle('');
    setQuickContent('');
    setQuickTags('');
    setSaveStatus('TERMINAL READY');
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setIsEditModalOpen(true);
  };

  const handleUpdateNote = async (noteData) => {
    try {
      await updateNote(activeNote.id, noteData);
      setIsEditModalOpen(false);
      setActiveNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to update log entry: ' + error.message);
    }
  };

  // Handle fullscreen modal save (for new notes)
  const handleFullscreenSave = async (noteData) => {
    try {
      await createNote(noteData);
      setIsFullscreenModalOpen(false);
      
      // Update the status indicators
      setSaveStatus('LOG ARCHIVED!');
      setTimeout(() => setSaveStatus('TERMINAL READY'), 2000);

    } catch (error) {
      console.error('Failed to save fullscreen note:', error);
      alert('Failed to save log entry: ' + error.message);
    }
  };

  const toggleFullscreen = () => {
    console.log('Toggling fullscreen modal');
    setIsFullscreenModalOpen(!isFullscreenModalOpen);
  };

  // Create a draft note object for fullscreen mode
  const draftNote = {
    title: quickTitle,
    content: quickContent,
    tags: quickTags.trim() ? quickTags.split(',').map(tag => tag.trim()) : [],
    color: '#4ADE80',
  };

  return (
    <div className="notes-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          PLAYER LOGS
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Quick entry terminal for creating notes, ideas and lists.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border-2 border-red-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6"
          style={{
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="font-mono text-red-400">
            SYSTEM ERROR: {error}
          </div>
        </motion.div>
      )}

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side - Quick Entry Terminal (2/3 width) */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative h-full"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-mono font-bold text-white">LOG ENTRY TERMINAL</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className={`w-2 h-2 ${
                    saveStatus === 'TERMINAL READY' ? 'bg-green-400' :
                    saveStatus === 'INPUT DETECTED...' ? 'bg-yellow-400' :
                    saveStatus === 'TRANSMITTING...' ? 'bg-blue-400' :
                    saveStatus === 'LOG ARCHIVED!' ? 'bg-green-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-cyan-400">{saveStatus}</span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="bg-gray-900 border border-cyan-400 p-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] text-cyan-400"
                  style={{
                    boxShadow: '0 0 3px rgba(34, 211, 238, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)'
                  }}
                  title="Extended Terminal Mode (F11)"
                >
                  <Maximize2 size={16} />
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>
            </div>

            {/* Quick Entry Form */}
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">TITLE</label>
                <input
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full px-4 py-3 transition-colors placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                  autoFocus
                />
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">CONTENT</label>
                <textarea
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  placeholder="Enter content here..."
                  className="w-full px-4 py-3 transition-colors resize-none placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                  rows={8}
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">CLASSIFICATION TAGS</label>
                <input
                  value={quickTags}
                  onChange={(e) => setQuickTags(e.target.value)}
                  placeholder="personal, work, idea, important..."
                  className="w-full px-4 py-3 transition-colors placeholder-gray-500 bg-gray-900 border-2 border-gray-600 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleQuickSave}
                  disabled={isSaving || (!quickTitle.trim() && !quickContent.trim())}
                  className="bg-gray-900 border-2 border-cyan-400 px-6 py-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Save size={18} className="text-cyan-400" />
                    <span className="text-cyan-400">{isSaving ? 'ARCHIVING...' : 'ARCHIVE LOG'}</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <button
                  onClick={handleClearForm}
                  className="bg-gray-900 border-2 border-cyan-400 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <X size={18} className="text-cyan-400" />
                    <span className="text-cyan-400">CLEAR TERMINAL</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Recent Activity Feed (1/3 width) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative h-full"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-cyan-400" />
              <h2 className="text-xl font-mono font-bold text-white">RECENT LOGS</h2>
            </div>

            {/* Recent Notes List */}
            {loading ? (
              <div className="text-center py-8 font-mono text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <FileText size={24} className="text-cyan-400" />
                </motion.div>
                <div className="text-sm">Accessing archives...</div>
              </div>
            ) : recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map(note => {
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
                      key={note.id || note.filename || note.title}
                      className="bg-gray-900 border-2 p-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        borderColor: noteColor,
                        boxShadow: `0 0 5px rgba(${rgbColor}, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)`,
                      }}
                      whileHover={{
                        boxShadow: `0 0 10px rgba(${rgbColor}, 0.6), 1px 1px 0px 0px rgba(0,0,0,1)`
                      }}
                      onClick={() => handleEditNote(note)}
                    >
                      <div className="flex items-start gap-2">
                        <FileText size={14} style={{ color: noteColor }} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-mono font-bold text-white text-sm truncate mb-1">
                            {note.title}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {note.content && note.content.length > 60 
                              ? `${note.content.substring(0, 60)}...` 
                              : note.content}
                          </p>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {new Date(note.createdAt || note.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* View All Button */}
                <div className="pt-4 border-t border-gray-600">
                  <button className="w-full bg-gray-900 border border-cyan-400 px-3 py-2 text-cyan-400 font-mono text-sm hover:bg-gray-800 transition-colors hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    style={{
                      boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <span className="text-cyan-400">ACCESS ALL ARCHIVES →</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={32} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono text-sm">No log entries found</p>
                <p className="text-gray-500 font-mono text-xs mt-1">Begin your first personal log!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Modal using NoteModal */}
      <NoteModal
        isOpen={isFullscreenModalOpen}
        onClose={() => setIsFullscreenModalOpen(false)}
        onSave={handleFullscreenSave}
        folders={folders}
        notebooks={notebooks}
        existingNote={draftNote}
        isFullscreen={true}
        title="EXTENDED LOG ENTRY TERMINAL"
      />

      {/* Edit Modal */}
      <NoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setActiveNote(null);
        }}
        onSave={handleUpdateNote}
        folders={folders}
        notebooks={notebooks}
        existingNote={activeNote}
      />
    </div>
  );
};

export default NotesTab;