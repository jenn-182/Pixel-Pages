import { useState, useEffect } from 'react';

const useTaskLists = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8080/api/task-lists';

  // Fetch all task lists
  const fetchTaskLists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?username=Jroc_182`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task lists');
      }
      
      const data = await response.json();
      setTaskLists(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch task lists:', err);
      setError(err.message);
      // set some mock data here
      setTaskLists([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new task list
  const createTaskList = async (taskListData) => {
    try {
      const response = await fetch(`${API_BASE}?username=Jroc_182`, {
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

  // Update task list
  const updateTaskList = async (taskListId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/${taskListId}?username=Jroc_182`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task list');
      }

      const updatedTaskList = await response.json();
      setTaskLists(prevLists =>
        prevLists.map(list =>
          list.id === taskListId ? updatedTaskList : list
        )
      );
      return updatedTaskList;
    } catch (err) {
      console.error('Failed to update task list:', err);
      throw err;
    }
  };

  // Delete task list
  const deleteTaskList = async (taskListId) => {
    try {
      const response = await fetch(`${API_BASE}/${taskListId}?username=Jroc_182`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task list');
      }

      setTaskLists(prevLists => prevLists.filter(list => list.id !== taskListId));
    } catch (err) {
      console.error('Failed to delete task list:', err);
      throw err;
    }
  };

  // Get task list by ID
  const getTaskListById = (taskListId) => {
    return taskLists.find(list => list.id === taskListId);
  };

  // Fetch data on mount
  useEffect(() => {
    fetchTaskLists();
  }, []);

  return {
    taskLists,
    loading,
    error,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    getTaskListById,
    fetchTaskLists,
    refetch: fetchTaskLists
  };
};

export default useTaskLists;