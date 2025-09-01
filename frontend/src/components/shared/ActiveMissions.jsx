import React from 'react';
import { motion } from 'framer-motion';
import { Target, Crown, Zap } from 'lucide-react';

const ActiveMissions = ({ notes = [], compact = false }) => {
  // Calculate level and progress (same logic from AchievementsTab)
  const calculateTotalXP = (notes) => {
    let totalXP = 0;
    for (const note of notes) {
      totalXP += 10;
      const wordCount = note.content ? note.content.split(/\s+/).length : 0;
      totalXP += Math.min(Math.floor(wordCount / 10), 50);
      const tags = note.tagsString ? note.tagsString.split(',').filter(tag => tag.trim()) : [];
      totalXP += tags.length * 5;
      if (note.title && note.title.length > 20) {
        totalXP += 5;
      }
    }
    return totalXP;
  };

  const calculateLevelFromXP = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 50.0)) + 1;
  };

  const getRankNameForLevel = (level) => {
    switch (level) {
      case 1: return "Novice Scribe";
      case 2: return "Apprentice Writer";
      case 3: return "Skilled Chronicler";
      case 4: return "Expert Documentarian";
      case 5: return "Master Archivist";
      case 6: return "Elite Wordsmith";
      case 7: return "Distinguished Author";
      case 8: return "Legendary Scribe";
      case 9: return "Mythical Chronicler";
      case 10: return "Grandmaster of Words";
      default: return level < 15 ? `Ascended Writer` : `Transcendent Scribe`;
    }
  };

  const totalXP = calculateTotalXP(notes);
  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 50;
  const nextLevelXP = Math.pow(currentLevel, 2) * 50;
  const xpInCurrentLevel = totalXP - currentLevelBaseXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelBaseXP;
  const progressPercentage = Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  const nextLevelTitle = getRankNameForLevel(currentLevel + 1);

  // Calculate weekly progress
  const thisWeekNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt || note.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate >= weekAgo;
  }).length;

  const notesWithTags = notes.filter(note => {
    const tags = note.tagsString || note.tags || '';
    return tags.trim().length > 0;
  }).length;

  const missions = [
    {
      id: 'level-up',
      title: 'RANK UP',
      description: `Reach Level ${currentLevel + 1} to unlock "${nextLevelTitle}"`,
      progress: progressPercentage,
      current: xpInCurrentLevel,
      target: xpNeededForNextLevel,
      unit: 'XP',
      color: 'from-cyan-400 to-purple-500',
      icon: Crown
    },
    {
      id: 'weekly-notes',
      title: 'CONTENT CREATOR',
      description: 'Create 5 more notes this week',
      progress: Math.min((thisWeekNotes / 5) * 100, 100),
      current: thisWeekNotes,
      target: 5,
      unit: 'notes',
      color: 'from-green-400 to-blue-500',
      icon: Target
    },
    {
      id: 'tag-organizer',
      title: 'ORGANIZER',
      description: 'Use tags in 10 different notes',
      progress: Math.min((notesWithTags / 10) * 100, 100),
      current: notesWithTags,
      target: 10,
      unit: 'notes with tags',
      color: 'from-yellow-400 to-orange-500',
      icon: Zap
    }
  ];

  const activeMissions = missions.filter(mission => mission.progress < 100);
  const displayMissions = compact ? activeMissions.slice(0, 2) : activeMissions;

  if (!compact) {
    return (
      <div className="space-y-4">
        {displayMissions.map((mission) => {
          const Icon = mission.icon;
          return (
            <div
              key={mission.id}
              className="bg-gray-900 border border-cyan-400 p-5 relative"
              style={{
                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <Icon size={20} className="text-cyan-400 mt-1" />
                <div className="flex-1">
                  <div className="font-mono font-bold text-cyan-400 text-lg">{mission.title}</div>
                  <div className="text-sm font-mono text-gray-300">{mission.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono font-bold">{mission.progress}%</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 h-3 border border-gray-600 mb-2">
                <div 
                  className={`h-full bg-gradient-to-r ${mission.color} transition-all duration-700`}
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              
              <div className="text-xs font-mono text-gray-400">
                {mission.current}/{mission.target} {mission.unit} 
                {mission.current < mission.target && ` (${mission.target - mission.current} needed)`}
              </div>
              
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400" />
            </div>
          );
        })}
      </div>
    );
  }

  // Compact version for dashboard
  return (
    <div className="space-y-3">
      {displayMissions.map((mission) => {
        const Icon = mission.icon;
        return (
          <div
            key={mission.id}
            className="bg-gray-900 border border-violet-400 p-3 relative"
            style={{
              boxShadow: '0 0 5px rgba(99, 102, 241, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-violet-400" />
              <div className="font-mono font-bold text-violet-400 text-sm">{mission.title}</div>
              <div className="ml-auto text-violet-400 font-mono text-xs">{mission.progress}%</div>
            </div>
            
            <div className="w-full bg-gray-700 h-2 border border-gray-600 mb-1">
              <div 
                className={`h-full bg-gradient-to-r ${mission.color}`}
                style={{ width: `${mission.progress}%` }}
              />
            </div>
            
            <div className="text-xs font-mono text-gray-400">
              {mission.current}/{mission.target} {mission.unit}
            </div>
          </div>
        );
      })}
      
      {activeMissions.length === 0 && (
        <div className="text-center py-4">
          <Crown size={32} className="text-violet-400 mx-auto mb-2" />
          <div className="text-sm font-mono text-violet-400">All missions complete!</div>
        </div>
      )}
    </div>
  );
};

export default ActiveMissions;