import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Target, BookOpen, Tag, Calendar } from 'lucide-react';

const SmartSuggestions = ({ notes = [], tasks = [], folders = [] }) => {
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
    
    // Suggestion logic
    if (recentNotes.length === 0) {
      suggestions.push({
        id: 'create-note',
        type: 'create',
        title: 'START A NEW LOG',
        description: 'Begin documenting your latest discoveries and thoughts',
        action: 'Create Note',
        icon: BookOpen,
        priority: 'high'
      });
    }

    if (untaggedNotes.length >= 3) {
      suggestions.push({
        id: 'organize-tags',
        type: 'organize',
        title: 'ORGANIZE YOUR ARCHIVE',
        description: `${untaggedNotes.length} notes need classification tags`,
        action: 'Add Tags',
        icon: Tag,
        priority: 'medium'
      });
    }

    if (incompleteTasks.length >= 5) {
      suggestions.push({
        id: 'complete-tasks',
        type: 'complete',
        title: 'MISSION OVERLOAD',
        description: `${incompleteTasks.length} active missions need attention`,
        action: 'Review Tasks',
        icon: Target,
        priority: 'high'
      });
    }

    if (folders.length === 0) {
      suggestions.push({
        id: 'create-folder',
        type: 'organize',
        title: 'CREATE STORAGE SYSTEM',
        description: 'Set up organized archives for better data management',
        action: 'Create Archive',
        icon: BookOpen,
        priority: 'medium'
      });
    }

    // Default motivational suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        id: 'productivity-boost',
        type: 'motivate',
        title: 'PRODUCTIVITY BOOST',
        description: 'Schedule a focus session for maximum efficiency',
        action: 'Plan Session',
        icon: Zap,
        priority: 'low'
      });
    }

    return suggestions.slice(0, 3);
  };

  const suggestions = generateSuggestions();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 text-red-400';
      case 'medium': return 'border-purple-400 text-purple-400';
      default: return 'border-purple-300 text-purple-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 relative"
      style={{
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.3), 4px 4px 0px 0px rgba(0,0,0,1)'
      }}
    >
      <div className="absolute inset-0 border-2 border-purple-500 opacity-30 animate-pulse pointer-events-none" />
      
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
              className={`bg-gray-900 border ${priorityClasses.split(' ')[0]} p-3 relative transition-all duration-300 hover:shadow-[0_0_8px_rgba(139,92,246,0.4)]`}
              style={{
                boxShadow: '0 0 5px rgba(139, 92, 246, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-start gap-3">
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
              
              <button className={`mt-3 w-full bg-gray-800 border ${priorityClasses.split(' ')[0]} px-3 py-2 text-xs font-mono font-bold ${priorityClasses.split(' ')[1]} transition-all duration-300 hover:bg-gray-700`}
                      style={{ boxShadow: '0 0 3px rgba(139, 92, 246, 0.2), 1px 1px 0px 0px rgba(0,0,0,1)' }}>
                {suggestion.action}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xs font-mono text-purple-400">
          AI ANALYSIS COMPLETE • {suggestions.length} RECOMMENDATIONS
        </div>
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;