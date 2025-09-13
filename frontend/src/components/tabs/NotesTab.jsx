import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Clock, Save, X, Maximize2, Minimize2, Eye, Palette, Archive } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import NoteCard from '../notes/NoteCard';
import NoteModal from '../notes/NoteModal';
import NoteListView from '../views/NoteListView';
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
  const [quickColor, setQuickColor] = useState('#4ADE80'); // Add color state
  const [quickFolderId, setQuickFolderId] = useState(''); // Add folder state
  const [quickNotebookId, setQuickNotebookId] = useState(''); // Add notebook state
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('TERMINAL READY');
  
  // Modal states
  const [activeNote, setActiveNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);

  // Color options for quick selection
  const colorOptions = [
    '#4ADE80', // Green
    '#22D3EE', // Cyan
    '#A78BFA', // Purple
    '#FB7185', // Pink
    '#FBBF24', // Yellow
    '#F87171', // Red
    '#60A5FA', // Blue
    '#34D399', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
  ];

  const recentNotes = notes
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 7);

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
        color: quickColor,
        folderId: quickFolderId || null,
        notebookId: quickNotebookId || null,
      };
      
      await createNote(noteData);
      
      // Clear form
      setQuickTitle('');
      setQuickContent('');
      setQuickTags('');
      // Keep color, folder, and notebook selections for convenience
      setSaveStatus('LOG SAVED!');
      
      setTimeout(() => setSaveStatus('TERMINAL READY'), 2000);
      
    } catch (error) {
      console.error('Failed to save quick note:', error);
      setSaveStatus('TRANSMISSION FAILED');
      setTimeout(() => setSaveStatus('TERMINAL READY'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [quickTitle, quickContent, quickTags, quickColor, quickFolderId, quickNotebookId, createNote]);

  const handleClearForm = () => {
    setQuickTitle('');
    setQuickContent('');
    setQuickTags('');
    setQuickColor('#4ADE80');
    setQuickFolderId('');
    setQuickNotebookId('');
    setSaveStatus('TERMINAL READY');
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setIsEditModalOpen(true);
  };

  const handleUpdateNote = async (idOrData, noteData = null) => {
    try {
      if (noteData) {
        // If noteData is provided, it means we're updating (idOrData is the ID)
        await updateNote(idOrData, noteData);
      } else {
        // If only idOrData is provided and we have activeNote, update it
        await updateNote(activeNote.id, idOrData);
      }
      setIsEditModalOpen(false);
      setActiveNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to update log entry: ' + error.message);
    }
  };

  //  fullscreen modal save 
  const handleFullscreenSave = async (idOrData, noteData = null) => {
    try {
      if (noteData) {
        // If noteData is provided, it means we're updating (idOrData is the ID)
        await updateNote(idOrData, noteData);
      } else {
        // If only idOrData is provided, it means we're creating (idOrData is the data)
        await createNote(idOrData);
      }
      setIsFullscreenModalOpen(false);
      
      
      setQuickTitle('');
      setQuickContent('');
      setQuickTags('');
      // Keep color, folder, and notebook for convenience
      
      // Update the status indicators
      setSaveStatus('LOG SAVED!');
      setTimeout(() => setSaveStatus('TERMINAL READY'), 2000);

    } catch (error) {
      console.error('Failed to save fullscreen note:', error);
      alert('Failed to save log entry: ' + error.message);
    }
  };

  // toggleFullscreen to use current form data
  const toggleFullscreen = () => {
    console.log('Toggling fullscreen modal with current form data');
    setIsFullscreenModalOpen(!isFullscreenModalOpen);
  };

  // Handle view all archives
  const handleViewAllArchives = () => {
    setShowAllNotes(true);
  };

  const handleEditNoteFromList = (note) => {
    setActiveNote(note);
    setIsEditModalOpen(true);
    setShowAllNotes(false);
  };

  // Create a draft note object for fullscreen mode with current form data
  const draftNote = {
    title: quickTitle,
    content: quickContent,
    tags: quickTags.trim() ? quickTags.split(',').map(tag => tag.trim()) : [],
    color: quickColor,
    folderId: quickFolderId || null,
    notebookId: quickNotebookId || null,
  };

  // Show all notes view
  if (showAllNotes) {
    return (
      <>
        <NoteListView 
          notes={notes}
          onBack={() => setShowAllNotes(false)}
          onCreateNote={() => {
            setActiveNote(null);
            setIsEditModalOpen(true);
          }}
          onEditNote={handleEditNoteFromList}
          folders={folders}
          notebooks={notebooks}
        />
        
        <NoteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setActiveNote(null);
          }}
          onSave={activeNote ? handleUpdateNote : handleFullscreenSave}
          onDelete={deleteNote}
          folders={folders}
          notebooks={notebooks}
          existingNote={activeNote}
        />
      </>
    );
  }

  return (
    <>
      {/* Force white text CSS */}
      <style jsx>{`
        .notes-tab-container input,
        .notes-tab-container textarea,
        .notes-tab-container select {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #22d3ee !important;
        }
        
        .notes-tab-container input::placeholder,
        .notes-tab-container textarea::placeholder {
          color: #6b7280 !important;
          -webkit-text-fill-color: #6b7280 !important;
        }
        
        .notes-tab-container input:focus,
        .notes-tab-container textarea:focus {
          caret-color: #22d3ee !important;
          outline: none !important;
        }
        
        .notes-tab-container input::-webkit-spelling-error,
        .notes-tab-container textarea::-webkit-spelling-error {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          text-decoration: underline wavy red !important;
        }
        
        .notes-tab-container input::-webkit-grammar-error,
        .notes-tab-container textarea::-webkit-grammar-error {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          text-decoration: underline wavy red !important;
        }
      `}</style>
      
      <div className="notes-tab-container p-6">
        {/* Header - Removed PLAYER LOGS header and description */}

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
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 min-h-[calc(100vh-300px)]">
          
          {/* Left Side - Quick Entry Terminal (70% width) */}
          <div className="lg:col-span-7">
            <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="border-2 border-white/30 
             shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
             p-6 relative min-h-full flex flex-col 
             rounded-lg bg-black/40 backdrop-blur-md"
>
  <div className="absolute inset-0 border-2 border-white/20 animate-pulse pointer-events-none rounded-lg" />
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />

  <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h2 className="text-3xl font-mono font-bold text-white">LOG ENTRY TERMINAL</h2>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={toggleFullscreen}
                      className="bg-black border-2 border-white px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                      style={{
                        boxShadow: `0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,0)`
                      }}
                      title="Extended Terminal Mode (F11)"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                      <div className="relative z-10 flex items-center gap-2">
                        <Maximize2 size={16} className="text-white" />
                        <span className="text-white">EXTENDED MODE</span>
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white font-mono text-sm mb-4">
                  Quick entry terminal for creating notes, ideas and reports.
                </p>

                {/* Terminal Status - moved below header */}
                <div className="flex justify-end mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={`w-2 h-2 ${
                      saveStatus === 'TERMINAL READY' ? 'bg-green-400' :
                      saveStatus === 'INPUT DETECTED...' ? 'bg-yellow-400' :
                      saveStatus === 'TRANSMITTING...' ? 'bg-blue-400' :
                      saveStatus === 'LOG SAVED!' ? 'bg-green-400' :
                      'bg-red-400'
                    }`} />
                    <span className="text-green-400">{saveStatus}</span>
                  </div>
                </div>

                {/* Quick Entry Form */}
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">TITLE</label>
                    <input
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      placeholder="Enter title..."
                      spellCheck={false}
                      className="w-full px-4 py-3 transition-colors placeholder-gray-500 bg-black border-2 border-white font-mono text-sm focus:outline-none rounded"
                      style={{ 
                        color: '#ffffff !important',
                        WebkitTextFillColor: '#ffffff !important',
                        textFillColor: '#ffffff !important',
                        caretColor: '#ffffff !important',
                        boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Content Input - Made Much Taller */}
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-mono text-gray-400 mb-2">CONTENT</label>
                    <div className="mb-2 text-xs font-mono text-purple-400 flex items-center gap-2">
                      <Maximize2 size={12} />
                      <span>Open in Extended Mode to use Markdown formatting</span>
                    </div>
                    <textarea
                      value={quickContent}
                      onChange={(e) => setQuickContent(e.target.value)}
                      placeholder="Enter content here..."
                      spellCheck={false}
                      className="w-full px-4 py-3 transition-colors resize-none placeholder-gray-500 bg-black border-2 border-white font-mono text-sm focus:outline-none flex-1 rounded"
                      style={{ 
                        color: '#ffffff !important',
                        WebkitTextFillColor: '#ffffff !important',
                        textFillColor: '#ffffff !important',
                        minHeight: '500px',
                        caretColor: '#22d3ee !important',
                        boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Color Picker */}
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-3 flex items-center gap-2">
                        <Palette size={14} />
                        LOG COLOR SIGNATURE
                      </label>
                      <div 
                        className="border-2 border-white p-4 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                        }}
                      >
                        {/* Selected Color Display */}
                        <div className="flex items-center gap-3 mb-4 p-2 border border-gray-600 rounded bg-black/40">
                          <div 
                            className="w-8 h-8 border-2 border-white rounded-full flex-shrink-0"
                            style={{ 
                              backgroundColor: quickColor,
                              boxShadow: `0 0 15px ${quickColor}60`
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-xs font-mono text-gray-400 uppercase">ACTIVE COLOR</div>
                            <div className="text-sm font-mono text-white font-bold">{quickColor.toUpperCase()}</div>
                          </div>
                        </div>
                        
                        {/* Color Palette Grid */}
                        <div className="mb-4">
                          <div className="text-xs font-mono text-gray-400 mb-2 uppercase">PRESET SIGNATURES</div>
                          <div className="grid grid-cols-5 gap-2">
                            {colorOptions.map((color, index) => (
                              <button
                                key={index}
                                onClick={() => setQuickColor(color)}
                                className={`w-8 h-8 border-2 transition-all hover:scale-110 hover:rotate-12 rounded-lg relative group ${
                                  quickColor === color ? 'border-white' : 'border-gray-600'
                                }`}
                                style={{ 
                                  backgroundColor: color,
                                  boxShadow: quickColor === color ? `0 0 15px ${color}80` : `0 0 8px ${color}40`
                                }}
                                title={`Color: ${color}`}
                              >
                                {quickColor === color && (
                                  <div className="absolute inset-0 rounded-lg border-2 border-white animate-pulse" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Custom Color Picker */}
                        <div className="border border-gray-600 p-2 rounded bg-black/40">
                          <div className="text-xs font-mono text-gray-400 mb-2 uppercase">CUSTOM SIGNATURE</div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={quickColor}
                              onChange={(e) => setQuickColor(e.target.value)}
                              className="w-8 h-8 border-2 border-gray-500 bg-transparent cursor-pointer rounded"
                              style={{
                                boxShadow: `0 0 8px ${quickColor}40`
                              }}
                            />
                            <input
                              type="text"
                              value={quickColor}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                  setQuickColor(value);
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-black border border-gray-600 text-white font-mono text-xs rounded focus:outline-none focus:border-white"
                              placeholder="#FFFFFF"
                              maxLength={7}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Tags, Archive/Collection + Action Buttons */}
                    <div className="space-y-4">
                      {/* Tags Input - moved here above dropdowns */}
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">CLASSIFICATION TAGS</label>
                        <input
                          value={quickTags}
                          onChange={(e) => setQuickTags(e.target.value)}
                          placeholder="personal, work, idea, important..."
                          spellCheck={false}
                          className="w-full px-4 py-3 transition-colors placeholder-gray-500 bg-black border-2 border-white font-mono text-sm focus:outline-none rounded"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff !important',
                            textFillColor: '#ffffff !important',
                            caretColor: '#ffffff !important',
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                          }}
                        />
                      </div>

                      {/* Archive Assignment */}
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2 flex items-center gap-2">
                          <Archive size={14} />
                          ARCHIVE
                        </label>
                        <select
                          value={quickFolderId}
                          onChange={(e) => setQuickFolderId(e.target.value)}
                          className="w-full px-3 py-3 bg-black border-2 border-white font-mono text-sm focus:outline-none rounded"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff !important',
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                          }}
                        >
                          <option value="">No Archive</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Collection Assignment */}
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2 flex items-center gap-2">
                          <FileText size={14} />
                          COLLECTION
                        </label>
                        <select
                          value={quickNotebookId}
                          onChange={(e) => setQuickNotebookId(e.target.value)}
                          className="w-full px-3 py-3 bg-black border-2 border-white font-mono text-sm focus:outline-none rounded"
                          style={{ 
                            color: '#ffffff !important',
                            WebkitTextFillColor: '#ffffff !important',
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.2)`
                          }}
                        >
                          <option value="">No Collection</option>
                          {notebooks.map(notebook => (
                            <option key={notebook.id} value={notebook.id}>
                              {notebook.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action Buttons - Made the same size */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleQuickSave}
                          disabled={isSaving || (!quickTitle.trim() && !quickContent.trim())}
                          className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden rounded"
                          style={{
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`,
                            minHeight: '48px'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Save size={16} className="text-white" />
                            <span className="text-white text-sm">{isSaving ? 'SAVING...' : 'SAVE LOG ENTRY'}</span>
                          </div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                        </button>

                        <button
                          onClick={handleClearForm}
                          className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                          style={{
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`,
                            minHeight: '48px'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <X size={16} className="text-white" />
                            <span className="text-white text-sm">CLEAR TERMINAL</span>
                          </div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Recent Activity Feed (30% width) */}
          <div className="lg:col-span-3">
            <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="border-2 border-white/30 
             shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
             p-6 relative min-h-full flex flex-col 
             rounded-lg bg-black/40 backdrop-blur-md"
>
  <div className="absolute inset-0 border-2 border-white/20 animate-pulse pointer-events-none rounded-lg" />
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
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
                    <div className="text-sm">Accessing logs...</div>
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
                          className="border-2 border-white p-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02] relative overflow-hidden rounded-lg"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)`,
                          }}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                            boxShadow: `0 0 40px rgba(${rgbColor}, 1), 2px 2px 0px 0px rgba(0,0,0,1)`
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEditNote(note)}
                        >
                          <div className="relative z-10 flex items-start gap-2">
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
                    
                    {/*View All Button */}
                    <div className="pt-4 border-t border-gray-600">
                      <button 
                        onClick={handleViewAllArchives}
                        className="w-full bg-black border-2 border-white px-3 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                        style={{
                          boxShadow: `0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <Eye size={16} className="text-white" />
                          <span className="text-white">ACCESS ALL LOGS</span>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
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
              </div>
            </motion.div>
          </div>
        </div>

        {/* Use NoteModal for fullscreen */}
        <NoteModal
          isOpen={isFullscreenModalOpen}
          onClose={() => setIsFullscreenModalOpen(false)}
          onSave={handleFullscreenSave}
          folders={folders}
          notebooks={notebooks}
          existingNote={draftNote}
          title="EXTENDED LOG ENTRY TERMINAL"
        />

        {/* Edit Modal */}
        <NoteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setActiveNote(null);
          }}
          onSave={activeNote ? handleUpdateNote : handleFullscreenSave}
          onDelete={deleteNote}
          folders={folders}
          notebooks={notebooks}
          existingNote={activeNote}
        />
      </div>
    </>
  );
};

export default NotesTab;