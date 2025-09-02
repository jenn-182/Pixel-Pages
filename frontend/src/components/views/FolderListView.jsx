import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, ArrowLeft, Search, Plus, Edit } from 'lucide-react';

const FolderListView = ({ 
  folders, 
  onBack, 
  onCreateFolder, 
  onOpenFolder,
  notes = [],
  notebooks = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // updated, created, name
  const [sortOrder, setSortOrder] = useState('desc');

  const tabColor = '#3B82F6'; // Blue color to match LibraryTab
  const tabColorRgb = '59, 130, 246'; // RGB values for #3B82F6

  // Filter and sort folders
  const filteredFolders = folders.filter(folder => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    const nameMatch = folder.name?.toLowerCase().includes(searchLower) || false;
    const descMatch = folder.description?.toLowerCase().includes(searchLower) || false;
    
    return nameMatch || descMatch;
  }).sort((a, b) => {
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

  // Get content count for a folder
  const getFolderContentCount = (folderId) => {
    const noteCount = notes.filter(note => note.folderId === folderId).length;
    const notebookCount = notebooks.filter(notebook => notebook.folderId === folderId).length;
    return noteCount + notebookCount;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
            style={{
              borderColor: tabColor,
              color: tabColor,
              boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = tabColor;
              e.target.style.boxShadow = `0 0 15px rgba(${tabColorRgb}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = tabColor;
              e.target.style.boxShadow = `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`;
            }}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>BACK</span>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                 style={{ backgroundColor: tabColor }} />
          </button>
          
          <div className="flex-1">
            <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div 
              />
              ALL ARCHIVES
            </h1>
          </div>
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between relative z-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                    style={{ color: tabColor }} size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search archive systems..."
              className="w-full bg-gray-900 border-2 border-gray-600 text-white pl-10 pr-4 py-2 font-mono text-sm focus:outline-none transition-colors duration-200"
              style={{ 
                color: '#fff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = tabColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#4B5563';
              }}
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold" style={{ color: tabColor }}>SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border-2 border-gray-600 text-white px-2 py-1 text-xs font-mono focus:outline-none"
                style={{
                  focusBorderColor: tabColor
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = tabColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                }}
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Archive Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="transition-colors duration-200 p-1 border"
              style={{
                color: tabColor,
                borderColor: tabColor
              }}
              onMouseEnter={(e) => {
                e.target.style.color = tabColor;
                e.target.style.borderColor = tabColor;
              }}
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            <button
              onClick={onCreateFolder}
              className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
              style={{
                borderColor: tabColor,
                color: tabColor,
                boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = tabColor;
                e.target.style.boxShadow = `0 0 15px rgba(${tabColorRgb}, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = tabColor;
                e.target.style.boxShadow = `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`;
              }}
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>NEW ARCHIVE</span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                   style={{ backgroundColor: tabColor }} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Folders Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-50 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        
        <div className="relative z-10">
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            ARCHIVE SYSTEMS
            <span className="ml-3 text-sm" style={{ color: tabColor }}>
              [{filteredFolders.length}]
            </span>
          </h3>

          {filteredFolders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFolders.map((folder, index) => {
                const folderColor = folder.colorCode || folder.color || '#4ADE80';
                const contentCount = getFolderContentCount(folder.id);
                
                const hexToRgb = (hex) => {
                  if (!hex || !hex.startsWith('#')) return '74, 222, 128';
                  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                  return result ? 
                    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
                    '74, 222, 128';
                };
                
                const rgbColor = hexToRgb(folderColor);
                
                return (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                    onClick={() => onOpenFolder(folder)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Folder size={24} style={{ color: folderColor }} />
                      <div className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 border border-gray-600">
                        {contentCount} ITEMS
                      </div>
                    </div>
                    <h4 className="font-mono font-bold text-white mb-2 truncate" title={folder.name}>
                      {folder.name}
                    </h4>
                    <p className="text-xs text-gray-400 mb-3">
                      {folder.description && folder.description.length > 100 
                        ? `${folder.description.substring(0, 100)}...` 
                        : folder.description || 'No description available'}
                    </p>
                    
                    {/* Archive Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-700 border border-gray-600 text-xs font-mono" style={{ color: tabColor }}>
                        ARCHIVE
                      </span>
                    </div>
                    
                    {/* Open button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFolder(folder);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: tabColor }}
                      title="Open archive"
                    >
                      <Edit size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 font-mono">
              {searchTerm ? 'No archive systems match your search criteria.' : 'No archive systems found.'}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FolderListView;