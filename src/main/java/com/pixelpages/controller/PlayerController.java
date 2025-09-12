package com.pixelpages.controller;


import com.pixelpages.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/player")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayerController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlayerStats(@RequestParam(defaultValue = "user") String username) {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("username", username);
            stats.put("level", 1);
            stats.put("experience", 0);
            stats.put("totalAchievements", 0);
            stats.put("unlockedAchievements", 0);
            
            System.out.println("📊 Player stats requested for: " + username);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting player stats: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/achievements/unlock")
    public ResponseEntity<String> unlockAchievement(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String achievementId = request.get("achievementId");
            
            if (username == null || achievementId == null) {
                return ResponseEntity.badRequest().body("Missing username or achievementId");
            }
            
            // Force unlock the achievement in backend
            if (achievementService != null) {
                achievementService.unlockAchievement(username, achievementId);
                System.out.println("✅ Manually unlocked achievement: " + achievementId + " for " + username);
            }
            
            return ResponseEntity.ok("Achievement unlocked");
            
        } catch (Exception e) {
            System.err.println("Error unlocking achievement: " + e.getMessage());
            return ResponseEntity.status(500).body("Error unlocking achievement");
        }
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<Map<String, Object>>> getPlayerAchievements(@RequestParam(defaultValue = "user") String username) {
        try {
            if (achievementService != null) {
                List<Map<String, Object>> achievements = achievementService.getPlayerAchievements(username);
                System.out.println("🏆 Achievement data requested for: " + username);
                return ResponseEntity.ok(achievements);
            } else {
                System.err.println("AchievementService is null");
                return ResponseEntity.status(500).body(null);
            }
        } catch (Exception e) {
            System.err.println("Error getting player achievements: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/xp")
    public ResponseEntity<String> awardExperience(@RequestBody Map<String, Object> request) {
        try {
            String username = (String) request.get("username");
            Integer xp = (Integer) request.get("xp");
            String reason = (String) request.get("reason");
            
            if (username == null || xp == null) {
                return ResponseEntity.badRequest().body("Missing username or xp");
            }
            
            System.out.println("⭐ Awarded " + xp + " XP to " + username + " for: " + reason);
            return ResponseEntity.ok("XP awarded");
            
        } catch (Exception e) {
            System.err.println("Error awarding XP: " + e.getMessage());
            return ResponseEntity.status(500).body("Error awarding XP");
        }
    }

    @GetMapping("/level")
    public ResponseEntity<Map<String, Object>> getPlayerLevel(@RequestParam(defaultValue = "user") String username) {
        try {
            Map<String, Object> levelData = new HashMap<>();
            levelData.put("level", 1);
            levelData.put("currentXP", 0);
            levelData.put("xpToNextLevel", 100);
            levelData.put("totalXP", 0);
            
            System.out.println("📈 Level data requested for: " + username);
            return ResponseEntity.ok(levelData);
        } catch (Exception e) {
            System.err.println("Error getting player level: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}