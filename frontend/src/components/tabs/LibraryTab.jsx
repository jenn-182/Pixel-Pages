import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, BookOpen, FileText, Search } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';

const LibraryTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or tree
  
  // Use the new hooks
  const { folders, loading: foldersLoading, createFolder } = useFolders();
  const { notebooks, loading: notebooksLoading, createNotebook } = useNotebooks();

  const loading = foldersLoading || notebooksLoading;

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
    console.log('Create note - will implement note creation modal');
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
        
        <div className="flex gap-3">
          <PixelButton
            onClick={handleCreateFolder}
            color="bg-yellow-400"
            hoverColor="hover:bg-yellow-500"
            icon={<Folder size={18} />}
          >
            New Folder
          </PixelButton>
          <PixelButton
            onClick={handleCreateNotebook}
            color="bg-blue-400"
            hoverColor="hover:bg-blue-500"
            icon={<BookOpen size={18} />}
          >
            New Notebook
          </PixelButton>
          <PixelButton
            onClick={handleCreateNote}
            color="bg-green-400"
            hoverColor="hover:bg-green-500"
            icon={<Plus size={18} />}
          >
            New Note
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
                  className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ borderTopColor: folder.colorCode, borderTopWidth: '4px' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Folder size={24} style={{ color: folder.colorCode }} />
                    <span className="text-xs text-gray-400 font-mono">
                      {folder.totalItemCount || 0} items
                    </span>
                  </div>
                  <h4 className="font-mono font-bold text-white mb-1">{folder.name}</h4>
                  <p className="text-xs text-gray-400">{folder.description || 'Click to explore'}</p>
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
                  className="border-2 border-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen size={24} className="text-blue-400" />
                    <span className="text-xs text-gray-400 font-mono">
                      {notebook.noteCount || 0} notes
                    </span>
                  </div>
                  <h4 className="font-mono font-bold text-white mb-1">{notebook.name}</h4>
                  <p className="text-xs text-gray-400">{notebook.description || 'Click to open'}</p>
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
                size="sm"
              >
                New Note
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryTab;