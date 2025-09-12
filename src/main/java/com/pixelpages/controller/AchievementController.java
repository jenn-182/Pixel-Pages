package com.pixelpages.controller;

import com.pixelpages.service.AchievementService;
import com.pixelpages.service.AchievementInitializationService;
import com.pixelpages.repository.TaskRepository;
import com.pixelpages.repository.NoteRepository;
import com.pixelpages.repository.AchievementRepository; // Add this import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementController {

    private final AchievementService achievementService;
    private final TaskRepository taskRepository;
    private final NoteRepository noteRepository;
    private final AchievementRepository achievementRepository; // Add this field

    @Autowired
    private AchievementInitializationService achievementInitializationService;

    public AchievementController(AchievementService achievementService,
            TaskRepository taskRepository,
            NoteRepository noteRepository,
            AchievementInitializationService achievementInitializationService,
            AchievementRepository achievementRepository) { // Add this parameter
        this.achievementService = achievementService;
        this.taskRepository = taskRepository;
        this.noteRepository = noteRepository;
        this.achievementInitializationService = achievementInitializationService;
        this.achievementRepository = achievementRepository; // Add this assignment
        System.out.println("AchievementController initialized");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAchievements() {
        try {
            List<Map<String, Object>> achievements = achievementService.getAllAchievementsAsMap();
            return ResponseEntity.ok(achievements);
        } catch (Exception e) {
            System.err.println("Error getting all achievements: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/player/{username}")
    public ResponseEntity<List<Map<String, Object>>> getPlayerAchievements(@PathVariable String username) {
        try {
            List<Map<String, Object>> achievements = achievementService.getPlayerAchievements(username);
            return ResponseEntity.ok(achievements);
        } catch (Exception e) {
            System.err.println("Error getting player achievements for " + username + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/player/{username}/progress")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> updateProgress(
            @PathVariable String username,
            @RequestParam String achievementId,
            @RequestParam int progress) {
        try {
            achievementService.updateProgress(username, achievementId, progress);
            return ResponseEntity.ok("Progress updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating progress: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update progress: " + e.getMessage());
        }
    }

    @GetMapping("/player/{username}/stats")
    public ResponseEntity<Map<String, Object>> getPlayerStats(@PathVariable String username) {
        try {
            if (username == null || username.trim().isEmpty()) {
                System.err.println("No username provided for player stats");

                // Return default stats for anonymous user
                Map<String, Object> defaultStats = new HashMap<>();
                defaultStats.put("completedAchievements", 0);
                defaultStats.put("totalAchievements", achievementService.getAllAchievements().size());
                defaultStats.put("totalXp", 0);
                defaultStats.put("completionPercentage", 0.0);

                return ResponseEntity.ok(defaultStats);
            }

            Map<String, Object> stats = achievementService.getPlayerStats(username);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting player stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/player/{username}/check")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> checkAllAchievements(@PathVariable String username) {
        try {
            System.out.println("Checking achievements for user: " + username);
            achievementService.checkAllUserAchievements(username);
            return ResponseEntity.ok("Achievement check completed for " + username);
        } catch (Exception e) {
            System.err.println("Error checking achievements for " + username + ": " + e.getMessage());
            e.printStackTrace(); // This will show the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to check achievements: " + e.getMessage());
        }
    }

    // @PostMapping("/test/populate/{username}")
    // @CrossOrigin(origins = "http://localhost:3000")
    // public ResponseEntity<String> populateTestData(@PathVariable String username) {
    //     try {
    //         System.out.println("Populating test data for user: " + username);
    //         String result = achievementService.populateTestData(username);
    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         System.err.println("Error populating test data for " + username + ": " + e.getMessage());
    //         e.printStackTrace();
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body("Failed to populate test data: " + e.getMessage());
    //     }
    // }

    @GetMapping("/debug/usernames")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, Object>> debugUsernames() {
        try {
            Map<String, Object> result = new HashMap<>();

            // Check task usernames
            List<String> taskUsernames = taskRepository.findDistinctUsernames();
            result.put("taskUsernames", taskUsernames);

            // Check note usernames
            List<String> noteUsernames = noteRepository.findDistinctUsernames();
            result.put("noteUsernames", noteUsernames);

            // Check task counts by username
            Map<String, Long> taskCounts = new HashMap<>();
            for (String username : taskUsernames) {
                long completed = taskRepository.countByUsernameAndCompleted(username, true);
                long total = taskRepository.countByUsername(username);
                taskCounts.put(username + "_completed", completed);
                taskCounts.put(username + "_total", total);
                System.out.println("Username: " + username + " - Completed: " + completed + " - Total: " + total);
            }
            result.put("taskCounts", taskCounts);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));

        }
    }

    // @PostMapping("/initialize/{username}")
    // @CrossOrigin(origins = "http://localhost:3000")
    // public ResponseEntity<String> initializeAchievements(@PathVariable String username) {
    //     try {
    //         achievementService.initializeAllPlayerAchievements(username);
    //         return ResponseEntity.ok("Initialized all achievements for " + username);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body("Failed: " + e.getMessage());
    //     }
    // }

    @PostMapping("/force-update")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Map<String, Object>> forceUpdateAchievements() {
        try {
            System.out.println("🔄 Force update endpoint called");
            
            achievementInitializationService.forceUpdateAchievements();
            
            // Return detailed response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Achievements updated successfully!");
            response.put("timestamp", System.currentTimeMillis());
            response.put("totalAchievements", achievementRepository.count());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Force update failed: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update achievements: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
