import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, Palette, Tag, Save, Plus } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';

const FolderModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingFolder = null 
}) => {
  const [folderData, setFolderData] = useState({
    name: '',
    description: '',
    colorCode: '#FFD700',
    tags: ''
  });

  const isEditing = existingFolder !== null;

  const colors = [
    '#FFD700', '#87CEEB', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#F1948A', '#85C1E9', '#82E0AA'
  ];

  useEffect(() => {
    if (existingFolder) {
      setFolderData({
        name: existingFolder.name || '',
        description: existingFolder.description || '',
        colorCode: existingFolder.colorCode || '#FFD700',
        tags: existingFolder.tags || ''
      });
    } else {
      setFolderData({
        name: '',
        description: '',
        colorCode: '#FFD700',
        tags: ''
      });
    }
  }, [existingFolder, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await onSave(existingFolder.id, folderData);
      } else {
        await onSave(folderData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save folder:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Folder size={24} className="text-yellow-400" />
                <h2 className="font-mono text-xl font-bold text-white">
                  {isEditing ? 'Edit Folder' : 'Create Folder'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Folder Name *
                </label>
                <PixelInput
                  value={folderData.name}
                  onChange={(e) => setFolderData({ ...folderData, name: e.target.value })}
                  placeholder="Enter folder name..."
                  required
                  style={{ color: '#000' }}
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={folderData.description}
                  onChange={(e) => setFolderData({ ...folderData, description: e.target.value })}
                  placeholder="Describe this folder..."
                  className="w-full px-3 py-2 bg-white border-2 border-gray-400 font-mono text-sm resize-none h-20 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Tags (comma-separated)
                </label>
                <PixelInput
                  value={folderData.tags}
                  onChange={(e) => setFolderData({ ...folderData, tags: e.target.value })}
                  placeholder="work, personal, projects..."
                  style={{ color: '#000' }}
                />
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  <Palette size={16} className="inline mr-1" />
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFolderData({ ...folderData, colorCode: color })}
                      className={`w-8 h-8 border-2 transition-all ${
                        folderData.colorCode === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <PixelButton
                  type="button"
                  onClick={onClose}
                  color="bg-gray-400"
                  hoverColor="hover:bg-gray-500"
                  className="flex-1"
                >
                  Cancel
                </PixelButton>
                <PixelButton
                  type="submit"
                  color="bg-yellow-400"
                  hoverColor="hover:bg-yellow-500"
                  className="flex-1"
                  icon={isEditing ? <Save size={18} /> : <Plus size={18} />}
                >
                  {isEditing ? 'Save Changes' : 'Create Folder'}
                </PixelButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FolderModal;