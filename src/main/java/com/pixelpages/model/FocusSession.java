package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "focus_sessions")
public class FocusSession {
    @Id
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "color_code")
    private String colorCode = "#8B5CF6";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FocusCategory category = FocusCategory.WORK;
    
    @Column(name = "work_duration", nullable = false)
    private Integer workDuration = 25; // minutes
    
    @Column(name = "break_duration", nullable = false)
    private Integer breakDuration = 5; // minutes
    
    @Column(nullable = false)
    private Integer cycles = 1;
    
    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "total_time_logged")
    private Integer totalTimeLogged = 0; // minutes
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public FocusSession() {}
    
    public FocusSession(String name, String ownerUsername) {
        this.name = name;
        this.ownerUsername = ownerUsername;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        // Generate ID if not already set (matching your existing pattern)
        if (this.id == null) {
            this.id = System.currentTimeMillis() + (long)(Math.random() * 1000);
        }
        
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    
    public FocusCategory getCategory() { return category; }
    public void setCategory(FocusCategory category) { this.category = category; }
    
    public Integer getWorkDuration() { return workDuration; }
    public void setWorkDuration(Integer workDuration) { this.workDuration = workDuration; }
    
    public Integer getBreakDuration() { return breakDuration; }
    public void setBreakDuration(Integer breakDuration) { this.breakDuration = breakDuration; }
    
    public Integer getCycles() { return cycles; }
    public void setCycles(Integer cycles) { this.cycles = cycles; }
    
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Integer getTotalTimeLogged() { return totalTimeLogged; }
    public void setTotalTimeLogged(Integer totalTimeLogged) { this.totalTimeLogged = totalTimeLogged; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}