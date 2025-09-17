import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Timer, Clock, Coffee, Brain, Zap, Target, BookOpen, Code, Star } from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import CircularProgress from '../focus/CircularProgress';
import SaveSessionModal from '../modals/SaveSessionModal';

const FocusTab = ({ username = 'user', tabColor = '#8B5CF6' }) => {
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
    if (!isActive) return { text: 'READY TO START', color: '#6B7280', icon: Timer };
    if (isPaused) return { text: 'PAUSED', color: '#F59E0B', icon: Pause };
    if (isRunning) return { text: 'LEVELING UP SKILLS...', color: tabColor, icon: Play };
    return { text: 'READY', color: '#6B7280', icon: Timer };
  };

  const timerStatus = getTimerStatus();
  const StatusIcon = timerStatus.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md">
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="font-mono text-3xl font-bold text-white mb-2">
              FOCUS ARENA
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Battle distractions and level up your productivity skills!
            </p>
          </div>

          {/* XP Display */}
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-yellow-400 mb-1 flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              {Math.floor(totalTimeSpent / 60)} XP
            </div>
            <div className="text-sm text-gray-400 font-mono">POINTS EARNED</div>
          </div>
        </div>
      </div>

      {/* Main Battle Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg bg-black/40 backdrop-blur-md"
      >
        <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />

        {/* Animated border effects for active timer */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-2 rounded-lg pointer-events-none"
            style={{
              borderColor: isRunning ? '#FFFFFF' : '#F59E0B'
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              boxShadow: isRunning
                ? ['0 0 10px #FFFFFF', '0 0 30px #FFFFFF', '0 0 10px #FFFFFF']
                : ['0 0 10px #F59E0B', '0 0 30px #F59E0B', '0 0 10px #F59E0B']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        <div className="relative z-10 p-6 text-center">
          {/* Epic Timer Display */}
          <div className="mb-6">
            <div className="relative inline-block">
              <CircularProgress
                progress={progress}
                size={isActive ? 400 : 250}
                strokeWidth={isActive ? 24 : 12}
                color={isRunning ? '#FFFFFF' : isPaused ? '#F59E0B' : '#6B7280'}
                backgroundColor="#1F2937"
              >
                <div className="text-center">
                  {/* Main Timer */}
                  <div className={`font-mono font-bold text-white mb-2 tracking-wider ${
                    isActive ? 'text-8xl mb-4' : 'text-4xl'
                  }`}>
                    {isActive ? formatTime() : '00:00'}
                  </div>

                  {/* Duration info */}
                  {duration && (
                    <div className={`font-mono text-gray-400 ${
                      isActive ? 'text-xl mb-3' : 'text-sm mb-2'
                    }`}>
                      / {duration} min mission
                    </div>
                  )}

                  {/* Status with icon */}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`rounded-full animate-pulse ${
                        isActive ? 'w-3 h-3' : 'w-2 h-2'
                      }`}
                      style={{
                        backgroundColor: isRunning ? '#FFFFFF' : isPaused ? '#F59E0B' : '#6B7280'
                      }}
                    />
                    <span
                      className={`font-mono font-bold tracking-wider ${
                        isActive ? 'text-sm' : 'text-xs'
                      }`}
                      style={{
                        color: isRunning ? '#FFFFFF' : isPaused ? '#F59E0B' : '#6B7280'
                      }}
                    >
                      {timerStatus.text}
                    </span>
                    <div
                      className={`rounded-full animate-pulse ${
                        isActive ? 'w-3 h-3' : 'w-2 h-2'
                      }`}
                      style={{
                        backgroundColor: isRunning ? '#FFFFFF' : isPaused ? '#F59E0B' : '#6B7280'
                      }}
                    />
                  </div>
                </div>
              </CircularProgress>

              {/* Floating particles around timer when active */}
              {isRunning && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        originX: 0.5,
                        originY: 0.5,
                      }}
                      animate={{
                        x: [0, Math.cos((i * 60) * Math.PI / 180) * 220],
                        y: [0, Math.sin((i * 60) * Math.PI / 180) * 220],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Mission Selection (when no active timer) */}
          {!isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="text-lg font-mono font-bold text-white mb-4 text-center">
                SELECT FOCUS TIMER
              </div>

              {/* Quick Mission Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { minutes: 25, name: 'POMODORO', color: '#FF1493', icon: Target },
                  { minutes: 90, name: 'DEEP DIVE', color: '#8A2BE2', icon: Brain },
                  { minutes: 15, name: 'QUICK', color: '#FFD700', icon: Zap },
                  { minutes: 60, name: 'MARATHON', color: '#00FFFF', icon: Clock }
                ].map(mission => {
                  const IconComponent = mission.icon;
                  return (
                    <motion.button
                      key={mission.minutes}
                      onClick={() => handleDurationSelect(mission.minutes)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 border-2 border-white rounded-lg transition-all duration-200 font-mono relative overflow-hidden bg-black/20 hover:bg-black/40"
                      style={{
                        boxShadow: selectedDuration === mission.minutes ? `0 0 20px ${mission.color}, 0 0 40px ${mission.color}` : 'none'
                      }}
                    >
                      <div
                        className={`absolute inset-0 transition-all duration-300 ${selectedDuration === mission.minutes
                            ? 'opacity-30'
                            : 'opacity-10 group-hover:opacity-20'
                          }`}
                        style={{
                          background: `linear-gradient(135deg, ${mission.color}40, ${mission.color}20)`
                        }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-1">
                          <IconComponent
                            size={16}
                            style={{ color: mission.color }}
                          />
                        </div>
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: mission.color }}
                        >
                          {mission.name}
                        </div>
                        <div className="text-sm font-bold text-white">{mission.minutes}m</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Mission Input */}
              <div className="mb-4">
                <button
                  onClick={() => handleDurationSelect('custom')}
                  className="w-full p-3 border-2 border-white rounded-lg transition-all duration-200 font-mono bg-black/20 hover:bg-black/40 relative overflow-hidden"
                  style={{
                    boxShadow: selectedDuration === 'custom' ? '0 0 20px #8B5CF6, 0 0 40px #8B5CF6' : 'none'
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transition-all duration-300 ${selectedDuration === 'custom' ? 'opacity-30' : 'opacity-10 hover:opacity-20'
                      }`}
                  />
                  <div className="relative z-10">
                    <div className="text-white font-bold text-sm">CUSTOM FOCUS TIMER</div>
                    <div className="text-xs text-gray-400">Set your own duration</div>
                  </div>
                </button>

                {showCustomInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3"
                  >
                    <div className="flex gap-2 justify-center">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          placeholder="0"
                          value={Math.floor(parseInt(customDuration) / 60) || ''}
                          onChange={(e) => {
                            const hours = parseInt(e.target.value) || 0;
                            const minutes = parseInt(customDuration) % 60 || 0;
                            setCustomDuration((hours * 60 + minutes).toString());
                          }}
                          className="w-16 p-2 bg-black/60 border-2 border-white/30 rounded-lg text-white font-mono text-center focus:border-white focus:outline-none backdrop-blur-sm"
                          min="0"
                          max="4"
                        />
                        <label className="text-xs text-gray-400 mt-1">HR</label>
                      </div>
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          placeholder="25"
                          value={parseInt(customDuration) % 60 || ''}
                          onChange={(e) => {
                            const hours = Math.floor(parseInt(customDuration) / 60) || 0;
                            const minutes = parseInt(e.target.value) || 0;
                            setCustomDuration((hours * 60 + minutes).toString());
                          }}
                          className="w-16 p-2 bg-black/60 border-2 border-white/30 rounded-lg text-white font-mono text-center focus:border-white focus:outline-none backdrop-blur-sm"
                          min="0"
                          max="59"
                        />
                        <label className="text-xs text-gray-400 mt-1">MIN</label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Epic Battle Controls */}
          <div className="flex items-center justify-center gap-6">
            {!isActive ? (
              <motion.button
                onClick={handleStartTimer}
                disabled={!selectedDuration}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white px-8 py-4 rounded-lg relative group cursor-pointer transition-all duration-300 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden bg-black/20 hover:bg-black/40"
                style={{
                  boxShadow: !selectedDuration ? 'none' : '0 0 20px #8B5CF6, 0 0 40px #8B5CF6'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all duration-300" />
                <div className="flex items-center gap-3 relative z-10 text-white">
                  <Play size={24} />
                  <span className="text-lg">BEGIN TIMER</span>
                  <Zap size={24} />
                </div>
              </motion.button>
            ) : (
              <div className="flex gap-4">
                <motion.button
                  onClick={isPaused ? resumeTimer : pauseTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white px-6 py-3 rounded-lg relative group cursor-pointer transition-all duration-300 font-mono font-bold bg-black/20 hover:bg-black/40"
                  style={{
                    boxShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 group-hover:from-cyan-600/40 group-hover:to-blue-600/40 transition-all duration-300" />
                  <div className="flex items-center gap-2 text-white relative z-10">
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={stopTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white px-6 py-3 rounded-lg relative group cursor-pointer transition-all duration-300 font-mono font-bold bg-black/20 hover:bg-black/40"
                  style={{
                    boxShadow: '0 0 20px #FF1493, 0 0 40px #FF1493'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 group-hover:from-red-600/40 group-hover:to-pink-600/40 transition-all duration-300" />
                  <div className="flex items-center gap-2 text-white relative z-10">
                    <Square size={20} />
                    <span>ABORT</span>
                  </div>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

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