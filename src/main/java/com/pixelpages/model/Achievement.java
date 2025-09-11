package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    private String id;  // Changed from Long to String to match frontend IDs like "first_scroll"
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    private String icon;        // Icon component name like "BookOpen", "Target", etc.
    private String tier;        // "common", "uncommon", "rare", "legendary" 
    private String category;    // "notes", "tasks", "focus", "combo", "meta"
    private int xpReward;       // XP points awarded
    private String color;       // Hex color for the achievement
    
    // Requirement fields - simplified structure
    @Column(name = "requirement_type", nullable = false)
    private String requirementType;  // "note_count", "session_count", "total_time", etc.
    
    @Column(name = "requirement_target", nullable = false)
    private int requirementTarget;   // Target number to achieve
    
    @Column(name = "requirement_data", columnDefinition = "TEXT")
    private String requirementData;  // JSON string for complex requirements
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Achievement() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Achievement(String id, String name, String description, String icon, 
                      String tier, String category, int xpReward, String color,
                      String requirementType, int requirementTarget) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.tier = tier;
        this.category = category;
        this.xpReward = xpReward;
        this.color = color;
        this.requirementType = requirementType;
        this.requirementTarget = requirementTarget;
    }
    
    // Constructor with requirement data
    public Achievement(String id, String name, String description, String icon, 
                      String tier, String category, int xpReward, String color,
                      String requirementType, int requirementTarget, String requirementData) {
        this(id, name, description, icon, tier, category, xpReward, color, requirementType, requirementTarget);
        this.requirementData = requirementData;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getRequirementType() { return requirementType; }
    public void setRequirementType(String requirementType) { this.requirementType = requirementType; }
    
    public int getRequirementTarget() { return requirementTarget; }
    public void setRequirementTarget(int requirementTarget) { this.requirementTarget = requirementTarget; }
    
    public String getRequirementData() { return requirementData; }
    public void setRequirementData(String requirementData) { this.requirementData = requirementData; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Achievement{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", tier='" + tier + '\'' +
                ", category='" + category + '\'' +
                ", requirementType='" + requirementType + '\'' +
                ", requirementTarget=" + requirementTarget +
                '}';
    }
}