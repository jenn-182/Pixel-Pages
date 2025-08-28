package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_achievements")
public class PlayerAchievement {
    @Id
    private Long id;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "achievement_id")
    private String achievementId;
    
    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;
    
    @Column(name = "progress")
    private int progress; // For achievements with multiple steps
    
    @Column(name = "max_progress")
    private int maxProgress; // e.g., 100 for "Write 100 notes"
    
    @Column(name = "is_completed")
    private boolean isCompleted;
    
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = System.currentTimeMillis();
        }
        if (this.unlockedAt == null) {
            this.unlockedAt = LocalDateTime.now();
        }
    }
    
    // Constructors
    public PlayerAchievement() {}
    
    public PlayerAchievement(String username, String achievementId, int progress, int maxProgress) {
        this.username = username;
        this.achievementId = achievementId;
        this.progress = progress;
        this.maxProgress = maxProgress;
        this.isCompleted = progress >= maxProgress;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getAchievementId() { return achievementId; }
    public void setAchievementId(String achievementId) { this.achievementId = achievementId; }
    
    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { 
        this.unlockedAt = unlockedAt; 
    }
    
    public int getProgress() { return progress; }
    public void setProgress(int progress) { 
        this.progress = progress; 
        this.isCompleted = progress >= maxProgress;
    }
    
    public int getMaxProgress() { return maxProgress; }
    public void setMaxProgress(int maxProgress) { this.maxProgress = maxProgress; }
    
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    
    // Helper methods
    public double getProgressPercentage() {
        if (maxProgress == 0) return 100.0;
        return Math.min(100.0, (progress * 100.0) / maxProgress);
    }
    
    public boolean isInProgress() {
        return progress > 0 && !isCompleted;
    }
}
