import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Folder, BookOpen, FileText, Plus, ExternalLink, TrendingUp, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskInsights from '../tasks/TaskInsights';
import ActiveMissions from '../shared/ActiveMissions';
import useFolders from '../../hooks/useFolders';
import useNotebooks from '../../hooks/useNotebooks';
import useNotes from '../../hooks/useNotes';
import useTasks from '../../hooks/useTasks';

const DashboardTab = ({ tabColor = '#10B981', onTabChange }) => {
  const navigate = useNavigate();
  
  // Get data from hooks
  const { folders } = useFolders();
  const { notebooks } = useNotebooks(); 
  const { notes } = useNotes();
  const { tasks, taskLists } = useTasks();

  // Calculate today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt || note.updatedAt);
    return noteDate >= today;
  }).length;

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt || task.updatedAt);
    return task.completed && taskDate >= today;
  }).length;

  const handleGoToStorageVault = () => {
    if (onTabChange) {
      onTabChange('library');
    }
  };

  return (
    <div className="dashboard-tab-container p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          COMMAND DASHBOARD
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Central command center for productivity operations.
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="space-y-6">
        {/* Top Row - Storage Vault & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage Vault Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border-2 border-cyan-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
            style={{
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
            
            <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
              <div className="w-4 h-4 bg-cyan-400 mr-2" />
              STORAGE VAULT
            </h2>
            
            {/* Archives List */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-gray-900 border border-gray-600 p-2 text-center">
                  <Folder size={16} className="text-cyan-400 mx-auto mb-1" />
                  <div className="text-cyan-400 font-bold">{folders.length}</div>
                  <div className="text-gray-400">ARCHIVES</div>
                </div>
                <div className="bg-gray-900 border border-gray-600 p-2 text-center">
                  <BookOpen size={16} className="text-blue-400 mx-auto mb-1" />
                  <div className="text-blue-400 font-bold">{notebooks.length}</div>
                  <div className="text-gray-400">COLLECTIONS</div>
                </div>
                <div className="bg-gray-900 border border-gray-600 p-2 text-center">
                  <FileText size={16} className="text-green-400 mx-auto mb-1" />
                  <div className="text-green-400 font-bold">{notes.length}</div>
                  <div className="text-gray-400">LOGS</div>
                </div>
              </div>
              
              {/* Recent Archives */}
              {folders.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-mono text-gray-400 font-bold">RECENT ARCHIVES:</div>
                  {folders.slice(0, 3).map(folder => (
                    <div key={folder.id} className="text-xs font-mono text-cyan-400 truncate">
                      • {folder.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Go To Storage Vault Button */}
            <button 
              onClick={handleGoToStorageVault}
              className="w-full bg-gray-900 border-2 border-cyan-400 px-4 py-3 relative group cursor-pointer transition-all duration-300 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-mono font-bold text-cyan-400"
              style={{
                boxShadow: '0 0 5px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <ExternalLink size={16} className="text-cyan-400" />
                <span className="text-cyan-400">GO TO STORAGE VAULT</span>
              </div>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </motion.div>

          {/* Today's Progress Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 border-2 border-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
            style={{
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-green-400 opacity-30 animate-pulse pointer-events-none" />
            
            <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
              <div className="w-4 h-4 bg-green-400 mr-2" />
              TODAY'S PROGRESS
            </h2>
            
            {/* Today's Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 border border-green-400 p-3 text-center"
                     style={{ boxShadow: '0 0 5px rgba(34, 197, 94, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' }}>
                  <FileText size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-mono font-bold text-green-400">{todayNotes}</div>
                  <div className="text-xs font-mono text-gray-400">LOGS CREATED</div>
                </div>
                
                <div className="bg-gray-900 border border-green-400 p-3 text-center"
                     style={{ boxShadow: '0 0 5px rgba(34, 197, 94, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' }}>
                  <Target size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-mono font-bold text-green-400">{todayTasks}</div>
                  <div className="text-xs font-mono text-gray-400">TASKS DONE</div>
                </div>
              </div>
              
              {/* Productivity Indicator */}
              <div className="bg-gray-900 border border-green-400 p-3"
                   style={{ boxShadow: '0 0 5px rgba(34, 197, 94, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-sm font-mono text-white font-bold">PRODUCTIVITY</span>
                  </div>
                  <div className="text-sm font-mono text-green-400 font-bold">
                    {todayNotes + todayTasks > 5 ? 'HIGH' : todayNotes + todayTasks > 2 ? 'NORMAL' : 'LOW'}
                  </div>
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(((todayNotes + todayTasks) / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task Insights Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TaskInsights tasks={tasks} taskLists={taskLists} />
        </motion.div>

        {/* Bottom Row - Active Missions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Missions Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
            style={{
              boxShadow: '0 0 15px rgba(251, 191, 36, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-yellow-400 opacity-30 animate-pulse pointer-events-none" />
            
            <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
              <div className="w-4 h-4 bg-yellow-400 mr-2" />
              ACTIVE MISSIONS
            </h2>
            
            <ActiveMissions notes={notes} compact={true} />
          </motion.div>

          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 border-2 border-orange-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
            style={{
              boxShadow: '0 0 15px rgba(251, 146, 60, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 border-2 border-orange-400 opacity-30 animate-pulse pointer-events-none" />
            
            <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
              <div className="w-4 h-4 bg-orange-400 mr-2" />
              RECENT ACTIVITY
            </h2>
            
            {/* Recent Activity Feed */}
            <div className="space-y-2">
              {notes.slice(0, 4).map((note, index) => (
                <div key={note.id} className="bg-gray-900 border border-orange-400 p-2 text-xs font-mono"
                     style={{ boxShadow: '0 0 3px rgba(251, 146, 60, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-orange-400" />
                    <span className="text-orange-400">Created log:</span>
                    <span className="text-white truncate flex-1">{note.title}</span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {notes.length === 0 && (
                <div className="text-center py-4">
                  <Clock size={24} className="text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-mono text-orange-400">No recent activity</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Panel - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 border-2 border-indigo-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
          style={{
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <div className="absolute inset-0 border-2 border-indigo-400 opacity-30 animate-pulse pointer-events-none" />
          
          <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
            <div className="w-4 h-4 bg-indigo-400 mr-2" />
            QUICK ACTIONS
          </h2>
          
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => onTabChange && onTabChange('notes')}
              className="bg-gray-900 border-2 border-indigo-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-indigo-300 font-mono font-bold text-indigo-400"
              style={{ boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="flex flex-col items-center gap-2">
                <Plus size={20} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">NEW LOG</span>
              </div>
              <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            <button
              onClick={() => onTabChange && onTabChange('tasks')}
              className="bg-gray-900 border-2 border-indigo-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-indigo-300 font-mono font-bold text-indigo-400"
              style={{ boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="flex flex-col items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">NEW TASK</span>
              </div>
              <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            <button
              onClick={() => onTabChange && onTabChange('library')}
              className="bg-gray-900 border-2 border-indigo-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-indigo-300 font-mono font-bold text-indigo-400"
              style={{ boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="flex flex-col items-center gap-2">
                <Folder size={20} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">BROWSE</span>
              </div>
              <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            <button
              onClick={() => onTabChange && onTabChange('achievements')}
              className="bg-gray-900 border-2 border-indigo-400 p-3 relative group cursor-pointer transition-all duration-300 hover:border-indigo-300 font-mono font-bold text-indigo-400"
              style={{ boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' }}
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp size={20} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">PROGRESS</span>
              </div>
              <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardTab;