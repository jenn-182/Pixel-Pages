package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

import java.awt.Desktop;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class TextEditorHandler {
    
    private final NoteStorage noteStorage;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;

    public TextEditorHandler(NoteStorage noteStorage, InputHandler inputHandler, OutputHandler outputHandler) {
        this.noteStorage = noteStorage;
        this.inputHandler = inputHandler;
        this.outputHandler = outputHandler;
    }

    public void createNoteWithEditor() throws IOException {
        outputHandler.clear();
        outputHandler.displayCreateHeader();
        
        // Create temporary file with template
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path tempFile = Files.createTempFile(tempDir, "pixelpages_", ".txt");
        
        // Create template content
        String template = createNoteTemplate();
        Files.write(tempFile, template.getBytes());
        
        outputHandler.displayLine("\nOpening default text editor...");
        outputHandler.displayLine("Edit your note in the text editor");
        outputHandler.displayLine("Save and close the editor when finished");
        outputHandler.displayLine("");
        outputHandler.displayLine("File location: " + tempFile.toString());
        outputHandler.displayLine("");
        
        try {
            // Open with Mac default text editor
            Desktop.getDesktop().open(tempFile.toFile());
            
            
            outputHandler.displayLine("Press Enter when you've finished editing and saved the file...");
            inputHandler.readLine();
            
            // Parse the edited content and save
            if (parseAndSaveEditorNote(tempFile)) {
                outputHandler.displayLine("");
                outputHandler.showSuccess("Your quest log has been saved to the digital realm!");
            }
            
        } catch (Exception e) {
            outputHandler.showError("Failed to open text editor: " + e.getMessage());
            outputHandler.displayLine("Text editor functionality requires macOS with a default text editor configured.");
            throw new IOException("Text editor not available", e);
        } finally {
            
            try {
                Files.deleteIfExists(tempFile);
            } catch (Exception e) {
               
            }
        }
    }

   //create template
    private String createNoteTemplate() {
        return """
# ===== PIXEL PAGES NOTE TEMPLATE =====
# Instructions: Replace the content below, save the file, and close your editor

TITLE: Your Note Title Here

TAGS: work, personal, important
(comma-separated tags for organizing your note)

CONTENT:
Write your note here...

# You can add multiple paragraphs, lists, or anything you like.

Remember to save this file when you're done!

# ===== END OF TEMPLATE =====
""";
    }


    private boolean parseAndSaveEditorNote(Path filePath) throws IOException {
        List<String> lines = Files.readAllLines(filePath);
        
        String title = "";
        String tags = "";
        StringBuilder content = new StringBuilder();
        boolean inContent = false;
        
        for (String line : lines) {
            // Skip comment lines and empty lines at the start
            if (line.trim().startsWith("#") || (line.trim().isEmpty() && title.isEmpty())) {
                continue;
            }
            
            // Parse title
            if (line.startsWith("TITLE:") && title.isEmpty()) {
                title = line.substring("TITLE:".length()).trim();
                continue;
            }
            
            // Parse tags
            if (line.startsWith("TAGS:") && tags.isEmpty()) {
                tags = line.substring("TAGS:".length()).trim();
                continue;
            }
            
            // Start content section
            if (line.equals("CONTENT:")) {
                inContent = true;
                continue;
            }
            
            // Add content lines
            if (inContent && !line.trim().startsWith("#")) {
                content.append(line).append("\n");
            }
        }
        
        // Validate required fields
        if (title.isEmpty() || title.equals("Your Note Title Here")) {
            outputHandler.showError("No valid title found! Note not saved.");
            outputHandler.displayLine("Make sure to replace 'Your Note Title Here' with an actual title.");
            return false;
        }
        
        // Create and save the note
        String finalContent = content.toString().trim();
        if (finalContent.isEmpty()) {
            outputHandler.showWarning("Note has no content, but saving anyway...");
        }
        
        Note newNote = new Note(title, finalContent);
        
        // Add tags if provided
        if (!tags.isEmpty() && !tags.equals("work, personal, important")) {
            List<String> tagList = parseTags(tags);
            newNote.setTags(tagList);
        }
        
        String filename = noteStorage.generateUniqueFilename(title);
        noteStorage.saveNote(newNote, filename);
        
        // Show success message
        outputHandler.displayLine(" Note '" + title + "' has been saved!");
        if (!newNote.getTags().isEmpty()) {
            outputHandler.displayLine("Tags: " + String.join(", ", newNote.getTags()));
        }
        
        return true;
    }

    private List<String> parseTags(String tagsInput) {
        return Arrays.stream(tagsInput.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Handles editing an existing note using the Mac default text editor
     */
    public void editNoteWithEditor(Note existingNote, String filename) throws IOException {
        outputHandler.clear();
        outputHandler.displayLine("UPGRADING NOTE: " + existingNote.getTitle());
        outputHandler.displayLine("═".repeat(50));
        
        // Create temporary file with existing note content
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path tempFile = Files.createTempFile(tempDir, "pixelpages_edit_", ".txt");
        
        // Create template with existing note data
        String template = createEditTemplate(existingNote);
        Files.write(tempFile, template.getBytes());
        
        outputHandler.displayLine("\nOpening Mac default text editor...");
        outputHandler.displayLine("Your existing note is loaded for editing");
        outputHandler.displayLine("Save and close the editor when finished");
        outputHandler.displayLine("");
        outputHandler.displayLine("File location: " + tempFile.toString());
        outputHandler.displayLine("");
        
        try {
            // Open with Mac default text editor
            Desktop.getDesktop().open(tempFile.toFile());
            
            // Wait for user confirmation
            outputHandler.displayLine("Press Enter when you've finished editing and saved the file...");
            inputHandler.readLine();
            
            // Parse the edited content and update
            if (parseAndUpdateNote(tempFile, existingNote, filename)) {
                outputHandler.displayLine("");
                outputHandler.showSuccess("Your note has been successfully upgraded!");
            }
            
        } catch (Exception e) {
            outputHandler.showError("Failed to open text editor: " + e.getMessage());
            outputHandler.displayLine("Text editor functionality requires macOS with a default text editor configured.");
            throw new IOException("Text editor not available", e);
        } finally {

            try {
                Files.deleteIfExists(tempFile);
            } catch (Exception e) {
            }
        }
    }


    private String createEditTemplate(Note note) {
        String tagsString = note.getTags().isEmpty() ? 
            "work, personal, important" : 
            String.join(", ", note.getTags());
        
        return String.format("""
# ===== PIXEL PAGES NOTE EDITOR =====
# Instructions: Edit the content below, save the file, and close your editor

TITLE: %s

TAGS: %s
(comma-separated tags for organizing your note)

CONTENT:
%s

# ===== END OF TEMPLATE =====
""", note.getTitle(), tagsString, note.getContent());
    }


    private boolean parseAndUpdateNote(Path filePath, Note existingNote, String filename) throws IOException {
        List<String> lines = Files.readAllLines(filePath);
        
        String title = "";
        String tags = "";
        StringBuilder content = new StringBuilder();
        boolean inContent = false;
        
        for (String line : lines) {
            // Skip comment lines and empty lines at the start
            if (line.trim().startsWith("#") || (line.trim().isEmpty() && title.isEmpty())) {
                continue;
            }
            
            // Parse title
            if (line.startsWith("TITLE:") && title.isEmpty()) {
                title = line.substring("TITLE:".length()).trim();
                continue;
            }
            
            // Parse tags
            if (line.startsWith("TAGS:") && tags.isEmpty()) {
                tags = line.substring("TAGS:".length()).trim();
                continue;
            }
            
            // Start content section
            if (line.equals("CONTENT:")) {
                inContent = true;
                continue;
            }
            
            // Add content lines
            if (inContent && !line.trim().startsWith("#")) {
                content.append(line).append("\n");
            }
        }
        
        // Validate required fields
        if (title.isEmpty()) {
            outputHandler.showError("No valid title found! Note not updated.");
            return false;
        }
        
        // Update the existing note
        existingNote.setTitle(title);
        existingNote.setContent(content.toString().trim());
        existingNote.setUpdatedAt(LocalDateTime.now()); // Fixed method name
        
        // Update tags if provided
        if (!tags.isEmpty() && !tags.equals("work, personal, important")) {
            List<String> tagList = parseTags(tags);
            existingNote.setTags(tagList);
        }
        
        // Save the updated note
        noteStorage.saveNote(existingNote, filename);
        
        // Show success message
        outputHandler.displayLine(" Note '" + title + "' has been updated!");
        if (!existingNote.getTags().isEmpty()) {
            outputHandler.displayLine(" Tags: " + String.join(", ", existingNote.getTags()));
        }
        outputHandler.displayLine(" Last modified: " + existingNote.getUpdatedAt().format(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))); // Fixed method name
        
        return true;
    }
}