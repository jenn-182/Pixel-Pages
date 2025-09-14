package com.pixelpages.repository;

import com.pixelpages.model.PlayerAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerAchievementRepository extends JpaRepository<PlayerAchievement, Integer> {  // CHANGED FROM Long TO Integer
    
    // Find all achievements for a user
    List<PlayerAchievement> findByUsername(String username);
    
    // Find specific achievement progress for a user
    Optional<PlayerAchievement> findByUsernameAndAchievementId(String username, String achievementId);
    
    // Find completed achievements for a user
    List<PlayerAchievement> findByUsernameAndCompleted(String username, boolean completed);
    
    // Find achievements in progress (not completed, but has progress > 0)
    @Query("SELECT pa FROM PlayerAchievement pa WHERE pa.username = :username AND pa.completed = false AND pa.progress > 0")
    List<PlayerAchievement> findInProgressByUsername(@Param("username") String username);
    
    // Count completed achievements for a user
    @Query("SELECT COUNT(pa) FROM PlayerAchievement pa WHERE pa.username = :username AND pa.completed = true")
    long countCompletedByUsername(@Param("username") String username);
    
    // Get total XP earned from completed achievements
    @Query("SELECT COALESCE(SUM(a.xpReward), 0) FROM PlayerAchievement pa JOIN Achievement a ON pa.achievementId = a.id WHERE pa.username = :username AND pa.completed = true")
    int getTotalXpByUsername(@Param("username") String username);

    // Find unlocked achievements for a user
    List<PlayerAchievement> findByUsernameAndUnlocked(String username, boolean unlocked);
    
    // Count unlocked achievements for a user
    @Query("SELECT COUNT(pa) FROM PlayerAchievement pa WHERE pa.username = :username AND pa.unlocked = true")
    long countUnlockedByUsername(@Param("username") String username);
    
    // Get total XP earned from unlocked achievements
    @Query("SELECT COALESCE(SUM(a.xpReward), 0) FROM PlayerAchievement pa JOIN Achievement a ON pa.achievementId = a.id WHERE pa.username = :username AND pa.unlocked = true")
    int getTotalXpByUnlockedUsername(@Param("username") String username);

    @Query("SELECT MAX(p.id) FROM PlayerAchievement p")
    Optional<Integer> findMaxId();
}
