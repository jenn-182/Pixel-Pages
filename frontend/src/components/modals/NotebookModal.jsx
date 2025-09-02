import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Palette, Tag, Save, Plus, Folder } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';

const NotebookModal = ({
  isOpen,
  onClose,
  onSave,
  existingNotebook = null,
  folders = []
}) => {
  // Add this debug log to see what folders are being passed
  useEffect(() => {
    console.log('NotebookModal folders:', folders);
    console.log('Folders length:', folders.length);
  }, [folders]);

  const [notebookData, setNotebookData] = useState({
    name: '',
    description: '',
    colorCode: '#87CEEB',
    tags: '',
    folderId: ''
  });

  const isEditing = existingNotebook !== null;

  const colors = [
    '#87CEEB', '#FFD700', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#F1948A', '#85C1E9', '#82E0AA'
  ];

  useEffect(() => {
    if (existingNotebook) {
      setNotebookData({
        name: existingNotebook.name || '',
        description: existingNotebook.description || '',
        colorCode: existingNotebook.colorCode || '#87CEEB',
        tags: existingNotebook.tags || '',
        folderId: existingNotebook.folderId || ''
      });
    } else {
      setNotebookData({
        name: '',
        description: '',
        colorCode: '#87CEEB',
        tags: '',
        folderId: ''
      });
    }
  }, [existingNotebook, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting notebook data:', notebookData);
      console.log('Is editing:', isEditing);
      console.log('Existing notebook:', existingNotebook);

      if (isEditing) {
        // Pass ID and data separately for editing
        await onSave(existingNotebook.id, notebookData);
      } else {
        // Pass complete data object for creating
        await onSave(notebookData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save notebook:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-16 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <BookOpen size={24} className="text-cyan-400" />
                <h2 className="font-mono text-xl font-bold text-white">
                  {isEditing ? 'MODIFY COLLECTION' : 'CREATE COLLECTION'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-cyan-400 transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {/* Name */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  COLLECTION NAME 
                </label>
                <input
                  type="text"
                  value={notebookData.name}
                  onChange={(e) => setNotebookData({ ...notebookData, name: e.target.value })}
                  placeholder="Enter collection name..."
                  required
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  value={notebookData.description}
                  onChange={(e) => setNotebookData({ ...notebookData, description: e.target.value })}
                  placeholder="Describe this collection..."
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm resize-none h-20 focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Archive Assignment */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  <Folder size={16} className="inline mr-1" />
                  ASSIGN TO ARCHIVE
                </label>
                <select
                  value={notebookData.folderId}
                  onChange={(e) => setNotebookData({ ...notebookData, folderId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                >
                  <option value="">No Archive</option>
                  {folders && folders.length > 0 ? (
                    folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No archives available</option>
                  )}
                </select>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Optional: Organize this collection within an archive system
                  {folders && folders.length === 0 && (
                    <span className="text-yellow-400"> (Create an archive first)</span>
                  )}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  CLASSIFICATION TAGS (comma-separated)
                </label>
                <input
                  type="text"
                  value={notebookData.tags}
                  onChange={(e) => setNotebookData({ ...notebookData, tags: e.target.value })}
                  placeholder="study, journal, recipes..."
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  COLLECTION COLOR
                </label>
                
                {/* Current Color Display with Custom Picker */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-8 h-6 border-2 border-gray-600"
                    style={{ backgroundColor: notebookData.colorCode }}
                    title="Current color"
                  />
                  <input
                    type="color"
                    value={notebookData.colorCode}
                    onChange={(e) => setNotebookData({ ...notebookData, colorCode: e.target.value })}
                    className="w-8 h-6 border-2 border-gray-600 bg-transparent cursor-pointer"
                    title="Custom color picker"
                  />
                  <span className="text-xs font-mono text-gray-400">Custom</span>
                </div>

                {/* Preset Colors */}
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNotebookData({ ...notebookData, colorCode: color })}
                      className={`w-8 h-8 border-2 transition-all ${
                        notebookData.colorCode === color
                          ? 'border-cyan-400 scale-110 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: notebookData.colorCode === color
                          ? `0 0 10px ${color}50, 2px 2px 0px 0px rgba(0,0,0,1)`
                          : '2px 2px 0px 0px rgba(0,0,0,1)'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-900 border-2 border-gray-600 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-gray-500 font-mono font-bold text-gray-400"
                  style={{
                    boxShadow: '0 0 5px rgba(75, 85, 99, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <span>CANCEL</span>
                  <div className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isEditing ? <Save size={18} /> : <Plus size={18} />}
                    <span>{isEditing ? 'SAVE CHANGES' : 'CREATE COLLECTION'}</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotebookModal;