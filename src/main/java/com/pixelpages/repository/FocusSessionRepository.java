package com.pixelpages.repository;

import com.pixelpages.model.FocusSession;
import com.pixelpages.model.FocusCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    
    // Find sessions by username
    List<FocusSession> findByOwnerUsername(String ownerUsername);
    
    // Find active sessions by username
    List<FocusSession> findByOwnerUsernameAndIsActive(String ownerUsername, Boolean isActive);
    
    // Find sessions by category
    List<FocusSession> findByOwnerUsernameAndCategory(String ownerUsername, FocusCategory category);
    
    // Find sessions by category and active status
    List<FocusSession> findByOwnerUsernameAndCategoryAndIsActive(String ownerUsername, FocusCategory category, Boolean isActive);
    
    // Count total sessions by user
    @Query("SELECT COUNT(fs) FROM FocusSession fs WHERE fs.ownerUsername = :username")
    Long countSessionsByUsername(@Param("username") String username);
    
    // Get most used category by user
    @Query("SELECT fs.category, COUNT(fs) as count FROM FocusSession fs WHERE fs.ownerUsername = :username GROUP BY fs.category ORDER BY count DESC")
    List<Object[]> getCategoryUsageByUsername(@Param("username") String username);
    
    // Find sessions with total time logged greater than specified minutes
    @Query("SELECT fs FROM FocusSession fs WHERE fs.ownerUsername = :username AND fs.totalTimeLogged >= :minTimeLogged")
    List<FocusSession> findSessionsWithMinTimeLogged(@Param("username") String username, @Param("minTimeLogged") Integer minTimeLogged);
}