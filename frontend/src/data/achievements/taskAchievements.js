export const taskAchievements = [
  // COMMON TIER (7 achievements)
  {
    id: 'task_rookie',
    name: 'TASK ROOKIE',
    description: 'Complete your first mission',
    tier: 'common',
    category: 'tasks',
    icon: 'CheckSquare',
    requirement: {
      type: 'task_count',
      target: 1
    },
    xpReward: 75,
    color: '#10B981'
  },
  {
    id: 'daily_warrior',
    name: 'DAILY WARRIOR',
    description: 'Complete 3 missions',
    tier: 'common',
    category: 'tasks',
    icon: 'CheckSquare',
    requirement: {
      type: 'task_count',
      target: 3
    },
    xpReward: 100,
    color: '#10B981'
  },
  {
    id: 'checkbox_champion',
    name: 'CHECKBOX CHAMPION',
    description: 'Complete 2 tasks in one day',
    tier: 'common',
    category: 'tasks',
    icon: 'CheckSquare',
    requirement: {
      type: 'daily_tasks',
      target: 2
    },
    xpReward: 100,
    color: '#10B981'
  },
  {
    id: 'priority_learner',
    name: 'PRIORITY LEARNER',
    description: 'Set your first task priority',
    tier: 'common',
    category: 'tasks',
    icon: 'Flag',
    requirement: {
      type: 'priority_usage',
      target: 1
    },
    xpReward: 50,
    color: '#10B981'
  },
  {
    id: 'due_date_setter',
    name: 'DUE DATE SETTER',
    description: 'Set your first task due date',
    tier: 'common',
    category: 'tasks',
    icon: 'Calendar',
    requirement: {
      type: 'due_date_usage',
      target: 1
    },
    xpReward: 50,
    color: '#10B981'
  },
  {
    id: 'category_starter',
    name: 'CATEGORY STARTER',
    description: 'Create tasks in 2 different categories',
    tier: 'common',
    category: 'tasks',
    icon: 'Folder',
    requirement: {
      type: 'task_categories',
      target: 2
    },
    xpReward: 75,
    color: '#10B981'
  },
  {
    id: 'task_creator',
    name: 'TASK CREATOR',
    description: 'Create 5 total tasks',
    tier: 'common',
    category: 'tasks',
    icon: 'Plus',
    requirement: {
      type: 'tasks_created',
      target: 5
    },
    xpReward: 100,
    color: '#10B981'
  },

  // UNCOMMON TIER (9 achievements)
  {
    id: 'mission_commander',
    name: 'MISSION COMMANDER',
    description: 'Complete 15 missions',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Shield',
    requirement: {
      type: 'task_count',
      target: 15
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'efficiency_expert',
    name: 'EFFICIENCY EXPERT',
    description: 'Complete 5 tasks in one day',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Zap',
    requirement: {
      type: 'daily_tasks',
      target: 5
    },
    xpReward: 400,
    color: '#3B82F6'
  },
  {
    id: 'priority_master',
    name: 'PRIORITY MASTER',
    description: 'Complete 10 high-priority tasks',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Flag',
    requirement: {
      type: 'high_priority_tasks',
      target: 10
    },
    xpReward: 350,
    color: '#3B82F6'
  },
  {
    id: 'deadline_defender',
    name: 'DEADLINE DEFENDER',
    description: 'Complete 10 tasks before their due date',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Clock',
    requirement: {
      type: 'early_completions',
      target: 10
    },
    xpReward: 400,
    color: '#3B82F6'
  },
  {
    id: 'weekly_crusher',
    name: 'WEEKLY CRUSHER',
    description: 'Complete 10 tasks in one week',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Calendar',
    requirement: {
      type: 'weekly_tasks',
      target: 10
    },
    xpReward: 350,
    color: '#3B82F6'
  },
  {
    id: 'overachiever',
    name: 'OVERACHIEVER',
    description: 'Complete 20% more tasks than created',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'TrendingUp',
    requirement: {
      type: 'completion_ratio',
      ratio: 1.2
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'category_master',
    name: 'CATEGORY MASTER',
    description: 'Use 5 different task categories',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Folder',
    requirement: {
      type: 'task_categories',
      target: 5
    },
    xpReward: 250,
    color: '#3B82F6'
  },
  {
    id: 'morning_achiever',
    name: 'MORNING ACHIEVER',
    description: 'Complete 10 tasks before noon',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Sun',
    requirement: {
      type: 'morning_completions',
      hour: 12,
      target: 10
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'evening_finisher',
    name: 'EVENING FINISHER',
    description: 'Complete 10 tasks after 6 PM',
    tier: 'uncommon',
    category: 'tasks',
    icon: 'Moon',
    requirement: {
      type: 'evening_completions',
      hour: 18,
      target: 10
    },
    xpReward: 300,
    color: '#3B82F6'
  },

  // RARE TIER (8 achievements)
  {
    id: 'quest_conqueror',
    name: 'QUEST CONQUEROR',
    description: 'Complete 50 missions',
    tier: 'rare',
    category: 'tasks',
    icon: 'Sword',
    requirement: {
      type: 'task_count',
      target: 50
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },
  {
    id: 'productivity_titan',
    name: 'PRODUCTIVITY TITAN',
    description: 'Complete 10 tasks in one day',
    tier: 'rare',
    category: 'tasks',
    icon: 'Zap',
    requirement: {
      type: 'daily_tasks',
      target: 10
    },
    xpReward: 1200,
    color: '#8B5CF6'
  },
  {
    id: 'organization_overlord',
    name: 'ORGANIZATION OVERLORD',
    description: 'Maintain 5 different active task lists',
    tier: 'rare',
    category: 'tasks',
    icon: 'List',
    requirement: {
      type: 'active_lists',
      target: 5
    },
    xpReward: 800,
    color: '#8B5CF6'
  },
  {
    id: 'streak_sentry',
    name: 'STREAK SENTRY',
    description: 'Complete tasks 7 days in a row',
    tier: 'rare',
    category: 'tasks',
    icon: 'Flame',
    requirement: {
      type: 'completion_streak',
      target: 7
    },
    xpReward: 1000,
    color: '#8B5CF6'
  },
  {
    id: 'urgent_responder',
    name: 'URGENT RESPONDER',
    description: 'Complete 20 urgent-priority tasks',
    tier: 'rare',
    category: 'tasks',
    icon: 'AlertTriangle',
    requirement: {
      type: 'urgent_tasks',
      target: 20
    },
    xpReward: 800,
    color: '#8B5CF6'
  },
  {
    id: 'monthly_dominator',
    name: 'MONTHLY DOMINATOR',
    description: 'Complete 50 tasks in one month',
    tier: 'rare',
    category: 'tasks',
    icon: 'Calendar',
    requirement: {
      type: 'monthly_tasks',
      target: 50
    },
    xpReward: 1200,
    color: '#8B5CF6'
  },
  {
    id: 'perfectionist',
    name: 'PERFECTIONIST',
    description: 'Complete 100 tasks with 95%+ on-time rate',
    tier: 'rare',
    category: 'tasks',
    icon: 'Star',
    requirement: {
      type: 'ontime_rate',
      tasks: 100,
      rate: 0.95
    },
    xpReward: 1500,
    color: '#8B5CF6'
  },
  {
    id: 'task_juggler',
    name: 'TASK JUGGLER',
    description: 'Have 20+ active tasks at once',
    tier: 'rare',
    category: 'tasks',
    icon: 'Layers',
    requirement: {
      type: 'concurrent_tasks',
      target: 20
    },
    xpReward: 700,
    color: '#8B5CF6'
  },

  // LEGENDARY TIER (4 achievements)
  {
    id: 'mission_emperor',
    name: 'MISSION EMPEROR',
    description: 'Complete 200 missions',
    tier: 'legendary',
    category: 'tasks',
    icon: 'Crown',
    requirement: {
      type: 'task_count',
      target: 200
    },
    xpReward: 3000,
    color: '#F59E0B'
  },
  {
    id: 'ultimate_achiever',
    name: 'ULTIMATE ACHIEVER',
    description: 'Complete 25 tasks in one day',
    tier: 'legendary',
    category: 'tasks',
    icon: 'Zap',
    requirement: {
      type: 'daily_tasks',
      target: 25
    },
    xpReward: 4000,
    color: '#F59E0B'
  },
  {
    id: 'grandmaster_planner',
    name: 'GRANDMASTER PLANNER',
    description: 'Maintain a 30-day task completion streak',
    tier: 'legendary',
    category: 'tasks',
    icon: 'Calendar',
    requirement: {
      type: 'completion_streak',
      target: 30
    },
    xpReward: 5000,
    color: '#F59E0B'
  },
  {
    id: 'legendary_executor',
    name: 'LEGENDARY EXECUTOR',
    description: 'Complete 500 total missions',
    tier: 'legendary',
    category: 'tasks',
    icon: 'Sword',
    requirement: {
      type: 'task_count',
      target: 500
    },
    xpReward: 7500,
    color: '#F59E0B'
  }
];