import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Target, Calendar, BookOpen, Briefcase, Code, Palette, User } from 'lucide-react';

const TrackerTab = ({ username = 'Jroc_182', tabColor = '#10B981' }) => {
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    totalSessions: 0,
    todaySessions: 0,
    weekSessions: 0
  });

  const getIconComponent = (iconName) => {
    const iconMap = {
      'BookOpen': BookOpen,
      'Briefcase': Briefcase,
      'Palette': Palette,
      'Code': Code,
      'User': User
    };
    return iconMap[iconName] || User;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '16, 185, 129';
  };

  const tabColorRgb = hexToRgb(tabColor);

  useEffect(() => {
    const loadTrackerData = () => {
      // Load categories with XP
      const categoryData = JSON.parse(localStorage.getItem('focusCategories') || '[]');
      setCategories(categoryData);

      // Load session history
      const sessionData = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      setSessions(sessionData);

      // Calculate statistics
      const now = new Date();
      const today = now.toDateString();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalTime = sessionData.reduce((sum, session) => sum + session.timeSpent, 0);
      const totalSessions = sessionData.length;
      const todaySessions = sessionData.filter(session => 
        new Date(session.createdAt).toDateString() === today
      ).length;
      const weekSessions = sessionData.filter(session => 
        new Date(session.createdAt) >= weekAgo
      ).length;

      setStats({
        totalTime,
        totalSessions,
        todaySessions,
        weekSessions
      });
    };

    loadTrackerData();
  }, [username]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          FOCUS TRACKER
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Track your focus sessions and XP across different categories.
        </p>
      </motion.div>

      {/* Focus Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
        
        <div className="relative z-10">
          <div className="border-b px-4 py-3"
               style={{ 
                 borderColor: tabColor,
                 backgroundColor: '#1A0E26'
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <BarChart3 className="mr-2" size={20} style={{ color: tabColor }} />
              FOCUS STATISTICS
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-400">
                  {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
                </div>
                <div className="text-xs text-gray-400">TOTAL TIME</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-400">
                  {stats.totalSessions}
                </div>
                <div className="text-xs text-gray-400">TOTAL SESSIONS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-yellow-400">
                  {stats.todaySessions}
                </div>
                <div className="text-xs text-gray-400">TODAY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-purple-400">
                  {stats.weekSessions}
                </div>
                <div className="text-xs text-gray-400">THIS WEEK</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category XP Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
        style={{
          borderColor: tabColor,
          boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
        }}
      >
        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none" 
             style={{ borderColor: tabColor }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.15), rgba(${tabColorRgb}, 0.2))` }} />
        
        <div className="relative z-10">
          <div className="border-b px-4 py-3"
               style={{ 
                 borderColor: tabColor,
                 backgroundColor: '#1A0E26'
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <Trophy className="mr-2" size={20} style={{ color: tabColor }} />
              CATEGORY XP BREAKDOWN
            </h3>
          </div>
          
          <div className="p-6">
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories
                  .filter(cat => (cat.xp || 0) > 0) // Only show categories with XP
                  .sort((a, b) => (b.xp || 0) - (a.xp || 0)) // Sort by XP descending
                  .map(category => {
                    const IconComponent = getIconComponent(category.iconName);
                    const maxXp = Math.max(...categories.map(c => c.xp || 0));
                    const progressWidth = maxXp > 0 ? ((category.xp || 0) / maxXp) * 100 : 0;
                    
                    return (
                      <div
                        key={category.id}
                        className="bg-gray-900 border border-gray-600 p-4 relative transition-all duration-300 hover:scale-105"
                        style={{
                          borderColor: category.color,
                          boxShadow: `0 0 10px ${category.color}30, 2px 2px 0px 0px rgba(0,0,0,1)`
                        }}
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-20"
                             style={{ 
                               background: `linear-gradient(to bottom right, ${category.color}20, ${category.color}10)` 
                             }} />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent 
                              size={24} 
                              style={{ color: category.color }}
                            />
                            <div>
                              <div className="font-mono font-bold text-white">
                                {category.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {category.xp || 0} minutes XP
                              </div>
                            </div>
                          </div>
                          
                          {/* XP Progress Bar */}
                          <div className="w-full bg-gray-700 h-2 border border-gray-600">
                            <div 
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${progressWidth}%`,
                                backgroundColor: category.color
                              }}
                            />
                          </div>
                          
                          <div className="text-xs font-mono text-gray-400 mt-2 text-center">
                            Level {Math.floor((category.xp || 0) / 60) + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target size={48} className="text-gray-500 mx-auto mb-3" />
                <div className="text-gray-400 font-mono text-lg font-bold mb-2">
                  NO FOCUS DATA YET
                </div>
                <div className="text-gray-500 font-mono text-sm">
                  Complete focus sessions to see your XP breakdown!
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border-2 border-gray-600 p-6"
        >
          <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-gray-400" />
            RECENT SESSIONS
          </h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sessions.slice(-10).reverse().map(session => (
              <div key={session.id} className="bg-gray-900 border border-gray-700 p-3 font-mono text-sm">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <span className="font-bold">{session.category.toUpperCase()}</span>
                    <span className="text-gray-400 ml-2">+{session.timeSpent}m</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackerTab;