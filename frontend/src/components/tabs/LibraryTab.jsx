import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, BookOpen, FileText, Search, Download, Archive, Eye, Trash2 } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';
import useNotes from '../../hooks/useNotes';
import NoteModal from '../notes/NoteModal';
import NoteViewModal from '../notes/NoteViewModal';
import FolderModal from '../modals/FolderModal';
import NotebookModal from '../modals/NotebookModal';
import FolderView from '../views/FolderView';
import NotebookView from '../views/NotebookView';
import NoteListView from '../views/NoteListView';
import NotebookListView from '../views/NotebookListView';
import FolderListView from '../views/FolderListView';
import { useNotification } from '../../contexts/NotificationContext';

const LibraryTab = ({ tabColor = '#3B82F6', navigationParams = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [currentView, setCurrentView] = useState('library');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [defaultFolderId, setDefaultFolderId] = useState(null);
  const [defaultNotebookId, setDefaultNotebookId] = useState(null);
  
  // Use the hooks
  const { folders, loading: foldersLoading, createFolder, updateFolder, deleteFolder } = useFolders();
  const { notebooks, loading: notebooksLoading, createNotebook, updateNotebook, deleteNotebook } = useNotebooks();
  const { notes, loading: notesLoading, createNote, updateNote, deleteNote } = useNotes();
  const { showNotification } = useNotification();

  const loading = foldersLoading || notebooksLoading || notesLoading;

  // Convert hex to RGB for dynamic styling
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '59, 130, 246'; // fallback for #3B82F6
  };

  const tabColorRgb = hexToRgb(tabColor);

  // All handlers remain the same...
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this log entry? This action cannot be undone.')) {
      try {
        await deleteNote(noteId);
        showNotification('Log entry deleted successfully!', 'success');
      } catch (error) {
        console.error('Failed to delete note:', error);
        showNotification('Failed to delete log entry. Please try again.', 'error');
      }
    }
  };

  const handleDeleteNotebook = async (notebookId) => {
    if (window.confirm('Are you sure you want to delete this collection? All associated notes will become unorganized.')) {
      try {
        console.log('Deleting notebook with ID:', notebookId);
        await deleteNotebook(notebookId);
        showNotification('Collection deleted successfully!', 'success');
      } catch (error) {
        console.error('Failed to delete notebook:', error);
        console.error('Error details:', error.message);
        showNotification('Failed to delete collection. Please try again.', 'error');
      }
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this archive? All associated notes and collections will become unorganized.')) {
      try {
        await deleteFolder(folderId);
        showNotification('Archive deleted successfully!', 'success');
      } catch (error) {
        console.error('Failed to delete folder:', error);
        showNotification('Failed to delete archive. Please try again.', 'error');
      }
    }
  };

  // All other handlers remain the same...
  const handleCreateFolder = async () => {
    try {
      const folderData = {
        name: `New Archive ${folders.length + 1}`,
        description: 'A new archive for organizing your intel',
        colorCode: '#FFD700',
        parentFolderId: null
      };
      await createFolder(folderData);
    } catch (error) {
      console.error('Failed to initialize archive:', error);
    }
  };

  const handleCreateNotebook = async () => {
    try {
      const notebookData = {
        name: `New Collection ${notebooks.length + 1}`,
        description: 'A new log collection for your intel',
        colorCode: '#87CEEB'
      };
      await createNotebook(notebookData);
    } catch (error) {
      console.error('Failed to deploy collection:', error);
    }
  };

  const handleCreateNote = () => {
    setIsCreateNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsCreateNoteModalOpen(true);
  };

  const handleViewNote = (note) => {
    setViewingNote(note);
    setIsNoteViewModalOpen(true);
  };

  const handleEditNoteFromView = () => {
    const noteToEdit = viewingNote;
    setIsNoteViewModalOpen(false);
    setViewingNote(null);
    handleEditNote(noteToEdit);
  };

  const handleDeleteNoteFromView = async () => {
    if (viewingNote) {
      await handleDeleteNote(viewingNote.id);
      setIsNoteViewModalOpen(false);
      setViewingNote(null);
    }
  };

  const handleCreateNoteSubmit = async (idOrData, noteData = null) => {
    try {
      console.log('Archiving log entry:', { idOrData, noteData, editingNote });
      
      if (noteData) {
        // If noteData is provided, it means we're updating (idOrData is the ID)
        console.log('Updating log entry with ID:', idOrData);
        await updateNote(idOrData, noteData);
        console.log('Log entry updated successfully');
      } else {
        // If only idOrData is provided, it means we're creating (idOrData is the data)
        console.log('Creating new log entry');
        await createNote(idOrData);
        console.log('Log entry archived successfully');
      }
      
      setEditingNote(null);
      setIsCreateNoteModalOpen(false);
      
    } catch (error) {
      console.error('Failed to archive log entry:', error);
      alert('Failed to archive log entry. Please try again.');
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
    // Clear all states when going back
    setCurrentView('library');
    setSelectedFolder(null);
    setSelectedNotebook(null);
    setEditingNote(null);
    setEditingNotebook(null);
    setEditingFolder(null);
    setIsCreateNoteModalOpen(false);
    setIsNotebookModalOpen(false);
    setIsFolderModalOpen(false);
  };

  const handleViewAllNotes = () => {
    setCurrentView('allNotes');
  };

  const handleEditNoteFromList = (note) => {
    setEditingNote(note);
    setIsCreateNoteModalOpen(true);
    setCurrentView('library');
  };

  const handleViewAllNotebooks = () => {
    setCurrentView('allNotebooks');
  };

  const handleViewAllFolders = () => {
    setCurrentView('allFolders');
  };

  const handleFolderSave = async (idOrData, folderData = null) => {
    try {
      if (editingFolder && folderData) {
        await updateFolder(idOrData, folderData);
      } else {
        await createFolder(idOrData);
      }
      setEditingFolder(null);
    } catch (error) {
      console.error('Failed to save archive:', error);
    }
  };

  const handleEditNotebook = (notebook) => {
    setEditingNotebook(notebook);
    setIsNotebookModalOpen(true);
  };

  const handleNotebookSave = async (idOrData, notebookData = null) => {
    try {
      console.log('handleNotebookSave called with:', { idOrData, notebookData, editingNotebook });
      
      if (editingNotebook && notebookData) {
        console.log('Updating notebook with folderId:', notebookData.folderId);
        await updateNotebook(idOrData, notebookData);
      } else {
        console.log('Creating notebook with folderId:', idOrData.folderId);
        await createNotebook(idOrData);
      }
      setEditingNotebook(null);
      setIsNotebookModalOpen(false);
    } catch (error) {
      console.error('Failed to save collection:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  // Helper functions to calculate counts
  const getNotebookNoteCount = (notebookId) => {
    return notes.filter(note => note.notebookId === notebookId).length;
  };

  const getFolderItemCount = (folderId) => {
    const folderNotes = notes.filter(note => note.folderId === folderId);
    const folderNotebooks = notebooks.filter(notebook => notebook.folderId === folderId);
    return folderNotes.length + folderNotebooks.length;
  };

  useEffect(() => {
    if (navigationParams?.view === 'allNotes') {
      setCurrentView('allNotes');
    } else if (navigationParams?.view === 'folder' && navigationParams?.selectedFolder) {
      setCurrentView('folder');
      setSelectedFolder(navigationParams.selectedFolder);
    }
  }, [navigationParams]);

  if (loading) {
    return (
      <div className="library-tab-container p-6">
        <div className="text-center py-8 font-mono text-white">
          <div>Accessing storage vault...</div>
        </div>
      </div>
    );
  }

  // View routing remains the same but with updated colors...
  if (currentView === 'folder' && selectedFolder) {
    // Get notebooks in this folder
    const folderNotebooks = notebooks.filter(notebook => notebook.folderId === selectedFolder.id);
    const notebookIds = folderNotebooks.map(nb => nb.id);
    
    // Get notes that are either:
    // 1. Directly assigned to this folder (folderId matches)
    // 2. Belong to notebooks within this folder (notebookId matches)
    const folderNotes = notes.filter(note => 
      note.folderId === selectedFolder.id || 
      (note.notebookId && notebookIds.includes(note.notebookId))
    );
    
    return (
      <div className="library-tab-container p-6">
        <FolderView 
          folder={selectedFolder}
          onBack={handleBackToLibrary}
          onCreateNote={() => {
            setEditingNote(null);
            setDefaultFolderId(selectedFolder.id);  // Set default folder
            setIsCreateNoteModalOpen(true);
          }}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onDeleteNotebook={handleDeleteNotebook}
          onOpenNotebook={handleOpenNotebook}
          onCreateNotebook={() => {
            setEditingNotebook(null);
            setDefaultFolderId(selectedFolder.id);  // Set default folder
            setIsNotebookModalOpen(true);
          }}
          onEditNotebook={handleEditNotebook}
          folders={folders}
          notebooks={folderNotebooks}
          notes={folderNotes}
        />
        
        {/* Modals - Always render regardless of view */}
        <NoteViewModal
          isOpen={isNoteViewModalOpen}
          onClose={() => setIsNoteViewModalOpen(false)}
          onEdit={handleEditNoteFromView}
          onDelete={handleDeleteNoteFromView}
          note={viewingNote}
        />

        <NoteModal
          isOpen={isCreateNoteModalOpen}
          onClose={() => {
            setIsCreateNoteModalOpen(false);
            setEditingNote(null);
            setDefaultFolderId(null);
            setDefaultNotebookId(null);
          }}
          onSave={handleCreateNoteSubmit}
          onDelete={handleDeleteNote}
          folders={folders}
          notebooks={notebooks}
          existingNote={editingNote}
          defaultFolderId={defaultFolderId}
          defaultNotebookId={defaultNotebookId}
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
            setDefaultFolderId(null);
          }}
          onSave={handleNotebookSave}
          existingNotebook={editingNotebook}
          folders={folders}
          defaultFolderId={defaultFolderId}
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
          onEditNote={handleCreateNoteSubmit}
          onDeleteNote={handleDeleteNote}
          onDeleteNotebook={handleDeleteNotebook}
          folders={folders}
          notebooks={notebooks}
          notes={notes}
        />
        
        {/* Modals - Always render regardless of view */}
        <NoteViewModal
          isOpen={isNoteViewModalOpen}
          onClose={() => setIsNoteViewModalOpen(false)}
          onEdit={handleEditNoteFromView}
          onDelete={handleDeleteNoteFromView}
          note={viewingNote}
        />

        <NoteModal
          isOpen={isCreateNoteModalOpen}
          onClose={() => {
            setIsCreateNoteModalOpen(false);
            setEditingNote(null);
            setDefaultFolderId(null);
            setDefaultNotebookId(null);
          }}
          onSave={handleCreateNoteSubmit}
          onDelete={handleDeleteNote}
          folders={folders}
          notebooks={notebooks}
          existingNote={editingNote}
          defaultFolderId={defaultFolderId}
          defaultNotebookId={defaultNotebookId}
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
            setDefaultFolderId(null);
          }}
          onSave={handleNotebookSave}
          existingNotebook={editingNotebook}
          folders={folders}
          defaultFolderId={defaultFolderId}
        />
      </div>
    );
  }

  if (currentView === 'allNotes') {
    return (
      <>
        <NoteListView 
          notes={notes}
          onBack={() => setCurrentView('library')}
          onCreateNote={() => {
            setEditingNote(null);
            setIsCreateNoteModalOpen(true);
          }}
          onEditNote={handleEditNoteFromList}
          onDeleteNote={handleDeleteNote}
          folders={folders}
          notebooks={notebooks}
        />
        
        <NoteModal
          isOpen={isCreateNoteModalOpen}
          onClose={() => {
            setIsCreateNoteModalOpen(false);
            setEditingNote(null);
            setDefaultFolderId(null);  // ✅ Reset on close
            setDefaultNotebookId(null);  // ✅ Reset on close
          }}
          onSave={handleCreateNoteSubmit}
          onDelete={handleDeleteNote}
          folders={folders}
          notebooks={notebooks}
          existingNote={editingNote}
          defaultFolderId={defaultFolderId}  // ✅ Pass the default folder
          defaultNotebookId={defaultNotebookId}  // ✅ Pass the default notebook
        />
      </>
    );
  }

  if (currentView === 'allNotebooks') {
    return (
      <>
        <NotebookListView 
          notebooks={notebooks}
          onBack={() => setCurrentView('library')}
          onCreateNotebook={() => {
            setEditingNotebook(null);
            setIsNotebookModalOpen(true);
          }}
          onEditNotebook={handleEditNotebook}
          onDeleteNotebook={handleDeleteNotebook}
          onOpenNotebook={handleOpenNotebook}
          folders={folders}
        />
        
        <NotebookModal
          isOpen={isNotebookModalOpen}
          onClose={() => {
            setIsNotebookModalOpen(false);
            setEditingNotebook(null);
            setDefaultFolderId(null);  // ✅ Reset on close
          }}
          onSave={handleNotebookSave}
          existingNotebook={editingNotebook}
          folders={folders}
          defaultFolderId={defaultFolderId}  // ✅ Pass the default folder
        />
      </>
    );
  }

  if (currentView === 'allFolders') {
    return (
      <div className="library-tab-container">
        <FolderListView
          folders={folders}
          onBack={handleBackToLibrary}
          onCreateFolder={() => setIsFolderModalOpen(true)}
          onEditFolder={handleEditFolder}
          onOpenFolder={handleOpenFolder}
        />
        
        {/* Modals */}
        <FolderModal
          isOpen={isFolderModalOpen}
          onClose={() => {
            setIsFolderModalOpen(false);
            setEditingFolder(null);
          }}
          onSave={handleFolderSave}
          existingFolder={editingFolder}
        />
      </div>
    );
  }

  return (
    <div className="library-tab-container p-6">
      {/* Storage Vault - Simplified */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-mono font-bold text-white text-3xl">STORAGE VAULT</h1>
              <p className="font-mono text-xs text-gray-400">Storage for logs, collections, and archives</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span><span className="text-white font-bold">{folders.length}</span> ARCHIVES</span>
              <span><span className="text-white font-bold">{notebooks.length}</span> COLLECTIONS</span>
              <span><span className="text-white font-bold">{notes.length}</span> LOGS</span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setIsCreateNoteModalOpen(true)}
              className="bg-black border border-white px-3 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs"
            >
              <FileText size={14} />
              <span>NEW LOG</span>
            </button>

            <button
              onClick={() => setIsNotebookModalOpen(true)}
              className="bg-black border border-white px-3 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs"
            >
              <BookOpen size={14} />
              <span>NEW COLLECTION</span>
            </button>

            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="bg-black border border-white px-3 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs"
            >
              <Folder size={14} />
              <span>NEW ARCHIVE</span>
            </button>

            <button
              onClick={async () => {
                try {
                  console.log('Exporting all intelligence from Archive Terminal');
                  
                  const response = await fetch(`/api/notes/export/all?username=user`);
                  
                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `intelligence_export_${new Date().toISOString().slice(0, 10)}.md`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    showNotification('Intelligence data exported successfully! Check your Downloads folder.', 'success');
                  } else {
                    throw new Error('Export failed');
                  }
                } catch (error) {
                  console.error('Export error:', error);
                  showNotification('Export failed. Please try again later.', 'error');
                }
              }}
              className="bg-black border border-white px-3 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs"
            >
              <Download size={14} />
              <span>EXPORT ALL</span>
            </button>

            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 bg-black border border-gray-600 text-white font-mono text-xs focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections remain the same */}
      <div className="space-y-8">
        {/* Archive Systems Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-mono font-bold text-white flex items-center">
                  ARCHIVES ({folders.length})
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  Archive systems for organizing multiple collections and logs.
                </p>
              </div>
              <button
                onClick={handleViewAllFolders}
                className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden text-white hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>VIEW ALL</span>
                </div>
              </button>
            </div>
            
            {folders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {folders.slice(0, 4).map(folder => {
                  const folderColor = folder.colorCode || '#FFD700';
                  const rgbColor = folderColor.startsWith('#') 
                    ? `${parseInt(folderColor.slice(1, 3), 16)}, ${parseInt(folderColor.slice(3, 5), 16)}, ${parseInt(folderColor.slice(5, 7), 16)}`
                    : '251, 191, 36';
                
                  const itemCount = getFolderItemCount(folder.id);
                
                  return (
                    <motion.div
                      key={folder.id}
                      className="border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`,
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        boxShadow: `0 0 40px rgba(${rgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenFolder(folder)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Folder size={24} style={{ color: folderColor }} />
                        <div className="text-xs font-mono text-gray-400 bg-black px-2 py-1 border border-white">
                          ARCHIVE
                        </div>
                      </div>
                      <h4 className="font-mono font-bold text-white mb-2 truncate">{folder.name}</h4>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{folder.description || 'Access archive contents'}</p>
                      
                      <div className="text-xs text-gray-400 mb-2">
                        {itemCount} ITEMS
                      </div>
                    
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditFolder(folder);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                          title="Modify archive"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                          className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md transition-colors text-gray-400 hover:text-red-400"
                          title="Delete archive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-white p-8 text-center rounded-lg"
                   style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <Folder size={48} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono">No archive systems found. Initialize first archive storage.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Log Collections Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-mono font-bold text-white flex items-center">
                  COLLECTIONS ({notebooks.length})
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  Organized collections for grouping logs by subject, project or types.
                </p>
              </div>
              <button
                onClick={handleViewAllNotebooks}
                className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden text-white hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>VIEW ALL</span>
                </div>
              </button>
            </div>
            
            {notebooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notebooks.slice(0, 4).map(notebook => {
                  const notebookColor = notebook.colorCode || '#60A5FA';
                  const rgbColor = notebookColor.startsWith('#') 
                    ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
                    : '96, 165, 250';
                
                  const noteCount = getNotebookNoteCount(notebook.id);
                
                  return (
                    <motion.div
                      key={notebook.id}
                      className="border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`,
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        boxShadow: `0 0 40px rgba(${rgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenNotebook(notebook)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <BookOpen size={24} style={{ color: notebookColor }} />
                        <div className="text-xs font-mono text-gray-400 bg-black px-2 py-1 border border-white">
                          COLLECTION
                        </div>
                      </div>
                      <h4 className="font-mono font-bold text-white mb-2 truncate">{notebook.name}</h4>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{notebook.description || 'Access collection database'}</p>
                      
                      <div className="text-xs text-gray-400 mb-2">
                        {noteCount} LOGS
                      </div>
                    
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNotebook(notebook);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                          title="Edit collection"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotebook(notebook.id);
                          }}
                          className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md transition-colors text-gray-400 hover:text-red-400"
                          title="Delete collection"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-white p-8 text-center rounded-lg"
                   style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono">No log collections found. Deploy first collection to begin.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Player Logs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-white/60 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-mono font-bold text-white flex items-center">
                  LOG ENTRIES ({notes.length})
                </h3>
                <p className="text-sm font-mono text-gray-400">
                  Individual log entries for storing notes, thoughts and ideas.
                </p>
              </div>
              <button
                onClick={handleViewAllNotes}
                className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden text-white hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>VIEW ALL</span>
                </div>
              </button>
            </div>
            
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes
                  .slice()
                  .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
                  .slice(0, 4)
                  .map((note, index) => {
                    const noteColor = note.color || '#4ADE80';
                    const rgbColor = hexToRgb(noteColor);
                    const tagsArray = Array.isArray(note.tags) ? note.tags : (note.tags ? note.tags.split(',').map(tag => tag.trim()) : []);

                    return (
                      <motion.div
                        key={note.id}
                        className="border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`,
                        }}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          boxShadow: `0 0 40px rgba(${rgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewNote(note)}
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
                            : note.content}
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
                              handleEditNote(note);
                            }}
                            className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                            title="Edit log entry"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                            className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md transition-colors text-gray-400 hover:text-red-400"
                            title="Delete log entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ) : (
              <div className="border border-white p-8 text-center rounded-lg"
                   style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <FileText size={48} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono">No log entries found. Create your first log entry to begin tracking.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals - Always render regardless of view */}
      <NoteViewModal
        isOpen={isNoteViewModalOpen}
        onClose={() => setIsNoteViewModalOpen(false)}
        onEdit={handleEditNoteFromView}
        onDelete={handleDeleteNoteFromView}
        note={viewingNote}
      />

      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => {
          setIsCreateNoteModalOpen(false);
          setEditingNote(null);
          setDefaultFolderId(null);
          setDefaultNotebookId(null);
        }}
        onSave={handleCreateNoteSubmit}
        onDelete={handleDeleteNote}
        folders={folders}
        notebooks={notebooks}
        existingNote={editingNote}
        defaultFolderId={defaultFolderId}
        defaultNotebookId={defaultNotebookId}
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
          setDefaultFolderId(null);
        }}
        onSave={handleNotebookSave}
        existingNotebook={editingNotebook}
        folders={folders}
        defaultFolderId={defaultFolderId}
      />
    </div>
  );
};

export default LibraryTab;
                         