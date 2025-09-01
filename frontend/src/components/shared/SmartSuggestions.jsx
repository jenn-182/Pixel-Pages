import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Target, BookOpen, Tag, Calendar, TrendingUp, Star, Clock } from 'lucide-react';

const SmartSuggestions = ({ notes = [], tasks = [], folders = [], onTabChange }) => {
  const generateSuggestions = () => {
    const suggestions = [];
    
    // Analysis based suggestions
    const recentNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt || note.updatedAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return noteDate >= threeDaysAgo;
    });

    const untaggedNotes = notes.filter(note => !note.tagsString || note.tagsString.trim() === '');
    const incompleteTasks = tasks.filter(task => !task.completed);
    const highPriorityTasks = tasks.filter(task => !task.completed && task.priority === 'high');
    
    // Enhanced suggestion logic
    if (recentNotes.length === 0 && notes.length > 0) {
      suggestions.push({
        id: 'create-note',
        type: 'create',
        title: 'CAPTURE NEW INSIGHTS',
        description: 'Document your latest thoughts and discoveries',
        action: 'Create Log',
        icon: BookOpen,
        priority: 'high',
        actionTab: 'notes'
      });
    }

    if (highPriorityTasks.length > 0) {
      suggestions.push({
        id: 'priority-tasks',
        type: 'focus',
        title: 'CRITICAL MISSIONS PENDING',
        description: `${highPriorityTasks.length} high priority ${highPriorityTasks.length === 1 ? 'mission needs' : 'missions need'} immediate attention`,
        action: 'Review Missions',
        icon: Target,
        priority: 'high',
        actionTab: 'tasks'
      });
    }

    if (untaggedNotes.length >= 3) {
      suggestions.push({
        id: 'organize-tags',
        type: 'organize',
        title: 'ENHANCE ORGANIZATION',
        description: `Categorize ${untaggedNotes.length} untagged logs for better searchability`,
        action: 'Add Tags',
        icon: Tag,
        priority: 'medium',
        actionTab: 'library'
      });
    }

    if (folders.length === 0 && notes.length >= 5) {
      suggestions.push({
        id: 'create-archives',
        type: 'organize',
        title: 'CREATE ARCHIVE SYSTEM',
        description: 'Organize your logs into themed collections',
        action: 'Setup Archives',
        icon: BookOpen,
        priority: 'medium',
        actionTab: 'library'
      });
    }

    if (incompleteTasks.length >= 8) {
      suggestions.push({
        id: 'task-review',
        type: 'optimize',
        title: 'MISSION OVERLOAD DETECTED',
        description: 'Consider reviewing and prioritizing your active missions',
        action: 'Optimize Workflow',
        icon: TrendingUp,
        priority: 'medium',
        actionTab: 'tasks'
      });
    }

    // Productivity suggestions
    if (suggestions.length < 3) {
      const weeklyNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt || note.updatedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate >= weekAgo;
      }).length;

      if (weeklyNotes < 3) {
        suggestions.push({
          id: 'productivity-boost',
          type: 'motivate',
          title: 'BOOST WEEKLY OUTPUT',
          description: 'Set a goal to create more content this week',
          action: 'Start Session',
          icon: Zap,
          priority: 'low',
          actionTab: 'focus'
        });
      }
    }

    // Achievement-focused suggestions
    if (suggestions.length < 3) {
      suggestions.push({
        id: 'achievement-progress',
        type: 'progress',
        title: 'UNLOCK NEW ACHIEVEMENTS',
        description: 'Check your progress towards completing missions',
        action: 'View Progress',
        icon: Star,
        priority: 'low',
        actionTab: 'achievements'
      });
    }

    return suggestions.slice(0, 3);
  };

  const suggestions = generateSuggestions();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-purple-400 text-purple-400';
      case 'medium': return 'border-purple-300 text-purple-300';
      default: return 'border-purple-200 text-purple-200';
    }
  };

  const handleSuggestionAction = (suggestion) => {
    if (onTabChange && suggestion.actionTab) {
      onTabChange(suggestion.actionTab);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden"
      style={{
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
      }}
    >
      {/* Subtle gradient overlay - matching other sections */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-purple-700/20 pointer-events-none" />
      <div className="absolute inset-0 border-2 border-purple-500 opacity-30 animate-pulse pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-lg font-mono font-bold text-white flex items-center mb-4">
          <div className="w-4 h-4 bg-purple-500 mr-2" />
          SMART SUGGESTIONS
        </h2>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            const priorityClasses = getPriorityColor(suggestion.priority);
            
            return (
              <div
                key={suggestion.id}
                className="bg-gray-900 border border-purple-400 p-3 relative overflow-hidden group transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                style={{
                  boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/8 to-purple-600/12 pointer-events-none" />
                <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon size={16} className={priorityClasses.split(' ')[1]} />
                    <div className="flex-1">
                      <div className={`font-mono font-bold text-sm ${priorityClasses.split(' ')[1]}`}>
                        {suggestion.title}
                      </div>
                      <div className="text-xs font-mono text-gray-300 mt-1">
                        {suggestion.description}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSuggestionAction(suggestion)}
                    className="w-full bg-gray-900 border border-purple-400 px-3 py-2 relative group cursor-pointer transition-all duration-300 hover:border-purple-300 hover:shadow-[0_0_8px_rgba(139,92,246,0.4)] font-mono font-bold text-purple-400 overflow-hidden text-xs"
                    style={{ boxShadow: '0 0 3px rgba(139, 92, 246, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-purple-600/12 pointer-events-none" />
                    <div className="relative z-10">
                      {suggestion.action}
                    </div>
                    <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-5 transition-opacity" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;