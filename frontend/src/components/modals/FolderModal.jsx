import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, Palette, Save, Plus } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const FolderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingFolder = null 
}) => {
  const [folderData, setFolderData] = useState({
    name: '',
    description: '',
    colorCode: '#FFD700'
  });

  const { showNotification } = useNotification();
  const isEditing = !!existingFolder;

  // Color options matching NotebookModal
  const colors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'
  ];

  useEffect(() => {
    if (existingFolder) {
      setFolderData({
        name: existingFolder.name || '',
        description: existingFolder.description || '',
        colorCode: existingFolder.colorCode || '#FFD700'
      });
    } else {
      setFolderData({
        name: '',
        description: '',
        colorCode: '#FFD700'
      });
    }
  }, [existingFolder, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting archive data:', folderData);
      console.log('Is editing:', isEditing);
      console.log('Existing folder:', existingFolder);
      
      if (isEditing) {
        // Pass ID and data separately for editing
        await onSave(existingFolder.id, folderData);
      } else {
        // Pass complete data object for creating
        await onSave(folderData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save archive:', error);
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
                <Folder size={24} className="text-cyan-400" />
                <h2 className="font-mono text-xl font-bold text-white">
                  {isEditing ? 'MODIFY ARCHIVE' : 'CREATE ARCHIVE'}
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
                  ARCHIVE NAME
                </label>
                <input
                  type="text"
                  value={folderData.name}
                  onChange={(e) => setFolderData({ ...folderData, name: e.target.value })}
                  placeholder="Enter archive name..."
                  required
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  value={folderData.description}
                  onChange={(e) => setFolderData({ ...folderData, description: e.target.value })}
                  placeholder="Describe this archive system..."
                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm resize-none h-20 focus:border-cyan-400 focus:outline-none transition-colors"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff',
                    textFillColor: '#ffffff'
                  }}
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  ARCHIVE COLOR
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFolderData({ ...folderData, colorCode: color })}
                      className={`w-8 h-8 border-2 transition-all ${
                        folderData.colorCode === color 
                          ? 'border-cyan-400 scale-110 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ 
                        backgroundColor: color,
                        boxShadow: folderData.colorCode === color 
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
                    <span>{isEditing ? 'SAVE CHANGES' : 'CREATE ARCHIVE'}</span>
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

export default FolderModal;