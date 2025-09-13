import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Search, Plus, Edit3, Eye } from 'lucide-react';

const NotebookListView = ({ 
  notebooks, 
  onBack, 
  onCreateNotebook, 
  onOpenNotebook,
  notes = [],
  folders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notebooks
  const filteredNotebooks = notebooks.filter(notebook => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    const nameMatch = notebook.name?.toLowerCase().includes(searchLower) || false;
    const descMatch = notebook.description?.toLowerCase().includes(searchLower) || false;
    
    return nameMatch || descMatch;
  });

  // Get note count for a notebook
  const getNotebookNoteCount = (notebookId) => {
    return notes.filter(note => note.notebookId === notebookId).length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-black border-2 border-white p-2 font-mono font-bold text-white hover:scale-105 transition-transform"
                title="Back to Storage Vault"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="font-mono font-bold text-white text-2xl">ALL COLLECTIONS</h1>
                <p className="font-mono text-sm text-gray-400">
                  Complete collection management interface
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <span>
                <span className="text-white font-bold">{filteredNotebooks.length}</span> 
                / {notebooks.length} COLLECTIONS
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <button
              onClick={onCreateNotebook}
              className="bg-black border-2 border-white/60 px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus size={16} />
              <BookOpen size={16} />
              <span>NEW COLLECTION</span>
            </button>
            
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections..."
                className="w-full pl-10 pr-3 py-2 bg-black border-2 border-gray-600 text-white font-mono text-sm focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
           style={{
             backgroundColor: 'rgba(0, 0, 0, 0.4)'
           }}>
        <div className="relative z-10">
          {filteredNotebooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotebooks.map((notebook) => {
                const notebookColor = notebook.colorCode || notebook.color || '#60A5FA';
                const rgbColor = notebookColor.startsWith('#') 
                  ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
                  : '96, 165, 250';
                
                const noteCount = getNotebookNoteCount(notebook.id);

                return (
                  <motion.div
                    key={notebook.id}
                    className="bg-black bg-opacity-60 border-2 border-white p-4 cursor-pointer group relative transition-all duration-300 rounded-lg"
                    style={{
                      boxShadow: `0 0 25px rgba(${rgbColor}, 0.8), 4px 4px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: `0 0 40px rgba(${rgbColor}, 1), 4px 4px 0px 0px rgba(0,0,0,1)`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onOpenNotebook(notebook)}
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
                      {noteCount} LOGS
                    </div>

                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenNotebook(notebook);
                        }}
                        className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                        title="Open collection"
                      >
                        <Eye size={14} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add edit handler if available
                        }}
                        className="p-1.5 bg-black hover:bg-gray-800 border border-white rounded-md transition-colors text-white"
                        title="Edit collection"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-black bg-opacity-60 border border-white p-8 text-center rounded-lg">
              {searchTerm ? (
                <>
                  <Search size={48} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-mono mb-2">
                    No collections found matching "{searchTerm}"
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Try adjusting your search terms
                  </p>
                </>
              ) : (
                <>
                  <BookOpen size={48} className="text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-mono mb-2">
                    No collections found
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Create your first collection to organize log entries
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookListView;