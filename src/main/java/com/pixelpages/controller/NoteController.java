package com.pixelpages.controller;

import com.pixelpages.model.Note;
import com.pixelpages.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus; 
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Arrays;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // Get all notes for user
    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000") // ✅ ADD THIS
    public List<Note> getAllNotes(@RequestParam(defaultValue = "Jroc_182") String username) {
        return noteService.getAllNotes(username);
    }

    // Get note by ID
    @GetMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000") // ✅ ADD THIS  
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);
        return note.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // CREATE NOTE - This matches your NoteService method
    @PostMapping("/create")
    @CrossOrigin(origins = "http://localhost:3000") // ✅ ADD CORS
    public ResponseEntity<?> createNote(@RequestBody CreateNoteRequest request) {
        try {
            System.out.println("=== CREATE NOTE DEBUG ===");
            System.out.println("Request: " + request.toString());
            
            // Convert tags array to comma-separated string for service
            String tagsString = null;
            if (request.getTags() != null && !request.getTags().isEmpty()) {
                tagsString = String.join(",", request.getTags());
            }
            
            Note note = noteService.createNote(
                request.getTitle(),
                request.getContent(),
                request.getColor(),
                tagsString, // ✅ Pass converted string, not List<String>
                request.getUsername() != null ? request.getUsername() : "user",
                request.getFolderId(),
                request.getNotebookId()
            );
            
            System.out.println("Note created successfully: " + note.getId());
            System.out.println("=== END DEBUG ===");
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            System.err.println("=== ERROR CREATING NOTE ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END ERROR ===");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "Error creating note: " + e.getMessage()
            );
        }
    }

    // CREATE NOTE - Basic POST endpoint (matches frontend expectation)
    @PostMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Note> createNote(@RequestBody CreateNoteRequest request, 
                                     @RequestParam(defaultValue = "Jroc_182") String username) {
        try {
            System.out.println("📝 Creating note: " + request.getTitle() + " for user: " + username);
            
            String tagsString = request.getTags() != null ? 
                String.join(",", request.getTags()) : "";
                
            Note createdNote = noteService.createNote(
                request.getTitle(),
                request.getContent(),
                request.getColor(),
                tagsString,
                username,
                request.getFolderId(),
                request.getNotebookId()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
        } catch (Exception e) {
            System.err.println("Error creating note: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // UPDATE NOTE
    @PutMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000") // ✅ ADD THIS
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody UpdateNoteRequest request) {
        try {
            System.out.println("=== UPDATE NOTE DEBUG ===");
            System.out.println("Note ID: " + id);
            System.out.println("Request: " + request.toString());
            
            // Convert List<String> tags to comma-separated string
            String tagsString = null;
            if (request.getTags() != null && !request.getTags().isEmpty()) {
                tagsString = String.join(",", request.getTags());
            }
            
            Note note = noteService.updateNote(
                id,
                request.getTitle(),
                request.getContent(),
                tagsString, 
                request.getColor(),
                request.getFolderId(),
                request.getNotebookId()
            );
            
            System.out.println("Controller: Note updated successfully: " + note.getId());
            System.out.println("=== END UPDATE DEBUG ===");
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            System.err.println("=== UPDATE ERROR ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END UPDATE ERROR ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE NOTE
    @DeleteMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000") // ✅ ADD THIS
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        try {
            noteService.deleteNote(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // SEARCH NOTES
    @GetMapping("/search")
    public List<Note> searchNotes(
            @RequestParam String query,
            @RequestParam(defaultValue = "Jroc_182") String username) {
        return noteService.searchNotes(username, query);
    }

    // Get notes in folder
    @GetMapping("/folder/{folderId}")
    public List<Note> getNotesInFolder(@PathVariable Long folderId, 
                                      @RequestParam(defaultValue = "Jroc_182") String username) {
        return noteService.getNotesInFolder(folderId, username);
    }

    // Get notes in notebook
    @GetMapping("/notebook/{notebookId}")
    public List<Note> getNotesInNotebook(@PathVariable Long notebookId,
                                        @RequestParam(defaultValue = "Jroc_182") String username) {
        return noteService.getNotesInNotebook(notebookId, username);
    }

    // EXPORT SINGLE NOTE
    @GetMapping("/{id}/export")
    public ResponseEntity<String> exportNote(@PathVariable Long id) {
        try {
            System.out.println("=== EXPORT NOTE DEBUG ===");
            System.out.println("Exporting note ID: " + id);
            
            Optional<Note> noteOpt = noteService.getNoteById(id);
            if (noteOpt.isPresent()) {
                Note note = noteOpt.get();
                
                // Create markdown content
                StringBuilder markdown = new StringBuilder();
                markdown.append("# ").append(note.getTitle()).append("\n\n");
                markdown.append("**Created:** ").append(note.getCreatedAt()).append("\n");
                markdown.append("**Updated:** ").append(note.getUpdatedAt()).append("\n");
                
                if (note.getTagsString() != null && !note.getTagsString().isEmpty()) {
                    markdown.append("**Tags:** ").append(note.getTagsString()).append("\n");
                }
                
                if (note.getColor() != null) {
                    markdown.append("**Color:** ").append(note.getColor()).append("\n");
                }
                
                markdown.append("\n---\n\n");
                markdown.append(note.getContent());
                
                // Create safe filename
                String filename = note.getTitle()
                    .replaceAll("[^a-zA-Z0-9\\s]", "")
                    .replaceAll("\\s+", "_")
                    .toLowerCase() + ".md";
                
                System.out.println("Export successful: " + filename);
                System.out.println("=== END EXPORT DEBUG ===");
                
                return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .header("Content-Type", "text/markdown; charset=utf-8")
                    .body(markdown.toString());
            } else {
                System.err.println("Note not found for export: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("=== EXPORT ERROR ===");
            System.err.println("Export error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END EXPORT ERROR ===");
            return ResponseEntity.status(500).body("Export failed: " + e.getMessage());
        }
    }

    // EXPORT ALL NOTES FOR USER
    @GetMapping("/export/all")
    public ResponseEntity<String> exportAllNotes(@RequestParam(defaultValue = "Jroc_182") String username) {
        try {
            System.out.println("=== EXPORT ALL NOTES DEBUG ===");
            System.out.println("Exporting all notes for user: " + username);
            
            List<Note> notes = noteService.getAllNotes(username);
            
            if (notes.isEmpty()) {
                return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"no_notes.md\"")
                    .header("Content-Type", "text/markdown; charset=utf-8")
                    .body("# No Notes Found\n\nYou don't have any notes to export yet.");
            }
            
            StringBuilder allNotes = new StringBuilder();
            allNotes.append("# All Notes Export\n\n");
            allNotes.append("**Export Date:** ").append(java.time.LocalDateTime.now()).append("\n");
            allNotes.append("**Total Notes:** ").append(notes.size()).append("\n\n");
            allNotes.append("---\n\n");
            
            for (Note note : notes) {
                allNotes.append("## ").append(note.getTitle()).append("\n\n");
                allNotes.append("**Created:** ").append(note.getCreatedAt()).append("\n");
                allNotes.append("**Updated:** ").append(note.getUpdatedAt()).append("\n");
                
                if (note.getTagsString() != null && !note.getTagsString().isEmpty()) {
                    allNotes.append("**Tags:** ").append(note.getTagsString()).append("\n");
                }
                
                if (note.getColor() != null) {
                    allNotes.append("**Color:** ").append(note.getColor()).append("\n");
                }
                
                allNotes.append("\n").append(note.getContent()).append("\n\n");
                allNotes.append("---\n\n");
            }
            
            String filename = "all_notes_" + username + "_" + 
                java.time.LocalDateTime.now().toString().replaceAll("[^a-zA-Z0-9]", "_") + ".md";
            
            System.out.println("Export all successful: " + notes.size() + " notes exported");
            System.out.println("=== END EXPORT ALL DEBUG ===");
            
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                .header("Content-Type", "text/markdown; charset=utf-8")
                .body(allNotes.toString());
                
        } catch (Exception e) {
            System.err.println("=== EXPORT ALL ERROR ===");
            System.err.println("Export all error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== END EXPORT ALL ERROR ===");
            return ResponseEntity.status(500).body("Export failed: " + e.getMessage());
        }
    }

    // Request DTOs
    public static class CreateNoteRequest {
        private String title;
        private String content;
        private String color;
        
        // ✅ Make tags flexible to handle both string and array
        @JsonProperty("tags")
        private Object tagsRaw; // Can be String or List<String>
        
        private String username;
        private Long folderId;
        private Long notebookId;

        // ✅ Smart getter that handles both formats
        public List<String> getTags() {
            if (tagsRaw == null) {
                return new ArrayList<>();
            }
            
            if (tagsRaw instanceof List) {
                return (List<String>) tagsRaw;
            }
            
            if (tagsRaw instanceof String) {
                String tagsString = (String) tagsRaw;
                if (tagsString.trim().isEmpty()) {
                    return new ArrayList<>();
                }
                return Arrays.asList(tagsString.split(","));
            }
            
            return new ArrayList<>();
        }

        public void setTags(Object tags) {
            this.tagsRaw = tags;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }


        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public Long getFolderId() { return folderId; }
        public void setFolderId(Long folderId) { this.folderId = folderId; }

        public Long getNotebookId() { return notebookId; }
        public void setNotebookId(Long notebookId) { this.notebookId = notebookId; }

        @Override
        public String toString() {
            return "CreateNoteRequest{" +
                    "title='" + title + '\'' +
                    ", content='" + (content != null ? content.substring(0, Math.min(50, content.length())) + "..." : null) + '\'' +
                    ", tags=" + tagsRaw +
                    ", color='" + color + '\'' +
                    ", username='" + username + '\'' +
                    ", folderId=" + folderId +
                    ", notebookId=" + notebookId +
                    '}';
        }
    }

    public static class UpdateNoteRequest {
        private String title;
        private String content;
        private List<String> tags; // ✅ Change from String to List<String>
        private String color;
        private Long folderId;
        private Long notebookId;

        // Getters and setters
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public Long getFolderId() { return folderId; }
        public void setFolderId(Long folderId) { this.folderId = folderId; }

        public Long getNotebookId() { return notebookId; }
        public void setNotebookId(Long notebookId) { this.notebookId = notebookId; }

        // Add toString for debugging
        @Override
        public String toString() {
            return "UpdateNoteRequest{" +
                    "title='" + title + '\'' +
                    ", content='" + (content != null ? content.substring(0, Math.min(50, content.length())) + "..." : null) + '\'' +
                    ", tags=" + tags + 
                    ", color='" + color + '\'' +
                    ", folderId=" + folderId +
                    ", notebookId=" + notebookId +
                    '}';
        }
    }
}