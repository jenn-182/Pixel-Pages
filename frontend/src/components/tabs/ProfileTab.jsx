import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import PixelButton from '../PixelButton';
import HiddenButton from '../easter-eggs/HiddenButton';
import { usePlayer } from '../../hooks/usePlayer';
import { useAchievements } from '../../hooks/useAchievements';
import { useNotes } from '../../hooks/useNotes';

const ProfileTab = () => {
  const { playerStats, loading: playerLoading } = usePlayer();
  const { summary } = useAchievements();
  const { notes } = useNotes();
  const [showAchievements, setShowAchievements] = useState(false);

  if (playerLoading) {
    return (
      <div className="text-center py-8 font-mono text-white">
        Loading player profile...
      </div>
    );
  }

  return (
    <div className="profile-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white mb-2">Player Profile</h1>
        <p className="text-gray-400 font-mono text-sm">Your digital adventure progress</p>
      </div>

      {/* Profile Card */}
      <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section with Hidden Easter Egg */}
          <div className="flex flex-col items-center relative">
            <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-32 h-32 overflow-hidden bg-yellow-400 relative">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-mono font-bold text-black">PP</span>
              </div>
              
            </div>
            
            <h3 className="font-mono text-lg font-bold mt-3 text-white">
              {playerStats?.username || 'PixelAdventurer'}
            </h3>
            <div className="border-2 border-yellow-400 bg-yellow-100 px-3 py-1 mt-2 text-black font-mono font-bold">
              Level {playerStats?.level || 1}
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1">
            <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-700 p-4 mb-4">
              <h4 className="font-mono font-bold mb-3 text-white text-lg">Player Stats</h4>
              <div className="space-y-4">
                {/* XP Bar */}
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span className="font-mono">Experience</span>
                    <span className="font-mono">
                      {playerStats?.experience || 0} / {playerStats?.experienceToNext || 100}
                    </span>
                  </div>
                  <div className="border-2 border-black bg-gray-200 h-4 relative">
                    <motion.div
                      className="bg-blue-500 h-full transition-all duration-1000"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((playerStats?.experience || 0) / (playerStats?.experienceToNext || 100)) * 100}%`
                      }}
                    />
                    <HiddenButton className="absolute top-1 right-1" />
                  </div>
                </div>

                {/* Other Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-600 p-3 border border-gray-500">
                    <div className="text-2xl font-mono font-bold text-yellow-400">
                      {playerStats?.totalNotes || notes.length}
                    </div>
                    <div className="text-xs text-gray-300 font-mono">Notes Created</div>
                  </div>
                  
                  <div className="bg-gray-600 p-3 border border-gray-500">
                    <div className="text-2xl font-mono font-bold text-green-400">
                      {playerStats?.totalWords || 0}
                    </div>
                    <div className="text-xs text-gray-300 font-mono">Total Words</div>
                  </div>
                  
                  <div className="bg-gray-600 p-3 border border-gray-500">
                    <div className="text-2xl font-mono font-bold text-purple-400">
                      {playerStats?.uniqueTags || 0}
                    </div>
                    <div className="text-xs text-gray-300 font-mono">Unique Tags</div>
                  </div>
                  
                  <div className="bg-gray-600 p-3 border border-gray-500">
                    <div className="text-2xl font-mono font-bold text-orange-400">
                      {summary?.completed || 0}
                    </div>
                    <div className="text-xs text-gray-300 font-mono">Achievements</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Summary */}
            <div className="border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-700 p-4 mb-4">
              <h4 className="font-mono font-bold mb-3 text-white text-lg">Achievement Progress</h4>
              <div className="flex gap-4 text-sm font-mono">
                <span className="text-green-400">✓ {summary?.completed || 0} Completed</span>
                <span className="text-blue-400">⚡ {summary?.inProgress || 0} In Progress</span>
                <span className="text-gray-400">🔒 {summary?.locked || 0} Locked</span>
              </div>
            </div>

            {/* Action Button */}
            <PixelButton
              onClick={() => setShowAchievements(true)}
              color="bg-purple-400"
              hoverColor="hover:bg-purple-500"
              icon={<Trophy size={18} />}
              className="w-full"
            >
              View All Achievements
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Gaming Tips */}
      <div className="mt-8 border-2 border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-800 p-4 max-w-4xl mx-auto">
        <h4 className="font-mono font-bold mb-2 text-white">Pro Tips</h4>
        <ul className="text-gray-300 font-mono text-sm space-y-1">
          <li>• Create notes to gain XP and level up</li>
          <li>• Use tags to organize and earn bonus points</li>
          <li>• Longer notes give more experience</li>
          <li>• Keep exploring to unlock hidden features...</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileTab;