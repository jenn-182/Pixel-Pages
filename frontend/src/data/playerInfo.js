// Default player information
const defaultPlayerInfo = {
  nickname: '',
  country: '',
  age: '',
  favoriteSkill: '',
  dreamCareer: '',
  favoriteGame: ''
};

// Skill branches from your skill tree
export const skillBranches = [
  'Scholar',
  'Profession', 
  'Artisan',
  'Scribe',
  'Programming',
  'Literacy',
  'Strategist',
  'Mindfulness',
  'Knowledge'
];

// Countries dropdown options
export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'South Africa',
  'Egypt',
  'Nigeria',
  'Kenya',
  'Russia',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Greece',
  'Turkey',
  'Israel',
  'New Zealand',
  'Singapore',
  'Thailand',
  'Philippines',
  'Indonesia',
  'Malaysia',
  'Vietnam',
  'Other'
];

// Get saved player info or return defaults
export const getPlayerInfo = () => {
  try {
    const saved = localStorage.getItem('playerInfo');
    return saved ? { ...defaultPlayerInfo, ...JSON.parse(saved) } : defaultPlayerInfo;
  } catch (error) {
    console.error('Error loading player info:', error);
    return defaultPlayerInfo;
  }
};

// Save player info to localStorage
export const savePlayerInfo = (playerInfo) => {
  try {
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
  } catch (error) {
    console.error('Error saving player info:', error);
  }
};

export { defaultPlayerInfo };