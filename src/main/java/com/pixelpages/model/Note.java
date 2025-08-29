package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed from manual ID
    // generation
    private Long id;

    @PrePersist
    public void prePersist() {
        // ADD manual ID generation:
        if (this.id == null) {
            this.id = System.currentTimeMillis() + (long) (Math.random() * 1000); // Avoid collisions
        }

        // Keep the existing date logic:
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "tags")
    private String tagsString;

    @Column(name = "color")
    private String color = "#FFD700";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "filename")
    private String filename;

    // SQLite-compatible organization fields (Long IDs only - no entity
    // relationships)
    @Column(name = "folder_id")
    private Long folderId;

    @Column(name = "notebook_id")
    private Long notebookId;

    // REMOVED: @ManyToOne relationships to avoid duplicate column mapping
    // We're using Long IDs instead for SQLite compatibility

    // Constructors
    public Note() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Note(String title, String content) {
        this();
        this.title = title;
        this.content = content;
    }

    public Note(String title, String content, List<String> tags) {
        this();
        this.title = title;
        this.content = content;
        this.setTags(tags);
    }

    public Note(String title, String content, List<String> tags, String username) {
        this();
        this.title = title;
        this.content = content;
        this.setTags(tags);
        this.username = username;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper methods for tags
    @Transient
    public List<String> getTags() {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(tagsString.split(","));
    }

    public void setTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            this.tagsString = "";
        } else {
            this.tagsString = String.join(",", tags);
        }
    }

    // Calculate word count for XP
    @Transient
    public int getWordCount() {
        if (content == null || content.trim().isEmpty()) {
            return 0;
        }
        return content.trim().split("\\s+").length;
    }

    // All getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTagsString() {
        return tagsString;
    }

    public void setTagsString(String tagsString) {
        this.tagsString = tagsString;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    // Organization fields (Long IDs only)
    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }

    public Long getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(Long notebookId) {
        this.notebookId = notebookId;
    }
}
