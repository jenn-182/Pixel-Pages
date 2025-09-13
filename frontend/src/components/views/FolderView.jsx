import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, BookOpen, FileText, Plus, Edit3, Trash2, Eye, Search, Archive } from 'lucide-react';
import NoteViewModal from '../notes/NoteViewModal';

const FolderView = ({ 
  folder, 
  notebooks, 
  notes, 
  onBack, 
  onCreateNotebook, 
  onCreateNote, 
  onEditNotebook, 
  onEditNote, 
  onDeleteNotebook, 
  onDeleteNote,
  onOpenNotebook, // Added this prop for opening notebook view
  onOpenNote // Added this prop for opening note
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('collections');
  const [viewingNote, setViewingNote] = useState(null);
  const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false);

  const filteredNotebooks = notebooks.filter(notebook =>
    notebook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notebook.description && notebook.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const folderColor = folder?.colorCode || '#FFD700';
  const rgbColor = folderColor.startsWith('#') 
    ? `${parseInt(folderColor.slice(1, 3), 16)}, ${parseInt(folderColor.slice(3, 5), 16)}, ${parseInt(folderColor.slice(5, 7), 16)}`
    : '251, 191, 36';

  // Handlers for note viewing/editing
  const handleViewNote = (note) => {
    setViewingNote(note);
    setIsNoteViewModalOpen(true);
  };

  const handleEditNoteFromView = () => {
    const noteToEdit = viewingNote;  // Save the note reference
    setIsNoteViewModalOpen(false);   // Close the view modal
    setViewingNote(null);            // Clear the viewing note state
    onEditNote(noteToEdit);          // Open edit modal with the saved note
  };

  const handleDeleteNoteFromView = async () => {
    setIsNoteViewModalOpen(false);
    await onDeleteNote(viewingNote.id);
    setViewingNote(null);
  };

  const handleCloseNoteView = () => {
    setIsNoteViewModalOpen(false);
    setViewingNote(null);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="bg-black border-2 border-white p-2 font-mono font-bold text-white hover:scale-105 transition-transform cursor-pointer"
                title="Back to Archives"
                style={{ zIndex: 100 }}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 border-2 border-white"
                  style={{
                    backgroundColor: folderColor,
                    boxShadow: `0 0 10px rgba(${rgbColor}, 0.6)`
                  }}
                >
                  <Folder size={24} className="text-black" />
                </div>
                <div>
                  <h1 className="font-mono font-bold text-white text-2xl">{folder?.name || 'Archive'}</h1>
                  <p className="font-mono text-sm text-gray-400">
                    {folder?.description || 'Archive system contents'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <span>
                <span className="text-white font-bold">{notebooks.length}</span> COLLECTIONS
              </span>
              <span>
                <span className="text-white font-bold">{notes.length}</span> LOGS
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="flex gap-2 relative">
              <button
                onClick={() => {
                  if (onCreateNotebook) {
                    onCreateNotebook();
                  }
                }}
                className="bg-black border-2 border-white px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <BookOpen size={16} />
                <span>NEW COLLECTION</span>
              </button>
              
              <button
                onClick={() => {
                  if (onCreateNote) {
                    onCreateNote();
                  }
                }}
                className="bg-black border-2 border-white px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <FileText size={16} />
                <span>NEW LOG</span>
              </button>
            </div>
            
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search archive contents..."
                className="w-full pl-10 pr-3 py-2 bg-black border-2 border-gray-600 text-white font-mono text-sm focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10 flex">
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 px-4 py-3 font-mono font-bold border-r-2 border-white transition-colors ${
              activeTab === 'collections'
                ? 'bg-white/40 text-black'
                : 'text-white hover:bg-black hover:bg-opacity-30'
            }`}
            style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: activeTab === 'collections' ? '0' : '6px' }}
          >
            <BookOpen size={16} className="inline mr-2" />
            COLLECTIONS ({filteredNotebooks.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-4 py-3 font-mono font-bold transition-colors ${
              activeTab === 'logs' 
                ? 'bg-white/40 text-black'
                : 'text-white hover:bg-black hover:bg-opacity-30'
            }`}
            style={{ borderTopRightRadius: '6px', borderBottomRightRadius: activeTab === 'logs' ? '0' : '6px' }}
          >
            <FileText size={16} className="inline mr-2" />
            LOG ENTRIES ({filteredNotes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          {activeTab === 'collections' ? (
            filteredNotebooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredNotebooks.map((notebook) => {
                  const notebookColor = notebook.colorCode || '#60A5FA';
                  const notebookRgb = notebookColor.startsWith('#') 
                    ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
                    : '96, 165, 250';

                  return (
                    <motion.div
                      key={notebook.id}
                      className="bg-black bg-opacity-60 border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                      style={{
                        boxShadow: `0 0 25px rgba(${notebookRgb}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        boxShadow: `0 0 40px rgba(${notebookRgb}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onOpenNotebook ? onOpenNotebook(notebook) : onEditNotebook(notebook)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <BookOpen size={24} style={{ color: notebookColor }} />
                        <div className="text-xs font-mono text-gray-400 bg-black px-2 py-1 border border-white">
                          COLLECTION
                        </div>
                      </div>
                      
                      <h4 className="font-mono font-bold text-white mb-2 truncate" title={notebook.name}>
                        {notebook.name}
                      </h4>
                      
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {notebook.description || 'Collection for organized log storage'}
                      </p>

                      <div className="text-xs text-gray-400 mb-2">
                        {new Date(notebook.createdAt || notebook.updatedAt).toLocaleDateString()}
                      </div>

                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenNotebook ? onOpenNotebook(notebook) : onEditNotebook(notebook);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                          title="Open collection"
                        >
                          <Eye size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditNotebook(notebook);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                          title="Edit collection"
                        >
                          <Edit3 size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotebook(notebook.id);
                          }}
                          className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md text-gray-400 hover:text-red-400 transition-colors"
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
              <div className="bg-black bg-opacity-60 border border-white p-8 text-center rounded-lg">
                <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono mb-2">
                  {searchTerm ? `No collections found matching "${searchTerm}"` : 'No collections in this archive'}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Create your first collection to organize log entries
                </p>
              </div>
            )
          ) : (
            filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredNotes.map((note) => {
                  const noteColor = note.color || '#4ADE80';
                  const noteRgb = noteColor.startsWith('#') 
                    ? `${parseInt(noteColor.slice(1, 3), 16)}, ${parseInt(noteColor.slice(3, 5), 16)}, ${parseInt(noteColor.slice(5, 7), 16)}`
                    : '74, 222, 128';

                  return (
                    <motion.div
                      key={note.id}
                      className="bg-black bg-opacity-60 border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                      style={{
                        boxShadow: `0 0 25px rgba(${noteRgb}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        boxShadow: `0 0 40px rgba(${noteRgb}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewNote(note);
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
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
                          : note.content || 'No content available'}
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
                          title="View log"
                        >
                          <Eye size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditNote(note);
                          }}
                          className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                          title="Edit log"
                        >
                          <Edit3 size={14} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="p-1.5 bg-black hover:bg-red-600 border border-white rounded-md text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete log"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-black bg-opacity-60 border border-white p-8 text-center rounded-lg">
                <FileText size={48} className="text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono mb-2">
                  {searchTerm ? `No log entries found matching "${searchTerm}"` : 'No log entries in this archive'}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Create your first log entry to begin storing information
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Note View Modal */}
      <NoteViewModal
        isOpen={isNoteViewModalOpen}
        onClose={handleCloseNoteView}
        onEdit={handleEditNoteFromView}
        onDelete={handleDeleteNoteFromView}
        note={viewingNote}
      />
    </div>
  );
};

export default FolderView;