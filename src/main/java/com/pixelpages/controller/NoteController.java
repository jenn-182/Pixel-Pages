package com.pixelpages.controller;

import com.pixelpages.model.Note;
import com.pixelpages.model.Player;
import com.pixelpages.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {
    
    private final NoteService noteService;
    
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }
    
    // Get all notes
    @GetMapping("/notes")
    public List<Note> getAllNotes(@RequestParam(defaultValue = "PixelAdventurer") String username) {
        return noteService.getAllNotes(username);
    }
    
    // Get specific note
    @GetMapping("/notes/{id}")
    public ResponseEntity<Note> getNote(@PathVariable Long id) {
        return noteService.getNoteById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Create note
    @PostMapping("/notes")
    public ResponseEntity<Map<String, Object>> createNote(
            @RequestBody Map<String, Object> request,
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        String title = (String) request.get("title");
        String content = (String) request.get("content");
        
        Note note = noteService.createNote(title, content, username);
        
        // Handle tags if provided
        if (request.containsKey("tags")) {
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) request.get("tags");
            note = noteService.updateNoteWithTags(note.getId(), note.getTitle(), note.getContent(), tags);
        }
        
        String message = "Quest scroll '" + title + "' has been inscribed in the digital archives! +" + 
                        note.getWordCount() + " XP earned!";
        
        return ResponseEntity.ok(createGamingResponse("CREATE_NOTE", note, message));
    }
    
    // UPDATE: Fixed update method with gaming response
    @PutMapping("/notes/{id}")
    public ResponseEntity<Map<String, Object>> updateNote(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            String title = (String) request.get("title");
            String content = (String) request.get("content");
            
            Note updated;
            
            // Handle tags if provided
            if (request.containsKey("tags")) {
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) request.get("tags");
                updated = noteService.updateNoteWithTags(id, title, content, tags);
            } else {
                updated = noteService.updateNote(id, title, content);
            }
            
            String message = "Quest scroll '" + updated.getTitle() + "' has been updated! Wisdom preserved!";
            return ResponseEntity.ok(createGamingResponse("UPDATE_NOTE", updated, message));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(createGamingResponse("UPDATE_ERROR", null, "Quest scroll not found in the archives!"));
        }
    }
    
    // UPDATE: Fixed delete method with gaming response
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long id) {
        try {
            noteService.deleteNote(id);
            String message = "Quest scroll has been banished to the void! Archives updated.";
            return ResponseEntity.ok(createGamingResponse("DELETE_NOTE", null, message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createGamingResponse("DELETE_ERROR", null, "Quest scroll not found for banishment!"));
        }
    }
    
    // UPDATE: Fixed search with gaming response and dual parameter support
    @GetMapping("/notes/search")
    public ResponseEntity<Map<String, Object>> searchNotes(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        String searchTerm = q != null ? q : query;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(createGamingResponse("SEARCH_ERROR", null, "Quest search requires a keyword!"));
        }
        
        List<Note> results = noteService.searchNotes(username, searchTerm);
        String message = "Quest search discovered " + results.size() + " scrolls containing '" + searchTerm + "'!";
        
        return ResponseEntity.ok(createGamingResponse("SEARCH_NOTES", results, message));
    }
    
    // Get player
    @GetMapping("/player")
    public Player getPlayer(@RequestParam(defaultValue = "PixelAdventurer") String username) {
        return noteService.getOrCreatePlayer(username);
    }
    
    // Get player stats
    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam(defaultValue = "PixelAdventurer") String username) {
        return noteService.getPlayerStats(username);
    }
    
    // Get all tags with counts
    @GetMapping("/tags")
    public ResponseEntity<Map<String, Object>> getAllTags(@RequestParam(defaultValue = "PixelAdventurer") String username) {
        List<Note> notes = noteService.getAllNotes(username);
        Set<String> allTags = notes.stream()
            .flatMap(note -> note.getTags().stream())
            .collect(Collectors.toSet());
        
        Map<String, Long> tagCounts = notes.stream()
            .flatMap(note -> note.getTags().stream())
            .collect(Collectors.groupingBy(
                tag -> tag,
                Collectors.counting()
            ));
        
        String message = "Discovered " + allTags.size() + " unique quest markers in your archives!";
        
        Map<String, Object> tagData = Map.of(
            "tags", allTags,
            "tagCounts", tagCounts,
            "totalUniqueTags", allTags.size()
        );
        
        return ResponseEntity.ok(createGamingResponse("GET_TAGS", tagData, message));
    }
    
    // Get notes by tag
    @GetMapping("/notes/by-tag/{tag}")
    public ResponseEntity<Map<String, Object>> getNotesByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        
        List<Note> notes = noteService.getAllNotes(username);
        List<Note> taggedNotes = notes.stream()
            .filter(note -> note.getTags().contains(tag))
            .collect(Collectors.toList());
        
        String message = "Found " + taggedNotes.size() + " quest scrolls marked with '" + tag + "'!";
        
        return ResponseEntity.ok(createGamingResponse("FILTER_BY_TAG", taggedNotes, message));
    }
    
    // Helper method for gaming responses
    private Map<String, Object> createGamingResponse(String action, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("action", action);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}