package com.pixelpages.repository;

import com.pixelpages.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    
    // Find by category
    List<Achievement> findByCategory(String category);
    
    // Find by tier
    List<Achievement> findByTier(String tier);
    
    // Find by requirement type
    List<Achievement> findByRequirementType(String requirementType);
    
    // Custom query to get achievements by multiple categories
    @Query("SELECT a FROM Achievement a WHERE a.category IN :categories")
    List<Achievement> findByCategoryIn(@Param("categories") List<String> categories);
}
