export const playerRanks = [
  // Beginner Ranks (Levels 1-5) - Adjusted for current XP levels
  { level: 1, name: 'PIXEL SPROUT', minXP: 0, color: '#9CA3AF', description: 'Just getting started' },
  { level: 2, name: 'PIXEL RECRUIT', minXP: 800, color: '#9CA3AF', description: 'Learning the ropes' },
  { level: 3, name: 'PIXEL SCOUT', minXP: 1400, color: '#10B981', description: 'Building good habits' },
  { level: 4, name: 'PIXEL CADET', minXP: 2200, color: '#10B981', description: 'Finding your rhythm' },
  { level: 5, name: 'PIXEL APRENTICE', minXP: 3800, color: '#10B981', description: 'Consistent progress' },
  
  // Intermediate Ranks (Levels 6-10) - Increased spacing
  { level: 6, name: 'PIXEL RANGER', minXP: 5000, color: '#3B82F6', description: 'Steady advancement' },
  { level: 7, name: 'PIXEL GUARDIAN', minXP: 7000, color: '#3B82F6', description: 'Reliable performer' },
  { level: 8, name: 'PIXEL VOUYAGER', minXP: 10000, color: '#3B82F6', description: 'Expanding horizons' },
  { level: 9, name: 'PIXEL CRUSADER', minXP: 13500, color: '#8B5CF6', description: 'Proven dedication' },
  { level: 10, name: 'PIXEL WARDEN', minXP: 17000, color: '#8B5CF6', description: 'Excellence achieved' },
  
  // Advanced Ranks (Levels 11-15) - Higher requirements
  { level: 11, name: 'PIXEL COMMANDER', minXP: 21000, color: '#8B5CF6', description: 'Leading by example' },
  { level: 12, name: 'PIXEL OVERLORD', minXP: 26000, color: '#8B5CF6', description: 'Mastering complexity' },
  { level: 13, name: 'PIXEL ARCHITECT', minXP: 32000, color: '#F59E0B', description: 'Building greatness' },
  { level: 14, name: 'PIXEL HACKER', minXP: 39000, color: '#F59E0B', description: 'Exceptional insight' },
  { level: 15, name: 'PIXEL VISONARY', minXP: 47000, color: '#F59E0B', description: 'Transcending limits' },
  
  // Master Ranks (Levels 16-20) - Elite territory
  { level: 16, name: 'PIXEL ORACLE', minXP: 56000, color: '#06b6d4', description: 'Wisdom incarnate' },
  { level: 17, name: 'PIXEL LEGEND', minXP: 66000, color: '#06b6d4', description: 'Legendary status' },
  { level: 18, name: 'PIXEL MASTER', minXP: 77000, color: '#06b6d4', description: 'Ruling the realm' },
  { level: 19, name: 'PIXEL DIETY', minXP: 90000, color: '#06b6d4', description: 'Divine mastery' },
  { level: 20, name: 'PIXEL ETERNAL', minXP: 105000, color: '#06b6d4', description: 'Ultimate achievement' }
];

export const getRankByXP = (totalXP) => {
  return [...playerRanks].reverse().find(rank => totalXP >= rank.minXP) || playerRanks[0];
};

export const getNextRank = (currentLevel) => {
  return playerRanks.find(rank => rank.level > currentLevel);
};

export const getRankByLevel = (level) => {
  return playerRanks.find(rank => rank.level === level) || playerRanks[0];
};