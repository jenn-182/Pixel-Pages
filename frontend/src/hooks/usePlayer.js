import { useState, useEffect, useCallback } from 'react';
import  apiService  from '../services/api';

export const usePlayer = () => {
  const [playerStats, setPlayerStats] = useState({
    username: 'PixelAdventurer',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalNotes: 0,
    totalWords: 0,
    uniqueTags: 0,
    achievementsUnlocked: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayerStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPlayerStats();
      
      // Handle gaming response format
      const stats = response.data || response;
      setPlayerStats(prevStats => ({
        ...prevStats,
        ...stats
      }));
    } catch (err) {
      setError('Failed to fetch player stats');
      console.error('Error fetching player stats:', err);
      
      // Use default stats if API fails
      setPlayerStats(prevStats => ({
        ...prevStats,
        // Keep existing stats or use defaults
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlayerStats = useCallback((newStats) => {
    setPlayerStats(prevStats => ({
      ...prevStats,
      ...newStats
    }));
  }, []);

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  return {
    playerStats,
    setPlayerStats: updatePlayerStats,
    loading,
    error,
    refreshStats: fetchPlayerStats,
  };
};