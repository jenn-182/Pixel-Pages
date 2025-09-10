package com.pixelpages.service;

import com.pixelpages.model.FocusTracker;
import com.pixelpages.repository.FocusTrackerRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class FocusTrackerService {
    
    private final FocusTrackerRepository focusTrackerRepository;
    private final FocusEntryService focusEntryService;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public FocusTrackerService(FocusTrackerRepository focusTrackerRepository,
                             FocusEntryService focusEntryService) {
        this.focusTrackerRepository = focusTrackerRepository;
        this.focusEntryService = focusEntryService;
        this.objectMapper = new ObjectMapper();
    }
    
    // Generate or update daily stats for a user on a specific date
    public FocusTracker generateDailyStats(String username, LocalDate date) {
        // Check if tracker already exists for this date
        Optional<FocusTracker> existingTracker = focusTrackerRepository.findByUsernameAndDate(username, date);
        
        FocusTracker tracker = existingTracker.orElse(new FocusTracker(username, date));
        
        // Calculate daily stats from focus entries
        Integer totalFocusTime = focusEntryService.getTotalTimeByDate(username, date);
        Integer totalSessions = focusEntryService.getSessionCountByDate(username, date);
        Double avgSessionTime = focusEntryService.getAverageSessionTime(username, date, date);
        Integer longestSession = focusEntryService.getLongestSession(username, date, date);
        
        // Update tracker fields
        tracker.setTotalFocusTime(totalFocusTime != null ? totalFocusTime : 0);
        tracker.setTotalSessions(totalSessions != null ? totalSessions : 0);
        tracker.setAverageSessionTime(avgSessionTime != null ? avgSessionTime.intValue() : 0);
        tracker.setLongestSession(longestSession != null ? longestSession : 0);
        
        // Calculate category breakdown (placeholder for now)
        String categoryBreakdown = generateCategoryBreakdown(username, date);
        tracker.setCategoryBreakdown(categoryBreakdown);
        
        // Calculate streak
        Integer streakDays = calculateCurrentStreak(username, date);
        tracker.setStreakDays(streakDays);
        
        // Check if daily goal met (example: 60 minutes)
        boolean goalMet = tracker.getTotalFocusTime() >= 60;
        tracker.setDailyGoalMet(goalMet);
        
        tracker.setUpdatedAt(LocalDateTime.now());
        
        return focusTrackerRepository.save(tracker);
    }
    
    // Get tracker data for a specific date
    public Optional<FocusTracker> getTrackerByDate(String username, LocalDate date) {
        return focusTrackerRepository.findByUsernameAndDate(username, date);
    }
    
    // Get tracker data for date range
    public List<FocusTracker> getTrackerByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        return focusTrackerRepository.findByUsernameAndDateBetween(username, startDate, endDate);
    }
    
    // Get recent tracker data (for dashboard)
    public List<FocusTracker> getRecentTrackerData(String username, int days) {
        List<FocusTracker> allTrackers = focusTrackerRepository.findByUsernameOrderByDateDesc(username);
        return allTrackers.stream().limit(days).toList();
    }
    
    // Calculate current streak
    private Integer calculateCurrentStreak(String username, LocalDate currentDate) {
        List<LocalDate> activeDates = focusEntryService.getActiveDates(username);
        
        if (activeDates.isEmpty()) {
            return 0;
        }
        
        // Sort dates in descending order
        activeDates.sort(Collections.reverseOrder());
        
        int streak = 0;
        LocalDate checkDate = currentDate;
        
        for (LocalDate activeDate : activeDates) {
            if (activeDate.equals(checkDate)) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else if (activeDate.isBefore(checkDate)) {
                // Gap found, streak broken
                break;
            }
        }
        
        return streak;
    }
    
    // Generate category breakdown JSON
    private String generateCategoryBreakdown(String username, LocalDate date) {
        // This is a simplified version - in a real implementation, 
        // you'd join with FocusSession to get category data
        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("WORK", 0);
        breakdown.put("LEARNING", 0);
        breakdown.put("PERSONAL", 0);
        breakdown.put("HEALTH", 0);
        breakdown.put("CREATIVE", 0);
        breakdown.put("OTHER", 0);
        
        // TODO: Calculate actual category breakdown from entries + sessions
        // For now, just return empty breakdown
        
        try {
            return objectMapper.writeValueAsString(breakdown);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }
    
    // Get analytics for a period
    public Map<String, Object> getAnalytics(String username, String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        
        switch (period.toLowerCase()) {
            case "week":
                startDate = endDate.minusDays(7);
                break;
            case "month":
                startDate = endDate.minusDays(30);
                break;
            case "year":
                startDate = endDate.minusDays(365);
                break;
            default:
                startDate = endDate.minusDays(7);
        }
        
        // Get aggregated data
        Integer totalTime = focusTrackerRepository.sumTotalFocusTimeByDateRange(username, startDate, endDate);
        Integer totalSessions = focusTrackerRepository.sumTotalSessionsByDateRange(username, startDate, endDate);
        Integer goalsMetCount = focusTrackerRepository.countDaysWithGoalMet(username, startDate, endDate);
        Integer bestStreak = focusTrackerRepository.getBestStreakByUsername(username);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalFocusTime", totalTime != null ? totalTime : 0);
        analytics.put("totalSessions", totalSessions != null ? totalSessions : 0);
        analytics.put("averageDaily", totalTime != null ? totalTime / 7 : 0);
        analytics.put("goalsMetCount", goalsMetCount != null ? goalsMetCount : 0);
        analytics.put("bestStreak", bestStreak != null ? bestStreak : 0);
        analytics.put("period", period);
        analytics.put("startDate", startDate.toString());
        analytics.put("endDate", endDate.toString());
        
        return analytics;
    }
    
    // Get current streak for a user
    public Integer getCurrentStreak(String username) {
        return calculateCurrentStreak(username, LocalDate.now());
    }
    
    // Get best streak for a user
    public Integer getBestStreak(String username) {
        Integer bestStreak = focusTrackerRepository.getBestStreakByUsername(username);
        return bestStreak != null ? bestStreak : 0;
    }
    
    // Update daily goal status
    public void updateDailyGoal(String username, LocalDate date, boolean goalMet) {
        Optional<FocusTracker> trackerOpt = focusTrackerRepository.findByUsernameAndDate(username, date);
        if (trackerOpt.isPresent()) {
            FocusTracker tracker = trackerOpt.get();
            tracker.setDailyGoalMet(goalMet);
            tracker.setUpdatedAt(LocalDateTime.now());
            focusTrackerRepository.save(tracker);
        }
    }
    
    // Auto-generate today's stats (called when focus entries are created)
    public void autoGenerateTodayStats(String username) {
        generateDailyStats(username, LocalDate.now());
    }
}