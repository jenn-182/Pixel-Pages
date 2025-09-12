package com.pixelpages.service;

import com.pixelpages.model.Note;
import com.pixelpages.model.Achievement;
import com.pixelpages.model.PlayerAchievement;
import com.pixelpages.model.Player;
import com.pixelpages.model.Task;
import com.pixelpages.repository.AchievementRepository;
import com.pixelpages.repository.PlayerAchievementRepository;
import com.pixelpages.repository.NoteRepository;
import com.pixelpages.repository.TaskRepository;
import com.pixelpages.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AchievementService {
    
    private final AchievementRepository achievementRepository;
    private final PlayerAchievementRepository playerAchievementRepository;
    private final NoteRepository noteRepository; 
    private final TaskRepository taskRepository;
    
    @Autowired
    @Lazy
    private FocusEntryService focusEntryService;
    
    private final TaskService taskService;
    
    private final PlayerRepository playerRepository;  // Add this field
    
    public AchievementService(AchievementRepository achievementRepository,
                             PlayerAchievementRepository playerAchievementRepository,
                             NoteRepository noteRepository,
                             TaskRepository taskRepository,
                             TaskService taskService,
                             PlayerRepository playerRepository) {  // Add this parameter
        this.achievementRepository = achievementRepository;
        this.playerAchievementRepository = playerAchievementRepository;
        this.noteRepository = noteRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
        this.playerRepository = playerRepository;  // Add this line
        System.out.println("AchievementService initialized (CLEAN VERSION)");
    }
    
    // ===============================
    // PUBLIC API METHODS
    // ===============================
    
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
    
    public List<Map<String, Object>> getAllAchievementsAsMap() {
        List<Achievement> achievements = getAllAchievements();
        
        return achievements.stream().map(achievement -> {
            Map<String, Object> achievementData = new HashMap<>();
            achievementData.put("id", achievement.getId());
            achievementData.put("name", achievement.getName());
            achievementData.put("description", achievement.getDescription());
            achievementData.put("icon", achievement.getIcon());
            achievementData.put("tier", achievement.getTier());
            achievementData.put("category", achievement.getCategory());
            achievementData.put("xpReward", achievement.getXpReward());
            achievementData.put("color", achievement.getColor());
            achievementData.put("requirementType", achievement.getRequirementType());
            achievementData.put("requirementTarget", achievement.getRequirementTarget());
            
            return achievementData;
        }).collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getPlayerAchievements(String username) {
        // ✅ AUTO-INITIALIZE ACHIEVEMENTS ON FIRST LOAD
        ensurePlayerAchievementsInitialized(username);
        
        List<Achievement> allAchievements = getAllAchievements();
        List<PlayerAchievement> playerProgress = playerAchievementRepository.findByUsername(username);
        
        Map<String, PlayerAchievement> progressMap = playerProgress.stream()
            .collect(Collectors.toMap(PlayerAchievement::getAchievementId, pa -> pa));
        
        return allAchievements.stream().map(achievement -> {
            PlayerAchievement progress = progressMap.get(achievement.getId());
            
            Map<String, Object> achievementData = new HashMap<>();
            achievementData.put("id", achievement.getId());
            achievementData.put("name", achievement.getName());
            achievementData.put("description", achievement.getDescription());
            achievementData.put("icon", achievement.getIcon());
            achievementData.put("tier", achievement.getTier());
            achievementData.put("category", achievement.getCategory());
            achievementData.put("xpReward", achievement.getXpReward());
            achievementData.put("color", achievement.getColor());
            
            if (progress != null) {
                achievementData.put("progress", progress.getProgress());
                achievementData.put("maxProgress", progress.getMaxProgress());
                achievementData.put("progressPercentage", progress.getProgressPercentage());
                achievementData.put("completed", progress.isCompleted());
                achievementData.put("unlockedAt", progress.getUnlockedAt());
            } else {
                // This shouldn't happen after auto-initialization, but just in case
                achievementData.put("progress", 0);
                achievementData.put("maxProgress", achievement.getRequirementTarget());
                achievementData.put("progressPercentage", 0.0);
                achievementData.put("completed", false);
                achievementData.put("unlockedAt", null);
            }
            
            return achievementData;
        }).collect(Collectors.toList());
    }
    
    public Map<String, Object> getPlayerStats(String username) {
        long completedCount = playerAchievementRepository.countCompletedByUsername(username);
        int totalXp = playerAchievementRepository.getTotalXpByUsername(username);
        long totalAchievements = achievementRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("completedAchievements", completedCount);
        stats.put("totalAchievements", totalAchievements);
        stats.put("totalXp", totalXp);
        stats.put("completionPercentage", totalAchievements > 0 ? (completedCount * 100.0) / totalAchievements : 0.0);
        
        return stats;
    }
    
    // ===============================
    // MAIN ACHIEVEMENT CHECK METHOD
    // ===============================
    
    public void checkAllUserAchievements(String username) {
        try {
            // ✅ AUTO-INITIALIZE ACHIEVEMENTS FIRST
            ensurePlayerAchievementsInitialized(username);
            
            System.out.println("🔄 Checking achievements for user: " + username);
            
            // Get user stats
            Player player = getOrCreatePlayer(username);
            List<Note> userNotes = noteRepository.findByUsername(username);
            List<Task> userTasks = taskRepository.findByUsername(username);
            
            // Calculate stats
            int noteCount = userNotes.size();
            int totalWords = calculateTotalWords(userNotes);
            long completedTasks = taskRepository.countByUsernameAndCompleted(username, true);
            int totalFocusMinutes = getTotalFocusMinutesForUser(username);
            int focusSessionCount = getFocusSessionCountForUser(username);
            
            System.out.println("📊 User stats - Notes: " + noteCount + ", Words: " + totalWords + 
                              ", Tasks: " + completedTasks + ", Focus: " + totalFocusMinutes + "min");
            
            // Track all achievement types
            trackNoteCreation(username, userNotes);
            trackTaskCompletion(username);
            trackFocusSession(username, totalFocusMinutes, "GENERAL");
            
            System.out.println("✅ Achievement check completed for user: " + username);
            
        } catch (Exception e) {
            System.err.println("❌ Error checking achievements: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // ===============================
    // TRACKING METHODS (FOR REAL-TIME)
    // ===============================
    
    public void trackNoteCreation(String username, List<Note> notes) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            List<Note> userNotes = noteRepository.findByUsername(username);
            int noteCount = userNotes.size();
            int wordCount = calculateTotalWords(userNotes);
            
            updateProgress(username, "first_scroll", noteCount);
            updateProgress(username, "apprentice_scribe", noteCount);
            updateProgress(username, "word_warrior", wordCount);
            updateProgress(username, "verbose_victor", wordCount);
            
            System.out.println("📝 Note tracking: " + username + " now has " + noteCount + " notes, " + wordCount + " words");
            
        } catch (Exception e) {
            System.err.println("Error tracking note creation: " + e.getMessage());
        }
    }

    public void trackTaskCompletion(String username) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            // Fix: Use long instead of int to match repository return type
            long completedCount = taskRepository.countByUsernameAndCompleted(username, true);
            
            updateProgress(username, "task_rookie", (int)completedCount);
            updateProgress(username, "mission_apprentice", (int)completedCount);
            updateProgress(username, "quest_journeyman", (int)completedCount);
            
            System.out.println("✅ Task tracking: " + username + " has completed " + completedCount + " tasks");
            
        } catch (Exception e) {
            System.err.println("Error tracking task completion: " + e.getMessage());
        }
    }
    
    public void trackFocusSession(String username, int totalMinutes, String category) {
        if (username == null || username.trim().isEmpty() || totalMinutes <= 0) {
            return;
        }
        
        try {
            int sessionCount = getFocusSessionCountForUser(username);
            
            // Update focus time achievements
            updateProgress(username, "focused_initiate", sessionCount);
            updateProgress(username, "concentration_cadet", sessionCount);
            updateProgress(username, "hour_apprentice", totalMinutes);
            updateProgress(username, "steady_studier", totalMinutes);
            
            System.out.println("🎯 Focus tracking: " + username + " - " + totalMinutes + " mins, " + sessionCount + " sessions");
            
        } catch (Exception e) {
            System.err.println("Error tracking focus session: " + e.getMessage());
        }
    }
    
    // ADD THIS NEW METHOD TO AchievementService:

    public void trackNoteEdit(String username, Note editedNote) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            // Track basic editor achievement (note edits)
            List<Note> userNotes = noteRepository.findByUsername(username);
            int totalEdits = userNotes.size(); // Simple approximation
            
            // ✅ USE CORRECT ACHIEVEMENT IDs FROM YOUR FRONTEND FILES:
            updateProgress(username, "basic_editor", totalEdits >= 1 ? 1 : 0);  // ✅ CORRECT ID
            updateProgress(username, "revision_master", totalEdits);             // ✅ CORRECT ID
            
            // Track tag usage if note has tags
            if (editedNote.getTagsString() != null && !editedNote.getTagsString().trim().isEmpty()) {
                int uniqueTagCount = getUniqueTagCount(username);
                
                // ✅ USE CORRECT ACHIEVEMENT IDs:
                updateProgress(username, "tag_rookie", uniqueTagCount >= 1 ? 1 : 0);    // ✅ CORRECT ID
                updateProgress(username, "tag_apprentice", uniqueTagCount);              // ✅ CORRECT ID  
                updateProgress(username, "tag_master", uniqueTagCount);                  // ✅ CORRECT ID
            }
            
            System.out.println("📝 Note edit tracking completed for: " + username);
            
        } catch (Exception e) {
            System.err.println("Error tracking note edit: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // ADD HELPER METHOD TO COUNT UNIQUE TAGS:
    private int getUniqueTagCount(String username) {
        try {
            List<Note> userNotes = noteRepository.findByUsername(username);
            Set<String> uniqueTags = new HashSet<>();
            
            for (Note note : userNotes) {
                if (note.getTagsString() != null && !note.getTagsString().trim().isEmpty()) {
                    String[] tags = note.getTagsString().split(",");
                    for (String tag : tags) {
                        String cleanTag = tag.trim().toLowerCase();
                        if (!cleanTag.isEmpty()) {
                            uniqueTags.add(cleanTag);
                        }
                    }
                }
            }
            
            System.out.println("🏷️ Found " + uniqueTags.size() + " unique tags for " + username);
            return uniqueTags.size();
        } catch (Exception e) {
            System.err.println("Error counting unique tags: " + e.getMessage());
            return 0;
        }
    }
    
    // ===============================
    // PRIVATE HELPER METHODS
    // ===============================
    
    private void checkNoteAchievements(String username, int noteCount, int totalWords) {
        System.out.println("Checking note achievements - Notes: " + noteCount + ", Words: " + totalWords);
        
        if (noteCount >= 1) {
            unlockAchievement(username, "first_scroll");
        }
        if (noteCount >= 5) {
            unlockAchievement(username, "apprentice_scribe");
        }
        if (noteCount >= 10) {
            unlockAchievement(username, "journeyman_writer");
        }
        if (totalWords >= 100) {
            unlockAchievement(username, "word_warrior");
        }
        if (totalWords >= 500) {
            unlockAchievement(username, "verbose_victor");
        }
        if (totalWords >= 1000) {
            unlockAchievement(username, "prolific_penman");
        }
    }

    private void checkTaskAchievements(String username, int completedTasks, int totalTasks) {
        System.out.println("Checking task achievements - Completed: " + completedTasks + ", Total: " + totalTasks);
        
        if (completedTasks >= 1) {
            unlockAchievement(username, "task_rookie");
        }
        if (completedTasks >= 5) {
            unlockAchievement(username, "mission_apprentice");
        }
        if (completedTasks >= 10) {
            unlockAchievement(username, "quest_journeyman");
        }
        if (completedTasks >= 25) {
            unlockAchievement(username, "duty_guardian");
        }
        if (completedTasks >= 50) {
            unlockAchievement(username, "task_master");
        }
    }

    private void checkFocusAchievements(String username, int totalFocusTime, int sessionCount) {
        System.out.println("Checking focus achievements - Total time: " + totalFocusTime + " mins, Sessions: " + sessionCount);
        
        if (sessionCount >= 1) {
            unlockAchievement(username, "focused_initiate");
        }
        if (sessionCount >= 5) {
            unlockAchievement(username, "concentration_cadet");
        }
        if (totalFocusTime >= 60) {
            unlockAchievement(username, "hour_apprentice");
        }
        if (totalFocusTime >= 180) {
            unlockAchievement(username, "steady_studier");
        }
    }
    
    public void unlockAchievement(String username, String achievementId) {
        try {
            // Find existing progress or create new
            PlayerAchievement playerAchievement = playerAchievementRepository
                .findByUsernameAndAchievementId(username, achievementId)
                .orElse(new PlayerAchievement(username, achievementId));
            
            // Force unlock
            playerAchievement.setProgress(playerAchievement.getTargetValue());
            playerAchievement.setCompleted(true);
            playerAchievement.setCompletedAt(LocalDateTime.now());
            
            playerAchievementRepository.save(playerAchievement);
            
            System.out.println("🎯 Achievement " + achievementId + " unlocked for " + username);
            
        } catch (Exception e) {
            System.err.println("Error unlocking achievement " + achievementId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void ensurePlayerAchievementExists(String username, String achievementId) {
        Optional<PlayerAchievement> existingOpt = playerAchievementRepository
            .findByUsernameAndAchievementId(username, achievementId);
        
        if (existingOpt.isEmpty()) {
            Optional<Achievement> achievementOpt = achievementRepository.findById(achievementId);
            if (achievementOpt.isPresent()) {
                Achievement achievement = achievementOpt.get();
                PlayerAchievement newPlayerAchievement = new PlayerAchievement();
                
                // ✅ GENERATE MANUAL ID
                newPlayerAchievement.generateId();
                
                newPlayerAchievement.setUsername(username);
                newPlayerAchievement.setAchievementId(achievementId);
                newPlayerAchievement.setCompleted(false);
                newPlayerAchievement.setProgress(0);
                newPlayerAchievement.setProgressPercentage(0.0);
                newPlayerAchievement.setMaxProgress(achievement.getRequirementTarget());
                newPlayerAchievement.setCreatedAt(LocalDateTime.now());
                newPlayerAchievement.setUpdatedAt(LocalDateTime.now());
                
                playerAchievementRepository.save(newPlayerAchievement);
                System.out.println("✅ CREATED PlayerAchievement: " + achievementId + " for " + username);
            }
        }
    }
    
    public void updateProgress(String username, String achievementId, int currentValue) {
        Achievement achievement = achievementRepository.findById(achievementId).orElse(null);
        if (achievement == null) {
            return;
        }
        
        Optional<PlayerAchievement> existingOpt = playerAchievementRepository
            .findByUsernameAndAchievementId(username, achievementId);
        
        int target = achievement.getRequirementTarget();
        double progressPercentage = Math.min(100.0, (currentValue * 100.0) / target);
        boolean isCompleted = currentValue >= target;
        
        if (existingOpt.isPresent()) {
            PlayerAchievement existing = existingOpt.get();
            if (!existing.isCompleted()) {  // Only update if not already completed
            
            // ✅ FIX: Cap progress at target for in-progress achievements
            int cappedProgress = Math.min(currentValue, target);
            existing.setProgress(cappedProgress);
            existing.setProgressPercentage(progressPercentage);
            
            if (isCompleted && !existing.isCompleted()) {
                existing.setCompleted(true);
                existing.setProgress(target);  // ✅ Set to exact target when completed
                existing.setProgressPercentage(100.0);
                existing.setUnlockedAt(LocalDateTime.now());
                System.out.println("🎉 Achievement Unlocked: " + achievement.getName() + " for " + username);
            }
            
            existing.setUpdatedAt(LocalDateTime.now());
            playerAchievementRepository.save(existing);
        }
    } else if (currentValue > 0) {
        PlayerAchievement newProgress = new PlayerAchievement();
        newProgress.generateId();
        newProgress.setUsername(username);
        newProgress.setAchievementId(achievementId);
        
        // ✅ FIX: Cap progress at target for in-progress achievements
        int cappedProgress = Math.min(currentValue, target);
        newProgress.setProgress(cappedProgress);
        newProgress.setMaxProgress(target);
        newProgress.setProgressPercentage(progressPercentage);
        newProgress.setCompleted(isCompleted);
        newProgress.setCreatedAt(LocalDateTime.now());
        newProgress.setUpdatedAt(LocalDateTime.now());
        
        if (isCompleted) {
            newProgress.setProgress(target);  // ✅ Set to exact target when completed
            newProgress.setProgressPercentage(100.0);
            newProgress.setUnlockedAt(LocalDateTime.now());
            System.out.println("🎉 Achievement Unlocked: " + achievement.getName() + " for " + username);
        }
        
        playerAchievementRepository.save(newProgress);
    }
}
    
    // Helper method to get current progress for any achievement
    private int getCurrentProgressForAchievement(String username, Achievement achievement) {
        try {
            switch (achievement.getRequirementType()) {
                case "note_count":
                    return noteRepository.findByUsername(username).size();
                    
                case "word_count":
                    List<Note> notes = noteRepository.findByUsername(username);
                    return calculateTotalWords(notes);
                    
                case "note_edits":  // ✅ ADD THIS CASE
                    return noteRepository.findByUsername(username).size(); // Simplified for now
                
                case "tag_count":   // ✅ ADD THIS CASE
                    return getUniqueTagCount(username);
                
                case "task_count":
                    return (int) taskRepository.countByUsernameAndCompleted(username, true);
                    
                case "session_count":
                    return getFocusSessionCountForUser(username);
                    
                case "total_time":
                    return getTotalFocusMinutesForUser(username);
                    
                default:
                    System.err.println("Unknown requirement type: " + achievement.getRequirementType());
                    return 0;
            }
        } catch (Exception e) {
            System.err.println("Error getting progress for " + achievement.getId() + ": " + e.getMessage());
            return 0;
        }
    }
    
    private Player getOrCreatePlayer(String username) {
        try {
            Optional<Player> existingPlayer = playerRepository.findByUsername(username);
            if (existingPlayer.isPresent()) {
                return existingPlayer.get();
            }
            
            // Create new player using EXISTING field names
            Player newPlayer = new Player();
            newPlayer.setUsername(username);
            newPlayer.setExperience(0);  // Use existing field instead of totalXp
            // createdAt and updatedAt are handled by constructor/prePersist
            
            return playerRepository.save(newPlayer);
        } catch (Exception e) {
            System.err.println("Error getting/creating player: " + e.getMessage());
            throw new RuntimeException("Failed to get or create player: " + username);
        }
    }
    
    private int calculateTotalWords(List<Note> notes) {
        try {
            return notes.stream()
                .filter(note -> note.getContent() != null)
                .mapToInt(note -> {
                    String content = note.getContent().trim();
                    if (content.isEmpty()) {
                        return 0;
                    }
                    // Split by whitespace and count non-empty parts
                    String[] words = content.split("\\s+");
                    return words.length;
                })
                .sum();
        } catch (Exception e) {
            System.err.println("Error calculating total words: " + e.getMessage());
            return 0;
        }
    }
    
    private int getFocusSessionCountForUser(String username) {
        try {
            if (focusEntryService != null) {
                // Check if method exists and handle gracefully
                Object count = null;
                try {
                    count = focusEntryService.getTotalEntryCount(username);
                } catch (Exception methodError) {
                    System.err.println("Focus service method not available: " + methodError.getMessage());
                    return 0;
                }
                return count != null ? ((Number)count).intValue() : 0;
            }
            return 0;
        } catch (Exception e) {
            System.err.println("Error getting focus session count: " + e.getMessage());
            return 0;
        }
    }
    
    private int getTotalFocusMinutesForUser(String username) {
        try {
            if (focusEntryService != null) {
                // Check if method exists and handle gracefully
                Object totalMinutes = null;
                try {
                    totalMinutes = focusEntryService.getTotalTimeAllTime(username);
                } catch (Exception methodError) {
                    System.err.println("Focus service method not available: " + methodError.getMessage());
                    return 0;
                }
                return totalMinutes != null ? ((Number)totalMinutes).intValue() : 0;
            }
            return 0;
        } catch (Exception e) {
            System.err.println("Error getting total focus minutes: " + e.getMessage());
            return 0;
        }
    }
    
    // Add this method to create progress records for ALL achievements
    public void initializeAllPlayerAchievements(String username) {
        try {
            System.out.println("🔄 Initializing ALL player achievements for: " + username);
            
            List<Achievement> allAchievements = achievementRepository.findAll();
            
            for (Achievement achievement : allAchievements) {
                // Only create if doesn't exist
                Optional<PlayerAchievement> existing = playerAchievementRepository
                    .findByUsernameAndAchievementId(username, achievement.getId());
                
                if (existing.isEmpty()) {
                    // Get current progress based on user stats
                    int currentProgress = getCurrentProgressForAchievement(username, achievement);
                    
                    PlayerAchievement pa = new PlayerAchievement();
                    pa.generateId();
                    pa.setUsername(username);
                    pa.setAchievementId(achievement.getId());
                    pa.setProgress(currentProgress);
                    pa.setMaxProgress(achievement.getRequirementTarget());
                    pa.setProgressPercentage(Math.min(100.0, (currentProgress * 100.0) / achievement.getRequirementTarget()));
                    pa.setCompleted(currentProgress >= achievement.getRequirementTarget());
                    pa.setCreatedAt(LocalDateTime.now());
                    pa.setUpdatedAt(LocalDateTime.now());
                    
                    if (pa.isCompleted()) {
                        pa.setUnlockedAt(LocalDateTime.now());
                    }
                    
                    playerAchievementRepository.save(pa);
                    System.out.println("✅ Created progress record: " + achievement.getId() + " (" + currentProgress + "/" + achievement.getRequirementTarget() + ")");
                }
            }
            
            System.out.println("🎯 Finished initializing achievements for: " + username);
            
        } catch (Exception e) {
            System.err.println("Error initializing achievements: " + e.getMessage());
        }
    }

    // Add this method to AchievementService.java
    public void ensurePlayerAchievementsInitialized(String username) {
        try {
            // Check if user has ANY achievement records
            List<PlayerAchievement> existingRecords = playerAchievementRepository.findByUsername(username);
            
            if (existingRecords.isEmpty()) {
                System.out.println("🔄 First-time user detected! Auto-initializing achievements for: " + username);
                initializeAllPlayerAchievements(username);
            } else {
                // Update progress for existing records
                updateAllAchievementProgress(username);
            }
        } catch (Exception e) {
            System.err.println("Error ensuring achievements initialized: " + e.getMessage());
        }
    }

    // Add this method to update ALL achievement progress
    public void updateAllAchievementProgress(String username) {
        try {
            System.out.println("🔄 Updating all achievement progress for: " + username);
            
            List<Achievement> allAchievements = achievementRepository.findAll();
            
            for (Achievement achievement : allAchievements) {
                int currentProgress = getCurrentProgressForAchievement(username, achievement);
                updateProgress(username, achievement.getId(), currentProgress);
            }
            
            System.out.println("✅ Updated progress for all achievements for: " + username);
        } catch (Exception e) {
            System.err.println("Error updating all progress: " + e.getMessage());
        }
    }
}
