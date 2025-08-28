package com.pixelpages.service;

import com.pixelpages.model.Achievement;
import com.pixelpages.model.PlayerAchievement;
import com.pixelpages.model.Note;
import com.pixelpages.model.Player;
import com.pixelpages.repository.AchievementRepository;
import com.pixelpages.repository.PlayerAchievementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AchievementService {
    
    private final AchievementRepository achievementRepository;
    private final PlayerAchievementRepository playerAchievementRepository;
    
    public AchievementService(AchievementRepository achievementRepository,
                             PlayerAchievementRepository playerAchievementRepository) {
        this.achievementRepository = achievementRepository;
        this.playerAchievementRepository = playerAchievementRepository;
        initializeDefaultAchievements();
    }
    
    // Get all available achievements
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
    
    // Get player's achievement progress
    public List<Map<String, Object>> getPlayerAchievements(String username) {
        List<Achievement> allAchievements = getAllAchievements();
        List<PlayerAchievement> playerProgress = playerAchievementRepository.findByUsername(username);
        
        // Create map for quick lookup
        Map<String, PlayerAchievement> progressMap = playerProgress.stream()
            .collect(Collectors.toMap(PlayerAchievement::getAchievementId, pa -> pa));
        
        return allAchievements.stream().map(achievement -> {
            PlayerAchievement progress = progressMap.get(achievement.getId());
            
            Map<String, Object> achievementData = new HashMap<>();
            achievementData.put("achievement", achievement);
            achievementData.put("progress", progress != null ? progress.getProgress() : 0);
            achievementData.put("maxProgress", getMaxProgressForAchievement(achievement.getId()));
            achievementData.put("isCompleted", progress != null && progress.isCompleted());
            achievementData.put("progressPercentage", progress != null ? progress.getProgressPercentage() : 0.0);
            achievementData.put("unlockedAt", progress != null ? progress.getUnlockedAt() : null);
            
            return achievementData;
        }).collect(Collectors.toList());
    }
    
    // Update player progress for an achievement
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateProgress(String username, String achievementId, int currentProgress) {
        try {
            // Check if record exists
            Optional<PlayerAchievement> existingOpt = playerAchievementRepository
                .findByUsernameAndAchievementId(username, achievementId);
            
            int maxProgress = getMaxProgressForAchievement(achievementId);
            
            if (existingOpt.isPresent()) {
                PlayerAchievement existing = existingOpt.get();
                // Only update if there's actual progress and not already completed
                if (!existing.isCompleted() && currentProgress > existing.getProgress()) {
                    existing.setProgress(currentProgress);
                    existing.setMaxProgress(maxProgress);
                    
                    // Check if achievement should be completed
                    if (currentProgress >= maxProgress) {
                        existing.setCompleted(true);
                        existing.setUnlockedAt(LocalDateTime.now());
                        System.out.println("Achievement Unlocked: " + achievementId + " for " + username);
                    }
                    
                    // Clear the entity from the session and reattach
                    playerAchievementRepository.saveAndFlush(existing);
                }
            } else {
                // Create new achievement progress
                if (currentProgress > 0) {
                    PlayerAchievement newProgress = new PlayerAchievement(username, achievementId, currentProgress, maxProgress);
                    
                    if (currentProgress >= maxProgress) {
                        newProgress.setCompleted(true);
                        newProgress.setUnlockedAt(LocalDateTime.now());
                        System.out.println("Achievement Unlocked: " + achievementId + " for " + username);
                    }
                    
                    playerAchievementRepository.saveAndFlush(newProgress);
                }
            }
        } catch (Exception e) {
            System.err.println("Achievement update failed for " + achievementId + ": " + e.getMessage());
            // Don't rethrow - we want note creation to succeed even if achievements fail
        }
    }
    
    // Check and unlock achievements based on player actions
    public List<Achievement> checkAndUnlockAchievements(String username, List<Note> notes, Player player) {
        List<Achievement> newlyUnlocked = new ArrayList<>();
        
        // Calculate current stats
        int noteCount = notes.size();
        int totalWords = notes.stream().mapToInt(Note::getWordCount).sum();
        Set<String> uniqueTags = notes.stream()
            .flatMap(note -> note.getTags().stream())
            .collect(Collectors.toSet());
        
        // Update progress for note count achievements
        updateProgress(username, "first_note", noteCount);
        updateProgress(username, "note_collector_5", noteCount);
        updateProgress(username, "note_collector_10", noteCount);
        updateProgress(username, "note_collector_25", noteCount);
        updateProgress(username, "note_collector_50", noteCount);
        
        // Update progress for word count achievements
        updateProgress(username, "word_warrior_100", totalWords);
        updateProgress(username, "word_warrior_500", totalWords);
        updateProgress(username, "word_warrior_1000", totalWords);
        
        // Update progress for tag achievements
        updateProgress(username, "tag_master_5", uniqueTags.size());
        updateProgress(username, "tag_master_10", uniqueTags.size());
        updateProgress(username, "tag_master_20", uniqueTags.size());
        
        // Check special achievements
        if (checkNightOwlAchievement(notes)) {
            updateProgress(username, "night_owl", 1);
        }
        if (checkEarlyBirdAchievement(notes)) {
            updateProgress(username, "early_bird", 1);
        }
        if (checkConsistentWriterAchievement(notes)) {
            updateProgress(username, "consistent_writer", 1);
        }
        if (checkEpicNovelistAchievement(notes)) {
            updateProgress(username, "epic_novelist", 1);
        }
        
        return newlyUnlocked;
    }
    
    // Helper methods for complex achievement checks
    private boolean checkNightOwlAchievement(List<Note> notes) {
        return notes.stream().anyMatch(note -> {
            LocalTime time = note.getCreatedAt().toLocalTime();
            return time.isAfter(LocalTime.of(23, 0)) || time.isBefore(LocalTime.of(5, 0));
        });
    }
    
    private boolean checkEarlyBirdAchievement(List<Note> notes) {
        return notes.stream().anyMatch(note -> {
            LocalTime time = note.getCreatedAt().toLocalTime();
            return time.isAfter(LocalTime.of(5, 0)) && time.isBefore(LocalTime.of(8, 0));
        });
    }
    
    private boolean checkConsistentWriterAchievement(List<Note> notes) {
        // Check if player has written notes on 7 consecutive days
        Set<String> writingDays = notes.stream()
            .map(note -> note.getCreatedAt().toLocalDate().toString())
            .collect(Collectors.toSet());
        return writingDays.size() >= 7;
    }
    
    private boolean checkEpicNovelistAchievement(List<Note> notes) {
        return notes.stream().anyMatch(note -> note.getWordCount() >= 1000);
    }
    
    // Get max progress for achievement (used for progress bars)
    private int getMaxProgressForAchievement(String achievementId) {
        switch (achievementId) {
            case "first_note": return 1;
            case "note_collector_5": return 5;
            case "note_collector_10": return 10;
            case "note_collector_25": return 25;
            case "note_collector_50": return 50;
            case "word_warrior_100": return 100;
            case "word_warrior_500": return 500;
            case "word_warrior_1000": return 1000;
            case "tag_master_5": return 5;
            case "tag_master_10": return 10;
            case "tag_master_20": return 20;
            case "night_owl": return 1;
            case "early_bird": return 1;
            case "consistent_writer": return 1;
            case "epic_novelist": return 1;
            default: return 1;
        }
    }
    
    // Initialize default achievements on startup
    private void initializeDefaultAchievements() {
        if (achievementRepository.count() == 0) {
            List<Achievement> defaultAchievements = Arrays.asList(
                // Writing Achievements
                new Achievement("first_note", "First Steps", "Create your first quest scroll", "🎯", "common", "writing", 10, "Create 1 note"),
                new Achievement("note_collector_5", "Apprentice Scribe", "Collect 5 quest scrolls", "📜", "common", "writing", 25, "Create 5 notes"),
                new Achievement("note_collector_10", "Journeyman Writer", "Collect 10 quest scrolls", "📚", "rare", "writing", 50, "Create 10 notes"),
                new Achievement("note_collector_25", "Master Chronicler", "Collect 25 quest scrolls", "📖", "epic", "writing", 100, "Create 25 notes"),
                new Achievement("note_collector_50", "Legendary Archivist", "Collect 50 quest scrolls", "📰", "legendary", "writing", 250, "Create 50 notes"),
                
                // Word Count Achievements
                new Achievement("word_warrior_100", "Word Warrior", "Write 100 words total", "⚔️", "common", "writing", 20, "Write 100 words"),
                new Achievement("word_warrior_500", "Verbose Victor", "Write 500 words total", "🗡️", "rare", "writing", 75, "Write 500 words"),
                new Achievement("word_warrior_1000", "Wordsmith Supreme", "Write 1000 words total", "👑", "epic", "writing", 150, "Write 1000 words"),
                
                // Organization Achievements
                new Achievement("tag_master_5", "Tag Apprentice", "Use 5 different tags", "🏷️", "common", "organization", 15, "Use 5 unique tags"),
                new Achievement("tag_master_10", "Tag Master", "Use 10 different tags", "🎨", "rare", "organization", 40, "Use 10 unique tags"),
                new Achievement("tag_master_20", "Tag Grandmaster", "Use 20 different tags", "🌈", "epic", "organization", 80, "Use 20 unique tags"),
                
                // Time-based Achievements
                new Achievement("night_owl", "Night Owl", "Write a note between 11 PM and 5 AM", "🦉", "rare", "consistency", 60, "Write during night hours"),
                new Achievement("early_bird", "Early Bird", "Write a note between 5 AM and 8 AM", "🌅", "rare", "consistency", 60, "Write during morning hours"),
                new Achievement("consistent_writer", "Consistent Writer", "Write every day for a week", "📅", "epic", "consistency", 100, "Write for 7 consecutive days"),
                new Achievement("epic_novelist", "Epic Novelist", "Write a note with at least 1000 words", "📖", "legendary", "writing", 250, "Write a 1000-word note")
            );
            achievementRepository.saveAll(defaultAchievements);
            System.out.println("Default achievements initialized!");
        }
    }
}
