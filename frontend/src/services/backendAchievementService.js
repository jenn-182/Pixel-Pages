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

      this.allAchievements = achievements;
      this.playerAchievements = playerAchievements;
      this.playerStats = stats;
      this.loaded = true;

      console.log('✅ Backend achievement data loaded for', username);

      return { achievements, playerAchievements, stats };
    } catch (error) {
      console.error('❌ Failed to load backend achievements:', error);
      throw error;
    }
  }

isUnlocked(achievementId) {
  const playerAchievement = this.playerAchievements.find(pa => 
    pa.achievementId === achievementId || pa.id === achievementId 
  );
  return playerAchievement?.completed === true;
}

getAchievementProgress(achievementId, userStats) {
  const playerAchievement = this.playerAchievements.find(pa => 
    pa.achievementId === achievementId || pa.id === achievementId  // ✅ Check both fields
  ); 
  
  if (playerAchievement?.completed) {
    return 1; 
  }
  
  // For in-progress achievements, use the progress percentage
  if (playerAchievement?.progressPercentage) {
    return playerAchievement.progressPercentage / 100;
  }
  
  // Fallback calculation
  const progressValue = playerAchievement?.progress || 0;
  const maxProgress = playerAchievement?.maxProgress || 100;
  return maxProgress > 0 ? progressValue / maxProgress : 0;
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
    console.log('🔍 DEBUG: Checking for in-progress achievements...');
    
    const filtered = this.playerAchievements.filter(achievement => {
      const isNotCompleted = !achievement.completed;
      const hasProgress = (achievement.progressPercentage || 0) > 0;
      const isNotFullyComplete = (achievement.progressPercentage || 0) < 100;
      
      console.log(`🔍 Achievement ${achievement.name}:`, {
        completed: achievement.completed,
        progressPercentage: achievement.progressPercentage,
        isNotCompleted,
        hasProgress,
        isNotFullyComplete,
        willInclude: isNotCompleted && hasProgress && isNotFullyComplete
      });
      
      return isNotCompleted && hasProgress && isNotFullyComplete;
    });
    
    console.log('🔍 Filtered in-progress achievements:', filtered.length);
    
    return filtered.map(playerAch => ({
      ...playerAch,
      progress: playerAch.progressPercentage || 0,
      currentProgress: playerAch.progress || 0,
      targetProgress: playerAch.maxProgress || 100,
      progressPercentage: playerAch.progressPercentage || 0
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