import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Edit, Trash2, X, Folder, Search } from 'lucide-react';

const TaskListManager = ({ taskLists, onCreateTaskList, onDeleteTaskList, onSelectTaskList, selectedTaskListId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newListData, setNewListData] = useState({ name: '', description: '', color: '#0EA5E9' });

  const colorOptions = [
    '#EF4444', // Red
    '#F59E0B', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#0EA5E9', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  // Filter operations based on search
  const filteredTaskLists = taskLists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newListData.name.trim()) return;

    try {
      await onCreateTaskList(newListData);
      setNewListData({ name: '', description: '', color: '#0EA5E9' });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to deploy operation:', err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewListData({ name: '', description: '', color: '#0EA5E9' });
  };

  return (
    <div className="bg-gray-800 border border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-fit">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-600">
        <h3 className="text-lg font-mono font-bold text-white flex items-center">
          <Target className="mr-2" size={20} />
          MISSION OPERATIONS
        </h3>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operations..."
            className="w-full bg-gray-900 border border-gray-600 text-white pl-9 pr-3 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* General Operations */}
        <button
          onClick={() => onSelectTaskList(null)}
          className={`w-full text-left p-3 border-2 transition-all duration-200 font-mono ${
            selectedTaskListId === null
              ? 'border-cyan-400 bg-cyan-400 bg-opacity-20 text-cyan-400'
              : 'border-gray-600 text-gray-300 hover:border-gray-500'
          }`}
        >
          <div className="flex items-center">
            <Folder size={16} className="mr-2" />
            <span className="font-bold">To-Do</span>
          </div>
        </button>

        {/* Filtered Operations */}
        {filteredTaskLists.map((list) => (
          <div key={list.id} className="relative group">
            <button
              onClick={() => onSelectTaskList(list.id)}
              className={`w-full text-left p-3 border-2 transition-all duration-200 font-mono ${
                selectedTaskListId === list.id
                  ? 'border-cyan-400 bg-cyan-400 bg-opacity-20 text-cyan-400'
                  : 'border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-2 border"
                    style={{ backgroundColor: list.color, borderColor: list.color }}
                  />
                  <div>
                    <div className="font-bold">{list.name}</div>
                    {list.description && (
                      <div className="text-xs text-gray-400 mt-1">{list.description}</div>
                    )}
                  </div>
                </div>
              </div>
            </button>
            
            {/* Terminate Button (appears on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Terminate "${list.name}" operation? Missions will be moved to To-Do Operations.`)) {
                  onDeleteTaskList(list.id);
                }
              }}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
              title="Terminate operation"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {/* Search Results Info */}
        {searchQuery && (
          <div className="text-xs font-mono text-gray-400 px-2">
            {filteredTaskLists.length} of {taskLists.length} operations
          </div>
        )}

        {/* Deploy New Operation */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-3 border-2 border-dashed border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 font-mono font-bold flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            CREATE OPERATION
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateSubmit}
            className="space-y-3 p-3 border-2 border-cyan-400 bg-gray-900"
          >
            {/* Name Input */}
            <input
              type="text"
              value={newListData.name}
              onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Operation name..."
              className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:outline-none focus:border-cyan-400"
              autoFocus
            />

            {/* Description Input */}
            <input
              type="text"
              value={newListData.description}
              onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Operation details (optional)..."
              className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:outline-none focus:border-cyan-400"
            />

            {/* Color Picker */}
            <div>
              <div className="text-xs font-mono text-gray-400 mb-2">IDENTIFICATION COLOR</div>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewListData(prev => ({ ...prev, color }))}
                    className={`w-6 h-6 border-2 transition-all duration-200 ${
                      newListData.color === color ? 'border-white scale-110' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 border border-cyan-500 font-mono text-sm font-bold transition-colors duration-200"
              >
                CREATE OPERATION
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 text-gray-400 hover:text-white border border-gray-600 font-mono text-sm transition-colors duration-200"
              >
                <X size={14} />
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default TaskListManager;