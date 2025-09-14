// DEPRECATED - This service is being migrated to backend-only storage
// Use backendAchievementService instead
import backendAchievementService from './backendAchievementService';

console.warn('⚠️ achievementService is deprecated - use backendAchievementService instead');

class AchievementService {
  constructor() {
    console.warn('⚠️ This service is deprecated. Use backendAchievementService for all achievement operations.');
    this.listeners = [];
  }

  // Redirect all methods to backend service
  async loadUnlockedAchievements() {
    console.warn('⚠️ Use backendAchievementService.loadData() instead');
    return [];
  }

  isUnlocked(achievementId) {
    console.warn('⚠️ Use backendAchievementService.isUnlocked() instead');
    return backendAchievementService.isUnlocked(achievementId);
  }

  getUnlockedAchievements() {
    console.warn('⚠️ Use backendAchievementService.getUnlockedAchievements() instead');
    return backendAchievementService.getUnlockedAchievements();
  }

  async unlockAchievement(achievementId) {
    console.warn('⚠️ Use backendAchievementService.unlockAchievement() instead');
    return false;
  }

  getStats() {
    console.warn('⚠️ Use backendAchievementService.getStats() instead');
    return backendAchievementService.getStats();
  }

  resetAchievements() {
    console.warn('⚠️ Use backendAchievementService.resetAchievements() instead');
  }

  // Stub methods for backward compatibility
  checkAchievements() {
    console.warn('⚠️ Use backendAchievementService.recalculateAchievements() instead');
    return [];
  }

  async getCurrentUserStats() {
    console.warn('⚠️ User stats now come from backend');
    return {};
  }

  async recalculateAchievements() {
    console.warn('⚠️ Use backendAchievementService.recalculateAchievements() instead');
    return [];
  }

  cleanupLocalStorage() {
    console.warn('⚠️ No longer needed - achievements are in backend database');
  }

  forceUnlock() {
    console.warn('⚠️ Use backendAchievementService.unlockAchievement() instead');
  }

  // Event listeners for backward compatibility
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(achievement) {
    this.listeners.forEach(callback => callback(achievement));
  }
}

// Export singleton instance
const achievementService = new AchievementService();
export default achievementService;
