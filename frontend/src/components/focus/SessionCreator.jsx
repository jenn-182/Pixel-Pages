import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Palette, Tag, Play, Plus, Settings } from 'lucide-react';

const SessionCreator = ({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  sessions = [], 
  createSession, 
  tabColor = '#8B5CF6' 
}) => {
  const [sessionType, setSessionType] = useState('general'); // 'general' or 'tracked'
  const [sessionData, setSessionData] = useState({
    name: '',
    description: '',
    colorCode: '#8B5CF6',
    tag: '',
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    cycles: 1
  });
  const [selectedExistingSession, setSelectedExistingSession] = useState('');

  const tabColorRgb = '139, 92, 246'; // RGB for #8B5CF6

  const predefinedColors = [
    '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#6B7280'
  ];

  const presetConfigs = [
    { name: 'Pomodoro', work: 25, break: 5, cycles: 4 },
    { name: 'Deep Work', work: 90, break: 20, cycles: 1 },
    { name: 'Short Sprint', work: 15, break: 3, cycles: 6 },
    { name: 'Ultra Focus', work: 120, break: 30, cycles: 1 }
  ];

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSessionType('general');
      setSessionData({
        name: '',
        description: '',
        colorCode: '#8B5CF6',
        tag: '',
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        cycles: 1
      });
      setSelectedExistingSession('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sessionType === 'tracked' && !sessionData.name.trim()) {
      alert('Session name is required for tracked sessions');
      return;
    }

    try {
      let session = null;
      
      if (sessionType === 'tracked') {
        if (selectedExistingSession) {
          // Use existing session
          session = sessions.find(s => s.id === selectedExistingSession);
        } else {
          // Create new session
          session = await createSession(sessionData);
        }
      }

      // Start the timer session
      onCreateSession({
        workDuration: sessionData.workDuration,
        breakDuration: sessionData.breakDuration,
        longBreakDuration: sessionData.longBreakDuration,
        cycles: sessionData.cycles
      }, session);

      onClose();
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const applyPreset = (preset) => {
    setSessionData(prev => ({
      ...prev,
      workDuration: preset.work,
      breakDuration: preset.break,
      cycles: preset.cycles
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-16"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
          style={{
            borderColor: tabColor,
            boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
               style={{ borderColor: tabColor }} />

          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Timer size={24} style={{ color: tabColor }} />
                <h3 className="font-mono text-xl font-bold text-white">
                  CREATE FOCUS SESSION
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm font-mono text-gray-400">
              Configure your productivity session with custom timing and tracking options
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Session Type */}
            <div>
              <label className="block text-sm font-mono font-bold mb-3" style={{ color: tabColor }}>
                SESSION TYPE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSessionType('general')}
                  className={`p-4 border-2 font-mono text-sm transition-all ${
                    sessionType === 'general'
                      ? 'border-purple-400 bg-purple-400 bg-opacity-10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold mb-1">GENERAL</div>
                  <div className="text-xs">Quick session, not tracked</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType('tracked')}
                  className={`p-4 border-2 font-mono text-sm transition-all ${
                    sessionType === 'tracked'
                      ? 'border-purple-400 bg-purple-400 bg-opacity-10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold mb-1">TRACKED</div>
                  <div className="text-xs">Save to productivity tracker</div>
                </button>
              </div>
            </div>

            {/* Tracked Session Options */}
            {sessionType === 'tracked' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                    SESSION CATEGORY
                  </label>
                  <div className="space-y-3">
                    <select
                      value={selectedExistingSession}
                      onChange={(e) => {
                        setSelectedExistingSession(e.target.value);
                        if (e.target.value) {
                          const session = sessions.find(s => s.id === e.target.value);
                          if (session) {
                            setSessionData(prev => ({
                              ...prev,
                              workDuration: session.workDuration,
                              breakDuration: session.breakDuration,
                              cycles: session.cycles
                            }));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                      onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                      onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                    >
                      <option value="">Create new category</option>
                      {sessions.map(session => (
                        <option key={session.id} value={session.id}>
                          {session.name} ({session.totalTimeLogged || 0}m logged)
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedExistingSession && (
                    <div className="mt-4 space-y-4">
                      {/* Session Name */}
                      <div>
                        <input
                          type="text"
                          value={sessionData.name}
                          onChange={(e) => setSessionData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter session name (e.g., 'React Development')"
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                          onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                          onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                          required
                        />
                      </div>

                      {/* Tag */}
                      <div>
                        <input
                          type="text"
                          value={sessionData.tag}
                          onChange={(e) => setSessionData(prev => ({ ...prev, tag: e.target.value }))}
                          placeholder="Optional tag (e.g., 'Frontend', 'Learning')"
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                          onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                          onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                        />
                      </div>

                      {/* Color */}
                      <div>
                        <label className="block text-sm font-mono font-bold mb-2" style={{ color: tabColor }}>
                          <Palette size={16} className="inline mr-1" />
                          CATEGORY COLOR
                        </label>
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setSessionData(prev => ({ ...prev, colorCode: color }))}
                              className={`w-8 h-8 border-2 transition-all duration-200 ${
                                sessionData.colorCode === color ? 'border-white scale-110' : 'border-gray-600'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timing Configuration */}
            <div>
              <label className="block text-sm font-mono font-bold mb-3" style={{ color: tabColor }}>
                <Settings size={16} className="inline mr-1" />
                TIMING CONFIGURATION
              </label>
              
              {/* Presets */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {presetConfigs.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="p-3 border border-gray-600 font-mono text-xs text-left hover:border-purple-400 transition-colors"
                  >
                    <div className="font-bold text-white mb-1">{preset.name}</div>
                    <div className="text-gray-400">
                      {preset.work}m work • {preset.break}m break • {preset.cycles} cycles
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Timing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">WORK (minutes)</label>
                  <input
                    type="number"
                    value={sessionData.workDuration}
                    onChange={(e) => setSessionData(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                    min="1"
                    max="180"
                    className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                    onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                    onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">BREAK (minutes)</label>
                  <input
                    type="number"
                    value={sessionData.breakDuration}
                    onChange={(e) => setSessionData(prev => ({ ...prev, breakDuration: parseInt(e.target.value) || 5 }))}
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                    onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                    onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-mono text-gray-400 mb-1">CYCLES</label>
                <input
                  type="number"
                  value={sessionData.cycles}
                  onChange={(e) => setSessionData(prev => ({ ...prev, cycles: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="10"
                  className="w-24 px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm transition-colors focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = tabColor; }}
                  onBlur={(e) => { e.target.style.borderColor = '#4B5563'; }}
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Total time: {(sessionData.workDuration * sessionData.cycles) + (sessionData.breakDuration * (sessionData.cycles - 1))} minutes
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-900 border-2 border-gray-600 px-4 py-3 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 bg-gray-900 border-2 px-4 py-3 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                style={{
                  borderColor: tabColor,
                  color: tabColor,
                  boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Play size={16} />
                  <span>START SESSION</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 rounded-lg group-hover:opacity-40 transition-opacity" />
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SessionCreator;