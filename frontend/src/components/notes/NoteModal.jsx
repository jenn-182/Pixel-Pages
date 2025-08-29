import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Tag, Folder, BookOpen, Palette, Save, Plus, Maximize2, Minimize2, Download, FileDown, Archive } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import { useNotification } from '../../contexts/NotificationContext';

const NoteModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  folders, 
  notebooks, 
  existingNote = null,
  defaultFolderId = null,
  defaultNotebookId = null // Add this
}) => {
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    tags: '',
    color: '#4ADE80',
    folderId: null,
    notebookId: null
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState(null);

  const { showNotification } = useNotification();

  const isEditing = existingNote !== null;

  const colors = [
    '#4ADE80', '#60A5FA', '#F472B6', '#FBBF24',
    '#A78BFA', '#FB7185', '#34D399', '#FCD34D'
  ];

  // Load existing note data when editing
  useEffect(() => {
    if (existingNote) {
      setNoteData({
        title: existingNote.title || '',
        content: existingNote.content || '',
        tags: existingNote.tags || '',
        color: existingNote.color || '#4ADE80',
        folderId: existingNote.folderId || null,
        notebookId: existingNote.notebookId || null
      });
    } else {
      setNoteData({
        title: '',
        content: '',
        tags: '',
        color: '#4ADE80',
        folderId: defaultFolderId,
        notebookId: defaultNotebookId, // Use default notebook
      });
    }
  }, [existingNote, isOpen, defaultFolderId, defaultNotebookId]); // Add defaultNotebookId

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting note data:', noteData); // Debug log
      await onSave(noteData); 
    } catch (error) {
      console.error('Failed to save note:', error);
      // Keep modal open if there's an error
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
            className={`bg-gray-900 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transition-all duration-300 ${
              isFullscreen 
                ? 'w-full h-full max-w-none max-h-none m-0 overflow-y-auto' // Add overflow-y-auto
                : 'w-full max-w-md max-h-[90vh] overflow-y-auto'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-green-400" />
                <h2 className="font-mono text-xl font-bold text-white">
                  {isEditing ? 'Edit Note' : 'Create Note'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-4 ${isFullscreen ? 'max-w-4xl mx-auto' : ''}`}>
              {/* Title */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Title *
                </label>
                <PixelInput
                  value={noteData.title}
                  onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                  placeholder="Enter note title..."
                  required
                  style={{ color: '#000' }} // Add this line
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  Content *
                </label>
                <textarea
                  value={noteData.content}
                  onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                  placeholder="Start writing your note..."
                  className={`w-full px-3 py-2 bg-white border-2 border-gray-400 font-mono text-sm resize-none text-black transition-all duration-300 ${
                    isFullscreen ? 'h-[70vh]' : 'h-48'  // Changed from h-[60vh] to h-[70vh] for bigger fullscreen
                  }`}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Tags (comma-separated)
                </label>
                <PixelInput
                  value={noteData.tags}
                  onChange={(e) => setNoteData({ ...noteData, tags: e.target.value })}
                  placeholder="work, ideas, important..."
                  style={{ color: '#000' }} // Add this line
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
                      onClick={() => setNoteData({ ...noteData, color })}
                      className={`w-8 h-8 border-2 transition-all ${
                        noteData.color === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Folder/Notebook Selection */}
              <div className={`${isFullscreen ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-2 gap-4'}`}>
                <div>
                  <label className="block text-sm font-mono font-bold text-white mb-2">
                    <Folder size={16} className="inline mr-1" />
                    Folder
                  </label>
                  <select
                    value={noteData.folderId || ''}
                    onChange={(e) => setNoteData({ 
                      ...noteData, 
                      folderId: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className={`w-full px-3 py-2 bg-white border-2 border-gray-400 font-mono text-sm text-black ${
                      isFullscreen ? 'text-base py-3' : ''
                    }`}
                  >
                    <option value="">No folder</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>
                        📁 {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono font-bold text-white mb-2">
                    <BookOpen size={16} className="inline mr-1" />
                    Notebook
                  </label>
                  <select
                    value={noteData.notebookId || ''}
                    onChange={(e) => setNoteData({ 
                      ...noteData, 
                      notebookId: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className={`w-full px-3 py-2 bg-white border-2 border-gray-400 font-mono text-sm text-black ${
                      isFullscreen ? 'text-base py-3' : ''
                    }`}
                  >
                    <option value="">No notebook</option>
                    {notebooks.map(notebook => (
                      <option key={notebook.id} value={notebook.id}>
                        📖 {notebook.name}
                      </option>
                    ))}
                  </select>
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
                  color="bg-green-400"
                  hoverColor="hover:bg-green-500"
                  className="flex-1"
                  icon={isEditing ? <Save size={18} /> : <Plus size={18} />}
                >
                  {isEditing ? 'Save Changes' : 'Create Note'}
                </PixelButton>
              </div>
            </form>

            {/* Export Section - Fixed */}
            {isEditing && (
              <div className="mt-6 pt-4 border-t-2 border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <Download size={16} className="text-blue-400" />
                  <h3 className="font-mono text-sm font-bold text-white">Export Options</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {/* Single Note Export - With Beautiful Notifications */}
                  <PixelButton
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Exporting note:', existingNote.id);
                        
                        const response = await fetch(`/api/notes/${existingNote.id}/export`);
                        
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${existingNote.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.md`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                          
                          showNotification(` "${existingNote.title}" exported successfully!`, 'success');
                        } else {
                          throw new Error('Export failed');
                        }
                      } catch (error) {
                        console.error('Export error:', error);
                        showNotification('Failed to export note. Please try again.', 'error');
                      }
                    }}
                    color="bg-blue-500"
                    hoverColor="hover:bg-blue-600"
                    className="w-full text-sm"
                    icon={<FileDown size={16} />}
                  >
                    Export This Note (.md)
                  </PixelButton>
                  
                  {/* Export All Notes - With Beautiful Notifications */}
                  <PixelButton
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Exporting all notes for user');
                        
                        const response = await fetch(`/api/notes/export/all?username=user`);
                        
                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `all_notes_${new Date().toISOString().slice(0, 10)}.md`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                          
                          showNotification('All notes exported successfully! Ready for backup or sharing.', 'success');
                        } else {
                          throw new Error('Export failed');
                        }
                      } catch (error) {
                        console.error('Export error:', error);
                        showNotification('Export failed. Please check your connection and try again.', 'error');
                      }
                    }}
                    color="bg-purple-500"
                    hoverColor="hover:bg-purple-600"
                    className="w-full text-sm"
                    icon={<Archive size={16} />}
                  >
                    Export All Notes (.md)
                  </PixelButton>
                </div>
                
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  Files will download to your Downloads folder
                </p>
              </div>
            )}

            {/* Notification Display */}
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-4 right-4 p-4 border-2 font-mono text-sm z-50 ${
                  notification.type === 'success' 
                    ? 'bg-green-400 border-green-600 text-black' 
                    : 'bg-red-400 border-red-600 text-black'
                }`}
              >
                {notification.message}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;