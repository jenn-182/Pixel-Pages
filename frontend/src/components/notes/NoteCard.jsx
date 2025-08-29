import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Hash, FileText, Edit3, Trash2, Download } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-4 cursor-pointer"
      style={{ backgroundColor: note.color || '#FFD700' }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onView && onView(note)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-mono font-bold text-lg truncate flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(note);
            }}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(note);
            }}
            className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {note.content.substring(0, 150)}
        {note.content.length > 150 ? '...' : ''}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {note.tags && note.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-black bg-opacity-10 border border-black text-xs font-mono"
          >
            <Hash size={12} />
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(note.createdAt)}
        </div>
        <div className="flex items-center gap-1">
          <FileText size={12} />
          {note.wordCount || 0} words
        </div>
      </div>

      <div className="note-card-actions flex gap-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(note);
          }}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          title="Edit Note"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(note);
          }}
          className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded"
          title="Delete Note"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening the note
            console.log('Exporting note:', note.id);
            window.open(`/api/notes/${note.id}/export`);
          }}
          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
          title="Export Note"
        >
          <Download size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;