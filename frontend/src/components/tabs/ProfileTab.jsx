import React from 'react';
import HeroCard from '../profile/HeroCard';
import ProfileStats from '../profile/ProfileStats';
import FavoriteBadges from '../profile/FavoriteBadges';
import SkillTreeWidget from '../profile/SkillTreeWidget';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';

const ProfileTab = ({ username = 'user', tabColor = '#A78BFA' }) => {
  const { player } = usePlayer();
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();

  return (
    <div className="p-6 space-y-6">
      {/* Hero Card - Direct Integration without Pink Wrapper */}
      <HeroCard 
        player={player} 
        notes={notes} 
        tasks={tasks} 
        taskLists={taskLists} 
      />
      
      {/* Skill Tree Widget */}
      <SkillTreeWidget />
      
      {/* Profile Stats */}
      <ProfileStats 
        notes={notes} 
        tasks={tasks} 
        taskLists={taskLists} 
      />
      
      {/* Favorite Badges - Showcase selected achievements */}
      <FavoriteBadges />
    </div>
  );
};

export default ProfileTab;