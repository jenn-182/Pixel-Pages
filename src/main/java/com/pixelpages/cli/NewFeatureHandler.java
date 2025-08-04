package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class NewFeatureHandler {

    private final NoteStorage noteStorage;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final UIRenderer ui;

    public NewFeatureHandler(NoteStorage noteStorage, InputHandler inputHandler, OutputHandler outputHandler, UIRenderer ui) {
        this.noteStorage = noteStorage;
        this.inputHandler = inputHandler;
        this.outputHandler = outputHandler;
        this.ui = ui;
    }

    // ----------- PLAYER PROFILE AND RANKING -----------

    public void handlePlayerRanking() throws IOException {
        outputHandler.clear();
        ui.displayPlayerProfileHeader();

        List<Note> allNotes = noteStorage.listAllNotes();

        if (allNotes.isEmpty()) {
            outputHandler.displayLine("No player data found! Start forging some notes first!");
            return;
        }

        displayPlayerProfileWithRanking(allNotes);
    }

    private void displayPlayerProfileWithRanking(List<Note> allNotes) {
        int totalNotes = allNotes.size();
        String rank = GameUtilities.getUserRank(allNotes);
        String nextGoal = GameUtilities.getNextGoal(allNotes);

        outputHandler.displayLine("CURRENT RANK: " + rank);
        outputHandler.displayLine("");
        outputHandler.displayLine("NEXT GOAL: " + nextGoal);
        outputHandler.displayLine("─".repeat(62));
        outputHandler.displayLine("");

        // Calculate all the statistics using utilities
        int totalWords = allNotes.stream().mapToInt(n -> n.getContent().split("\\s+").length).sum();
        long totalTags = allNotes.stream().mapToLong(n -> n.getTags().size()).sum();
        int totalCharacters = allNotes.stream().mapToInt(n -> n.getContent().length()).sum();
        long daysActive = GameUtilities.calculateDaysActive(allNotes);
        double avgWordsPerNote = totalWords / (double) totalNotes;
        int level = Math.max(1, totalNotes / 5 + totalWords / 100);

        // Display Player Statistics
        outputHandler.displayLine("DETAILED PLAYER STATISTICS:");
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine(String.format("Player Level: %d", level));
        outputHandler.displayLine(String.format("Total Notes Completed: %d", totalNotes));
        outputHandler.displayLine(String.format("Total Words Written: %d", totalWords));
        outputHandler.displayLine(String.format("Total Characters Typed: %d", totalCharacters));
        outputHandler.displayLine(String.format("Total Tags Used: %d", totalTags));
        outputHandler.displayLine(String.format("Days Active: %d", daysActive));
        outputHandler.displayLine(String.format("Average Words Per Log: %.1f", avgWordsPerNote));
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("");

        // Add Random Fun Fact Section
        if (totalNotes > 0) {
            outputHandler.displayLine("");
            outputHandler.displayLine("INSIGHTS:");
            outputHandler.displayLine("─".repeat(62));
            String[] funFacts = generateFunFacts(allNotes);
            Random random = new Random();
            String selectedFact = funFacts[random.nextInt(funFacts.length)];
            outputHandler.displayLine(selectedFact);
            outputHandler.displayLine("─".repeat(62));
            outputHandler.displayLine("");
        }
    }

    // ----------- ACHIEVEMENTS FEATURE -----------

    public void handleAchievements() throws IOException {
        outputHandler.clear();
        ui.displayAchievementsHeader();
        outputHandler.displayLine("");

        List<Note> allNotes = noteStorage.listAllNotes();

        if (allNotes.isEmpty()) {
            outputHandler.displayLine("No achievements yet! Craft some logs first!");
            return;
        }

        showAchievementSummary(allNotes);
    }

    private void showAchievementSummary(List<Note> allNotes) {
        Map<String, Boolean> achievements = checkAchievements(allNotes);

        List<String> completedAchievements = new ArrayList<>();
        List<String> pendingAchievements = new ArrayList<>();

        for (Map.Entry<String, Boolean> entry : achievements.entrySet()) {
            if (entry.getValue()) {
                completedAchievements.add(entry.getKey());
            } else {
                pendingAchievements.add(entry.getKey());
            }
        }

        // Use DisplayFormatter for cleaner output
        DisplayFormatter.displayAchievementSection(outputHandler, "COMPLETED ACHIEVEMENTS", completedAchievements, true);
        DisplayFormatter.displayAchievementSection(outputHandler, "PENDING ACHIEVEMENTS", pendingAchievements, false);
        DisplayFormatter.displayProgressSummary(outputHandler, completedAchievements.size(), achievements.size());
    }

    // ----------- BACKUP FEATURE -----------

    public void handleBackup() throws IOException {
        outputHandler.clear();
        ui.displayBackupHeader();
        outputHandler.displayLine("");

        List<Note> allNotes = noteStorage.listAllNotes();
        if (allNotes.isEmpty()) {
            outputHandler.displayLine("No save files detected! Complete some logs first!");
            return;
        }

        String wantBackup = inputHandler.promptWithRetry(
                "Would you like to create an extra backup of your notes? (y/n): ",
                "ERROR 404: Please enter 'y' or 'n'");

        if (wantBackup == null || (!wantBackup.toLowerCase().equals("y"))) {
            outputHandler.displayLine("Backup cancelled. Your data remains unprotected... living dangerously!");
            return;
        }

        outputHandler.displayLine("");
        outputHandler.displayLine("BACKUP CONFIRMED! Proceeding with data protection protocol...");
        outputHandler.displayLine("");

        String backupChoice = inputHandler.promptWithRetry(
                "What would you like to backup?\n" +
                        "  1. ALL notes (complete vault backup)\n" +
                        "  2. SPECIFIC note (single quest backup)\n" +
                        "Enter your choice (1 or 2): ",
                "Choose 1 for all notes or 2 for a specific note... not that complicated!");

        if (backupChoice == null) {
            outputHandler.displayLine("Backup cancelled. Your quest data remains at risk!");
            return;
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));

        switch (backupChoice.trim()) {
            case "1":
                performFullBackup(allNotes, timestamp);
                break;
            case "2":
                performSpecificNoteBackup(allNotes, timestamp);
                break;
            default:
                outputHandler.displayLine("Invalid choice! Backup protocol aborted!");
                outputHandler.displayLine("Next time, choose 1 or 2... it's literally that simple!");
        }
    }

    private void performFullBackup(List<Note> allNotes, String timestamp) throws IOException {
        String backupDirName = "full_backup_" + timestamp;
        Path backupDir = Paths.get(NOTES_DIRECTORY, backupDirName);

        outputHandler.displayLine("Creating complete save vault: " + backupDirName);
        outputHandler.displayLine("");
        outputHandler.displayLine("VAULT INITIALIZED!");
        outputHandler.displayLine("");

        try {
            Files.createDirectories(backupDir);
            outputHandler.displayLine("Cloning your entire quest archive...");

            List<Path> noteFiles = noteStorage.getNoteFiles();
            int backupCount = 0;

            for (Path noteFile : noteFiles) {
                Path backupFile = backupDir.resolve(noteFile.getFileName());
                Files.copy(noteFile, backupFile);
                backupCount++;

                if (backupCount % 5 == 0) {
                    outputHandler.displayLine("Backing up log " + backupCount + " of " + noteFiles.size() + "...");
                }
            }

            outputHandler.displayLine("");
            outputHandler.displayLine("FULL BACKUP ACCOMPLISHED! Your entire legacy is now immortal!");
            outputHandler.displayLine("━".repeat(62));
            outputHandler.displayLine(String.format("Save files backed up: %d logs", backupCount));
            outputHandler.displayLine(String.format("Vault location: %s", backupDir.toString()));
            outputHandler.displayLine(String.format("Backup completed: %s", LocalDateTime.now().format(DISPLAY_DATE_FORMATTER)));
            outputHandler.displayLine("━".repeat(62));
            outputHandler.displayLine("");
            outputHandler.displayLine("Sleep well knowing your adventure is safe from digital destruction!");

        } catch (IOException e) {
            outputHandler.displayLine("FULL BACKUP FAILED! The digital save gods have abandoned you!");
            outputHandler.displayLine("Error Log: " + e.getMessage());
        }
    }

    private void performSpecificNoteBackup(List<Note> allNotes, String timestamp) throws IOException {
        outputHandler.displayLine("");
        outputHandler.displayLine("AVAILABLE QUEST LOGS FOR BACKUP:");
        outputHandler.displayLine("─".repeat(62));

        for (int i = 0; i < allNotes.size(); i++) {
            Note note = allNotes.get(i);
            outputHandler.displayLine(String.format("%d. %s (Created: %s)",
                    i + 1,
                    note.getTitle(),
                    note.getCreated().format(DISPLAY_DATE_FORMATTER)));
        }

        outputHandler.displayLine("─".repeat(62));
        outputHandler.displayLine("");

        String noteChoice = inputHandler.promptWithRetry(
                "Enter the NUMBER of the quest log you want to backup: ",
                "Please enter a valid NUMBER from the list... not the title!");

        if (noteChoice == null) {
            outputHandler.displayLine("Backup cancelled. Your specific quest remains unprotected!");
            return;
        }

        Note targetNote = findNoteByNumber(allNotes, noteChoice.trim());

        if (targetNote == null) {
            outputHandler.displayLine("Quest log not found! Check your number selection!");
            outputHandler.displayLine("Backup protocol aborted!");
            return;
        }

        String backupDirName = "single_backup_" + GameUtilities.sanitizeFileName(targetNote.getTitle()) + "_" + timestamp;
        Path backupDir = Paths.get(NOTES_DIRECTORY, backupDirName);
        outputHandler.displayLine("");

        try {
            Files.createDirectories(backupDir);

            List<Path> noteFiles = noteStorage.getNoteFiles();
            Path targetFile = null;

            for (Path noteFile : noteFiles) {
                Note fileNote = noteStorage.readNote(noteFile.getFileName().toString().replace(".md", ""));
                if (fileNote != null && fileNote.getTitle().equals(targetNote.getTitle())) {
                    targetFile = noteFile;
                    break;
                }
            }

            if (targetFile != null) {
                Path backupFile = backupDir.resolve(targetFile.getFileName());
                Files.copy(targetFile, backupFile);

                outputHandler.displayLine("SPECIFIC BACKUP ACCOMPLISHED!");
                outputHandler.displayLine("━".repeat(62));
                outputHandler.displayLine(String.format("Quest backed up: %s", targetNote.getTitle()));
                outputHandler.displayLine(String.format("Vault location: %s", backupDir.toString()));
                outputHandler.displayLine(String.format("Backup completed: %s", LocalDateTime.now().format(DISPLAY_DATE_FORMATTER)));
                outputHandler.displayLine("━".repeat(62));
                outputHandler.displayLine("");
                outputHandler.displayLine("Your quest log is backed up and safe...for now!");
            } else {
                outputHandler.displayLine("Error: Could not locate the file for this quest!");
            }

        } catch (IOException e) {
            outputHandler.displayLine("SPECIFIC BACKUP FAILED! The digital save gods are not pleased!");
            outputHandler.displayLine("");
            outputHandler.displayLine("Error Log: " + e.getMessage());
        }
    }

    private Note findNoteByNumber(List<Note> notes, String input) {
        try {
            int index = Integer.parseInt(input) - 1;
            if (index >= 0 && index < notes.size()) {
                return notes.get(index);
            } else {
                outputHandler.displayLine("Invalid number! Please enter a number between 1 and " + notes.size());
                return null;
            }
        } catch (NumberFormatException e) {
            outputHandler.displayLine("Please enter a valid note NUMBER from the list above!");
            outputHandler.displayLine("Don't enter the title - just the number (1, 2, 3, etc.)");
            return null;
        }
    }

    // ----------- EASTER EGGS -----------

    public void handleEasterEggsOnly() throws IOException {
        outputHandler.clear();
        ui.displayEasterEggsHeader();
        outputHandler.displayLine("");

        List<Note> allNotes = noteStorage.listAllNotes();
        if (allNotes.isEmpty()) {
            outputHandler.displayLine("No log data to analyze!");
            return;
        }

        List<EasterEggDetector.EasterEgg> foundEggs = EasterEggDetector.findEasterEggs(allNotes);
        DisplayFormatter.displayEasterEggs(outputHandler, foundEggs);
    }

    // ----------- HELPER METHODS -----------

    private String[] generateFunFacts(List<Note> notes) {
        if (notes.isEmpty()) {
            return new String[] { "You have no quests. Time to start your adventure!" };
        }

        Note longestNote = notes.stream().max(Comparator.comparing(n -> n.getContent().length())).orElse(notes.get(0));
        String mostUsedWord = GameUtilities.findMostUsedWord(notes);
        int totalWords = notes.stream().mapToInt(n -> n.getContent().split("\\s+").length).sum();
        long nightQuests = GameUtilities.countNotesMatching(notes, note -> {
            int hour = note.getCreated().getHour();
            return hour >= 22 || hour <= 5;
        });
        long weekendQuests = GameUtilities.countNotesMatching(notes, note -> {
            int dayOfWeek = note.getCreated().getDayOfWeek().getValue();
            return dayOfWeek == 6 || dayOfWeek == 7;
        });
        String busiestMonth = GameUtilities.findBusiestMonth(notes);

        return new String[] {
                "Your longest note '" + GameUtilities.truncate(longestNote.getTitle(), 30) + "' has "
                        + longestNote.getContent().length() + " characters!",
                "You've used the word '" + mostUsedWord + "' " + GameUtilities.countWordUsage(notes, mostUsedWord)
                        + " times. You're obsessed!",
                "If your notes were Pokemon cards, you'd have " + notes.size() + " in your legendary deck!",
                "Your total word count (" + totalWords + " words) could fill " + (totalWords / 250)
                        + " book pages!",
                "You've created " + nightQuests + " notes between the hours of 10 PM and 5 AM! Do you even sleep?",
                "Weekend activity detected: " + weekendQuests + " notes created on weekends!",
                "Your most productive month was " + busiestMonth + " !",
                "At your current pace, you'll reach 1000 notes in " + GameUtilities.calculateTimeToGoal(notes, 1000) + "!",
        };
    }

    private Map<String, Boolean> checkAchievements(List<Note> notes) {
        Map<String, Boolean> achievements = new LinkedHashMap<>();

        // Basic Achievement Checks
        achievements.put("FIRST QUEST: Complete your first note", !notes.isEmpty());
        achievements.put("PROLIFIC WRITER: Complete 10 notes", notes.size() >= 10);
        achievements.put("MASTER CHRONICLER: Complete 50 notes", notes.size() >= 50);
        achievements.put("LEGENDARY SCRIBE: Complete 100 notes", notes.size() >= 100);

        // Content-based Achievements
        int totalWords = notes.stream().mapToInt(n -> n.getContent().split("\\s+").length).sum();
        achievements.put("WORDSMITH: Write 1000 total words", totalWords >= 1000);
        achievements.put("NOVELIST: Write 10,000 total words", totalWords >= 10000);

        // Tag-based Achievements
        Set<String> allTags = notes.stream()
                .flatMap(note -> note.getTags().stream())
                .collect(Collectors.toSet());
        achievements.put("ORGANIZER: Use 10 different tags", allTags.size() >= 10);
        achievements.put("TAG MASTER: Use 50 different tags", allTags.size() >= 50);

        // Time-based Achievements
        achievements.put("SPEEDRUN CHAMPION: Create 3 notes in one day", checkSpeedrun(notes));
        achievements.put("NIGHT OWL: Write 5 notes after 10 PM", GameUtilities.countNotesMatching(notes, note -> {
            int hour = note.getCreated().getHour();
            return hour >= 22 || hour <= 5;
        }) >= 5);
        achievements.put("WEEKEND WARRIOR: Write 10 notes on weekends", GameUtilities.countNotesMatching(notes, note -> {
            int dayOfWeek = note.getCreated().getDayOfWeek().getValue();
            return dayOfWeek == 6 || dayOfWeek == 7;
        }) >= 10);

        // Special Achievements
        achievements.put("DETAILED WRITER: Write a note over 1000 characters", notes.stream().anyMatch(note -> note.getContent().length() >= 1000));
        achievements.put("CONSISTENCY KING: Active for 30+ days", GameUtilities.calculateDaysActive(notes) >= 30);

        // Easter Egg Related Achievements
        List<EasterEggDetector.EasterEgg> foundEggs = EasterEggDetector.findEasterEggs(notes);
        achievements.put("SECRET HUNTER: Find your first easter egg", !foundEggs.isEmpty());
        achievements.put("LEGEND SEEKER: Find 5 easter eggs", foundEggs.size() >= 5);
        achievements.put("MYTHICAL EXPLORER: Find 10 easter eggs", foundEggs.size() >= 10);

        // Advanced Achievements
        achievements.put("DIVERSITY MASTER: Use 5+ tags in one note", notes.stream().anyMatch(note -> note.getTags().size() >= 5));
        achievements.put("MARATHON WRITER: Write 500+ words in one note", notes.stream().anyMatch(note -> note.getContent().split("\\s+").length >= 500));
        achievements.put("TIME TRAVELER: Create multiple notes in same hour", checkTimeTravel(notes));

        return achievements;
    }

    private boolean checkSpeedrun(List<Note> notes) {
        Map<String, Long> dailyCounts = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreated().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                        Collectors.counting()));
        return dailyCounts.values().stream().anyMatch(count -> count >= 3);
    }

    private boolean checkTimeTravel(List<Note> notes) {
        Map<String, Long> hourGroups = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreated().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH")),
                        Collectors.counting()));
        return hourGroups.values().stream().anyMatch(count -> count >= 3);
    }

    public String getUserRank() {
        List<Note> allNotes = noteStorage.listAllNotes();
        return GameUtilities.getUserRank(allNotes);
    }
}