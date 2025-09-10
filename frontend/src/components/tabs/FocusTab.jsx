import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Timer, Coffee, Target, Briefcase, BookOpen, Home, Dumbbell, Palette, FileText } from 'lucide-react';
import { useFocusTimer, useFocusSessions } from '../../hooks'; // Use your working hooks
import SessionCreator from '../focus/SessionCreator';

const FocusTab = ({ username = 'Jroc_182', tabColor = '#8B5CF6' }) => {
  const [isSessionCreatorOpen, setIsSessionCreatorOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Use your working focus system hooks
  const { 
    sessions, 
    loading: sessionsLoading, 
    createSession,
    getActiveSessions 
  } = useFocusSessions(username);

  const {
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
  } = useFocusTimer(username);

  const activeSessions = getActiveSessions();

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '139, 92, 246';
  };

  const tabColorRgb = hexToRgb(tabColor);

  // Quick session presets (integrated with your backend)
  const quickPresets = [
    {
      name: 'POMODORO',
      description: 'Classic 25-minute focus session',
      workDuration: 25,
      breakDuration: 5,
      cycles: 4,
      category: 'WORK',
      colorCode: '#9333ea',
      tag: 'work'
    },
    {
      name: 'DEEP WORK',
      description: 'Extended 90-minute focus session',
      workDuration: 90,
      breakDuration: 20,
      cycles: 1,
      category: 'WORK',
      colorCode: '#7c3aed',
      tag: 'work'
    },
    {
      name: 'QUICK BURST',
      description: 'Short 15-minute burst',
      workDuration: 15,
      breakDuration: 3,
      cycles: 1,
      category: 'WORK',
      colorCode: '#8b5cf6',
      tag: 'personal'
    }
  ];

  // Create and start a quick session
  const createQuickSession = async (preset) => {
    const sessionData = {
      name: preset.name,
      description: preset.description,
      workDuration: preset.workDuration,
      breakDuration: preset.breakDuration,
      cycles: preset.cycles,
      category: preset.category,
      colorCode: preset.colorCode,
      tag: preset.tag
    };
    
    try {
      console.log('🚀 Creating quick session:', sessionData);
      const newSession = await createSession(sessionData);
      startSession(newSession);
    } catch (err) {
      console.error('❌ Error creating quick session:', err);
      alert('Failed to create session. Please try again.');
    }
  };

  // Handle starting a saved session
  const handleStartSavedSession = (session) => {
    console.log('🚀 Starting saved session:', session);
    startSession(session);
  };

  // Session completion handler
  useEffect(() => {
    if (activeSession && !isRunning && !isPaused && totalTimeSpent > 0) {
      setShowCompletionModal(true);
    }
  }, [activeSession, isRunning, isPaused, totalTimeSpent]);

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    resetTimer();
  };

  // Background style based on timer state
  const getBackgroundStyle = () => {
    if (activeSession && isRunning && !isPaused) {
      if (currentPhase === 'work') {
        return {
          background: `linear-gradient(135deg, rgba(${tabColorRgb}, 0.1), rgba(${tabColorRgb}, 0.2))`,
          borderColor: tabColor
        };
      } else {
        return {
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))',
          borderColor: '#22C55E'
        };
      }
    }
    return {
      background: 'linear-gradient(135deg, rgba(75, 85, 99, 0.1), rgba(75, 85, 99, 0.2))',
      borderColor: '#6B7280'
    };
  };

  const getTagInfo = (tagId) => {
    const PREDEFINED_TAGS = [
      { id: 'work', label: 'Work', color: '#3B82F6', icon: Briefcase },
      { id: 'learning', label: 'Learning', color: '#10B981', icon: BookOpen },
      { id: 'personal', label: 'Personal', color: '#8B5CF6', icon: Home },
      { id: 'health', label: 'Health', color: '#EF4444', icon: Dumbbell },
      { id: 'creative', label: 'Creative', color: '#F59E0B', icon: Palette },
      { id: 'other', label: 'Other', color: '#6B7280', icon: FileText }
    ];
    
    return PREDEFINED_TAGS.find(tag => tag.id === tagId);
  };

  if (sessionsLoading) {
    return (
      <div className="focus-tab-container p-6">
        <div className="text-center text-purple-400 font-mono">
          ⏳ LOADING FOCUS STATION...
        </div>
      </div>
    );
  }

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
          Productivity stations with time tracking and break management.
        </p>
      </div>

      {/* Main Timer Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative mb-6"
        style={{
          ...getBackgroundStyle(),
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: getBackgroundStyle().borderColor }} />
        
        <div className="relative z-10 text-center">
          {/* Session Info */}
          {activeSession && (
            <div className="mb-6">
              <h3 className="font-mono text-xl font-bold text-white mb-2">
                {activeSession.name}
              </h3>
              <div className="flex items-center justify-center gap-4 text-sm font-mono text-gray-400">
                <span>Cycle {currentCycle} of {activeSession.cycles}</span>
                <span>Phase: {currentPhase?.toUpperCase()}</span>
                <span>Total: {totalTimeSpent}m</span>
              </div>
              {activeSession.tag && (
                <div className="mt-2">
                  <span 
                    className="px-3 py-1 text-xs font-mono border inline-flex items-center gap-2"
                    style={{ 
                      borderColor: getTagInfo(activeSession.tag)?.color || activeSession.colorCode || '#6B7280',
                      color: getTagInfo(activeSession.tag)?.color || activeSession.colorCode || '#6B7280',
                      backgroundColor: `${getTagInfo(activeSession.tag)?.color || activeSession.colorCode || '#6B7280'}20`
                    }}
                  >
                    {getTagInfo(activeSession.tag)?.icon && (
                      React.createElement(getTagInfo(activeSession.tag).icon, { size: 12 })
                    )}
                    <span>{getTagInfo(activeSession.tag)?.label || activeSession.tag}</span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-6xl font-mono font-bold text-white mb-4">
              {formatTime()}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-4 border border-gray-600 mb-4">
              <div 
                className="h-full transition-all duration-1000"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: currentPhase === 'work' ? (activeSession?.colorCode || tabColor) : '#22C55E'
                }}
              />
            </div>

            {/* Timer Status */}
            <div className="flex items-center justify-center gap-2 text-sm font-mono">
              {activeSession && isRunning && !isPaused && currentPhase === 'work' && (
                <>
                  <Target size={16} style={{ color: activeSession.colorCode || tabColor }} />
                  <span style={{ color: activeSession.colorCode || tabColor }}>FOCUS MODE ACTIVE</span>
                </>
              )}
              {activeSession && isRunning && !isPaused && currentPhase === 'break' && (
                <>
                  <Coffee size={16} className="text-green-400" />
                  <span className="text-green-400">BREAK TIME</span>
                </>
              )}
              {!activeSession && (
                <>
                  <Timer size={16} className="text-gray-400" />
                  <span className="text-gray-400">READY TO START</span>
                </>
              )}
              {isPaused && (
                <span className="text-yellow-400 ml-2">PAUSED</span>
              )}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4">
            {!activeSession ? (
              <button
                onClick={() => setIsSessionCreatorOpen(true)}
                className="bg-gray-900 border-2 px-6 py-3 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                style={{
                  borderColor: tabColor,
                  color: tabColor,
                  boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                }}
              >
                <div className="flex items-center gap-2">
                  <Play size={18} />
                  <span>START SESSION</span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                     style={{ backgroundColor: tabColor }} />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={togglePause}
                  className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
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
                  onClick={stopSession}
                  className="bg-gray-900 border-2 border-red-500 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold text-red-500 hover:bg-red-500 hover:bg-opacity-10"
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

      {/* Quick Start Options */}
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
          <h3 className="text-lg font-mono font-bold text-white mb-4">QUICK START</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {quickPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => createQuickSession(preset)}
                className="bg-gray-900 border border-gray-600 p-4 text-left hover:border-purple-400 transition-colors disabled:opacity-50"
                disabled={activeSession !== null}
              >
                <div className="font-mono font-bold text-white mb-2">{preset.name}</div>
                <div className="text-sm text-gray-400 font-mono">
                  {preset.workDuration}m work • {preset.breakDuration}m break
                  {preset.cycles > 1 && ` • ${preset.cycles} cycles`}
                </div>
              </button>
            ))}
          </div>

          {/* Saved Sessions */}
          {activeSessions.length > 0 && (
            <div>
              <h4 className="font-mono font-bold text-white mb-3">SAVED SESSIONS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeSessions.slice(0, 6).map(session => (
                  <button
                    key={session.id}
                    onClick={() => handleStartSavedSession(session)}
                    className="bg-gray-900 border p-3 text-left transition-colors disabled:opacity-50"
                    style={{
                      borderColor: session.colorCode || tabColor
                    }}
                    disabled={activeSession !== null}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3"
                        style={{ backgroundColor: session.colorCode || tabColor }}
                      />
                      <span className="font-mono font-bold text-white text-sm">
                        {session.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {session.tag && (
                        <span className="px-2 py-1 bg-gray-700 border border-gray-600 mr-2">
                          {getTagInfo(session.tag)?.label || session.tag}
                        </span>
                      )}
                      <span>{session.totalTimeLogged || 0}m logged</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Session Creator Modal */}
      <SessionCreator
        isOpen={isSessionCreatorOpen}
        onClose={() => setIsSessionCreatorOpen(false)}
        onCreateSession={(config, sessionData) => {
          if (sessionData) {
            // Custom session with tracking
            createSession(sessionData).then(newSession => {
              startSession(newSession);
              setIsSessionCreatorOpen(false);
            });
          } else {
            // Quick session without tracking
            createQuickSession({
              name: 'CUSTOM SESSION',
              description: 'Custom focus session',
              workDuration: config.workDuration,
              breakDuration: config.breakDuration,
              cycles: config.cycles,
              category: 'WORK',
              colorCode: tabColor
            });
            setIsSessionCreatorOpen(false);
          }
        }}
        sessions={activeSessions}
        createSession={createSession}
        tabColor={tabColor}
      />

      {/* Completion Modal */}
      {showCompletionModal && activeSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md"
            style={{
              borderColor: activeSession.colorCode || tabColor,
              boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
            }}
          >
            <div className="text-center">
              <h3 className="font-mono text-xl font-bold text-white mb-4">
                SESSION COMPLETED!
              </h3>
              <p className="font-mono text-gray-400 mb-2">
                You focused for <span className="text-white font-bold">{totalTimeSpent} minutes</span>
              </p>
              <p className="font-mono text-gray-400 mb-6">
                on <span style={{ color: activeSession.colorCode || tabColor }}>{activeSession.name}</span>
              </p>
              
              <button
                onClick={handleCloseCompletionModal}
                className="bg-gray-900 border-2 px-6 py-2 font-mono font-bold transition-colors"
                style={{
                  borderColor: activeSession.colorCode || tabColor,
                  color: activeSession.colorCode || tabColor
                }}
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FocusTab;