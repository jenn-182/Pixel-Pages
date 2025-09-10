export const specialAchievements = [
  // UNCOMMON TIER (6 achievements)
  {
    id: 'triple_threat',
    name: 'TRIPLE THREAT',
    description: 'Complete a note, task, and focus session in one day',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Star',
    requirement: {
      type: 'daily_combo',
      activities: ['note', 'task', 'focus']
    },
    xpReward: 500,
    color: '#3B82F6'
  },
  {
    id: 'balanced_user',
    name: 'BALANCED USER',
    description: 'Use all three features in one week',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Scale',
    requirement: {
      type: 'weekly_combo',
      activities: ['note', 'task', 'focus']
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'productivity_stack',
    name: 'PRODUCTIVITY STACK',
    description: 'Complete 5 tasks + 1 focus session + 1 note in one day',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Layers',
    requirement: {
      type: 'super_combo',
      tasks: 5,
      focus: 1,
      notes: 1
    },
    xpReward: 600,
    color: '#3B82F6'
  },
  {
    id: 'weekend_grinder',
    name: 'WEEKEND GRINDER',
    description: 'Complete activities on both weekend days',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Calendar',
    requirement: {
      type: 'weekend_activity',
      days: 2
    },
    xpReward: 400,
    color: '#3B82F6'
  },
  {
    id: 'midnight_oil',
    name: 'MIDNIGHT OIL',
    description: 'Complete activities after midnight',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Moon',
    requirement: {
      type: 'late_night_activity',
      hour: 0
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'early_riser',
    name: 'EARLY RISER',
    description: 'Complete activities before 6 AM',
    tier: 'uncommon',
    category: 'combo',
    icon: 'Sun',
    requirement: {
      type: 'early_morning_activity',
      hour: 6
    },
    xpReward: 300,
    color: '#3B82F6'
  },

  // RARE TIER (10 achievements)
  {
    id: 'power_user',
    name: 'POWER USER',
    description: 'Use all three features for 7 consecutive days',
    tier: 'rare',
    category: 'combo',
    icon: 'Zap',
    requirement: {
      type: 'combo_streak',
      activities: ['note', 'task', 'focus'],
      target: 7
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },
  {
    id: 'completionist',
    name: 'COMPLETIONIST',
    description: 'Reach 25% completion in all achievement categories',
    tier: 'rare',
    category: 'meta',
    icon: 'Award',
    requirement: {
      type: 'category_completion',
      percentage: 0.25
    },
    xpReward: 800,
    color: '#8B5CF6'
  },
  {
    id: 'habit_master',
    name: 'HABIT MASTER',
    description: 'Complete daily activities for 14 days',
    tier: 'rare',
    category: 'combo',
    icon: 'Repeat',
    requirement: {
      type: 'daily_activity_streak',
      target: 14
    },
    xpReward: 1200,
    color: '#8B5CF6'
  },
  {
    id: 'feature_explorer',
    name: 'FEATURE EXPLORER',
    description: 'Use every major feature at least once',
    tier: 'rare',
    category: 'meta',
    icon: 'Compass',
    requirement: {
      type: 'feature_usage',
      features: ['notes', 'tasks', 'focus', 'achievements', 'tracker']
    },
    xpReward: 600,
    color: '#8B5CF6'
  },
  {
    id: 'consistency_king',
    name: 'CONSISTENCY KING',
    description: 'Complete at least one activity every day for 21 days',
    tier: 'rare',
    category: 'combo',
    icon: 'Crown',
    requirement: {
      type: 'activity_consistency',
      target: 21
    },
    xpReward: 1500,
    color: '#8B5CF6'
  },
  {
    id: 'productivity_beast',
    name: 'PRODUCTIVITY BEAST',
    description: 'Complete 10+ activities in one day across all categories',
    tier: 'rare',
    category: 'combo',
    icon: 'Zap',
    requirement: {
      type: 'daily_activity_count',
      target: 10
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },
  {
    id: 'monthly_master',
    name: 'MONTHLY MASTER',
    description: 'Complete 100+ activities in one month',
    tier: 'rare',
    category: 'combo',
    icon: 'Calendar',
    requirement: {
      type: 'monthly_activity_count',
      target: 100
    },
    xpReward: 1200,
    color: '#8B5CF6'
  },
  {
    id: 'level_climber',
    name: 'LEVEL CLIMBER',
    description: 'Reach level 10 overall',
    tier: 'rare',
    category: 'meta',
    icon: 'TrendingUp',
    requirement: {
      type: 'player_level',
      target: 10
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },
  {
    id: 'xp_hunter',
    name: 'XP HUNTER',
    description: 'Earn 5000 total XP',
    tier: 'rare',
    category: 'meta',
    icon: 'Target',
    requirement: {
      type: 'total_xp',
      target: 5000
    },
    xpReward: 500,
    color: '#8B5CF6'
  },
  {
    id: 'achievement_hunter',
    name: 'ACHIEVEMENT HUNTER',
    description: 'Unlock 25 achievements',
    tier: 'rare',
    category: 'meta',
    icon: 'Trophy',
    requirement: {
      type: 'achievement_count',
      target: 25
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },

  // LEGENDARY TIER (6 achievements)
  {
    id: 'pixel_master',
    name: 'PIXEL MASTER',
    description: 'Unlock 50 total achievements',
    tier: 'legendary',
    category: 'meta',
    icon: 'Crown',
    requirement: {
      type: 'achievement_count',
      target: 50
    },
    xpReward: 3000,
    color: '#F59E0B'
  },
  {
    id: 'gaming_legend',
    name: 'GAMING LEGEND',
    description: 'Reach level 25 overall',
    tier: 'legendary',
    category: 'meta',
    icon: 'Star',
    requirement: {
      type: 'player_level',
      target: 25
    },
    xpReward: 5000,
    color: '#F59E0B'
  },
  {
    id: 'ultimate_completionist',
    name: 'ULTIMATE COMPLETIONIST',
    description: 'Unlock 75% of all achievements',
    tier: 'legendary',
    category: 'meta',
    icon: 'Award',
    requirement: {
      type: 'completion_percentage',
      target: 0.75
    },
    xpReward: 4000,
    color: '#F59E0B'
  },
  {
    id: 'eternal_grinder',
    name: 'ETERNAL GRINDER',
    description: 'Complete activities for 100 consecutive days',
    tier: 'legendary',
    category: 'combo',
    icon: 'Infinity',
    requirement: {
      type: 'activity_consistency',
      target: 100
    },
    xpReward: 10000,
    color: '#F59E0B'
  },
  {
    id: 'omnipotent_user',
    name: 'OMNIPOTENT USER',
    description: 'Master all categories (top 10% in each)',
    tier: 'legendary',
    category: 'meta',
    icon: 'Crown',
    requirement: {
      type: 'category_mastery',
      percentage: 0.9
    },
    xpReward: 7500,
    color: '#F59E0B'
  },
  {
    id: 'legendary_completionist',
    name: 'LEGENDARY COMPLETIONIST',
    description: 'Unlock 95% of all achievements',
    tier: 'legendary',
    category: 'meta',
    icon: 'Gem',
    requirement: {
      type: 'completion_percentage',
      target: 0.95
    },
    xpReward: 15000,
    color: '#F59E0B'
  }
];