import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import HeroCard from '../profile/HeroCard';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';
import { playerRanks, getRankByXP, getNextRank } from '../../data/ranks';
import achievementService from '../../services/achievementService';

const ProfileTab = ({ username = 'user', tabColor = '#A78BFA' }) => {
  const { player } = usePlayer();
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();
  const [playerData, setPlayerData] = useState({});

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = () => {
    const achievementStats = achievementService.getStats();
    const totalXP = achievementStats.totalXP;
    const currentRank = getRankByXP(totalXP);
    const nextRank = getNextRank(currentRank.level);
    
    setPlayerData({
      totalXP,
      currentRank,
      nextRank,
      achievementStats
    });
  };

  const renderXPSection = () => (
    <div className="bg-gray-800 border-2 p-6 mb-6" style={{ borderColor: tabColor }}>
      <h3 className="font-mono font-bold text-lg mb-4" style={{ color: tabColor }}>
        RANK & EXPERIENCE
      </h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-16 h-16 border-4 rounded-full flex items-center justify-center text-2xl"
          style={{ 
            borderColor: playerData.currentRank?.color,
            backgroundColor: `${playerData.currentRank?.color}20`
          }}
        >
          {playerData.currentRank?.icon}
        </div>
        
        <div className="flex-1">
          <div className="font-mono font-bold text-xl text-white">
            {playerData.currentRank?.name}
          </div>
          <div className="font-mono text-sm text-gray-400">
            Level {playerData.currentRank?.level}
          </div>
          <div className="font-mono text-sm" style={{ color: tabColor }}>
            {playerData.totalXP} XP Total
          </div>
        </div>
      </div>
      
      {playerData.nextRank && (
        <div>
          <div className="flex justify-between text-sm font-mono mb-2">
            <span className="text-gray-400">Progress to {playerData.nextRank.name}</span>
            <span className="text-gray-400">
              {playerData.totalXP - playerData.currentRank.minXP} / {playerData.nextRank.minXP - playerData.currentRank.minXP}
            </span>
          </div>
          <div className="w-full bg-gray-700 h-3 border border-gray-600">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${((playerData.totalXP - playerData.currentRank.minXP) / (playerData.nextRank.minXP - playerData.currentRank.minXP)) * 100}%`,
                backgroundColor: playerData.nextRank.color
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Enhanced Header - Matching Dashboard Style */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          <h1 className="font-mono text-3xl font-bold text-white">
            PLAYER PROFILE
          </h1>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-400 font-mono text-sm">
            Your player rank, mission and log statistics.
          </p>
        </div>
      </motion.div>

      {/* Enhanced Hero Card with Dashboard Styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-pink-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
        style={{
          boxShadow: '0 0 15px rgba(236, 72, 153, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
        }}
      >
        {/* Subtle gradient overlay - matching dashboard sections */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 to-pink-700/20 pointer-events-none" />
        <div className="absolute inset-0 border-2 border-pink-500 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
          <HeroCard 
            player={player} 
            notes={notes} 
            tasks={tasks} 
            taskLists={taskLists} 
          />
        </div>
      </motion.div>

      {/* XP and Rank Section */}
      {renderXPSection()}
    </div>
  );
};

export default ProfileTab;