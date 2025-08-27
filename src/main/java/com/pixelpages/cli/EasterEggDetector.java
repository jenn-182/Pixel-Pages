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

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        public String getRarity() {
            return rarity;
        }
    }

    public static List<EasterEgg> findEasterEggs(List<Note> notes) {
        Set<String> foundNames = new HashSet<>();
        List<EasterEgg> eggs = new ArrayList<>();

        addUniqueEggs(eggs, foundNames, findTimePatterns(notes));
        addUniqueEggs(eggs, foundNames, findContentPatterns(notes));
        addUniqueEggs(eggs, foundNames, findBehaviorPatterns(notes));
        addUniqueEggs(eggs, foundNames, findProgrammingReferences(notes));
        addUniqueEggs(eggs, foundNames, findSequentialPatterns(notes));
        addUniqueEggs(eggs, foundNames, findPatterns(notes));
        addUniqueEggs(eggs, foundNames, findLegendaryPatterns(notes));

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
            int hour = note.getCreatedAt().getHour();
            return hour >= 22 || hour <= 5;
        });

        if (nightNotes >= 5) {
            eggs.add(new EasterEgg("NIGHT OWL",
                    "You've written " + nightNotes + " notes between 10 PM and 5 AM! Do you even sleep?", "COMMON"));
        }

        // Weekend warrior detection
        long weekendNotes = GameUtilities.countNotesMatching(notes, note -> {
            int dayOfWeek = note.getCreatedAt().getDayOfWeek().getValue();
            return dayOfWeek == 6 || dayOfWeek == 7;
        });

        if (weekendNotes >= 20) {
            eggs.add(new EasterEgg("WEEKEND WRITER",
                    "You've completed " + weekendNotes
                            + " notes created on weekends! You're productive even on your off days.",
                    "UNCOMMON"));
        }

        long earlyNotes = GameUtilities.countNotesMatching(notes, note -> {
            int hour = note.getCreatedAt().getHour();
            return hour >= 5 && hour <= 7;
        });

        if (earlyNotes >= 15) {
            eggs.add(new EasterEgg("EARLY RISER",
                    earlyNotes + " notes created before 8 AM. You start your day with purpose.", "UNCOMMON"));
        }

        return eggs;
    }

    private static List<EasterEgg> findSequentialPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();

        // Time traveler detection
        Map<String, List<Note>> timeGroups = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH"))));

        boolean foundTimeTravel = timeGroups.values().stream().anyMatch(group -> group.size() >= 5);
        if (foundTimeTravel) {
            eggs.add(new EasterEgg("RAPID CREATOR",
                    "You created multiple quests in the same hour! High-speed documentation detected.",
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
                    "Note '" + palindromeExample + "' has a palindromic title! Pattern recognition skills recognized.",
                    "LEGENDARY"));
        }

        Map<Integer, Long> hourCounts = notes.stream()
                .collect(Collectors.groupingBy(
                        note -> note.getCreatedAt().getHour(),
                        Collectors.counting()));

        Optional<Map.Entry<Integer, Long>> mostActiveHour = hourCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (mostActiveHour.isPresent() && mostActiveHour.get().getValue() >= 5) {
            int hour = mostActiveHour.get().getKey();
            String timeDescription = hour < 12 ? hour + " AM" : (hour - 12) + " PM";
            if (hour == 0)
                timeDescription = "12 AM";
            if (hour == 12)
                timeDescription = "12 PM";

            eggs.add(new EasterEgg("ROUTINE MASTER",
                    "Peak writing time: " + timeDescription + " (" + mostActiveHour.get().getValue()
                            + " notes). You have established patterns.",
                    "RARE"));
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
                        firstLetters.contains("hidden") || firstLetters.contains("pages")) {
                    foundAcrostic = true;
                    acrosticExample = note.getTitle();
                }
            }
        }

        // Add eggs only once
        if (foundInception) {
            eggs.add(new EasterEgg("INCEPTION MODE",
                    "Note '" + inceptionExample + "' references its own title within the content!",
                    "RARE"));
        }

        if (foundAcrostic) {
            eggs.add(new EasterEgg("HIDDEN MESSENGER",
                    "Note '" + acrosticExample + "' contains a hidden message in its first letters!",
                    "LEGENDARY"));
        }

        return eggs;
    }

    private static List<EasterEgg> findBehaviorPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();

        long shortNotes = GameUtilities.countNotesMatching(notes, note -> note.getContent().length() < 50);
        long longNotes = GameUtilities.countNotesMatching(notes, note -> note.getContent().length() > 1000);

        if (longNotes > notes.size() * 0.7) {
            eggs.add(new EasterEgg("NOVEL WRITER",
                    "70 percent of your notes exceed 1000 characters! Do you get paid by the word?", "RARE"));
        }

        if (shortNotes > notes.size() * 0.8) {
            eggs.add(new EasterEgg("MINIMALIST MASTER",
                    "Most of your notes are under 50 characters. Brevity is your speciality!", "UNCOMMON"));
        }

        long totalTags = notes.stream().mapToLong(note -> note.getTags().size()).sum();
        if (totalTags > notes.size() * 3) {
            eggs.add(new EasterEgg("TAG COLLECTOR",
                    "High tag usage detected! Your notes average 3+ tags each.", "COMMON"));
        }

        long editedNotes = notes.stream()
                .filter(note -> !note.getCreatedAt().equals(note.getUpdatedAt()))
                .count();

        if (editedNotes > notes.size() * 0.5) {
            eggs.add(new EasterEgg("REVISIONS MASTER",
                    "Over 50% of notes have been edited. You can't make up your mind!", "UNCOMMON"));
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
            eggs.add(new EasterEgg("TECHNICAL MINDSET",
                    "Programming reference '" + foundReference + "' detected! Technical thinking patterns identified.",
                    "UNCOMMON"));
        }

        long structuredNotes = notes.stream()
                .filter(note -> {
                    String content = note.getContent();
                    return content.contains("```") || content.contains("//") ||
                            content.contains("function ") || content.contains("method ") ||
                            content.contains("class ") || content.contains("import ");
                })
                .count();

        if (structuredNotes >= 2) {
            eggs.add(new EasterEgg("CODE FORMATTER",
                    structuredNotes + " notes contain code-like formatting. Developer habits detected.",
                    "RARE"));
        }

        return eggs;
    }

    private static List<EasterEgg> findPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();

        // FIBONACCI WRITER - Check for Fibonacci word counts
        int[] fibonacci = {1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233};
        List<Integer> userWordCounts = notes.stream()
                .map(note -> note.getContent().split("\\s+").length)
                .collect(Collectors.toList());

        int fibMatches = 0;
        List<Integer> matchedFibs = new ArrayList<>();
        for (int fib : fibonacci) {
            if (userWordCounts.contains(fib)) {
                fibMatches++;
                matchedFibs.add(fib);
            }
        }

        if (fibMatches >= 4) {
            eggs.add(new EasterEgg("FIBONACCI WRITER",
                    "Your notes follow the golden ratio! " + fibMatches + " notes match Fibonacci sequence (" +
                            matchedFibs.stream().map(String::valueOf).collect(Collectors.joining(", ")) + " words).",
                    "LEGENDARY"));
        }

        // WORD WIZARD - Uses every letter of the alphabet
        String allContent = notes.stream()
                .map(note -> note.getTitle() + " " + note.getContent())
                .collect(Collectors.joining()).toLowerCase();

        Set<Character> uniqueLetters = allContent.chars()
                .filter(Character::isLetter)
                .mapToObj(c -> (char) c)
                .collect(Collectors.toSet());

        if (uniqueLetters.size() == 26) {
            eggs.add(new EasterEgg("WORD WIZARD",
                    "You've used every letter of the alphabet across all notes! Complete vocabulary mastery achieved.",
                    "UNCOMMON"));
        }

        return eggs;
    }

    private static List<EasterEgg> findLegendaryPatterns(List<Note> notes) {
        List<EasterEgg> eggs = new ArrayList<>();

        // THE MATRIX - Exactly 101 notes
        if (notes.size() == 101) {
            eggs.add(new EasterEgg("THE MATRIX",
                    "Exactly 101 notes created. You've seen through the digital veil. Welcome to the real world.",
                    "LEGENDARY"));
        }

        // BINARY PROPHET - Notes with binary content
        boolean foundBinary = false;
        String binaryExample = "";

        for (Note note : notes) {
            // Check title for binary pattern (only 1s, 0s, and spaces, minimum 8 characters)
            String cleanTitle = note.getTitle().replaceAll("[^10]", "");
            String titleWithSpaces = note.getTitle().replaceAll("[^10\\s]", "");

            // Check content for binary pattern (only 1s, 0s, and spaces, minimum 16 characters)
            String cleanContent = note.getContent().replaceAll("[^10]", "");
            String contentWithSpaces = note.getContent().replaceAll("[^10\\s]", "");

            // Binary title: at least 8 binary digits, and title is mostly binary
            boolean binaryTitle = cleanTitle.length() >= 8 &&
                    titleWithSpaces.equals(note.getTitle()) &&
                    note.getTitle().trim().length() > 0;

            // Binary content: at least 16 binary digits, and content is mostly binary
            boolean binaryContent = cleanContent.length() >= 16 &&
                    contentWithSpaces.equals(note.getContent()) &&
                    note.getContent().trim().length() > 0;

            if (binaryTitle || binaryContent) {
                foundBinary = true;
                binaryExample = note.getTitle();
                break;
            }
        }

        if (foundBinary) {
            eggs.add(new EasterEgg("BINARY PROPHET",
                    "Pure binary communication detected in note '" + binaryExample + "'! You speak the language of machines.",
                    "LEGENDARY"));
        }

        return eggs;
    }

    private static boolean isPalindrome(String str) {
        return str.equals(new StringBuilder(str).reverse().toString());
    }
}