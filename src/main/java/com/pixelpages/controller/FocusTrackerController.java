package com.pixelpages.controller;

import com.pixelpages.model.FocusTracker;
import com.pixelpages.service.FocusTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/focus/tracker")
@CrossOrigin(origins = "http://localhost:3001")
public class FocusTrackerController {
    
    private final FocusTrackerService focusTrackerService;
    
    @Autowired
    public FocusTrackerController(FocusTrackerService focusTrackerService) {
        this.focusTrackerService = focusTrackerService;
    }
    
    // GET /api/focus/tracker?username=user&period=week
    @GetMapping
    public ResponseEntity<Map<String, Object>> getFocusTracker(
            @RequestParam String username,
            @RequestParam(defaultValue = "week") String period) {
        
        try {
            Map<String, Object> analytics = focusTrackerService.getAnalytics(username, period);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/daily?username=user&date=2024-01-01
    @GetMapping("/daily")
    public ResponseEntity<FocusTracker> getDailyFocusTracker(
            @RequestParam String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        try {
            LocalDate targetDate = date != null ? date : LocalDate.now();
            Optional<FocusTracker> tracker = focusTrackerService.getTrackerByDate(username, targetDate);
            
            if (tracker.isPresent()) {
                return ResponseEntity.ok(tracker.get());
            } else {
                // Generate tracker for this date if it doesn't exist
                FocusTracker newTracker = focusTrackerService.generateDailyStats(username, targetDate);
                return ResponseEntity.ok(newTracker);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/range?username=user&startDate=2024-01-01&endDate=2024-01-07
    @GetMapping("/range")
    public ResponseEntity<List<FocusTracker>> getFocusTrackerRange(
            @RequestParam String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            List<FocusTracker> trackers = focusTrackerService.getTrackerByDateRange(username, startDate, endDate);
            return ResponseEntity.ok(trackers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/recent?username=user&days=7
    @GetMapping("/recent")
    public ResponseEntity<List<FocusTracker>> getRecentFocusTracker(
            @RequestParam String username,
            @RequestParam(defaultValue = "7") int days) {
        
        try {
            List<FocusTracker> recentTrackers = focusTrackerService.getRecentTrackerData(username, days);
            return ResponseEntity.ok(recentTrackers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/analytics?username=user&period=month
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getFocusAnalytics(
            @RequestParam String username,
            @RequestParam(defaultValue = "week") String period) {
        
        try {
            Map<String, Object> analytics = focusTrackerService.getAnalytics(username, period);
            
            // Add additional analytics data
            Integer currentStreak = focusTrackerService.getCurrentStreak(username);
            Integer bestStreak = focusTrackerService.getBestStreak(username);
            
            analytics.put("currentStreak", currentStreak);
            analytics.put("bestStreak", bestStreak);
            
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // POST /api/focus/tracker/generate?username=user&date=2024-01-01
    @PostMapping("/generate")
    public ResponseEntity<FocusTracker> generateDailyStats(
            @RequestParam String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        try {
            LocalDate targetDate = date != null ? date : LocalDate.now();
            FocusTracker tracker = focusTrackerService.generateDailyStats(username, targetDate);
            return ResponseEntity.ok(tracker);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // PUT /api/focus/tracker/goal?username=user&date=2024-01-01&goalMet=true
    @PutMapping("/goal")
    public ResponseEntity<Map<String, Object>> updateDailyGoal(
            @RequestParam String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam boolean goalMet) {
        
        try {
            focusTrackerService.updateDailyGoal(username, date, goalMet);
            return ResponseEntity.ok(Map.of("success", true, "message", "Daily goal updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/streaks?username=user
    @GetMapping("/streaks")
    public ResponseEntity<Map<String, Object>> getStreakData(@RequestParam String username) {
        try {
            Integer currentStreak = focusTrackerService.getCurrentStreak(username);
            Integer bestStreak = focusTrackerService.getBestStreak(username);
            
            Map<String, Object> streakData = Map.of(
                "currentStreak", currentStreak,
                "bestStreak", bestStreak,
                "username", username
            );
            
            return ResponseEntity.ok(streakData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/tracker/dashboard?username=user
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam String username) {
        try {
            // Get today's tracker
            FocusTracker todayTracker = focusTrackerService.getTrackerByDate(username, LocalDate.now())
                .orElse(focusTrackerService.generateDailyStats(username, LocalDate.now()));
            
            // Get week analytics
            Map<String, Object> weekAnalytics = focusTrackerService.getAnalytics(username, "week");
            
            // Get recent data
            List<FocusTracker> recentData = focusTrackerService.getRecentTrackerData(username, 7);
            
            // Get streak data
            Integer currentStreak = focusTrackerService.getCurrentStreak(username);
            Integer bestStreak = focusTrackerService.getBestStreak(username);
            
            Map<String, Object> dashboard = Map.of(
                "today", todayTracker,
                "weekAnalytics", weekAnalytics,
                "recentData", recentData,
                "currentStreak", currentStreak,
                "bestStreak", bestStreak
            );
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}