import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Timer, Clock, Coffee, Brain, Zap, Target, BookOpen, Code } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import CircularProgress from '../focus/CircularProgress';
import SaveSessionModal from '../modals/SaveSessionModal';

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

  // Quick Start Templates
  const quickStartTemplates = [
    {
      id: 'pomodoro',
      name: 'POMODORO',
      description: '25min + 5min break',
      duration: 25,
      icon: Target,
      color: '#EF4444',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 'deep-work',
      name: 'DEEP WORK',
      description: '90min focused work',
      duration: 90,
      icon: Brain,
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'quick-focus',
      name: 'QUICK FOCUS',
      description: '15min sprint',
      duration: 15,
      icon: Zap,
      color: '#F59E0B',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'micro-break',
      name: 'MICRO BREAK',
      description: '5min recharge',
      duration: 5,
      icon: Coffee,
      color: '#10B981',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'study-block',
      name: 'STUDY BLOCK',
      description: '45min learning',
      duration: 45,
      icon: BookOpen,
      color: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'code-session',
      name: 'CODE SESSION',
      description: '60min programming',
      duration: 60,
      icon: Code,
      color: '#06B6D4',
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

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

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedDuration(template.duration);
    setShowCustomInput(false);
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

      {/* Quick Start Templates */}
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
            <h3 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={20} style={{ color: tabColor }} />
              QUICK START TEMPLATES
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickStartTemplates.map(template => {
                const IconComponent = template.icon;
                return (
                  <motion.button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gray-900 border-2 p-4 relative overflow-hidden transition-all duration-300 hover:shadow-lg group ${
                      selectedDuration === template.duration
                        ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={{
                      boxShadow: selectedDuration === template.duration 
                        ? `0 0 15px rgba(139, 92, 246, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`
                        : '2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    {/* Gradient Background */}
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${template.gradient}`}
                    />
                    
                    <div className="relative z-10 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center group-hover:border-opacity-80 transition-colors"
                          style={{ 
                            backgroundColor: `${template.color}20`,
                            borderColor: selectedDuration === template.duration ? template.color : '#4B5563'
                          }}
                        >
                          <IconComponent 
                            size={20} 
                            style={{ color: template.color }}
                          />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-sm">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {template.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div 
                          className="inline-block px-2 py-1 text-xs font-mono font-bold border"
                          style={{
                            color: template.color,
                            borderColor: selectedDuration === template.duration ? template.color : '#4B5563',
                            backgroundColor: selectedDuration === template.duration ? `${template.color}20` : 'transparent'
                          }}
                        >
                          {template.duration} MIN
                        </div>
                      </div>
                    </div>

                    {/* Hover effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: template.color }}
                    />
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <div className="text-sm font-mono text-gray-400">
                Click a template to select it, then hit START FOCUS
              </div>
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
        timeSpent={Math.floor(totalTimeSpent / 60)}
        sessionType={duration && timeRemaining <= 0 ? 'session' : 'partial'}
        username={username}
      />
    </div>
  );
};

export default FocusTab;