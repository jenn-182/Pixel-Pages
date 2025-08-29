package com.pixelpages.service;

import com.pixelpages.model.Note;
import com.pixelpages.model.Player;
import com.pixelpages.model.Folder;
import com.pixelpages.model.Notebook;
import com.pixelpages.repository.FolderRepository;
import com.pixelpages.repository.NotebookRepository;
import com.pixelpages.service.FileExportService;
import com.pixelpages.service.AchievementService;
import com.pixelpages.repository.NoteRepository;
import com.pixelpages.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;

@Service
@Transactional
public class NoteService {
    
    private final NoteRepository noteRepository;
    private final PlayerRepository playerRepository;
    private final FolderRepository folderRepository;
    private final NotebookRepository notebookRepository;
    private final FileExportService fileExportService;
    private final AchievementService achievementService;
    
    public NoteService(NoteRepository noteRepository, 
                      PlayerRepository playerRepository,
                      FolderRepository folderRepository,
                      NotebookRepository notebookRepository,
                      FileExportService fileExportService,
                      AchievementService achievementService) {
        this.noteRepository = noteRepository;
        this.playerRepository = playerRepository;
        this.folderRepository = folderRepository;
        this.notebookRepository = notebookRepository;
        this.fileExportService = fileExportService;
        this.achievementService = achievementService;
    }
    
    // Helper method to calculate word count
    private int calculateWordCount(String content) {
        if (content == null || content.trim().isEmpty()) {
            return 0;
        }
        return content.trim().split("\\s+").length;
    }
    
    // Helper method to parse tags from string
    private List<String> parseTags(String tagsString) {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return Arrays.asList();
        }
        return Arrays.asList(tagsString.split(","));
    }
    
    // Helper method to join tags to string
    private String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "";
        }
        return String.join(",", tags);
    }
    
    // =============================================================================
    // CREATE METHODS
    // =============================================================================
    
    // Simple create note (for legacy compatibility)
    public Note createNote(String title, String content, String username) {
        return createNote(title, content, "#4ADE80", null, username, null, null);
    }
    
    // Main create note method (with all parameters)
    @Transactional
    public Note createNote(String title, String content, String color, List<String> tags, 
                          String username, Long folderId, Long notebookId) {
        try {
            Note note = new Note();
            note.setTitle(title);
            note.setContent(content);
            note.setUsername(username);
            note.setColor(color != null ? color : "#4ADE80");
            
            // Convert tags list to string
            if (tags != null && !tags.isEmpty()) {
                note.setTagsString(String.join(",", tags));
            }
            
            note.setFolderId(folderId);
            note.setNotebookId(notebookId);
            
            // Generate filename from title
            if (title != null) {
                String filename = title.replaceAll("[^a-zA-Z0-9\\s]", "")
                                  .replaceAll("\\s+", "_")
                                  .toLowerCase() + ".md";
                note.setFilename(filename);
            }
            
            Note savedNote = noteRepository.save(note);
            System.out.println("Note saved successfully: " + savedNote.getId());
            
            // File export (safe with try-catch)
            try {
                if (fileExportService != null) {
                    fileExportService.exportNote(savedNote);
                }
            } catch (Exception e) {
                System.err.println("File export failed (but note saved): " + e.getMessage());
            }
            
            // XP system (safe with try-catch)
            try {
                awardExperienceForNote(savedNote, username, true);
            } catch (Exception e) {
                System.err.println("XP award failed (but note saved): " + e.getMessage());
            }
            
            // TEST ACHIEVEMENT SYSTEM - Let's debug this step by step
            System.out.println("=== TESTING ACHIEVEMENT SYSTEM ===");
            try {
                System.out.println("Step 1: Getting player for username: " + username);
                Player player = getOrCreatePlayer(username);
                System.out.println("Step 1 SUCCESS: Player found/created: " + player.getUsername());
                
                System.out.println("Step 2: Getting all notes for user: " + username);
                List<Note> allNotes = getAllNotes(username);
                System.out.println("Step 2 SUCCESS: Found " + allNotes.size() + " notes");
                
                System.out.println("Step 3: Checking achievements...");
                if (achievementService != null) {
                    achievementService.checkAndUnlockAchievements(username, allNotes, player);
                    System.out.println("Step 3 SUCCESS: Achievement check completed");
                } else {
                    System.out.println("Step 3 SKIPPED: AchievementService is null");
                }
                
                System.out.println("=== ACHIEVEMENT SYSTEM TEST COMPLETED ===");
                
            } catch (Exception e) {
                System.err.println("=== ACHIEVEMENT SYSTEM ERROR ===");
                System.err.println("Error at step: " + e.getMessage());
                System.err.println("Stack trace:");
                e.printStackTrace();
                System.err.println("=== END ACHIEVEMENT ERROR ===");
                
                // Don't throw - let the note creation succeed
                System.out.println("Achievement system failed, but note was saved successfully");
            }
            
            return savedNote;
            
        } catch (Exception e) {
            System.err.println("Note creation failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    // =============================================================================
    // UPDATE METHODS (CONSOLIDATED)
    // =============================================================================
    
    // Main update method (matches your controller's UpdateNoteRequest)
    @Transactional
    public Note updateNote(Long id, String title, String content, String tags, String color, Long folderId, Long notebookId) {
        try {
            Optional<Note> optionalNote = noteRepository.findById(id);
            if (optionalNote.isPresent()) {
                Note note = optionalNote.get();
                
                // Track old word count for XP calculation
                int oldWordCount = calculateWordCount(note.getContent());
                
                // Update all fields
                if (title != null) note.setTitle(title);
                if (content != null) note.setContent(content);
                if (tags != null) note.setTagsString(tags); // Use setTagsString for String input
                if (color != null) note.setColor(color);
                note.setFolderId(folderId); // Allow null to remove from folder
                note.setNotebookId(notebookId); // Allow null to remove from notebook
                
                // Update timestamp
                note.setUpdatedAt(java.time.LocalDateTime.now());
                
                // Save the note
                Note updatedNote = noteRepository.save(note);
                System.out.println("Note updated successfully: " + updatedNote.getId());
                
                // File export (safe with try-catch)
                try {
                    if (fileExportService != null) {
                        fileExportService.exportNote(updatedNote);
                    }
                } catch (Exception e) {
                    System.err.println("File export failed (but note updated): " + e.getMessage());
                }
                
                // Award XP for additional words (safe with try-catch)
                try {
                    int newWordCount = calculateWordCount(content != null ? content : note.getContent());
                    if (newWordCount > oldWordCount) {
                        awardExperienceForWordIncrease(newWordCount - oldWordCount, note.getUsername());
                    }
                } catch (Exception e) {
                    System.err.println("XP award failed (but note updated): " + e.getMessage());
                }
                
                return updatedNote;
            } else {
                throw new RuntimeException("Note not found with ID: " + id);
            }
        } catch (Exception e) {
            System.err.println("Note update failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    // Update with List<String> tags (for backward compatibility)
    public Note updateNoteWithTags(Long id, String title, String content, List<String> tags) {
        return updateNote(id, title, content, joinTags(tags), null, null, null);
    }
    
    // Simple update (for legacy compatibility)
    public Note updateNote(Long id, String title, String content) {
        return updateNote(id, title, content, null, null, null, null);
    }
    
    // =============================================================================
    // READ METHODS
    // =============================================================================
    
    // Get all notes for user
    public List<Note> getAllNotes(String username) {
        return noteRepository.findByUsernameOrderByUpdatedAtDesc(username);
    }
    
    // Get note by ID
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }
    
    // Search notes
    public List<Note> searchNotes(String username, String searchTerm) {
        return noteRepository.searchByUsernameAndKeyword(username, searchTerm);
    }
    
    // Get notes in a specific folder
    public List<Note> getNotesInFolder(Long folderId, String username) {
        if (folderId == null) {
            return noteRepository.findByUsernameAndFolderIdIsNullAndNotebookIdIsNull(username);
        }
        return noteRepository.findByUsernameAndFolderId(username, folderId);
    }

    // Get notes in a specific notebook
    public List<Note> getNotesInNotebook(Long notebookId, String username) {
        return noteRepository.findByUsernameAndNotebookId(username, notebookId);
    }
    
    // =============================================================================
    // DELETE METHODS
    // =============================================================================
    
    // Delete note
    public void deleteNote(Long id) {
        Optional<Note> noteOpt = noteRepository.findById(id);
        if (noteOpt.isPresent()) {
            Note note = noteOpt.get();
            
            // Delete file first
            if (fileExportService != null) {
                fileExportService.deleteNoteFile(note);
            }
            
            // Then delete from database
            noteRepository.deleteById(id);
        }
    }
    
    // =============================================================================
    // ORGANIZATION METHODS
    // =============================================================================
    
    // Move note to folder
    public Note moveNoteToFolder(Long noteId, Long folderId, String username) {
        Optional<Note> optionalNote = noteRepository.findByIdAndUsername(noteId, username);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setFolderId(folderId);
            note.setNotebookId(null); // Remove from notebook
            
            return noteRepository.save(note);
        }
        throw new RuntimeException("Note not found");
    }

    // Move note to notebook
    public Note moveNoteToNotebook(Long noteId, Long notebookId, String username) {
        Optional<Note> optionalNote = noteRepository.findByIdAndUsername(noteId, username);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setNotebookId(notebookId);
            
            // Get the notebook's folder and inherit it
            if (notebookId != null) {
                Optional<Notebook> notebook = notebookRepository.findById(notebookId);
                if (notebook.isPresent()) {
                    note.setFolderId(notebook.get().getFolderId());
                }
            }
            
            return noteRepository.save(note);
        }
        throw new RuntimeException("Note not found");
    }
    
    // =============================================================================
    // PLAYER & XP METHODS
    // =============================================================================
    
    // Get or create player
    public Player getOrCreatePlayer(String username) {
        return playerRepository.findByUsername(username)
            .orElseGet(() -> {
                Player player = new Player(username);
                player.setAvatarUrl("https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=200&h=200&fit=crop&crop=face");
                return playerRepository.save(player);
            });
    }
    
    // Get player stats
    public Map<String, Object> getPlayerStats(String username) {
        Player player = getOrCreatePlayer(username);
        List<Note> notes = getAllNotes(username);
        
        // Calculate total words and tags
        int totalWords = 0;
        int totalTags = 0;
        
        for (Note note : notes) {
            totalWords += calculateWordCount(note.getContent());
            totalTags += parseTags(note.getTagsString()).size();
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("player", player);
        stats.put("totalNotes", notes.size());
        stats.put("totalWords", totalWords);
        stats.put("totalTags", totalTags);
        
        return stats;
    }
    
    // Award experience for note creation/editing
    private void awardExperienceForNote(Note note, String username, boolean isNewNote) {
        Player player = getOrCreatePlayer(username);
        
        int xpGain = 0;
        
        if (isNewNote) {
            xpGain += 10; // Base XP for creating a note
        }
        
        // XP for content (1 XP per 10 words)
        xpGain += calculateWordCount(note.getContent()) / 10;
        
        // XP for tags (5 XP per tag)
        xpGain += parseTags(note.getTagsString()).size() * 5;
        
        // Apply XP gain
        player.setExperience(player.getExperience() + xpGain);
        player.updateLevelFromExperience();
        
        playerRepository.save(player);
        
        System.out.println("Awarded " + xpGain + " XP to " + username + " (Total: " + player.getExperience() + ", Level: " + player.getLevel() + ")");
    }
    
    private void awardExperienceForWordIncrease(int additionalWords, String username) {
        Player player = getOrCreatePlayer(username);
        
        int xpGain = additionalWords / 10; // 1 XP per 10 additional words
        
        if (xpGain > 0) {
            player.setExperience(player.getExperience() + xpGain);
            player.updateLevelFromExperience();
            playerRepository.save(player);
            
            System.out.println("Awarded " + xpGain + " XP for additional content to " + username);
        }
    }
}