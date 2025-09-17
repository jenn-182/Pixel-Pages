import React from 'react';
import SparkleTrail from '../profile/SparkleTrail';
import HeroCard from '../profile/HeroCard';
import ProfileStats from '../profile/ProfileStats';
import AboutPlayer from '../profile/AboutPlayer';
import FavoriteBadges from '../profile/FavoriteBadges';
import SkillTreeWidget from '../profile/SkillTreeWidget';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';
import DataStreamCursor from '../profile/CursorEffects';

const ProfileTab = ({ username = 'Jroc_182', tabColor = '#A78BFA' }) => { // Changed default
  const { player } = usePlayer();
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();

  return (
    <div className="p-6 space-y-6">
      <SparkleTrail />
       <DataStreamCursor />
      {/* Hero Card - Direct Integration without Pink Wrapper */}
      <HeroCard 
        player={player} 
        notes={notes} 
        tasks={tasks} 
        taskLists={taskLists} 
      />
      
      {/* About Player - Player information and bio */}
      <AboutPlayer />
      
      {/* Favorite Badges - Showcase selected achievements */}
      <FavoriteBadges />
      
      {/* Profile Stats - Performance metrics */}
      <ProfileStats 
        notes={notes} 
        tasks={tasks} 
        taskLists={taskLists} 
      />
      
      {/* Skill Tree Widget - Player skills and progression */}
      <SkillTreeWidget />
    </div>
  );
};

export default ProfileTab;