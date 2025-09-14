import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, AlertTriangle, Target, Search,Calendar, Shield, ExternalLink } from 'lucide-react';

const TaskInsights = ({ tasks, taskLists, onTabChange }) => {
  const [insights, setInsights] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
    completionRate: 0,
    productivityTrend: 'stable',
    topPriorities: [],
    projectProgress: []
  });

  useEffect(() => {
    calculateInsights();
  }, [tasks, taskLists]);

  const calculateInsights = () => {
    if (!tasks || tasks.length === 0) {
      setInsights({
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        dueSoonTasks: 0,
        completionRate: 0,
        productivityTrend: 'stable',
        topPriorities: [],
        projectProgress: []
      });
      return;
    }

    console.log('Tasks data:', tasks); // Debug log to see structure

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Basic stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // Calculate overdue tasks (if you have dueDate)
    const overdueTasks = tasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < now;
    }).length;
    
    // Count high priority tasks as urgent (since you have priority but not necessarily dueDates)
    const dueSoonTasks = tasks.filter(t => 
      !t.completed && t.priority === 'high'
    ).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Productivity trend (completed tasks this week vs last week)
    const thisWeekCompleted = tasks.filter(t => 
      t.completed && t.updatedAt && new Date(t.updatedAt) >= oneWeekAgo
    ).length;
    
    const lastWeekCompleted = tasks.filter(t => 
      t.completed && t.updatedAt && 
      new Date(t.updatedAt) >= new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) &&
      new Date(t.updatedAt) < oneWeekAgo
    ).length;

    let productivityTrend = 'stable';
    if (thisWeekCompleted > lastWeekCompleted) productivityTrend = 'up';
    else if (thisWeekCompleted < lastWeekCompleted) productivityTrend = 'down';

    // Top priorities (incomplete high priority tasks)
    const topPriorities = tasks
      .filter(t => !t.completed && t.priority === 'high')
      .slice(0, 3);

    // Project progress
    const projectProgress = [];
    
    if (taskLists && taskLists.length > 0) {
      taskLists.forEach(list => {
        const listTasks = tasks.filter(t => t.taskListId === list.id);
        const completed = listTasks.filter(t => t.completed).length;
        const total = listTasks.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        if (total > 0) {
          projectProgress.push({
            name: list.name,
            color: list.color || '#6366F1',
            completed,
            total,
            progress
          });
        }
      });
    }

    // General tasks progress
    const generalTasks = tasks.filter(t => !t.taskListId);
    const generalCompleted = generalTasks.filter(t => t.completed).length;
    if (generalTasks.length > 0) {
      projectProgress.unshift({
        name: 'General Missions',
        color: '#6366F1',
        completed: generalCompleted,
        total: generalTasks.length,
        progress: Math.round((generalCompleted / generalTasks.length) * 100)
      });
    }

    console.log('Calculated insights:', {
      totalTasks,
      completedTasks,
      overdueTasks,
      dueSoonTasks, // This should now show your high priority count
      topPriorities: topPriorities.length
    });

    setInsights({
      totalTasks,
      completedTasks,
      overdueTasks,
      dueSoonTasks,
      completionRate,
      productivityTrend,
      topPriorities,
      projectProgress
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-white" size={16} />;
      case 'down': return <TrendingUp className="text-white rotate-180" size={16} />;
      default: return <TrendingUp className="text-white" size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6 relative rounded-lg bg-black/40 backdrop-blur-md"
    >
      <div className="absolute inset-0 border-2 border-white opacity-5 pointer-events-none rounded-lg" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 pointer-events-none rounded-lg" />
      
      <div className="relative z-10 space-y-6">
        {/* Header with Access Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-mono font-bold text-white flex items-center">
            <Search size={24} className="text-purple-400 mr-2" />
            MISSION CONTROL CENTER
          </h3>
          
          {/* Access Missions Button */}
          <button
            onClick={() => onTabChange && onTabChange('tasks')}
            className="bg-black border-2 border-white/60 px-4 py-2 relative group cursor-pointer transition-all duration-300 hover:scale-105 font-mono font-bold text-white overflow-hidden rounded"
            style={{
              boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <ExternalLink size={14} className="text-white" />
              <span className="text-white text-sm">ACCESS MISSIONS</span>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-purple-400" />
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Missions */}
          <div className="bg-black border-2 border-white/60 p-4 relative overflow-hidden rounded" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-gray-400">TOTAL MISSIONS</div>
                  <div className="text-2xl font-mono font-bold text-white">{insights.totalTasks}</div>
                </div>
                <Target className="text-white" size={20} />
              </div>
            </div>
          </div>

          {/* Mission Success Rate */}
          <div className="bg-black border-2 border-white/60 p-4 relative overflow-hidden rounded" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-gray-400">SUCCESS RATE</div>
                  <div className="text-2xl font-mono font-bold text-white">{insights.completionRate}%</div>
                </div>
                <div className="text-white">{getTrendIcon(insights.productivityTrend)}</div>
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-black border-2 border-white/60 p-4 relative overflow-hidden rounded" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-gray-400">OVERDUE</div>
                  <div className="text-2xl font-mono font-bold text-white">{insights.overdueTasks}</div>
                </div>
                <AlertTriangle className="text-white" size={20} />
              </div>
            </div>
          </div>

          {/* Urgent */}
          <div className="bg-black border-2 border-white/60 p-4 relative overflow-hidden rounded" style={{ boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-gray-400">URGENT</div>
                  <div className="text-2xl font-mono font-bold text-white">{insights.dueSoonTasks}</div>
                </div>
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Critical Priority Missions */}
        {insights.topPriorities.length > 0 && (
          <div className="space-y-2 mt-8">
            <div className="text-xs font-mono text-gray-400 font-bold">CRITICAL PRIORITY MISSIONS:</div>
            <div className="space-y-2">
              {insights.topPriorities.map((task, index) => (
                <button
                  key={task.id}
                  onClick={() => onTabChange && onTabChange('tasks')}
                  className="w-full bg-black border-2 border-white/60 p-3 relative overflow-hidden group transition-all duration-300 hover:scale-105 rounded cursor-pointer"
                  style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-red-400" />
                  <div className="relative z-10 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-white" />
                      <span className="text-xs font-mono text-white font-bold">HIGH PRIORITY</span>
                    </div>
                    <div className="text-sm font-mono text-white font-bold">{task.title}</div>
                    {task.dueDate && (
                      <div className="text-xs font-mono text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Operation Progress */}
        {insights.projectProgress.length > 0 && (
          <div className="space-y-2 mt-8">
            <div className="text-xs font-mono text-gray-400 font-bold">OPERATION PROGRESS:</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {insights.projectProgress.slice(0, 4).map((project, index) => (
                <button
                  key={index}
                  onClick={() => onTabChange && onTabChange('tasks')}
                  className="w-full bg-black border-2 border-white/60 p-3 relative overflow-hidden group transition-all duration-300 hover:scale-105 rounded cursor-pointer"
                  style={{ boxShadow: '0 0 10px rgba(147, 51, 234, 0.6), 2px 2px 0px 0px rgba(0,0,0,1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/12 pointer-events-none" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-purple-400" />
                  <div className="relative z-10 text-left">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 border border-gray-600 rounded"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-mono text-white truncate">{project.name}</span>
                      </div>
                      <span className="font-mono text-white text-xs">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="text-xs font-mono text-gray-400 mb-2">
                      {project.completed}/{project.total} complete
                    </div>
                    <div className="w-full bg-gray-700 h-2 border border-gray-600 rounded">
                      <div 
                        className="h-full transition-all duration-700 ease-out rounded"
                        style={{ 
                          width: `${project.progress}%`, 
                          backgroundColor: project.color
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskInsights;