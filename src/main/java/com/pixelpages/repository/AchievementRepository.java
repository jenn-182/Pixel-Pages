package com.pixelpages.repository;

import com.pixelpages.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByCategory(String category);
    List<Achievement> findByRarity(String rarity);
    List<Achievement> findByCategoryAndRarity(String category, String rarity);
}
