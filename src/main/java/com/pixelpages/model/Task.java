package com.pixelpages.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column
    private boolean completed = false;
    
    @Column
    private String priority = "medium"; // high, medium, low
    
    @Column(nullable = false)
    private String username;
    
    // 🆕 NEW FIELDS FOR PHASE 2
    @Column(columnDefinition = "TEXT")
    private String description; // Optional task description
    
    @Column(name = "due_date")
    private LocalDateTime dueDate; // Optional due date
    
    @Column(name = "tags")
    private String tags; // Comma-separated tags
    
    @Column(name = "task_list_id")
    private Long taskListId; // Reference to TaskList (null for general tasks)
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Task() {}
    
    public Task(String title, String username) {
        this.title = title;
        this.username = username;
    }
    
    // Existing getters/setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // 🆕 NEW GETTERS/SETTERS
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public Long getTaskListId() { return taskListId; }
    public void setTaskListId(Long taskListId) { this.taskListId = taskListId; }
    
    // 🆕 UTILITY METHODS
    public boolean isOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDateTime.now()) && !completed;
    }
    
    public boolean isDueSoon() {
        if (dueDate == null || completed) return false;
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);
        return dueDate.isBefore(tomorrow);
    }
}