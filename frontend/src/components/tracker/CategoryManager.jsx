import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Palette,
  Tag,
  Briefcase,
  BookOpen,
  Home,
  Dumbbell,
  FileText
} from 'lucide-react';
import useFocusSessions from '../../hooks/useFocusSessions';

const CategoryManager = ({ 
  isOpen, 
  onClose, 
  sessions, 
  updateSession, 
  deleteSession, 
  tabColor = '#F59E0B' 
}) => {
  const PREDEFINED_TAGS = [
    { id: 'work', label: 'Work', color: '#3B82F6', icon: Briefcase },
    { id: 'learning', label: 'Learning', color: '#10B981', icon: BookOpen },
    { id: 'personal', label: 'Personal', color: '#8B5CF6', icon: Home },
    { id: 'health', label: 'Health', color: '#EF4444', icon: Dumbbell },
    { id: 'creative', label: 'Creative', color: '#F59E0B', icon: Palette },
    { id: 'other', label: 'Other', color: '#6B7280', icon: FileText }
  ];

  const [editingSession, setEditingSession] = useState(null);
  const [newSession, setNewSession] = useState({
    name: '',
    description: '',
    colorCode: '#8B5CF6',
    tag: 'work', // Default to work
    workDuration: 25,
    breakDuration: 5,
    cycles: 1
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const { createSession } = useFocusSessions();

  const tabColorRgb = '245, 158, 11'; // RGB for #F59E0B

  const predefinedColors = [
    '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  useEffect(() => {
    if (!isOpen) {
      setEditingSession(null);
      setShowNewForm(false);
      setNewSession({
        name: '',
        description: '',
        colorCode: '#8B5CF6',
        tag: 'work', // Default to work
        workDuration: 25,
        breakDuration: 5,
        cycles: 1
      });
    }
  }, [isOpen]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    if (!newSession.name.trim()) {
      alert('Session name is required');
      return;
    }

    try {
      await createSession(newSession);
      setShowNewForm(false);
      setNewSession({
        name: '',
        description: '',
        colorCode: '#8B5CF6',
        tag: 'work', // Default to work
        workDuration: 25,
        breakDuration: 5,
        cycles: 1
      });
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    
    if (!editingSession.name.trim()) {
      alert('Session name is required');
      return;
    }

    try {
      await updateSession(editingSession.id, editingSession);
      setEditingSession(null);
    } catch (error) {
      console.error('Failed to update session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session category? All logged time will be permanently lost.')) {
      try {
        await deleteSession(sessionId);
        setEditingSession(null);
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-16"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto"
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
              <h3 className="font-mono text-xl font-bold text-white">
                CATEGORY MANAGER
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm font-mono text-gray-400">
              Create, edit, and manage your focus session categories.
            </p>
          </div>

          <div className="relative z-10">
            {/* Add New Session Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                style={{
                  borderColor: tabColor,
                  color: tabColor,
                  boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                }}
              >
                <div className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>ADD NEW CATEGORY</span>
                </div>
              </button>
            </div>

            {/* New Session Form */}
            {showNewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-900 border border-gray-600 p-4 mb-6"
              >
                <form onSubmit={handleCreateSession} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-mono font-bold mb-2 text-white">
                        CATEGORY NAME
                      </label>
                      <input
                        type="text"
                        value={newSession.name}
                        onChange={(e) => setNewSession(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter category name..."
                        className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-mono font-bold mb-2 text-white">
                        TAG
                      </label>
                      <select
                        value={newSession.tag}
                        onChange={(e) => setNewSession(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                      >
                        {PREDEFINED_TAGS.map(tag => (
                          <option key={tag.id} value={tag.id}>
                            {tag.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 mt-2">
                        {PREDEFINED_TAGS.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => setNewSession(prev => ({ ...prev, tag: tag.id }))}
                            className={`p-3 border-2 font-mono text-sm transition-all flex items-center gap-2 ${
                              newSession.tag === tag.id
                                ? 'border-white text-white'
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                            style={{
                              borderColor: newSession.tag === tag.id ? tag.color : undefined,
                              backgroundColor: newSession.tag === tag.id ? `${tag.color}20` : undefined
                            }}
                          >
                            <tag.icon size={16} />
                            <span>{tag.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold mb-2 text-white">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm resize-none focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold mb-2 text-white">
                      COLOR
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewSession(prev => ({ ...prev, colorCode: color }))}
                          className={`w-8 h-8 border-2 transition-all duration-200 ${
                            newSession.colorCode === color ? 'border-white scale-110' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">WORK (min)</label>
                      <input
                        type="number"
                        value={newSession.workDuration}
                        onChange={(e) => setNewSession(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                        min="1"
                        className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">BREAK (min)</label>
                      <input
                        type="number"
                        value={newSession.breakDuration}
                        onChange={(e) => setNewSession(prev => ({ ...prev, breakDuration: parseInt(e.target.value) || 5 }))}
                        min="1"
                        className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">CYCLES</label>
                      <input
                        type="number"
                        value={newSession.cycles}
                        onChange={(e) => setNewSession(prev => ({ ...prev, cycles: parseInt(e.target.value) || 1 }))}
                        min="1"
                        className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 bg-gray-800 border-2 border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gray-800 border-2 border-yellow-400 px-4 py-2 font-mono font-bold text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 transition-colors"
                    >
                      CREATE CATEGORY
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Existing Sessions List */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-white">EXISTING CATEGORIES</h4>
              
              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id}>
                      {editingSession?.id === session.id ? (
                        // Edit Form
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-gray-900 border border-gray-600 p-4"
                        >
                          <form onSubmit={handleUpdateSession} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-mono font-bold mb-2 text-white">
                                  CATEGORY NAME
                                </label>
                                <input
                                  type="text"
                                  value={editingSession.name}
                                  onChange={(e) => setEditingSession(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-mono font-bold mb-2 text-white">
                                  TAG
                                </label>
                                <select
                                  value={editingSession.tag}
                                  onChange={(e) => setEditingSession(prev => ({ ...prev, tag: e.target.value }))}
                                  className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                                >
                                  {PREDEFINED_TAGS.map(tag => (
                                    <option key={tag.id} value={tag.id}>
                                      {tag.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex gap-2 mt-2">
                                  {PREDEFINED_TAGS.map(tag => (
                                    <button
                                      key={tag.id}
                                      type="button"
                                      onClick={() => setEditingSession(prev => ({ ...prev, tag: tag.id }))}
                                      className={`px-3 py-1 text-xs font-mono border transition-all ${
                                        editingSession.tag === tag.id
                                          ? 'border-white text-white'
                                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                                      }`}
                                      style={{
                                        borderColor: editingSession.tag === tag.id ? tag.color : undefined,
                                        color: editingSession.tag === tag.id ? tag.color : undefined
                                      }}
                                    >
                                      {tag.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-mono font-bold mb-2 text-white">
                                COLOR
                              </label>
                              <div className="grid grid-cols-5 gap-2">
                                {predefinedColors.map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => setEditingSession(prev => ({ ...prev, colorCode: color }))}
                                    className={`w-8 h-8 border-2 transition-all duration-200 ${
                                      editingSession.colorCode === color ? 'border-white scale-110' : 'border-gray-600'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setEditingSession(null)}
                                className="flex-1 bg-gray-800 border-2 border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                              >
                                CANCEL
                              </button>
                              <button
                                type="submit"
                                className="flex-1 bg-gray-800 border-2 border-green-400 px-4 py-2 font-mono font-bold text-green-400 hover:bg-green-400 hover:bg-opacity-10 transition-colors"
                              >
                                SAVE CHANGES
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      ) : (
                        // Display Mode
                        <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-600 hover:border-gray-500 transition-colors">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4"
                              style={{ backgroundColor: session.colorCode }}
                            />
                            <div>
                              <div className="font-mono font-bold text-white">{session.name}</div>
                              {session.tag && (
                                <div className="text-xs text-gray-400 font-mono">{session.tag}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingSession(session)}
                              className="text-gray-400 hover:text-yellow-400 transition-colors p-2"
                              title="Edit category"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors p-2"
                              title="Delete category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 font-mono">
                  No categories created yet. Add your first category above.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryManager;