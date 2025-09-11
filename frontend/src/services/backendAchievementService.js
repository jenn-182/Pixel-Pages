import apiService from './api';

class BackendAchievementService {
  constructor() {
    this.allAchievements = [];
    this.playerAchievements = [];
    this.playerStats = {};
    this.loaded = false;
  }

  async loadData(username = 'user') {  // Changed from 'testuser' to 'Jroc_182'
    try {
      const [achievements, playerAchievements, stats] = await Promise.all([
        apiService.getAllAchievements(),
        apiService.getPlayerAchievements(username),
        apiService.getAchievementPlayerStats(username)
      ]);

      // DEBUG: Log the actual data structure with more detail
      console.log('🔍 DEBUG - Raw backend data for', username + ':');
      console.log('First 2 achievements:', achievements.slice(0, 2));
      console.log('First 5 player achievements:', playerAchievements.slice(0, 5));

      // Show specific fields we're looking for
      if (playerAchievements.length > 0) {
        const firstPlayerAch = playerAchievements[0];
        console.log('🔍 PlayerAchievement fields:', Object.keys(firstPlayerAch));
        console.log('🔍 Sample PlayerAchievement:', firstPlayerAch);
      }

      this.allAchievements = achievements;
      this.playerAchievements = playerAchievements;
      this.playerStats = stats;
      this.loaded = true;

      console.log('✅ Backend achievement data loaded for', username + ':', {
        achievements: achievements.length,
        playerProgress: playerAchievements.length,
        stats
      });

      // Debugging completed achievements
      console.log('🔍 Completed achievements:', 
        playerAchievements.filter(pa => pa.completed === true)
      );
      console.log('🔍 Sample completed achievement:', 
        playerAchievements.find(pa => pa.completed === true)
      );

      return { achievements, playerAchievements, stats };
    } catch (error) {
      console.error('❌ Failed to load backend achievements:', error);
      throw error;
    }
  }

  isUnlocked(achievementId) {
    const playerAchievement = this.playerAchievements.find(pa => 
      pa.id === achievementId  // Use 'id' not 'achievementId'
    );
    return playerAchievement?.completed === true; // Explicit boolean check
  }

  getAchievementProgress(achievementId, userStats) {
    const playerAchievement = this.playerAchievements.find(pa => pa.id === achievementId);
    
    if (playerAchievement?.completed) {
      return 1; // Return 1 (100%) for completed achievements
    }
    
    // For in-progress achievements, use the progress field
    const progressValue = playerAchievement?.progress || 0;
    const maxProgress = playerAchievement?.maxProgress || 100;
    return progressValue / maxProgress; // Convert to decimal
  }

  getUnlockedAchievements() {
    return this.playerAchievements
      .filter(pa => pa.completed)  // These are already the full achievement objects
      .map(playerAch => ({
        ...playerAch,
        unlockedAt: playerAch.unlockedAt
      }));
  }

  getLockedAchievements() {
    return this.allAchievements.filter(a => !this.isUnlocked(a.id));
  }

  getInProgressAchievements() {
    return this.playerAchievements
      .filter(pa => !pa.completed && (pa.progress || 0) > 0)  // Use 'progress' field
      .map(playerAch => ({
        ...playerAch,
        progress: playerAch.progress || 0,
        currentProgress: playerAch.progress || 0,
        targetValue: 100
      }));
  }

  getStats() {
    const unlocked = this.getUnlockedAchievements();
    const total = this.allAchievements.length;
    
    return {
      total,
      unlocked: unlocked.length,
      percentage: total > 0 ? Math.round((unlocked.length / total) * 100) : 0,
      totalXP: this.playerStats.totalXp || 0,
      byTier: {
        common: unlocked.filter(a => a.tier === 'common').length,
        uncommon: unlocked.filter(a => a.tier === 'uncommon').length,
        rare: unlocked.filter(a => a.tier === 'rare').length,
        legendary: unlocked.filter(a => a.tier === 'legendary').length
      }
    };
  }
}

export default new BackendAchievementService();