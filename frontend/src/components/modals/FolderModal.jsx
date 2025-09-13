import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, X, Palette, Archive } from 'lucide-react';

const FolderModal = ({ isOpen, onClose, onSave, existingFolder = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorCode, setColorCode] = useState('#FFD700');

  const predefinedColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
  ];

  useEffect(() => {
    if (existingFolder) {
      setName(existingFolder.name || '');
      setDescription(existingFolder.description || '');
      setColorCode(existingFolder.colorCode || '#FFD700');
    } else {
      setName('');
      setDescription('');
      setColorCode('#FFD700');
    }
  }, [existingFolder, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Archive name is required');
      return;
    }

    const folderData = {
      name: name.trim(),
      description: description.trim(),
      colorCode,
      parentFolderId: null
    };

    try {
      if (existingFolder) {
        await onSave(existingFolder.id, folderData);
      } else {
        await onSave(folderData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save archive:', error);
      alert('Failed to save archive. Please try again.');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setColorCode('#FFD700');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-16"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Folder size={24} className="text-white" />
                <h3 className="font-mono text-xl font-bold text-white">
                  {existingFolder ? 'MODIFY ARCHIVE' : 'NEW ARCHIVE'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm font-mono text-gray-400">
              {existingFolder ? 'Update archive system parameters' : 'Initialize new archive system for organized storage'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* Archive Name */}
            <div>
              <label className="block text-sm font-mono font-bold text-white mb-2">
                <Archive size={16} className="inline mr-1" />
                ARCHIVE NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter archive name..."
                className="w-full px-3 py-2 bg-black border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none focus:border-white"
                required
              />
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Unique identifier for this archive system
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono font-bold text-white mb-2">
                ARCHIVE DESCRIPTION
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional archive description..."
                rows={3}
                className="w-full px-3 py-2 bg-black border-2 border-gray-600 text-white font-mono text-sm resize-none transition-colors focus:outline-none focus:border-white"
              />
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Brief description of archive purpose and organization strategy
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-mono font-bold text-white mb-2">
                <Palette size={16} className="inline mr-1" />
                ARCHIVE COLOR
              </label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColorCode(color)}
                    className={`w-8 h-8 border-2 transition-all duration-200 ${
                      colorCode === color ? 'border-white scale-110' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-6 h-6 border-2 border-gray-600 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-400">Custom</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Visual identifier for quick archive recognition
              </p>
            </div>

            {/* Archive Info */}
            <div className="bg-black border-2 border-gray-600 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Archive size={16} className="text-white" />
                <span className="text-sm font-mono font-bold text-white">
                  WHAT IS ARCHIVE 
                </span>
              </div>
              <ul className="text-xs font-mono text-gray-400 space-y-1">
                <li>• Store multiple log collections</li>
                <li>• Bulk exports</li>
                <li>• Think of it like your digital file cabinet</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-black border-2 border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 bg-black border-2 border-white px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform"
              >
                {existingFolder ? 'UPDATE ARCHIVE' : 'CREATE ARCHIVE'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FolderModal;