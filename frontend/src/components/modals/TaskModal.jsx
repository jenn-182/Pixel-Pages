import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, FileText, FolderOpen, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, taskLists = [], editTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    tags: '',
    taskListId: null
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || '',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
        tags: editTask.tags || '',
        taskListId: editTask.taskListId || null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        tags: '',
        taskListId: null
      });
    }
  }, [editTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format data for submission
    const taskData = {
      ...formData,
      completed: editTask?.completed || false,
      dueDate: formData.dueDate || null,
      taskListId: formData.taskListId === '' ? null : formData.taskListId
    };

    if (editTask) {
      // For existing tasks, pass the ID and data separately
      onSubmit(editTask.id, taskData);
    } else {
      // For new tasks, just pass the data
      onSubmit(taskData);
    }
    onClose();
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-white/60 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative w-full max-w-lg overflow-hidden rounded-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 border-2 border-white/60 opacity-20 animate-pulse pointer-events-none rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
            
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b-2 border-white">
              <h2 className="text-xl font-mono font-bold text-white">
                {editTask ? 'EDIT MISSION' : 'NEW MISSION'}
              </h2>
              <button
                onClick={onClose}
                className="bg-black border-2 border-white/60 px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-2">
                  <X size={16} className="text-white" />
                  <span className="text-white">CLOSE</span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2">
                  MISSION NAME
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter mission name..."
                  spellCheck={false}
                  className={`w-full px-3 py-2 transition-colors placeholder-gray-500 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none rounded ${
                    errors.title ? 'border-red-400' : ''
                  }`}
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff !important',
                    caretColor: '#ffffff !important',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                  }}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs font-mono mt-2 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  MISSION DETAILS
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Optional mission details..."
                  rows="3"
                  spellCheck={false}
                  className="w-full px-3 py-2 transition-colors placeholder-gray-500 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none resize-none rounded"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff !important',
                    caretColor: '#ffffff !important',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                  }}
                />
              </div>

              {/* Priority & Due Date Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-mono font-bold text-white mb-2">
                    PRIORITY LEVEL
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none rounded"
                    style={{
                      color: getPriorityColor(formData.priority),
                      WebkitTextFillColor: getPriorityColor(formData.priority),
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <option value="" style={{ color: '#ffffff' }}>No Priority</option>
                    <option value="low" style={{ color: '#10B981' }}>Low Priority</option>
                    <option value="medium" style={{ color: '#F59E0B' }}>Medium Priority</option>
                    <option value="high" style={{ color: '#EF4444' }}>High Priority</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-mono font-bold text-white mb-2 flex items-center">
                    <Calendar size={16} className="mr-2" />
                    DEADLINE
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none rounded"
                    style={{ 
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff !important',
                      caretColor: '#ffffff !important',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
              </div>

              {/* Task List */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2 flex items-center">
                  <FolderOpen size={16} className="mr-2" />
                  OPERATION
                </label>
                <select
                  value={formData.taskListId || ''}
                  onChange={(e) => handleChange('taskListId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none rounded"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff !important',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <option value="">Player Missions</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono font-bold text-white mb-2 flex items-center">
                  <Tag size={16} className="mr-2" />
                  MISSION TAGS
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="to-do, ideas, work..."
                  spellCheck={false}
                  className="w-full px-3 py-2 bg-black border-2 border-white/60 font-mono text-sm focus:outline-none rounded"
                  style={{ 
                    color: '#ffffff !important',
                    WebkitTextFillColor: '#ffffff !important',
                    caretColor: '#ffffff !important',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                  }}
                />
                <p className="text-gray-400 text-xs font-mono mt-2">
                  Separate tags with commas
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <X size={16} className="text-white" />
                    <span className="text-white">ABORT</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Calendar size={16} className="text-white" />
                    <span className="text-white">{editTask ? 'UPDATE' : 'DEPLOY'}</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TaskModal;