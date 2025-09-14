import apiService from './api';
import { allAchievements } from '../data/achievements';

class BackendAchievementService {
  constructor() {
    this.allAchievements = [];
    this.playerAchievements = [];
    this.playerStats = {};
    this.loaded = false;
  }

  getUnlockedAchievements() {
    if (!this.loaded) {
      console.warn('⚠️ Backend achievement service not loaded yet');
      return [];
    }
    
    console.log('🔍 DEBUG: Total playerAchievements:', this.playerAchievements.length);
    console.log('🔍 DEBUG: Sample achievement:', this.playerAchievements[0]);
    
    // API returns achievements with 'completed' field and 'id' field
    const unlockedAchievements = this.playerAchievements
      .filter(achievement => achievement.completed === true)
      .map(achievement => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt || new Date().toISOString()
      }));
    
    console.log('🔓 Found unlocked achievements:', unlockedAchievements.length);
    console.log('🔓 Unlocked IDs:', unlockedAchievements.map(a => a.id));
    return unlockedAchievements;
  }

  getLockedAchievements() {
    if (!this.loaded) {
      console.warn('⚠️ Backend achievement service not loaded yet');
      return [];
    }
    
    // API returns all achievements, filter out the completed ones
    return this.playerAchievements.filter(achievement => achievement.completed !== true);
  }

  getInProgressAchievements() {
    if (!this.loaded) {
      console.warn('⚠️ Backend achievement service not loaded yet');
      return [];
    }
    
    // API returns achievements - filter for ones with progress > 0 but not completed
    const inProgressAchievements = this.playerAchievements.filter(achievement => 
      achievement.progress > 0 && achievement.completed !== true
    );
    
    console.log('📈 Found in-progress achievements:', inProgressAchievements.length);
    console.log('📈 In-progress sample:', inProgressAchievements.slice(0, 3).map(a => ({
      id: a.id, 
      progress: a.progress, 
      maxProgress: a.maxProgress, 
      completed: a.completed
    })));
    
    return inProgressAchievements;
  }

  // Load player data from localStorage
  loadPlayerDataFromLocalStorage() {
    console.log('🔄 LOADING PLAYER DATA FROM LOCALSTORAGE');
    
    // Load unlocked achievements from localStorage and filter out nulls
    const unlockedIds = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
      .filter(id => id !== null && id !== undefined);
    
    const achievementData = JSON.parse(localStorage.getItem('achievementData') || '{}');
    
    console.log('📦 LocalStorage player data:', { unlockedIds, achievementData });
    
    // 🔍 DEBUG: Check if the achievement IDs from localStorage actually exist
    unlockedIds.forEach(id => {
      const exists = this.allAchievements.find(a => a.id === id);
      if (!exists) {
        console.warn(`⚠️ Achievement ${id} from localStorage not found in allAchievements`);
        console.log('Available achievement IDs starting with FIRST:', 
          this.allAchievements.filter(a => a.id.includes('FIRST')).map(a => a.id)
        );
      }
    });
    
    // Convert to player achievement format
    this.playerAchievements = unlockedIds.map(achievementId => ({
      achievementId,
      unlocked: true,
      progress: 100,
      unlockedAt: achievementData[achievementId]?.unlockedAt || new Date().toISOString()
    }));
    
    // Mock player stats
    this.playerStats = {
      totalNotes: 0,
      totalWords: 0,
      completedAchievements: unlockedIds.length,
      totalSessions: 0,
      totalFocusTime: 0,
      totalXp: unlockedIds.length * 100 // 100 XP per achievement
    };
    
    console.log('✅ Loaded player data from localStorage:', {
      playerAchievements: this.playerAchievements.length,
      unlockedCount: unlockedIds.length
    });
  }

  // NEW: Load from localStorage if backend fails completely
  loadFromLocalStorage() {
    console.log('🔄 LOADING EVERYTHING FROM LOCALSTORAGE');
    
    // Use local achievements data
    this.allAchievements = allAchievements;
    
    // Load player data
    this.loadPlayerDataFromLocalStorage();
    
    this.loaded = true;
    
    console.log('✅ Loaded everything from localStorage:', {
      allAchievements: this.allAchievements.length,
      playerAchievements: this.playerAchievements.length
    });
  }

  async loadData(username = 'Jroc_182') {
    console.log('🚀 BACKEND SERVICE: Starting loadData for', username);
    try {
      console.log('🔄 BACKEND SERVICE: Loading data for', username);
      
      // Try to load achievements from API
      let achievements = [];
      try {
        achievements = await apiService.getAllAchievements();
        console.log('✅ Loaded achievements from API:', achievements?.length || 0);
      } catch (error) {
        console.warn('⚠️ Failed to load achievements from API, using local data');
        achievements = allAchievements;
      }

      // Try to load player data from API
      let playerAchievements = [];
      let stats = {};
      
      try {
        console.log('📡 Fetching player achievements and stats from API...');
        console.log('📡 Testing individual API calls...');
        
        // Test individual calls with detailed logging
        const playerAchievementsData = await apiService.getPlayerAchievements(username);
        console.log('📡 getPlayerAchievements response:', {
          type: typeof playerAchievementsData,
          isArray: Array.isArray(playerAchievementsData),
          length: playerAchievementsData?.length,
          first3: playerAchievementsData?.slice(0, 3)
        });
        
        const statsData = await apiService.getAchievementPlayerStats(username);
        console.log('📡 getAchievementPlayerStats response:', {
          type: typeof statsData,
          keys: Object.keys(statsData || {}),
          data: statsData
        });
        
        playerAchievements = playerAchievementsData || [];
        stats = statsData || {};
        console.log('✅ Loaded player data from API:', {
          playerAchievementsCount: playerAchievements.length,
          completedCount: playerAchievements.filter(a => a.completed).length,
          stats
        });
      } catch (error) {
        console.warn('⚠️ Failed to load player data from API, using localStorage');
        console.error('API Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        // Don't load from localStorage here yet - we'll do it below
      }

      // Set the achievements data (either from API or local)
      this.allAchievements = achievements;

      // Check if we got meaningful player data from API
      const hasCompletedAchievements = playerAchievements.some(a => a.completed === true);
      const hasValidStats = Object.keys(stats).length > 0 && stats.completedAchievements > 0;
      
      console.log('🔍 CONDITION CHECK DETAILED:', {
        playerAchievementsLength: playerAchievements.length,
        hasCompletedAchievements,
        completedCount: playerAchievements.filter(a => a.completed).length,
        hasValidStats,
        statsKeys: Object.keys(stats),
        statsCompletedAchievements: stats.completedAchievements,
        firstCompletedAchievement: playerAchievements.find(a => a.completed === true),
        willUseAPI: hasCompletedAchievements || hasValidStats
      });
      
      if (hasCompletedAchievements || hasValidStats) {
        console.log('📡 ✅ USING API PLAYER DATA - found completed achievements or valid stats');
        console.log('   - completed achievements:', playerAchievements.filter(a => a.completed).length);
        console.log('   - stats:', stats);
        console.log('   - Setting this.playerAchievements to:', playerAchievements.length, 'items');
        this.playerAchievements = playerAchievements;
        this.playerStats = stats;
        
        // VERIFY assignment worked
        console.log('   - VERIFICATION: this.playerAchievements length after assignment:', this.playerAchievements.length);
        console.log('   - VERIFICATION: this.playerAchievements[0]:', this.playerAchievements[0]);
      } else {
        console.log('💾 ❌ NO MEANINGFUL API PLAYER DATA - loading from localStorage');
        console.log('   - Reason: hasCompletedAchievements =', hasCompletedAchievements, ', hasValidStats =', hasValidStats);
        this.loadPlayerDataFromLocalStorage();
      }

      this.loaded = true;

      console.log('🔍 BACKEND SERVICE: Final data loaded:');
      console.log('   - achievements:', this.allAchievements?.length || 0);
      console.log('   - playerAchievements:', this.playerAchievements?.length || 0);
      console.log('   - stats:', this.playerStats);
      console.log('✅ Backend achievement data loaded for', username);

      return { 
        achievements: this.allAchievements, 
        playerAchievements: this.playerAchievements, 
        stats: this.playerStats 
      };
    } catch (error) {
      console.error('❌ Failed to load backend achievements:', error);
      
      // 🔄 COMPLETE FALLBACK: Load everything from localStorage
      console.log('🔄 COMPLETE BACKEND FAILURE: Loading everything from localStorage');
      this.loadFromLocalStorage();
      
      return {
        achievements: this.allAchievements,
        playerAchievements: this.playerAchievements,
        stats: this.playerStats
      };
    }
  }

  isUnlocked(achievementId) {
    if (!this.loaded) return false;
    
    const achievement = this.playerAchievements.find(a => a.id === achievementId);
    return achievement?.completed || false;
  }

  unlockAchievement(achievementId) {
    // Find or create player achievement
    let playerAch = this.playerAchievements.find(pa => pa.achievementId === achievementId);
    
    if (!playerAch) {
      playerAch = {
        achievementId,
        progress: 100,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
      this.playerAchievements.push(playerAch);
    } else {
      playerAch.unlocked = true;
      playerAch.progress = 100;
      playerAch.unlockedAt = new Date().toISOString();
    }
    
    console.log(`🏆 Unlocked achievement: ${achievementId}`);
  }

  getStats() {
    if (!this.loaded) {
      return {
        total: 0,
        unlocked: 0,
        locked: 0,
        inProgress: 0,
        completionRate: 0
      };
    }

    const unlockedCount = this.getUnlockedAchievements().length;
    const totalCount = this.allAchievements.length;
    const inProgressCount = this.getInProgressAchievements().length;
    const lockedCount = totalCount - unlockedCount;

    return {
      total: totalCount,
      unlocked: unlockedCount,
      locked: lockedCount,
      inProgress: inProgressCount,
      completionRate: totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0
    };
  }
}

// Export singleton instance
const backendAchievementService = new BackendAchievementService();
export default backendAchievementService;