package com.pixelpages.cli;

import com.pixelpages.model.Note;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class EasterEggDetector {
    
    public static class EasterEgg {
        private final String name;
        private final String description;
        private final String rarity;
        
        public EasterEgg(String name, String description, String rarity) {
            this.name = name;
            this.description = description;
            this.rarity = rarity;
        }
        
        public String getName() { return name; }
        public String getDescription() { return description; }
        public String getRarity() { return rarity; }
    }
    
    public static List<EasterEgg> findEasterEggs(List<Note> notes) {
        Set<String> foundNames = new HashSet<>();
        List<EasterEgg> eggs = new ArrayList<>();
        
        addUniqueEggs(eggs, foundNames, findTimePatterns(notes));
        addUniqueEggs(eggs, foundNames, findContentPatterns(notes));
        addUniqueEggs(eggs, foundNames, findBehaviorPatterns(notes));
        addUniqueEggs(eggs, foundNames, findProgrammingReferences(notes));
        addUniqueEggs(eggs, foundNames, findSequentialPatterns(notes));
        
        return eggs;
    }
    
    private static void addUniqueEggs(List<EasterEgg> eggs, Set<String> foundNames, List<EasterEgg> newEggs) {
        for (EasterEgg egg : newEggs) {
            if (!foundNames.contains(egg.getName())) {
                foundNames.add(egg.getName());
                eggs.add(egg);
            }
        }
    }
    
    private static List<EasterEgg> findTimePatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();
        
        // Night owl detection
        long nightNotes = GameUtilities.countNotesMatching(notes, note -> {
            int hour = note.getCreated().getHour();
            return hour >= 22 || hour <= 5;
        });
        
        if (nightNotes >= 5) {
            eggs.add(new EasterEgg("NIGHT OWL SYNDROME", 
                "You've written " + nightNotes + " quests during vampire hours! Do you even sleep?", "COMMON"));
        }
        
        // Weekend warrior detection
        long weekendNotes = GameUtilities.countNotesMatching(notes, note -> {
            int dayOfWeek = note.getCreated().getDayOfWeek().getValue();
            return dayOfWeek == 6 || dayOfWeek == 7;
        });
        
        if (weekendNotes >= 10) {
            eggs.add(new EasterEgg("WEEKEND WARRIOR", 
                "You've completed " + weekendNotes + " weekend quests! No rest for the dedicated!", "UNCOMMON"));
        }
        
        return eggs;
    }
    
    private static List<EasterEgg> findSequentialPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();
        
        // Time traveler detection
        Map<String, List<Note>> timeGroups = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreated().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH"))));

        boolean foundTimeTravel = timeGroups.values().stream().anyMatch(group -> group.size() >= 3);
        if (foundTimeTravel) {
            eggs.add(new EasterEgg("TIME TRAVELER",
                    "You created multiple quests in the same hour! Either you're super productive or caught in a time loop...",
                    "RARE"));
        }

        // Palindrome detection (only add once)
        boolean foundPalindrome = false;
        String palindromeExample = "";
        
        for (Note note : notes) {
            String cleanTitle = note.getTitle().replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            if (cleanTitle.length() > 3 && isPalindrome(cleanTitle) && !foundPalindrome) {
                foundPalindrome = true;
                palindromeExample = note.getTitle();
                break;
            }
        }
        
        if (foundPalindrome) {
            eggs.add(new EasterEgg("MIRROR MASTER", 
                "Quest '" + palindromeExample + "' is a palindrome! Your brain works in mysterious ways...", "LEGENDARY"));
        }
        
        return eggs;
    }
    
    private static List<EasterEgg> findContentPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();
        
        boolean foundInception = false;
        boolean foundAcrostic = false;
        String inceptionExample = "";
        String acrosticExample = "";

        for (Note note : notes) {
            String content = note.getContent().toLowerCase();

            // Inception mode - only add once
            if (!foundInception && content.contains(note.getTitle().toLowerCase()) && note.getTitle().length() > 5) {
                foundInception = true;
                inceptionExample = note.getTitle();
            }

            // Acrostic detection - only add once
            if (!foundAcrostic && note.getContent().split("\n").length >= 4) {
                String firstLetters = Arrays.stream(note.getContent().split("\n"))
                        .limit(10)
                        .map(line -> line.trim().isEmpty() ? "" : String.valueOf(line.charAt(0)))
                        .collect(Collectors.joining()).toLowerCase();

                if (firstLetters.contains("help") || firstLetters.contains("secret") ||
                        firstLetters.contains("hidden") || firstLetters.contains("pixelpages")) {
                    foundAcrostic = true;
                    acrosticExample = note.getTitle();
                }
            }
        }

        // Add eggs only once
        if (foundInception) {
            eggs.add(new EasterEgg("INCEPTION MODE",
                    "Quest '" + inceptionExample + "' mentions itself!",
                    "RARE"));
        }
        
        if (foundAcrostic) {
            eggs.add(new EasterEgg("ACROSTIC ARTIST",
                    "Quest '" + acrosticExample + "' has a hidden message in its first letters!",
                    "EPIC"));
        }
        
        return eggs;
    }
    
    private static List<EasterEgg> findBehaviorPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();
        
        long shortNotes = GameUtilities.countNotesMatching(notes, note -> note.getContent().length() < 50);
        long longNotes = GameUtilities.countNotesMatching(notes, note -> note.getContent().length() > 1000);
        
        if (longNotes > notes.size() * 0.7) {
            eggs.add(new EasterEgg("NOVEL WRITER", 
                "Most of your quests are novels! Do you get paid by the word?", "RARE"));
        }
        
        if (shortNotes > notes.size() * 0.8) {
            eggs.add(new EasterEgg("MINIMALIST MASTER", 
                "You're the haiku master of note-taking! Short and sweet!", "UNCOMMON"));
        }
        
        long totalTags = notes.stream().mapToLong(note -> note.getTags().size()).sum();
        if (totalTags > notes.size() * 3) {
            eggs.add(new EasterEgg("TAG COLLECTOR", 
                "You have more tags than a YouTube video! Organization level: MAXIMUM!", "COMMON"));
        }
        
        return eggs;
    }
    
    private static List<EasterEgg> findProgrammingReferences(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();
        
        // Find the first programming reference and stop
        String foundReference = null;
        
        for (String ref : GameUtilities.PROGRAMMING_TERMS) {
            long count = notes.stream()
                    .filter(note -> note.getContent().toLowerCase().contains(ref.toLowerCase()) ||
                            note.getTitle().toLowerCase().contains(ref.toLowerCase()))
                    .count();

            if (count >= 1) {
                foundReference = ref;
                break; 
            }
        }
        
        if (foundReference != null) {
            eggs.add(new EasterEgg("CODE WARRIOR",
                    "Programming reference '" + foundReference + "' detected! You live in the matrix!",
                    "UNCOMMON"));
        }
        
        return eggs;
    }
    
    private static boolean isPalindrome(String str) {
        return str.equals(new StringBuilder(str).reverse().toString());
    }
}