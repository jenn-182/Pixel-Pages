package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_achievements")
public class PlayerAchievement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false)
    private String username;
    
    @Column(name = "achievement_id", nullable = false)
    private String achievementId;
    
    @Column(name = "completed", nullable = false)
    private boolean completed = false;
    
    @Column(name = "progress")
    private int progress = 0;
    
    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;
    
    @Column(name = "max_progress")
    private Integer maxProgress;
    
    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public PlayerAchievement() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getAchievementId() { return achievementId; }
    public void setAchievementId(String achievementId) { this.achievementId = achievementId; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    
    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }
    
    public Integer getMaxProgress() { return maxProgress; }
    public void setMaxProgress(Integer maxProgress) { this.maxProgress = maxProgress; }
    
    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
