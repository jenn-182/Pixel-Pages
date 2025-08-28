package com.pixelpages.dto;

import com.pixelpages.model.Note;
import java.time.LocalDateTime;
import java.util.List;

public class NoteListDto {
    private Long id;
    private String title;
    private String filename;
    private String color;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String contentPreview;

    public NoteListDto() {}

    public NoteListDto(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.filename = note.getFilename();
        this.color = note.getColor();
        this.tags = note.getTags();
        this.createdAt = note.getCreatedAt();
        this.updatedAt = note.getUpdatedAt();
        
        // Create a preview of the content (first 150 characters)
        if (note.getContent() != null) {
            this.contentPreview = note.getContent().length() > 150 
                ? note.getContent().substring(0, 150) + "..."
                : note.getContent();
        } else {
            this.contentPreview = "";
        }
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getContentPreview() { return contentPreview; }
    public void setContentPreview(String contentPreview) { this.contentPreview = contentPreview; }
}
