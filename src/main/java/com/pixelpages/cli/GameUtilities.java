package com.pixelpages.cli;

import com.pixelpages.model.Note;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class GameUtilities {
    // Constants
    public static final String[] RANKS = {
        "NOOB ADVENTURER", "SEASONED QUESTER", "MASTER CHRONICLER", 
        "LEGENDARY NOTE LORD", "ULTIMATE GRAND MASTER"
    };
    
    public static final int[] RANK_THRESHOLDS = {5, 20, 50, 100};
    
    public static final String[] RARITY_ORDER = {
        "LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON"
    };
    
    public static final String[] PROGRAMMING_TERMS = {
        "hello world", "null pointer", "stack overflow", "recursion",
        "infinite loop", "syntax error", "debug", "compile"
    };
    
    // Utility Methods
    public static String getUserRank(List<Note> notes) {
        int totalNotes = notes.size();
        for (int i = 0; i < RANK_THRESHOLDS.length; i++) {
            if (totalNotes < RANK_THRESHOLDS[i]) {
                return RANKS[i];
            }
        }
        return RANKS[RANKS.length - 1];
    }
    
    public static String getNextGoal(List<Note> notes) {
        int totalNotes = notes.size();
        if (totalNotes < 5) return "Complete 5 logs to rank up to Seasoned Quester!";
        if (totalNotes < 20) return "Create 20 logs to become a Master Chronicler!";
        if (totalNotes < 50) return "Create 50 logs to ascend to Legendary Note Lord!";
        if (totalNotes < 100) return "Create 100 logs to become the Ultimate Grand Master!";
        return "You've reached maximum level! Now you just flex on everyone!";
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
        if (daysActive == 0) return "Complete more quests to calculate!";

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
