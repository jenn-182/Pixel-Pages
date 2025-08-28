// src/components/PixelPages.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trophy, User, X, Save, Edit2, Trash2 } from 'lucide-react';
import PixelButton from './PixelButton';
import PixelInput, { PixelTextarea } from './PixelInput';
import NoteCard from './notes/NoteCard';
import AchievementCard from './AchievementCard';
import { useNotes } from '../hooks/useNotes';
import { usePlayer } from '../hooks/usePlayer';
import { useAchievements } from '../hooks/useAchievements';
import TabNavigation from './navigation/TabNavigation';
import { useTabs } from '../hooks/useTabs';
import '../styles/tabs.css'; // Import the tab styles
import NotesTab from './tabs/NotesTab';

const PixelPages = () => {
  // Add tab functionality
  const { activeTab, changeTab } = useTabs();
  
  const { notes, loading, error, createNote, updateNote, deleteNote, searchNotes, refreshNotes } = useNotes();
  const { playerStats, loading: playerLoading } = usePlayer();
  const { achievements, summary, loading: achievementsLoading } = useAchievements();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    color: '#FFD700'
  });

  const noteColors = [
    '#FFD700', // Gold
    '#87CEEB', // Sky Blue
    '#98FB98', // Pale Green
    '#F0E68C', // Khaki
    '#DDA0DD', // Plum
    '#F5DEB3', // Wheat
    '#FFB6C1', // Light Pink
    '#E0E0E0'  // Light Gray
  ];

  // Filter notes based on search

  const filteredNotes = searchTerm
    ? notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags && Array.isArray(note.tags) && note.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
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
        color: newNote.color || noteColors[0],
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
        tags: typeof activeNote.tags === 'string'
          ? activeNote.tags.split(',').map(t => t.trim()).filter(t => t)
          : activeNote.tags,
        updatedAt: new Date().toISOString()
      };

      // Use ID for updates instead of filename
      const noteIdentifier = activeNote.id || activeNote.filename;

      if (!noteIdentifier) {
        alert('Cannot identify note to update');
        return;
      }

      await updateNote(noteIdentifier, updatedNote);
      setIsEditing(false);
      setActiveNote(null);
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update note: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteNote = async (note) => {
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      try {
        // Use ID for deletes instead of filename
        const noteIdentifier = note.id || note.filename;
        await deleteNote(noteIdentifier);

        if (activeNote && (activeNote.id === note.id || activeNote.filename === note.filename)) {
          setActiveNote(null);
        }
      } catch (err) {
        alert('Failed to delete note');
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        await searchNotes(searchTerm);
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



  // Temporary content renderer for testing
  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesTab />;
      case 'library':
        return (
          <div style={{ padding: '20px', color: 'white' }}>
            <h2>Library Tab</h2>
            <p>Folders and notebooks will go here</p>
          </div>
        );
      case 'achievements':
        return (
          <div style={{ padding: '20px', color: 'white' }}>
            <h2>Achievements Tab</h2>
            <p>Player achievements will go here</p>
          </div>
        );
      case 'profile':
        return (
          <div style={{ padding: '20px', color: 'white' }}>
            <h2>Player Profile</h2>
            <p>Player stats and hidden easter egg button will go here</p>
          </div>
        );
      default:
        return <div>Tab not found</div>;
    }
  };



  // Loading state
  if (loading && notes.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="font-mono text-xl">Loading your digital realm...</div>
      </div>
    );
  }

  return (
    <div className="pixel-pages-container">
      {/* Add tab navigation at the top */}
      <TabNavigation activeTab={activeTab} onTabChange={changeTab} />
      
      {/* Render active tab content */}
      <main className="tab-content-area">
        {renderTabContent()}
      </main>
      
      {/* ONLY keep the modals - remove the old notes display */}
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
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title"
                  />
                </div>

                <div>
                  <label className="font-mono block mb-2">Content</label>
                  <PixelTextarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note here..."
                    rows={6}
                  />
                </div>

                <div>
                  <label className="font-mono block mb-2">Tags (comma separated)</label>
                  <PixelInput
                    value={newNote.tags}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
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
                        onClick={() => setNewNote({ ...newNote, color })}
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
                    onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                    placeholder="Note title"
                  />
                </div>

                <div>
                  <label className="font-mono block mb-2">Content</label>
                  <PixelTextarea
                    value={activeNote.content}
                    onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
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
                        onClick={() => setActiveNote({ ...activeNote, color })}
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

        {/* View Note Modal */}
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

        {/* Profile View Modal */}
        {showProfile && (
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
                    <div className="w-full h-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-4xl font-mono font-bold">PP</span>
                    </div>
                  </div>
                  <h3 className="font-mono text-lg font-bold mt-3">{playerStats?.username || 'PixelAdventurer'}</h3>
                  <div className="border-2 border-black bg-yellow-100 px-3 py-1 mt-2">
                    Level {playerStats?.level || 1}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-gray-50 p-4 mb-4">
                    <h4 className="font-mono font-bold mb-2">Stats</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span>Experience</span>
                          <span>{playerStats?.experience || 0} / {playerStats?.experienceToNext || 100}</span>
                        </div>
                        <div className="border-2 border-black bg-gray-200 h-4 mt-1">
                          <div
                            className="bg-blue-500 h-full transition-all duration-500"
                            style={{
                              width: `${((playerStats?.experience || 0) / (playerStats?.experienceToNext || 100)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span>Notes Created</span>
                        <span>{playerStats?.totalNotes || notes.length}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Total Words</span>
                        <span>{playerStats?.totalWords || 0}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Unique Tags</span>
                        <span>{playerStats?.uniqueTags || 0}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Achievements Unlocked</span>
                        <span>{summary?.completed || 0}</span>
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

        {/* Achievements View Modal */}
        {showAchievements && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-mono text-2xl font-bold">🏆 Achievements</h2>
                  <div className="flex gap-4 mt-2 text-sm font-mono">
                    <span className="text-green-600">✓ {summary.completed} Completed</span>
                    <span className="text-blue-600">⚡ {summary.inProgress} In Progress</span>
                    <span className="text-gray-500">🔒 {summary.locked} Locked</span>
                  </div>
                </div>
                <PixelButton
                  icon={<X size={18} />}
                  onClick={() => setShowAchievements(false)}
                  color="bg-red-400"
                  hoverColor="hover:bg-red-500"
                />
              </div>

              {achievementsLoading ? (
                <div className="text-center py-8 font-mono">Loading achievements...</div>
              ) : achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementCard
                      key={achievement.achievement?.id || achievement.id || index}
                      achievement={achievement}
                    />
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
      </AnimatePresence>
    </div>
  );
};

export default PixelPages;