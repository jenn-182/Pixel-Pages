package com.pixelpages.model;

import jakarta.persistence.*;

@Entity
@Table(name = "folders")
public class Folder {
    @Id
    private Long id; // Remove @GeneratedValue - we'll set it manually

    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "color_code")
    private String colorCode = "#FFD700";
    
    @Column(name = "created_at")
    private String createdAt;
    
    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "parent_folder_id")
    private Long parentFolderId;

    // Constructors
    public Folder() {}

    public Folder(String name, String description, String colorCode) {
        this.name = name;
        this.description = description;
        this.colorCode = colorCode != null ? colorCode : "#FFD700";
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = System.currentTimeMillis(); // Simple ID generation
        }
        if (this.createdAt == null) {
            this.createdAt = java.time.LocalDateTime.now().toString();
        }
        if (this.updatedAt == null) {
            this.updatedAt = java.time.LocalDateTime.now().toString();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    // Simple getters and setters only
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public Long getParentFolderId() { return parentFolderId; }
    public void setParentFolderId(Long parentFolderId) { this.parentFolderId = parentFolderId; }
}
