import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Clock, AlertCircle, Trash2, Edit, Calendar, Tag, FileText, Filter } from 'lucide-react';
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
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all', // all, pending, completed, overdue, dueSoon
    tags: ''
  });

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
    if (filters.status === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filters.status === 'overdue') {
      filtered = filtered.filter(task => task.overdue && !task.completed);
    } else if (filters.status === 'dueSoon') {
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
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
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
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleCreateTaskList = async (taskListData) => {
    try {
      await createTaskList(taskListData);
    } catch (err) {
      console.error('Failed to create task list:', err);
    }
  };

  const handleDeleteTaskList = async (taskListId) => {
    try {
      await deleteTaskList(taskListId);
      if (selectedTaskListId === taskListId) {
        setSelectedTaskListId(null);
      }
    } catch (err) {
      console.error('Failed to delete task list:', err);
    }
  };

  const handleSelectTaskList = (taskListId) => {
    setSelectedTaskListId(taskListId);
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
      case 'high': return <AlertCircle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <CheckSquare size={16} />;
      default: return <Clock size={16} />;
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
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    
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
    if (diffDays <= 1) return '#F59E0B'; // Due soon - yellow
    return '#10B981'; // Future - green
  };

  const parseTagsToArray = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const getTaskListName = (taskListId) => {
    if (!taskListId) return 'General';
    const list = taskLists.find(l => l.id === taskListId);
    return list ? list.name : 'Unknown';
  };

  const getCurrentViewName = () => {
    if (selectedTaskListId === null) return 'General Tasks';
    const list = taskLists.find(l => l.id === selectedTaskListId);
    return list ? list.name : 'Unknown Project';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-white">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400">Error loading tasks: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full">
        {/* Left Sidebar - Task Lists */}
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-mono font-bold text-white flex items-center">
              <CheckSquare className="mr-3" style={{ color: tabColor }} />
              {getCurrentViewName()}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm font-mono text-gray-400">
                {filteredTasks.filter(t => t.completed).length}/{filteredTasks.length} Complete
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border-2 border-gray-600 font-mono font-bold flex items-center gap-2 transition-all duration-200 ${
                  showFilters ? 'bg-gray-700 text-cyan-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Filter size={16} />
                FILTER
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 border-2 border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-mono font-bold flex items-center gap-2"
              >
                <Plus size={16} />
                NEW QUEST
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 border border-gray-600 p-4 space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                {/* Priority Filter */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">PRIORITY</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-600 text-white px-2 py-1 font-mono text-sm"
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">STATUS</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-600 text-white px-2 py-1 font-mono text-sm"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                    <option value="dueSoon">Due Soon</option>
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">TAGS</label>
                  <input
                    type="text"
                    value={filters.tags}
                    onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="work, urgent..."
                    className="w-full bg-gray-900 border border-gray-600 text-white px-2 py-1 font-mono text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          {filteredTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm font-mono text-gray-400">TOTAL</div>
                  <div className="text-xl font-mono font-bold text-white">{filteredTasks.length}</div>
                </div>
                <div>
                  <div className="text-sm font-mono text-gray-400">COMPLETED</div>
                  <div className="text-xl font-mono font-bold text-green-400">
                    {filteredTasks.filter(t => t.completed).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-mono text-gray-400">OVERDUE</div>
                  <div className="text-xl font-mono font-bold text-red-400">
                    {filteredTasks.filter(t => t.overdue && !t.completed).length}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-mono text-gray-400">DUE SOON</div>
                  <div className="text-xl font-mono font-bold text-yellow-400">
                    {filteredTasks.filter(t => t.dueSoon && !t.completed).length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400 font-mono"
              >
                {selectedTaskListId === null 
                  ? "No general tasks yet. Create your first task above!"
                  : `No tasks in "${getCurrentViewName()}" yet. Create your first task above!`
                }
              </motion.div>
            ) : (
              filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-800 border-2 ${
                    task.completed 
                      ? 'border-green-500' 
                      : task.overdue 
                        ? 'border-red-500' 
                        : task.dueSoon 
                          ? 'border-yellow-500' 
                          : 'border-gray-600'
                  } shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}
                  style={{
                    boxShadow: task.completed 
                      ? '0 0 5px rgba(34, 197, 94, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                      : task.overdue
                        ? '0 0 5px rgba(239, 68, 68, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                        : task.dueSoon
                          ? '0 0 5px rgba(245, 158, 11, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
                          : '2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="p-4 space-y-3">
                    {/* Main task row */}
                    <div className="flex items-center gap-3">
                      {/* Completion Checkbox */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-6 h-6 border-2 flex items-center justify-center transition-all duration-200 ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-500 hover:border-cyan-400'
                        }`}
                      >
                        {task.completed && <CheckSquare size={16} />}
                      </button>

                      {/* Priority Indicator */}
                      <div
                        className="p-1"
                        style={{ color: getPriorityColor(task.priority) }}
                        title={`${task.priority} priority`}
                      >
                        {getPriorityIcon(task.priority)}
                      </div>

                      {/* Task Title */}
                      <span
                        className={`flex-1 font-mono ${
                          task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-white'
                        }`}
                      >
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
                        {task.priority.toUpperCase()}
                      </span>

                      {/* Action Buttons */}
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-400 hover:text-blue-300 p-1 transition-colors duration-200"
                        title="Edit task"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors duration-200"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <div className="ml-10 text-gray-300 text-sm font-mono flex items-start gap-2">
                        <FileText size={14} className="mt-0.5 text-gray-500" />
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.description}
                        </span>
                      </div>
                    )}

                    {/* Due Date & Tags Row */}
                    {(task.dueDate || (task.tags && task.tags.length > 0)) && (
                      <div className="ml-10 flex items-center gap-4 text-sm">
                        {/* Due Date */}
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

                        {/* Tags */}
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
          </div>
        </div>
      </div>

      {/* Task Modal */}
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