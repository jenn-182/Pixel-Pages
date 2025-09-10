package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "focus_entries")
public class FocusEntry {
    @Id
    private Long id;
    
    @Column(name = "session_id", nullable = false)
    private Long sessionId;
    
    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;
    
    @Column(name = "time_spent", nullable = false)
    private Integer timeSpent; // minutes
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(nullable = false)
    private Boolean completed = true;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "is_manual_entry")
    private Boolean isManualEntry = false;
    
    @Column
    private String phase; // "work", "break", "long_break"
    
    @Column(name = "cycle_number")
    private Integer cycleNumber;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public FocusEntry() {}
    
    public FocusEntry(Long sessionId, String ownerUsername, Integer timeSpent, LocalDate date) {
        this.sessionId = sessionId;
        this.ownerUsername = ownerUsername;
        this.timeSpent = timeSpent;
        this.date = date;
        this.createdAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        // Generate ID if not already set
        if (this.id == null) {
            this.id = System.currentTimeMillis() + (long)(Math.random() * 1000);
        }
        
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    
    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public Boolean getIsManualEntry() { return isManualEntry; }
    public void setIsManualEntry(Boolean isManualEntry) { this.isManualEntry = isManualEntry; }
    
    public String getPhase() { return phase; }
    public void setPhase(String phase) { this.phase = phase; }
    
    public Integer getCycleNumber() { return cycleNumber; }
    public void setCycleNumber(Integer cycleNumber) { this.cycleNumber = cycleNumber; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}