import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Tag, Archive, Palette } from 'lucide-react';

const NotebookModal = ({ isOpen, onClose, onSave, existingNotebook = null, folders = [] }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorCode, setColorCode] = useState('#60A5FA');
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState('');

  const tabColor = '#3B82F6'; // Blue color to match LibraryTab
  const tabColorRgb = '59, 130, 246'; // RGB values for #3B82F6

  const predefinedColors = [
    '#60A5FA', '#34D399', '#F59E0B', '#EF4444', '#A78BFA', 
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
  ];

  useEffect(() => {
    if (existingNotebook) {
      setName(existingNotebook.name || '');
      setDescription(existingNotebook.description || '');
      setColorCode(existingNotebook.colorCode || '#60A5FA');
      setFolderId(existingNotebook.folderId || '');
      setTags(existingNotebook.tags || '');
    } else {
      // Reset form for new notebook
      setName('');
      setDescription('');
      setColorCode('#60A5FA');
      setFolderId('');
      setTags('');
    }
  }, [existingNotebook, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Collection name is required');
      return;
    }

    const notebookData = {
      name: name.trim(),
      description: description.trim(),
      colorCode,
      folderId: folderId || null,
      tags: tags.trim()
    };

    try {
      if (existingNotebook) {
        await onSave(existingNotebook.id, notebookData);
      } else {
        await onSave(notebookData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save collection:', error);
      alert('Failed to save collection. Please try again.');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setColorCode('#60A5FA');
    setFolderId('');
    setTags('');
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
          className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          style={{
            borderColor: tabColor,
            boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
               style={{ borderColor: tabColor }} />

          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen size={24} style={{ color: tabColor }} />
                <h3 className="font-mono text-xl font-bold text-white">
                  {existingNotebook ? 'MODIFY COLLECTION' : 'NEW COLLECTION'}
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
              {existingNotebook ? 'Update collection parameters' : 'Initialize new log collection for organized storage'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* Collection Name */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                <BookOpen size={16} className="inline mr-1" />
                COLLECTION NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name..."
                className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                style={{
                  color: '#fff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = tabColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                }}
                required
              />
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Unique identifier for this log collection
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                COLLECTION DESCRIPTION
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional collection description..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm resize-none transition-colors focus:outline-none"
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
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Brief description of collection purpose and contents
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                <Palette size={16} className="inline mr-1" />
                COLLECTION COLOR
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
                Visual identifier for quick collection recognition
              </p>
            </div>

            {/* Archive Assignment */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                <Archive size={16} className="inline mr-1" />
                ARCHIVE SYSTEM
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = tabColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                }}
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
                  <span style={{ color: tabColor }}> (Create an archive first)</span>
                )}
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                <Tag size={16} className="inline mr-1" />
                CLASSIFICATION TAGS
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Optional tags (comma-separated)..."
                className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
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
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Optional tags for categorization and search functionality
              </p>
            </div>

            {/* Collection Info */}
            <div className="bg-gray-900 border border-gray-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} style={{ color: tabColor }} />
                <span className="text-sm font-mono font-bold" style={{ color: tabColor }}>
                  WHAT IS COLLECTION
                </span>
              </div>
              <ul className="text-xs font-mono text-gray-400 space-y-1">
                <li>• Organize related log entries</li>
                <li>• Tag-based categorization</li>
                <li>• Think of it like your digital notebook</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-900 border-2 border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
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
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                     style={{ backgroundColor: tabColor }} />
                <span className="relative z-10">
                  {existingNotebook ? 'UPDATE COLLECTION' : 'CREATE COLLECTION'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotebookModal;