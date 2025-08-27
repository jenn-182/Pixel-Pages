// src/main/java/com/pixelpages/controller/PlayerController.java
package com.pixelpages.controller;

import com.pixelpages.service.NoteService;
import com.pixelpages.cli.NewFeatureHandler;
import com.pixelpages.cli.EasterEggDetector;
import org.springframework.http.ResponseEntity;
import com.pixelpages.model.Note;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/player")
@CrossOrigin(origins = "http://localhost:3000")
public class PlayerController {
    private final NoteService noteService;

    public PlayerController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlayerStats() {
        try {
            List<Note> notes = noteService.getAllNotes();
            Map<String, Object> stats = new HashMap<>();
            
            // Calculate stats similar to NewFeatureHandler
            int totalNotes = notes.size();
            int totalXP = calculateXP(notes);
            int level = calculateLevel(totalXP);
            int totalTags = notes.stream().mapToInt(note -> note.getTags().size()).sum();
            
            stats.put("totalNotes", totalNotes);
            stats.put("totalXP", totalXP);
            stats.put("level", level);
            stats.put("totalTags", totalTags);
            stats.put("rank", getUserRank(totalXP));
            
            return ResponseEntity.ok(stats);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<EasterEggDetector.EasterEgg>> getAchievements() {
        try {
            List<Note> notes = noteService.getAllNotes();
            List<EasterEggDetector.EasterEgg> achievements = EasterEggDetector.findEasterEggs(notes);
            return ResponseEntity.ok(achievements);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper methods from NewFeatureHandler
    private int calculateXP(List<Note> notes) {
        // Implementation from your NewFeatureHandler
        int baseXP = notes.size() * 10;
        int contentXP = notes.stream().mapToInt(note -> 
            Math.min(note.getContent().split("\\s+").length / 10, 50)).sum();
        int tagXP = notes.stream().mapToInt(note -> note.getTags().size() * 5).sum();
        int titleXP = (int) notes.stream()
            .filter(note -> note.getTitle().length() > 20)
            .count() * 5;
        return baseXP + contentXP + tagXP + titleXP;
    }

    private int calculateLevel(int totalXP) {
        return (int) Math.floor(Math.sqrt(totalXP / 100.0)) + 1;
    }

    private String getUserRank(int totalXP) {
        // Implementation from your NewFeatureHandler
        if (totalXP >= 2000) return "LEGENDARY CHRONICLER";
        if (totalXP >= 1500) return "MASTER ARCHIVIST";
        if (totalXP >= 1000) return "VETERAN SCRIBE";
        if (totalXP >= 500) return "SKILLED WRITER";
        if (totalXP >= 200) return "APPRENTICE NOTER";
        return "ROOKIE SCRIBBLER";
    }
}