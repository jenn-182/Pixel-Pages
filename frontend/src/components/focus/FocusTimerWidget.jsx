import React, { useState, useEffect } from 'react';
import { useFocusTimer, useFocusSessions } from '../../hooks';
import './FocusTimerWidget.css';

const FocusTimerWidget = ({ username, className = '' }) => {
  const [showSessionSelector, setShowSessionSelector] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
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
    startSession,
    stopSession,
    togglePause,
    formatTime,
    progress
  } = useFocusTimer(username);

  const activeSessions = getActiveSessions();

  // Quick session creation
  const createQuickSession = async (preset) => {
    const sessionData = {
      name: preset.name,
      description: preset.description,
      workDuration: preset.workDuration,
      breakDuration: preset.breakDuration,
      cycles: preset.cycles,
      category: preset.category,
      colorCode: preset.colorCode
    };
    
    try {
      const newSession = await createSession(sessionData);
      startSession(newSession);
    } catch (err) {
      console.error('Error creating quick session:', err);
    }
  };

  // Quick session presets - Updated for dashboard
  const quickPresets = [
    {
      name: 'POMODORO',
      description: 'Classic 25-minute focus session',
      workDuration: 25,
      breakDuration: 5,
      cycles: 1,
      category: 'WORK',
      colorCode: '#9333ea'
    },
    {
      name: 'DEEP WORK',
      description: 'Extended 45-minute focus session',  
      workDuration: 45,
      breakDuration: 10,
      cycles: 1,
      category: 'WORK',
      colorCode: '#7c3aed'
    },
    {
      name: 'QUICK BURST',
      description: 'Short 15-minute burst',
      workDuration: 15,
      breakDuration: 3,
      cycles: 1,
      category: 'WORK',
      colorCode: '#8b5cf6'
    }
  ];

  // Handle session selection
  const handleStartSession = () => {
    const session = activeSessions.find(s => s.id.toString() === selectedSessionId);
    if (session) {
      startSession(session);
      setShowSessionSelector(false);
    }
  };

  if (sessionsLoading) {
    return (
      <div className="focus-timer-loading">
        <div className="text-xs font-mono text-purple-400">⏳ LOADING FOCUS PROTOCOLS...</div>
      </div>
    );
  }

  return (
    <div className={`focus-timer-dashboard ${className}`}>
      {!activeSession ? (
        // Timer Idle State
        <div className="timer-idle">
          <div className="mb-4">
            <div className="text-sm font-mono text-purple-400 mb-2">Ready to boost productivity?</div>
          </div>

          {!showSessionSelector ? (
            <div className="space-y-4">
              {/* Quick Presets */}
              <div>
                <div className="text-xs font-mono text-purple-300 font-bold mb-2">QUICK PROTOCOLS:</div>
                <div className="grid grid-cols-1 gap-2">
                  {quickPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => createQuickSession(preset)}
                      className="bg-gray-900 border border-purple-500 p-2 relative group cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(147,51,234,0.4)] font-mono text-xs overflow-hidden"
                      style={{ boxShadow: '0 0 3px rgba(147, 51, 234, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-purple-700/12 pointer-events-none" />
                      <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="text-left">
                          <div className="text-purple-300 font-bold group-hover:text-purple-200 transition-colors">{preset.name}</div>
                          <div className="text-gray-400 text-xs">{preset.workDuration}m work • {preset.breakDuration}m break</div>
                        </div>
                        <div className="text-purple-400 font-bold">{preset.workDuration}m</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Sessions */}
              {activeSessions.length > 0 && (
                <div className="border-t border-gray-700 pt-3">
                  <div className="text-xs font-mono text-purple-300 font-bold mb-2">YOUR PROTOCOLS:</div>
                  <button 
                    onClick={() => setShowSessionSelector(true)}
                    className="w-full bg-gray-900 border border-purple-500 p-2 relative group cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(147,51,234,0.4)] font-mono text-xs overflow-hidden"
                    style={{ boxShadow: '0 0 3px rgba(147, 51, 234, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-purple-700/12 pointer-events-none" />
                    <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-purple-300 font-bold group-hover:text-purple-200 transition-colors">SELECT CUSTOM PROTOCOL</span>
                      <span className="text-purple-400 font-bold">{activeSessions.length}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Session Selector
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-purple-300 font-bold">SELECT PROTOCOL:</div>
                <button 
                  onClick={() => setShowSessionSelector(false)}
                  className="text-xs font-mono text-gray-400 hover:text-purple-400 transition-colors"
                >
                  ← BACK
                </button>
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {activeSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id.toString())}
                    className={`w-full bg-gray-900 border p-2 text-left relative overflow-hidden cursor-pointer transition-all duration-300 font-mono text-xs ${
                      selectedSessionId === session.id.toString() 
                        ? 'border-purple-400 bg-purple-900/20' 
                        : 'border-purple-500 hover:border-purple-400'
                    }`}
                    style={{ 
                      boxShadow: selectedSessionId === session.id.toString() 
                        ? '0 0 8px rgba(147, 51, 234, 0.4)' 
                        : '0 0 3px rgba(147, 51, 234, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-purple-700/12 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-purple-300 font-bold">{session.name}</div>
                          <div className="text-gray-400 text-xs">{session.workDuration}m • {session.cycles} cycles</div>
                        </div>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: session.colorCode }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleStartSession}
                disabled={!selectedSessionId}
                className="w-full bg-gray-900 border border-purple-500 p-2 relative group cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(147,51,234,0.4)] font-mono text-xs font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 3px rgba(147, 51, 234, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-purple-700/12 pointer-events-none" />
                <div className="relative z-10 text-purple-300 group-hover:text-purple-200 transition-colors">
                  INITIATE PROTOCOL
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        // Timer Active State
        <div className="timer-active">
          <div className="mb-3">
            <div className="text-sm font-mono text-purple-300 font-bold">{activeSession.name}</div>
            <div className="flex justify-between text-xs font-mono text-purple-400">
              <span>
                {currentPhase === 'work' ? '⚡ FOCUS MODE' : 
                 currentPhase === 'break' ? '☕ BREAK TIME' : 
                 '🌟 LONG BREAK'}
              </span>
              <span>CYCLE {currentCycle}/{activeSession.cycles}</span>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-purple-200 mb-2">{formatTime()}</div>
              
              {/* Simplified progress bar */}
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={togglePause}
              className="bg-gray-900 border border-purple-500 p-2 relative group cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(147,51,234,0.4)] font-mono text-xs font-bold overflow-hidden"
              style={{ boxShadow: '0 0 3px rgba(147, 51, 234, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-purple-700/12 pointer-events-none" />
              <div className="relative z-10 text-purple-300 group-hover:text-purple-200 transition-colors">
                {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
              </div>
            </button>
            
            <button 
              onClick={stopSession}
              className="bg-gray-900 border border-red-500 p-2 relative group cursor-pointer transition-all duration-300 hover:border-red-400 hover:shadow-[0_0_8px_rgba(239,68,68,0.4)] font-mono text-xs font-bold overflow-hidden"
              style={{ boxShadow: '0 0 3px rgba(239, 68, 68, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/8 to-red-700/12 pointer-events-none" />
              <div className="relative z-10 text-red-400 group-hover:text-red-300 transition-colors">
                🛑 ABORT
              </div>
            </button>
          </div>

          {isPaused && (
            <div className="absolute inset-0 bg-gray-800/90 flex items-center justify-center">
              <div className="text-sm font-mono text-purple-400 font-bold">⏸️ PROTOCOL PAUSED</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FocusTimerWidget;