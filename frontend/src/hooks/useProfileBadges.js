import { useState, useEffect } from 'react';
import backendAchievementService from '../services/backendAchievementService';

/**
 * Hook for managing profile badge state and operations
 * Handles unlocked achievements, selected badges, and badge modal state
 */
export const useProfileBadges = (username) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);
  const [achievementStats, setAchievementStats] = useState({ total: 0, unlocked: 0 });

  // Load unlocked achievements and badge data
  useEffect(() => {
    const loadAchievementData = async () => {
      try {
        // Get unlocked achievements from backend
        const unlockedData = await backendAchievementService.getUnlockedAchievements(username);
        console.log('🏆 Profile - Unlocked achievements loaded:', unlockedData.length);
        setUnlockedAchievements(unlockedData);

        // Get achievement stats
        const stats = await backendAchievementService.getAchievementStats(username);
        console.log('📊 Profile - Achievement stats:', stats);
        setAchievementStats(stats);

        // Load selected badges from localStorage
        const savedBadges = localStorage.getItem(`selectedBadges_${username}`);
        if (savedBadges) {
          const badgeIds = JSON.parse(savedBadges);
          // Filter to only include badges that are still unlocked
          const validBadges = badgeIds
            .map(id => unlockedData.find(achievement => achievement.id === id))
            .filter(Boolean)
            .slice(0, 3); // Max 3 badges
          setSelectedBadges(validBadges);
        }
      } catch (error) {
        console.error('❌ Error loading achievement data:', error);
      }
    };

    if (username) {
      loadAchievementData();
    }
  }, [username]);

  /**
   * Add a badge to the selected badges
   * @param {object} achievement - Achievement to add as badge
   */
  const addBadge = (achievement) => {
    if (selectedBadges.length >= 3) return;
    
    const newBadges = [...selectedBadges, achievement];
    setSelectedBadges(newBadges);
    
    // Save to localStorage
    const badgeIds = newBadges.map(badge => badge.id);
    localStorage.setItem(`selectedBadges_${username}`, JSON.stringify(badgeIds));
  };

  /**
   * Remove a badge from selected badges
   * @param {string} achievementId - ID of achievement to remove
   */
  const removeBadge = (achievementId) => {
    const newBadges = selectedBadges.filter(badge => badge.id !== achievementId);
    setSelectedBadges(newBadges);
    
    // Save to localStorage
    const badgeIds = newBadges.map(badge => badge.id);
    localStorage.setItem(`selectedBadges_${username}`, JSON.stringify(badgeIds));
  };

  /**
   * Check if an achievement is already selected as a badge
   * @param {string} achievementId - Achievement ID to check
   * @returns {boolean} - True if already selected
   */
  const isBadgeSelected = (achievementId) => {
    return selectedBadges.some(badge => badge.id === achievementId);
  };

  /**
   * Get available achievements that can be added as badges
   * @returns {array} - Achievements that are unlocked but not selected
   */
  const getAvailableAchievements = () => {
    return unlockedAchievements.filter(achievement => !isBadgeSelected(achievement.id));
  };

  /**
   * Open the badge selector modal
   */
  const openBadgeSelector = () => {
    setShowBadgeSelector(true);
  };

  /**
   * Close the badge selector modal
   */
  const closeBadgeSelector = () => {
    setShowBadgeSelector(false);
  };

  return {
    // State
    unlockedAchievements,
    selectedBadges,
    showBadgeSelector,
    achievementStats,
    
    // Actions
    addBadge,
    removeBadge,
    isBadgeSelected,
    getAvailableAchievements,
    openBadgeSelector,
    closeBadgeSelector,
    
    // Computed
    canAddMoreBadges: selectedBadges.length < 3,
    hasUnlockedAchievements: unlockedAchievements.length > 0
  };
};
