export const noteAchievements = [
  // COMMON TIER (6 achievements)
  {
    id: 'first_scroll',
    name: 'FIRST SCROLL',
    description: 'Create your first mission log',
    tier: 'common',
    category: 'notes',
    icon: 'BookOpen',
    requirement: {
      type: 'note_count',
      target: 1
    },
    xpReward: 50,
    color: '#10B981'
  },
  {
    id: 'apprentice_scribe',
    name: 'APPRENTICE SCRIBE', 
    description: 'Collect 5 quest scrolls',
    tier: 'common',
    category: 'notes',
    icon: 'BookOpen',
    requirement: {
      type: 'note_count',
      target: 5
    },
    xpReward: 100,
    color: '#10B981'
  },
  {
    id: 'word_warrior',
    name: 'WORD WARRIOR',
    description: 'Write 100 words total',
    tier: 'common', 
    category: 'notes',
    icon: 'Edit3',
    requirement: {
      type: 'word_count',
      target: 100
    },
    xpReward: 75,
    color: '#10B981'
  },
  {
    id: 'tag_rookie',
    name: 'TAG ROOKIE',
    description: 'Use your first tag',
    tier: 'common',
    category: 'notes',
    icon: 'Tag',
    requirement: {
      type: 'tag_count',
      target: 1
    },
    xpReward: 50,
    color: '#10B981'
  },
  {
    id: 'daily_logger',
    name: 'DAILY LOGGER',
    description: 'Create a note today',
    tier: 'common',
    category: 'notes',
    icon: 'Calendar',
    requirement: {
      type: 'daily_notes',
      target: 1
    },
    xpReward: 25,
    color: '#10B981'
  },
  {
    id: 'basic_editor',
    name: 'BASIC EDITOR',
    description: 'Edit your first note',
    tier: 'common',
    category: 'notes',
    icon: 'Edit',
    requirement: {
      type: 'note_edits',
      target: 1
    },
    xpReward: 50,
    color: '#10B981'
  },

  // UNCOMMON TIER (8 achievements)
  {
    id: 'journeyman_writer',
    name: 'JOURNEYMAN WRITER',
    description: 'Collect 10 quest scrolls', 
    tier: 'uncommon',
    category: 'notes',
    icon: 'BookOpen',
    requirement: {
      type: 'note_count',
      target: 10
    },
    xpReward: 200,
    color: '#3B82F6'
  },
  {
    id: 'verbose_victor',
    name: 'VERBOSE VICTOR',
    description: 'Write 500 words total',
    tier: 'uncommon',
    category: 'notes', 
    icon: 'Edit3',
    requirement: {
      type: 'word_count',
      target: 500
    },
    xpReward: 250,
    color: '#3B82F6'
  },
  {
    id: 'tag_apprentice',
    name: 'TAG APPRENTICE',
    description: 'Use 5 different tags',
    tier: 'uncommon',
    category: 'notes',
    icon: 'Tag',
    requirement: {
      type: 'unique_tags',
      target: 5
    },
    xpReward: 200,
    color: '#3B82F6'
  },
  {
    id: 'night_owl',
    name: 'NIGHT OWL', 
    description: 'Write between 11 PM and 5 AM',
    tier: 'uncommon',
    category: 'notes',
    icon: 'Moon',
    requirement: {
      type: 'time_range',
      startHour: 23,
      endHour: 5
    },
    xpReward: 150,
    color: '#3B82F6'
  },
  {
    id: 'early_bird',
    name: 'EARLY BIRD',
    description: 'Write between 5 AM and 8 AM',
    tier: 'uncommon',
    category: 'notes',
    icon: 'Sun',
    requirement: {
      type: 'time_range', 
      startHour: 5,
      endHour: 8
    },
    xpReward: 150,
    color: '#3B82F6'
  },
  {
    id: 'weekend_warrior',
    name: 'WEEKEND WARRIOR',
    description: 'Create 5 notes on weekends',
    tier: 'uncommon',
    category: 'notes',
    icon: 'Calendar',
    requirement: {
      type: 'weekend_notes',
      target: 5
    },
    xpReward: 200,
    color: '#3B82F6'
  },
  {
    id: 'speed_writer',
    name: 'SPEED WRITER',
    description: 'Write 100 words in under 5 minutes',
    tier: 'uncommon',
    category: 'notes',
    icon: 'Zap',
    requirement: {
      type: 'speed_writing',
      words: 100,
      timeLimit: 300 // seconds
    },
    xpReward: 300,
    color: '#3B82F6'
  },
  {
    id: 'revision_master',
    name: 'REVISION MASTER',
    description: 'Edit the same note 5 times',
    tier: 'uncommon',
    category: 'notes',
    icon: 'RotateCcw',
    requirement: {
      type: 'single_note_edits',
      target: 5
    },
    xpReward: 250,
    color: '#3B82F6'
  },

  // RARE TIER (7 achievements)
  {
    id: 'master_chronicler',
    name: 'MASTER CHRONICLER',
    description: 'Collect 25 quest scrolls',
    tier: 'rare',
    category: 'notes',
    icon: 'BookOpen',
    requirement: {
      type: 'note_count',
      target: 25
    },
    xpReward: 500,
    color: '#8B5CF6'
  },
  {
    id: 'wordsmith_supreme',
    name: 'WORDSMITH SUPREME',
    description: 'Write 2000 words total',
    tier: 'rare',
    category: 'notes',
    icon: 'Edit3',
    requirement: {
      type: 'word_count',
      target: 2000
    },
    xpReward: 750,
    color: '#8B5CF6'
  },
  {
    id: 'tag_master',
    name: 'TAG MASTER', 
    description: 'Use 15 different tags',
    tier: 'rare',
    category: 'notes',
    icon: 'Tag',
    requirement: {
      type: 'unique_tags',
      target: 15
    },
    xpReward: 600,
    color: '#8B5CF6'
  },
  {
    id: 'consistent_writer',
    name: 'CONSISTENT WRITER',
    description: 'Write for 7 consecutive days',
    tier: 'rare',
    category: 'notes',
    icon: 'Calendar',
    requirement: {
      type: 'streak',
      target: 7
    },
    xpReward: 800,
    color: '#8B5CF6'
  },
  {
    id: 'marathon_scribe',
    name: 'MARATHON SCRIBE',
    description: 'Write 500+ words in one note',
    tier: 'rare',
    category: 'notes',
    icon: 'FileText',
    requirement: {
      type: 'single_note_words',
      target: 500
    },
    xpReward: 700,
    color: '#8B5CF6'
  },
  {
    id: 'weekly_champion',
    name: 'WEEKLY CHAMPION',
    description: 'Create 10 notes in one week',
    tier: 'rare',
    category: 'notes',
    icon: 'Trophy',
    requirement: {
      type: 'weekly_notes',
      target: 10
    },
    xpReward: 600,
    color: '#8B5CF6'
  },
  {
    id: 'organization_guru',
    name: 'ORGANIZATION GURU',
    description: 'Use 3+ tags in a single note',
    tier: 'rare',
    category: 'notes',
    icon: 'Tags',
    requirement: {
      type: 'single_note_tags',
      target: 3
    },
    xpReward: 500,
    color: '#8B5CF6'
  },

  // LEGENDARY TIER (4 achievements)
  {
    id: 'legendary_archivist',
    name: 'LEGENDARY ARCHIVIST',
    description: 'Collect 100 quest scrolls',
    tier: 'legendary',
    category: 'notes',
    icon: 'Archive',
    requirement: {
      type: 'note_count',
      target: 100
    },
    xpReward: 2000,
    color: '#F59E0B'
  },
  {
    id: 'epic_novelist',
    name: 'EPIC NOVELIST',
    description: 'Write 1000+ words in one note',
    tier: 'legendary',
    category: 'notes',
    icon: 'Book',
    requirement: {
      type: 'single_note_words',
      target: 1000
    },
    xpReward: 2500,
    color: '#F59E0B'
  },
  {
    id: 'tag_grandmaster',
    name: 'TAG GRANDMASTER',
    description: 'Use 25 different tags',
    tier: 'legendary',
    category: 'notes',
    icon: 'Tags',
    requirement: {
      type: 'unique_tags',
      target: 25
    },
    xpReward: 2000,
    color: '#F59E0B'
  },
  {
    id: 'archive_emperor',
    name: 'ARCHIVE EMPEROR',
    description: 'Write 10,000 words total',
    tier: 'legendary',
    category: 'notes',
    icon: 'Crown',
    requirement: {
      type: 'word_count',
      target: 10000
    },
    xpReward: 5000,
    color: '#F59E0B'
  }
];