package com.pixelpages.storage;

import com.pixelpages.model.Note;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class NoteStorage {
    private final String notesDirectory;
    private final ObjectMapper objectMapper;

    public NoteStorage(String notesDirectory) {
        this.notesDirectory = notesDirectory;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        
        // Ensure directory exists
        try {
            Files.createDirectories(Paths.get(notesDirectory));
        } catch (IOException e) {
            throw new RuntimeException("Failed to create notes directory", e);
        }
    }

    public void saveNote(Note note, String filename) throws IOException {
        Objects.requireNonNull(note, "Note cannot be null");
        Objects.requireNonNull(filename, "Filename cannot be null");
        
        // Ensure filename has .note extension
        String normalizedFilename = filename.endsWith(".note") ? filename : filename + ".note";
        
        // Set the filename on the note
        note.setFilename(normalizedFilename);
        
        // Update the updatedAt timestamp
        note.setUpdatedAt(LocalDateTime.now());
        
        Path notePath = Paths.get(notesDirectory, normalizedFilename);
        
        try {
            objectMapper.writeValue(notePath.toFile(), note);
        } catch (IOException e) {
            throw new IOException("Failed to save note: " + normalizedFilename, e);
        }
    }

    public Note readNote(String filename) throws IOException {
        Objects.requireNonNull(filename, "Filename cannot be null");
        
        String normalizedFilename = filename.endsWith(".note") ? filename : filename + ".note";
        Path notePath = Paths.get(notesDirectory, normalizedFilename);
        
        if (!Files.exists(notePath)) {
            throw new IOException("Note file not found: " + normalizedFilename);
        }
        
        try {
            Note note = objectMapper.readValue(notePath.toFile(), Note.class);
            // Ensure filename is set
            if (note.getFilename() == null) {
                note.setFilename(normalizedFilename);
            }
            return note;
        } catch (IOException e) {
            throw new IOException("Failed to read note: " + normalizedFilename, e);
        }
    }

    public List<Note> listAllNotes() throws IOException {
        List<Note> notes = new ArrayList<>();
        Path dirPath = Paths.get(notesDirectory);
        
        if (!Files.exists(dirPath)) {
            return notes;
        }
        
        try {
            Files.list(dirPath)
                    .filter(path -> path.toString().endsWith(".note"))
                    .forEach(path -> {
                        try {
                            Note note = objectMapper.readValue(path.toFile(), Note.class);
                            // Ensure filename is set
                            if (note.getFilename() == null) {
                                note.setFilename(path.getFileName().toString());
                            }
                            notes.add(note);
                        } catch (IOException e) {
                            System.err.println("Failed to read note file: " + path.getFileName());
                        }
                    });
        } catch (IOException e) {
            throw new IOException("Failed to list notes", e);
        }
        
        return notes;
    }

    // Add the missing deleteNote method
    public void deleteNote(String filename) throws IOException {
        Objects.requireNonNull(filename, "Filename cannot be null");
        
        String normalizedFilename = filename.trim();
        if (normalizedFilename.isEmpty()) {
            throw new IllegalArgumentException("Filename cannot be empty");
        }
        
        // Add .note extension if missing
        if (!normalizedFilename.endsWith(".note")) {
            normalizedFilename += ".note";
        }
        
        Path notePath = Paths.get(notesDirectory, normalizedFilename);
        
        // Check if file exists
        if (!Files.exists(notePath)) {
            throw new IOException("Note file does not exist: " + normalizedFilename);
        }
        
        // Check if it's actually a file (not a directory)
        if (!Files.isRegularFile(notePath)) {
            throw new IOException("Path is not a regular file: " + normalizedFilename);
        }
        
        // Attempt deletion
        try {
            Files.delete(notePath);
        } catch (IOException e) {
            throw new IOException("Failed to delete note file: " + normalizedFilename, e);
        }
    }

    public String generateUniqueFilename(String title) {
        if (title == null || title.trim().isEmpty()) {
            title = "untitled";
        }
        
        // Clean the title for use as filename
        String baseFilename = title.trim()
                .replaceAll("[^a-zA-Z0-9\\s-_]", "") // Remove special characters
                .replaceAll("\\s+", "_") // Replace spaces with underscores
                .toLowerCase();
        
        if (baseFilename.isEmpty()) {
            baseFilename = "note";
        }
        
        String filename = baseFilename + ".note";
        Path path = Paths.get(notesDirectory, filename);
        
        int counter = 1;
        while (Files.exists(path)) {
            filename = baseFilename + "_" + counter + ".note";
            path = Paths.get(notesDirectory, filename);
            counter++;
        }
        
        return filename;
    }

    public boolean noteExists(String filename) {
        String normalizedFilename = filename.endsWith(".note") ? filename : filename + ".note";
        Path notePath = Paths.get(notesDirectory, normalizedFilename);
        return Files.exists(notePath);
    }
}