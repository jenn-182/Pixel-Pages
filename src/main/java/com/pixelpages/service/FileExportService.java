package com.pixelpages.service;

import com.pixelpages.model.Note;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.format.DateTimeFormatter;

@Service
public class FileExportService {
    
    private static final String EXPORT_DIRECTORY = "pixel_pages_notes";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public void exportNote(Note note) {
        try {
            // Create directory if it doesn't exist
            Path exportDir = Paths.get(EXPORT_DIRECTORY);
            if (!Files.exists(exportDir)) {
                Files.createDirectories(exportDir);
                System.out.println("Created adventure directory: " + EXPORT_DIRECTORY);
            }
            
            // Generate filename from title
            String filename = generateFilename(note.getTitle());
            Path filePath = exportDir.resolve(filename + ".note");
            
            // Create file content in same format as CLI
            String fileContent = createFileContent(note);
            
            // Write to file (overwrite if exists)
            Files.writeString(filePath, fileContent, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            
            // Update note's filename field
            note.setFilename(filename + ".note");
            
            System.out.println("Quest scroll saved: " + filename + ".note");
            
        } catch (IOException e) {
            System.err.println("Failed to save quest scroll: " + e.getMessage());
        }
    }
    
    private String generateFilename(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "untitled-note-" + System.currentTimeMillis();
        }
        
        return title.toLowerCase()
                   .replaceAll("[^a-z0-9\\s-]", "")
                   .replaceAll("\\s+", "-")
                   .replaceAll("-+", "-")
                   .replaceAll("^-|-$", "");
    }
    
    private String createFileContent(Note note) {
        StringBuilder content = new StringBuilder();
        
        // Title
        content.append(note.getTitle()).append("\n");
        
        // Metadata
        content.append("Created: ").append(note.getCreatedAt().format(FORMATTER)).append("\n");
        content.append("Updated: ").append(note.getUpdatedAt().format(FORMATTER)).append("\n");
        
        if (!note.getTags().isEmpty()) {
            content.append("Tags: ").append(String.join(", ", note.getTags())).append("\n");
        }
        
        if (note.getColor() != null && !note.getColor().equals("#FFD700")) {
            content.append("Color: ").append(note.getColor()).append("\n");
        }
        
        content.append("\n");
        
        // Content
        content.append(note.getContent());
        
        return content.toString();
    }

    public void deleteNoteFile(Note note) {
        try {
            if (note.getFilename() != null) {
                Path filePath = Paths.get(EXPORT_DIRECTORY, note.getFilename());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    System.out.println("Quest scroll destroyed: " + note.getFilename());
                }
            }
        } catch (IOException e) {
            System.err.println("Failed to destroy quest scroll: " + e.getMessage());
        }
    }
}
