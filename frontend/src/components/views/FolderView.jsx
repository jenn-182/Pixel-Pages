import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, BookOpen, FileText, Plus, Edit } from 'lucide-react';
import NoteModal from '../notes/NoteModal';
import PixelButton from '../PixelButton';

const FolderView = ({ folder, onBack, onCreateNote, onEditNote, onOpenNotebook, folders, notebooks, notes }) => {
  const [folderNotes, setFolderNotes] = useState([]);
  const [folderNotebooks, setFolderNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    filterFolderContents();
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
    setEditingNote(null);
    setIsCreateNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsCreateNoteModalOpen(true);
  };

  const handleCreateNoteSubmit = async (noteData) => {
    try {
      const noteWithFolder = {
        ...noteData,
        folderId: folder.id
      };
      
      if (editingNote) {
        await onEditNote({ ...noteWithFolder, id: editingNote.id });
      } else {
        await onCreateNote(noteWithFolder);
      }
      
      setIsCreateNoteModalOpen(false);
      setEditingNote(null);
      filterFolderContents();
    } catch (error) {
      console.error('Failed to save note:', error);
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
        <div>Loading archive contents...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
            style={{
              boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>BACK TO VAULT</span>
            </div>
            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <Folder size={32} style={{ color: folder.colorCode }} />
            <div>
              <h1 className="font-mono text-3xl font-bold text-white mb-2">{folder.name}</h1>
              <p className="text-gray-400 font-mono text-sm">{folder.description}</p>
            </div>
          </div>

          <button
            onClick={handleCreateNote}
            className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
            style={{
              boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="flex items-center gap-2">
              <Plus size={16} />
              <span>NEW LOG</span>
            </div>
            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Archive Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="bg-gray-900 border-2 border-blue-500 p-4" style={{
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-blue-400 font-bold">COLLECTIONS</div>
                <div className="text-2xl font-mono font-bold text-blue-400">{folderNotebooks.length}</div>
              </div>
              <BookOpen className="text-blue-400" size={20} />
            </div>
          </div>
          
          <div className="bg-gray-900 border-2 border-green-500 p-4" style={{
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-green-400 font-bold">LOGS</div>
                <div className="text-2xl font-mono font-bold text-green-400">{folderNotes.length}</div>
              </div>
              <FileText className="text-green-400" size={20} />
            </div>
          </div>
          
          <div className="bg-gray-900 border-2 border-purple-500 p-4" style={{
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
          }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-purple-400 font-bold">TOTAL ITEMS</div>
                <div className="text-2xl font-mono font-bold text-purple-400">
                  {folderNotebooks.length + folderNotes.length}
                </div>
              </div>
              <span className="text-purple-400 text-xl">📝</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Archive Content */}
      {folderNotes.length === 0 && folderNotebooks.length === 0 ? (
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
          
          <div className="relative z-10 text-center py-8">
            <Folder size={64} style={{ color: folder.colorCode }} className="mx-auto mb-4" />
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              Archive "{folder.name}" is empty
            </h3>
            <p className="text-gray-400 font-mono mb-6">
              This archive system is empty. Start by creating your first log entry or collection.
            </p>
            
            <button
              onClick={handleCreateNote}
              className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
              style={{
                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span>CREATE FIRST LOG</span>
              </div>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Collections Section */}
          {folderNotebooks.length > 0 && (
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
              
              <div className="relative z-10">
                <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <BookOpen size={20} className="text-blue-400 mr-2" />
                  ARCHIVE COLLECTIONS
                  <span className="ml-3 text-sm text-cyan-400">
                    [{folderNotebooks.length}]
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folderNotebooks.map((notebook, index) => {
                    const notebookColor = notebook.colorCode || '#3B82F6';
                    
                    const hexToRgb = (hex) => {
                      if (!hex || !hex.startsWith('#')) return '59, 130, 246';
                      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                      return result ? 
                        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
                        '59, 130, 246';
                    };
                    
                    const rgbColor = hexToRgb(notebookColor);
                    
                    return (
                      <motion.div
                        key={notebook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                        onClick={() => onOpenNotebook && onOpenNotebook(notebook)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <BookOpen size={24} style={{ color: notebookColor }} />
                          <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                            {notebook.noteCount || 0} LOGS
                          </div>
                        </div>
                        <h4 className="font-mono font-bold text-white mb-2 truncate" title={notebook.name}>
                          {notebook.name}
                        </h4>
                        <p className="text-xs text-gray-400 mb-3">
                          {notebook.description || 'Access collection contents'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Direct Notes Section */}
          {folderNotes.length > 0 && (
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
              
              <div className="relative z-10">
                <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <FileText size={20} className="text-green-400 mr-2" />
                  ARCHIVE LOG ENTRIES
                  <span className="ml-3 text-sm text-cyan-400">
                    [{folderNotes.length}]
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {folderNotes.map((note, index) => {
                    const tagsArray = getTags(note.tags);
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
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                        
                        {/* Classification Tags */}
                        {tagsArray.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {tagsArray.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
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
                        
                        {/* Edit button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note);
                          }}
                          className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Edit log entry"
                        >
                          <Edit size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Note Creation/Edit Modal */}
      <NoteModal
        isOpen={isCreateNoteModalOpen}
        onClose={() => {
          setIsCreateNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleCreateNoteSubmit}
        folders={folders}
        notebooks={notebooks}
        existingNote={editingNote}
        defaultFolderId={folder.id}
      />
    </div>
  );
};

export default FolderView;