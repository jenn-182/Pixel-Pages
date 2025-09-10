import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Folder, BookOpen, FileText, Plus, ExternalLink, TrendingUp, Clock, Target, User, Trophy } from 'lucide-react';
import TaskInsights from '../tasks/TaskInsights';
import ActiveMissions from '../shared/ActiveMissions';
import FocusTimerWidget from '../focus/FocusTimerWidget';
import NoteModal from '../notes/NoteModal';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';
import { useTabs } from '../../hooks/useTabs';
import { useModal } from '../../hooks/useModal';
import { useNavigation } from '../../hooks/useNavigation';

const DashboardTab = ({ username = 'Jroc_182', tabColor = '#67E8F9', onTabChange }) => {
  // Get data from hooks
  const { folders } = useFolders();
  const { notebooks } = useNotebooks(); 
  const { notes, updateNote, deleteNote } = useNotes();
  const { tasks, taskLists } = useTasks();
  const { activeTab, changeTab } = useTabs();
  const { openModal, closeModal, isModalOpen, getModalData } = useModal();
  const { navigateToFolder, navigateToNoteView } = useNavigation();

  const handleGoToStorageVault = () => {
    if (onTabChange) {
      onTabChange('library');
    }
  };

  // Handle clicking on a folder - navigate to library with specific folder view
  const handleFolderClick = (folder) => {
    navigateToFolder(folder, onTabChange);
  };

  // Handle clicking on a note - open note in modal for editing
  const handleNoteClick = (note) => {
    openModal('noteEdit', { 
      note: note,
      mode: 'edit'
    });
  };

  // Handle accessing all logs - navigate to library with allNotes view
  const handleAccessAllLogs = () => {
    if (onTabChange) {
      onTabChange('library', { view: 'allNotes' });
    }
  };

  // Handle note save from modal
  const handleNoteSave = async (noteData) => {
    try {
      const modalData = getModalData('noteEdit');
      const existingNote = modalData.note;
      
      if (existingNote) {
        await updateNote(existingNote.id, noteData);
      }
      
      closeModal('noteEdit');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  // Handle note delete from modal
  const handleNoteDelete = async (noteId) => {
    try {
      await deleteNote(noteId);
      closeModal('noteEdit');
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const playerName = "Jroc_182";
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: `Good morning, ${playerName}!`,
        subtitle: "Ready to start your productivity missions?"
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: `Good afternoon, ${playerName}!`,
        subtitle: "How's your mission progress today?",
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        greeting: `Good evening, ${playerName}!`,
        subtitle: "Time to review today's achievements!"
      };
    } else {
      return {
        greeting: `Burning the midnight oil, ${playerName}?`,
        subtitle: "Night owls are most productive at night!"
      };
    }
  };

  const getMostActiveArchive = () => {
    if (folders.length === 0 || notes.length === 0) return null;
    
    const archiveActivity = folders.map(folder => {
      const folderNotes = notes.filter(note => note.folderId === folder.id);
      const recentNotes = folderNotes.filter(note => {
        const noteDate = new Date(note.createdAt || note.updatedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate >= weekAgo;
      });
      
      return {
        ...folder,
        totalNotes: folderNotes.length,
        recentNotes: recentNotes.length,
        activity: recentNotes.length + (folderNotes.length * 0.1)
      };
    });
    
    return archiveActivity.sort((a, b) => b.activity - a.activity)[0];
  };

  const currentGreeting = getTimeBasedGreeting();
  const mostActiveArchive = getMostActiveArchive();

  return (
    <>
      <div className="dashboard-tab-container p-6">
        {/* Enhanced Header with Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-6 h-6 border border-gray-600" 
              style={{ backgroundColor: tabColor }}
            />
            <h1 className="font-mono text-3xl font-bold text-white">
              PLAYER COMMAND CENTER
            </h1>
            <span className="text-2xl">{currentGreeting.icon}</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-mono font-bold text-white">
              {currentGreeting.greeting}
            </h2>
            <p className="text-gray-400 font-mono text-sm">
              {currentGreeting.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="space-y-6">
          {/* 1. Quick Actions Panel - Updated button backgrounds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border-2 border-cyan-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
            style={{
              boxShadow: '0 0 15px rgba(103, 232, 249, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 to-cyan-600/20 pointer-events-none" />
            <div className="absolute inset-0 border-2 border-cyan-300 opacity-30 animate-pulse pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                <div className="w-4 h-4 bg-cyan-300 mr-2" />
                QUICK COMMANDS
              </h2>
              
              {/* Quick Action Buttons - Updated to darker background */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => onTabChange && onTabChange('notes')}
                  className="bg-gray-900 border border-cyan-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(103,232,249,0.4)] font-mono font-bold text-cyan-300 overflow-hidden"
                  style={{ boxShadow: '0 0 3px rgba(103, 232, 249, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-cyan-600/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Plus size={20} className="text-cyan-300" />
                    <span className="text-xs text-cyan-300">NEW LOG</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('tasks')}
                  className="bg-gray-900 border border-cyan-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(103,232,249,0.4)] font-mono font-bold text-cyan-300 overflow-hidden"
                  style={{ boxShadow: '0 0 3px rgba(103, 232, 249, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-cyan-600/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Target size={20} className="text-cyan-300" />
                    <span className="text-xs text-cyan-300">NEW MISSION</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('library')}
                  className="bg-gray-900 border border-cyan-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(103,232,249,0.4)] font-mono font-bold text-cyan-300 overflow-hidden"
                  style={{ boxShadow: '0 0 3px rgba(103, 232, 249, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-cyan-600/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Folder size={20} className="text-cyan-300" />
                    <span className="text-xs text-cyan-300">BROWSE VAULT</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('achievements')}
                  className="bg-gray-900 border border-cyan-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(103,232,249,0.4)] font-mono font-bold text-cyan-300 overflow-hidden"
                  style={{ boxShadow: '0 0 3px rgba(103, 232, 249, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-cyan-600/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Trophy size={20} className="text-cyan-300" />
                    <span className="text-xs text-cyan-300">ACHIEVEMENTS</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('profile')}
                  className="bg-gray-900 border border-cyan-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(103,232,249,0.4)] font-mono font-bold text-cyan-300 overflow-hidden"
                  style={{ boxShadow: '0 0 3px rgba(103, 232, 249, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-cyan-600/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <User size={20} className="text-cyan-300" />
                    <span className="text-xs text-cyan-300">PLAYER LVL</span>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* 2. Storage Vault & Recent Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage Vault Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 border-2 border-sky-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 15px rgba(34, 211, 238, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/15 to-sky-600/20 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-sky-400 opacity-30 animate-pulse pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <div className="w-4 h-4 bg-sky-400 mr-2" />
                  STORAGE VAULT OVERVIEW
                </h2>
                
                {/* Archives Stats */}
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-gray-900 border border-gray-600 p-2 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-sky-600/15 pointer-events-none" />
                      <div className="relative z-10">
                        <Folder size={16} className="text-sky-400 mx-auto mb-1" />
                        <div className="text-sky-400 font-bold">{folders.length}</div>
                        <div className="text-gray-400">ARCHIVES</div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-600 p-2 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-sky-500/15 pointer-events-none" />
                      <div className="relative z-10">
                        <BookOpen size={16} className="text-sky-300 mx-auto mb-1" />
                        <div className="text-sky-300 font-bold">{notebooks.length}</div>
                        <div className="text-gray-400">COLLECTIONS</div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-600 p-2 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-600/10 to-sky-700/15 pointer-events-none" />
                      <div className="relative z-10">
                        <FileText size={16} className="text-sky-500 mx-auto mb-1" />
                        <div className="text-sky-500 font-bold">{notes.length}</div>
                        <div className="text-gray-400">LOGS</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Most Active Archive - Updated to match Recent Archive folder styling */}
                  {mostActiveArchive && (
                    <button
                      onClick={() => handleFolderClick(mostActiveArchive)}
                      className="w-full bg-gray-900 border border-sky-400 p-3 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-sky-300 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                      style={{ boxShadow: '0 0 3px rgba(34, 211, 238, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/8 to-sky-600/12 pointer-events-none" />
                      <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-sky-400 group-hover:text-sky-300 transition-colors" />
                          <span className="text-xs font-mono text-sky-400 font-bold group-hover:text-sky-300 transition-colors">MOST ACTIVE ARCHIVE</span>
                        </div>
                        <div className="text-sm font-mono text-white font-bold group-hover:text-sky-50 transition-colors">{mostActiveArchive.name}</div>
                        <div className="text-xs font-mono text-gray-400">
                          {mostActiveArchive.totalNotes} total • {mostActiveArchive.recentNotes} this week
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {/* Recent Archives - Now Clickable to open specific folders */}
                  {folders.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-gray-400 font-bold">RECENT ARCHIVES:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {folders.slice(0, 3).map(folder => {
                          const folderNoteCount = notes.filter(note => note.folderId === folder.id).length;
                          return (
                            <button
                              key={folder.id}
                              onClick={() => handleFolderClick(folder)}
                              className="bg-gray-900 border border-sky-400 p-2 text-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-sky-300 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                              style={{ boxShadow: '0 0 3px rgba(34, 211, 238, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/8 to-sky-600/12 pointer-events-none" />
                              <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                              <div className="relative z-10">
                                <Folder size={24} className="text-sky-400 mx-auto mb-2 group-hover:text-sky-300 transition-colors" />
                                <div className="text-xs font-mono text-sky-400 font-bold truncate mb-1 group-hover:text-sky-300 transition-colors">
                                  {folder.name}
                                </div>
                                <div className="text-xs font-mono text-gray-400">
                                  {folderNoteCount} logs
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {folders.length > 3 && (
                        <div className="text-center">
                          <div className="text-xs font-mono text-gray-500">
                            +{folders.length - 3} more archives
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Access Storage Vault Button - Updated background */}
                <button 
                  onClick={handleGoToStorageVault}
                  className="w-full bg-gray-900 border border-sky-400 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-sky-300 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] font-mono font-bold text-sky-400 overflow-hidden"
                  style={{
                    boxShadow: '0 0 3px rgba(34, 211, 238, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/8 to-sky-600/12 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <ExternalLink size={16} className="text-sky-400" />
                    <span className="text-sky-400">ACCESS STORAGE VAULT</span>
                  </div>
                  <div className="absolute inset-0 bg-sky-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                </button>
              </div>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-800 border-2 border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-blue-700/20 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-blue-500 opacity-30 animate-pulse pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <div className="w-4 h-4 bg-blue-500 mr-2" />
                  RECENT PLAYER LOGS
                </h2>
                
                <div className="space-y-2 mb-4">
                  {notes.slice(0, 5).map((note, index) => (
                    <button
                      key={note.id}
                      onClick={() => handleNoteClick(note)}
                      className="w-full bg-gray-900 border border-blue-500 p-2 text-xs font-mono relative overflow-hidden group cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_8px_rgba(14,165,233,0.4)]"
                      style={{ boxShadow: '0 0 3px rgba(14, 165, 233, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-blue-700/12 pointer-events-none" />
                      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2">
                          <FileText size={12} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                          <span className="text-blue-400 group-hover:text-blue-300 transition-colors">Created log:</span>
                          <span className="text-white truncate flex-1 group-hover:text-blue-50 transition-colors">{note.title}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {notes.length === 0 && (
                    <div className="text-center py-4">
                      <Clock size={24} className="text-blue-400 mx-auto mb-2" />
                      <div className="text-sm font-mono text-blue-400">No recent activity</div>
                      <div className="text-xs font-mono text-gray-500 mt-1">Create your first log to get started!</div>
                    </div>
                  )}
                </div>

                {/* Access All Logs Button - Updated background */}
                {notes.length > 0 && (
                  <button 
                    onClick={handleAccessAllLogs}
                    className="w-full bg-gray-900 border border-blue-500 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_8px_rgba(14,165,233,0.4)] font-mono font-bold text-blue-500 overflow-hidden"
                    style={{
                      boxShadow: '0 0 3px rgba(14, 165, 233, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 to-blue-700/12 pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <ExternalLink size={16} className="text-blue-500" />
                      <span className="text-blue-500">ACCESS ALL LOGS</span>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. Mission Insight Dashboard - Indigo (with Access Button) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TaskInsights tasks={tasks} taskLists={taskLists} onTabChange={onTabChange} />
          </motion.div>

          {/* 4. Active Missions & Focus Timer Row - UPDATED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Missions Section - Keep exactly as is */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gray-800 border-2 border-violet-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 to-violet-700/20 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-violet-500 opacity-30 animate-pulse pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <div className="w-4 h-4 bg-violet-500 mr-2" />
                  ACTIVE ACHIEVEMENTS
                </h2>
                
                <ActiveMissions notes={notes} compact={true} onTabChange={onTabChange} />
              </div>
            </motion.div>

            {/* Focus Timer Section - REPLACE Smart Suggestions with this */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
              style={{
                boxShadow: '0 0 15px rgba(147, 51, 234, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-purple-700/20 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-purple-500 opacity-30 animate-pulse pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <div className="w-4 h-4 bg-purple-500 mr-2" />
                  FOCUS COMMAND CENTER
                </h2>
                
                {/* Focus Timer Widget */}
                <FocusTimerWidget 
                  username={username || 'Jroc_182'} 
                  className="focus-timer-dashboard" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Note Edit Modal */}
      <NoteModal
        isOpen={isModalOpen('noteEdit')}
        onClose={() => closeModal('noteEdit')}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
        existingNote={getModalData('noteEdit').note}
        folders={folders}
        notebooks={notebooks}
        title="MODIFY LOG ENTRY"
      />
    </>
  );
};

export default DashboardTab;