import { useState, useEffect, useRef } from 'react';

const useTimer = () => {
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('idle'); // 'idle', 'focus', 'break', 'completed'
  const [initialTime, setInitialTime] = useState(0);
  const intervalRef = useRef(null);

  // Start timer with specified duration (in minutes)
  const startTimer = (duration, timerMode = 'focus') => {
    const seconds = duration * 60;
    setTime(seconds);
    setInitialTime(seconds);
    setMode(timerMode);
    setIsRunning(true);
    setIsPaused(false);
  };

  // Pause/Resume timer
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Stop and reset timer
  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setMode('idle');
    setTime(0);
    setInitialTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Reset timer to initial duration
  const resetTimer = () => {
    setTime(initialTime);
    setIsPaused(false);
    setIsRunning(false);
  };

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setMode('completed');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, time]);

  // Format time for display
  const formatTime = (seconds = time) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (!initialTime) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  // Get elapsed time in minutes
  const getElapsedMinutes = () => {
    return Math.floor((initialTime - time) / 60);
  };

  return {
    time,
    isRunning,
    isPaused,
    mode,
    initialTime,
    startTimer,
    togglePause,
    stopTimer,
    resetTimer,
    formatTime: formatTime(),
    getProgress,
    getElapsedMinutes
  };
};

export default useTimer;