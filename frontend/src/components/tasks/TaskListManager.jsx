import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Edit, Trash2, X, Folder, Search } from 'lucide-react';

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
    <div className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
         style={{
           borderColor: tabColor,
           boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
         }}>
      <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
           style={{ borderColor: tabColor }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black border-b px-4 py-3"
             style={{ borderColor: tabColor }}>
          <h3 className="text-lg font-mono font-bold text-white flex items-center">
            <Target className="mr-2" size={20} style={{ color: tabColor }} />
            MISSION OPERATIONS
          </h3>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                    size={16} style={{ color: tabColor }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operations..."
              className="w-full bg-black border text-white pl-9 pr-3 py-2 font-mono text-sm transition-colors"
              style={{ 
                borderColor: selectedTaskListId === null ? tabColor : '#4B5563',
                color: '#fff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = tabColor;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#4B5563';
              }}
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
            className={`w-full text-left p-3 border-2 transition-all duration-200 font-mono relative overflow-hidden bg-gray-900 ${
              selectedTaskListId === null
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            style={{
              borderColor: selectedTaskListId === null ? tabColor : '#4B5563',
              boxShadow: selectedTaskListId === null ? `0 0 3px rgba(${tabColorRgb}, 0.3)` : 'none'
            }}
          >
            {selectedTaskListId === null && (
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.08), rgba(${tabColorRgb}, 0.12))` }} />
            )}
            <div className="relative z-10 flex items-center">
              <Folder size={16} className="mr-2" />
              <span className="font-bold">TO-DO MISSIONS</span>
            </div>
          </button>

          {/* Filtered Operations */}
          {filteredTaskLists.map((list) => (
            <div key={list.id} className="relative group">
              <button
                onClick={() => onSelectTaskList(list.id)}
                className={`w-full text-left p-3 border-2 transition-all duration-200 font-mono relative overflow-hidden bg-gray-900 ${
                  selectedTaskListId === list.id
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  borderColor: selectedTaskListId === list.id ? tabColor : '#4B5563',
                  boxShadow: selectedTaskListId === list.id ? `0 0 3px rgba(${tabColorRgb}, 0.3)` : 'none'
                }}
              >
                {selectedTaskListId === list.id && (
                  <div className="absolute inset-0 pointer-events-none"
                       style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.08), rgba(${tabColorRgb}, 0.12))` }} />
                )}
                <div className="relative z-10 flex items-center justify-between">
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
              
              {/* Terminate Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Terminate "${list.name}" operation? Missions will be moved to General Operations.`)) {
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

          {/* ALL MISSIONS Button - Above CREATE OPERATION */}
          <button
            onClick={() => onSelectTaskList('all')}
            className={`w-full p-3 border-2 transition-all duration-200 font-mono font-bold relative overflow-hidden bg-gray-900 ${
              selectedTaskListId === 'all'
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            style={{
              borderColor: selectedTaskListId === 'all' ? tabColor : '#4B5563',
              boxShadow: selectedTaskListId === 'all' ? `0 0 3px rgba(${tabColorRgb}, 0.3)` : 'none'
            }}
          >
            {selectedTaskListId === 'all' && (
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.08), rgba(${tabColorRgb}, 0.12))` }} />
            )}
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Target size={16} />
              <span>ALL MISSIONS</span>
            </div>
          </button>

          {/* Deploy New Operation */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-3 border-2 border-dashed text-gray-400 hover:text-white transition-all duration-200 font-mono font-bold flex items-center justify-center gap-2 bg-gray-900"
              style={{
                borderColor: '#4B5563'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = tabColor;
                e.target.style.color = tabColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#4B5563';
                e.target.style.color = '#9CA3AF';
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
              className="space-y-3 p-3 border-2 bg-black"
              style={{ borderColor: tabColor }}
            >
              <input
                type="text"
                value={newListData.name}
                onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Operation name..."
                className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:outline-none"
                style={{
                  focusBorderColor: tabColor
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = tabColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                }}
                autoFocus
              />

              <input
                type="text"
                value={newListData.description}
                onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Operation details (optional)..."
                className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = tabColor;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#4B5563';
                }}
              />

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

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-black border px-3 py-1 font-mono text-sm font-bold transition-colors duration-200"
                  style={{
                    borderColor: tabColor,
                    color: tabColor
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `rgba(${tabColorRgb}, 0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'black';
                  }}
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
    </div>
  );
};

export default TaskListManager;