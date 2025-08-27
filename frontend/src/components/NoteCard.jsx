// src/components/NoteCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onView, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white cursor-pointer"
      style={{ borderTopColor: note.color || '#FFD700', borderTopWidth: '8px' }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => onView(note)}
    >
      <div className="p-4">
        <h3 className="font-mono font-bold text-lg mb-2 truncate">{note.title}</h3>
        <p className="text-gray-600 line-clamp-3 h-16">
          {truncateContent(note.content)}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-200 border border-gray-400 px-2 py-1 font-mono"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 px-4 py-2 flex justify-between text-xs text-gray-500">
        <span>{formatDate(note.createdAt || note.created)}</span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="hover:text-blue-500 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note);
            }}
            className="hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;