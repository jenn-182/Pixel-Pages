// Default profile pictures available for selection
export const defaultProfilePics = [
  {
    id: 'pixel-jenn',
    name: 'Pixel Jenn',
    path: '/src/assets/icons/PixelPageJenn.PNG',
    description: 'Original Pixel Pages mascot'
  },
  {
    id: 'cyber-warrior',
    name: 'Cyber Warrior',
    path: '/src/assets/icons/CyberWarrior.PNG',
    description: 'Futuristic fighter'
  },
  {
    id: 'neon-coder',
    name: 'Neon Coder',
    path: '/src/assets/icons/NeonCoder.PNG',
    description: 'Programming specialist'
  },
  {
    id: 'pixel-mage',
    name: 'Pixel Mage',
    path: '/src/assets/icons/PixelMage.PNG',
    description: 'Magical knowledge keeper'
  },
  {
    id: 'retro-gamer',
    name: 'Retro Gamer',
    path: '/src/assets/icons/RetroGamer.PNG',
    description: 'Classic arcade style'
  },
  {
    id: 'data-ninja',
    name: 'Data Ninja',
    path: '/src/assets/icons/DataNinja.PNG',
    description: 'Stealth information gatherer'
  }
];

// Get saved profile pic or default
export const getSelectedProfilePic = () => {
  const saved = localStorage.getItem('selectedProfilePic');
  return saved || 'pixel-jenn';
};

// Save profile pic selection
export const saveProfilePicSelection = (picId) => {
  localStorage.setItem('selectedProfilePic', picId);
};

// Get profile pic data by ID
export const getProfilePicById = (picId) => {
  return defaultProfilePics.find(pic => pic.id === picId) || defaultProfilePics[0];
};
