import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Search, Plus, Edit, Trash2 } from 'lucide-react';

const NotebookListView = ({ 
  notebooks, 
  onBack, 
  onCreateNotebook, 
  onEditNotebook,
  onOpenNotebook,
  onDeleteNotebook
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredNotebooks = notebooks
    .filter(notebook => 
      notebook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notebook.description && notebook.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'created':
          valueA = new Date(a.createdAt || '2020-01-01');
          valueB = new Date(b.createdAt || '2020-01-01');
          break;
        case 'updated':
        default:
          valueA = new Date(a.updatedAt || a.createdAt || '2020-01-01');
          valueB = new Date(b.updatedAt || b.createdAt || '2020-01-01');
          break;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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
          
          <div className="flex-1">
            <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="text-cyan-400" size={32} />
              ALL LOG COLLECTIONS
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Complete archive of all log collections ({notebooks.length} total)
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search log collections..."
              className="w-full bg-gray-900 border-2 border-gray-600 text-white pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 transition-colors duration-200"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border-2 border-gray-600 text-white px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Collection Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 p-1 border border-cyan-400 hover:border-cyan-300"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <button
              onClick={onCreateNotebook}
              className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
              style={{
                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>NEW COLLECTION</span>
              </div>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Collections Grid */}
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
            LOG COLLECTIONS
            <span className="ml-3 text-sm text-cyan-400">
              [{filteredNotebooks.length}]
            </span>
          </h3>

          {filteredNotebooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotebooks.map((notebook, index) => {
                const notebookColor = notebook.colorCode || '#60A5FA';
                const rgbColor = notebookColor.startsWith('#') 
                  ? `${parseInt(notebookColor.slice(1, 3), 16)}, ${parseInt(notebookColor.slice(3, 5), 16)}, ${parseInt(notebookColor.slice(5, 7), 16)}`
                  : '96, 165, 250';
                
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
                    onClick={() => onOpenNotebook(notebook)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <BookOpen size={24} style={{ color: notebookColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                        {notebook.noteCount || 0} LOGS
                      </div>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate">{notebook.name}</h4>
                    <p className="text-xs text-gray-400 mb-3">{notebook.description || 'Access collection database'}</p>
                    
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditNotebook(notebook);
                        }}
                        className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 transition-colors"
                        title="Edit collection"
                      >
                        <Edit size={14} />
                      </button>
                      
                      {/* Add Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${notebook.name}"? All logs in this collection will become unorganized.`)) {
                            onDeleteNotebook(notebook.id);
                          }
                        }}
                        className="p-1.5 bg-gray-700 hover:bg-red-600 rounded text-gray-400 hover:text-red-400 transition-colors"
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
            <div className="text-center py-8 text-gray-400 font-mono">
              {searchTerm ? 'No collections match your search criteria.' : 'No log collections found.'}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotebookListView;