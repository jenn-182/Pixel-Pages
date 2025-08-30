import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, BookOpen, FileText, Search, Download, Archive } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';
import useNotes from '../../hooks/useNotes';
import NoteModal from '../notes/NoteModal'; // Updated import path and name
import FolderModal from '../modals/FolderModal';
import NotebookModal from '../modals/NotebookModal'; // Fixed path
import FolderView from '../views/FolderView';
import NotebookView from '../views/NotebookView';
import { useNotification } from '../../contexts/NotificationContext';

const LibraryTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or tree
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [currentView, setCurrentView] = useState('library'); // 'library', 'folder', or 'notebook'
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  
  // Use the new hooks
  const { folders, loading: foldersLoading, createFolder, updateFolder } = useFolders();
  const { notebooks, loading: notebooksLoading, createNotebook, updateNotebook } = useNotebooks();
  const { notes, loading: notesLoading, createNote, updateNote } = useNotes();
  const { showNotification } = useNotification();

  const loading = foldersLoading || notebooksLoading || notesLoading;

  const handleCreateFolder = async () => {
    try {
      const folderData = {
        name: `New Folder ${folders.length + 1}`,
        description: 'A new folder for organizing your notes',
        colorCode: '#FFD700',
        parentFolderId: null
      };
      await createFolder(folderData);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleCreateNotebook = async () => {
    try {
      const notebookData = {
        name: `New Notebook ${notebooks.length + 1}`,
        description: 'A new notebook for your notes',
        colorCode: '#87CEEB'
      };
      await createNotebook(notebookData);
    } catch (error) {
      console.error('Failed to create notebook:', error);
    }
  };

  const handleCreateNote = () => {
    setIsCreateNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsCreateNoteModalOpen(true);
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      console.log('Saving note:', { editingNote, noteData }); // Debug log
      
      if (editingNote) {
        // Update existing note
        console.log('Updating note with ID:', editingNote.id); // Debug log
        await updateNote(editingNote.id, noteData);
        console.log('Note updated successfully'); // Debug log
      } else {
        // Create new note
        console.log('Creating new note'); // Debug log
        await createNote(noteData);
        console.log('Note created successfully'); // Debug log
      }
      
      setEditingNote(null);
      setIsCreateNoteModalOpen(false); // Close modal after successful save
      
    } catch (error) {
      console.error('Failed to save note:', error);
      // Show error to user
      alert('Failed to save note. Please try again.');
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
    setCurrentView('folder');
  };

  const handleOpenNotebook = (notebook) => {
    setSelectedNotebook(notebook);
    setCurrentView('notebook');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedFolder(null);
    setSelectedNotebook(null);
  };

  const handleFolderSave = async (idOrData, folderData = null) => {
    try {
      if (editingFolder && folderData) {
        // Editing case: first param is ID, second is data
        await updateFolder(idOrData, folderData);
      } else {
        // Creating case: first param is data
        await createFolder(idOrData);
      }
      setEditingFolder(null);
    } catch (error) {
      console.error('Failed to save folder:', error);
    }
  };

  const handleEditNotebook = (notebook) => {
    setEditingNotebook(notebook);
    setIsNotebookModalOpen(true);
  };

  const handleNotebookSave = async (idOrData, notebookData = null) => {
    try {
      if (editingNotebook && notebookData) {
        // Editing case: first param is ID, second is data
        await updateNotebook(idOrData, notebookData);
      } else {
        // Creating case: first param is data
        await createNotebook(idOrData);
      }
      setEditingNotebook(null);
    } catch (error) {
      console.error('Failed to save notebook:', error);
    }
  };

  if (loading) {
    return (
      <div className="library-tab-container p-6">
        <div className="text-center py-8 font-mono text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Folder size={32} className="text-yellow-400" />
          </motion.div>
          <div>Loading library...</div>
        </div>
      </div>
    );
  }

  if (currentView === 'folder' && selectedFolder) {
    return (
      <div className="library-tab-container p-6">
        <FolderView
          folder={selectedFolder}
          onBack={handleBackToLibrary}
          onCreateNote={handleCreateNoteSubmit}
          folders={folders}
          notebooks={notebooks}
          notes={notes}
        />
      </div>
    );
  }

  if (currentView === 'notebook' && selectedNotebook) {
    return (
      <div className="library-tab-container p-6">
        <NotebookView
          notebook={selectedNotebook}
          onBack={handleBackToLibrary}
          onCreateNote={handleCreateNoteSubmit}
          folders={folders}
          notebooks={notebooks}
          notes={notes}
        />
      </div>
    );
  }

  return (
    <div className="library-tab-container p-6">
      {/* Header - Updated to match HeroCard style */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-6 h-6 bg-purple-400 border border-gray-600" />
          STORAGE TERMINAL
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Access your digital archives and data repositories
        </p>
      </div>
      
      {/* Action Bar - Enhanced Futuristic style */}
      <div className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative"
           style={{
             boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
           }}>
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
        
        {/* Terminal Header - Remove the box */}
        <div className="flex items-center mb-6">
          <span className="font-mono font-bold text-white text-2xl">COMMAND INTERFACE</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-start justify-between h-32">
          {/* Command Buttons Section - Smaller width */}
          <div className="w-full lg:w-1/2 flex flex-col justify-end h-full">
            {/* Description Text - Above buttons with space - Larger */}
            <p className="font-mono text-sm text-gray-300 mb-4 font-semibold">
              Initialize new data structures or export existing archives
            </p>
            
            {/* Command Buttons - Updated to cyan theme */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-12">
              {/* Create Data Entry - Now cyan */}
              <button
                onClick={() => setIsCreateNoteModalOpen(true)}
                className="bg-gray-900 border-2 border-cyan-400 px-3 py-0.5 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 h-full"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center justify-center gap-1 h-full">
                  <Plus size={10} />
                  <FileText size={12} />
                  <span className="text-xs">ENTRY</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>

              {/* Create Data Collection - Now cyan */}
              <button
                onClick={() => setIsNotebookModalOpen(true)}
                className="bg-gray-900 border-2 border-cyan-400 px-3 py-0.5 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 h-full"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center justify-center gap-1 h-full">
                  <Plus size={10} />
                  <BookOpen size={12} />
                  <span className="text-xs">COLLECTION</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>

              {/* Create Folder System - Now cyan */}
              <button
                onClick={() => setIsFolderModalOpen(true)}
                className="bg-gray-900 border-2 border-cyan-400 px-3 py-0.5 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 h-full"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center justify-center gap-1 h-full">
                  <Plus size={10} />
                  <Folder size={12} />
                  <span className="text-xs">FOLDER</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>

              {/* Export All - Now cyan */}
              <button
                onClick={async () => {
                  try {
                    console.log('Exporting all notes from LibraryTab');
                    
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
                      
                      showNotification('All notes exported successfully! Check your Downloads folder.', 'success');
                    } else {
                      throw new Error('Export failed');
                    }
                  } catch (error) {
                    console.error('Export error:', error);
                    showNotification('Export failed. Please try again later.', 'error');
                  }
                }}
                className="bg-gray-900 border-2 border-cyan-400 px-3 py-0.5 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400 h-full"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center justify-center gap-1 h-full">
                  <Download size={12} />
                  <span className="text-xs">EXPORT</span>
                </div>
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Search Terminal - Restored to proper size */}
          <div className="bg-gray-900 border border-cyan-400 p-4 relative w-full lg:w-1/2 h-full flex flex-col overflow-hidden"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            {/* Search Protocol Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-cyan-400" />
              <span className="font-mono text-sm text-cyan-400 font-bold">SEARCH PROTOCOL</span>
            </div>
            
            {/* Search Input - Normal size */}
            <div className="relative mb-3 flex-1 flex flex-col justify-center min-h-0">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database archives..."
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                style={{ color: '#fff' }}
              />
            </div>
            
            {/* Search Stats */}
            <div className="text-xs font-mono text-gray-400 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{folders.length} FOLDERS</span>
                  <span>{notebooks.length} COLLECTIONS</span>
                  <span>{notes.length} ENTRIES</span>
                </div>
                <div className="text-cyan-400">
                  {searchTerm ? 'FILTERING...' : 'READY'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections - All sections now have cyan borders */}
      <div className="space-y-8">
        {/* Folders Section - Now CYAN border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
          style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
          
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            FOLDER SYSTEMS ({folders.length})
          </h3>
          
          {folders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Folders Section - Remove corner decoration */}
              {folders.map(folder => {
                const folderColor = folder.colorCode || '#FFD700'; // Default to yellow
                const rgbColor = folderColor.startsWith('#') 
                  ? `${parseInt(folderColor.slice(1, 3), 16)}, ${parseInt(folderColor.slice(3, 5), 16)}, ${parseInt(folderColor.slice(5, 7), 16)}`
                  : '251, 191, 36'; // Default yellow RGB
                
                return (
                  <motion.div
                    key={folder.id}
                    className="bg-gray-900 border-2 p-4 cursor-pointer group relative transition-all duration-300"
                    style={{
                      borderColor: folderColor,
                      boxShadow: `0 0 10px rgba(${rgbColor}, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)`,
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 20px rgba(${rgbColor}, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenFolder(folder)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Folder size={24} style={{ color: folderColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                        {folder.totalItemCount || 0} ITEMS
                      </div>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate">{folder.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{folder.description || 'Access folder contents'}</p>
                    
                    {/* Corner decoration removed */}
                    
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(folder);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Modify folder"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 p-6 text-center">
              <Folder size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono">No folder systems detected. Initialize new directory structure.</p>
            </div>
          )}
        </motion.div>

        {/* Notebooks Section - Now CYAN border */}
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
          
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            DATA COLLECTIONS ({notebooks.length})
          </h3>
          
          {notebooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Notebooks Section - Corner accent always blue */}
              {notebooks.map(notebook => {
                const notebookColor = notebook.colorCode || '#60A5FA'; // Default to blue
                const rgbColor = notebookColor.startsWith('#') 
                  ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
                  : '96, 165, 250'; // Default blue RGB
                
                return (
                  <motion.div
                    key={notebook.id}
                    className="bg-gray-900 border-2 p-4 cursor-pointer group relative transition-all duration-300"
                    style={{
                      borderColor: notebookColor,
                      boxShadow: `0 0 10px rgba(${rgbColor}, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)`,
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 20px rgba(${rgbColor}, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenNotebook(notebook)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <BookOpen size={24} style={{ color: notebookColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                        {notebook.noteCount || 0} ENTRIES
                      </div>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate">{notebook.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{notebook.description || 'Access collection database'}</p>
                    
                    {/* Corner decoration removed */}
                    
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNotebook(notebook);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Modify collection"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 p-6 text-center">
              <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono">No collections found. Create data collection to begin.</p>
            </div>
          )}
        </motion.div>

        {/* Notes Section - Now CYAN border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
          style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
          
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            DATA ENTRIES ({notes.length})
          </h3>
          
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map(note => {
                const getTags = (tags) => {
                  if (!tags) return [];
                  if (Array.isArray(tags)) return tags;
                  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim());
                  return [];
                };
                
                const tagsArray = getTags(note.tags);
                
                // Fix: Use note.color instead of note.colorCode
                const noteColor = note.color || note.colorCode || '#4ADE80'; // Default to green
                
                // Convert hex to RGB with proper validation
                const hexToRgb = (hex) => {
                  if (!hex || !hex.startsWith('#')) return '74, 222, 128'; // Default green RGB
                  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                  return result ? 
                    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
                    '74, 222, 128'; // Default green RGB
                };
                
                const rgbColor = hexToRgb(noteColor);
                
                console.log('Note color data:', { 
                  noteId: note.id, 
                  noteTitle: note.title,
                  color: note.color,
                  colorCode: note.colorCode, 
                  noteColor, 
                  rgbColor 
                }); // Debug log
                
                return (
                  <motion.div
                    key={note.id}
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
                    
                    {/* Tags */}
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tagsArray.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
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
                    
                    {/* Corner decoration removed */}
                    
                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Modify entry"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 p-6 text-center">
              <FileText size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono mb-4">No data entries found. Initialize first entry.</p>
              <PixelButton
                onClick={handleCreateNote}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<Plus size={18} />}
              >
                CREATE FIRST ENTRY
              </PixelButton>
            </div>
          )}
        </motion.div>
      </div>

      {/* Note Creation Modal */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => {
          setIsCreateNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleCreateNoteSubmit}
        folders={folders}
        notebooks={notebooks}
        existingNote={editingNote} // Pass the note being edited
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onSave={handleFolderSave}
        existingFolder={editingFolder}
      />

      <NotebookModal
        isOpen={isNotebookModalOpen}
        onClose={() => {
          setIsNotebookModalOpen(false);
          setEditingNotebook(null);
        }}
        onSave={handleNotebookSave}
        existingNotebook={editingNotebook}
      />
    </div>
  );
};

export default LibraryTab;