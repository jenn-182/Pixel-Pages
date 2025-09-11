package com.pixelpages.service;

import com.pixelpages.model.FocusEntry;
import com.pixelpages.repository.FocusEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FocusEntryService {
    
    private final FocusEntryRepository focusEntryRepository;
    private final FocusSessionService focusSessionService;
    
    // Achievement service with @Lazy to avoid circular dependencies
    @Autowired
    @Lazy
    private AchievementService achievementService;
    
    // Constructor
    @Autowired
    public FocusEntryService(FocusEntryRepository focusEntryRepository, 
                           FocusSessionService focusSessionService) {
        this.focusEntryRepository = focusEntryRepository;
        this.focusSessionService = focusSessionService;
    }
    
    // Create a new focus entry
    public FocusEntry createEntry(Long sessionId, String ownerUsername, Integer timeSpent, 
                                LocalDate date, LocalDateTime startTime, LocalDateTime endTime, 
                                Boolean completed, String notes, Boolean isManualEntry, 
                                String phase, Integer cycleNumber) {
        FocusEntry entry = new FocusEntry();
        entry.setSessionId(sessionId);
        entry.setOwnerUsername(ownerUsername);
        entry.setTimeSpent(timeSpent);
        entry.setDate(date != null ? date : LocalDate.now());
        entry.setStartTime(startTime);
        entry.setEndTime(endTime);
        entry.setCompleted(completed != null ? completed : true);
        entry.setNotes(notes);
        entry.setIsManualEntry(isManualEntry != null ? isManualEntry : false);
        entry.setPhase(phase);
        entry.setCycleNumber(cycleNumber);
        entry.setCreatedAt(LocalDateTime.now());
        
        FocusEntry savedEntry = focusEntryRepository.save(entry);
        
        // Update the session's total time logged
        focusSessionService.updateSessionTimeLogged(sessionId, timeSpent);
        
        // REAL-TIME ACHIEVEMENT TRACKING
        if (ownerUsername != null && timeSpent != null && timeSpent > 0 && achievementService != null) {
            try {
                achievementService.trackFocusSession(ownerUsername, timeSpent, "GENERAL");
                System.out.println("🎯 Tracked focus session for: " + ownerUsername + " (" + timeSpent + " minutes)");
            } catch (Exception e) {
                System.err.println("Error tracking focus achievement: " + e.getMessage());
            }
        }
        
        return savedEntry;
    }
    
    // Update an entry
    public FocusEntry updateEntry(Long entryId, Integer timeSpent, String notes, Boolean completed) {
        Optional<FocusEntry> entryOpt = focusEntryRepository.findById(entryId);
        if (entryOpt.isEmpty()) {
            throw new RuntimeException("Focus entry not found with ID: " + entryId);
        }
        
        FocusEntry entry = entryOpt.get();
        Integer oldTimeSpent = entry.getTimeSpent();
        
        if (timeSpent != null) entry.setTimeSpent(timeSpent);
        if (notes != null) entry.setNotes(notes);
        if (completed != null) entry.setCompleted(completed);
        
        FocusEntry savedEntry = focusEntryRepository.save(entry);
        
        // Update session time if time changed
        if (timeSpent != null && !timeSpent.equals(oldTimeSpent)) {
            Integer timeDifference = timeSpent - oldTimeSpent;
            focusSessionService.updateSessionTimeLogged(entry.getSessionId(), timeDifference);
        }
        
        return savedEntry;
    }
    
    // Delete an entry
    public boolean deleteEntry(Long entryId) {
        Optional<FocusEntry> entryOpt = focusEntryRepository.findById(entryId);
        if (entryOpt.isEmpty()) {
            return false;
        }
        
        FocusEntry entry = entryOpt.get();
        // Subtract time from session before deleting
        focusSessionService.updateSessionTimeLogged(entry.getSessionId(), -entry.getTimeSpent());
        
        focusEntryRepository.deleteById(entryId);
        return true;
    }
    
    // Get entries by user
    public List<FocusEntry> getEntriesByUser(String username) {
        return focusEntryRepository.findByOwnerUsername(username);
    }
    
    // Get entries by session
    public List<FocusEntry> getEntriesBySession(Long sessionId) {
        return focusEntryRepository.findBySessionId(sessionId);
    }
    
    // Get entries by date range
    public List<FocusEntry> getEntriesByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        return focusEntryRepository.findByOwnerUsernameAndDateBetween(username, startDate, endDate);
    }
    
    // Get entries for specific date
    public List<FocusEntry> getEntriesByDate(String username, LocalDate date) {
        return focusEntryRepository.findByOwnerUsernameAndDate(username, date);
    }
    
    // Get total time spent by user on a date
    public Integer getTotalTimeByDate(String username, LocalDate date) {
        return focusEntryRepository.sumTimeSpentByUsernameAndDate(username, date);
    }
    
    // Get total time in date range
    public Integer getTotalTimeByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        return focusEntryRepository.sumTimeSpentByUsernameAndDateRange(username, startDate, endDate);
    }
    
    // Get total session count by date
    public Integer getSessionCountByDate(String username, LocalDate date) {
        return focusEntryRepository.countSessionsByUsernameAndDate(username, date);
    }
    
    // Get average session time in date range
    public Double getAverageSessionTime(String username, LocalDate startDate, LocalDate endDate) {
        return focusEntryRepository.averageSessionTimeByUsernameAndDateRange(username, startDate, endDate);
    }
    
    // Get longest session in date range
    public Integer getLongestSession(String username, LocalDate startDate, LocalDate endDate) {
        return focusEntryRepository.longestSessionByUsernameAndDateRange(username, startDate, endDate);
    }
    
    // Get total time for achievements
    public Integer getTotalTimeAllTime(String username) {
        return focusEntryRepository.totalTimeSpentByUsername(username);
    }
    
    // Get total entry count for achievements
    public Long getTotalEntryCount(String username) {
        return focusEntryRepository.countEntriesByUsername(username);
    }
    
    // Get active dates for streak calculation
    public List<LocalDate> getActiveDates(String username) {
        return focusEntryRepository.findActiveDatesByUsername(username);
    }
}