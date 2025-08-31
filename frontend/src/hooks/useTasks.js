import { useState, useEffect } from 'react';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8080/api/tasks';
  const TASK_LISTS_API = 'http://localhost:8080/api/task-lists';

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?username=user`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch task lists
  const fetchTaskLists = async () => {
    try {
      const response = await fetch(`${TASK_LISTS_API}?username=user`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task lists');
      }
      
      const data = await response.json();
      setTaskLists(data);
    } catch (err) {
      console.error('Failed to fetch task lists:', err);
    }
  };

  // Create new task with enhanced fields
  const createTask = async (taskData) => {
    try {
      // Format due date for backend if provided
      const formattedTask = {
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null
      };

      const response = await fetch(`${API_BASE}?username=user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update task with enhanced fields
  const updateTask = async (taskId, updates) => {
    try {
      // Format due date for backend if provided
      const formattedUpdates = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : null
      };

      const response = await fetch(`${API_BASE}/${taskId}?username=user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedUpdates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
      return updatedTask;
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/${taskId}?username=user`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err.message);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { ...task, completed: !task.completed });
    }
  };

  // 🆕 NEW METHODS FOR ENHANCED FEATURES

  // Get overdue tasks
  const getOverdueTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/overdue?username=user`);
      if (!response.ok) throw new Error('Failed to fetch overdue tasks');
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch overdue tasks:', err);
      return [];
    }
  };

  // Get tasks due soon
  const getDueSoonTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/due-soon?username=user`);
      if (!response.ok) throw new Error('Failed to fetch due soon tasks');
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch due soon tasks:', err);
      return [];
    }
  };

  // Get tasks by list
  const getTasksByList = async (taskListId = null) => {
    try {
      const url = taskListId 
        ? `${API_BASE}/by-list?username=user&taskListId=${taskListId}`
        : `${API_BASE}/by-list?username=user`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks by list');
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch tasks by list:', err);
      return [];
    }
  };

  // Create task list
  const createTaskList = async (taskListData) => {
    try {
      const response = await fetch(`${TASK_LISTS_API}?username=user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskListData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task list');
      }

      const newTaskList = await response.json();
      setTaskLists(prevLists => [...prevLists, newTaskList]);
      return newTaskList;
    } catch (err) {
      console.error('Failed to create task list:', err);
      throw err;
    }
  };

  // Delete task list
  const deleteTaskList = async (taskListId) => {
    try {
      const response = await fetch(`${TASK_LISTS_API}/${taskListId}?username=user`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task list');
      }

      setTaskLists(prevLists => prevLists.filter(list => list.id !== taskListId));
      // Refresh tasks to show moved tasks
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task list:', err);
      throw err;
    }
  };

  // Utility methods for task analysis
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => t.overdue && !t.completed).length;
    const dueSoon = tasks.filter(t => t.dueSoon && !t.completed).length;
    
    return {
      total,
      completed,
      overdue,
      dueSoon,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // Fetch data on mount
  useEffect(() => {
    fetchTasks();
    fetchTaskLists();
  }, []);

  return {
    // Data
    tasks,
    taskLists,
    loading,
    error,
    
    // Basic CRUD
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    fetchTasks,
    
    // Task Lists
    createTaskList,
    deleteTaskList,
    fetchTaskLists,
    
    // Enhanced queries
    getOverdueTasks,
    getDueSoonTasks,
    getTasksByList,
    
    // Utilities
    getTaskStats,
  };
};

export default useTasks;