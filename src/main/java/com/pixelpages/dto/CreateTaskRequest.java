package com.pixelpages.dto;

public class CreateTaskRequest {
    private String title;
    private String description;
    private String priority;
    private String dueDate;  // ✅ String format from frontend
    private String tags;
    private Long taskListId;
    private Boolean completed;
    
    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public Long getTaskListId() { return taskListId; }
    public void setTaskListId(Long taskListId) { this.taskListId = taskListId; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}