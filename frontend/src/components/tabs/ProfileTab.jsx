import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import PixelButton from '../PixelButton';
import HiddenButton from '../easter-eggs/HiddenButton';
import { usePlayer } from '../../hooks/usePlayer';
import { useAchievements } from '../../hooks/useAchievements';
import useNotes from '../../hooks/useNotes';
import HeroCard from '../profile/HeroCard';

const ProfileTab = ({ tabColor = '#A78BFA' }) => {
  const { player, loading: playerLoading } = usePlayer();
  const { summary } = useAchievements();
  const { notes, loading: notesLoading } = useNotes();
  const [showAchievements, setShowAchievements] = useState(false);

  const loading = playerLoading || notesLoading;

  if (loading) {
    return (
      <div className="profile-tab-container p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 font-mono">Loading player profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-tab-container p-6">
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
          View player statistics and mission progression.
        </p>
      </div>

      {/* Hero Card Section */}
      <div className="mb-8">
        <HeroCard player={player} notes={notes} />
      </div>
    </div>
  );
};

export default ProfileTab;