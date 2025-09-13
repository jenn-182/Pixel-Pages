import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Tag, Edit3, Trash2, Download, Eye } from 'lucide-react';
import MarkdownPreview from '../markdown/MarkdownPreview';

const NoteViewModal = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  note
}) => {
  if (!note) return null;

  const noteColor = note.color || '#4ADE80';
  const noteRgb = noteColor.startsWith('#') 
    ? `${parseInt(noteColor.slice(1, 3), 16)}, ${parseInt(noteColor.slice(3, 5), 16)}, ${parseInt(noteColor.slice(5, 7), 16)}`
    : '74, 222, 128';

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col p-2"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full h-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Container */}
            <div 
              className="border-2 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg h-full flex flex-col"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: noteColor,
                boxShadow: `0 0 20px rgba(${noteRgb}, 0.6), 8px 8px 0px 0px rgba(0,0,0,1)`
              }}
            >
              {/* Header */}
              <div className="border-b-2 border-white p-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 border-2 border-white"
                      style={{
                        backgroundColor: noteColor,
                        boxShadow: `0 0 10px rgba(${noteRgb}, 0.6)`
                      }}
                    >
                      <FileText size={24} className="text-black" />
                    </div>
                    <div>
                      <h2 className="font-mono font-bold text-white text-xl">{note.title}</h2>
                      <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                        <span>LOG ENTRY</span>
                        {note.tags && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {Array.isArray(note.tags) ? note.tags.join(', ') : note.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onEdit}
                      className="bg-black border-2 border-white px-4 py-2 font-mono font-bold text-white hover:scale-105 transition-transform flex items-center gap-2"
                      title="Edit log entry"
                    >
                      <Edit3 size={16} />
                      <span>EDIT</span>
                    </button>
                    
                    <button
                      onClick={onDelete}
                      className="bg-black border-2 border-red-500 px-4 py-2 font-mono font-bold text-red-400 hover:scale-105 transition-transform flex items-center gap-2"
                      title="Delete log entry"
                    >
                      <Trash2 size={16} />
                      <span>DELETE</span>
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="bg-black border-2 border-white p-2 font-mono font-bold text-white hover:scale-105 transition-transform"
                      title="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8">
                  {note.content ? (
                    <div 
                      className="border-2 border-white p-8 rounded"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: noteColor,
                        boxShadow: `0 0 15px rgba(${noteRgb}, 0.4)`
                      }}
                    >
                      <div className="text-white font-mono text-lg leading-loose max-w-none">
                        <MarkdownPreview content={note.content} />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-white p-8 text-center rounded"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: noteColor,
                        boxShadow: `0 0 15px rgba(${noteRgb}, 0.4)`
                      }}
                    >
                      <FileText size={48} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 font-mono">This log entry is empty</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              {(note.createdAt || note.updatedAt) && (
                <div 
                  className="border-t-2 border-white p-3 text-xs font-mono text-gray-400 flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: noteColor
                  }}
                >
                  <div className="flex justify-between">
                    {note.createdAt && (
                      <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                    )}
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <span>Modified: {new Date(note.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                  {note.wordCount && (
                    <div className="mt-1">
                      <span>Word Count: {note.wordCount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default NoteViewModal;
