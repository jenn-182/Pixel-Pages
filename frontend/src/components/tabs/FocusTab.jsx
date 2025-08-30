import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Settings, Target } from 'lucide-react';

const FocusTab = ({ tabColor = '#6366F1' }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // focus, break, longBreak
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Handle session completion
      if (sessionType === 'focus') {
        setSessions(sessions + 1);
        // Auto switch to break
        setSessionType('break');
        setTimeLeft(5 * 60); // 5 minute break
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, sessions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionType === 'focus' ? 25 * 60 : 5 * 60);
  };

  const startFocusSession = () => {
    setSessionType('focus');
    setTimeLeft(25 * 60);
    setIsActive(false);
  };

  const startBreakSession = () => {
    setSessionType('break');
    setTimeLeft(5 * 60);
    setIsActive(false);
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'focus': return '#6366F1';
      case 'break': return '#10B981';
      case 'longBreak': return '#8B5CF6';
      default: return '#6366F1';
    }
  };

  return (
    <div className="focus-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          FOCUS COMMAND CENTER
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Neural enhancement protocols and concentration management.
        </p>
      </div>

      {/* Timer Display */}
      <div className="mb-8 text-center">
        <motion.div
          className="mx-auto w-80 h-80 rounded-full border-8 flex items-center justify-center relative"
          style={{ 
            borderColor: getSessionColor(),
            boxShadow: `0 0 30px ${getSessionColor()}40`
          }}
          animate={{
            boxShadow: isActive 
              ? [`0 0 30px ${getSessionColor()}40`, `0 0 50px ${getSessionColor()}80`, `0 0 30px ${getSessionColor()}40`]
              : `0 0 30px ${getSessionColor()}40`
          }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
        >
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xl font-mono text-gray-400 uppercase">
              {sessionType === 'focus' ? 'FOCUS MODE' : 'RECOVERY CYCLE'}
            </div>
          </div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={getSessionColor()}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1 - (timeLeft / (sessionType === 'focus' ? 25 * 60 : 5 * 60))
              }}
              transition={{ duration: 0.5 }}
              style={{ filter: `drop-shadow(0 0 5px ${getSessionColor()})` }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          onClick={toggleTimer}
          className="px-8 py-4 bg-gray-800 border border-gray-600 text-white font-mono font-bold flex items-center gap-3 hover:border-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'PAUSE' : 'ENGAGE'}
        </motion.button>
        
        <motion.button
          onClick={resetTimer}
          className="px-8 py-4 bg-gray-800 border border-gray-600 text-white font-mono font-bold flex items-center gap-3 hover:border-red-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Square size={20} />
          RESET
        </motion.button>
      </div>

      {/* Session Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          onClick={startFocusSession}
          className={`px-6 py-3 border font-mono font-bold ${
            sessionType === 'focus' 
              ? 'bg-indigo-600 border-indigo-500 text-white' 
              : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-indigo-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          FOCUS (25m)
        </motion.button>
        
        <motion.button
          onClick={startBreakSession}
          className={`px-6 py-3 border font-mono font-bold ${
            sessionType === 'break' 
              ? 'bg-green-600 border-green-500 text-white' 
              : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-green-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BREAK (5m)
        </motion.button>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-indigo-400 font-mono">
            {sessions}
          </div>
          <div className="text-sm text-gray-400 font-mono">SESSIONS</div>
        </div>
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {Math.floor(sessions * 25 / 60)}h {(sessions * 25) % 60}m
          </div>
          <div className="text-sm text-gray-400 font-mono">FOCUS TIME</div>
        </div>
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-green-400 font-mono">
            {sessions > 0 ? Math.floor(((sessions * 25) / (sessions * 30)) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-400 font-mono">EFFICIENCY</div>
        </div>
      </div>
    </div>
  );
};

export default FocusTab;