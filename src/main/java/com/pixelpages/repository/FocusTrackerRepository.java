package com.pixelpages.repository;

import com.pixelpages.model.FocusTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FocusTrackerRepository extends JpaRepository<FocusTracker, Long> {
    
    // Find tracker by username and date
    Optional<FocusTracker> findByUsernameAndDate(String username, LocalDate date);
    
    // Find trackers by username in date range
    List<FocusTracker> findByUsernameAndDateBetween(String username, LocalDate startDate, LocalDate endDate);
    
    // Find recent trackers (for dashboard display)
    List<FocusTracker> findByUsernameOrderByDateDesc(String username);
    
    // Get current streak (consecutive days with focus activity)
    @Query("SELECT COUNT(ft) FROM FocusTracker ft WHERE ft.username = :username AND ft.totalFocusTime > 0 AND ft.date >= :startDate ORDER BY ft.date DESC")
    Integer getCurrentStreak(@Param("username") String username, @Param("startDate") LocalDate startDate);
    
    // Get total focus time in date range
    @Query("SELECT COALESCE(SUM(ft.totalFocusTime), 0) FROM FocusTracker ft WHERE ft.username = :username AND ft.date BETWEEN :startDate AND :endDate")
    Integer sumTotalFocusTimeByDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Get total sessions in date range
    @Query("SELECT COALESCE(SUM(ft.totalSessions), 0) FROM FocusTracker ft WHERE ft.username = :username AND ft.date BETWEEN :startDate AND :endDate")
    Integer sumTotalSessionsByDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Count days with daily goal met in date range
    @Query("SELECT COUNT(ft) FROM FocusTracker ft WHERE ft.username = :username AND ft.dailyGoalMet = true AND ft.date BETWEEN :startDate AND :endDate")
    Integer countDaysWithGoalMet(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Get best streak for user
    @Query("SELECT COALESCE(MAX(ft.streakDays), 0) FROM FocusTracker ft WHERE ft.username = :username")
    Integer getBestStreakByUsername(@Param("username") String username);
    
    // Find dates with focus activity (totalFocusTime > 0) for streak calculation
    @Query("SELECT ft.date FROM FocusTracker ft WHERE ft.username = :username AND ft.totalFocusTime > 0 ORDER BY ft.date DESC")
    List<LocalDate> findActiveDatesByUsername(@Param("username") String username);
}