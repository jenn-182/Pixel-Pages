// src/components/PixelPages.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, Trophy, X, Save, Edit2, Trash2 } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { apiService } from '../services/api';
import PixelButton from './PixelButton';
import PixelInput, { PixelTextarea } from './PixelInput';
import NoteCard from './NoteCard';

const noteColors = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#A06CD5', // Purple
  '#7CFF6B', // Green
  '#FF9F43', // Orange
  '#54A0FF', // Blue
  '#5F27CD', // Deep Purple
];

const PixelPages = () => {
  const { notes, loading, error, createNote, updateNote, deleteNote, searchNotes, refreshNotes } = useNotes();
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Player Data
  const [playerStats, setPlayerStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  
  // Form State
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    color: noteColors[0]
  });

  // Wrap getRarityIcon in useCallback to prevent re-creation on every render
  const getRarityIcon = useCallback((rarity) => {
    switch (rarity) {
      case 'LEGENDARY': return '🏆';
      case 'RARE': return '💎';
      case 'UNCOMMON': return '⭐';
      default: return '📝';
    }
  }, []); // Empty dependency array since this function doesn't depend on any props/state

  // Now fetchPlayerStats and fetchAchievements can safely depend on getRarityIcon
  const fetchPlayerStats = useCallback(async () => {
    try {
      const stats = await apiService.getPlayerStats();
      setPlayerStats({
        username: 'PixelPlayer',
        avatar: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390',
        level: stats.level,
        exp: stats.totalXP,
        nextLevelExp: Math.pow(stats.level, 2) * 100,
        notesCreated: stats.totalNotes,
        rank: stats.rank,
        totalTags: stats.totalTags
      });
    } catch (err) {
      console.error('Error fetching player stats:', err);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const achievementsData = await apiService.getAchievements();
      const formattedAchievements = achievementsData.map((egg, index) => ({
        id: `a${index + 1}`,
        title: egg.name,
        description: egg.description,
        icon: getRarityIcon(egg.rarity),
        unlocked: true,
        rarity: egg.rarity
      }));
      setAchievements(formattedAchievements);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  }, [getRarityIcon]); // Now this dependency is stable

  useEffect(() => {
    fetchPlayerStats();
    fetchAchievements();
  }, [notes, fetchPlayerStats, fetchAchievements]); 

  // Filter notes based on search
  const filteredNotes = searchQuery 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : notes;

  // Handlers
  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const noteToCreate = {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags ? newNote.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        color: newNote.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createNote(noteToCreate);
      setNewNote({ title: '', content: '', tags: '', color: noteColors[0] });
      setIsCreating(false);
    } catch (err) {
      alert('Failed to create note');
    }
  };

  const handleUpdateNote = async () => {
    if (!activeNote || !activeNote.title.trim() || !activeNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const updatedNote = {
        ...activeNote,
        updatedAt: new Date().toISOString()
      };

      const noteIdentifier = activeNote.filename || activeNote.id || activeNote.title;
      
      if (!noteIdentifier) {
        alert('Cannot identify note to update');
        return;
      }

      await updateNote(noteIdentifier, updatedNote);
      setIsEditing(false);
      setActiveNote(null);
    } catch (err) {
      console.error('Update error:', err); // Add this for debugging
      alert('Failed to update note: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteNote = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        await deleteNote(note.filename);
        if (activeNote && activeNote.filename === note.filename) {
          setActiveNote(null);
        }
      } catch (err) {
        alert('Failed to delete note');
      }
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        await searchNotes(searchQuery);
      } catch (err) {
        console.error('Search failed:', err);
      }
    } else {
      refreshNotes();
    }
  };

  const resetView = () => {
    setActiveNote(null);
    setIsCreating(false);
    setIsEditing(false);
    setShowProfile(false);
    setShowAchievements(false);
  };

  if (loading && notes.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="font-mono text-xl">Loading your digital realm...</div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-screen flex flex-col bg-gray-100 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* Header */}
      <header className="border-2 border-black bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="border-2 border-black bg-yellow-400 w-8 h-8 flex items-center justify-center">
            <span className="text-black font-bold">PP</span>
          </div>
          <h1 className="font-mono text-2xl font-bold">Pixel Pages</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <PixelInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search notes..."
              className="pr-10"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={18} />
            </button>
          </div>
          
          <PixelButton
            icon={<User size={18} />}
            onClick={() => {
              resetView();
              setShowProfile(true);
            }}
            color="bg-blue-400"
            hoverColor="hover:bg-blue-500"
          />
          
          <PixelButton
            icon={<Trophy size={18} />}
            onClick={() => {
              resetView();
              setShowAchievements(true);
            }}
            color="bg-purple-400"
            hoverColor="hover:bg-purple-500"
          />
          
          <PixelButton
            onClick={() => {
              resetView();
              setIsCreating(true);
            }}
            color="bg-green-400"
            hoverColor="hover:bg-green-500"
            icon={<Plus size={18} />}
          >
            New Note
          </PixelButton>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Create Note Modal */}
          {isCreating && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono text-xl font-bold">Create New Note</h2>
                  <PixelButton
                    icon={<X size={18} />}
                    onClick={() => setIsCreating(false)}
                    color="bg-red-400"
                    hoverColor="hover:bg-red-500"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-mono block mb-2">Title</label>
                    <PixelInput
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      placeholder="Note title"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Content</label>
                    <PixelTextarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      placeholder="Write your note here..."
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Tags (comma separated)</label>
                    <PixelInput
                      value={newNote.tags}
                      onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Color</label>
                    <div className="flex gap-2">
                      {noteColors.map(color => (
                        <motion.div
                          key={color}
                          className="border-2 border-black w-8 h-8 cursor-pointer"
                          style={{ backgroundColor: color }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewNote({...newNote, color})}
                        >
                          {newNote.color === color && (
                            <div className="flex items-center justify-center h-full">
                              <div className="w-3 h-3 bg-black"></div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <PixelButton
                      onClick={handleCreateNote}
                      color="bg-green-400"
                      hoverColor="hover:bg-green-500"
                      icon={<Save size={18} />}
                    >
                      Save Note
                    </PixelButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Edit Note Modal */}
          {isEditing && activeNote && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono text-xl font-bold">Edit Note</h2>
                  <PixelButton
                    icon={<X size={18} />}
                    onClick={() => {
                      setIsEditing(false);
                      setActiveNote(null);
                    }}
                    color="bg-red-400"
                    hoverColor="hover:bg-red-500"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-mono block mb-2">Title</label>
                    <PixelInput
                      value={activeNote.title}
                      onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                      placeholder="Note title"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Content</label>
                    <PixelTextarea
                      value={activeNote.content}
                      onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                      placeholder="Write your note here..."
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Tags (comma separated)</label>
                    <PixelInput
                      value={activeNote.tags ? activeNote.tags.join(', ') : ''}
                      onChange={(e) => setActiveNote({
                        ...activeNote, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  
                  <div>
                    <label className="font-mono block mb-2">Color</label>
                    <div className="flex gap-2">
                      {noteColors.map(color => (
                        <motion.div
                          key={color}
                          className="border-2 border-black w-8 h-8 cursor-pointer"
                          style={{ backgroundColor: color }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveNote({...activeNote, color})}
                        >
                          {activeNote.color === color && (
                            <div className="flex items-center justify-center h-full">
                              <div className="w-3 h-3 bg-black"></div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <PixelButton
                      onClick={handleUpdateNote}
                      color="bg-blue-400"
                      hoverColor="hover:bg-blue-500"
                      icon={<Save size={18} />}
                    >
                      Update Note
                    </PixelButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* View Note */}
          {activeNote && !isEditing && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                style={{ borderTopColor: activeNote.color, borderTopWidth: '8px' }}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono text-xl font-bold">{activeNote.title}</h2>
                  <div className="flex gap-2">
                    <PixelButton
                      onClick={() => setIsEditing(true)}
                      color="bg-blue-400"
                      hoverColor="hover:bg-blue-500"
                      icon={<Edit2 size={18} />}
                    />
                    <PixelButton
                      onClick={() => {
                        handleDeleteNote(activeNote);
                        setActiveNote(null);
                      }}
                      color="bg-red-400"
                      hoverColor="hover:bg-red-500"
                      icon={<Trash2 size={18} />}
                    />
                    <PixelButton
                      onClick={() => setActiveNote(null)}
                      color="bg-gray-400"
                      hoverColor="hover:bg-gray-500"
                      icon={<X size={18} />}
                    />
                  </div>
                </div>
                
                <div className="border-2 border-black bg-gray-50 p-4 min-h-[200px] whitespace-pre-wrap mb-4">
                  {activeNote.content}
                </div>
                
                {activeNote.tags && activeNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeNote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-gray-200 border border-gray-400 px-2 py-1 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500 flex justify-between">
                  <div>Created: {new Date(activeNote.createdAt || activeNote.created).toLocaleString()}</div>
                  <div>Updated: {new Date(activeNote.updatedAt || activeNote.updated).toLocaleString()}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Profile View */}
          {showProfile && playerStats && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono text-xl font-bold">User Profile</h2>
                  <PixelButton
                    icon={<X size={18} />}
                    onClick={() => setShowProfile(false)}
                    color="bg-red-400"
                    hoverColor="hover:bg-red-500"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-32 h-32 overflow-hidden">
                      <img
                        src={playerStats.avatar}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRkZENzAwIi8+Cjx0ZXh0IHg9IjY0IiB5PSI3NCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UFA8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                    <h3 className="font-mono text-lg font-bold mt-3">{playerStats.username}</h3>
                    <div className="border-2 border-black bg-yellow-100 px-3 py-1 mt-2">
                      Level {playerStats.level}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {playerStats.rank}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 p-4 mb-4">
                      <h4 className="font-mono font-bold mb-2">Stats</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between">
                            <span>Experience</span>
                            <span>{playerStats.exp} / {playerStats.nextLevelExp}</span>
                          </div>
                          <div className="border-2 border-black bg-gray-200 h-4 mt-1">
                            <div 
                              className="bg-blue-500 h-full transition-all duration-500"
                              style={{ width: `${(playerStats.exp / playerStats.nextLevelExp) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Notes Created</span>
                          <span>{playerStats.notesCreated}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Total Tags</span>
                          <span>{playerStats.totalTags}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Achievements Unlocked</span>
                          <span>{achievements.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <PixelButton
                      onClick={() => {
                        setShowAchievements(true);
                        setShowProfile(false);
                      }}
                      color="bg-purple-400"
                      hoverColor="hover:bg-purple-500"
                      icon={<Trophy size={18} />}
                      className="w-full"
                    >
                      View Achievements
                    </PixelButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Achievements View */}
          {showAchievements && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-mono text-xl font-bold">Achievements</h2>
                  <div className="flex gap-2">
                    <PixelButton
                      icon={<User size={18} />}
                      onClick={() => {
                        setShowProfile(true);
                        setShowAchievements(false);
                      }}
                      color="bg-blue-400"
                      hoverColor="hover:bg-blue-500"
                    />
                    <PixelButton
                      icon={<X size={18} />}
                      onClick={() => setShowAchievements(false)}
                      color="bg-red-400"
                      hoverColor="hover:bg-red-500"
                    />
                  </div>
                </div>
                
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map(achievement => (
                      <motion.div
                        key={achievement.id}
                        className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 ${
                          achievement.rarity === 'LEGENDARY' ? 'bg-yellow-100' :
                          achievement.rarity === 'RARE' ? 'bg-purple-100' :
                          achievement.rarity === 'UNCOMMON' ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`border-2 border-black w-12 h-12 flex items-center justify-center ${
                            achievement.rarity === 'LEGENDARY' ? 'bg-yellow-300' :
                            achievement.rarity === 'RARE' ? 'bg-purple-300' :
                            achievement.rarity === 'UNCOMMON' ? 'bg-blue-300' :
                            'bg-gray-300'
                          }`}>
                            <span className="text-2xl">{achievement.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-mono font-bold">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <div className={`text-xs font-mono mt-1 ${
                              achievement.rarity === 'LEGENDARY' ? 'text-yellow-700' :
                              achievement.rarity === 'RARE' ? 'text-purple-700' :
                              achievement.rarity === 'UNCOMMON' ? 'text-blue-700' :
                              'text-gray-700'
                            }`}>
                              {achievement.rarity}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-mono text-lg font-bold mb-2">No achievements yet</h3>
                    <p className="text-gray-600">Create some notes to unlock achievements!</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
          
          {/* Notes Grid */}
          {!isCreating && !activeNote && !showProfile && !showAchievements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {error && (
                <div className="border-2 border-red-500 bg-red-100 p-4 mb-4 font-mono">
                  Error: {error}
                </div>
              )}
              
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note.filename || note.id}
                      note={note}
                      onView={setActiveNote}
                      onEdit={(note) => {
                        setActiveNote(note);
                        setIsEditing(true);
                      }}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-8 text-center">
                  {searchQuery ? (
                    <div>
                      <h3 className="font-mono text-lg font-bold mb-2">No notes found</h3>
                      <p className="text-gray-600 mb-4">Try a different search term or create a new note</p>
                      <div className="flex gap-2 justify-center">
                        <PixelButton
                          onClick={() => {
                            setSearchQuery('');
                            refreshNotes();
                          }}
                          color="bg-blue-400"
                          hoverColor="hover:bg-blue-500"
                        >
                          Clear Search
                        </PixelButton>
                        <PixelButton
                          onClick={() => setIsCreating(true)}
                          color="bg-green-400"
                          hoverColor="hover:bg-green-500"
                          icon={<Plus size={18} />}
                        >
                          Create Note
                        </PixelButton>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-mono text-lg font-bold mb-2">No notes yet</h3>
                      <p className="text-gray-600 mb-4">Create your first note to get started on your digital adventure!</p>
                      <PixelButton
                        onClick={() => setIsCreating(true)}
                        color="bg-green-400"
                        hoverColor="hover:bg-green-500"
                        icon={<Plus size={18} />}
                      >
                        Create Your First Note
                      </PixelButton>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PixelPages;