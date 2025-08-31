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
            color: list.color,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-600 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-4"
    >
      {/* Header */}
      <h3 className="text-lg font-mono font-bold text-white flex items-center">
        <BarChart3 className="mr-2" size={20} />
        MISSION INSIGHTS
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Tasks */}
        <div className="bg-gray-900 border border-gray-600 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400">TOTAL</div>
              <div className="text-lg font-mono font-bold text-white">{insights.totalTasks}</div>
            </div>
            <Target className="text-blue-400" size={16} />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gray-900 border border-gray-600 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400">COMPLETE</div>
              <div className="text-lg font-mono font-bold text-green-400">{insights.completionRate}%</div>
            </div>
            {getTrendIcon(insights.productivityTrend)}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-gray-900 border border-red-500 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400">OVERDUE</div>
              <div className="text-lg font-mono font-bold text-red-400">{insights.overdueTasks}</div>
            </div>
            <AlertTriangle className="text-red-400" size={16} />
          </div>
        </div>

        {/* Due Soon */}
        <div className="bg-gray-900 border border-yellow-500 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-gray-400">DUE SOON</div>
              <div className="text-lg font-mono font-bold text-yellow-400">{insights.dueSoonTasks}</div>
            </div>
            <Clock className="text-yellow-400" size={16} />
          </div>
        </div>
      </div>

      {/* High Priority Tasks */}
      {insights.topPriorities.length > 0 && (
        <div className="bg-gray-900 border border-red-500 p-3">
          <h4 className="text-sm font-mono font-bold text-red-400 mb-2 flex items-center">
            <AlertTriangle className="mr-1" size={14} />
            HIGH PRIORITY
          </h4>
          <div className="space-y-1">
            {insights.topPriorities.map((task, index) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                <AlertTriangle className="text-red-400" size={10} />
                <span className="font-mono text-white truncate">{task.title}</span>
                {task.dueDate && (
                  <span className="text-gray-400 ml-auto">
                    <Calendar size={10} className="inline mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Progress */}
      {insights.projectProgress.length > 0 && (
        <div className="bg-gray-900 border border-gray-600 p-3">
          <h4 className="text-sm font-mono font-bold text-white mb-3">MISSION PROGRESS</h4>
          <div className="space-y-2">
            {insights.projectProgress.slice(0, 3).map((project, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 border"
                      style={{ backgroundColor: project.color, borderColor: project.color }}
                    />
                    <span className="font-mono text-white truncate">{project.name}</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {project.completed}/{project.total}
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-1 border border-gray-600">
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
        </div>
      )}

      {/* Popular Tags */}
      {insights.mostUsedTags.length > 0 && (
        <div className="bg-gray-900 border border-gray-600 p-3">
          <h4 className="text-sm font-mono font-bold text-white mb-2">POPULAR TAGS</h4>
          <div className="flex flex-wrap gap-1">
            {insights.mostUsedTags.map((item, index) => (
              <span key={index} className="px-2 py-1 text-xs font-mono bg-cyan-400 bg-opacity-20 text-cyan-400 border border-cyan-400">
                #{item.tag} ({item.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskInsights;