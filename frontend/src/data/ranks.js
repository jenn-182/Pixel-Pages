export const playerRanks = [
  // Beginner Ranks (Levels 1-5) - Adjusted for current XP levels
  { level: 1, name: 'PIXEL SPROUT', minXP: 0, color: '#9CA3AF', description: 'Just getting started' },
  { level: 2, name: 'DATA RECRUIT', minXP: 800, color: '#9CA3AF', description: 'Learning the ropes' },
  { level: 3, name: 'CODE SCOUT', minXP: 1600, color: '#10B981', description: 'Building good habits' },
  { level: 4, name: 'BYTE CADET', minXP: 2800, color: '#10B981', description: 'Finding your rhythm' },
  { level: 5, name: 'LOG KEEPER', minXP: 3800, color: '#10B981', description: 'Consistent progress' },
  
  // Intermediate Ranks (Levels 6-10) - Increased spacing
  { level: 6, name: 'DIGITAL RANGER', minXP: 5000, color: '#3B82F6', description: 'Steady advancement' },
  { level: 7, name: 'CYBER GUARDIAN', minXP: 7000, color: '#3B82F6', description: 'Reliable performer' },
  { level: 8, name: 'MATRIX TRAVELER', minXP: 10000, color: '#3B82F6', description: 'Expanding horizons' },
  { level: 9, name: 'PIXEL CRUSADER', minXP: 13500, color: '#8B5CF6', description: 'Proven dedication' },
  { level: 10, name: 'DATA WARDEN', minXP: 17000, color: '#8B5CF6', description: 'Excellence achieved' },
  
  // Advanced Ranks (Levels 11-15) - Higher requirements
  { level: 11, name: 'BYTE CAPTAIN', minXP: 21000, color: '#8B5CF6', description: 'Leading by example' },
  { level: 12, name: 'LOGIC OVERLORD', minXP: 26000, color: '#8B5CF6', description: 'Mastering complexity' },
  { level: 13, name: 'SYSTEM ARCHITECT', minXP: 32000, color: '#F59E0B', description: 'Building greatness' },
  { level: 14, name: 'NEURAL HACKER', minXP: 39000, color: '#F59E0B', description: 'Exceptional insight' },
  { level: 15, name: 'QUANTUM VISONARY', minXP: 47000, color: '#F59E0B', description: 'Transcending limits' },
  
  // Master Ranks (Levels 16-20) - Elite territory
  { level: 16, name: 'CYBER ORACLE', minXP: 56000, color: '#06b6d4', description: 'Wisdom incarnate' },
  { level: 17, name: 'MATRIX LEGEND', minXP: 66000, color: '#06b6d4', description: 'Legendary status' },
  { level: 18, name: 'DIGITAL OVERLOAD', minXP: 77000, color: '#06b6d4', description: 'Ruling the realm' },
  { level: 19, name: 'DATA DIETY', minXP: 90000, color: '#06b6d4', description: 'Divine mastery' },
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