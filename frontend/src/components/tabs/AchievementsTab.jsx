import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import PixelButton from '../PixelButton';
import PixelInput from '../PixelInput';
import AchievementCard from '../achievements/AchievementCard';
import { useAchievements } from '../../hooks/useAchievements';

const AchievementsTab = () => {
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
        <h1 className="font-mono text-2xl font-bold text-white mb-2 flex items-center gap-3">
          Achievements
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Trophy size={24} className="text-yellow-400" />
          </motion.div>
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Track your progress and unlock rewards as you use Pixel Pages
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="border-2 border-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-400" />
            <span className="font-mono font-bold text-white">Completed</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-400">
            {summary?.completed || 0}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {achievements.length > 0 ? 
              `${Math.round((summary?.completed || 0) / achievements.length * 100)}% complete` : 
              '0% complete'
            }
          </div>
        </div>

        <div className="border-2 border-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-blue-400" />
            <span className="font-mono font-bold text-white">In Progress</span>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">
            {summary?.inProgress || 0}
          </div>
          <div className="text-xs text-gray-400 font-mono">Active goals</div>
        </div>

        <div className="border-2 border-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={20} className="text-gray-400" />
            <span className="font-mono font-bold text-white">Locked</span>
          </div>
          <div className="text-2xl font-mono font-bold text-gray-400">
            {summary?.locked || 0}
          </div>
          <div className="text-xs text-gray-400 font-mono">To discover</div>
        </div>

        <div className="border-2 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={20} className="text-yellow-400" />
            <span className="font-mono font-bold text-white">Total</span>
          </div>
          <div className="text-2xl font-mono font-bold text-yellow-400">
            {achievements.length}
          </div>
          <div className="text-xs text-gray-400 font-mono">Achievements</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <PixelInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search achievements..."
            className="pl-10"
            style={{ color: '#000' }}
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="font-mono text-sm text-gray-400 mr-2 flex items-center">
            <Filter size={16} className="mr-1" /> Status:
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
                {status.name}
              </PixelButton>
            );
          })}
        </div>
      </div>

      {/* Search Results Info */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 font-mono">
            Showing {filteredAchievements.length} of {achievements.length} achievements
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
          <div>Loading achievements...</div>
        </div>
      ) : filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.achievement?.id || achievement.id || index}
              achievement={achievement}
            />
          ))}
        </div>
      ) : (
        <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-8 text-center">
          {searchTerm || filterStatus !== 'all' ? (
            <div>
              <h3 className="font-mono text-lg font-bold mb-2 text-white">No achievements found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <div className="flex gap-2 justify-center">
                <PixelButton
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  color="bg-blue-400"
                  hoverColor="hover:bg-blue-500"
                >
                  Clear Filters
                </PixelButton>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-mono text-lg font-bold mb-2 text-white">No achievements yet</h3>
              <p className="text-gray-400 mb-4">Start creating notes to unlock your first achievements!</p>
              <PixelButton
                onClick={() => console.log('Go to notes')}
                color="bg-green-400"
                hoverColor="hover:bg-green-500"
                icon={<Star size={18} />}
              >
                Create Your First Note
              </PixelButton>
            </div>
          )}
        </div>
      )}

      {/* Achievement Tips */}
      <div className="mt-8 border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-6">
        <h4 className="font-mono text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Star size={20} className="text-yellow-400" />
          Achievement Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 font-mono">
          <div>
            <h5 className="text-white font-bold mb-2">📝 Writing Achievements</h5>
            <ul className="space-y-1">
              <li>• Create your first note</li>
              <li>• Write 1000+ words total</li>
              <li>• Create notes for 7 days straight</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-2">📁 Organization Achievements</h5>
            <ul className="space-y-1">
              <li>• Use 10+ different tags</li>
              <li>• Create folders and notebooks</li>
              <li>• Organize 50+ notes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab;