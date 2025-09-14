import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Target, Calendar, BookOpen, Briefcase, Code, Palette, User, PenTool, Search, Heart, Activity } from 'lucide-react';
import HexagonalSkillTree from '../trackerSkills/HexagonalSkillTree';
import TimeManagementMatrix from '../widgets/TimeManagementMatrix';

const TrackerTab = ({ username = 'user', tabColor = '#10B981' }) => {
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [stats, setStats] = useState({
    totalTime: 0,
    totalSessions: 0,
    todaySessions: 0,
    weekSessions: 0
  });

  // Updated icon mapping to match SaveSessionModal and HexagonalSkillTree
  const getIconComponent = (iconName) => {
    const iconMap = {
      'BookOpen': BookOpen,      // Scholar (Study)
      'Briefcase': Briefcase,    // Profession (Work)
      'Palette': Palette,        // Artisan (Creating)
      'PenTool': PenTool,        // Scribe (Writing)
      'Code': Code,              // Programming (Coding)
      'Target': Target,          // Literacy (Reading)
      'Calendar': Calendar,      // Strategist (Planning)
      'Heart': Heart,            // Mindfulness (Rest)
      'Search': Search,          // Knowledge (Researching)
      'User': User               // Custom categories
    };
    return iconMap[iconName] || User;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '16, 185, 129';
  };

  const tabColorRgb = hexToRgb('white');

  useEffect(() => {
    const loadTrackerData = () => {
      // Check if categories exist, if not initialize with defaults
      let categoryData = JSON.parse(localStorage.getItem('focusCategories') || '[]');

      
      // MOCK DATA!!
      // If no categories exist, initialize with the new 9 default branches with mock data
      if (categoryData.length === 0) {
        const defaultCategories = [
          { id: 'scholar', name: 'Scholar', iconName: 'BookOpen', color: '#FF1493', xp: 95 },      // Level 2 with some progress
          { id: 'profession', name: 'Profession', iconName: 'Briefcase', color: '#00FFFF', xp: 180 }, // Level 3 with some progress
          { id: 'artisan', name: 'Artisan', iconName: 'Palette', color: '#8A2BE2', xp: 45 },        // Level 1 with progress
          { id: 'scribe', name: 'Scribe', iconName: 'PenTool', color: '#FF6347', xp: 0 },           // No progress yet
          { id: 'programming', name: 'Programming', iconName: 'Code', color: '#00FF7F', xp: 200 },  // Level 2 with progress
          { id: 'literacy', name: 'Literacy', iconName: 'Target', color: '#FFD700', xp: 30 },       // Level 1 partial
          { id: 'strategist', name: 'Strategist', iconName: 'Calendar', color: '#FF4500', xp: 0 },  // No progress
          { id: 'mindfulness', name: 'Mindfulness', iconName: 'Heart', color: '#40E0D0', xp: 85 },  // Level 2 partial
          { id: 'knowledge', name: 'Knowledge', iconName: 'Search', color: '#DA70D6', xp: 15 }      // Level 1 small progress
        ];
        
        localStorage.setItem('focusCategories', JSON.stringify(defaultCategories));
        categoryData = defaultCategories;

        // Also add some mock session data to make it look realistic
        const mockSessions = [
          // Scholar sessions (95 minutes total) - Updated to recent dates
          { id: 1, username: 'user', category: 'scholar', timeSpent: 25, sessionType: 'session', createdAt: '2025-09-10T10:00:00.000Z', date: 'Tue Sep 10 2025' },
          { id: 2, username: 'user', category: 'scholar', timeSpent: 30, sessionType: 'session', createdAt: '2025-09-09T14:30:00.000Z', date: 'Mon Sep 09 2025' },
          { id: 3, username: 'user', category: 'scholar', timeSpent: 40, sessionType: 'session', createdAt: '2025-09-08T09:15:00.000Z', date: 'Sun Sep 08 2025' },
          
          // Profession sessions (180 minutes total)
          { id: 4, username: 'user', category: 'profession', timeSpent: 45, sessionType: 'session', createdAt: '2025-09-12T08:00:00.000Z', date: 'Thu Sep 12 2025' },
          { id: 5, username: 'user', category: 'profession', timeSpent: 60, sessionType: 'session', createdAt: '2025-09-11T16:00:00.000Z', date: 'Wed Sep 11 2025' },
          { id: 6, username: 'user', category: 'profession', timeSpent: 50, sessionType: 'session', createdAt: '2025-09-07T11:30:00.000Z', date: 'Sun Sep 07 2025' },
          { id: 7, username: 'user', category: 'profession', timeSpent: 25, sessionType: 'session', createdAt: '2025-09-06T15:45:00.000Z', date: 'Sat Sep 06 2025' },
          
          // Artisan sessions (45 minutes total)
          { id: 8, username: 'user', category: 'artisan', timeSpent: 45, sessionType: 'session', createdAt: '2025-09-09T20:00:00.000Z', date: 'Mon Sep 09 2025' },
          
          // Programming sessions (125 minutes total)
          { id: 9, username: 'user', category: 'programming', timeSpent: 35, sessionType: 'session', createdAt: '2025-09-12T19:00:00.000Z', date: 'Thu Sep 12 2025' },
          { id: 10, username: 'user', category: 'programming', timeSpent: 45, sessionType: 'session', createdAt: '2025-09-08T18:30:00.000Z', date: 'Sun Sep 08 2025' },
          { id: 11, username: 'user', category: 'programming', timeSpent: 45, sessionType: 'session', createdAt: '2025-09-05T17:15:00.000Z', date: 'Fri Sep 05 2025' },
          
          // Literacy sessions (30 minutes total)
          { id: 12, username: 'user', category: 'literacy', timeSpent: 30, sessionType: 'session', createdAt: '2025-09-10T21:00:00.000Z', date: 'Tue Sep 10 2025' },
          
          // Mindfulness sessions (85 minutes total)
          { id: 13, username: 'user', category: 'mindfulness', timeSpent: 25, sessionType: 'session', createdAt: '2025-09-12T07:00:00.000Z', date: 'Thu Sep 12 2025' },
          { id: 14, username: 'user', category: 'mindfulness', timeSpent: 30, sessionType: 'session', createdAt: '2025-09-09T07:30:00.000Z', date: 'Mon Sep 09 2025' },
          { id: 15, username: 'user', category: 'mindfulness', timeSpent: 30, sessionType: 'session', createdAt: '2025-09-06T22:00:00.000Z', date: 'Sat Sep 06 2025' },
          
          // Knowledge sessions (15 minutes total)
          { id: 16, username: 'user', category: 'knowledge', timeSpent: 15, sessionType: 'session', createdAt: '2025-09-08T13:45:00.000Z', date: 'Sun Sep 08 2025' }
        ];
        
        localStorage.setItem('focusSessions', JSON.stringify(mockSessions));
      }
      
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

  useEffect(() => {
    // Set up global function for HexagonalSkillTree to access
    window.toggleMatrix = () => setShowMatrix(!showMatrix);
    
    return () => {
      delete window.toggleMatrix;
    };
  }, [showMatrix]);

  return (
    <div className="p-6 space-y-6 translucent-container">
      {/* Content - Either Skill Tree or Matrix */}
      <motion.div
        key={showMatrix ? 'matrix' : 'skilltree'}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {showMatrix ? (
          <TimeManagementMatrix 
            tabColor={'white'} 
            tabColorRgb={'white'}
            onClose={() => setShowMatrix(false)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative rounded-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Less translucent, more opaque
              boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)', // Remove glow, keep drop shadow
            }}
          >
            {/* Remove the animated border overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none" />
            {/* Remove the gradient overlay */}
            
            <div className="relative z-10">
              <div className="p-6">
                {categories.length > 0 ? (
                  <HexagonalSkillTree 
                    categories={categories} 
                    tabColor={'white'} 
                    tabColorRgb={'white'} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <Target size={48} className="text-gray-500 mx-auto mb-3" />
                    <div className="text-gray-400 font-mono text-lg font-bold mb-2">
                      NO SKILLS UNLOCKED
                    </div>
                    <div className="text-gray-500 font-mono text-sm">
                      Complete focus sessions to start building your skill trees!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackerTab;