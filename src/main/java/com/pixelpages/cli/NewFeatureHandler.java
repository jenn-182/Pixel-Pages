package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class NewFeatureHandler {

    private final NoteStorage noteStorage;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;

    private final UIRenderer ui;

    public NewFeatureHandler(NoteStorage noteStorage, InputHandler inputHandler, OutputHandler outputHandler,
            UIRenderer ui) {
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
        
        // XP System Calculations (do this first)
        int totalXP = calculateXP(allNotes);
        int currentLevel = calculateLevel(totalXP);
        int currentLevelXP = getCurrentLevelXP(totalXP, currentLevel);
        int xpNeededForLevel = getXPNeededForCurrentLevel(currentLevel);
        
        // Get rank based on XP level
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

        // Display Player Statistics (remove duplicate level display)
        outputHandler.displayLine("DETAILED PLAYER STATISTICS:");
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine(String.format("Total XP: %d", totalXP));
        outputHandler.displayLine(String.format("Total Notes Completed: %d", totalNotes));
        outputHandler.displayLine(String.format("Total Words Written: %d", totalWords));
        outputHandler.displayLine(String.format("Total Characters Typed: %d", totalCharacters));
        outputHandler.displayLine(String.format("Total Tags Used: %d", totalTags));
        outputHandler.displayLine(String.format("Days Active: %d", daysActive));
        outputHandler.displayLine(String.format("Average Words Per Log: %.1f", avgWordsPerNote));
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("");

        // XP Progress Bar
        outputHandler.displayLine("RANK PROGRESSION:");
        outputHandler.displayLine("─".repeat(62));
        
        displayXPBar(currentLevelXP, xpNeededForLevel);

        outputHandler.displayLine("");
        
        // XP Breakdown Section
        displayXPBreakdown(allNotes, totalXP);
        
        outputHandler.displayLine("─".repeat(62));
        outputHandler.displayLine("");

        // Add Random Fun Fact Section
        if (totalNotes > 0) {
            outputHandler.displayLine("");
            outputHandler.displayLine("INSIGHT:");
            outputHandler.displayLine("─".repeat(62));
            String[] funFacts = generateFunFacts(allNotes);
            Random random = new Random();
            String selectedFact = funFacts[random.nextInt(funFacts.length)];
            outputHandler.displayLine(selectedFact);
            outputHandler.displayLine("─".repeat(62));
            outputHandler.displayLine("");
        }
    }

    private void displayXPBreakdown(List<Note> allNotes, int totalXP) {
        outputHandler.displayLine("XP BREAKDOWN:");
        outputHandler.displayLine("─".repeat(62));

        // Calculate individual XP components
        int baseXP = allNotes.size() * 10;

        int contentXP = allNotes.stream().mapToInt(note -> Math.min(note.getContent().split("\\s+").length / 10, 50))
                .sum();

        int tagXP = allNotes.stream().mapToInt(note -> note.getTags().size() * 5).sum();

        int titleXP = (int) allNotes.stream()
                .filter(note -> note.getTitle().length() > 20)
                .count() * 5;

        // Display breakdown with simple numbers
        outputHandler.displayLine(String.format("Base XP (10 per note):     %4d", baseXP));
        outputHandler.displayLine(String.format("Content XP (word bonus):   %4d", contentXP));
        outputHandler.displayLine(String.format("Tag XP (5 per tag):       %4d", tagXP));
        outputHandler.displayLine(String.format("Title XP (detailed):      %4d", titleXP));
        outputHandler.displayLine("─".repeat(32));
        outputHandler.displayLine(String.format("Total XP Earned:          %4d", totalXP));
    }

    private void displayXPBar(int currentXP, int nextLevelXP) {
        int barWidth = 30;
        int filledBars = (int) ((double) currentXP / nextLevelXP * barWidth);

        outputHandler.displayLine("PROGRESS TO NEXT RANK:");
        outputHandler.displayLine("┌" + "─".repeat(barWidth + 2) + "┐");

        StringBuilder xpBar = new StringBuilder("│");
        for (int i = 0; i < barWidth; i++) {
            if (i < filledBars) {
                xpBar.append("█");
            } else if (i == filledBars && currentXP < nextLevelXP) {
                xpBar.append("▌");
            } else {
                xpBar.append("░");
            }
        }
        xpBar.append("│");

        outputHandler.displayLine(xpBar.toString());
        outputHandler.displayLine("└" + "─".repeat(barWidth + 2) + "┘");
        outputHandler.displayLine(String.format("  %d / %d XP to next rank", currentXP, nextLevelXP));
    }

    private int calculateXP(List<Note> notes) {
        int totalXP = 0;

        for (Note note : notes) {
            // Base XP per note
            totalXP += 10;

            // Bonus XP for content length
            int wordCount = note.getContent().split("\\s+").length;
            totalXP += Math.min(wordCount / 10, 50); // Max 50 bonus XP per note

            // Bonus XP for using tags
            totalXP += note.getTags().size() * 5;

            // Bonus XP for longer titles
            if (note.getTitle().length() > 20) {
                totalXP += 5;
            }
        }

        return totalXP;
    }

    private int calculateLevel(int totalXP) {
        // Each level requires more XP: Level 1 = 100 XP, Level 2 = 250 XP, etc.
        return (int) (Math.sqrt(totalXP / 50.0)) + 1;
    }

    private int getXPForNextLevel(int currentLevel) {
        // XP required for next level
        return (int) (Math.pow(currentLevel, 2) * 50);
    }

    private int getCurrentLevelXP(int totalXP, int currentLevel) {
        // XP within current level
        int previousLevelXP = currentLevel > 1 ? (int) (Math.pow(currentLevel - 1, 2) * 50) : 0;
        return totalXP - previousLevelXP;
    }

    private int getXPNeededForCurrentLevel(int currentLevel) {
        // Total XP needed to complete current level
        int nextLevelXP = getXPForNextLevel(currentLevel);
        int previousLevelXP = currentLevel > 1 ? (int) (Math.pow(currentLevel - 1, 2) * 50) : 0;
        return nextLevelXP - previousLevelXP;
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
        DisplayFormatter.displayAchievementSection(outputHandler, "COMPLETED ACHIEVEMENTS", completedAchievements,
                true);
        DisplayFormatter.displayAchievementSection(outputHandler, "PENDING ACHIEVEMENTS", pendingAchievements, false);
        DisplayFormatter.displayProgressSummary(outputHandler, completedAchievements.size(), achievements.size());
        displayProgressBar(completedAchievements.size(), achievements.size());
    }

    private void displayProgressBar(int completed, int total) {
        outputHandler.displayLine("");
        outputHandler.displayLine("PROGRESS:");
        outputHandler.displayLine("─".repeat(62));

        double percentage = total > 0 ? (double) completed / total * 100 : 0;
        int progressWidth = 40;
        int filledBars = (int) (percentage / 100 * progressWidth);

        StringBuilder progressBar = new StringBuilder();
        progressBar.append("[");

        for (int i = 0; i < progressWidth; i++) {
            progressBar.append(i < filledBars ? "█" : "░");
        }

        progressBar.append("]");

        outputHandler.displayLine(String.format("%s %d/%d (%.1f%%)",
                progressBar.toString(), completed, total, percentage));
        outputHandler.displayLine("─".repeat(62));
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
            return new String[] { "You have no notes. Time to start your collection!" };
        }

        List<String> validFacts = new ArrayList<>();

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

        // Only add facts where the number is greater than 0 (or 1 for Pokemon cards)
        if (longestNote.getContent().length() > 0) {
            validFacts.add("Your longest note '" + GameUtilities.truncate(longestNote.getTitle(), 30) + "' has "
                    + longestNote.getContent().length() + " characters!");
        }

        if (GameUtilities.countWordUsage(notes, mostUsedWord) > 0) {
            validFacts.add(
                    "You've used the word '" + mostUsedWord + "' " + GameUtilities.countWordUsage(notes, mostUsedWord)
                            + " times. You're obsessed!");
        }

        // Keep Pokemon cards fact if there's more than 1 note
        if (notes.size() > 1) {
            validFacts.add("If your notes were Pokemon cards, you'd have " + notes.size() + " in your legendary deck!");
        }

        if (totalWords > 0) {
            validFacts.add("Your total word count (" + totalWords + " words) could fill " + (totalWords / 250)
                    + " book pages!");
        }

        if (nightQuests > 0) {
            validFacts.add(
                    "You've created " + nightQuests + " notes between the hours of 10 PM and 5 AM! Do you even sleep?");
        }

        if (weekendQuests > 0) {
            validFacts.add("Weekend activity detected: " + weekendQuests + " notes created on weekends!");
        }

        if (busiestMonth != null && !busiestMonth.isEmpty()) {
            validFacts.add("Your most productive month was " + busiestMonth + " !");
        }

        // Only show time to goal if it's reasonable and there are notes
        String timeToGoal = GameUtilities.calculateTimeToGoal(notes, 1000);
        if (!timeToGoal.contains("never") && notes.size() > 0) {
            validFacts.add("At your current pace, you'll reach 1000 notes in " + timeToGoal + "!");
        }

        // Return array or fallback if no valid facts
        if (validFacts.isEmpty()) {
            return new String[] { "Start creating more notes to unlock insights!" };
        }

        return validFacts.toArray(new String[0]);
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
        achievements.put("WEEKEND WARRIOR: Write 10 notes on weekends",
                GameUtilities.countNotesMatching(notes, note -> {
                    int dayOfWeek = note.getCreated().getDayOfWeek().getValue();
                    return dayOfWeek == 6 || dayOfWeek == 7;
                }) >= 10);

        // Special Achievements
        achievements.put("DETAILED WRITER: Write a note over 1000 characters",
                notes.stream().anyMatch(note -> note.getContent().length() >= 1000));
        achievements.put("CONSISTENCY KING: Active for 30+ days", GameUtilities.calculateDaysActive(notes) >= 30);

        // Easter Egg Related Achievements
        List<EasterEggDetector.EasterEgg> foundEggs = EasterEggDetector.findEasterEggs(notes);
        achievements.put("SECRET HUNTER: Find your first easter egg", !foundEggs.isEmpty());
        achievements.put("LEGEND SEEKER: Find 5 easter eggs", foundEggs.size() >= 5);
        achievements.put("MYTHICAL EXPLORER: Find 10 easter eggs", foundEggs.size() >= 10);

        // Advanced Achievements
        achievements.put("DIVERSITY MASTER: Use 5+ tags in one note",
                notes.stream().anyMatch(note -> note.getTags().size() >= 5));
        achievements.put("MARATHON WRITER: Write 500+ words in one note",
                notes.stream().anyMatch(note -> note.getContent().split("\\s+").length >= 500));
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