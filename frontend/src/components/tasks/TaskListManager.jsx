import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, Plus, Edit, Trash2, X, Folder, Search, Target } from 'lucide-react';

const TaskListManager = ({ taskLists, onCreateTaskList, onDeleteTaskList, onSelectTaskList, selectedTaskListId, tabColor = '#0EA5E9' }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newListData, setNewListData] = useState({ name: '', description: '', color: '#0EA5E9' });

  const tabColorRgb = '14, 165, 233'; // RGB values for #0EA5E9

  const colorOptions = [
    '#EF4444', '#F59E0B', '#EAB308', '#22C55E', '#0EA5E9', '#8B5CF6', '#EC4899', '#6B7280'
  ];

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
    <div className="border-2 border-white/60 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative rounded-lg"
         style={{
           backgroundColor: 'rgba(0, 0, 0, 0.4)',
           boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), 8px 8px 0px 0px rgba(0,0,0,1)'
         }}>
      <div className="absolute inset-0 border-2 border-white/60 opacity-20 pointer-events-none rounded-lg" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-mono font-bold text-white flex items-center mb-2">
            <List className="mr-2" size={20} />
            OPERATIONS
          </h3>
          <p className="text-sm font-mono text-gray-400">
            Organize missions into separate operations.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operations..."
              spellCheck={false}
              className="w-full bg-black border-2 border-white/60 text-white pl-10 pr-10 py-3 font-mono text-sm transition-colors focus:outline-none rounded"
              style={{ 
                color: '#ffffff !important',
                WebkitTextFillColor: '#ffffff !important',
                caretColor: '#ffffff !important',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* General Operations */}
          <button
            onClick={() => onSelectTaskList(null)}
            className={`w-full text-left p-4 border-2 border-white/60 transition-all duration-300 font-mono relative overflow-hidden rounded ${
              selectedTaskListId === null
                ? 'text-white'
                : 'text-gray-300 hover:text-white hover:scale-[1.02]'
            }`}
            style={{
              backgroundColor: selectedTaskListId === null ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
              boxShadow: selectedTaskListId === null 
                ? '0 0 25px rgba(255, 255, 255, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)' 
                : '0 0 15px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            {selectedTaskListId === null && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 pointer-events-none rounded" />
            )}
            <div className="relative z-10 flex items-center">
              <Folder size={16} className="mr-3 text-white" />
              <span className="font-bold text-white">PLAYER MISSIONS</span>
            </div>
          </button>

          {/* Filtered Operations */}
          {filteredTaskLists.map((list) => {
            const listColor = list.color || '#60A5FA';
            const rgbColor = listColor.startsWith('#') 
              ? `${parseInt(listColor.slice(1, 3), 16)}, ${parseInt(listColor.slice(3, 5), 16)}, ${parseInt(listColor.slice(5, 7), 16)}`
              : '96, 165, 250';

            return (
              <div key={list.id} className="relative group">
                <button
                  onClick={() => onSelectTaskList(list.id)}
                  className={`w-full text-left p-4 border-2 border-white/60 transition-all duration-300 font-mono relative overflow-hidden rounded ${
                    selectedTaskListId === list.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white hover:scale-[1.02]'
                  }`}
                  style={{
                    backgroundColor: selectedTaskListId === list.id ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
                    boxShadow: selectedTaskListId === list.id 
                      ? `0 0 25px rgba(${rgbColor}, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)` 
                      : `0 0 15px rgba(${rgbColor}, 0.5), 2px 2px 0px 0px rgba(0,0,0,1)`
                  }}
                >
                  {selectedTaskListId === list.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 pointer-events-none rounded" />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-3 border-2 border-white rounded-full"
                        style={{ backgroundColor: list.color }}
                      />
                      <div>
                        <div className="font-bold text-white">{list.name}</div>
                        {list.description && (
                          <div className="text-xs text-gray-400 mt-1">{list.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                
                {/* Terminate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Terminate "${list.name}" operation? Missions will be moved to General Operations.`)) {
                      onDeleteTaskList(list.id);
                    }
                  }}
                  className="absolute top-2 right-2 bg-black border border-white/60 p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"
                  title="Terminate operation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-xs font-mono text-gray-400 px-2">
              {filteredTaskLists.length} of {taskLists.length} operations
            </div>
          )}

          {/* ALL MISSIONS Button */}
          <button
            onClick={() => onSelectTaskList('all')}
            className={`w-full p-4 border-2 border-white/60 transition-all duration-300 font-mono font-bold relative overflow-hidden rounded ${
              selectedTaskListId === 'all'
                ? 'text-white'
                : 'text-gray-300 hover:text-white hover:scale-[1.02]'
            }`}
            style={{
              backgroundColor: selectedTaskListId === 'all' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
              boxShadow: selectedTaskListId === 'all' 
                ? '0 0 25px rgba(255, 255, 255, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)' 
                : '0 0 15px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            {selectedTaskListId === 'all' && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/20 pointer-events-none rounded" />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Target size={16} className="text-white" />
              <span className="text-white">ALL MISSIONS</span>
            </div>
          </button>

          {/* Create Operation */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 border-2 border-dashed border-white/60 text-gray-400 hover:text-white transition-all duration-300 font-mono font-bold flex items-center justify-center gap-2 hover:scale-[1.02] rounded"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
              }}
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
              className="space-y-4 p-4 border-2 border-white/60 rounded"              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
              }}
            >
              <input
                type="text"
                value={newListData.name}
                onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Operation name..."
                spellCheck={false}
                className="w-full bg-black border-2 border-white/60 text-white px-3 py-2 font-mono text-sm focus:outline-none rounded"
                style={{
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                  caretColor: '#ffffff !important',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}
                autoFocus
              />

              <input
                type="text"
                value={newListData.description}
                onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Operation details (optional)..."
                spellCheck={false}
                className="w-full bg-black border-2 border-white/60 text-white px-3 py-2 font-mono text-sm focus:outline-none rounded"
                style={{
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                  caretColor: '#ffffff !important',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}
              />

              <div>
                <div className="text-xs font-mono text-white mb-2">IDENTIFICATION COLOR</div>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewListData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 border-2 transition-all duration-200 rounded ${
                        newListData.color === color ? 'border-white scale-110' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-black border-2 border-white/60 px-3 py-2 font-mono text-sm font-bold transition-all duration-300 hover:scale-105 text-white rounded"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  CREATE OPERATION
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-2 bg-black border-2 border-white/60 text-white font-mono text-sm transition-all duration-300 hover:scale-105 rounded"
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskListManager;