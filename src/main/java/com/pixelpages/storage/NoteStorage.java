package com.pixelpages.storage;

import com.pixelpages.model.Note;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class NoteStorage {

    private String notesDirectory;
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public NoteStorage(String notesDirectory) {
        
        this.notesDirectory = notesDirectory;
        
        //ensure the notes directory exists
        try {
            Files.createDirectories(Paths.get(notesDirectory));
        } catch (IOException e) {
            System.err.println("Failed to create notes directory: " + e.getMessage());
        }
    }


    public void saveNote(Note note, String filename) throws IOException {
        
        // Generate the full path for the note file
        Path filePath = Paths.get(notesDirectory, filename);

        //always update modified timestamp when saving 
        note.updateModifiedTimestamp();

        //Build Yammal Header
        StringBuilder yamlHeader = new StringBuilder();
        yamlHeader.append("---\n");
        yamlHeader.append("title: ").append(note.getTitle()).append("\n");
        yamlHeader.append("created: ").append(note.getCreated().format(ISO_FORMATTER)).append("\n");
        yamlHeader.append("modified: ").append(note.getModified().format(ISO_FORMATTER)).append("\n");
        if (!note.getTags().isEmpty()) {
            yamlHeader.append("tags: [").append(String.join(", ", note.getTags())).append("]\n");
        }
        // Add more fields here if needed 
        yamlHeader.append("---\n\n");

        // Write the YAML header and content to the file
        // Use Files.writeString to write the content to the file
        // This will overwrite the file if it already exists
        String fileContent = yamlHeader.toString() + note.getContent();
        Files.writeString(filePath, fileContent);


        // //simple format
        // String contentToSave = note.getTitle() + "\n" +
        //                        "----------------------------------------\n\n" + // A simple separator
        //                        note.getContent();
        // // Write the note content to the file                       
        // Files.writeString(filePath, contentToSave);
    }


    public Note readNote(String filename) throws IOException {
        
        // Check if the file exists
        Path filePath = Paths.get(notesDirectory, filename);
        
        // If the file does not exist, throw an exception
        if (!Files.exists(filePath)) {
            throw new IOException("Note file does not exist: " + filename);
        }
        
        String fullContent = Files.readString(filePath);

        // Check for YAML header delimiter
        if (fullContent.startsWith("---")) {
            int firstDelimiterEnd = fullContent.indexOf("\n---", 3); // Find the second "---"
            if (firstDelimiterEnd != -1) {
                String yamlSection = fullContent.substring(3, firstDelimiterEnd).trim(); // Content between "---" and "---"
                String noteContent = fullContent.substring(firstDelimiterEnd + 4).trim(); // Content after the second "---"

                // Simple YAML parsing
                String title = "";
                LocalDateTime created = LocalDateTime.MIN; // Default value
                LocalDateTime modified = LocalDateTime.MIN; // Default value
                List<String> tags = new ArrayList<>();

                // Split the YAML section into lines and parse key-value pairs
                String[] yamlLines = yamlSection.split("\n");
                for (String line : yamlLines) {
                    line = line.trim();

                    // Parse each line based on the expected format
                    if (line.startsWith("title:")) {
                        title = line.substring("title:".length()).trim();
                    } else if (line.startsWith("created:")) {
                        try {
                            created = LocalDateTime.parse(line.substring("created:".length()).trim(), ISO_FORMATTER);
                        } catch (java.time.format.DateTimeParseException e) {
                            System.err.println("Warning: Could not parse created timestamp in " + filename + ": " + e.getMessage());
                        }
                    } else if (line.startsWith("modified:")) {
                        try {
                            modified = LocalDateTime.parse(line.substring("modified:".length()).trim(), ISO_FORMATTER);
                        } catch (java.time.format.DateTimeParseException e) {
                            System.err.println("Warning: Could not parse modified timestamp in " + filename + ": " + e.getMessage());
                        }
                    } else if (line.startsWith("tags:")) {
                        String tagsString = line.substring("tags:".length()).trim();
                        if (tagsString.startsWith("[") && tagsString.endsWith("]")) {
                            tagsString = tagsString.substring(1, tagsString.length() - 1);
                            tags = Arrays.stream(tagsString.split(","))
                                         .map(String::trim)
                                         .filter(s -> !s.isEmpty())
                                         .collect(Collectors.toList());
                        }
                    }
                }

                // Create and return the Note object with parsed metadata
                return new Note(title, noteContent, created, modified, tags);

            } else {
                // If no closing delimiter, treat as legacy format
                System.err.println("Warning: Missing closing YAML delimiter in " + filename + ". Treating as legacy format.");
                return readLegacyNote(fullContent);
            }
        } else {
            // Legacy format
            return readLegacyNote(fullContent);
        }
    }

    // Reads a note in legacy format (without YAML header)
    // This method assumes the first line is the title and the rest is the content
    private Note readLegacyNote(String content) {
        List<String> lines = content.lines().collect(Collectors.toList());
        if (lines.isEmpty()) {
            return new Note("Untitled (Legacy)", "",new ArrayList<>()); // Return a default note if empty
        }
        // The first line is the title, the rest is the content
        String title = lines.get(0).trim();
        String noteContent = lines.stream()
                .skip(3) // Skip title and separator lines
                .collect(Collectors.joining("\n"));
        return new Note(title, noteContent, new ArrayList<>()); // No tags or timestamps for legacy
    }

    public String generateUniqueFilename(String title) {
        
        // Generate a base name from the title, replacing spaces and special characters
        String baseName = title.toLowerCase().replaceAll("[^a-z0-9]", "-"); // Simple slugify
        if (baseName.isEmpty()) {
            baseName = "untitled";
        }

        // Ensure the base name is unique by appending a counter if necessary
        String filename = baseName + ".note";
        int counter = 0;
        Path filePath = Paths.get(notesDirectory, filename);

        // Check if the file already exists and increment the counter
        while (Files.exists(filePath)) {
            counter++;
            filename = baseName + "-" + counter + ".note";
            filePath = Paths.get(notesDirectory, filename);
        }

        // Return the unique filename
        return filename;
    }

    public List<Note> listAllNotes()  {
        
        // Get all note files in the directory
        // Use Files.walk to traverse the directory and filter for .note files
        // Return a list of Note objects created from the files
        try (Stream<Path> paths = Files.walk(Paths.get(notesDirectory))) {
            return paths
                .filter(Files::isRegularFile)
                .filter(p -> p.toString().endsWith(".note") || p.toString().endsWith(".txt"))
                .map(p -> {
                    try {
                       // Read the note from the file
                        return readNote(p.getFileName().toString());
                    } catch (IOException e) {
                        System.err.println("Warning: Could not read " + p.getFileName() + ": " + e.getMessage());
                        return null; // Return null for unreadable files
                    }
                })
                .filter(note -> note != null) // Remove nulls from the list
                .collect(Collectors.toList());
        } catch (IOException e) {
            System.err.println("Error listing notes: " + e.getMessage());
            return Collections.emptyList(); // Return an empty list on error
        }
    }

    //Helper method to get the actual filename of a note
    //Temporary until we include dilename in the Note object itself
    public String getFilenameForNote(Note targetNote) {
        // Generate a filename based on the note's title
        List<Path> allNoteFiles = getNoteFiles(); // Reload all notes to find the matching filename
        for (Path filePath : allNoteFiles) {
            String filename = filePath.getFileName().toString();
            try {
                Note storedNote = readNote(filename);
                // Check if the stored note matches the target note by title and created timestamp
                // This assumes that the title and created timestamp are sufficient to identify a note uniquely
                if (storedNote.getTitle().equals(targetNote.getTitle()) && storedNote.getCreated().equals(targetNote.getCreated())) {
                    return filename;
                }
            } catch (IOException e) {
                // Ignore errors reading files for this lookup
            }
        }
        return null; // Note not found
    }


    public List<Path> getNoteFiles() {
        try (Stream<Path> paths = Files.walk(Paths.get(notesDirectory))) {
            return paths
                .filter(Files::isRegularFile)
                .filter(p -> p.toString().endsWith(".note") || p.toString().endsWith(".txt"))
                .collect(Collectors.toList());
        } catch (IOException e) {
            System.err.println("Error retrieving note files: " + e.getMessage());
            return Collections.emptyList(); // Return an empty list on error
        }
    }
}