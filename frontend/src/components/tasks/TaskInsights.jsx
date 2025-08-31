import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, AlertTriangle, Target, Calendar, Crosshair, Shield } from 'lucide-react';

const TaskInsights = ({ tasks, taskLists }) => {
  const [insights, setInsights] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
    completionRate: 0,
    productivityTrend: 'stable',
    topPriorities: [],
    mostUsedTags: [],
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
        mostUsedTags: [],
        projectProgress: []
      });
      return;
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Basic stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const overdueTasks = tasks.filter(t => t.overdue && !t.completed).length;
    const dueSoonTasks = tasks.filter(t => t.dueSoon && !t.completed).length;
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

    // Most used tags
    const tagCounts = {};
    tasks.forEach(task => {
      if (task.tags) {
        task.tags.split(',').forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1;
          }
        });
      }
    });

    const mostUsedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag, count]) => ({ tag, count }));

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
            color: list.color || '#06B6D4',
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
        color: '#06B6D4',
        completed: generalCompleted,
        total: generalTasks.length,
        progress: Math.round((generalCompleted / generalTasks.length) * 100)
      });
    }

    setInsights({
      totalTasks,
      completedTasks,
      overdueTasks,
      dueSoonTasks,
      completionRate,
      productivityTrend,
      topPriorities,
      mostUsedTags,
      projectProgress
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-400" size={16} />;
      case 'down': return <TrendingUp className="text-red-400 rotate-180" size={16} />;
      default: return <TrendingUp className="text-gray-400" size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative space-y-6"
      style={{
        boxShadow: '0 0 20px rgba(34, 211, 238, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
      }}
    >
      {/* Animated Border Overlay */}
      <div className="absolute inset-0 border-2 border-cyan-400 opacity-30 animate-pulse pointer-events-none" />
      
      {/* Header */}
      <h3 className="text-xl font-mono font-bold text-white flex items-center relative z-10">
        <BarChart3 className="mr-3 text-cyan-400" size={24} />
        MISSION INSIGHT DASHBOARD
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Total Missions */}
        <div className="bg-gray-900 border-2 border-cyan-400 p-4" style={{
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold">TOTAL MISSIONS</div>
              <div className="text-2xl font-mono font-bold text-white">{insights.totalTasks}</div>
            </div>
            <Target className="text-cyan-400" size={20} />
          </div>
        </div>

        {/* Mission Success Rate */}
        <div className="bg-gray-900 border-2 border-green-500 p-4" style={{
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-green-400 font-bold">SUCCESS RATE</div>
              <div className="text-2xl font-mono font-bold text-green-400">{insights.completionRate}%</div>
            </div>
            {getTrendIcon(insights.productivityTrend)}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-gray-900 border-2 border-red-500 p-4" style={{
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-red-400 font-bold">OVERDUE</div>
              <div className="text-2xl font-mono font-bold text-red-400">{insights.overdueTasks}</div>
            </div>
            <AlertTriangle className="text-red-400" size={20} />
          </div>
        </div>

        {/* Urgent Missions */}
        <div className="bg-gray-900 border-2 border-yellow-500 p-4" style={{
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-yellow-400 font-bold">URGENT</div>
              <div className="text-2xl font-mono font-bold text-yellow-400">{insights.dueSoonTasks}</div>
            </div>
            <Clock className="text-yellow-400" size={20} />
          </div>
        </div>
      </div>

      {/* Critical Priority Missions */}
      {insights.topPriorities.length > 0 && (
        <div className="bg-gray-900 border-2 border-red-500 p-4 relative z-10" style={{
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <h4 className="text-sm font-mono font-bold text-red-400 mb-3 flex items-center">
            <AlertTriangle className="mr-2" size={16} />
            CRITICAL PRIORITY MISSIONS
          </h4>
          <div className="space-y-2">
            {insights.topPriorities.map((task, index) => (
              <div key={task.id} className="flex items-center gap-3 text-sm p-2 bg-gray-800 border border-red-500">
                <AlertTriangle className="text-red-400" size={12} />
                <span className="font-mono text-white truncate flex-1">{task.title}</span>
                {task.dueDate && (
                  <span className="text-red-400 font-mono text-xs">
                    <Calendar size={10} className="inline mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operation Progress */}
      {insights.projectProgress.length > 0 && (
        <div className="bg-gray-900 border-2 border-cyan-400 p-4 relative z-10" style={{
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <h4 className="text-sm font-mono font-bold text-cyan-400 mb-4 flex items-center">
            <Shield className="mr-2" size={16} />
            OPERATION PROGRESS STATUS
          </h4>
          <div className="space-y-3">
            {insights.projectProgress.slice(0, 4).map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 border-2"
                      style={{ backgroundColor: project.color, borderColor: project.color }}
                    />
                    <span className="font-mono text-white truncate">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 text-xs">
                      {project.completed}/{project.total} COMPLETE
                    </span>
                    <span className="font-mono text-cyan-400 text-xs font-bold">
                      [{project.progress}%]
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600 shadow-inner">
                  <div 
                    className="h-full transition-all duration-700 ease-out border-r"
                    style={{ 
                      width: `${project.progress}%`, 
                      backgroundColor: project.color,
                      borderRightColor: project.color,
                      boxShadow: `0 0 5px ${project.color}50`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Tags Intelligence */}
      {insights.mostUsedTags.length > 0 && (
        <div className="bg-gray-900 border-2 border-cyan-400 p-4 relative z-10" style={{
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
        }}>
          <h4 className="text-sm font-mono font-bold text-cyan-400 mb-3 flex items-center">
            <Crosshair className="mr-2" size={16} />
            MISSION TAG ANALYSIS
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.mostUsedTags.map((item, index) => (
              <span 
                key={index} 
                className="px-3 py-2 text-xs font-mono font-bold bg-cyan-500 bg-opacity-20 text-cyan-400 border-2 border-cyan-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  boxShadow: '0 0 5px rgba(34, 211, 238, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
                }}
              >
                #{item.tag} [{item.count}]
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskInsights;