import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Clock, AlertTriangle, Trash2, Edit, Calendar, Tag, FileText, Filter, BarChart3, Check } from 'lucide-react';
import useTasks from '../../hooks/useTasks';
import TaskModal from '../modals/TaskModal';
import TaskListManager from '../tasks/TaskListManager';
import TaskSearch from '../tasks/TaskSearch';
import TaskInsights from '../tasks/TaskInsights';

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
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all', // all, active, completed, overdue, urgent
    tags: ''
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showInsights, setShowInsights] = useState(false);

  // Filter tasks based on selected list and filters
  useEffect(() => {
    let filtered = selectedTaskListId === null 
      ? tasks.filter(task => !task.taskListId)
      : tasks.filter(task => task.taskListId === selectedTaskListId);

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filters.status === 'overdue') {
      filtered = filtered.filter(task => task.overdue && !task.completed);
    } else if (filters.status === 'urgent') {
      filtered = filtered.filter(task => task.dueSoon && !task.completed);
    }

    // Apply tags filter
    if (filters.tags.trim()) {
      const searchTags = filters.tags.toLowerCase().split(',').map(tag => tag.trim());
      filtered = filtered.filter(task => {
        if (!task.tags) return false;
        const taskTags = task.tags.toLowerCase().split(',').map(tag => tag.trim());
        return searchTags.some(searchTag => 
          taskTags.some(taskTag => taskTag.includes(searchTag))
        );
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, selectedTaskListId, filters]);

  const handleCreateTask = async (taskData) => {
    try {
      // Set the task list ID if one is selected
      const taskWithList = {
        ...taskData,
        taskListId: selectedTaskListId
      };
      await createTask(taskWithList);
    } catch (err) {
      console.error('Failed to deploy mission:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
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

  const handleModalSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
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
    setSelectedTaskListId(taskListId);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'markAllComplete':
        // Complete all active missions
        searchResults.forEach(task => {
          if (!task.completed) {
            handleToggleTask(task.id);
          }
        });
        break;
      case 'deleteCompleted':
        // Archive all completed missions
        const completedTasks = filteredTasks.filter(t => t.completed);
        completedTasks.forEach(task => {
          handleDeleteTask(task.id);
        });
        break;
      case 'addToProject':
        // Bulk assign to operation
        console.log('Bulk assign to operation');
        break;
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
      default: return 'LOW';
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
    
    if (diffDays < 0) return '#EF4444'; // Overdue - red
    if (diffDays <= 1) return '#F59E0B'; // Urgent - yellow
    return '#10B981'; // On track - green
  };

  const parseTagsToArray = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const getTaskListName = (taskListId) => {
    if (!taskListId) return 'General Missions';
    const list = taskLists.find(l => l.id === taskListId);
    return list ? list.name : 'Unknown Operation';
  };

  const getCurrentViewName = () => {
    if (selectedTaskListId === null) return 'General Missions';
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
        {/* Left Sidebar - Operations */}
        <div className="w-80 p-4 border-r border-gray-600">
          <TaskListManager
            taskLists={taskLists}
            onCreateTaskList={handleCreateTaskList}
            onDeleteTaskList={handleDeleteTaskList}
            onSelectTaskList={handleSelectTaskList}
            selectedTaskListId={selectedTaskListId}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div 
                className="w-6 h-6 border border-gray-600" 
                style={{ backgroundColor: tabColor }}
              />
              PLAYER MISSIONS
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Active player missions and operation tracking terminal.
            </p>
          </div>

          {/* Mission Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-mono font-bold text-white flex items-center">
                {getCurrentViewName()}
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm font-mono text-gray-400">
                  {filteredTasks.filter(t => t.completed).length}/{filteredTasks.length} MISSIONS COMPLETE
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold ${
                    showFilters ? 'text-cyan-300' : 'text-cyan-400'
                  }`}
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span>FILTER</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>NEW MISSION</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
                <button
                  onClick={() => setShowInsights(!showInsights)}
                  className={`bg-gray-900 border-2 border-cyan-400 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold ${
                    showInsights ? 'text-purple-300' : 'text-cyan-400'
                  }`}
                  style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    <span>INSIGHT</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative space-y-4"
              style={{
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
              
              {/* Advanced Search */}
              <TaskSearch 
                tasks={filteredTasks}
                onFilteredResults={handleSearchResults}
                onQuickAction={handleQuickAction}
              />
              
              {/* Mission filters */}
              <div className="bg-gray-900 border border-cyan-400 p-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Priority Filter */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">MISSION PRIORITY</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">HIGH PRIORITY</option>
                      <option value="medium">MEDIUM PRIORITY</option>
                      <option value="low">LOW PRIORITY</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">MISSION STATUS</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2">MISSION TAGS</label>
                    <input
                      type="text"
                      value={filters.tags}
                      onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="to-do, ideas, work..."
                      className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    />
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
            className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative space-y-3"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
            
            <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
              ACTIVE MISSIONS
              <span className="ml-3 text-sm text-cyan-400">
                [{filteredTasks.filter(task => !task.completed).length}]
              </span>
            </h3>

            {(searchResults.length > 0 ? searchResults : filteredTasks).filter(task => !task.completed).length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-mono">
                {selectedTaskListId === null 
                  ? "No active missions. Deploy your first mission above!"
                  : `No active missions in "${getCurrentViewName()}" operation. Deploy your first mission above!`
                }
              </div>
            ) : (
              (searchResults.length > 0 ? searchResults : filteredTasks)
                .filter(task => !task.completed)
                .map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-900 border-2 p-4 transition-all duration-200 ${
                    task.overdue 
                      ? 'border-red-500' 
                      : task.dueSoon 
                        ? 'border-yellow-500' 
                        : 'border-cyan-400'
                  }`}
                  style={{
                    boxShadow: task.overdue
                      ? '0 0 10px rgba(239, 68, 68, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                      : task.dueSoon
                        ? '0 0 10px rgba(245, 158, 11, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                        : '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="space-y-3">
                    {/* Main mission row */}
                    <div className="flex items-center gap-3">
                      {/* Completion Status */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="w-6 h-6 border-2 border-gray-500 hover:border-cyan-400 flex items-center justify-center transition-all duration-200"
                        title="Mark as Complete"
                      >
                      </button>

                      {/* Mission Title */}
                      <span className="flex-1 font-mono text-white">
                        {task.title}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className="px-2 py-1 text-xs font-mono font-bold border"
                        style={{
                          color: getPriorityColor(task.priority),
                          borderColor: getPriorityColor(task.priority),
                          backgroundColor: `${getPriorityColor(task.priority)}20`
                        }}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>

                      {/* Action Buttons */}
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-400 hover:text-blue-300 p-1 transition-colors duration-200"
                        title="Modify mission"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors duration-200"
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
                                  className="px-2 py-0.5 text-xs font-mono bg-gray-700 text-gray-300 border border-gray-600"
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
          </motion.div>

          {/* Completed Missions List */}
          {filteredTasks.filter(task => task.completed).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative space-y-3"
              style={{
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
              
              <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                COMPLETED MISSIONS
                <span className="ml-3 text-sm text-cyan-400">
                  [{filteredTasks.filter(task => task.completed).length}]
                </span>
              </h3>

              {filteredTasks.filter(task => task.completed).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 border-2 border-cyan-400 p-4 transition-all duration-200"
                  style={{
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="space-y-3">
                    {/* Main mission row */}
                    <div className="flex items-center gap-3">
                      {/* Completion Status */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="w-6 h-6 border-2 bg-cyan-500 border-cyan-500 text-white flex items-center justify-center transition-all duration-200"
                        title="Mission Complete - Click to reactivate"
                      >
                        <Check size={16} />
                      </button>

                      {/* Mission Title */}
                      <span className="flex-1 font-mono text-gray-400 line-through">
                        {task.title}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className="px-2 py-1 text-xs font-mono font-bold border opacity-60"
                        style={{
                          color: getPriorityColor(task.priority),
                          borderColor: getPriorityColor(task.priority),
                          backgroundColor: `${getPriorityColor(task.priority)}15`
                        }}
                      >
                        {getPriorityLabel(task.priority)}
                      </span>

                      {/* Action Buttons */}
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-400 hover:text-blue-300 p-1 transition-colors duration-200 opacity-60 hover:opacity-100"
                        title="Modify mission"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors duration-200 opacity-60 hover:opacity-100"
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
                                  className="px-2 py-0.5 text-xs font-mono bg-gray-800 text-gray-500 border border-gray-700"
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
            </motion.div>
          )}

          {/* Mission Intelligence Dashboard */}
          {showInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TaskInsights tasks={tasks} taskLists={taskLists} />
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