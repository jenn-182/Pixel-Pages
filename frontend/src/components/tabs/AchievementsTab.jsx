import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, Clock, Search, Filter, Crown, Zap, Target, Award, Sparkles, Shield, Gem } from 'lucide-react';
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

  const tabColorRgb = '139, 92, 246'; // RGB values for #8B5CF6

  // Mock achievement data with colorful badges
  const mockAchievements = [
    {
      id: 1,
      achievement: {
        id: 1,
        name: "First Entry",
        description: "Created your first mission log",
        rarity: "common"
      },
      completed: true,
      progress: 100,
      badgeColor: "#06B6D4",
      badgeGradient: "from-green-400 to-emerald-500"
    },
    {
      id: 2,
      achievement: {
        id: 2,
        name: "Word Smith",
        description: "Logged 500+ words total",
        rarity: "rare"
      },
      completed: true,
      progress: 100,
      badgeColor: "#FBBF24", 
      badgeGradient: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      achievement: {
        id: 3,
        name: "Speed Runner",
        description: "Completed 5 tasks in one day",
        rarity: "uncommon"
      },
      completed: true,
      progress: 100,
      badgeColor: "#F472B6", 
      badgeGradient: "from-pink-400 to-pink-600"
    }
  ];

  const mockSummary = {
    completed: 3,
    inProgress: 3,
    locked: 18
  };

  // Use mock data for now
  const displayAchievements = mockAchievements;
  const displaySummary = mockSummary;

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

  const totalXP = calculateTotalXP(notes || []);
  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 50;
  const nextLevelXP = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = totalXP - currentLevelBaseXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelBaseXP;
  const progressPercentage = Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  const nextLevelTitle = getRankNameForLevel(currentLevel + 1);

  // Filter achievements based on search and status
  const filteredAchievements = displayAchievements.filter(achievement => {
    const matchesSearch = !searchTerm || 
      achievement.achievement?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.achievement?.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && achievement.completed) ||
      (filterStatus === 'inProgress' && !achievement.completed && achievement.progress > 0) ||
      (filterStatus === 'locked' && achievement.progress === 0);

    return matchesSearch && matchesStatus;
  });

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return Star;
      case 'rare': return Award;
      case 'epic': return Shield;
      case 'legendary': return Crown;
      default: return Trophy;
    }
  };

  const getRarityShine = (rarity) => {
    switch (rarity) {
      case 'common': return 'animate-pulse';
      case 'rare': return 'animate-pulse';
      case 'epic': return 'animate-bounce';
      case 'legendary': return 'animate-pulse';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          ACHIEVEMENT TERMINAL
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          View your badges and unlock achievements by completing logs and missions.
        </p>
      </div>

      {/* Progress Summary */}
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
                 backgroundColor: '#1A0E26' // Even darker gray-purple
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <Trophy className="mr-2" size={20} style={{ color: tabColor }} />
              PROGRESS METRICS
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.12))' }} />
                <div className="relative z-10">
                  <CheckCircle size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">COMPLETED</div>
                  <div className="text-2xl font-mono font-bold text-green-400">
                    {displaySummary?.completed || 0}
                  </div>
                </div>
              </div>

              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(59, 130, 246, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.12))' }} />
                <div className="relative z-10">
                  <Clock size={20} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">IN PROGRESS</div>
                  <div className="text-2xl font-mono font-bold text-blue-400">
                    {displaySummary?.inProgress || 0}
                  </div>
                </div>
              </div>

              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(107, 114, 128, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(107, 114, 128, 0.08), rgba(107, 114, 128, 0.12))' }} />
                <div className="relative z-10">
                  <Lock size={20} className="text-gray-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">LOCKED</div>
                  <div className="text-2xl font-mono font-bold text-gray-400">
                    {displaySummary?.locked || 0}
                  </div>
                </div>
              </div>

              <div className="bg-black border text-center p-4 relative transition-all duration-200"
                   style={{
                     borderColor: '#4B5563',
                     boxShadow: '0 0 3px rgba(251, 191, 36, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                   }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.08), rgba(251, 191, 36, 0.12))' }} />
                <div className="relative z-10">
                  <Trophy size={20} className="text-yellow-400 mx-auto mb-2" />
                  <div className="text-xs font-mono text-gray-400 mb-1">TOTAL</div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">
                    {displayAchievements.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges Section - Moved above Active Missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
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
                 backgroundColor: '#1A0E26' // Even darker gray-purple
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <Award className="mr-2" size={20} style={{ color: tabColor }} />
              ACHIEVEMENT BADGES
            </h3>
          </div>
          
          <div className="p-6">
            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement, index) => {
                  const RarityIcon = getRarityIcon(achievement.achievement.rarity);
                  return (
                    <motion.div
                      key={achievement.achievement?.id || achievement.id || index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="bg-black border-2 p-4 relative transition-all duration-300 hover:scale-105 cursor-pointer group"
                      style={{
                        borderColor: achievement.completed ? achievement.badgeColor : '#4B5563',
                        boxShadow: achievement.completed 
                          ? `0 0 20px ${achievement.badgeColor}60, 0 0 40px ${achievement.badgeColor}30, 2px 2px 0px 0px rgba(0,0,0,1)`
                          : '0 0 3px rgba(75, 85, 99, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                      }}
                    >
                      {achievement.completed && (
                        <>
                          {/* Shiny overlay */}
                          <div className="absolute inset-0 pointer-events-none opacity-30 animate-pulse"
                               style={{ 
                                 background: `linear-gradient(135deg, ${achievement.badgeColor}40, ${achievement.badgeColor}20, ${achievement.badgeColor}60)` 
                               }} />
                          
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 pointer-events-none opacity-50 animate-pulse"
                               style={{ 
                                 background: `linear-gradient(45deg, transparent 30%, ${achievement.badgeColor}20 50%, transparent 70%)`,
                                 animation: 'shimmer 2s infinite'
                               }} />
                        </>
                      )}
                      
                      <div className="relative z-10 text-center">
                        {/* Badge Icon */}
                        <div className="mb-3 flex justify-center">
                          <div 
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative overflow-hidden ${
                              achievement.completed ? 'animate-pulse' : ''
                            }`}
                            style={{
                              borderColor: achievement.completed ? achievement.badgeColor : '#6B7280',
                              background: achievement.completed 
                                ? `radial-gradient(circle, ${achievement.badgeColor}40, ${achievement.badgeColor}20)`
                                : 'radial-gradient(circle, #37414940, #37414920)',
                              boxShadow: achievement.completed 
                                ? `0 0 25px ${achievement.badgeColor}70, inset 0 0 15px ${achievement.badgeColor}30`
                                : 'none'
                            }}
                          >
                            {achievement.completed ? (
                              <RarityIcon 
                                size={20} 
                                className="text-white filter drop-shadow-lg"
                                style={{ 
                                  color: '#ffffff',
                                  filter: `drop-shadow(0 0 8px ${achievement.badgeColor})`
                                }}
                              />
                            ) : (
                              <Lock size={16} className="text-gray-500" />
                            )}
                            
                            {/* Inner glow for completed badges */}
                            {achievement.completed && (
                              <div 
                                className="absolute inset-0 rounded-full opacity-30 animate-ping"
                                style={{ 
                                  background: `radial-gradient(circle, ${achievement.badgeColor}60, transparent 70%)`
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Badge Details */}
                        <h4 className={`font-mono font-bold text-sm mb-2 ${
                          achievement.completed ? 'text-white' : 'text-gray-500'
                        }`}>
                          {achievement.achievement.name}
                        </h4>
                        
                        <p className={`text-xs font-mono mb-3 ${
                          achievement.completed ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {achievement.achievement.description}
                        </p>

                        {/* Rarity Badge */}
                        <div className="flex justify-center">
                          <div 
                            className={`px-2 py-1 text-xs font-mono font-bold border flex items-center gap-1 ${
                              achievement.completed ? 'animate-pulse' : 'opacity-50'
                            }`}
                            style={{
                              color: achievement.completed ? achievement.badgeColor : '#6B7280',
                              borderColor: achievement.completed ? achievement.badgeColor : '#6B7280',
                              backgroundColor: achievement.completed ? `${achievement.badgeColor}25` : 'transparent',
                              boxShadow: achievement.completed ? `0 0 10px ${achievement.badgeColor}30` : 'none'
                            }}
                          >
                            <RarityIcon size={10} />
                            {achievement.achievement.rarity?.toUpperCase() || 'COMMON'}
                          </div>
                        </div>

                        {/* Progress Bar for incomplete achievements */}
                        {!achievement.completed && achievement.progress > 0 && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-700 h-1 border border-gray-600 rounded">
                              <div 
                                className="h-full rounded transition-all duration-500"
                                style={{ 
                                  width: `${achievement.progress}%`,
                                  background: `linear-gradient(to right, ${achievement.badgeColor}80, ${achievement.badgeColor})`
                                }}
                              />
                            </div>
                            <div className="text-xs font-mono text-gray-400 mt-1">
                              {achievement.progress}% Complete
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hover glow effect */}
                      {achievement.completed && (
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"
                          style={{ 
                            background: `radial-gradient(circle, ${achievement.badgeColor}60, transparent 70%)`
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy size={48} className="text-gray-500 mx-auto mb-3" />
                <h3 className="font-mono text-lg font-bold text-white mb-2">NO ACHIEVEMENTS DETECTED</h3>
                <p className="text-gray-400 mb-4 font-mono">Create mission logs to unlock achievements!</p>
                <button
                  className="bg-black border px-4 py-2 font-mono font-bold transition-all duration-200"
                  style={{
                    borderColor: tabColor,
                    color: tabColor,
                    boxShadow: `0 0 3px rgba(${tabColorRgb}, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `rgba(${tabColorRgb}, 0.1)`;
                    e.target.style.boxShadow = `0 0 8px rgba(${tabColorRgb}, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'black';
                    e.target.style.boxShadow = `0 0 3px rgba(${tabColorRgb}, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)`;
                  }}
                >
                  <Star size={16} className="inline mr-2" />
                  BEGIN FIRST MISSION
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Missions Section - Moved below Achievement Badges */}
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
                 backgroundColor: '#1A0E26' // Even darker gray-purple
               }}>
            <h3 className="text-lg font-mono font-bold text-white flex items-center">
              <Target className="mr-2" size={20} style={{ color: tabColor }} />
              ACTIVE MISSIONS
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Mission 1 - Level Up */}
            <div className="bg-black border p-4 relative transition-all duration-200"
                 style={{
                   borderColor: '#4B5563',
                   boxShadow: '0 0 3px rgba(139, 92, 246, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: `linear-gradient(to bottom right, rgba(${tabColorRgb}, 0.08), rgba(${tabColorRgb}, 0.12))` }} />
              <div className="relative z-10">
                <div className="mb-3">
                  <div className="font-mono font-bold text-white text-lg flex items-center">
                    <Crown size={16} className="mr-2" style={{ color: tabColor }} />
                    RANK UP
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-300 mb-4">
                  Reach Level {currentLevel + 1} to unlock "{nextLevelTitle}"
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600 mb-2">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${progressPercentage}%`,
                      background: `linear-gradient(to right, ${tabColor}, rgba(${tabColorRgb}, 0.7))`
                    }}
                  />
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {xpInCurrentLevel}/{xpNeededForNextLevel} XP ({xpNeededForNextLevel - xpInCurrentLevel} needed)
                </div>
              </div>
            </div>

            {/* Mission 2 - Create Notes */}
            <div className="bg-black border p-4 relative transition-all duration-200"
                 style={{
                   borderColor: '#4B5563',
                   boxShadow: '0 0 3px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'linear-gradient(to bottom right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.12))' }} />
              <div className="relative z-10">
                <div className="mb-3">
                  <div className="font-mono font-bold text-white text-lg flex items-center">
                    <Zap size={16} className="mr-2 text-green-400" />
                    CONTENT CREATOR
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-300 mb-4">
                  Create 5 more notes this week
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600 mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500"
                    style={{ width: `60%` }}
                  />
                </div>
                <div className="text-xs font-mono text-gray-400">
                  3/5 notes created this week
                </div>
              </div>
            </div>

            {/* Mission 3 - Use Tags */}
            <div className="bg-black border p-4 relative transition-all duration-200"
                 style={{
                   borderColor: '#4B5563',
                   boxShadow: '0 0 3px rgba(245, 158, 11, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
                 }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.12))' }} />
              <div className="relative z-10">
                <div className="mb-3">
                  <div className="font-mono font-bold text-white text-lg flex items-center">
                    <Star size={16} className="mr-2 text-yellow-400" />
                    ORGANIZER
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-300 mb-4">
                  Use tags in 10 different notes
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600 mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    style={{ width: `30%` }}
                  />
                </div>
                <div className="text-xs font-mono text-gray-400">
                  3/10 notes with tags
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AchievementsTab;