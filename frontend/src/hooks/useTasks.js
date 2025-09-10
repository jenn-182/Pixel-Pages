import { useState, useEffect } from 'react';
import achievementService from '../services/achievementService';

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

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}?username=user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      // Check achievements after task creation
      setTimeout(() => {
        checkTaskAchievements();
      }, 100);
      
      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/${taskId}?username=user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      
      // Check achievements after task update
      setTimeout(() => {
        checkTaskAchievements();
      }, 100);
      
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
      const updatedTask = { ...task, completed: !task.completed };
      if (updatedTask.completed) {
        updatedTask.completedAt = new Date().toISOString();
      }
      await updateTask(taskId, updatedTask);
    }
  };

  // Get overdue tasks
  const getOverdueTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/overdue?username=user`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch overdue tasks');
      }
      
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
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks due soon');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch tasks due soon:', err);
      return [];
    }
  };

  // Get tasks by list
  const getTasksByList = (taskListId) => {
    return tasks.filter(task => task.taskListId === taskListId);
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

  // Achievement checking
  const checkTaskAchievements = () => {
    const userStats = calculateTaskStats(tasks);
    const newAchievements = achievementService.checkAchievements(userStats);
    
    if (newAchievements.length > 0) {
      console.log(`✅ Task achievements unlocked: ${newAchievements.map(a => a.name).join(', ')}`);
    }
    
    return newAchievements;
  };

  // Helper function for week start
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Helper function for task streak calculation
  const calculateTaskStreak = (completedTasks) => {
    if (completedTasks.length === 0) return 0;
    
    const dates = [...new Set(completedTasks.map(t => new Date(t.completedAt).toDateString()))].sort();
    let streak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return streak;
  };

  const calculateTaskStats = (tasks) => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = getWeekStart(now);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = completedTasks.length;
    const tasksCreated = tasks.length;
    const activeTasks = tasks.filter(task => !task.completed).length;
    
    // Today's completed tasks
    const tasksToday = completedTasks.filter(task => 
      task.completedAt && new Date(task.completedAt).toDateString() === today
    ).length;
    
    // Week tasks
    const tasksThisWeek = completedTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= thisWeek
    ).length;
    
    // Month tasks
    const tasksThisMonth = completedTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= thisMonth
    ).length;
    
    // Priority-based tasks
    const highPriorityTasks = completedTasks.filter(task => 
      task.priority === 'high'
    ).length;
    
    const urgentTasks = completedTasks.filter(task => 
      task.priority === 'urgent'
    ).length;
    
    // Early completions (completed before due date)
    const earlyCompletions = completedTasks.filter(task => {
      if (!task.dueDate || !task.completedAt) return false;
      return new Date(task.completedAt) < new Date(task.dueDate);
    }).length;
    
    // Task categories
    const taskCategories = new Set(tasks.map(task => task.category).filter(Boolean)).size;
    
    // Task streak (simplified)
    const taskStreak = calculateTaskStreak(completedTasks);
    
    // Completion rate
    const completionRate = tasksCreated > 0 ? totalTasks / tasksCreated : 0;
    
    return {
      totalTasks,
      tasksCreated,
      activeTasks,
      completedTasks: totalTasks,
      tasksToday,
      tasksThisWeek,
      tasksThisMonth,
      highPriorityTasks,
      urgentTasks,
      earlyCompletions,
      taskCategories,
      taskStreak,
      completionRate
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