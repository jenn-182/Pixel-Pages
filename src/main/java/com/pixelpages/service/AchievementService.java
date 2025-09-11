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
public class AchievementService {
    
    private final AchievementRepository achievementRepository;
    private final PlayerAchievementRepository playerAchievementRepository;
    private final NoteRepository noteRepository; 
    private final TaskRepository taskRepository;
    
    @Autowired
    @Lazy
    private FocusEntryService focusEntryService;
    
    private final TaskService taskService;
    
    public AchievementService(AchievementRepository achievementRepository,
                             PlayerAchievementRepository playerAchievementRepository,
                             NoteRepository noteRepository,
                             TaskRepository taskRepository,
                             TaskService taskService) {
        this.achievementRepository = achievementRepository;
        this.playerAchievementRepository = playerAchievementRepository;
        this.noteRepository = noteRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
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
    
    @Transactional
    public void checkAllUserAchievements(String username) {
        try {
            System.out.println("=== CHECKING ALL ACHIEVEMENTS FOR: " + username + " ===");
            System.out.println("Step 1: Gathering user statistics...");
            
            // Get user data
            List<Note> notes = noteRepository.findByUsername(username);
            
            // Fix: Handle both possible method names
            long completedTasks = 0;
            long totalTasks = 0;
            
            try {
                completedTasks = taskRepository.countByUsernameAndCompleted(username, true);
            } catch (Exception e) {
                System.err.println("Method countByUsernameAndCompleted not found, trying alternative...");
                // Alternative method if the above doesn't exist
                try {
                    totalTasks = taskRepository.countByUsername(username);
                    // Calculate completed manually if needed
                    completedTasks = totalTasks; // Placeholder - adjust based on your actual repository
                } catch (Exception e2) {
                    System.err.println("No task count methods available: " + e2.getMessage());
                }
            }
            
            try {
                totalTasks = taskRepository.countByUsername(username);
            } catch (Exception e) {
                System.err.println("Method countByUsername not found: " + e.getMessage());
            }
            
            int totalFocusTime = getTotalFocusMinutesForUser(username);
            int focusSessions = getFocusSessionCountForUser(username);
            
            System.out.println("User stats - Notes: " + notes.size() + ", Words: " + calculateTotalWords(notes) + 
                              ", Completed Tasks: " + completedTasks + ", Total Tasks: " + totalTasks +
                              ", Focus Time: " + totalFocusTime + " mins, Sessions: " + focusSessions);
            
            // Step 2: Check achievements
            System.out.println("Step 2: Checking achievements...");
            checkNoteAchievements(username, notes.size(), calculateTotalWords(notes));
            checkTaskAchievements(username, (int)completedTasks, (int)totalTasks);
            checkFocusAchievements(username, totalFocusTime, focusSessions);
            
            System.out.println("✅ Achievement check completed for: " + username);
            
        } catch (Exception e) {
            System.err.println("Error checking achievements for " + username + ": " + e.getMessage());
            e.printStackTrace(); // This will show the exact error
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
    
    private void unlockAchievement(String username, String achievementId) {
        try {
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
            
            // ✅ GENERATE MANUAL ID
            newProgress.generateId();
            
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
    
    private int calculateTotalWords(List<Note> notes) {
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
}
