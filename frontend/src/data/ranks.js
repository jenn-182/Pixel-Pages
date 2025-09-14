export const playerRanks = [
  // Beginner Ranks (Levels 1-5) - Very challenging progression
  { level: 1, name: 'PIXEL NOVICE', minXP: 0, color: '#9CA3AF', icon: '🌱', description: 'Just getting started' },
  { level: 2, name: 'DATA SEEKER', minXP: 200, color: '#9CA3AF', icon: '🔍', description: 'Learning the ropes' },
  { level: 3, name: 'LOG KEEPER', minXP: 500, color: '#10B981', icon: '📝', description: 'Building good habits' },
  { level: 4, name: 'BYTE WARRIOR', minXP: 1000, color: '#10B981', icon: '⚔️', description: 'Finding your rhythm' },
  { level: 5, name: 'CODE SCOUT', minXP: 1700, color: '#10B981', icon: '🎯', description: 'Consistent progress' },
  
  // Intermediate Ranks (Levels 6-10) - Serious commitment required
  { level: 6, name: 'DIGITAL RANGER', minXP: 2500, color: '#3B82F6', icon: '🏹', description: 'Steady advancement' },
  { level: 7, name: 'CYBER GUARDIAN', minXP: 3500, color: '#3B82F6', icon: '🛡️', description: 'Reliable performer' },
  { level: 8, name: 'MATRIX EXPLORER', minXP: 5000, color: '#3B82F6', icon: '🗺️', description: 'Expanding horizons' },
  { level: 9, name: 'PIXEL KNIGHT', minXP: 7000, color: '#8B5CF6', icon: '🗡️', description: 'Proven dedication' },
  { level: 10, name: 'DATA CHAMPION', minXP: 9500, color: '#8B5CF6', icon: '🏆', description: 'Excellence achieved' },
  
  // Advanced Ranks (Levels 11-15) - Very serious dedication
  { level: 11, name: 'BYTE COMMANDER', minXP: 12500, color: '#8B5CF6', icon: '⭐', description: 'Leading by example' },
  { level: 12, name: 'LOGIC OVERLORD', minXP: 16000, color: '#8B5CF6', icon: '🔮', description: 'Mastering complexity' },
  { level: 13, name: 'SYSTEM ARCHITECT', minXP: 20000, color: '#F59E0B', icon: '🏗️', description: 'Building greatness' },
  { level: 14, name: 'NEURAL HACKER', minXP: 25000, color: '#F59E0B', icon: '🧠', description: 'Exceptional insight' },
  { level: 15, name: 'QUANTUM ANALYST', minXP: 30000, color: '#F59E0B', icon: '⚛️', description: 'Transcending limits' },
  
  // Elite Ranks (Levels 16-20) - Extreme commitment
  { level: 16, name: 'CYBER SAGE', minXP: 40000, color: '#06b6d4', icon: '🔯', description: 'Wisdom incarnate' },
  { level: 17, name: 'MATRIX MASTER', minXP: 50000, color: '#06b6d4', icon: '👑', description: 'Legendary status' },
  { level: 18, name: 'DIGITAL EMPEROR', minXP: 65000, color: '#06b6d4', icon: '🏛️', description: 'Ruling the realm' },
  { level: 19, name: 'DATA DEITY', minXP: 80000, color: '#06b6d4', icon: '⚡', description: 'Divine mastery' },
  { level: 20, name: 'PIXEL OMNARCH', minXP: 100000, color: '#06b6d4', icon: '♦️', description: 'Ultimate achievement' }
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