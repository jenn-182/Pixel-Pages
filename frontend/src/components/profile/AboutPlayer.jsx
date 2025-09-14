import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Star, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getPlayerInfo, savePlayerInfo, skillBranches, countries } from '../../data/playerInfo';

const AboutPlayer = () => {
  const { currentTheme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  
  const [playerInfo, setPlayerInfo] = useState(() => getPlayerInfo());
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(playerInfo);

  const handleSave = () => {
    setPlayerInfo(editData);
    savePlayerInfo(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(playerInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 relative overflow-hidden"
      style={{
        backgroundColor: themeColors.backgroundColor,
        border: `2px solid ${themeColors.borderColor}`,
        borderRadius: '12px',
        boxShadow: currentTheme === 'default' 
          ? `0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)` 
          : `0 0 3px ${themeColors.primary}50, 4px 4px 0px 0px rgba(0,0,0,1)`
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: currentTheme === 'default' 
               ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.1))'
               : `linear-gradient(to bottom right, ${themeColors.secondary}15, ${themeColors.secondary}20)`,
             borderRadius: '12px'
           }} />
        
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-mono font-bold text-white flex items-center">
            {currentTheme === 'pink' ? (
              <Heart 
                size={18} 
                className="mr-2" 
                style={{ color: themeColors.secondary }}
              />
            ) : (
              <Star 
                size={18} 
                className="mr-2" 
                style={{ color: themeColors.secondary }}
              />
            )}
            ABOUT PLAYER
          </h3>
          
          <div className="flex gap-2">
            {/* Edit/Save Button */}
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="px-2 py-1 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-1"
              style={{
                backgroundColor: themeColors.backgroundColor,
                border: `2px solid ${themeColors.controlColor}`,
                borderRadius: '8px',
                color: themeColors.controlColor,
                boxShadow: currentTheme === 'default' 
                  ? '0 0 6px rgba(255, 255, 255, 0.3), 1px 1px 0px 0px rgba(0,0,0,1)' 
                  : `0 0 4px ${themeColors.controlColor}50, 1px 1px 0px 0px rgba(0,0,0,1)`
              }}
            >
              <div className="relative z-10 flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Save size={12} style={{ color: themeColors.controlColor }} />
                    <span className="text-xs">SAVE</span>
                  </>
                ) : (
                  <>
                    <Edit3 size={12} style={{ color: themeColors.controlColor }} />
                    <span className="text-xs">EDIT</span>
                  </>
                )}
              </div>
            </button>
            
            {/* Cancel Button (only shown when editing) */}
            {isEditing && (
              <button
                onClick={handleCancel}
                className="px-2 py-1 relative group cursor-pointer transition-all duration-300 font-mono font-bold overflow-hidden flex items-center gap-1"
                style={{
                  backgroundColor: themeColors.backgroundColor,
                  border: `2px solid #EF4444`,
                  borderRadius: '8px',
                  color: '#EF4444',
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.4), 1px 1px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="relative z-10 flex items-center gap-1">
                  <X size={12} style={{ color: '#EF4444' }} />
                  <span className="text-xs">CANCEL</span>
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Nickname */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">NICKNAME</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="Enter nickname"
                  className="w-full bg-transparent text-white font-mono font-bold text-sm border-none outline-none"
                  style={{ color: 'white' }}
                />
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.nickname || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">COUNTRY</div>
              {isEditing ? (
                <select
                  value={editData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full text-white font-mono font-bold text-sm border-none outline-none"
                  style={{
                    backgroundColor: themeColors.backgroundColor,
                    border: `1px solid ${themeColors.borderColor}`,
                    borderRadius: '4px',
                    padding: '2px 4px'
                  }}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.country || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">AGE</div>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                  className="w-full bg-transparent text-white font-mono font-bold text-sm border-none outline-none"
                  style={{ color: 'white' }}
                />
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.age || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Favorite Skill */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">FAVORITE SKILL</div>
              {isEditing ? (
                <select
                  value={editData.favoriteSkill}
                  onChange={(e) => handleInputChange('favoriteSkill', e.target.value)}
                  className="w-full text-white font-mono font-bold text-sm border-none outline-none"
                  style={{
                    backgroundColor: themeColors.backgroundColor,
                    border: `1px solid ${themeColors.borderColor}`,
                    borderRadius: '4px',
                    padding: '2px 4px'
                  }}
                >
                  <option value="">Select skill</option>
                  {skillBranches.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.favoriteSkill || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Dream Career */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">DREAM CAREER</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.dreamCareer}
                  onChange={(e) => handleInputChange('dreamCareer', e.target.value)}
                  placeholder="Dream career"
                  className="w-full bg-transparent text-white font-mono font-bold text-sm border-none outline-none"
                  style={{ color: 'white' }}
                />
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.dreamCareer || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {/* Favorite Game */}
          <div className="p-3 relative overflow-hidden"
               style={{
                 backgroundColor: themeColors.backgroundColor,
                 border: `1px solid ${themeColors.borderColor}`,
                 borderRadius: '8px'
               }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: currentTheme === 'default' 
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(6,182,212,0.05))'
                     : `linear-gradient(to bottom right, ${themeColors.secondary}10, ${themeColors.secondary}15)`,
                   borderRadius: '8px'
                 }} />
            <div className="relative z-10">
              <div className="text-xs font-mono text-gray-400 mb-1">FAVORITE GAME</div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.favoriteGame}
                  onChange={(e) => handleInputChange('favoriteGame', e.target.value)}
                  placeholder="Favorite game"
                  className="w-full bg-transparent text-white font-mono font-bold text-sm border-none outline-none"
                  style={{ color: 'white' }}
                />
              ) : (
                <div className="text-sm font-mono font-bold text-white">
                  {playerInfo.favoriteGame || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPlayer;