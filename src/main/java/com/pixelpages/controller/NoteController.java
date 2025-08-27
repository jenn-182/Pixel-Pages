package com.pixelpages.controller;

import com.pixelpages.model.Note;
import com.pixelpages.service.NoteService;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000") 
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        try {
            List<Note> notes = noteService.getAllNotes();
            return ResponseEntity.ok(notes);
        } catch (IOException e) {
            System.err.println("Error getting all notes: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Note> getNoteByFilename(@PathVariable String filename) {
        try {
            return noteService.getNoteById(filename)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            System.err.println("Error getting note by filename: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        try {
            Note createdNote = noteService.createNote(note);
            return ResponseEntity.ok(createdNote);
        } catch (IOException e) {
            System.err.println("Error creating note: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{filename}")
    public ResponseEntity<Note> updateNote(@PathVariable String filename, @RequestBody Note note) {
        try {
            System.out.println("Updating note with filename: " + filename); // Debug log
            System.out.println("Note data: " + note.toString()); // Debug log
            
            // Ensure the note has the filename set
            note.setFilename(filename);
            
            Note updatedNote = noteService.updateNote(filename, note);
            return ResponseEntity.ok(updatedNote);
        } catch (IOException e) {
            System.err.println("Error updating note: " + e.getMessage());
            e.printStackTrace(); // Print full stack trace for debugging
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            System.err.println("Unexpected error updating note: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> deleteNote(@PathVariable String filename) {
        try {
            boolean deleted = noteService.deleteNote(filename);
            return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (IOException e) {
            System.err.println("Error deleting note: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(@RequestParam String query) {
        try {
            List<Note> results = noteService.searchNotes(query);
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            System.err.println("Error searching notes: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
