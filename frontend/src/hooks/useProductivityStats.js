import { useState, useEffect } from 'react';
import useFocusSessions from './useFocusSessions';

const useProductivityStats = () => {
  const [stats, setStats] = useState({
    totalTime: 0,
    todayTime: 0,
    weekTime: 0,
    monthTime: 0,
    sessionBreakdown: [],
    dailyStats: [],
    streakCount: 0,
    avgSessionLength: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);

  const { getAllLogs, sessions } = useFocusSessions();

  const calculateStats = () => {
    try {
      setLoading(true);
      const logs = getAllLogs();
      console.log('Raw logs from getAllLogs():', logs); // DEBUG
    
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // "2025-09-06"
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      console.log('Date calculations:', { today, weekAgo, monthAgo }); // DEBUG

      // Calculate total time
      const totalTime = logs.reduce((sum, log) => sum + log.timeSpent, 0);
      console.log('Total time:', totalTime); // DEBUG

      // Calculate today's time - FIXED
      const todayTime = logs
        .filter(log => {
          const logDate = new Date(log.date).toISOString().split('T')[0];
          const isToday = logDate === today; // FIXED: Use === instead of >=
          console.log(`Checking log: ${logDate} === ${today} = ${isToday}, timeSpent: ${log.timeSpent}`); // DEBUG
          return isToday;
        })
        .reduce((sum, log) => sum + log.timeSpent, 0);

      console.log('Today time calculated:', todayTime); // DEBUG

      // Calculate week time - FIXED
      const weekTime = logs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= weekAgo;
        })
        .reduce((sum, log) => sum + log.timeSpent, 0);

      // Calculate month time - FIXED  
      const monthTime = logs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= monthAgo;
        })
        .reduce((sum, log) => sum + log.timeSpent, 0);

      // Calculate session breakdown
      const sessionBreakdown = sessions.map(session => {
        const sessionLogs = logs.filter(log => log.sessionId === session.id);
        const sessionTime = sessionLogs.reduce((sum, log) => sum + log.timeSpent, 0);
        const sessionCount = sessionLogs.length;
        
        return {
          id: session.id,
          name: session.name,
          colorCode: session.colorCode,
          tag: session.tag,
          totalTime: sessionTime,
          sessionCount,
          averageTime: sessionCount > 0 ? Math.round(sessionTime / sessionCount) : 0,
          lastActive: sessionLogs.length > 0 
            ? new Date(Math.max(...sessionLogs.map(log => new Date(log.date))))
            : null
        };
      }).sort((a, b) => b.totalTime - a.totalTime);

      // Calculate daily stats for the last 30 days
      const dailyStats = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date);
        const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        
        const dayLogs = logs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= dayStart && logDate < dayEnd;
        });

        const dayTime = dayLogs.reduce((sum, log) => sum + log.timeSpent, 0);
        
        dailyStats.push({
          date: date.toISOString().split('T')[0],
          time: dayTime,
          sessions: dayLogs.length
        });
      }

      // Calculate streak (consecutive days with at least 1 session)
      let streakCount = 0;
      let checkDate = new Date(now); 
      
      while (true) {
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
        
        const hasActivity = logs.some(log => {
          const logDate = new Date(log.date);
          return logDate >= dayStart && logDate < dayEnd;
        });

        if (hasActivity) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate average session length
      const avgSessionLength = logs.length > 0 
        ? Math.round(totalTime / logs.length) 
        : 0;

      setStats({
        totalTime,
        todayTime,
        weekTime,
        monthTime,
        sessionBreakdown,
        dailyStats,
        streakCount,
        avgSessionLength,
        totalSessions: logs.length
      });

    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get time spent in a specific period
  const getTimeInPeriod = (period) => {
    const logs = getAllLogs();
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return 0;
    }

    return logs
      .filter(log => new Date(log.date) >= startDate)
      .reduce((sum, log) => sum + log.timeSpent, 0);
  };

  // Get session stats for a specific session
  const getSessionStats = (sessionId) => {
    const logs = getAllLogs().filter(log => log.sessionId === sessionId);
    const totalTime = logs.reduce((sum, log) => sum + log.timeSpent, 0);
    
    return {
      totalTime,
      sessionCount: logs.length,
      averageTime: logs.length > 0 ? Math.round(totalTime / logs.length) : 0,
      lastActive: logs.length > 0 
        ? new Date(Math.max(...logs.map(log => new Date(log.date))))
        : null
    };
  };

  // Format time for display
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  useEffect(() => {
    calculateStats();
  }, [sessions]);

  return {
    stats,
    loading,
    calculateStats,
    formatTime,
    getAllLogs: () => {
      try {
        return JSON.parse(localStorage.getItem('pixelPages_focusLogs') || '[]');
      } catch (error) {
        console.error('Error getting logs:', error);
        return [];
      }
    }
  };
};

export default useProductivityStats;