import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    locked: 0
  });

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAchievements();
      
      // Handle gaming response format
      const achievementData = response.data || response;
      setAchievements(achievementData);
      
      if (response.summary) {
        setSummary(response.summary);
      } else {
        // Calculate summary from data
        const completed = achievementData.filter(a => a.isCompleted).length;
        const inProgress = achievementData.filter(a => a.progress > 0 && !a.isCompleted).length;
        setSummary({
          total: achievementData.length,
          completed,
          inProgress,
          locked: achievementData.length - completed - inProgress
        });
      }
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    summary,
    loading,
    error,
    refreshAchievements: fetchAchievements,
  };
};