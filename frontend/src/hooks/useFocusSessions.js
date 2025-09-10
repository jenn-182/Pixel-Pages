import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useFocusSessions = (username) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load sessions
  const loadSessions = useCallback(async (options = {}) => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getFocusSessions(username, options);
      setSessions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading focus sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Create session
  const createSession = async (sessionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newSession = await apiService.createFocusSession({
        ...sessionData,
        ownerUsername: username
      });
      
      // Add to local state
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      setError(err.message);
      console.error('Error creating focus session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update session
  const updateSession = async (sessionId, sessionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedSession = await apiService.updateFocusSession(sessionId, sessionData);
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? updatedSession : session
      ));
      
      return updatedSession;
    } catch (err) {
      setError(err.message);
      console.error('Error updating focus session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete (deactivate) session
  const deleteSession = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.deleteFocusSession(sessionId);
      
      // Update local state (mark as inactive)
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, isActive: false } : session
      ));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting focus session:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get session by ID
  const getSession = useCallback((sessionId) => {
    return sessions.find(session => session.id === sessionId);
  }, [sessions]);

  // Filter sessions
  const getActiveSessions = useCallback(() => {
    return sessions.filter(session => session.isActive);
  }, [sessions]);

  const getSessionsByCategory = useCallback((category) => {
    return sessions.filter(session => session.category === category);
  }, [sessions]);

  // Load sessions on mount
  useEffect(() => {
    if (username) {
      loadSessions();
    }
  }, [username, loadSessions]);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    getActiveSessions,
    getSessionsByCategory,
    refreshSessions: loadSessions
  };
};

// Add default export for backward compatibility
export default useFocusSessions;