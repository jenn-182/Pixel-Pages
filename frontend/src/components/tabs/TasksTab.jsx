import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Clock, AlertCircle } from 'lucide-react';

const TasksTab = ({ tabColor = '#0EA5E9' }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project documentation', completed: false, priority: 'high' },
    { id: 2, title: 'Review code changes', completed: true, priority: 'medium' },
    { id: 3, title: 'Schedule team meeting', completed: false, priority: 'low' }
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="tasks-tab-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div 
            className="w-6 h-6 border border-gray-600" 
            style={{ backgroundColor: tabColor }}
          />
          TASK COMMAND CENTER
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Mission objectives and task management terminal.
        </p>
      </div>

      {/* Quick Add Task */}
      <div className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task objective..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 text-white font-mono focus:border-cyan-400 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <motion.button
            onClick={addTask}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            DEPLOY
          </motion.button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className={`p-4 border border-gray-600 bg-gray-800 flex items-center gap-4 ${
              task.completed ? 'opacity-60' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            layout
          >
            <motion.button
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 border-2 flex items-center justify-center ${
                task.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-400 hover:border-cyan-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {task.completed && <CheckSquare size={16} className="text-white" />}
            </motion.button>
            
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            />
            
            <span className={`flex-1 font-mono ${
              task.completed ? 'line-through text-gray-500' : 'text-white'
            }`}>
              {task.title}
            </span>
            
            <span className="text-xs text-gray-400 font-mono uppercase">
              {task.priority}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Task Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-gray-400 font-mono">ACTIVE</div>
        </div>
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-green-400 font-mono">
            {tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-400 font-mono">COMPLETE</div>
        </div>
        <div className="p-4 bg-gray-800 border border-gray-600 text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {tasks.length}
          </div>
          <div className="text-sm text-gray-400 font-mono">TOTAL</div>
        </div>
      </div>
    </div>
  );
};

export default TasksTab;