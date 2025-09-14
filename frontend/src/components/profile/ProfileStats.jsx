import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileStats = ({ notes = [], tasks = [], taskLists = [] }) => {
  const { currentTheme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  // Calculate total words from all notes
  const calculateTotalWords = () => {
    return notes.reduce((total, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return total + wordCount;
    }, 0);
  };

  // Calculate total completed missions (tasks)
  const calculateTotalMissions = () => {
    return tasks.filter(task => task.completed).length;
  };

  // Calculate total focus time from tracker (same method as TimeManagementMatrix)
  const calculateTotalFocusTime = () => {
    try {
      const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      const totalMinutes = sessions.reduce((sum, session) => {
        return sum + (session.timeSpent || 0);
      }, 0);
      
      // Convert minutes to hours and minutes for display
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      console.error('Error calculating focus time:', error);
      return '0m';
    }
  };

  const totalWords = calculateTotalWords();
  const totalMissions = calculateTotalMissions();
  const totalFocusTime = calculateTotalFocusTime();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 relative overflow-hidden"
      style={{
        backgroundColor: themeColors.backgroundColor,
        border: `2px solid ${themeColors.borderColor}`,
        borderRadius: '12px', // Fixed - use consistent rounding for all themes
        boxShadow: currentTheme === 'default' 
          ? `0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)` 
          : `0 0 3px ${themeColors.primary}50, 4px 4px 0px 0px rgba(0,0,0,1)`
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: currentTheme === 'default' 
               ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
               : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
             borderRadius: '12px' // Fixed - use consistent rounding for all themes
           }} />
        
      <div className="relative z-10">
        <h3 className="text-2xl font-mono font-bold text-white flex items-center mb-4">
          {currentTheme === 'pink' ? (
            <Heart 
              size={20} 
              className="mr-2" 
              style={{ color: themeColors.secondary }}
            />
          ) : (
            <Star 
              size={20} 
              className="mr-2" 
              style={{ color: themeColors.secondary }}
            />
          )}
          PLAYER STATS
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Words */}
          <div className="p-4 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '12px' // Fixed - use consistent rounding for all themes
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '12px' // Fixed - use consistent rounding for all themes
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400">TOTAL WORDS</div>
              <div className="text-2xl font-mono font-bold text-white">{totalWords.toLocaleString()}</div>
            </div>
          </div>

          {/* Total Missions */}
          <div className="p-4 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '12px' // Fixed - use consistent rounding for all themes
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '12px' // Fixed - use consistent rounding for all themes
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400">COMPLETED MISSIONS</div>
              <div className="text-2xl font-mono font-bold text-white">{totalMissions}</div>
            </div>
          </div>

          {/* Total Focus Time */}
          <div className="p-4 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '12px' // Fixed - use consistent rounding for all themes
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '12px' // Fixed - use consistent rounding for all themes
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400">TOTAL FOCUS TIME</div>
              <div className="text-2xl font-mono font-bold text-white">{totalFocusTime}</div>
            </div>
          </div>

          {/* Member Since */}
          <div className="p-4 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '12px' // Fixed - use consistent rounding for all themes
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '12px' // Fixed - use consistent rounding for all themes
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400">MEMBER SINCE</div>
              <div className="text-lg font-mono font-bold text-white">July 28, 2025</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStats;
