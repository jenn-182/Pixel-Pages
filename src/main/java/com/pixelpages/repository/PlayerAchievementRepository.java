package com.pixelpages.repository;

import com.pixelpages.model.PlayerAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerAchievementRepository extends JpaRepository<PlayerAchievement, Long> {
    List<PlayerAchievement> findByUsername(String username);
    List<PlayerAchievement> findByUsernameAndIsCompleted(String username, boolean isCompleted);
    Optional<PlayerAchievement> findByUsernameAndAchievementId(String username, String achievementId);
    List<PlayerAchievement> findByUsernameOrderByUnlockedAtDesc(String username);
}
