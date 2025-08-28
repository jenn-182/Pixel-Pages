package com.pixelpages.dto;

import com.pixelpages.model.Note;
import java.time.LocalDateTime;
import java.util.List;

public class NoteDetailDto {
    private Long id;
    private String title;
    private String content;
    private String filename;
    private String color;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String username; // Changed from playerUsername
    private int wordCount;

    public NoteDetailDto() {}

    public NoteDetailDto(Note note) {
        this.id = note.getId();
        this.title = note.getTitle();
        this.content = note.getContent();
        this.filename = note.getFilename();
        this.color = note.getColor();
        this.tags = note.getTags();
        this.createdAt = note.getCreatedAt();
        this.updatedAt = note.getUpdatedAt();
        this.username = note.getUsername(); // Direct username field now
        this.wordCount = note.getWordCount(); // Use the method from Note entity
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

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

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }
}