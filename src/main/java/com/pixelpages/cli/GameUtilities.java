package com.pixelpages.cli;

import com.pixelpages.model.Note;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class GameUtilities {
    // Constants
    // public static final String[] RANKS = {
    //     "NOOB ADVENTURER", "SEASONED QUESTER", "MASTER CHRONICLER", 
    //     "LEGENDARY NOTE LORD", "ULTIMATE GRAND MASTER"
    // };
    
    public static final int[] RANK_THRESHOLDS = {5, 20, 50, 100};
    
    public static final String[] RARITY_ORDER = {
        "LEGENDARY", "RARE", "UNCOMMON", "COMMON"
    };
    
    public static final String[] PROGRAMMING_TERMS = {
        "hello world", "null pointer", "stack overflow", "recursion",
        "infinite loop", "syntax error", "debug", "compile"
    };
    
    // Utility Methods
    public static String getUserRank(List<Note> allNotes) {
        // Calculate XP and level using the same logic as NewFeatureHandler
        int totalXP = calculateTotalXP(allNotes);
        int level = calculateLevelFromXP(totalXP);
        
        return getRankNameForLevel(level);
    }

    private static int calculateTotalXP(List<Note> notes) {
        int totalXP = 0;
        
        for (Note note : notes) {
            // Base XP per note
            totalXP += 10;
            
            // Bonus XP for content length
            int wordCount = note.getContent().split("\\s+").length;
            totalXP += Math.min(wordCount / 10, 50);
            
            // Bonus XP for using tags
            totalXP += note.getTags().size() * 5;
            
            // Bonus XP for longer titles
            if (note.getTitle().length() > 20) {
                totalXP += 5;
            }
        }
        
        return totalXP;
    }

    private static int calculateLevelFromXP(int totalXP) {
        return (int) (Math.sqrt(totalXP / 50.0)) + 1;
    }

    private static String getRankNameForLevel(int level) {
        return switch (level) {
            case 1 -> "Novice Scribe (Lvl 1)";
            case 2 -> "Apprentice Writer (Lvl 2)";
            case 3 -> "Skilled Chronicler (Lvl 3)";
            case 4 -> "Expert Documentarian (Lvl 4)";
            case 5 -> "Master Archivist (Lvl 5)";
            case 6 -> "Elite Wordsmith (Lvl 6)";
            case 7 -> "Distinguished Author (Lvl 7)";
            case 8 -> "Legendary Scribe (Lvl 8)";
            case 9 -> "Mythical Chronicler (Lvl 9)";
            case 10 -> "Grandmaster of Words (Lvl 10)";
            default -> level < 15 ? "Ascended Writer (Lvl " + level + ")" 
                                  : "Transcendent Scribe (Lvl " + level + ")";
        };
    }

    public static String getNextGoal(List<Note> allNotes) {
        int totalXP = calculateTotalXP(allNotes);
        int currentLevel = calculateLevelFromXP(totalXP);
        int nextLevelXP = (int) (Math.pow(currentLevel, 2) * 50);
        int xpNeeded = nextLevelXP - totalXP;
        
        String nextRankName = getRankNameForLevel(currentLevel + 1);
        return "Reach " + nextRankName + " (need " + xpNeeded + " more XP)";
    }
    
    public static long calculateDaysActive(List<Note> notes) {
        if (notes.isEmpty()) return 0;
        LocalDateTime firstNote = notes.stream()
            .map(Note::getCreated)
            .min(LocalDateTime::compareTo)
            .orElse(LocalDateTime.now());
        return ChronoUnit.DAYS.between(firstNote, LocalDateTime.now());
    }
    
    public static long countNotesMatching(List<Note> notes, java.util.function.Predicate<Note> condition) {
        return notes.stream().filter(condition).count();
    }
    
    public static String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return "untitled_note";
        }
        
        String sanitized = fileName.trim()
                .replaceAll("[\\\\/:*?\"<>|]", "_")
                .replaceAll("\\s+", "_")
                .replaceAll("_{2,}", "_")
                .toLowerCase();
        
        sanitized = sanitized.replaceAll("^_+|_+$", "");
        
        if (sanitized.isEmpty()) {
            sanitized = "untitled_note";
        }
        
        if (sanitized.length() > 50) {
            sanitized = sanitized.substring(0, 50);
        }
        
        return sanitized;
    }
    
    public static String findMostUsedWord(List<Note> notes) {
        Map<String, Integer> wordCount = new HashMap<>();
        Set<String> commonWords = Set.of("the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by");

        for (Note note : notes) {
            String[] words = note.getContent().toLowerCase().split("\\W+");
            for (String word : words) {
                if (word.length() > 3 && !commonWords.contains(word)) {
                    wordCount.merge(word, 1, Integer::sum);
                }
            }
        }

        return wordCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("mystery");
    }
    
    public static int countWordUsage(List<Note> notes, String targetWord) {
        int count = 0;
        for (Note note : notes) {
            String[] words = note.getContent().toLowerCase().split("\\W+");
            for (String word : words) {
                if (word.equals(targetWord.toLowerCase())) {
                    count++;
                }
            }
        }
        return count;
    }
    
    public static String findBusiestMonth(List<Note> notes) {
        Map<String, Long> monthCounts = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreated().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.counting()));

        return monthCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
    }
    
    public static String calculateTimeToGoal(List<Note> notes, int goal) {
        if (notes.size() >= goal) {
            return "ALREADY ACHIEVED!";
        }

        long daysActive = calculateDaysActive(notes);
        if (daysActive == 0) return "Complete more notes to calculate!";

        double questsPerDay = notes.size() / (double) daysActive;
        long daysToGoal = (long) Math.ceil((goal - notes.size()) / questsPerDay);

        if (daysToGoal < 30) {
            return daysToGoal + " days";
        } else if (daysToGoal < 365) {
            return (daysToGoal / 30) + " months";
        } else {
            return (daysToGoal / 365) + " years";
        }
    }
    
    public static String truncate(String text, int maxLength) {
        return text.length() > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
    }
}
