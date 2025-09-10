import { useState, useEffect, useRef } from 'react';

export const useFocusTimer = (username) => {
  // Timer state
  const [duration, setDuration] = useState(null); // 25, 90, or custom minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  
  // UI state
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  
  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer completed naturally
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, timeRemaining]);

  // Start timer with duration
  const startTimer = (minutes) => {
    console.log(`🎮 Starting ${minutes}-minute focus session`);
    
    const seconds = minutes * 60;
    setDuration(minutes);
    setTimeRemaining(seconds);
    setStartTime(new Date());
    setIsRunning(true);
    setIsPaused(false);
    setTotalTimeSpent(0);
    
    // Create session data for potential saving
    const sessionId = Date.now();
    setSessionData({
      sessionId,
      ownerUsername: username,
      startTime: new Date(),
      duration: minutes
    });
  };

  // Pause timer
  const pauseTimer = () => {
    console.log('⏸️ Timer paused');
    setIsPaused(true);
  };

  // Resume timer
  const resumeTimer = () => {
    console.log('▶️ Timer resumed');
    setIsPaused(false);
  };

  // Stop timer manually
  const stopTimer = () => {
    console.log('🛑 Timer stopped manually');
    handleTimerStop();
  };

  // Handle manual stop
  const handleTimerStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Calculate time spent
    const timeSpentMinutes = Math.ceil((duration * 60 - timeRemaining) / 60);
    
    if (timeSpentMinutes > 0) {
      // Show save prompt for partial time
      const updatedSessionData = {
        ...sessionData,
        endTime: new Date(),
        timeSpent: timeSpentMinutes,
        completed: false,
        notes: `Session stopped manually after ${timeSpentMinutes} minutes`
      };
      
      setSessionData(updatedSessionData);
      setTotalTimeSpent(timeSpentMinutes);
      setShowSavePrompt(true);
    } else {
      // No time to save
      resetTimer();
    }
  };

  // Handle natural completion
  const handleTimerComplete = () => {
    console.log('✅ Timer completed naturally');
    setIsRunning(false);
    setIsPaused(false);
    
    const updatedSessionData = {
      ...sessionData,
      endTime: new Date(),
      timeSpent: duration,
      completed: true,
      notes: `Completed ${duration}-minute focus session`
    };
    
    setSessionData(updatedSessionData);
    setTotalTimeSpent(duration);
    setShowSavePrompt(true);
  };

  // Save session to tracker - simplified API call
  const saveSession = async (category) => {
    try {
      console.log(`💾 Saving ${totalTimeSpent} minutes to category: ${category}`);
      
      const entryData = {
        sessionId: sessionData.sessionId,
        ownerUsername: username,
        timeSpent: totalTimeSpent,
        date: new Date().toISOString().split('T')[0],
        startTime: sessionData.startTime.toISOString(),
        endTime: sessionData.endTime.toISOString(),
        completed: sessionData.completed,
        notes: sessionData.notes,
        category: category,
        phase: 'work',
        cycleNumber: 1,
        isManualEntry: false
      };

      // Direct API call
      const response = await fetch('http://localhost:8080/api/focus/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData)
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      console.log('✅ Session saved successfully');
      
      // Show success message
      alert(`🎮 +${totalTimeSpent} XP added to ${category}!`);
      
      resetTimer();
      
    } catch (error) {
      console.error('❌ Error saving session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  // Discard session
  const discardSession = () => {
    console.log('🗑️ Session discarded');
    resetTimer();
  };

  // Reset timer state
  const resetTimer = () => {
    setDuration(null);
    setTimeRemaining(0);
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setTotalTimeSpent(0);
    setSessionData(null);
    setShowSavePrompt(false);
    clearInterval(intervalRef.current);
  };

  // Format time display
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = duration && timeRemaining >= 0 ? 
    ((duration * 60 - timeRemaining) / (duration * 60)) * 100 : 0;

  // Check if timer is active (running or paused)
  const isActive = duration !== null;

  return {
    // Timer state
    duration,
    timeRemaining,
    isRunning,
    isPaused,
    isActive,
    totalTimeSpent,
    progress,
    
    // UI state
    showSavePrompt,
    sessionData,
    
    // Actions
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    saveSession,
    discardSession,
    resetTimer,
    formatTime,
    
    // Cleanup
    setShowSavePrompt
  };
};