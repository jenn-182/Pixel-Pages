import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, AlertTriangle, Target, Calendar } from 'lucide-react';

const TaskInsights = ({ tasks, taskLists }) => {
  const [insights, setInsights] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
    completionRate: 0,
    avgCompletionTime: 0,
    productivityTrend: 'stable',
    topPriorities: [],
    mostUsedTags: [],
    projectProgress: []
  });

  useEffect(() => {
    calculateInsights();
  }, [tasks, taskLists]);

  const calculateInsights = () => {
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
      .slice(0, 5);

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
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Project progress
    const projectProgress = taskLists.map(list => {
      const listTasks = tasks.filter(t => t.taskListId === list.id);
      const completed = listTasks.filter(t => t.completed).length;
      const total = listTasks.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        name: list.name,
        color: list.color,
        completed,
        total,
        progress
      };
    });

    // General tasks progress
    const generalTasks = tasks.filter(t => !t.taskListId);
    const generalCompleted = generalTasks.filter(t => t.completed).length;
    if (generalTasks.length > 0) {
      projectProgress.unshift({
        name: 'General Tasks',
        color: '#6B7280',
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

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-mono font-bold text-white flex items-center">
          <BarChart3 className="mr-2" size={24} />
          TASK INSIGHTS
        </h3>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-gray-400">TOTAL QUESTS</div>
              <div className="text-2xl font-mono font-bold text-white">{insights.totalTasks}</div>
            </div>
            <Target className="text-blue-400" size={24} />
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-gray-400">COMPLETION</div>
              <div className="text-2xl font-mono font-bold text-green-400">{insights.completionRate}%</div>
            </div>
            <div className="flex items-center">
              {getTrendIcon(insights.productivityTrend)}
            </div>
          </div>
        </motion.div>

        {/* Overdue Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-red-500 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ boxShadow: insights.overdueTasks > 0 ? '0 0 10px rgba(239, 68, 68, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)' : '2px 2px 0px 0px rgba(0,0,0,1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-gray-400">OVERDUE</div>
              <div className="text-2xl font-mono font-bold text-red-400">{insights.overdueTasks}</div>
            </div>
            <AlertTriangle className="text-red-400" size={24} />
          </div>
        </motion.div>

        {/* Due Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-yellow-500 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ boxShadow: insights.dueSoonTasks > 0 ? '0 0 10px rgba(245, 158, 11, 0.3), 2px 2px 0px 0px rgba(0,0,0,1)' : '2px 2px 0px 0px rgba(0,0,0,1)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-mono text-gray-400">DUE SOON</div>
              <div className="text-2xl font-mono font-bold text-yellow-400">{insights.dueSoonTasks}</div>
            </div>
            <Clock className="text-yellow-400" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Project Progress */}
      {insights.projectProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <h4 className="text-lg font-mono font-bold text-white mb-4">PROJECT PROGRESS</h4>
          <div className="space-y-3">
            {insights.projectProgress.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 border"
                      style={{ backgroundColor: project.color, borderColor: project.color }}
                    />
                    <span className="font-mono text-white">{project.name}</span>
                  </div>
                  <span className="font-mono text-gray-400 text-sm">
                    {project.completed}/{project.total} ({project.progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${project.progress}%`, 
                      backgroundColor: project.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* High Priority Tasks & Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Tasks */}
        {insights.topPriorities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 border border-red-500 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)' }}
          >
            <h4 className="text-lg font-mono font-bold text-red-400 mb-4 flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              HIGH PRIORITY TASKS
            </h4>
            <div className="space-y-2">
              {insights.topPriorities.map((task, index) => (
                <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-900 border border-gray-700">
                  <AlertTriangle className="text-red-400" size={14} />
                  <span className="font-mono text-white text-sm flex-1">{task.title}</span>
                  {task.dueDate && (
                    <span className="text-xs font-mono text-gray-400">
                      <Calendar size={12} className="inline mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Most Used Tags */}
        {insights.mostUsedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <h4 className="text-lg font-mono font-bold text-white mb-4">POPULAR TAGS</h4>
            <div className="space-y-2">
              {insights.mostUsedTags.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-mono text-cyan-400">#{item.tag}</span>
                  <span className="font-mono text-gray-400 text-sm">{item.count} tasks</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Productivity Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <h4 className="text-lg font-mono font-bold text-white mb-4">PRODUCTIVITY STATUS</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getTrendIcon(insights.productivityTrend)}
            <span 
              className="font-mono font-bold"
              style={{ color: getTrendColor(insights.productivityTrend) }}
            >
              {insights.productivityTrend.toUpperCase()}
            </span>
          </div>
          <span className="font-mono text-gray-400">
            {insights.productivityTrend === 'up' && 'Great job! You completed more tasks this week.'}
            {insights.productivityTrend === 'down' && 'Productivity is down. Consider reviewing your priorities.'}
            {insights.productivityTrend === 'stable' && 'Steady progress. Keep up the consistent work!'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskInsights;