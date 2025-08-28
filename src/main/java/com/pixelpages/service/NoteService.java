package com.pixelpages.service;

import com.pixelpages.model.Note;
import com.pixelpages.model.Player;
import com.pixelpages.repository.NoteRepository;
import com.pixelpages.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// Add this import at the top of NoteService.java
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NoteService {
    
    private final NoteRepository noteRepository;
    private final PlayerRepository playerRepository;
    private final FileExportService fileExportService;  // ADD THIS
    private final AchievementService achievementService;
    
    // Update constructor to inject FileExportService
    public NoteService(NoteRepository noteRepository, 
                      PlayerRepository playerRepository,
                      FileExportService fileExportService,
                      AchievementService achievementService) {  // ADD THIS
        this.noteRepository = noteRepository;
        this.playerRepository = playerRepository;
        this.fileExportService = fileExportService;  // ADD THIS
        this.achievementService = achievementService;
    }
    
    // Create note with XP gain
    public Note createNote(String title, String content, String username) {
        Note note = new Note(title, content);
        note.setUsername(username);
        Note savedNote = noteRepository.save(note);
        
        // ADD FILE EXPORT
        fileExportService.exportNote(savedNote);
        
        // Award XP for creating note
        awardExperienceForNote(savedNote, username, true);
        
        // FIX: Get the player before passing to achievement service
        Player player = getOrCreatePlayer(username);
        
        // Check for new achievements
        List<Note> allNotes = getAllNotes(username);
        achievementService.checkAndUnlockAchievements(username, allNotes, player);
        
        return savedNote;
    }
    
    // Update note with XP gain
    public Note updateNote(Long id, String title, String content) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));
        
        int oldWordCount = note.getWordCount();
        note.setTitle(title);
        note.setContent(content);
        int newWordCount = note.getWordCount();
        
        Note updatedNote = noteRepository.save(note);
        
        // ADD FILE EXPORT FOR UPDATES
        fileExportService.exportNote(updatedNote);
        
        // Award XP for additional words (not for editing existing content)
        if (newWordCount > oldWordCount) {
            awardExperienceForWordIncrease(newWordCount - oldWordCount, note.getUsername());
        }
        
        return updatedNote;
    }
    
    // Update note with tags
    public Note updateNoteWithTags(Long id, String title, String content, List<String> tags) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));
        
        int oldWordCount = note.getWordCount();
        note.setTitle(title);
        note.setContent(content);
        note.setTags(tags);
        int newWordCount = note.getWordCount();
        
        Note updatedNote = noteRepository.save(note);
        
        // ADD FILE EXPORT FOR TAG UPDATES
        fileExportService.exportNote(updatedNote);
        
        // Award XP for additional words
        if (newWordCount > oldWordCount) {
            awardExperienceForWordIncrease(newWordCount - oldWordCount, note.getUsername());
        }
        
        return updatedNote;
    }
    
    // Delete note
    public void deleteNote(Long id) {
        Optional<Note> noteOpt = noteRepository.findById(id);
        if (noteOpt.isPresent()) {
            Note note = noteOpt.get();
            
            // DELETE FILE FIRST
            fileExportService.deleteNoteFile(note);
            
            // THEN DELETE FROM DATABASE
            noteRepository.deleteById(id);
        }
    }
    
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
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("player", player);
        stats.put("totalNotes", notes.size());
        stats.put("totalWords", notes.stream().mapToInt(Note::getWordCount).sum());
        stats.put("totalTags", notes.stream().mapToInt(note -> note.getTags().size()).sum());
        
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
        xpGain += note.getWordCount() / 10;
        
        // XP for tags (5 XP per tag)
        xpGain += note.getTags().size() * 5;
        
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