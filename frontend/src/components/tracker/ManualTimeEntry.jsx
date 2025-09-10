import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Save } from 'lucide-react';
import { Briefcase, BookOpen, Home, Dumbbell, Palette, FileText } from 'lucide-react';
import useFocusSessions from '../../hooks/useFocusSessions';
import { useNotification } from '../../contexts/NotificationContext';

const ManualTimeEntry = ({ isOpen, onClose, sessions, onSubmit, tabColor }) => {
  const [formData, setFormData] = useState({
    sessionId: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    customSessionName: ''
  });

  const { logFocusTime } = useFocusSessions();
  const { showNotification } = useNotification();

  const tabColorRgb = '245, 158, 11'; // Default for #F59E0B

  const PREDEFINED_TAGS = [
    { id: 'work', label: 'Work', color: '#3B82F6', icon: Briefcase },
    { id: 'learning', label: 'Learning', color: '#10B981', icon: BookOpen },
    { id: 'personal', label: 'Personal', color: '#8B5CF6', icon: Home },
    { id: 'health', label: 'Health', color: '#EF4444', icon: Dumbbell },
    { id: 'creative', label: 'Creative', color: '#F59E0B', icon: Palette },
    { id: 'other', label: 'Other', color: '#6B7280', icon: FileText }
  ];

  const resetForm = () => {
    setFormData({
      sessionId: '',
      duration: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      customSessionName: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.duration || formData.duration <= 0) {
      showNotification('Please enter a valid duration', 'error');
      return;
    }

    try {
      let sessionToLog;
      
      if (formData.sessionId) {
        sessionToLog = sessions.find(s => s.id === formData.sessionId);
      } else if (formData.customSessionName) {
        sessionToLog = {
          id: `manual_${Date.now()}`,
          name: formData.customSessionName,
          tag: 'other',
          colorCode: '#6B7280'
        };
      } else {
        showNotification('Please select a session or enter a custom session name', 'error');
        return;
      }

      // Create the log entry
      const logEntry = {
        id: `log_${Date.now()}`,
        sessionId: sessionToLog.id,
        sessionName: sessionToLog.name,
        timeSpent: parseInt(formData.duration),
        date: formData.date,
        timestamp: new Date().toISOString(),
        notes: formData.notes,
        isManualEntry: true
      };

      console.log('Attempting to save log entry:', logEntry);

      // Use the SAME storage key as useFocusSessions
      const LOGS_STORAGE_KEY = 'pixelPages_focusLogs';
      const existingLogs = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || '[]');
      
      existingLogs.push(logEntry);
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(existingLogs));

      console.log('Successfully saved log entry. Total logs:', existingLogs.length);

      resetForm();
      onClose();
      
      if (onSubmit) {
        onSubmit();
      }
      
      // Replace alert with notification
      showNotification(
        `Successfully logged ${formData.duration} minutes for "${sessionToLog.name}"`, 
        'success'
      );
      
    } catch (error) {
      console.error('Failed to save log entry:', error);
      // Replace alert with notification
      showNotification(
        `Failed to log time entry: ${error.message || 'Please try again.'}`, 
        'error'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative"
          style={{
            borderColor: tabColor,
            boxShadow: `0 0 20px rgba(245, 158, 11, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
               style={{ borderColor: tabColor }} />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-xl font-bold text-white flex items-center gap-2">
                <Clock size={20} style={{ color: tabColor }} />
                LOG TIME MANUALLY
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Session Selection */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2 text-white">
                  SESSION CATEGORY
                </label>
                <select
                  value={formData.sessionId}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    sessionId: e.target.value,
                    customSessionName: e.target.value ? '' : prev.customSessionName
                  }))}
                  className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value="">Select existing session...</option>
                  {sessions.map(session => {
                    const tagInfo = PREDEFINED_TAGS.find(tag => tag.id === session.tag);
                    return (
                      <option key={session.id} value={session.id}>
                        {session.name} ({tagInfo?.label || session.tag})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* OR Custom Session Name */}
              <div className="text-center text-gray-400 font-mono text-sm">— OR —</div>
              
              <div>
                <label className="block text-sm font-mono font-bold mb-2 text-white">
                  CUSTOM SESSION NAME
                </label>
                <input
                  type="text"
                  value={formData.customSessionName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    customSessionName: e.target.value,
                    sessionId: e.target.value ? '' : prev.sessionId
                  }))}
                  placeholder="Enter custom session name..."
                  className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2 text-white">
                  DURATION (MINUTES)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="60"
                  min="1"
                  className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2 text-white">
                  DATE
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2 text-white">
                  NOTES (OPTIONAL)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="What did you accomplish during this time?"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-600 text-white font-mono text-sm resize-none focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-900 border-2 border-gray-600 px-4 py-2 font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 border-2 px-4 py-2 font-mono font-bold transition-colors"
                  style={{
                    borderColor: '#22C55E',
                    color: '#22C55E'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Save size={16} />
                    <span>LOG TIME</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManualTimeEntry;