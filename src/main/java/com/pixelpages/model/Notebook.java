package com.pixelpages.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notebooks")
public class Notebook {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(name = "color_code")
    private String colorCode = "#87CEEB";

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "folder_id")
    private Long folderId;

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

    // Constructors
    public Notebook() {
    }

    public Notebook(String name, String description, String colorCode) {
        this.name = name;
        this.description = description;
        this.colorCode = colorCode != null ? colorCode : "#87CEEB";
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    // Simple getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }
}