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
    
    // Create note with XP gain
    public Note createNote(String title, String content, String username) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        note.setUsername(username);
        
        Note savedNote = noteRepository.save(note);
        
        // ADD FILE EXPORT
        fileExportService.exportNote(savedNote);
        
        // Award XP for creating note
        awardExperienceForNote(savedNote, username, true);
        
        // Get the player before passing to achievement service
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
        
        int oldWordCount = calculateWordCount(note.getContent());
        note.setTitle(title);
        note.setContent(content);
        int newWordCount = calculateWordCount(content);
        
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
        
        int oldWordCount = calculateWordCount(note.getContent());
        note.setTitle(title);
        note.setContent(content);
        note.setTagsString(joinTags(tags)); // Use tagsString field
        int newWordCount = calculateWordCount(content);
        
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
    
    // Move note to folder
    public Note moveNoteToFolder(Long noteId, Long folderId, String username) {
        Optional<Note> optionalNote = noteRepository.findByIdAndUsername(noteId, username);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setFolderId(folderId); // Use Long instead of entity
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
            note.setNotebookId(notebookId); // Use Long instead of entity
            
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
}