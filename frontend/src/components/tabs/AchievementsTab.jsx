import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, Clock, Search, Filter, Crown, Zap, Target } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import AchievementCard from '../achievements/AchievementCard';
import { useAchievements } from '../../hooks/useAchievements';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';

const AchievementsTab = ({ tabColor = '#8B5CF6' }) => {
  const { achievements, summary, loading } = useAchievements();
  const { player } = usePlayer();
  const { notes } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, inProgress, locked

  // Calculate level and progress for active missions
  const calculateTotalXP = (notes) => {
    let totalXP = 0;
    for (const note of notes) {
      totalXP += 10;
      const wordCount = note.content ? note.content.split(/\s+/).length : 0;
      totalXP += Math.min(Math.floor(wordCount / 10), 50);
      const tags = note.tagsString ? note.tagsString.split(',').filter(tag => tag.trim()) : [];
      totalXP += tags.length * 5;
      if (note.title && note.title.length > 20) {
        totalXP += 5;
      }
    }
    return totalXP;
  };

  const calculateLevelFromXP = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 50.0)) + 1;
  };

  const getRankNameForLevel = (level) => {
    switch (level) {
      case 1: return "Novice Scribe";
      case 2: return "Apprentice Writer";
      case 3: return "Skilled Chronicler";
      case 4: return "Expert Documentarian";
      case 5: return "Master Archivist";
      case 6: return "Elite Wordsmith";
      case 7: return "Distinguished Author";
      case 8: return "Legendary Scribe";
      case 9: return "Mythical Chronicler";
      case 10: return "Grandmaster of Words";
      default: return level < 15 ? `Ascended Writer` : `Transcendent Scribe`;
    }
  };

  const totalXP = calculateTotalXP(notes);
  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 50;
  const nextLevelXP = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = totalXP - currentLevelBaseXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelBaseXP;
  const progressPercentage = Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  const nextLevelTitle = getRankNameForLevel(currentLevel + 1);

  // Filter achievements based on search and status
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = !searchTerm || 
      achievement.achievement?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.achievement?.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && achievement.completed) ||
      (filterStatus === 'inProgress' && !achievement.completed && achievement.progress > 0) ||
      (filterStatus === 'locked' && achievement.progress === 0);

    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { id: 'all', name: 'All', icon: Trophy, color: 'bg-purple-400' },
    { id: 'completed', name: 'Completed', icon: CheckCircle, color: 'bg-green-400' },
    { id: 'inProgress', name: 'In Progress', icon: Clock, color: 'bg-blue-400' },
    { id: 'locked', name: 'Locked', icon: Lock, color: 'bg-gray-400' },
  ];

  return (
    <div className="achievements-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Trophy size={32} className="text-yellow-400" />
          </motion.div>
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          ACHIEVEMENT TERMINAL
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Track progress and unlock digital accomplishments.
        </p>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-8 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          PROGRESS METRICS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} className="text-green-400" />
              <span className="font-mono font-bold text-white">MISSIONS ACCOMPLISHED</span>
            </div>
            <div className="text-2xl font-mono font-bold text-green-400">
              {summary?.completed || 0}
            </div>
            <div className="text-xs text-gray-400 font-mono">Achievements unlocked</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(59, 130, 246, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-blue-400" />
              <span className="font-mono font-bold text-white">CURRENT MISSIONS</span>
            </div>
            <div className="text-2xl font-mono font-bold text-blue-400">
              {summary?.inProgress || 0}
            </div>
            <div className="text-xs text-gray-400 font-mono">Active objectives</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(107, 114, 128, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="flex items-center gap-3 mb-2">
              <Lock size={20} className="text-gray-400" />
              <span className="font-mono font-bold text-white">LOCKED</span>
            </div>
            <div className="text-2xl font-mono font-bold text-gray-400">
              {summary?.locked || 0}
            </div>
            <div className="text-xs text-gray-400 font-mono">Awaiting unlock</div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(251, 191, 36, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={20} className="text-yellow-400" />
              <span className="font-mono font-bold text-white">TOTAL</span>
            </div>
            <div className="text-2xl font-mono font-bold text-yellow-400">
              {achievements.length}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {achievements.length > 0 ? 
                `${Math.round((summary?.completed || 0) / achievements.length * 100)}% complete` : 
                '0% complete'
              }
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Active Missions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          ACTIVE MISSIONS
        </h3>
        
        <div className="grid gap-4">
          {/* Mission 1 - Level Up */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">RANK UP</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Reach Level {currentLevel + 1} to unlock "{nextLevelTitle}"
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              {xpInCurrentLevel}/{xpNeededForNextLevel} XP ({xpNeededForNextLevel - xpInCurrentLevel} needed)
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Mission 2 - Create Notes */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">CONTENT CREATOR</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Create 5 more notes this week
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{ width: `60%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              3/5 notes created this week
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>

          {/* Mission 3 - Use Tags */}
          <div className="bg-gray-900 border border-cyan-400 p-5 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <div className="mb-3">
              <div className="font-mono font-bold text-cyan-400 text-lg">ORGANIZER</div>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-4">
              Use tags in 10 different notes
            </div>
            <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                style={{ width: `30%` }}
              />
            </div>
            <div className="text-xs font-mono text-gray-400">
              3/10 notes with tags
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-400 mr-2" />
          RECENT ACHIEVEMENTS
        </h3>
        
        <div className="space-y-4">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.achievement?.id || achievement.id || index}
                className="bg-gray-900 border border-cyan-400 p-4 relative transition-all duration-300 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Make achievement cards match the style */}
                <AchievementCard achievement={achievement} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
              </motion.div>
            ))
          ) : (
            <div className="bg-gray-800 border-2 border-gray-600 p-6 text-center">
              <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
              <h3 className="font-mono text-lg font-bold text-white mb-2">NO ACHIEVEMENTS DETECTED</h3>
              <p className="text-gray-400 mb-4 font-mono">Create mission logs to unlock achievements!</p>
              <PixelButton
                onClick={() => console.log('Go to notes')}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<Star size={18} />}
              >
                BEGIN FIRST MISSION
              </PixelButton>
            </div>
          )}
        </div>
      </motion.div>

      {/* Achievement Tips Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
        
        <h4 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-400 mr-2" />
          ACHIEVEMENT PROTOCOLS
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <h5 className="text-white font-bold mb-2 font-mono">📝 DATA ENTRY ACHIEVEMENTS</h5>
            <ul className="space-y-1 text-sm text-gray-300 font-mono">
              <li>• Initialize first data entry</li>
              <li>• Process 1000+ data words total</li>
              <li>• Maintain 7-day entry streak</li>
            </ul>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
          
          <div className="bg-gray-900 border border-cyan-400 p-4 relative"
               style={{
                 boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
               }}>
            <h5 className="text-white font-bold mb-2 font-mono">📁 ORGANIZATION ACHIEVEMENTS</h5>
            <ul className="space-y-1 text-sm text-gray-300 font-mono">
              <li>• Deploy 10+ unique tags</li>
              <li>• Create folder/collection systems</li>
              <li>• Organize 50+ data entries</li>
            </ul>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AchievementsTab;