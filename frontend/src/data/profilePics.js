// Default profile pictures available for selection
const defaultProfilePics = [
  { id: 'avatar1', imagePath: '/Avatars/avatar1.png' },
  { id: 'avatar2', imagePath: '/Avatars/avatar2.png' },
  { id: 'avatar3', imagePath: '/Avatars/avatar3.png' },
  { id: 'avatar4', imagePath: '/Avatars/avatar4.png' },
  { id: 'avatar5', imagePath: '/Avatars/avatar5.png' },
  { id: 'avatar6', imagePath: '/Avatars/avatar6.png' },
  { id: 'avatar7', imagePath: '/Avatars/avatar7.png' },
  { id: 'avatar8', imagePath: '/Avatars/avatar8.png' },
  { id: 'avatar9', imagePath: '/Avatars/avatar9.png' },
  { id: 'avatar10', imagePath: '/Avatars/avatar10.png' },
  { id: 'avatar11', imagePath: '/Avatars/avatar11.png' },
  { id: 'avatar12', imagePath: '/Avatars/avatar12.png' },
  { id: 'avatar13', imagePath: '/Avatars/avatar13.png' },
  { id: 'avatar14', imagePath: '/Avatars/avatar14.png' },
  { id: 'avatar15', imagePath: '/Avatars/avatar15.png' }
];

// Get saved profile pic or default
export const getSelectedProfilePic = () => {
  return localStorage.getItem('selectedProfilePic') || 'avatar1';
};

// Save profile pic selection
export const saveProfilePicSelection = (picId) => {
  localStorage.setItem('selectedProfilePic', picId);
};

// Get profile pic data by ID
export const getProfilePicById = (id) => {
  return defaultProfilePics.find(pic => pic.id === id) || defaultProfilePics[0];
};

export { defaultProfilePics };
