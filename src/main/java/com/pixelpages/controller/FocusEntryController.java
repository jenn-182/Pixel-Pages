package com.pixelpages.controller;

import com.pixelpages.model.FocusEntry;
import com.pixelpages.service.FocusEntryService;
import com.pixelpages.service.FocusTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/focus/entries")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FocusEntryController {
    
    private final FocusEntryService focusEntryService;
    private final FocusTrackerService focusTrackerService;
    
    @Autowired
    public FocusEntryController(FocusEntryService focusEntryService, 
                              FocusTrackerService focusTrackerService) {
        this.focusEntryService = focusEntryService;
        this.focusTrackerService = focusTrackerService;
    }
    
    // GET /api/focus/entries?username=user&sessionId=123&date=2024-01-01
    @GetMapping
    public ResponseEntity<List<FocusEntry>> getFocusEntries(
            @RequestParam String username,
            @RequestParam(required = false) Long sessionId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            List<FocusEntry> entries;
            
            if (sessionId != null) {
                entries = focusEntryService.getEntriesBySession(sessionId);
            } else if (date != null) {
                entries = focusEntryService.getEntriesByDate(username, date);
            } else if (startDate != null && endDate != null) {
                entries = focusEntryService.getEntriesByDateRange(username, startDate, endDate);
            } else {
                entries = focusEntryService.getEntriesByUser(username);
            }
            
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // POST /api/focus/entries
    @PostMapping
    public ResponseEntity<FocusEntry> createFocusEntry(@RequestBody Map<String, Object> entryData) {
        try {
            System.out.println("Received entry data: " + entryData); // Debug log
            
            Long sessionId = Long.valueOf(entryData.get("sessionId").toString());
            String ownerUsername = (String) entryData.get("ownerUsername");
            Integer timeSpent = (Integer) entryData.get("timeSpent");
            String dateStr = (String) entryData.get("date");
            String startTimeStr = (String) entryData.get("startTime");
            String endTimeStr = (String) entryData.get("endTime");
            Boolean completed = (Boolean) entryData.get("completed");
            String notes = (String) entryData.get("notes");
            Boolean isManualEntry = (Boolean) entryData.get("isManualEntry");
            String phase = (String) entryData.get("phase");
            Integer cycleNumber = (Integer) entryData.get("cycleNumber");
            
            if (sessionId == null || ownerUsername == null || timeSpent == null) {
                System.out.println("Missing required fields");
                return ResponseEntity.badRequest().build();
            }
            
            LocalDate date = dateStr != null ? LocalDate.parse(dateStr) : LocalDate.now();
            
            // Fix: Handle ISO datetime strings properly
            LocalDateTime startTime = null;
            LocalDateTime endTime = null;
            
            if (startTimeStr != null && !startTimeStr.isEmpty()) {
                try {
                    // Handle ISO format: 2025-09-10T03:03:22.703Z
                    if (startTimeStr.endsWith("Z")) {
                        startTime = LocalDateTime.parse(startTimeStr.substring(0, startTimeStr.length() - 1));
                    } else {
                        startTime = LocalDateTime.parse(startTimeStr);
                    }
                } catch (Exception e) {
                    System.out.println("Error parsing startTime: " + startTimeStr + " - " + e.getMessage());
                }
            }
            
            if (endTimeStr != null && !endTimeStr.isEmpty()) {
                try {
                    // Handle ISO format: 2025-09-10T03:03:22.703Z
                    if (endTimeStr.endsWith("Z")) {
                        endTime = LocalDateTime.parse(endTimeStr.substring(0, endTimeStr.length() - 1));
                    } else {
                        endTime = LocalDateTime.parse(endTimeStr);
                    }
                } catch (Exception e) {
                    System.out.println("Error parsing endTime: " + endTimeStr + " - " + e.getMessage());
                }
            }
            
            System.out.println("Creating entry with: sessionId=" + sessionId + 
                              ", user=" + ownerUsername + 
                              ", timeSpent=" + timeSpent + 
                              ", date=" + date +
                              ", startTime=" + startTime +
                              ", endTime=" + endTime);
            
            FocusEntry entry = focusEntryService.createEntry(
                sessionId, ownerUsername, timeSpent, date, startTime, endTime,
                completed, notes, isManualEntry, phase, cycleNumber
            );
            
            // Auto-generate today's tracker stats
            focusTrackerService.autoGenerateTodayStats(ownerUsername);
            
            System.out.println("Entry created successfully with ID: " + entry.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(entry);
            
        } catch (Exception e) {
            System.out.println("Error creating focus entry: " + e.getMessage());
            e.printStackTrace(); // This will show the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // PUT /api/focus/entries/{id}
    @PutMapping("/{id}")
    public ResponseEntity<FocusEntry> updateFocusEntry(
            @PathVariable Long id,
            @RequestBody Map<String, Object> entryData) {
        try {
            Integer timeSpent = (Integer) entryData.get("timeSpent");
            String notes = (String) entryData.get("notes");
            Boolean completed = (Boolean) entryData.get("completed");
            
            FocusEntry entry = focusEntryService.updateEntry(id, timeSpent, notes, completed);
            
            // Regenerate tracker stats for the entry's owner
            focusTrackerService.autoGenerateTodayStats(entry.getOwnerUsername());
            
            return ResponseEntity.ok(entry);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // DELETE /api/focus/entries/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFocusEntry(@PathVariable Long id) {
        try {
            boolean deleted = focusEntryService.deleteEntry(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Entry deleted"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/entries/stats?username=user&date=2024-01-01
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEntryStats(
            @RequestParam String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        try {
            LocalDate targetDate = date != null ? date : LocalDate.now();
            
            Integer totalTime = focusEntryService.getTotalTimeByDate(username, targetDate);
            Integer sessionCount = focusEntryService.getSessionCountByDate(username, targetDate);
            Integer totalTimeAllTime = focusEntryService.getTotalTimeAllTime(username);
            Long totalEntriesAllTime = focusEntryService.getTotalEntryCount(username);
            
            Map<String, Object> stats = Map.of(
                "date", targetDate.toString(),
                "totalTimeToday", totalTime != null ? totalTime : 0,
                "sessionCountToday", sessionCount != null ? sessionCount : 0,
                "totalTimeAllTime", totalTimeAllTime != null ? totalTimeAllTime : 0,
                "totalEntriesAllTime", totalEntriesAllTime
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}