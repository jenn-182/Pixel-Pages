import { noteAchievements } from './noteAchievements';
import { focusAchievements } from './focusAchievements';
import { taskAchievements } from './taskAchievements';
import { specialAchievements } from './specialAchievements';

// Combine all achievements
export const allAchievements = [
  ...noteAchievements,
  ...focusAchievements,
  ...taskAchievements,
  ...specialAchievements
];

// Export by category
export const achievementsByCategory = {
  notes: noteAchievements,
  focus: focusAchievements,
  tasks: taskAchievements,
  special: specialAchievements,
  combo: specialAchievements.filter(a => a.category === 'combo'),
  meta: specialAchievements.filter(a => a.category === 'meta')
};

// Export by tier
export const achievementsByTier = {
  common: allAchievements.filter(a => a.tier === 'common'),
  uncommon: allAchievements.filter(a => a.tier === 'uncommon'),
  rare: allAchievements.filter(a => a.tier === 'rare'),
  legendary: allAchievements.filter(a => a.tier === 'legendary')
};

// Tier colors and info
export const tierInfo = {
  common: {
    color: '#10B981',
    name: 'Common',
    emoji: '🟢',
    description: 'Easy entry-level unlocks',
    glow: 'rgba(16, 185, 129, 0.3)'
  },
  uncommon: {
    color: '#3B82F6', 
    name: 'Uncommon',
    emoji: '🔵',
    description: 'Regular user milestones',
    glow: 'rgba(59, 130, 246, 0.3)'
  },
  rare: {
    color: '#8B5CF6',
    name: 'Rare', 
    emoji: '🟣',
    description: 'Dedicated user rewards',
    glow: 'rgba(139, 92, 246, 0.3)'
  },
  legendary: {
    color: '#F59E0B',
    name: 'Legendary',
    emoji: '🟡',
    description: 'Elite mastery tier',
    glow: 'rgba(245, 158, 11, 0.4)'
  }
};

// Achievement statistics
export const achievementStats = {
  total: allAchievements.length,
  byTier: {
    common: achievementsByTier.common.length,
    uncommon: achievementsByTier.uncommon.length,
    rare: achievementsByTier.rare.length,
    legendary: achievementsByTier.legendary.length
  },
  byCategory: {
    notes: noteAchievements.length,
    focus: focusAchievements.length,
    tasks: taskAchievements.length,
    special: specialAchievements.length
  }
};

// Helper functions
export const getAchievementById = (id) => {
  return allAchievements.find(achievement => achievement.id === id);
};

export const getAchievementsByCategory = (category) => {
  return allAchievements.filter(achievement => achievement.category === category);
};

export const getAchievementsByTier = (tier) => {
  return allAchievements.filter(achievement => achievement.tier === tier);
};

export const getRandomAchievement = (tier = null) => {
  const pool = tier ? achievementsByTier[tier] : allAchievements;
  return pool[Math.floor(Math.random() * pool.length)];
};

export const searchAchievements = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return allAchievements.filter(achievement => 
    achievement.name.toLowerCase().includes(lowercaseQuery) ||
    achievement.description.toLowerCase().includes(lowercaseQuery) ||
    achievement.category.toLowerCase().includes(lowercaseQuery) ||
    achievement.tier.toLowerCase().includes(lowercaseQuery)
  );
};