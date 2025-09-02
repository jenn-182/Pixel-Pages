import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import HeroCard from '../profile/HeroCard';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';

const ProfileTab = ({ tabColor = '#EC4899' }) => {
  const { player } = usePlayer();
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();

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
    </div>
  );
};

export default ProfileTab;