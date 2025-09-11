package com.pixelpages.service;
import com.pixelpages.model.Note;

import com.pixelpages.model.Achievement;
import com.pixelpages.model.PlayerAchievement;
import com.pixelpages.repository.AchievementRepository;
import com.pixelpages.repository.PlayerAchievementRepository;
import com.pixelpages.repository.NoteRepository;
import com.pixelpages.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AchievementService {
    
    private final AchievementRepository achievementRepository;
    private final PlayerAchievementRepository playerAchievementRepository;
    private final NoteRepository noteRepository; 
    private final TaskRepository taskRepository;
    
    @Autowired
    @Lazy
    private FocusEntryService focusEntryService;
    
    private final TaskService taskService; // Add this field
    
    public AchievementService(AchievementRepository achievementRepository,
                             PlayerAchievementRepository playerAchievementRepository,
                             NoteRepository noteRepository,
                             TaskRepository taskRepository,
                             TaskService taskService) { // Add this parameter
        this.achievementRepository = achievementRepository;
        this.playerAchievementRepository = playerAchievementRepository;
        this.noteRepository = noteRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService; // Add this assignment
        System.out.println("AchievementService initialized (RE-ENABLED)");
    }
    
    // GET ALL ACHIEVEMENTS - RE-ENABLED
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
    
    // GET ALL ACHIEVEMENTS AS MAP - NEW METHOD FOR CONTROLLER
    public List<Map<String, Object>> getAllAchievementsAsMap() {
        List<Achievement> achievements = getAllAchievements();
        
        return achievements.stream().map(achievement -> {
            Map<String, Object> achievementData = new HashMap<>();
            achievementData.put("id", achievement.getId());
            achievementData.put("name", achievement.getName());
            achievementData.put("description", achievement.getDescription());
            achievementData.put("icon", achievement.getIcon());
            achievementData.put("tier", achievement.getTier());  // CHANGED from getRarity()
            achievementData.put("category", achievement.getCategory());
            achievementData.put("xpReward", achievement.getXpReward());
            achievementData.put("color", achievement.getColor());
            achievementData.put("requirementType", achievement.getRequirementType());
            achievementData.put("requirementTarget", achievement.getRequirementTarget());
            
            return achievementData;
        }).collect(Collectors.toList());
    }
    
    // GET PLAYER ACHIEVEMENTS WITH PROGRESS - RE-ENABLED
    public List<Map<String, Object>> getPlayerAchievements(String username) {
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
            
            // Progress data
            achievementData.put("progress", progress != null ? progress.getProgressPercentage() : 0.0);
            achievementData.put("completed", progress != null && progress.isCompleted());
            achievementData.put("unlockedAt", progress != null ? progress.getUnlockedAt() : null);
            
            return achievementData;
        }).collect(Collectors.toList());
    }
    
    // UPDATE PROGRESS - RE-ENABLED  
    public void updateProgress(String username, String achievementId, int currentValue) {
        Achievement achievement = achievementRepository.findById(achievementId).orElse(null);
        if (achievement == null) {
            System.err.println("Achievement not found: " + achievementId);
            return;
        }
        
        Optional<PlayerAchievement> existingOpt = playerAchievementRepository
            .findByUsernameAndAchievementId(username, achievementId);
        
        int target = achievement.getRequirementTarget();
        double progressPercentage = Math.min(100.0, (currentValue * 100.0) / target);
        boolean isCompleted = currentValue >= target;
        
        if (existingOpt.isPresent()) {
            PlayerAchievement existing = existingOpt.get();
            if (!existing.isCompleted() && progressPercentage > existing.getProgressPercentage()) {
                existing.setProgress(currentValue);
                existing.setProgressPercentage(progressPercentage);
                
                if (isCompleted && !existing.isCompleted()) {
                    existing.setCompleted(true);
                    existing.setUnlockedAt(LocalDateTime.now());
                    System.out.println("🎉 Achievement Unlocked: " + achievement.getName() + " for " + username);
                }
                
                playerAchievementRepository.save(existing);
            }
        } else if (currentValue > 0) {
            PlayerAchievement newProgress = new PlayerAchievement();
            newProgress.setUsername(username);
            newProgress.setAchievementId(achievementId);
            newProgress.setProgress(currentValue);
            newProgress.setMaxProgress(target);
            newProgress.setProgressPercentage(progressPercentage);
            newProgress.setCompleted(isCompleted);
            newProgress.setCreatedAt(LocalDateTime.now());
            newProgress.setUpdatedAt(LocalDateTime.now());
            
            if (isCompleted) {
                newProgress.setUnlockedAt(LocalDateTime.now());
                System.out.println("🎉 Achievement Unlocked: " + achievement.getName() + " for " + username);
            }
            
            playerAchievementRepository.save(newProgress);
        }
    }
    
    // GET PLAYER STATS - NEW METHOD FOR CONTROLLER
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
    
    // ACHIEVEMENT TRACKING METHODS - for integration with other services

    public void checkAndUnlockAchievements(String username, List<com.pixelpages.model.Note> notes, com.pixelpages.model.Player player) {
        if (username == null || username.trim().isEmpty()) {
            return; // Skip if no username
        }
        
        try {
            // Note count achievements
            int noteCount = notes != null ? notes.size() : 0;
            updateProgress(username, "first_scroll", noteCount);
            updateProgress(username, "apprentice_scribe", noteCount);
            updateProgress(username, "journeyman_writer", noteCount);
            updateProgress(username, "dedicated_chronicler", noteCount);
            updateProgress(username, "master_archivist", noteCount);
            
            // Word count achievements (calculate total words from all notes)
            int totalWords = calculateTotalWords(notes);
            updateProgress(username, "word_warrior", totalWords);
            updateProgress(username, "verbose_victor", totalWords);
            updateProgress(username, "prolific_penman", totalWords);
            
            System.out.println("Checked note achievements for " + username + ": " + noteCount + " notes, " + totalWords + " words");
            
        } catch (Exception e) {
            System.err.println("Error checking note achievements for " + username + ": " + e.getMessage());
        }
    }

    // REAL-TIME TRACKING - Enhanced version
    public void trackNoteCreation(String username) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            // Get current counts from database
            List<com.pixelpages.model.Note> userNotes = noteRepository.findByUsername(username);
            int noteCount = userNotes.size();
            int wordCount = calculateTotalWords(userNotes);
            
            // Update note count achievements
            updateProgress(username, "first_scroll", noteCount);
            updateProgress(username, "apprentice_scribe", noteCount);
            updateProgress(username, "journeyman_writer", noteCount);
            updateProgress(username, "dedicated_chronicler", noteCount);
            updateProgress(username, "master_archivist", noteCount);
            updateProgress(username, "lore_keeper", noteCount);
            updateProgress(username, "grand_librarian", noteCount);
            updateProgress(username, "immortal_chronicler", noteCount);
            
            // Update word count achievements
            updateProgress(username, "word_warrior", wordCount);
            updateProgress(username, "verbose_victor", wordCount);
            updateProgress(username, "prolific_penman", wordCount);
            updateProgress(username, "epic_novelist", wordCount);
            updateProgress(username, "master_wordsmith", wordCount);
            updateProgress(username, "legendary_wordsmith", wordCount);
            
            System.out.println("📝 Note tracking: " + username + " now has " + noteCount + " notes, " + wordCount + " words");
            
        } catch (Exception e) {
            System.err.println("Error tracking note creation: " + e.getMessage());
        }
    }

    // Track task completion (for when TaskService calls this)
    public void trackTaskCompletion(String username) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            // Get current completed task count
            List<com.pixelpages.model.Task> completedTasks = taskRepository.findByUsername(username)
                .stream()
                .filter(task -> task.isCompleted())
                .toList();
            
            int completedCount = completedTasks.size();
            
            // Update task completion achievements
            updateProgress(username, "task_rookie", completedCount);
            updateProgress(username, "mission_apprentice", completedCount);
            updateProgress(username, "quest_journeyman", completedCount);
            updateProgress(username, "duty_guardian", completedCount);
            updateProgress(username, "task_master", completedCount);
            updateProgress(username, "centurion_completer", completedCount);
            updateProgress(username, "task_emperor", completedCount);
            
            System.out.println("✅ Task tracking: " + username + " has completed " + completedCount + " tasks");
            
        } catch (Exception e) {
            System.err.println("Error tracking task completion: " + e.getMessage());
        }
    }

    // Track focus session completion
    public void trackFocusSession(String username, int sessionMinutes, String category) {
        if (username == null || username.trim().isEmpty()) {
            return;
        }
        
        try {
            // Get current focus statistics
            Long sessionCount = focusEntryService != null ? focusEntryService.getTotalEntryCount(username) : 0L;
            Integer totalMinutes = focusEntryService != null ? focusEntryService.getTotalTimeAllTime(username) : 0;
            
            int sessions = sessionCount != null ? sessionCount.intValue() : 0;
            int totalTime = totalMinutes != null ? totalMinutes : 0;
            
            // Update session count achievements
            updateProgress(username, "focused_initiate", sessions);
            updateProgress(username, "concentration_cadet", sessions);
            updateProgress(username, "attention_apprentice", sessions);
            updateProgress(username, "mindfulness_rookie", sessions);
            updateProgress(username, "focus_veteran", sessions);
            updateProgress(username, "concentration_master", sessions);
            updateProgress(username, "focus_legend", sessions);
            
            // Update time-based achievements
            updateProgress(username, "hour_apprentice", totalTime);
            updateProgress(username, "steady_studier", totalTime);
            updateProgress(username, "deep_work_warrior", totalTime);
            updateProgress(username, "marathon_mind", totalTime);
            updateProgress(username, "time_lord", totalTime);
            
            // Update single session achievements
            updateProgress(username, "long_distance_runner", sessionMinutes);
            updateProgress(username, "zen_master", sessionMinutes);
            
            System.out.println("🎯 Focus tracking: " + username + " completed session #" + sessions + " (" + sessionMinutes + "min). Total: " + totalTime + " minutes");
            
        } catch (Exception e) {
            System.err.println("Error tracking focus session: " + e.getMessage());
        }
    }
    
    // ENHANCED ACHIEVEMENT TRACKING - ADD THIS METHOD:
    public void checkAllUserAchievements(String username) {
        try {
            System.out.println("=== CHECKING ALL ACHIEVEMENTS FOR: " + username + " ===");
            
            // Step 1: Get user statistics
            System.out.println("Step 1: Gathering user statistics...");
            
            // Get note stats - USE CORRECT METHOD NAMES
            List<com.pixelpages.model.Note> allNotes = noteRepository.findByUsername(username);
            int noteCount = allNotes.size();
            int totalWords = calculateTotalWords(allNotes);
            
            // Get task stats  
            TaskService.TaskStats taskStats = taskService.getTaskStats(username);
            long completedTasks = taskStats.getCompletedTasks();
            long totalTasks = taskStats.getTotalTasks();
            
            // Get focus stats (if available)
            int totalFocusTime = getTotalFocusMinutesForUser(username);
            int focusSessions = getFocusSessionCountForUser(username);
            
            System.out.println("User stats - Notes: " + noteCount + ", Words: " + totalWords + 
                              ", Completed Tasks: " + completedTasks + ", Total Tasks: " + totalTasks +
                              ", Focus Time: " + totalFocusTime + " mins, Sessions: " + focusSessions);
            
            // Step 2: Check each achievement type
            System.out.println("Step 2: Checking achievements...");
            
            // Check note-based achievements
            checkNoteAchievements(username, noteCount, totalWords);
            
            // Check task-based achievements  
            checkTaskAchievements(username, (int)completedTasks, (int)totalTasks);
            
            // Check focus-based achievements
            checkFocusAchievements(username, totalFocusTime, focusSessions);  // ✅ Add the missing parameter
            
            System.out.println("=== ACHIEVEMENT CHECK COMPLETE FOR: " + username + " ===");
            
        } catch (Exception e) {
            System.err.println("Error in checkAllUserAchievements for " + username + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Achievement check failed for " + username, e);
        }
    }
    
    // Helper method to calculate word count
    private int calculateWordCount(String content) {
        if (content == null || content.trim().isEmpty()) {
            return 0;
        }
        return content.trim().split("\\s+").length;
    }

    // Check note-based achievements
    private void checkNoteAchievements(String username, int noteCount, int totalWords) {
        System.out.println("Checking note achievements - Notes: " + noteCount + ", Words: " + totalWords);
        
        // Use the ACTUAL achievement IDs from your database
        if (noteCount >= 1) {
            unlockAchievement(username, "first_scroll");  // ✅ Correct ID
        }
        if (noteCount >= 5) {
            unlockAchievement(username, "apprentice_scribe");  // ✅ Correct ID
        }
        if (noteCount >= 10) {
            unlockAchievement(username, "journeyman_writer");  // ✅ Correct ID
        }
        if (totalWords >= 100) {
            unlockAchievement(username, "word_warrior");  // ✅ Correct ID
        }
        if (totalWords >= 500) {
            unlockAchievement(username, "verbose_victor");  // ✅ Correct ID
        }
        if (totalWords >= 1000) {
            unlockAchievement(username, "prolific_penman");  // ✅ Correct ID
        }
    }

    // Check task-based achievements
    private void checkTaskAchievements(String username, int completedTasks, int totalTasks) {
        System.out.println("Checking task achievements - Completed: " + completedTasks + ", Total: " + totalTasks);
        
        // Use the ACTUAL achievement IDs from your database
        if (completedTasks >= 1) {
            unlockAchievement(username, "task_rookie");  // ✅ Correct ID
        }
        if (completedTasks >= 5) {
            unlockAchievement(username, "mission_apprentice");  // ✅ Correct ID
        }
        if (completedTasks >= 10) {
            unlockAchievement(username, "quest_journeyman");  // ✅ Correct ID
        }
        if (completedTasks >= 25) {
            unlockAchievement(username, "duty_guardian");  // ✅ Correct ID
        }
        if (completedTasks >= 50) {
            unlockAchievement(username, "task_master");  // ✅ Correct ID
        }
    }

    private void checkFocusAchievements(String username, int totalFocusTime, int sessionCount) {
        System.out.println("Checking focus achievements - Total time: " + totalFocusTime + " mins, Sessions: " + sessionCount);
        
        if (sessionCount >= 1) {
            unlockAchievement(username, "focused_initiate");  // ✅ Correct ID
        }
        if (sessionCount >= 5) {
            unlockAchievement(username, "concentration_cadet");  // ✅ Correct ID
        }
        if (totalFocusTime >= 60) {  // 1 hour
            unlockAchievement(username, "hour_apprentice");  // ✅ Correct ID
        }
        if (totalFocusTime >= 180) {  // 3 hours
            unlockAchievement(username, "steady_studier");  // ✅ Correct ID
        }
    }
    
    // Helper method to unlock an achievement
    private void unlockAchievement(String username, String achievementId) {
        try {
            // Ensure the PlayerAchievement exists first
            ensurePlayerAchievementExists(username, achievementId);
            
            Optional<PlayerAchievement> existingOpt = playerAchievementRepository
                .findByUsernameAndAchievementId(username, achievementId);
            
            if (existingOpt.isPresent()) {
                PlayerAchievement existing = existingOpt.get();
                if (!existing.isCompleted()) {
                    existing.setCompleted(true);
                    existing.setProgressPercentage(100.0);
                    existing.setUnlockedAt(LocalDateTime.now());
                    existing.setUpdatedAt(LocalDateTime.now());
                    playerAchievementRepository.save(existing);
                    System.out.println("✅ UNLOCKED: " + achievementId + " for " + username);
                }
            }
        } catch (Exception e) {
            System.err.println("Error unlocking achievement " + achievementId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void ensurePlayerAchievementExists(String username, String achievementId) {
        Optional<PlayerAchievement> existingOpt = playerAchievementRepository
            .findByUsernameAndAchievementId(username, achievementId);
        
        if (existingOpt.isEmpty()) {
            // Create the missing PlayerAchievement
            Optional<Achievement> achievementOpt = achievementRepository.findById(achievementId);
            if (achievementOpt.isPresent()) {
                PlayerAchievement newPlayerAchievement = new PlayerAchievement();
                newPlayerAchievement.setUsername(username);
                newPlayerAchievement.setAchievementId(achievementId);
                newPlayerAchievement.setCompleted(false);
                newPlayerAchievement.setProgress(0);
                newPlayerAchievement.setProgressPercentage(0.0);
                newPlayerAchievement.setCreatedAt(LocalDateTime.now());
                newPlayerAchievement.setUpdatedAt(LocalDateTime.now());
                
                playerAchievementRepository.save(newPlayerAchievement);
                System.out.println("✅ CREATED PlayerAchievement: " + achievementId + " for " + username);
            }
        }
    }

    // Add method to get task stats
    private TaskService.TaskStats getTaskStats(String username) {
        return taskService.getTaskStats(username);
    }
    
    // HELPER METHODS - ADD THESE:
    private int getNoteCountForUser(String username) {
        try {
            // Try different possible method names:
            List<com.pixelpages.model.Note> notes = noteRepository.findByUsername(username);
            return notes != null ? notes.size() : 0;
        } catch (Exception e) {
            System.err.println("Error getting note count: " + e.getMessage());
            return 0;
        }
    }
    
    private int getCompletedTaskCountForUser(String username) {
        try {
            // Get all tasks for user and filter completed ones
            List<com.pixelpages.model.Task> allTasks = taskRepository.findByUsername(username);
            return (int) allTasks.stream()
                .filter(task -> task.isCompleted())
                .count();
        } catch (Exception e) {
            System.err.println("Error getting completed task count: " + e.getMessage());
            return 0;
        }
    }
    
    private int getFocusSessionCountForUser(String username) {
        try {
            if (focusEntryService != null) {
                Long count = focusEntryService.getTotalEntryCount(username);
                return count != null ? count.intValue() : 0;
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
                Integer totalMinutes = focusEntryService.getTotalTimeAllTime(username);
                return totalMinutes != null ? totalMinutes : 0;
            }
            return 0;
        } catch (Exception e) {
            System.err.println("Error getting total focus minutes: " + e.getMessage());
            return 0;
        }
    }
    
    private int getTotalWordsForUser(String username) {
        try {
            List<com.pixelpages.model.Note> notes = noteRepository.findByUsername(username);
            if (notes == null || notes.isEmpty()) {
                return 0;
            }
            
            return notes.stream()
                .mapToInt(note -> {
                    String content = note.getContent();
                    if (content == null || content.trim().isEmpty()) {
                        return 0;
                    }
                    String[] words = content.trim().split("\\s+");
                    return words.length > 0 && !words[0].isEmpty() ? words.length : 0;
                })
                .sum();
        } catch (Exception e) {
            System.err.println("Error getting total words: " + e.getMessage());
            return 0;
        }
    }
    
    // Add this missing method to your AchievementService:

    // Helper method to calculate total words from a list of notes
    private int calculateTotalWords(List<com.pixelpages.model.Note> notes) {
        if (notes == null || notes.isEmpty()) {
            return 0;
        }
        
        return notes.stream()
            .mapToInt(note -> {
                String content = note.getContent();
                if (content == null || content.trim().isEmpty()) {
                    return 0;
                }
                // Simple word count: split by whitespace and count non-empty strings
                String[] words = content.trim().split("\\s+");
                return words.length > 0 && !words[0].isEmpty() ? words.length : 0;
            })
            .sum();
    }
    
    // Add this method that your controller is calling:

    // POPULATE TEST DATA - for testing achievements
    public String populateTestData(String username) {
        try {
            // Create some test progress for different achievement types
            
            // Note achievements - simulate user has 3 notes
            updateProgress(username, "first_scroll", 3);
            updateProgress(username, "apprentice_scribe", 3);
            
            // Task achievements - simulate user completed 1 task  
            updateProgress(username, "task_rookie", 1);
            
            // Focus achievements - simulate user has 2 sessions, 45 minutes total
            updateProgress(username, "focused_initiate", 2);
            updateProgress(username, "hour_apprentice", 45);
            
            // Word count achievements - simulate 150 words written
            updateProgress(username, "word_warrior", 150);
            
            // Time-based achievements - partial progress
            updateProgress(username, "marathon_mind", 300); // 25% of 1200 minutes
            
            return "Test data populated for " + username;
            
        } catch (Exception e) {
            System.err.println("Error populating test data: " + e.getMessage());
            return "Failed to populate test data: " + e.getMessage();
        }
    }
    
    // 1. Manual test progress method (REMOVE LATER)
    public String setTestProgress(String username) {
        try {
            // Manually set progress for testing
            updateProgress(username, "first_scroll", 1);
            updateProgress(username, "apprentice_scribe", 1);
            updateProgress(username, "journeyman_writer", 1);
            updateProgress(username, "dedicated_chronicler", 1);
            updateProgress(username, "master_archivist", 1);
            updateProgress(username, "word_warrior", 50);
            updateProgress(username, "verbose_victor", 50);
            updateProgress(username, "prolific_penman", 50);
            updateProgress(username, "task_rookie", 1);
            updateProgress(username, "focused_initiate", 1);
            updateProgress(username, "hour_apprentice", 30);
            updateProgress(username, "marathon_mind", 600);
            
            return "Test progress set for " + username;
            
        } catch (Exception e) {
            System.err.println("Error setting test progress: " + e.getMessage());
            return "Failed to set test progress: " + e.getMessage();
        }
    }
}
