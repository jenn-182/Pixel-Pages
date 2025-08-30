import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import AchievementCard from '../achievements/AchievementCard';
import { useAchievements } from '../../hooks/useAchievements';

const AchievementsTab = ({ tabColor = '#8B5CF6' }) => {
  const { achievements, summary, loading } = useAchievements();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, inProgress, locked

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

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
            <PixelInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search achievement database..."
              className="pl-10 bg-gray-900 border-cyan-400 text-white"
              style={{ color: '#fff' }}
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-sm text-gray-400 mr-2 flex items-center">
              <Filter size={16} className="mr-1" /> STATUS FILTER:
            </span>
            {statusFilters.map(status => {
              const IconComponent = status.icon;
              return (
                <PixelButton
                  key={status.id}
                  onClick={() => setFilterStatus(status.id)}
                  color={filterStatus === status.id ? status.color : 'bg-gray-600'}
                  hoverColor={filterStatus === status.id ? status.color.replace('400', '500') : 'hover:bg-gray-500'}
                  icon={<IconComponent size={16} />}
                  size="sm"
                >
                  {status.name.toUpperCase()}
                </PixelButton>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Search Results Info */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 font-mono bg-gray-800 border border-gray-600 p-3">
            <span className="text-cyan-400">SCAN RESULTS:</span> {filteredAchievements.length} of {achievements.length} achievements
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Achievements Grid */}
      {loading ? (
        <div className="text-center py-8 font-mono text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Trophy size={32} className="text-yellow-400" />
          </motion.div>
          <div className="text-cyan-400">LOADING ACHIEVEMENT DATABASE...</div>
        </div>
      ) : filteredAchievements.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
          style={{
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="absolute inset-0 border-2 border-cyan-400 opacity-50 animate-pulse pointer-events-none" />
          
          <h3 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <div className="w-4 h-4 bg-cyan-400 mr-2" />
            ACHIEVEMENT DATABASE
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
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
            ))}
          </div>
        </motion.div>
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