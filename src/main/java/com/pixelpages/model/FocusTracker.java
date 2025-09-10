package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "focus_tracker")
public class FocusTracker {
    @Id
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(name = "total_focus_time")
    private Integer totalFocusTime = 0; // minutes
    
    @Column(name = "total_sessions")
    private Integer totalSessions = 0;
    
    @Column(name = "average_session_time")
    private Integer averageSessionTime = 0; // minutes
    
    @Column(name = "longest_session")
    private Integer longestSession = 0; // minutes
    
    @Column(name = "category_breakdown", columnDefinition = "TEXT")
    private String categoryBreakdown; // JSON string
    
    @Column(name = "streak_days")
    private Integer streakDays = 0;
    
    @Column(name = "daily_goal_met")
    private Boolean dailyGoalMet = false;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public FocusTracker() {}
    
    public FocusTracker(String username, LocalDate date) {
        this.username = username;
        this.date = date;
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        // Generate ID if not already set
        if (this.id == null) {
            this.id = System.currentTimeMillis() + (long)(Math.random() * 1000);
        }
        
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public Integer getTotalFocusTime() { return totalFocusTime; }
    public void setTotalFocusTime(Integer totalFocusTime) { this.totalFocusTime = totalFocusTime; }
    
    public Integer getTotalSessions() { return totalSessions; }
    public void setTotalSessions(Integer totalSessions) { this.totalSessions = totalSessions; }
    
    public Integer getAverageSessionTime() { return averageSessionTime; }
    public void setAverageSessionTime(Integer averageSessionTime) { this.averageSessionTime = averageSessionTime; }
    
    public Integer getLongestSession() { return longestSession; }
    public void setLongestSession(Integer longestSession) { this.longestSession = longestSession; }
    
    public String getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(String categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
    
    public Integer getStreakDays() { return streakDays; }
    public void setStreakDays(Integer streakDays) { this.streakDays = streakDays; }
    
    public Boolean getDailyGoalMet() { return dailyGoalMet; }
    public void setDailyGoalMet(Boolean dailyGoalMet) { this.dailyGoalMet = dailyGoalMet; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}