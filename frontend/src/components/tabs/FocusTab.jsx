import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Timer, Clock } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import CircularProgress from '../focus/CircularProgress';
import SaveSessionModal from '../focus/SaveSessionModal';

const FocusTab = ({ username = 'Jroc_182', tabColor = '#8B5CF6' }) => {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const {
    duration,
    timeRemaining,
    isRunning,
    isPaused,
    isActive,
    totalTimeSpent,
    progress,
    showSavePrompt,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    saveSession,
    discardSession,
    formatTime,
    setShowSavePrompt
  } = useFocusTimer(username);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '139, 92, 246';
  };

  const tabColorRgb = hexToRgb(tabColor);

  // Handle duration selection
  const handleDurationSelect = (minutes) => {
    if (minutes === 'custom') {
      setShowCustomInput(true);
      setSelectedDuration('custom');
    } else {
      setSelectedDuration(minutes);
      setShowCustomInput(false);
    }
  };

  // Start timer with selected duration
  const handleStartTimer = () => {
    let finalDuration = selectedDuration;
    
    if (selectedDuration === 'custom') {
      const customMinutes = parseInt(customDuration);
      if (customMinutes && customMinutes > 0) {
        finalDuration = customMinutes;
      } else {
        alert('Please enter a valid duration');
        return;
      }
    }
    
    if (finalDuration) {
      startTimer(finalDuration);
      setSelectedDuration(null);
      setCustomDuration('');
      setShowCustomInput(false);
    }
  };

  // Get timer status display
  const getTimerStatus = () => {
    if (!isActive) return { text: 'READY TO FOCUS', color: '#6B7280', icon: Timer };
    if (isPaused) return { text: 'PAUSED', color: '#F59E0B', icon: Pause };
    if (isRunning) return { text: 'FOCUS MODE ACTIVE', color: tabColor, icon: Play };
    return { text: 'READY', color: '#6B7280', icon: Timer };
  };

  const timerStatus = getTimerStatus();
  const StatusIcon = timerStatus.icon;

  return (
    <div className="focus-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          FOCUS STATION
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Gaming-style focus timer with XP tracking system.
        </p>
      </div>

      {/* Main Timer Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative mb-6"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        
        <div className="relative z-10 text-center">
          {/* Timer Display */}
          <div className="mb-8">
            <CircularProgress
              progress={progress}
              size={220}
              strokeWidth={16}
              color={tabColor}
              backgroundColor="#374151"
            >
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-white mb-2">
                  {isActive ? formatTime() : '00:00'}
                </div>
                {duration && (
                  <div className="text-sm font-mono text-gray-400">
                    / {duration} min
                  </div>
                )}
              </div>
            </CircularProgress>
          </div>

          {/* Timer Status */}
          <div className="flex items-center justify-center gap-2 text-sm font-mono mb-6">
            <StatusIcon size={16} style={{ color: timerStatus.color }} />
            <span style={{ color: timerStatus.color }}>{timerStatus.text}</span>
          </div>

          {/* Duration Selection (when no active timer) */}
          {!isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="text-sm font-mono text-gray-300 mb-4">SELECT DURATION:</div>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[25, 90].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => handleDurationSelect(minutes)}
                    className={`p-4 border-2 transition-all duration-200 font-mono ${
                      selectedDuration === minutes
                        ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-white font-bold">{minutes} MIN</div>
                    <div className="text-xs text-gray-400">
                      {minutes === 25 ? 'Quick Focus' : 'Deep Work'}
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => handleDurationSelect('custom')}
                  className={`p-4 border-2 transition-all duration-200 font-mono ${
                    selectedDuration === 'custom'
                      ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-white font-bold">CUSTOM</div>
                  <div className="text-xs text-gray-400">Set Time</div>
                </button>
              </div>

              {/* Custom Duration Input */}
              {showCustomInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mb-4"
                >
                  <input
                    type="number"
                    placeholder="Enter minutes..."
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-600 text-white font-mono text-center focus:border-purple-400 focus:outline-none"
                    min="1"
                    max="240"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isActive ? (
              <button
                onClick={handleStartTimer}
                disabled={!selectedDuration}
                className="bg-gray-900 border-2 px-8 py-4 relative group cursor-pointer transition-all duration-300 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: tabColor,
                  color: tabColor,
                  boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                }}
              >
                <div className="flex items-center gap-2">
                  <Play size={20} />
                  <span>START FOCUS</span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                     style={{ backgroundColor: tabColor }} />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={isPaused ? resumeTimer : pauseTimer}
                  className="bg-gray-900 border-2 px-6 py-3 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                  style={{
                    borderColor: tabColor,
                    color: tabColor,
                    boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </div>
                </button>

                <button
                  onClick={stopTimer}
                  className="bg-gray-900 border-2 border-red-500 px-6 py-3 relative group cursor-pointer transition-all duration-300 font-mono font-bold text-red-500 hover:bg-red-500 hover:bg-opacity-10"
                >
                  <div className="flex items-center gap-2">
                    <Square size={16} />
                    <span>STOP</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Gaming Stats Preview */}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
          style={{
            borderColor: tabColor,
            boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
          }}
        >
          <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
               style={{ borderColor: tabColor }} />
          
          <div className="relative z-10">
            <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              FOCUS CATEGORIES
            </h3>
            
            <div className="text-center text-gray-400 font-mono text-sm">
              Complete focus sessions to gain XP in different categories.
              <br />
              Track your progress in Study, Work, Code, Create, and more!
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Session Modal */}
      <SaveSessionModal
        isOpen={showSavePrompt}
        onSave={(category) => {
          saveSession(category);
          setShowSavePrompt(false);
        }}
        onDiscard={() => {
          discardSession();
          setShowSavePrompt(false);
        }}
        timeSpent={totalTimeSpent}
        sessionType={duration && timeRemaining <= 0 ? 'session' : 'partial'}
      />
    </div>
  );
};

export default FocusTab;