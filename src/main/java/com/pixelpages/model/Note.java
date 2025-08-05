package com.pixelpages.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


public class Note {

    private String title;
    private String content;
    private LocalDateTime created;
    private LocalDateTime modified;
    private List<String> tags;

    //ISO 8601 formatter for consistent date/time representation
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    //----------- Constructors -----------

    public Note(String title, String content) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.content = Objects.requireNonNull(content, "Content cannot be null");
        this.created = LocalDateTime.now();
        this.modified = LocalDateTime.now();
        this.tags = new ArrayList<>();
    }

    public Note(String title, String content, List<String> tags) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.content = Objects.requireNonNull(content, "Content cannot be null");
        this.created = LocalDateTime.now(); //set created time to now
        this.modified=this.created; //set modified time to now

        // Initialize tags, ensuring it's never null
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
    }

    //Constructor for reading notes with existing metadata
    public Note(String title, String content, LocalDateTime created, LocalDateTime modified, List<String> tags) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.content = Objects.requireNonNull(content, "Content cannot be null");
        this.created = Objects.requireNonNull(created, "Created date cannot be null");
        this.modified = Objects.requireNonNull(modified, "Modified date cannot be null");
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
    }

    //update time modifier
    public void updateModifiedTimestamp() {
        this.modified = LocalDateTime.now();
    }


    //----------- Getters and Setters -----------

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

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public LocalDateTime getModified() {
        return modified;
    }

    public void setModified(LocalDateTime modified) {
        this.modified = modified;
    }

    public List<String> getTags() {
        return new ArrayList<>(tags);
    }

    public void setTags(List<String> tags) {
        this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
    }

}
