import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Palette, Tag, Save, Plus } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';

const NotebookModal = ({
  isOpen,
  onClose,
  onSave,
  existingNotebook = null
}) => {
  const [notebookData, setNotebookData] = useState({
    name: '',
    description: '',
    colorCode: '#87CEEB',
    tags: ''
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
        tags: existingNotebook.tags || ''
      });
    } else {
      setNotebookData({
        name: '',
        description: '',
        colorCode: '#87CEEB',
        tags: ''
      });
    }
  }, [existingNotebook, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await onSave(existingNotebook.id, notebookData); // Pass the ID and data separately
      } else {
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen size={24} className="text-blue-400" />
                <h2 className="font-mono text-xl font-bold text-white">
                  {isEditing ? 'Edit Notebook' : 'Create Notebook'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Notebook Name *
                </label>
                <PixelInput
                  value={notebookData.name}
                  onChange={(e) => setNotebookData({ ...notebookData, name: e.target.value })}
                  placeholder="Enter notebook name..."
                  required
                  style={{ color: '#000' }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={notebookData.description}
                  onChange={(e) => setNotebookData({ ...notebookData, description: e.target.value })}
                  placeholder="Describe this notebook..."
                  className="w-full px-3 py-2 bg-white border-2 border-gray-400 font-mono text-sm resize-none h-20 text-black"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Tags (comma-separated)
                </label>
                <PixelInput
                  value={notebookData.tags}
                  onChange={(e) => setNotebookData({ ...notebookData, tags: e.target.value })}
                  placeholder="study, journal, recipes..."
                  style={{ color: '#000' }}
                />
              </div>

              {/* Color Picker */}
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
                      onClick={() => setNotebookData({ ...notebookData, colorCode: color })}
                      className={`w-8 h-8 border-2 transition-all ${notebookData.colorCode === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
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
                  color="bg-blue-400"
                  hoverColor="hover:bg-blue-500"
                  className="flex-1"
                  icon={isEditing ? <Save size={18} /> : <Plus size={18} />}
                >
                  {isEditing ? 'Save Changes' : 'Create Notebook'}
                </PixelButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotebookModal;