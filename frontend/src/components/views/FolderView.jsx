import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, BookOpen, FileText, Plus } from 'lucide-react';
import PixelButton from '../PixelButton';
import NoteModal from '../notes/NoteModal';

const FolderView = ({ folder, onBack, onCreateNote, folders, notebooks, notes }) => {
  const [folderNotes, setFolderNotes] = useState([]);
  const [folderNotebooks, setFolderNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

  useEffect(() => {
    filterFolderContents(); // Fixed function name
  }, [folder.id, notes, notebooks]);

  const filterFolderContents = () => {
    try {
      setLoading(true);
      
      // Filter notes that belong to this folder
      const filteredNotes = notes.filter(note => note.folderId === folder.id);
      setFolderNotes(filteredNotes);

      // Filter notebooks that belong to this folder
      const filteredNotebooks = notebooks.filter(notebook => notebook.folderId === folder.id);
      setFolderNotebooks(filteredNotebooks);
      
    } catch (error) {
      console.error('Error filtering folder contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setIsCreateNoteModalOpen(true);
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      const noteWithFolder = {
        ...noteData,
        folderId: folder.id
      };
      await onCreateNote(noteWithFolder);
      setIsCreateNoteModalOpen(false);
      filterFolderContents(); // Fixed function name
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const getTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim());
    return [];
  };

  if (loading) {
    return (
      <div className="text-center py-8 font-mono text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Folder size={32} style={{ color: folder.colorCode }} />
        </motion.div>
        <div>Loading folder contents...</div>
      </div>
    );
  }

  return (
    <div className="folder-view-container">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <PixelButton
          onClick={onBack}
          color="bg-gray-400"
          hoverColor="hover:bg-gray-500"
          icon={<ArrowLeft size={18} />}
        >
          Back to Library
        </PixelButton>
        
        <div className="flex items-center gap-3 flex-1">
          <Folder size={32} style={{ color: folder.colorCode }} />
          <div>
            <h1 className="font-mono text-2xl font-bold text-white">{folder.name}</h1>
            <p className="text-gray-400 font-mono text-sm">{folder.description}</p>
          </div>
        </div>

        <PixelButton
          onClick={handleCreateNote}
          color="bg-green-400"
          hoverColor="hover:bg-green-500"
          icon={<Plus size={18} />}
        >
          New Note in Folder
        </PixelButton>
      </div>

      {/* Folder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="font-mono text-white font-bold">Notebooks</span>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">
            {folderNotebooks.length}
          </div>
        </div>
        
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-green-400" />
            <span className="font-mono text-white font-bold">Notes</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-400">
            {folderNotes.length}
          </div>
        </div>
        
        <div className="bg-gray-800 border-2 border-gray-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📝</span>
            <span className="font-mono text-white font-bold">Total Items</span>
          </div>
          <div className="text-2xl font-mono font-bold text-purple-400">
            {folderNotebooks.length + folderNotes.length}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {folderNotes.length === 0 && folderNotebooks.length === 0 ? (
          <div className="border-2 border-gray-600 bg-gray-800 p-8 text-center">
            <Folder size={64} style={{ color: folder.colorCode }} className="mx-auto mb-4" />
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              No notes yet in "{folder.name}"
            </h3>
            <p className="text-gray-400 font-mono mb-6">
              This folder is empty. Start by creating your first note or notebook inside it.
            </p>
            
            <div className="flex gap-4 justify-center">
              <PixelButton
                onClick={handleCreateNote}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<FileText size={18} />}
              >
                Create Note
              </PixelButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show notebooks if any */}
            {folderNotebooks.length > 0 && (
              <div>
                <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-400" />
                  Notebooks in this folder ({folderNotebooks.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folderNotebooks.map(notebook => (
                    <motion.div
                      key={notebook.id}
                      className="border-2 border-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ borderTopColor: notebook.colorCode, borderTopWidth: '4px' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <BookOpen size={24} style={{ color: notebook.colorCode }} />
                        <span className="text-xs text-gray-400 font-mono">
                          {notebook.noteCount || 0} notes
                        </span>
                      </div>
                      <h4 className="font-mono font-bold text-white mb-1">{notebook.name}</h4>
                      <p className="text-xs text-gray-400">{notebook.description || 'Click to open'}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Show notes if any */}
            {folderNotes.length > 0 && (
              <div>
                <h3 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-green-400" />
                  Notes in this folder ({folderNotes.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folderNotes.map(note => {
                    const tagsArray = getTags(note.tags);
                    
                    return (
                      <motion.div
                        key={note.id}
                        className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
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
                          <div className="flex flex-wrap gap-1">
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Organization Tips */}
        <div className="border-2 border-gray-600 bg-gray-800 p-6">
          <h4 className="font-mono text-lg font-bold text-white mb-4">📚 Organization Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-300">
            <div>
              <span className="text-yellow-400">📁</span> <strong>Folders</strong> are great for organizing by project or topic
            </div>
            <div>
              <span className="text-blue-400">📖</span> <strong>Notebooks</strong> help group related notes together
            </div>
            <div>
              <span className="text-green-400">📝</span> <strong>Notes</strong> created here will automatically be organized in this folder
            </div>
            <div>
              <span className="text-purple-400">🏷️</span> <strong>Tags</strong> make it easy to find content across folders
            </div>
          </div>
        </div>
      </div>

      {/* Note Creation Modal with folder pre-selected */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => setIsCreateNoteModalOpen(false)}
        onSave={handleCreateNoteSubmit}
        folders={folders}
        notebooks={notebooks}
        existingNote={null}
        defaultFolderId={folder.id} // Pre-select this folder
      />

      {/* Future enhancement - Folder export */}
      <PixelButton
        onClick={() => {
          console.log('Exporting folder:', folder.id);
          window.open(`/api/folders/${folder.id}/export`);
        }}
        color="bg-yellow-500"
        hoverColor="hover:bg-yellow-600"
        icon={<Folder size={16} />}
      >
        Export Folder
      </PixelButton>
    </div>
  );
};

export default FolderView;