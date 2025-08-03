package com.pixelpages.cli;

import com.pixelpages.io.OutputHandler;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DisplayFormatter {
    private static final int SEPARATOR_LENGTH = 62;
    
    public static void displaySection(OutputHandler output, String title, List<String> items) {
        output.displayLine(title + ":");
        output.displayLine("─".repeat(SEPARATOR_LENGTH));
        if (items.isEmpty()) {
            output.displayLine("Nothing to display yet!");
        } else {
            items.forEach(output::displayLine);
        }
        output.displayLine("─".repeat(SEPARATOR_LENGTH));
        output.displayLine("");
    }
    
    public static void displayProgressBar(OutputHandler output, int completed, int total) {
        double percentage = (completed / (double) total) * 100;
        output.displayLine(String.format("PROGRESS: %d/%d (%.1f%%)", completed, total, percentage));
    }
    
    public static void displayEasterEggs(OutputHandler output, List<EasterEggDetector.EasterEgg> eggs) {
        if (eggs.isEmpty()) {
            output.displayLine("No easter eggs found... yet! Keep writing and secrets will emerge!");
            output.displayLine("Try writing at weird hours, using coding terms, or creating palindromes!");
            return;
        }
        
        Map<String, List<EasterEggDetector.EasterEgg>> rarityGroups = eggs.stream()
            .collect(Collectors.groupingBy(EasterEggDetector.EasterEgg::getRarity));
        
        for (String rarity : GameUtilities.RARITY_ORDER) {
            List<EasterEggDetector.EasterEgg> rarityEggs = rarityGroups.get(rarity);
            if (rarityEggs != null && !rarityEggs.isEmpty()) {
                output.displayLine(rarity + " DISCOVERIES:");
                output.displayLine("─".repeat(60));
                for (EasterEggDetector.EasterEgg egg : rarityEggs) {
                    output.displayLine(egg.getName());
                    output.displayLine("   " + egg.getDescription());
                    output.displayLine("   Rarity: " + egg.getRarity());
                }
                output.displayLine("");
            }
        }
        
        output.displayLine("═".repeat(SEPARATOR_LENGTH));
        output.displayLine(String.format("TOTAL EASTER EGGS DISCOVERED: %d", eggs.size()));
    }
    
    public static void displayAchievementSection(OutputHandler output, String title, List<String> achievements, boolean completed) {
        output.displayLine(title + ":");
        output.displayLine("─".repeat(SEPARATOR_LENGTH));
        
        if (achievements.isEmpty()) {
            String message = completed ? "All achievements unlocked! You are a true legend!" 
                                       : "No achievements completed yet! Start your quest to unlock them!";
            output.displayLine(message);
        } else {
            String prefix = completed ? "[COMPLETED] " : "[PENDING] ";
            for (String achievement : achievements) {
                output.displayLine(prefix + achievement);
            }
        }
        
        output.displayLine("─".repeat(SEPARATOR_LENGTH));
        output.displayLine("");
    }
    
    public static void displayProgressSummary(OutputHandler output, int completed, int total) {
        output.displayLine("ACHIEVEMENT SUMMARY:");
        output.displayLine("═".repeat(SEPARATOR_LENGTH));
        output.displayLine(String.format("ACHIEVEMENTS UNLOCKED: %d / %d", completed, total));
        
        double progressPercentage = (completed / (double) total) * 100;
        output.displayLine(String.format("COMPLETION RATE: %.1f%%", progressPercentage));
        output.displayLine("═".repeat(SEPARATOR_LENGTH));
        output.displayLine("");
        
        // Display motivational message
        if (progressPercentage == 100.0) {
            output.displayLine("LEGENDARY STATUS: You've mastered everything! You are the ultimate adventurer!");
        } else if (progressPercentage >= 80.0) {
            output.displayLine("Almost there! Just a few more achievements to unlock!");
        } else if (progressPercentage >= 50.0) {
            output.displayLine("Halfway to legendary status! Keep pushing forward!");
        } else {
            output.displayLine("Your adventure has just begun! Keep logging and exploring!");
        }
    }
}