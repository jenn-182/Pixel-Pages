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
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white mb-2">Storage</h1>
          <p className="text-gray-400 font-mono text-sm">
            Organize your notes with folders and notebooks
          </p>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          {/* Your existing Create Note button */}
          <PixelButton
            onClick={() => setIsCreateNoteModalOpen(true)}
            color="bg-green-400"
            hoverColor="hover:bg-green-500"
            icon={<Plus size={18} />}
          >
            Create Note
          </PixelButton>
          
          {/* New Export Button */}
          <PixelButton
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
                  
                  // Beautiful success notification
                  showNotification('All notes exported successfully! Check your Downloads folder.', 'success');
                } else {
                  throw new Error('Export failed');
                }
              } catch (error) {
                console.error('Export error:', error);
                showNotification('Export failed. Please try again later.', 'error');
              }
            }}
            color="bg-blue-500"
            hoverColor="hover:bg-blue-600"
            icon={<Download size={18} />}
          >
            Export All
          </PixelButton>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <PixelInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search folders, notebooks, and notes..."
            className="pl-10"
            style={{ color: '#000' }}
          />
        </div>
        
        <div className="flex gap-2">
          <PixelButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'bg-purple-400' : 'bg-gray-400'}
            hoverColor={viewMode === 'grid' ? 'hover:bg-purple-500' : 'hover:bg-gray-500'}
          >
            Grid View
          </PixelButton>
          <PixelButton
            onClick={() => setViewMode('tree')}
            color={viewMode === 'tree' ? 'bg-purple-400' : 'bg-gray-400'}
            hoverColor={viewMode === 'tree' ? 'hover:bg-purple-500' : 'hover:bg-gray-500'}
          >
            Tree View
          </PixelButton>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {/* Folders Section */}
        <div>
          <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Folder size={20} className="text-yellow-400" />
            Folders ({folders.length})
          </h3>
          {folders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {folders.map(folder => (
                <motion.div
                  key={folder.id}
                  className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer group relative"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenFolder(folder)}
                  style={{ borderTopColor: folder.colorCode, borderTopWidth: '4px' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Folder size={24} style={{ color: folder.colorCode }} />
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 font-mono">
                        {folder.totalItemCount || 0} items
                      </span>
                      <span className="text-xs text-gray-500 font-mono group-hover:text-gray-400 transition-colors">
                        Click to open
                      </span>
                    </div>
                  </div>
                  <h4 className="font-mono font-bold text-white mb-1">{folder.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{folder.description || 'Click to open folder'}</p>
                  
                  {/* Edit button moved to bottom right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFolder(folder);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit folder"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-gray-600 bg-gray-800 p-6 text-center">
              <Folder size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono">No folders yet. Create one to get started!</p>
            </div>
          )}
        </div>

        {/* Notebooks Section */}
        <div>
          <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-400" />
            Notebooks ({notebooks.length})
          </h3>
          {notebooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notebooks.map(notebook => (
                <motion.div
                  key={notebook.id}
                  className="border-2 border-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer group relative"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenNotebook(notebook)}
                  style={{ borderTopColor: notebook.colorCode || '#87CEEB', borderTopWidth: '4px' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen size={24} style={{ color: notebook.colorCode || '#87CEEB' }} />
                    <span className="text-xs text-gray-400 font-mono">
                      {notebook.noteCount || 0} notes
                    </span>
                  </div>
                  <h4 className="font-mono font-bold text-white mb-1">{notebook.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{notebook.description || 'Click to open notebook'}</p>
                  
                  {/* Edit button moved to bottom right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNotebook(notebook);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit notebook"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-gray-600 bg-gray-800 p-6 text-center">
              <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono">No notebooks yet. Create one to organize your notes!</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-green-400" />
            Notes ({notes.length})
          </h3>
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map(note => {
                // Handle tags properly - could be string, array, or null
                const getTags = (tags) => {
                  if (!tags) return [];
                  if (Array.isArray(tags)) return tags;
                  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim());
                  return [];
                };
                
                const tagsArray = getTags(note.tags);
                
                return (
                  <motion.div
                    key={note.id}
                    className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer hover:bg-gray-750 transition-colors group relative"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEditNote(note)} // Click to edit
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
                      <div className="flex flex-wrap gap-1 mb-2">
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
                    
                    {/* Edit button in bottom right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit note"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="border-2 border-gray-600 bg-gray-800 p-6 text-center">
              <FileText size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-mono mb-4">No notes yet. Create one to start writing!</p>
              <PixelButton
                onClick={handleCreateNote}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<Plus size={18} />}
              >
                Create Your First Note
              </PixelButton>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-6">
          <h4 className="font-mono text-lg font-bold text-white mb-4">Quick Start</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 border border-gray-600">
              <Folder size={24} className="text-yellow-400 mb-2" />
              <h5 className="font-mono font-bold text-white mb-1">Create Folder</h5>
              <p className="text-xs text-gray-400 mb-3">Organize related notebooks and notes</p>
              <PixelButton
                onClick={handleCreateFolder}
                color="bg-yellow-400"
                hoverColor="hover:bg-yellow-500"
                size="sm"
              >
                New Folder
              </PixelButton>
            </div>
            
            <div className="bg-gray-700 p-4 border border-gray-600">
              <BookOpen size={24} className="text-blue-400 mb-2" />
              <h5 className="font-mono font-bold text-white mb-1">Create Notebook</h5>
              <p className="text-xs text-gray-400 mb-3">Group related notes together</p>
              <PixelButton
                onClick={handleCreateNotebook}
                color="bg-blue-400"
                hoverColor="hover:bg-blue-500"
                size="sm"
              >
                New Notebook
              </PixelButton>
            </div>
            
            <div className="bg-gray-700 p-4 border border-gray-600">
              <FileText size={24} className="text-green-400 mb-2" />
              <h5 className="font-mono font-bold text-white mb-1">Create Note</h5>
              <p className="text-xs text-gray-400 mb-3">Start writing immediately</p>
              <PixelButton
                onClick={handleCreateNote}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<FileText size={18} />}
                className="w-full"
              >
                Create Note
              </PixelButton>
            </div>
          </div>
        </div>
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