export const focusAchievements = [
  // COMMON TIER (8 achievements)
  {
    id: 'focused_initiate',
    name: 'FOCUSED INITIATE',
    description: 'Complete your first grind',
    tier: 'common',
    category: 'focus',
    icon: 'Target',
    requirement: {
      type: 'session_count',
      target: 1
    },
    xpReward: 5,
    color: '#10B981'
  },
  {
    id: 'micro_master',
    name: 'MICRO MASTER',
    description: 'Complete 3 micro grinds (5-15 min)',
    tier: 'common',
    category: 'focus',
    icon: 'Clock',
    requirement: {
      type: 'session_duration_range',
      minDuration: 5,
      maxDuration: 15,
      target: 3
    },
    xpReward: 7,
    color: '#10B981'
  },
  {
    id: 'hour_apprentice',
    name: 'HOUR APPRENTICE',
    description: 'Spend 1 hour total grinding',
    tier: 'common',
    category: 'focus',
    icon: 'Clock',
    requirement: {
      type: 'total_time',
      target: 60 // minutes
    },
    xpReward: 8,
    color: '#10B981'
  },
  {
    id: 'quick_burst',
    name: 'QUICK BURST',
    description: 'Complete a 5-minute grind',
    tier: 'common',
    category: 'focus',
    icon: 'Zap',
    requirement: {
      type: 'single_session_duration',
      target: 5
    },
    xpReward: 4,
    color: '#10B981'
  },
  {
    id: 'pomodoro_starter',
    name: 'POMODORO STARTER',
    description: 'Complete your first 25-minute grind',
    tier: 'common',
    category: 'focus',
    icon: 'Target',
    requirement: {
      type: 'single_session_duration',
      target: 25
    },
    xpReward: 7,
    color: '#10B981'
  },
  {
    id: 'break_taker',
    name: 'BREAK TAKER',
    description: 'Take a 5-minute grind break',
    tier: 'common',
    category: 'focus',
    icon: 'Coffee',
    requirement: {
      type: 'break_session',
      target: 5
    },
    xpReward: 3,
    color: '#10B981'
  },
  {
    id: 'morning_focus',
    name: 'MORNING FOCUS',
    description: 'Complete a grind before 10 AM',
    tier: 'common',
    category: 'focus',
    icon: 'Sun',
    requirement: {
      type: 'time_before',
      hour: 10
    },
    xpReward: 5,
    color: '#10B981'
  },
  {
    id: 'category_explorer',
    name: 'CATEGORY EXPLORER',
    description: 'Try 2 different grind skills',
    tier: 'common',
    category: 'focus',
    icon: 'Compass',
    requirement: {
      type: 'unique_categories',
      target: 2
    },
    xpReward: 5,
    color: '#10B981'
  },

  // UNCOMMON TIER (10 achievements)
  {
    id: 'pomodoro_warrior',
    name: 'POMODORO WARRIOR',
    description: 'Complete 10 Pomodoro grinds',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Target',
    requirement: {
      type: 'pomodoro_count',
      target: 10
    },
    xpReward: 12,
    color: '#3B82F6'
  },
  {
    id: 'focus_streak',
    name: 'FOCUS STREAK',
    description: 'Grind for 3 days in a row',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Calendar',
    requirement: {
      type: 'daily_streak',
      target: 3
    },
    xpReward: 15,
    color: '#3B82F6'
  },
  {
    id: 'deep_diver',
    name: 'DEEP DIVER',
    description: 'Complete a 60+ minute grind',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Brain',
    requirement: {
      type: 'single_session_duration',
      target: 60
    },
    xpReward: 14,
    color: '#3B82F6'
  },
  {
    id: 'dedication_keeper',
    name: 'DEDICATION KEEPER',
    description: 'Grind for 5 hours total',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Clock',
    requirement: {
      type: 'total_time',
      target: 300
    },
    xpReward: 18,
    color: '#3B82F6'
  },
  {
    id: 'evening_scholar',
    name: 'EVENING SCHOLAR',
    description: 'Complete 5 grinds after 6 PM',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Moon',
    requirement: {
      type: 'time_after',
      hour: 18,
      target: 5
    },
    xpReward: 10,
    color: '#3B82F6'
  },
  {
    id: 'study_buddy',
    name: 'STUDY BUDDY',
    description: 'Complete 10 study skill grinds',
    tier: 'uncommon',
    category: 'focus',
    icon: 'BookOpen',
    requirement: {
      type: 'category_sessions',
      category: 'study',
      target: 10
    },
    xpReward: 12,
    color: '#3B82F6'
  },
  {
    id: 'code_ninja',
    name: 'CODE NINJA',
    description: 'Complete 10 code skill grinds',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Code',
    requirement: {
      type: 'category_sessions',
      category: 'code',
      target: 10
    },
    xpReward: 12,
    color: '#3B82F6'
  },
  {
    id: 'work_horse',
    name: 'WORK HORSE',
    description: 'Complete 10 work skill grinds',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Briefcase',
    requirement: {
      type: 'category_sessions',
      category: 'work',
      target: 10
    },
    xpReward: 12,
    color: '#3B82F6'
  },
  {
    id: 'creative_soul',
    name: 'CREATIVE SOUL',
    description: 'Complete 10 creative skill grinds',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Palette',
    requirement: {
      type: 'category_sessions',
      category: 'create',
      target: 10
    },
    xpReward: 12,
    color: '#3B82F6'
  },
  {
    id: 'session_variety',
    name: 'SESSION VARIETY',
    description: 'Grind in 5 different durations',
    tier: 'uncommon',
    category: 'focus',
    icon: 'Shuffle',
    requirement: {
      type: 'duration_variety',
      target: 5
    },
    xpReward: 10,
    color: '#3B82F6'
  },

  // RARE TIER (8 achievements)
  {
    id: 'concentration_king',
    name: 'CONCENTRATION KING',
    description: 'Complete 50 grind sessions',
    tier: 'rare',
    category: 'focus',
    icon: 'Crown',
    requirement: {
      type: 'session_count',
      target: 50
    },
    xpReward: 28,
    color: '#8B5CF6'
  },
  {
    id: 'flow_state_master',
    name: 'FLOW STATE MASTER',
    description: 'Grind for 7 days in a row',
    tier: 'rare',
    category: 'focus',
    icon: 'Waves',
    requirement: {
      type: 'daily_streak',
      target: 7
    },
    xpReward: 25,
    color: '#8B5CF6'
  },
  {
    id: 'marathon_mind',
    name: 'MARATHON MIND',
    description: 'Spend 20 hours total grinding',
    tier: 'rare',
    category: 'focus',
    icon: 'Brain',
    requirement: {
      type: 'total_time',
      target: 1200
    },
    xpReward: 30,
    color: '#8B5CF6'
  },
  {
    id: 'category_crusher',
    name: 'CATEGORY CRUSHER',
    description: 'Reach 10 hours grinding any skill',
    tier: 'rare',
    category: 'focus',
    icon: 'Target',
    requirement: {
      type: 'category_time',
      target: 600
    },
    xpReward: 25,
    color: '#8B5CF6'
  },
  {
    id: 'deep_work_legend',
    name: 'DEEP WORK LEGEND',
    description: 'Complete 5 grinds of 90+ minutes',
    tier: 'rare',
    category: 'focus',
    icon: 'Brain',
    requirement: {
      type: 'long_sessions',
      duration: 90,
      target: 5
    },
    xpReward: 28,
    color: '#8B5CF6'
  },
  {
    id: 'monthly_warrior',
    name: 'MONTHLY WARRIOR',
    description: 'Complete 30 grinds in one month',
    tier: 'rare',
    category: 'focus',
    icon: 'Calendar',
    requirement: {
      type: 'monthly_sessions',
      target: 30
    },
    xpReward: 25,
    color: '#8B5CF6'
  },
  {
    id: 'super_streaker',
    name: 'SUPER STREAKER',
    description: 'Complete grinds 14 days in a row',
    tier: 'rare',
    category: 'focus',
    icon: 'Flame',
    requirement: {
      type: 'daily_streak',
      target: 14
    },
    xpReward: 30,
    color: '#8B5CF6'
  },
  {
    id: 'time_optimizer',
    name: 'TIME OPTIMIZER',
    description: 'Complete grinds at 6 different times of day',
    tier: 'rare',
    category: 'focus',
    icon: 'Clock',
    requirement: {
      type: 'time_variety',
      target: 6
    },
    xpReward: 700,
    color: '#8B5CF6'
  },

  // LEGENDARY TIER (4 achievements)
  {
    id: 'focus_legend',
    name: 'FOCUS LEGEND',
    description: 'Complete 200 grinds',
    tier: 'legendary',
    category: 'focus',
    icon: 'Crown',
    requirement: {
      type: 'session_count',
      target: 200
    },
    xpReward: 3000,
    color: '#F59E0B'
  },
  {
    id: 'zen_master',
    name: 'ZEN MASTER',
    description: 'Complete grinds 30 days in a row',
    tier: 'legendary',
    category: 'focus',
    icon: 'Lotus',
    requirement: {
      type: 'daily_streak',
      target: 30
    },
    xpReward: 5000,
    color: '#F59E0B'
  },
  {
    id: 'time_lord',
    name: 'TIME LORD',
    description: 'Spend 100 hours total grinding',
    tier: 'legendary',
    category: 'focus',
    icon: 'Clock',
    requirement: {
      type: 'total_time',
      target: 6000
    },
    xpReward: 4000,
    color: '#F59E0B'
  },
  {
    id: 'omnifocus_sage',
    name: 'OMNIFOCUS SAGE',
    description: 'Grind for 20 hours in all skills',
    tier: 'legendary',
    category: 'focus',
    icon: 'Star',
    requirement: {
      type: 'all_categories_time',
      target: 1200
    },
    xpReward: 6000,
    color: '#F59E0B'
  }
];