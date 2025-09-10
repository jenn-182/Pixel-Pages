import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Plus, Trophy, Code, BookOpen, Briefcase, Palette, User } from 'lucide-react';

const SaveSessionModal = ({ 
  isOpen, 
  onSave, 
  onDiscard, 
  timeSpent, 
  sessionType = 'session' // 'session' or 'partial'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [savedCategories, setSavedCategories] = useState([]);

  // Default categories with gaming theme
  const defaultCategories = [
    { id: 'study', name: 'Study', icon: BookOpen, color: '#3B82F6', xp: 0 },
    { id: 'work', name: 'Work', icon: Briefcase, color: '#10B981', xp: 0 },
    { id: 'read', name: 'Read', icon: BookOpen, color: '#8B5CF6', xp: 0 },
    { id: 'create', name: 'Create', icon: Palette, color: '#F59E0B', xp: 0 },
    { id: 'code', name: 'Code', icon: Code, color: '#EF4444', xp: 0 }
  ];

  // Load saved categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focusCategories');
    if (saved) {
      setSavedCategories(JSON.parse(saved));
    } else {
      // Initialize with defaults
      localStorage.setItem('focusCategories', JSON.stringify(defaultCategories));
      setSavedCategories(defaultCategories);
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCustomInput(false);
    setCustomCategoryName('');
  };

  // Handle custom category
  const handleCustomCategory = () => {
    setShowCustomInput(true);
    setSelectedCategory('custom');
  };

  // Save session with category
  const handleSave = () => {
    let finalCategory = selectedCategory;
    
    if (selectedCategory === 'custom' && customCategoryName.trim()) {
      // Create new custom category
      const newCategory = {
        id: customCategoryName.toLowerCase().replace(/\s+/g, '_'),
        name: customCategoryName.trim(),
        icon: User,
        color: '#6B7280',
        xp: 0,
        isCustom: true
      };
      
      const updatedCategories = [...savedCategories, newCategory];
      setSavedCategories(updatedCategories);
      localStorage.setItem('focusCategories', JSON.stringify(updatedCategories));
      
      finalCategory = newCategory.id;
    }
    
    if (finalCategory && finalCategory !== 'custom') {
      // Update XP for selected category
      const updatedCategories = savedCategories.map(cat => 
        cat.id === finalCategory 
          ? { ...cat, xp: (cat.xp || 0) + timeSpent }
          : cat
      );
      setSavedCategories(updatedCategories);
      localStorage.setItem('focusCategories', JSON.stringify(updatedCategories));
      
      onSave(finalCategory);
    }
  };

  // Reset modal state
  const resetModal = () => {
    setSelectedCategory('');
    setCustomCategoryName('');
    setShowCustomInput(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCategoryData = savedCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 border-2 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md relative"
        style={{
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-700/20 pointer-events-none" />
        <div className="absolute inset-0 border-2 border-purple-500 opacity-30 animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
            <h3 className="font-mono text-xl font-bold text-white mb-2">
              {sessionType === 'partial' ? 'PARTIAL SESSION COMPLETE!' : 'SESSION COMPLETE!'}
            </h3>
            <p className="font-mono text-purple-400 text-lg">
              +{timeSpent} minutes earned
            </p>
            <p className="font-mono text-gray-400 text-sm mt-1">
              Choose a category to gain XP or discard
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <div className="text-sm font-mono text-gray-300 mb-3">SELECT CATEGORY:</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {savedCategories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-3 border-2 transition-all duration-200 font-mono text-sm ${
                      selectedCategory === category.id
                        ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent size={16} style={{ color: category.color }} />
                      <span className="text-white font-bold">{category.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {category.xp || 0}m XP
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Button */}
            <button
              onClick={handleCustomCategory}
              className={`w-full p-3 border-2 transition-all duration-200 font-mono text-sm ${
                selectedCategory === 'custom'
                  ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={16} className="text-gray-400" />
                <span className="text-gray-300">Create New Category</span>
              </div>
            </button>

            {/* Custom Category Input */}
            {showCustomInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3"
              >
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-600 text-white font-mono text-sm focus:border-purple-400 focus:outline-none"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          {/* XP Preview */}
          {selectedCategoryData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-purple-500 p-3 mb-6"
            >
              <div className="text-center font-mono">
                <div className="text-sm text-gray-400">XP GAIN PREVIEW:</div>
                <div className="text-lg text-purple-400 font-bold">
                  {selectedCategoryData.name}: {(selectedCategoryData.xp || 0)}m → {(selectedCategoryData.xp || 0) + timeSpent}m
                </div>
                <div className="text-xs text-green-400">+{timeSpent} XP gained!</div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!selectedCategory || (selectedCategory === 'custom' && !customCategoryName.trim())}
              className="flex-1 bg-gray-900 border-2 border-green-500 px-4 py-3 font-mono font-bold text-green-500 hover:bg-green-500 hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Save size={16} />
                <span>SAVE +{timeSpent} XP</span>
              </div>
            </button>

            <button
              onClick={onDiscard}
              className="flex-1 bg-gray-900 border-2 border-red-500 px-4 py-3 font-mono font-bold text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Trash2 size={16} />
                <span>DISCARD</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SaveSessionModal;