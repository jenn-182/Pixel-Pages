Date UTIL: 

package com.pixelpages.util;

// import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;
// import java.time.format.DateTimeParseException;


KEY WORDS: 
 private List<String> extractKeywords(String content, int maxKeywords) {
        // Clean and split content into words
        String cleanContent = content.toLowerCase()
                .replaceAll("[^a-zA-Z0-9\\s]", " ") // Remove punctuation
                .replaceAll("\\s+", " ") // Normalize whitespace
                .trim();

        // Common words to filter out
        Set<String> stopWords = Set.of(
                "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
                "by", "from", "as", "is", "was", "are", "were", "be", "been", "have", "has", "had",
                "do", "does", "did", "will", "would", "could", "should", "may", "might", "can",
                "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
                "my", "your", "his", "her", "its", "our", "their", "me", "him", "them", "us");

        // Count word frequencies
        Map<String, Integer> wordCount = Arrays.stream(cleanContent.split("\\s+"))
                .filter(word -> word.length() > 2) // Filter out short words
                .filter(word -> !stopWords.contains(word)) // Filter out stop words
                .filter(word -> !word.matches("\\d+")) // Filter out pure numbers
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.summingInt(w -> 1)));

        // Return top keywords sorted by frequency
        return wordCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(maxKeywords)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }













