import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Clock, AlertTriangle, Trash2, Edit, Calendar, Tag, FileText, Filter, Check, Menu, X } from 'lucide-react';
import useTasks from '../../hooks/useTasks';
import TaskModal from '../modals/TaskModal';
import TaskListManager from '../tasks/TaskListManager';

const TasksTab = ({ tabColor = '#0EA5E9' }) => {
  const { 
    tasks, 
    taskLists, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    toggleTask, 
    deleteTask,
    createTaskList,
    deleteTaskList,
    getTasksByList
  } = useTasks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskListId, setSelectedTaskListId] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showOperations, setShowOperations] = useState(true); // New state for operations sidebar
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    tags: ''
  });

  // Filter tasks based on selected list and filters
  useEffect(() => {
    let filtered;
    
    if (selectedTaskListId === 'all') {
      // Show ALL tasks from every list and general operations
      filtered = tasks;
    } else if (selectedTaskListId === null) {
      // Show only tasks not in any list (general operations)
      filtered = tasks.filter(task => !task.taskListId);
    } else {
      // Show tasks from specific list - handle both string and number IDs
      filtered = tasks.filter(task => {
        // Convert both values to strings for comparison to handle type mismatches
        const taskListIdStr = task.taskListId ? String(task.taskListId) : null;
        const selectedIdStr = selectedTaskListId ? String(selectedTaskListId) : null;
        return taskListIdStr === selectedIdStr;
      });
    }

    // Apply other filters after getting the base filtered set
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.status !== 'all') {
      const isCompleted = filters.status === 'completed';
      filtered = filtered.filter(task => task.completed === isCompleted);
    }
    
    if (filters.tags) {
      filtered = filtered.filter(task => 
        task.tags && task.tags.some(tag => 
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, selectedTaskListId, filters]);

  const handleCreateTask = async (taskData) => {
    try {
      const taskWithList = {
        ...taskData,
        taskListId: selectedTaskListId
      };
      await createTask(taskWithList);
    } catch (err) {
      console.error('Failed to deploy mission:', err);
    }
  };

  const handleUpdateTask = async (idOrData, taskData = null) => {
    try {
      if (taskData) {
        // If taskData is provided, it means we're updating (idOrData is the ID)
        await updateTask(idOrData, taskData);
      } else {
        // If only idOrData is provided and we have editingTask, update it
        await updateTask(editingTask.id, idOrData);
      }
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update mission:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSubmit = (idOrData, taskData = null) => {
    if (taskData) {
      // If taskData is provided, it means we're updating (idOrData is the ID)
      handleUpdateTask(idOrData, taskData);
    } else {
      // If only idOrData is provided, it means we're creating (idOrData is the data)
      handleCreateTask(idOrData);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await toggleTask(taskId);
    } catch (err) {
      console.error('Failed to update mission status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to abort mission:', err);
    }
  };

  const handleCreateTaskList = async (taskListData) => {
    try {
      await createTaskList(taskListData);
    } catch (err) {
      console.error('Failed to create operation:', err);
    }
  };

  const handleDeleteTaskList = async (taskListId) => {
    try {
      await deleteTaskList(taskListId);
      if (selectedTaskListId === taskListId) {
        setSelectedTaskListId(null);
      }
    } catch (err) {
      console.error('Failed to terminate operation:', err);
    }
  };

  const handleSelectTaskList = (taskListId) => {
    console.log('TasksTab: Selecting task list:', taskListId);
    setSelectedTaskListId(taskListId); // This should accept 'all', null, or a specific ID
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'markAllComplete':
        filteredTasks.forEach(task => {
          if (!task.completed) {
            handleToggleTask(task.id);
          }
        });
        break;
      case 'deleteCompleted':
        const completedTasks = filteredTasks.filter(t => t.completed);
        completedTasks.forEach(task => {
          handleDeleteTask(task.id);
        });
        break;
      case 'addToProject':
        console.log('Bulk assign to operation');
        break;
    }
  };

  const getPriorityGlow = (priority) => {
    switch (priority) {
      case 'high': return '0 0 15px rgba(255, 99, 99, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'; // Brighter red
      case 'medium': return '0 0 15px rgba(255, 206, 84, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'; // Brighter yellow
      case 'low': return '0 0 15px rgba(72, 255, 72, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'; // Brighter green
      default: return '0 0 10px rgba(255, 255, 255, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)';
    }
  };

  const getPriorityColor = (priority, isCompleted = false) => {
    if (isCompleted) {
      return '#6B7280'; // Gray for completed tasks
    }
    
    switch (priority) {
      case 'high': return '#FF6363'; // Brighter red to match glow
      case 'medium': return '#FFCE54'; // Brighter yellow to match glow
      case 'low': return '#48FF48'; // Brighter green to match glow
      default: return '#FFFFFF'; // White for no priority
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <Target size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return '';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'TOMORROW';
    if (diffDays === -1) return 'YESTERDAY';
    if (diffDays < 0) return `${Math.abs(diffDays)} DAYS OVERDUE`;
    if (diffDays < 7) return `${diffDays} DAYS REMAINING`;
    
    return date.toLocaleDateString();
  };

  const getDueDateColor = (dueDate, completed) => {
    if (!dueDate || completed) return '#6B7280';
    
    const date = new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#EF4444';
    if (diffDays <= 1) return '#F59E0B';
    return '#10B981';
  };

  const parseTagsToArray = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const getTaskListName = (taskListId) => {
    if (!taskListId) return 'To-Do';
    const list = taskLists.find(l => l.id === taskListId);
    return list ? list.name : 'Unknown Operation';
  };

  const getCurrentViewName = () => {
    if (selectedTaskListId === 'all') return 'All Operations';
    if (selectedTaskListId === null) return 'Player Missions';
    const list = taskLists.find(l => l.id === selectedTaskListId);
    return list ? list.name : 'Unknown Operation';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Target size={24} className="text-cyan-400" />
        </motion.div>
        <div className="text-white font-mono">Loading mission database...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 font-mono">SYSTEM ERROR: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full">
        {/* Left Sidebar - Operations (Toggleable) */}
        {showOperations && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-80 p-4"
          >
            <TaskListManager
              taskLists={taskLists}
              onCreateTaskList={handleCreateTaskList}
              onDeleteTaskList={handleDeleteTaskList}
              onSelectTaskList={handleSelectTaskList} // Make sure this function is passed
              selectedTaskListId={selectedTaskListId}
              tabColor={tabColor}
            />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">


          {/* Mission Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
          >
            <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-mono font-bold text-white flex items-center">
                  {selectedTaskListId === 'all' 
                    ? 'ALL MISSIONS' 
                    : selectedTaskListId === null 
                      ? 'PLAYER MISSIONS' 
                      : `${getCurrentViewName().toUpperCase()} MISSIONS`
                  }
                </h2>
                <div className="flex items-center gap-4">
                  {/* Operations Toggle Button */}
                  <button
                    onClick={() => setShowOperations(!showOperations)}
                    className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                    style={{
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-2">
                      {showOperations ? <X size={16} /> : <Menu size={16} />}
                      <span>{showOperations ? 'HIDE OPERATIONS' : 'SHOW OPERATIONS'}</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                  </button>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                    style={{
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-2">
                      <Filter size={16} />
                      <span>FILTER</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                  </button>
                  
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                    style={{
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-2">
                      <Plus size={16} />
                      <span>NEW MISSION</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
                  </button>
                </div>
              </div>
              
              {/* Add mission stats and description */}
              <div className="mt-4">
                <p className="text-gray-400 font-mono text-sm mb-2">
                  Active player missions.
                </p>
                <div className="text-sm font-mono text-gray-400">
                  {filteredTasks.filter(t => t.completed).length}/{filteredTasks.length} MISSIONS COMPLETE • {getCurrentViewName()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  MISSION FILTERS
                </h3>
                
                {/* Streamlined Filter Controls */}
                <div className="space-y-4">
                  {/* Compact Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3 p-3 bg-black border border-white/60 rounded"
                       style={{
                         boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                       }}>
                    {/* Priority Filter Pills */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">PRIORITY:</span>
                      <div className="flex gap-1">
                        {['all', 'high', 'medium', 'low'].map((priority) => (
                          <button
                            key={priority}
                            onClick={() => setFilters(prev => ({ ...prev, priority }))}
                            className={`px-3 py-1 text-xs font-mono font-bold border transition-all duration-200 rounded ${
                              filters.priority === priority
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-gray-400 border-gray-600 hover:border-white hover:text-white'
                            }`}
                            style={{
                              ...(priority === 'high' && filters.priority === priority && { backgroundColor: '#FF6363', color: '#000' }),
                              ...(priority === 'medium' && filters.priority === priority && { backgroundColor: '#FFCE54', color: '#000' }),
                              ...(priority === 'low' && filters.priority === priority && { backgroundColor: '#48FF48', color: '#000' })
                            }}
                          >
                            {priority === 'all' ? 'ALL' : priority.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">STATUS:</span>
                      <div className="flex gap-1">
                        {['all', 'active', 'completed', 'overdue'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setFilters(prev => ({ ...prev, status }))}
                            className={`px-3 py-1 text-xs font-mono font-bold border transition-all duration-200 rounded ${
                              filters.status === status
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-gray-400 border-gray-600 hover:border-white hover:text-white'
                            }`}
                          >
                            {status.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags Filter */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-mono text-gray-400">TAGS:</span>
                      <input
                        type="text"
                        value={filters.tags}
                        onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="search tags..."
                        spellCheck={false}
                        className="flex-1 bg-black border border-gray-600 text-white px-2 py-1 font-mono text-xs focus:outline-none focus:border-white transition-colors rounded"
                        style={{ 
                          color: '#ffffff !important',
                          WebkitTextFillColor: '#ffffff !important',
                          caretColor: '#ffffff !important',
                          minWidth: '100px'
                        }}
                      />
                      {filters.tags && (
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, tags: '' }))}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Clear All Filters */}
                    {(filters.priority !== 'all' || filters.status !== 'all' || filters.tags) && (
                      <button
                        onClick={() => setFilters({ priority: 'all', status: 'all', tags: '' })}
                        className="px-3 py-1 text-xs font-mono bg-gray-800 text-gray-400 border border-gray-600 hover:border-white hover:text-white transition-all duration-200 rounded"
                      >
                        CLEAR ALL
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Missions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6 rounded-lg bg-black/40 backdrop-blur-md"
          >
            <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                ACTIVE MISSIONS
                <span className="ml-3 text-sm text-white">
                  [{filteredTasks.filter(task => !task.completed).length}]
                </span>
              </h3>
              
              {filteredTasks.filter(task => !task.completed).length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-mono">
                  {selectedTaskListId === null 
                    ? "No active missions. Deploy your first mission above!"
                    : `No active missions in "${getCurrentViewName()}" operation. Deploy your first mission above!`
                  }
                </div>
              ) : (
                filteredTasks
                  .filter(task => !task.completed)
                  .map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                    className={`bg-black border-2 border-white p-4 transition-all duration-200 mb-3 rounded cursor-pointer hover:z-10 relative ${
                      task.overdue 
                        ? 'border-red-400' 
                        : task.dueSoon 
                          ? 'border-yellow-400' 
                          : 'border-white'
                    }`}
                    style={{
                      boxShadow: task.overdue
                        ? '0 0 15px rgba(255, 99, 99, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' // Red glow for overdue
                        : task.dueSoon
                          ? '0 0 15px rgba(255, 206, 84, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' // Yellow glow for due soon
                          : getPriorityGlow(task.priority) // Priority-based glow
                    }}
                  >
                    <div className="space-y-3">
                      {/* Main mission row */}
                      <div className="flex items-center gap-3">
                        {/* Completion Status */}
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="w-6 h-6 border-2 border-white hover:border-green-400 flex items-center justify-center transition-all duration-200 rounded"
                          title="Mark as Complete"
                        >
                        </button>

                        {/* Mission Title */}
                        <span className="flex-1 font-mono text-white">
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        {task.priority && (
                          <span
                            className="px-2 py-1 text-xs font-mono font-bold border-2 rounded"
                            style={{
                              color: '#000000',
                              borderColor: getPriorityColor(task.priority),
                              backgroundColor: getPriorityColor(task.priority)
                            }}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                        )}

                        {/* Action Buttons */}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-white hover:text-gray-300 p-1 transition-colors duration-200 border border-white hover:border-gray-300 rounded"
                          title="Modify mission"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-white hover:text-gray-300 p-1 transition-colors duration-200 border border-white hover:border-gray-300 rounded"
                          title="Abort mission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Mission Briefing */}
                      {task.description && (
                        <div className="ml-10 text-gray-300 text-sm font-mono flex items-start gap-2">
                          <FileText size={14} className="mt-0.5 text-gray-500" />
                          <span>{task.description}</span>
                        </div>
                      )}

                      {/* Mission Details */}
                      {(task.dueDate || (task.tags && task.tags.length > 0)) && (
                        <div className="ml-10 flex items-center gap-4 text-sm">
                          {/* Mission Deadline */}
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} style={{ color: getDueDateColor(task.dueDate, task.completed) }} />
                              <span
                                className="font-mono"
                                style={{ color: getDueDateColor(task.dueDate, task.completed) }}
                              >
                                {formatDueDate(task.dueDate)}
                              </span>
                            </div>
                          )}

                          {/* Mission Tags */}
                          {task.tags && parseTagsToArray(task.tags).length > 0 && (
                            <div className="flex items-center gap-2">
                              <Tag size={14} className="text-gray-500" />
                              <div className="flex gap-1">
                                {parseTagsToArray(task.tags).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-0.5 text-xs font-mono bg-gray-700 text-gray-300 border border-gray-600 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Completed Missions List */}
          {filteredTasks.filter(task => task.completed).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative space-y-3 rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  COMPLETED MISSIONS
                  <span className="ml-3 text-sm text-white">
                    [{filteredTasks.filter(task => task.completed).length}]
                  </span>
                </h3>

                {filteredTasks.filter(task => task.completed).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-black border-2 border-gray-400 p-4 transition-all duration-200 mb-3 rounded cursor-pointer hover:z-10 relative"
                    style={{
                      boxShadow: '0 0 15px rgba(107, 114, 128, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="space-y-3">
                      {/* Main mission row */}
                      <div className="flex items-center gap-3">
                        {/* Completion Status */}
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="w-6 h-6 border-2 bg-gray-500 border-gray-500 text-white flex items-center justify-center transition-all duration-200 rounded"
                          title="Mission Complete - Click to reactivate"
                        >
                          <Check size={16} />
                        </button>

                        {/* Mission Title */}
                        <span className="flex-1 font-mono text-gray-400 line-through">
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        {task.priority && (
                          <span
                            className="px-2 py-1 text-xs font-mono font-bold border-2 opacity-60 rounded"
                            style={{
                              color: '#000000',
                              borderColor: getPriorityColor(task.priority, true),
                              backgroundColor: getPriorityColor(task.priority, true)
                            }}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                        )}

                        {/* Action Buttons */}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-white hover:text-gray-300 p-1 transition-colors duration-200 opacity-60 hover:opacity-100 border border-white hover:border-gray-300 rounded"
                          title="Modify mission"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-white hover:text-gray-300 p-1 transition-colors duration-200 opacity-60 hover:opacity-100 border border-white hover:border-gray-300 rounded"
                          title="Archive mission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Mission Briefing */}
                      {task.description && (
                        <div className="ml-10 text-gray-500 text-sm font-mono flex items-start gap-2">
                          <FileText size={14} className="mt-0.5 text-gray-600" />
                          <span className="line-through">{task.description}</span>
                        </div>
                      )}

                      {/* Mission Details */}
                      {(task.dueDate || (task.tags && task.tags.length > 0)) && (
                        <div className="ml-10 flex items-center gap-4 text-sm opacity-60">
                          {/* Mission Deadline */}
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-500" />
                              <span className="font-mono text-gray-500">
                                {formatDueDate(task.dueDate)}
                              </span>
                            </div>
                          )}

                          {/* Mission Tags */}
                          {task.tags && parseTagsToArray(task.tags).length > 0 && (
                            <div className="flex items-center gap-2">
                              <Tag size={14} className="text-gray-600" />
                              <div className="flex gap-1">
                                {parseTagsToArray(task.tags).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-0.5 text-xs font-mono bg-gray-800 text-gray-500 border border-gray-700 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mission Deployment Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        taskLists={taskLists}
        editTask={editingTask}
      />
    </>
  );
};

export default TasksTab;