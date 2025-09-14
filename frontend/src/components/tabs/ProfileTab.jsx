import React from 'react';
import HeroCard from '../profile/HeroCard';
import { usePlayer } from '../../hooks/usePlayer';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';

const ProfileTab = ({ username = 'user', tabColor = '#A78BFA' }) => {
  const { player } = usePlayer();
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();

  return (
    <div className="p-6">
      {/* Hero Card - Direct Integration without Pink Wrapper */}
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