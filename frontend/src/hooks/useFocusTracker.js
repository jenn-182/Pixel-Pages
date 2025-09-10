import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useFocusTracker = (username) => {
  const [trackerData, setTrackerData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [streaks, setStreaks] = useState({ currentStreak: 0, bestStreak: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load today's tracker data
  const loadTodayTracker = useCallback(async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await apiService.getDailyFocusTracker(username, today);
      setTrackerData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading today tracker:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Load analytics for a period
  const loadAnalytics = useCallback(async (period = 'week') => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getFocusAnalytics(username, period);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Load streak data
  const loadStreaks = useCallback(async () => {
    if (!username) return;
    
    try {
      const data = await apiService.getFocusStreaks(username);
      setStreaks(data);
    } catch (err) {
      console.error('Error loading streaks:', err);
    }
  }, [username]);

  // Load dashboard data (combines multiple data sources)
  const loadDashboard = useCallback(async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getFocusDashboard(username);
      setTrackerData(data.today);
      setAnalytics(data.weekAnalytics);
      setStreaks({
        currentStreak: data.currentStreak,
        bestStreak: data.bestStreak
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Generate daily stats
  const generateDailyStats = useCallback(async (date = null) => {
    if (!username) return;
    
    try {
      const data = await apiService.generateDailyFocusStats(username, date);
      if (!date || date === new Date().toISOString().split('T')[0]) {
        setTrackerData(data);
      }
      return data;
    } catch (err) {
      console.error('Error generating daily stats:', err);
      throw err;
    }
  }, [username]);

  // Update daily goal
  const updateDailyGoal = useCallback(async (date, goalMet) => {
    if (!username) return;
    
    try {
      await apiService.updateDailyGoal(username, date, goalMet);
      // Refresh today's data if updating today
      if (date === new Date().toISOString().split('T')[0]) {
        await loadTodayTracker();
      }
    } catch (err) {
      console.error('Error updating daily goal:', err);
      throw err;
    }
  }, [username, loadTodayTracker]);

  // Get tracker range
  const getTrackerRange = useCallback(async (startDate, endDate) => {
    if (!username) return [];
    
    try {
      return await apiService.getFocusTrackerRange(username, startDate, endDate);
    } catch (err) {
      console.error('Error getting tracker range:', err);
      return [];
    }
  }, [username]);

  // Get recent tracker data
  const getRecentTracker = useCallback(async (days = 7) => {
    if (!username) return [];
    
    try {
      return await apiService.getRecentFocusTracker(username, days);
    } catch (err) {
      console.error('Error getting recent tracker:', err);
      return [];
    }
  }, [username]);

  // Auto-refresh today's stats when focus entries are created
  const refreshTodayStats = useCallback(() => {
    generateDailyStats();
  }, [generateDailyStats]);

  // Load initial data
  useEffect(() => {
    if (username) {
      loadDashboard();
    }
  }, [username, loadDashboard]);

  return {
    trackerData,
    analytics,
    streaks,
    loading,
    error,
    loadTodayTracker,
    loadAnalytics,
    loadStreaks,
    loadDashboard,
    generateDailyStats,
    updateDailyGoal,
    getTrackerRange,
    getRecentTracker,
    refreshTodayStats
  };
};

// Add default export for backward compatibility
export default useFocusTracker;