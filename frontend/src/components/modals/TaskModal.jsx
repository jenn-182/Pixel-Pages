import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, FileText, FolderOpen, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, taskLists = [], editTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
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
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
        tags: editTask.tags || '',
        taskListId: editTask.taskListId || null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
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

    onSubmit(taskData);
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20"
          style={{ zIndex: 2147483647 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)',
              zIndex: 2147483647
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4 border-b-2 border-cyan-400 flex items-center justify-between">
              <h2 className="text-xl font-mono font-bold text-white">
                {editTask ? 'EDIT MISSION' : 'NEW MISSION'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-800">
              {/* Title */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                  MISSION NAME
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter mission name..."
                  className={`w-full bg-gray-900 border-2 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs font-mono mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2 flex items-center">
                  <FileText size={16} className="mr-2" />
                  MISSION DETAILS
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Optional mission details..."
                  rows="3"
                  className="w-full bg-gray-900 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Priority & Due Date Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-mono font-bold text-cyan-400 mb-2">
                    PRIORITY LEVEL
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400"
                    style={{
                      color: getPriorityColor(formData.priority)
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-mono font-bold text-cyan-400 mb-2 flex items-center">
                    <Calendar size={16} className="mr-2" />
                    DEADLINE
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Task List */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2 flex items-center">
                  <FolderOpen size={16} className="mr-2" />
                  OPERATION
                </label>
                <select
                  value={formData.taskListId || ''}
                  onChange={(e) => handleChange('taskListId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full bg-gray-900 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="">General Player Missions</option>
                  {taskLists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-mono font-bold text-cyan-400 mb-2 flex items-center">
                  <Tag size={16} className="mr-2" />
                  MISSION TAGS
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="to-do, ideas, work..."
                  className="w-full bg-gray-900 border-2 border-gray-600 text-white px-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
                <p className="text-gray-400 text-xs font-mono mt-1">
                  Separate tags with commas
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 border-2 border-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-mono font-bold"
                >
                  ABORT MISSION
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-mono font-bold"
                >
                  {editTask ? 'UPDATE' : 'DEPLOY'} MISSION
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