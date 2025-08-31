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
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          PLAYER PROFILE
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Your player rank, mission and log statistics.
        </p>
      </div>

      {/* Enhanced Hero Card with Task Insights */}
      <HeroCard 
        player={player} 
        notes={notes} 
        tasks={tasks} 
        taskLists={taskLists} 
      />
    </div>
  );
};

export default ProfileTab;