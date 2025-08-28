package com.pixelpages.service;

import com.pixelpages.model.Note;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Stream;

@Service
public class MigrationService {
    
    private final NoteService noteService;
    private static final String LEGACY_DIRECTORY = "pixel_pages_notes";
    private static final DateTimeFormatter LEGACY_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public MigrationService(NoteService noteService) {
        this.noteService = noteService;
    }
    
    public Map<String, Object> importNotesFromDirectory(String username) throws IOException {
        Path legacyDir = Paths.get(LEGACY_DIRECTORY);
        
        if (!Files.exists(legacyDir)) {
            return Map.of(
                "imported", 0,
                "message", "No legacy notes directory found at: " + LEGACY_DIRECTORY
            );
        }
        
        List<String> importedFiles = new ArrayList<>();
        List<String> skippedFiles = new ArrayList<>();
        
        try (Stream<Path> files = Files.list(legacyDir)) {
            files.filter(path -> path.toString().endsWith(".note"))
                 .forEach(notePath -> {
                     try {
                         Note note = parseNoteFile(notePath, username);
                         if (note != null) {
                             noteService.createNote(note.getTitle(), note.getContent(), username);
                             importedFiles.add(notePath.getFileName().toString());
                             System.out.println("Imported quest scroll: " + notePath.getFileName());
                         } else {
                             skippedFiles.add(notePath.getFileName().toString());
                         }
                     } catch (Exception e) {
                         skippedFiles.add(notePath.getFileName().toString() + " (Error: " + e.getMessage() + ")");
                         System.err.println("Failed to import: " + notePath.getFileName() + " - " + e.getMessage());
                     }
                 });
        }
        
        return Map.of(
            "imported", importedFiles.size(),
            "skipped", skippedFiles.size(),
            "importedFiles", importedFiles,
            "skippedFiles", skippedFiles,
            "message", "Migration complete! Imported " + importedFiles.size() + " quest scrolls from the archives!"
        );
    }
    
    private Note parseNoteFile(Path filePath, String username) throws IOException {
        List<String> lines = Files.readAllLines(filePath);
        if (lines.isEmpty()) {
            return null;
        }
        
        String title = lines.get(0).trim();
        if (title.isEmpty()) {
            title = "Untitled Note";
        }
        
        // Parse metadata and content
        List<String> tags = new ArrayList<>();
        String color = "#FFD700"; // Default color
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        
        int contentStartIndex = 1;
        
        // Look for metadata lines
        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i).trim();
            
            if (line.startsWith("Created: ")) {
                try {
                    createdAt = LocalDateTime.parse(line.substring(9), LEGACY_FORMATTER);
                } catch (DateTimeParseException e) {
                    // Ignore parsing errors
                }
            } else if (line.startsWith("Updated: ")) {
                try {
                    updatedAt = LocalDateTime.parse(line.substring(9), LEGACY_FORMATTER);
                } catch (DateTimeParseException e) {
                    // Ignore parsing errors
                }
            } else if (line.startsWith("Tags: ")) {
                String tagString = line.substring(6);
                tags = Arrays.asList(tagString.split(",\\s*"));
            } else if (line.startsWith("Color: ")) {
                color = line.substring(7);
            } else if (line.isEmpty()) {
                contentStartIndex = i + 1;
                break;
            }
        }
        
        // Extract content
        StringBuilder contentBuilder = new StringBuilder();
        for (int i = contentStartIndex; i < lines.size(); i++) {
            if (contentBuilder.length() > 0) {
                contentBuilder.append("\n");
            }
            contentBuilder.append(lines.get(i));
        }
        
        String content = contentBuilder.toString().trim();
        if (content.isEmpty()) {
            content = "Empty note";
        }
        
        // Create note (we'll manually set metadata after creation)
        Note note = new Note(title, content);
        note.setUsername(username);
        note.setTags(tags);
        note.setColor(color);
        
        // Set timestamps if parsed
        if (createdAt != null) {
            note.setCreatedAt(createdAt);
        }
        if (updatedAt != null) {
            note.setUpdatedAt(updatedAt);
        }
        
        return note;
    }
    
    public Map<String, Object> createSampleNotes(String username) {
        List<String> sampleTitles = Arrays.asList(
            "Welcome to Pixel Pages",
            "My First Quest Log",
            "Ideas and Inspiration"
        );
        
        List<String> sampleContents = Arrays.asList(
            "Welcome, brave adventurer! This is your digital quest journal where every word written earns you experience points. Create notes, organize with tags, and watch your level grow!",
            "Today I began my coding journey. The path ahead seems challenging but exciting. Each problem solved feels like defeating a boss in a video game!",
            "Random thoughts and sparks of creativity:\n- Build something amazing\n- Learn new technologies\n- Share knowledge with others\n- Never stop exploring"
        );
        
        List<List<String>> sampleTags = Arrays.asList(
            Arrays.asList("welcome", "tutorial"),
            Arrays.asList("coding", "journey", "learning"),
            Arrays.asList("ideas", "creativity", "goals")
        );
        
        for (int i = 0; i < sampleTitles.size(); i++) {
            Note note = noteService.createNote(sampleTitles.get(i), sampleContents.get(i), username);
            noteService.updateNoteWithTags(note.getId(), note.getTitle(), note.getContent(), sampleTags.get(i));
        }
        
        return Map.of(
            "created", sampleTitles.size(),
            "message", "Sample quest scrolls created! Your adventure begins!"
        );
    }
    
    public Map<String, Object> checkMigrationStatus() {
        Path legacyDir = Paths.get(LEGACY_DIRECTORY);
        boolean legacyExists = Files.exists(legacyDir);
        
        int legacyFileCount = 0;
        if (legacyExists) {
            try (Stream<Path> files = Files.list(legacyDir)) {
                legacyFileCount = (int) files.filter(path -> path.toString().endsWith(".note")).count();
            } catch (IOException e) {
                // Ignore
            }
        }
        
        List<Note> currentNotes = noteService.getAllNotes("PixelAdventurer");
        
        return Map.of(
            "legacyDirectoryExists", legacyExists,
            "legacyNoteCount", legacyFileCount,
            "currentNoteCount", currentNotes.size(),
            "migrationNeeded", legacyExists && legacyFileCount > 0
        );
    }
}
