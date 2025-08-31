import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, SortAsc, SortDesc, Target, Crosshair } from 'lucide-react';

const TaskSearch = ({ tasks, onFilteredResults, onQuickAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority'); // priority, dueDate, created, title
  const [sortOrder, setSortOrder] = useState('desc');
  const [quickFilters, setQuickFilters] = useState({
    overdue: false,
    dueSoon: false,
    highPriority: false,
    untagged: false
  });

  useEffect(() => {
    performSearch();
  }, [searchQuery, sortBy, sortOrder, quickFilters, tasks]);

  const performSearch = () => {
    let filtered = [...tasks];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.toLowerCase().includes(query))
      );
    }

    // Quick filters
    if (quickFilters.overdue) {
      filtered = filtered.filter(task => task.overdue && !task.completed);
    }
    if (quickFilters.dueSoon) {
      filtered = filtered.filter(task => task.dueSoon && !task.completed);
    }
    if (quickFilters.highPriority) {
      filtered = filtered.filter(task => task.priority === 'high' && !task.completed);
    }
    if (quickFilters.untagged) {
      filtered = filtered.filter(task => !task.tags || task.tags.trim() === '');
    }

    // Sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
          valueA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          valueB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'created':
          valueA = new Date(a.createdAt || a.created || '2020-01-01');
          valueB = new Date(b.createdAt || b.created || '2020-01-01');
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onFilteredResults(filtered);
  };

  const toggleQuickFilter = (filterName) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSortBy('priority');
    setSortOrder('desc');
    setQuickFilters({
      overdue: false,
      dueSoon: false,
      highPriority: false,
      untagged: false
    });
  };

  const hasActiveFilters = searchQuery.trim() || Object.values(quickFilters).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border-2 border-cyan-400 p-4 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative"
      style={{
        boxShadow: '0 0 10px rgba(34, 211, 238, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)'
      }}
    >
      <div className="absolute inset-0 border-2 border-cyan-400 opacity-20 animate-pulse pointer-events-none" />
      
      {/* Search Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-cyan-400" />
        <h4 className="text-lg font-mono font-bold text-white">SEARCH & FILTER</h4>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search missions, descriptions, tags..."
          className="w-full bg-gray-800 border-2 border-gray-600 text-white pl-10 pr-10 py-2 font-mono text-sm focus:outline-none focus:border-cyan-400 transition-colors duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-cyan-400">QUICK FILTERS</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleQuickFilter('overdue')}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
              quickFilters.overdue
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
            }`}
          >
            OVERDUE
          </button>
          <button
            onClick={() => toggleQuickFilter('dueSoon')}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
              quickFilters.dueSoon
                ? 'bg-yellow-500 border-yellow-500 text-white'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white'
            }`}
          >
            DUE SOON
          </button>
          <button
            onClick={() => toggleQuickFilter('highPriority')}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
              quickFilters.highPriority
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
            }`}
          >
            HIGH PRIORITY
          </button>
          <button
            onClick={() => toggleQuickFilter('untagged')}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] ${
              quickFilters.untagged
                ? 'bg-gray-500 border-gray-500 text-white'
                : 'border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white'
            }`}
          >
            UNTAGGED
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4 bg-gray-800 border border-cyan-400 p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 border-2 border-gray-600 text-white px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Deadline</option>
            <option value="created">Created</option>
            <option value="title">Mission Name</option>
          </select>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 p-1 border border-cyan-400 hover:border-cyan-300"
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-mono font-bold text-gray-400 hover:text-cyan-400 transition-colors duration-200 ml-auto px-2 py-1 border border-gray-600 hover:border-cyan-400"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-cyan-400">BULK OPERATIONS</label>
        <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-cyan-400">
          <button
            onClick={() => onQuickAction('markAllComplete')}
            className="px-3 py-1 text-xs font-mono font-bold border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-1">
              <Target size={12} />
              COMPLETE ALL VISIBLE
            </div>
          </button>
          <button
            onClick={() => onQuickAction('deleteCompleted')}
            className="px-3 py-1 text-xs font-mono font-bold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-1">
              <X size={12} />
              ARCHIVE COMPLETED
            </div>
          </button>
          <button
            onClick={() => onQuickAction('addToProject')}
            className="px-3 py-1 text-xs font-mono font-bold border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-1">
              <Crosshair size={12} />
              BULK ASSIGN
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskSearch;