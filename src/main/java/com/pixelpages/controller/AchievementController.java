package com.pixelpages.controller;

import com.pixelpages.model.Achievement;
import com.pixelpages.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementController {
    
    private final AchievementService achievementService;
    
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }
    
    // Get all achievements with player progress
    @GetMapping("/achievements")
    public ResponseEntity<Map<String, Object>> getAchievements(
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        List<Map<String, Object>> playerAchievements = achievementService.getPlayerAchievements(username);
        
        // Count achievements by status
        long completed = playerAchievements.stream()
            .mapToLong(achievement -> (boolean) achievement.get("isCompleted") ? 1 : 0)
            .sum();
        
        long inProgress = playerAchievements.stream()
            .mapToLong(achievement -> {
                boolean isCompleted = (boolean) achievement.get("isCompleted");
                int progress = (int) achievement.get("progress");
                return !isCompleted && progress > 0 ? 1 : 0;
            })
            .sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("action", "GET_ACHIEVEMENTS");
        response.put("data", playerAchievements);
        response.put("summary", Map.of(
            "total", playerAchievements.size(),
            "completed", completed,
            "inProgress", inProgress,
            "locked", playerAchievements.size() - completed - inProgress
        ));
        response.put("message", "Quest achievements retrieved! " + completed + " conquered, " + 
                               inProgress + " in progress!");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    // Get achievements by category
    @GetMapping("/achievements/category/{category}")
    public ResponseEntity<Map<String, Object>> getAchievementsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        List<Achievement> categoryAchievements = achievementService.getAllAchievements().stream()
            .filter(achievement -> achievement.getCategory().equals(category))
            .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("action", "GET_ACHIEVEMENTS_BY_CATEGORY");
        response.put("data", categoryAchievements);
        response.put("message", "Found " + categoryAchievements.size() + " achievements in '" + category + "' category!");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    // Get achievements by rarity
    @GetMapping("/achievements/rarity/{rarity}")
    public ResponseEntity<Map<String, Object>> getAchievementsByRarity(
            @PathVariable String rarity,
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        List<Achievement> rarityAchievements = achievementService.getAllAchievements().stream()
            .filter(achievement -> achievement.getRarity().equals(rarity))
            .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("action", "GET_ACHIEVEMENTS_BY_RARITY");
        response.put("data", rarityAchievements);
        response.put("message", "Found " + rarityAchievements.size() + " " + rarity + " achievements!");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    // REMOVE the manual achievement check method to avoid circular dependency
    // The achievements will be checked automatically when notes are created
}
