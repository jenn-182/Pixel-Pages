import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/api';

export const useFocusTimer = (username) => {
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('work');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Reset timer state - moved up to avoid dependency issues
  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setActiveSession(null);
    setTimeRemaining(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('work');
    setCurrentCycle(1);
    setStartTime(null);
    setTotalTimeSpent(0);
    startTimeRef.current = null;
    console.log('🔄 Timer reset');
  }, []);

  // Handle phase completion
  const handlePhaseComplete = useCallback(async () => {
    if (!activeSession || !username) return;
    
    try {
      const phaseStartTime = startTimeRef.current || startTime;
      if (!phaseStartTime) {
        console.error('❌ No start time recorded');
        return;
      }
      
      const endTime = new Date();
      const timeSpentMinutes = Math.round((endTime - phaseStartTime) / 1000 / 60);
      
      console.log('🎯 Phase completed:', {
        phase: currentPhase,
        timeSpent: timeSpentMinutes,
        sessionId: activeSession.id,
        startTime: phaseStartTime.toISOString(),
        endTime: endTime.toISOString()
      });
      
      // Save completed phase to backend
      if (timeSpentMinutes > 0) {
        const entryData = {
          sessionId: activeSession.id,
          ownerUsername: username,
          timeSpent: timeSpentMinutes,
          date: new Date().toISOString().split('T')[0],
          startTime: phaseStartTime.toISOString(),
          endTime: endTime.toISOString(),
          completed: true,
          phase: currentPhase,
          cycleNumber: currentCycle
        };
        
        console.log('💾 Saving focus entry:', entryData);
        
        try {
          await apiService.createFocusEntry(entryData);
          console.log('✅ Focus entry saved successfully');
        } catch (apiError) {
          console.error('❌ API Error saving entry:', apiError);
          console.error('Entry data that failed:', entryData);
        }
      }
      
      // Update total time
      setTotalTimeSpent(prev => prev + timeSpentMinutes);
      
      // Determine next phase
      if (currentPhase === 'work') {
        if (currentCycle >= activeSession.cycles) {
          // Session complete
          console.log('🎉 Session completed!');
          resetTimer();
          return;
        } else {
          // Go to break
          const nextPhase = currentCycle % 4 === 0 ? 'long_break' : 'break';
          const nextDuration = nextPhase === 'long_break' ? 15 : activeSession.breakDuration;
          
          setCurrentPhase(nextPhase);
          setTimeRemaining(nextDuration * 60);
          setStartTime(new Date());
          startTimeRef.current = new Date();
          
          console.log('➡️ Moving to break phase:', { nextPhase, nextDuration });
        }
      } else {
        // Break finished, go to work
        const nextCycle = currentCycle + 1;
        setCurrentPhase('work');
        setCurrentCycle(nextCycle);
        setTimeRemaining(activeSession.workDuration * 60);
        setStartTime(new Date());
        startTimeRef.current = new Date();
        
        console.log('➡️ Moving to work phase:', { nextCycle });
      }
      
    } catch (err) {
      console.error('❌ Error handling phase complete:', err);
    }
  }, [activeSession, username, startTime, currentPhase, currentCycle, resetTimer]);

  // Start session
  const startSession = useCallback(async (session) => {
    if (!session || !username) return;
    
    try {
      console.log('🚀 Starting focus session:', session.name);
      
      const now = new Date();
      setActiveSession(session);
      setTimeRemaining(session.workDuration * 60);
      setCurrentPhase('work');
      setCurrentCycle(1);
      setTotalTimeSpent(0);
      setIsRunning(true);
      setIsPaused(false);
      setStartTime(now);
      startTimeRef.current = now;
      
      console.log('⏰ Timer set for:', session.workDuration, 'minutes');
      console.log('📅 Start time:', now.toISOString());
      
      // Start the timer
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            console.log('⏰ Time reached zero, triggering phase complete');
            handlePhaseComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error starting session:', err);
    }
  }, [username, handlePhaseComplete]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (!activeSession) return;
    
    if (isRunning && !isPaused) {
      clearInterval(intervalRef.current);
      setIsPaused(true);
      console.log('⏸️ Timer paused');
    } else if (isRunning && isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handlePhaseComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      setIsPaused(false);
      console.log('▶️ Timer resumed');
    }
  }, [activeSession, isRunning, isPaused, handlePhaseComplete]);

  // Stop session and save progress
  const stopSession = useCallback(async () => {
    if (!activeSession || !username) return;
    
    try {
      clearInterval(intervalRef.current);
      console.log('🛑 Stopping session...');
      
      const phaseStartTime = startTimeRef.current || startTime;
      if (!phaseStartTime) {
        console.error('❌ No start time recorded for manual stop');
        resetTimer();
        return;
      }
      
      const endTime = new Date();
      const timeSpentMinutes = Math.round((endTime - phaseStartTime) / 1000 / 60);
      
      console.log('📊 Manual stop - Time calculation:', {
        startTime: phaseStartTime.toISOString(),
        endTime: endTime.toISOString(),
        minutesSpent: timeSpentMinutes
      });
      
      // Always save entry, even if 0 minutes (for tracking purposes)
      const entryData = {
        sessionId: activeSession.id,
        ownerUsername: username,
        timeSpent: Math.max(timeSpentMinutes, 1), // Minimum 1 minute for manual stops
        date: new Date().toISOString().split('T')[0],
        startTime: phaseStartTime.toISOString(),
        endTime: endTime.toISOString(),
        completed: false, // Manually stopped
        phase: currentPhase,
        cycleNumber: currentCycle,
        notes: `Session stopped manually after ${Math.max(timeSpentMinutes, 1)} minutes`
      };
      
      console.log('💾 Saving manual stop entry:', entryData);
      
      try {
        await apiService.createFocusEntry(entryData);
        console.log('✅ Manual stop entry saved successfully');
      } catch (apiError) {
        console.error('❌ API Error saving manual stop:', apiError);
        console.error('Failed entry data:', entryData);
      }
      
      resetTimer();
      
    } catch (err) {
      console.error('❌ Error stopping session:', err);
    }
  }, [activeSession, username, startTime, currentPhase, currentCycle, resetTimer]);

  // Format time display
  const formatTime = useCallback((seconds = timeRemaining) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Calculate progress
  const progress = activeSession && timeRemaining > 0 ? 
    (((activeSession.workDuration * 60) - timeRemaining) / (activeSession.workDuration * 60)) * 100 : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    activeSession,
    timeRemaining,
    isRunning,
    isPaused,
    currentPhase,
    currentCycle,
    totalTimeSpent,
    startSession,
    stopSession,
    togglePause,
    resetTimer,
    formatTime,
    progress
  };
};

export default useFocusTimer;