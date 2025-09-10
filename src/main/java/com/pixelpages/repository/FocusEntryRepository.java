package com.pixelpages.repository;

import com.pixelpages.model.FocusEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FocusEntryRepository extends JpaRepository<FocusEntry, Long> {
    
    // Find entries by username
    List<FocusEntry> findByOwnerUsername(String ownerUsername);
    
    // Find entries by session
    List<FocusEntry> findBySessionId(Long sessionId);
    
    // Find entries by username and session
    List<FocusEntry> findByOwnerUsernameAndSessionId(String ownerUsername, Long sessionId);
    
    // Find entries by date range
    List<FocusEntry> findByOwnerUsernameAndDateBetween(String ownerUsername, LocalDate startDate, LocalDate endDate);
    
    // Find entries by specific date
    List<FocusEntry> findByOwnerUsernameAndDate(String ownerUsername, LocalDate date);
    
    // Sum total time spent by user and date
    @Query("SELECT COALESCE(SUM(fe.timeSpent), 0) FROM FocusEntry fe WHERE fe.ownerUsername = :username AND fe.date = :date")
    Integer sumTimeSpentByUsernameAndDate(@Param("username") String username, @Param("date") LocalDate date);
    
    // Sum total time spent by user in date range
    @Query("SELECT COALESCE(SUM(fe.timeSpent), 0) FROM FocusEntry fe WHERE fe.ownerUsername = :username AND fe.date BETWEEN :startDate AND :endDate")
    Integer sumTimeSpentByUsernameAndDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Count sessions by user and date
    @Query("SELECT COUNT(DISTINCT fe.sessionId) FROM FocusEntry fe WHERE fe.ownerUsername = :username AND fe.date = :date")
    Integer countSessionsByUsernameAndDate(@Param("username") String username, @Param("date") LocalDate date);
    
    // Get average session time by user and date range
    @Query("SELECT COALESCE(AVG(fe.timeSpent), 0) FROM FocusEntry fe WHERE fe.ownerUsername = :username AND fe.date BETWEEN :startDate AND :endDate")
    Double averageSessionTimeByUsernameAndDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Get longest session by user and date range
    @Query("SELECT COALESCE(MAX(fe.timeSpent), 0) FROM FocusEntry fe WHERE fe.ownerUsername = :username AND fe.date BETWEEN :startDate AND :endDate")
    Integer longestSessionByUsernameAndDateRange(@Param("username") String username, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Get total time spent by user (all time)
    @Query("SELECT COALESCE(SUM(fe.timeSpent), 0) FROM FocusEntry fe WHERE fe.ownerUsername = :username")
    Integer totalTimeSpentByUsername(@Param("username") String username);
    
    // Count total entries by user (all time)
    @Query("SELECT COUNT(fe) FROM FocusEntry fe WHERE fe.ownerUsername = :username")
    Long countEntriesByUsername(@Param("username") String username);
    
    // Find dates with focus activity (for streak calculation)
    @Query("SELECT DISTINCT fe.date FROM FocusEntry fe WHERE fe.ownerUsername = :username ORDER BY fe.date DESC")
    List<LocalDate> findActiveDatesByUsername(@Param("username") String username);
}