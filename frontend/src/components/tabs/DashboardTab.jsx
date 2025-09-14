import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Folder, BookOpen, FileText, Plus, ExternalLink, TrendingUp, Clock, Target, User, Search, Timer, Zap, Award } from 'lucide-react';
import TaskInsights from '../tasks/TaskInsights';
import NoteModal from '../notes/NoteModal';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';
import { useTabs } from '../../hooks/useTabs';
import { useModal } from '../../hooks/useModal';
import { useNavigation } from '../../hooks/useNavigation';

const DashboardTab = ({ username = 'user', tabColor = '#67E8F9', onTabChange }) => {
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

  // Handle clicking on new log - open note modal instead of tab
  const handleNewLog = () => {
    openModal('noteEdit', { 
      note: null,
      mode: 'create'
    });
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    const playerName = "Jroc_182"; // Changed from "user"
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: `Good morning, ${playerName}!`, // Use dynamic name
        subtitle: "Ready to start your productivity missions?"
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: `Good afternoon, ${playerName}!`, // Use dynamic name
        subtitle: "How's your mission progress today?",
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        greeting: `Good evening, ${playerName}!`, // Use dynamic name
        subtitle: "Time to review today's achievements!"
      };
    } else {
      return {
        greeting: `Burning the midnight oil, ${playerName}?`, // Use dynamic name
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

  const currentGreeting = getGreeting();
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
          <div className="flex items-center justify-between">
            <h1 className="font-mono text-3xl font-bold text-white">
              PLAYER COMMAND CENTER
            </h1>
            <h2 className="text-xl font-mono font-bold text-white">
              {currentGreeting.greeting}
            </h2>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="space-y-6">
          {/* 1. Quick Actions Panel - Cyan Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
          >
            <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
            
            <div className="relative z-10">
              <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                <Search size={20} className="text-white mr-2" />
                QUICK COMMANDS
              </h2>
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <button
                  onClick={handleNewLog}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Plus size={20} className="text-white" />
                    <span className="text-xs text-white">NEW LOG</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-cyan-400" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('tasks')}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Target size={20} className="text-white" />
                    <span className="text-xs text-white">NEW MISSION</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-green-400" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('focus')}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(251, 146, 60, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Timer size={20} className="text-white" />
                    <span className="text-xs text-white">TIMER</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-orange-400" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('tracker')}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(147, 51, 234, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Zap size={20} className="text-white" />
                    <span className="text-xs text-white">SKILLS</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-purple-400" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('achievements')}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Award size={20} className="text-white" />
                    <span className="text-xs text-white">BADGES</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-pink-400" />
                </button>

                <button
                  onClick={() => onTabChange && onTabChange('profile')}
                  className="bg-black border-2 border-white px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <User size={20} className="text-white" />
                    <span className="text-xs text-white">PLAYER LVL</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-blue-400" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* 2. Storage Vault & Recent Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage Vault Section - Pink Accent */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <Folder size={20} className="text-pink-400 mr-2" />
                  STORAGE VAULT OVERVIEW
                </h2>
                
                {/* Archives Stats */}
                <div className="space-y-4 mb-4">
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-gray-900 border border-white/60 p-2 text-center relative overflow-hidden rounded">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/15 pointer-events-none" />
                      <div className="relative z-10">
                        <Folder size={16} className="text-pink-400 mx-auto mb-1" />
                        <div className="text-pink-400 font-bold">{folders.length}</div>
                        <div className="text-gray-400">ARCHIVES</div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-white/60 p-2 text-center relative overflow-hidden rounded">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/15 pointer-events-none" />
                      <div className="relative z-10">
                        <BookOpen size={16} className="text-pink-300 mx-auto mb-1" />
                        <div className="text-pink-300 font-bold">{notebooks.length}</div>
                        <div className="text-gray-400">COLLECTIONS</div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-white/60 p-2 text-center relative overflow-hidden rounded">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/15 pointer-events-none" />
                      <div className="relative z-10">
                        <FileText size={16} className="text-pink-500 mx-auto mb-1" />
                        <div className="text-pink-500 font-bold">{notes.length}</div>
                        <div className="text-gray-400">LOGS</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Most Active Archive */}
                  {mostActiveArchive && (
                    <button
                      onClick={() => handleFolderClick(mostActiveArchive)}
                      className="w-full bg-black border-2 border-white/60 p-3 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 rounded"
                      style={{ 
                        boxShadow: '0 0 15px rgba(236, 72, 153, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-pink-400" />
                      <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={14} className="text-pink-400 group-hover:text-pink-300 transition-colors" />
                          <span className="text-xs font-mono text-pink-400 font-bold group-hover:text-pink-300 transition-colors">MOST ACTIVE ARCHIVE</span>
                        </div>
                        <div className="text-sm font-mono text-white font-bold group-hover:text-pink-50 transition-colors">{mostActiveArchive.name}</div>
                        <div className="text-xs font-mono text-gray-400">
                          {mostActiveArchive.totalNotes} total • {mostActiveArchive.recentNotes} this week
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {/* Recent Archives */}
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
                              className="bg-black border-2 border-white/60 p-2 text-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 rounded"
                              style={{ 
                                boxShadow: '0 0 10px rgba(236, 72, 153, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)' 
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-pink-400" />
                              <div className="relative z-10">
                                <Folder size={20} className="text-pink-400 mx-auto mb-2 group-hover:text-pink-300 transition-colors" />
                                <div className="text-xs font-mono text-pink-400 font-bold truncate mb-1 group-hover:text-pink-300 transition-colors">
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
                
                {/* Access Storage Vault Button */}
                <button 
                  onClick={handleGoToStorageVault}
                  className="w-full bg-black border-2 border-white/60 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                  style={{
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <ExternalLink size={16} className="text-pink-400" />
                    <span className="text-pink-400">ACCESS STORAGE VAULT</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-pink-400" />
                </button>
              </div>
            </motion.div>

            {/* Recent Activity Section - Cyan Accent */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
            >
              <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
              
              <div className="relative z-10">
                <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
                  <FileText size={20} className="text-cyan-400 mr-2" />
                  RECENT PLAYER LOGS
                </h2>
                
                <div className="space-y-2 mb-4">
                  {notes.slice(0, 5).map((note, index) => (
                    <motion.button
                      key={note.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => handleNoteClick(note)}
                      className="w-full bg-black border-2 border-white/60 p-2 text-xs font-mono relative overflow-hidden group cursor-pointer transition-all duration-300 rounded"
                      style={{ 
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.4), 2px 2px 0px 0px rgba(0,0,0,1)' 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-cyan-400" />
                      <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2">
                          <FileText size={12} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                          <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">Created log:</span>
                          <span className="text-white truncate flex-1 group-hover:text-cyan-50 transition-colors">{note.title}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  
                  {notes.length === 0 && (
                    <div className="text-center py-4">
                      <Clock size={24} className="text-cyan-400 mx-auto mb-2" />
                      <div className="text-sm font-mono text-cyan-400">No recent activity</div>
                      <div className="text-xs font-mono text-gray-500 mt-1">Create your first log to get started!</div>
                    </div>
                  )}
                </div>

                {/* Access All Logs Button */}
                {notes.length > 0 && (
                  <button 
                    onClick={handleAccessAllLogs}
                    className="w-full bg-black border-2 border-white/60 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
                    style={{
                      boxShadow: '0 0 15px rgba(6, 182, 212, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <ExternalLink size={16} className="text-cyan-400" />
                      <span className="text-cyan-400">ACCESS ALL LOGS</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-cyan-400" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. Mission Insight Dashboard - Blue Accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TaskInsights tasks={tasks} taskLists={taskLists} onTabChange={onTabChange} />
          </motion.div>
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