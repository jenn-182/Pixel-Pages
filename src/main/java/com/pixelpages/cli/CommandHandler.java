package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

import java.awt.Desktop;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class CommandHandler {
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final TextEditorHandler textEditorHandler;

    private final NoteStorage noteStorage;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;
    private final NewFeatureHandler newFeatureHandler;
    private final UIRenderer uiRenderer;

    public CommandHandler(NoteStorage noteStorage, InputHandler inputHandler, OutputHandler outputHandler,
            UIRenderer uiRenderer) {
        this.noteStorage = noteStorage;
        this.inputHandler = inputHandler;
        this.outputHandler = outputHandler;
        this.uiRenderer = uiRenderer;
        this.newFeatureHandler = new NewFeatureHandler(noteStorage, inputHandler, outputHandler, uiRenderer);
        this.textEditorHandler = new TextEditorHandler(noteStorage, inputHandler, outputHandler);
    }

    public void executeCommand(String command, String argument) throws IOException {
        switch (command) {
            case "create":
            case "craft":
                handleCreate();
                break;
            case "list":
            case "inventory":
                handleList(argument);
                break;
            case "search":
                if (argument.isEmpty()) {
                    outputHandler.showError("Please provide a search query...I'm not a mind reader!");
                } else {
                    handleSearch(argument);
                }
                break;
            case "read":
            case "openlog":
                if (argument.isEmpty()) {
                    outputHandler.showError("Please provide a filename to read...I'm not a mind reader!");
                } else {
                    handleRead(argument);
                }
                break;
            case "edit":
            case "upgrade":
                handleEdit(argument);
                break;
            case "delete":
                if (argument.isEmpty()) {
                    outputHandler.showError("Please provide a filename to delete...I'm not a mind reader!");
                } else {
                    handleDelete(argument);
                }
                break;
            case "playerprofile":
            case "stats":
                newFeatureHandler.handlePlayerRanking();
                break;
            case "achievements":
                newFeatureHandler.handleAchievements();
                break;
            case "help":
            case "tutorial":
                uiRenderer.displayHelp();
                break;
            case "exit":
            case "quit":
            case "bye":
            case "ragequit":
                outputHandler.clear();
                outputHandler.displayExitMessage();
                break;
            case "eastereggs":
            case "eggs":
            case "secret":
            case "pixel":
                newFeatureHandler.handleEasterEggsOnly();
                break;
            default:
                outputHandler.showError("What is this?: " + command);
                outputHandler.showWarning("Maybe try something that actually exists...?");
                uiRenderer.displayHelp();
        }
    }

    public void handleCreate() throws IOException {
        outputHandler.clear();
        outputHandler.displayCreateHeader();

        // Ask option
        outputHandler.displayLine("\nChoose your adventure creation method:");
        outputHandler.displayLine("\n1. Terminal Mode (type directly here)");
        outputHandler.displayLine("\n2. Text Editor Mode (opens default editor)");
        outputHandler.displayLine("");

        String choice = inputHandler.readLine("Enter your choice (1 or 2): ");

        switch (choice.trim()) {
            case "1" -> handleTerminalCreate();
            case "2" -> handleEditorCreate();
            default -> {
                outputHandler.showWarning("Invalid choice! Defaulting to terminal mode...");
                handleTerminalCreate();
            }
        }
    }

    // terminal input
    private void handleTerminalCreate() throws IOException {
        outputHandler.clear();
        outputHandler.displayCreateHeader();

        String title = inputHandler.promptWithRetry(
                "\nA wild note appeared! What will you name it?: ",
                "\nGAME OVER! All quests need titles, even side quests...");

        if (title == null) {
            outputHandler.clear();
            outputHandler.showError("GAME OVER....");
            return;
        }

        String tagsInput = inputHandler.readLine("\nHow will you sort this in your inventory? (Enter some tags): ");
        List<String> tags = parseTags(tagsInput);

        outputHandler.displayLine(
                "\nA new adventure begins! (type your note here and include 'END' when your saga is complete): ");
        outputHandler.displayLine("");
        String content = inputHandler.readMultilineUntil("END");

        Note newNote = new Note(title, content, tags);
        String filename = noteStorage.generateUniqueFilename(title);
        noteStorage.saveNote(newNote, filename);

        outputHandler.displayLine("");
        outputHandler.showSuccess("Behold! '" + title + "' now exists in digital eternity!");
    }

    // editor in terminal
    private void handleEditorCreate() throws IOException {
        try {
            textEditorHandler.createNoteWithEditor();
        } catch (IOException e) {
            outputHandler.showWarning("Text editor failed, falling back to terminal mode...");
            outputHandler.displayLine("");
            handleTerminalCreate();
        }
    }

    public void handleList(String query) throws IOException {
        outputHandler.clear();
        outputHandler.displayListHeader();

        List<Note> allNotes = noteStorage.listAllNotes();
        List<Note> notesToDisplay = allNotes;

        if (!query.isEmpty()) {
            notesToDisplay = simpleSearch(allNotes, query);
            outputHandler.displayLine("Scanning the depths of your digital consciousness for '" + query + "'...");
        }

        if (notesToDisplay.isEmpty()) {
            outputHandler.showError("");
            outputHandler.displayLine("\nThe void stares back...nothing found.");
            return;
        } else {
            outputHandler.displayLine("");
            outputHandler.displayLine("\n" + notesToDisplay.size() + " notes found!");
        }

        notesToDisplay.sort(Comparator.comparing(Note::getTitle));
        displayNotesList(notesToDisplay);
    }

    public void handleRead(String noteIdentifier) throws IOException {
        if (noteIdentifier.isEmpty()) {
            outputHandler.showError("Please provide a filename to read...I'm not a mind reader!");
            return;
        }

        Note noteToRead = null;
        String searchTerm = noteIdentifier;

        // Retry loop for finding the note to read
        while (noteToRead == null) {
            outputHandler.clear();
            outputHandler.displayReadHeader();

            Optional<NoteWithFilename> foundNote = findNoteByIdentifier(searchTerm);

            if (foundNote.isPresent()) {
                noteToRead = foundNote.get().note();

                // Display the note content
                outputHandler.displayLine("\nSearching digital archives for '" + searchTerm + "'...");
                outputHandler.displayLine("");
                displayNoteContent(noteToRead);
                return; // Successfully found and displayed note
            }

            // Note not found - show suggestions and retry options
            outputHandler.showError("Note '" + searchTerm + "' seems to have vanished into the digital void.");

            // Get all notes for suggestions
            List<Note> allNotes = noteStorage.listAllNotes();

            // Show similar notes if any
            List<Note> similarNotes = findSimilarNotes(allNotes, searchTerm);
            if (!similarNotes.isEmpty()) {
                outputHandler.displayLine("");
                outputHandler.displayLine("Did you mean one of these?");
                outputHandler.displayLine("─".repeat(40));
                for (int i = 0; i < Math.min(3, similarNotes.size()); i++) {
                    Note note = similarNotes.get(i);
                    outputHandler.displayLine(String.format("  %s", note.getTitle()));
                }
                outputHandler.displayLine("─".repeat(40));
            }

            outputHandler.displayLine("");
            outputHandler.displayLine("Options:");
            outputHandler.displayLine("\n1. Try a different search term");
            outputHandler.displayLine("\n2. List all notes to see what's available");
            outputHandler.displayLine("\n3. Cancel read operation");
            outputHandler.displayLine("");

            String choice = inputHandler.readLine("What would you like to do? (1/2/3): ");

            switch (choice.trim()) {
                case "1" -> {
                    searchTerm = inputHandler.readLine("Enter new note title or number: ");
                    if (searchTerm.trim().isEmpty()) {
                        outputHandler.showWarning("Cancelling read operation.");
                        return;
                    }
                }
                case "2" -> {
                    showNotesListForReading(allNotes);
                    searchTerm = inputHandler.readLine("Enter note number or title to read: ");
                    if (searchTerm.trim().isEmpty()) {
                        outputHandler.showWarning("Cancelling read operation.");
                        return;
                    }
                }
                case "3" -> {
                    outputHandler.displayLine("Read operation cancelled.");
                    return;
                }
                default -> {
                    outputHandler.showWarning("Invalid choice. Please try again.");
                    // Continue the loop to retry
                }
            }
        }
    }

    private Optional<NoteWithFilename> findNoteByIdentifier(String identifier) {
        try {
            List<Note> allNotes = noteStorage.listAllNotes(); 

            // Try to find by number first (1-based indexing)
            try {
                int noteIndex = Integer.parseInt(identifier) - 1;
                if (noteIndex >= 0 && noteIndex < allNotes.size()) {
                    Note note = allNotes.get(noteIndex);
                    String filename = noteStorage.generateUniqueFilename(note.getTitle());
                    return Optional.of(new NoteWithFilename(note, filename));
                }
            } catch (NumberFormatException e) {
            }

            // Search by title
            for (Note note : allNotes) {
                if (note.getTitle().toLowerCase().contains(identifier.toLowerCase())) {
                    String filename = noteStorage.generateUniqueFilename(note.getTitle());
                    return Optional.of(new NoteWithFilename(note, filename));
                }
            }

            return Optional.empty();
        } catch (IOException e) {
            // Handle the IOException
            System.err.println("Error accessing notes: " + e.getMessage());
            return Optional.empty();
        }
    }

    // Helper method specifically for reading selection (similar to edit but with
    // read context)
    private void showNotesListForReading(List<Note> allNotes) {
        outputHandler.displayLine("");
        outputHandler.displayLine("Available quest logs:");
        outputHandler.displayLine("─".repeat(60));

        if (allNotes.isEmpty()) {
            outputHandler.displayLine("No notes found in your digital archives.");
            outputHandler.displayLine("─".repeat(60));
            return;
        }

        for (int i = 0; i < allNotes.size(); i++) {
            Note note = allNotes.get(i);
            String preview = generatePreview(note.getContent());
            if (preview.length() > 35) {
                preview = preview.substring(0, 35) + "...";
            }

            outputHandler.displayLine(String.format("#%d: %s", i + 1, note.getTitle()));
            outputHandler.displayLine(String.format("Created: %s",
                    note.getCreatedAt().format(DISPLAY_DATE_FORMATTER)));
            outputHandler.displayLine(String.format("Preview: %s", preview));

            if (!note.getTags().isEmpty()) {
                outputHandler.displayLine(String.format("Tags: %s",
                        String.join(", ", note.getTags())));
            }
            outputHandler.displayLine("");
        }
        outputHandler.displayLine("─".repeat(60));
    }

    public void handleEdit(String argument) throws IOException {
        if (argument.isEmpty()) {
            outputHandler.showError("Please specify a note to edit.");
            outputHandler.displayLine("Usage: edit <note_title_or_number>");
            return;
        }

        Note noteToEdit = null;
        String filename = null;
        String searchTerm = argument;

        // Retry loop for finding the note
        while (noteToEdit == null) {
            List<Note> allNotes = noteStorage.listAllNotes();
            noteToEdit = findNoteBySearchTerm(allNotes, searchTerm);

            if (noteToEdit != null) {
                filename = noteStorage.generateUniqueFilename(noteToEdit.getTitle());
                break;
            }

            // Note not found - show suggestions and retry options
            outputHandler.showError("Note not found: " + searchTerm);

            // Show similar notes if any
            List<Note> similarNotes = findSimilarNotes(allNotes, searchTerm);
            if (!similarNotes.isEmpty()) {
                outputHandler.displayLine("");
                outputHandler.displayLine("Did you mean one of these?");
                outputHandler.displayLine("─".repeat(40));
                for (int i = 0; i < Math.min(3, similarNotes.size()); i++) {
                    Note note = similarNotes.get(i);
                    outputHandler.displayLine(String.format("  %s", note.getTitle()));
                }
                outputHandler.displayLine("─".repeat(40));
            }

            outputHandler.displayLine("");
            outputHandler.displayLine("Options:");
            outputHandler.displayLine("\n1. Try a different search term");
            outputHandler.displayLine("\n2. List all notes");
            outputHandler.displayLine("\n3. Cancel");
            outputHandler.displayLine("");

            String choice = inputHandler.readLine("What would you like to do? (1/2/3): ");

            switch (choice.trim()) {
                case "1" -> {
                    searchTerm = inputHandler.readLine("Enter new search term: ");
                    if (searchTerm.trim().isEmpty()) {
                        outputHandler.showWarning("Cancelling edit operation.");
                        return;
                    }
                }
                case "2" -> {
                    showNotesListForSelection(allNotes);
                    searchTerm = inputHandler.readLine("Enter note number or title: ");
                    if (searchTerm.trim().isEmpty()) {
                        outputHandler.showWarning("Cancelling edit operation.");
                        return;
                    }
                }
                case "3" -> {
                    outputHandler.displayLine("Edit operation cancelled.");
                    return;
                }
                default -> outputHandler.showWarning("Invalid choice. Please try again.");
            }
        }

        // Continue with edit logic...
        proceedWithEdit(noteToEdit, filename);
    }

    // Helper method to find note by search term
    private Note findNoteBySearchTerm(List<Note> allNotes, String searchTerm) {
        // Try to find by number first
        try {
            int noteIndex = Integer.parseInt(searchTerm) - 1;
            if (noteIndex >= 0 && noteIndex < allNotes.size()) {
                return allNotes.get(noteIndex);
            }
        } catch (NumberFormatException e) {
            // Try to find by title
            for (Note note : allNotes) {
                if (note.getTitle().toLowerCase().contains(searchTerm.toLowerCase())) {
                    return note;
                }
            }
        }
        return null;
    }

    // Fix your existing findSimilarNotes method (it currently returns empty list)
    private List<Note> findSimilarNotes(List<Note> allNotes, String searchTerm) {
        String lowerSearchTerm = searchTerm.toLowerCase();
        return allNotes.stream()
                .filter(note -> {
                    String lowerTitle = note.getTitle().toLowerCase();
                    // Find notes that contain any word from the search term
                    String[] searchWords = lowerSearchTerm.split("\\s+");
                    for (String word : searchWords) {
                        if (lowerTitle.contains(word) && word.length() > 2) {
                            return true;
                        }
                    }
                    return false;
                })
                .limit(5)
                .collect(Collectors.toList());
    }

    // Helper method to show notes list for selection
    private void showNotesListForSelection(List<Note> allNotes) {
        outputHandler.displayLine("");
        outputHandler.displayLine("Available notes:");
        outputHandler.displayLine("─".repeat(60));
        for (int i = 0; i < allNotes.size(); i++) {
            Note note = allNotes.get(i);
            String preview = generatePreview(note.getContent());
            if (preview.length() > 30) {
                preview = preview.substring(0, 30) + "...";
            }
            outputHandler.displayLine(String.format("#%d: %s", i + 1, note.getTitle()));
            outputHandler.displayLine(String.format("    %s", preview));
            outputHandler.displayLine("");
        }
        outputHandler.displayLine("─".repeat(60));
    }

    // Helper method to proceed with edit once note is found
    private void proceedWithEdit(Note noteToEdit, String filename) throws IOException {
        outputHandler.clear();
        outputHandler.displayLine("UPGRADING NOTE: " + noteToEdit.getTitle());
        outputHandler.displayLine("═".repeat(50));
        outputHandler.displayLine("\nChoose your upgrade method:");
        outputHandler.displayLine("\n1. Terminal Mode (edit directly here)");
        outputHandler.displayLine("\n2. Text Editor Mode (opens Mac default editor)");
        outputHandler.displayLine("");

        String choice = inputHandler.readLine("Enter your choice (1 or 2): ");

        switch (choice.trim()) {
            case "1" -> handleTerminalEdit(noteToEdit, filename);
            case "2" -> handleEditorEdit(noteToEdit, filename);
            default -> {
                outputHandler.showWarning("Invalid choice! Defaulting to terminal mode...");
                handleTerminalEdit(noteToEdit, filename);
            }
        }
    }

    // Your existing terminal edit method (rename if needed)
    private void handleTerminalEdit(Note noteToEdit, String filename) throws IOException {
        outputHandler.clear();
        outputHandler.displayLine("UPGRADING NOTE: " + noteToEdit.getTitle());
        outputHandler.displayLine("═".repeat(50));

        // Show current note details
        outputHandler.displayLine("\nCurrent Note Details:");
        outputHandler.displayLine("Title: " + noteToEdit.getTitle());
        outputHandler.displayLine("Content: " + noteToEdit.getContent());
        outputHandler.displayLine(
                "Tags: " + (noteToEdit.getTags().isEmpty() ? "None" : String.join(", ", noteToEdit.getTags())));
        outputHandler.displayLine("");

        // Get new title
        String newTitle = inputHandler.readLine("New title (press Enter to keep current): ");
        if (!newTitle.trim().isEmpty()) {
            noteToEdit.setTitle(newTitle);
        }

        // Get new content
        outputHandler
                .displayLine("\nEnter new content (type 'END' when finished, or just 'END' to keep current content):");
        String newContent = inputHandler.readMultilineUntil("END");
        if (!newContent.trim().equals("END")) {
            noteToEdit.setContent(newContent);
        }

        // Get new tags
        String newTagsInput = inputHandler.readLine("\nNew tags (comma-separated, press Enter to keep current): ");
        if (!newTagsInput.trim().isEmpty()) {
            List<String> newTags = parseTags(newTagsInput);
            noteToEdit.setTags(newTags);
        }

        // Update modification time
        noteToEdit.setUpdatedAt(java.time.LocalDateTime.now());

        // Save the updated note
        noteStorage.saveNote(noteToEdit, filename);
        outputHandler.showSuccess("Note '" + noteToEdit.getTitle() + "' has been upgraded!");
    }

    // New method for text editor edit
    private void handleEditorEdit(Note noteToEdit, String filename) throws IOException {
        try {
            textEditorHandler.editNoteWithEditor(noteToEdit, filename);
        } catch (IOException e) {
            outputHandler.showWarning("Text editor failed, falling back to terminal mode...");
            outputHandler.displayLine("");
            handleTerminalEdit(noteToEdit, filename);
        }
    }

    public void handleDelete(String noteIdentifier) throws IOException {
        outputHandler.clear();

        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        if (foundNote.isPresent()) {
            Note noteToDelete = foundNote.get().note();
            String filenameToDelete = foundNote.get().filename();

            displayDeleteWarning(noteToDelete);

            boolean firstConfirm = inputHandler
                    .confirm("This note is about to be sent to the digital void. Are you ready?");
            if (!firstConfirm) {
                outputHandler.displayLine("\n Your note is safe... for now.");
                return;
            }

            outputHandler.clear();
            uiRenderer.displayDeleteHeader();
            outputHandler.displayLine(
                    "There is no respawn available...Are you absolutely SURE you want to delete this note?!");

            outputHandler.displayLine("");
            String secondConfirmation = inputHandler.readLine("Type 'I AM SURE' if you're certain: ");

            if (!secondConfirmation.equalsIgnoreCase("I AM SURE")) {
                outputHandler.displayLine("PHEW! Your note lives on to see another day.");
                return;
            }

            performDeletion(noteToDelete, filenameToDelete);

        } else {
            outputHandler
                    .showError("Note '" + noteIdentifier + "' doesn't exist. You can't delete what you don't have!");
        }
    }

    public void handleSearch(String query) throws IOException {
        outputHandler.clear();
        outputHandler.displaySearchHeader();

        outputHandler.displayLine("");
        outputHandler.displayLine("Scanning for '" + query + "'...");

        List<Note> allNotes = noteStorage.listAllNotes();
        List<Note> results = simpleSearch(allNotes, query);

        if (results.isEmpty()) {
            outputHandler.showWarning("\nThe search turned up empty...there's no loot here.");
            outputHandler.displayLine("");
            outputHandler.showError("MISSION FAILED: Nothing found for '" + query + "'");
            return;
        } else {
            outputHandler.displayLine("");
            outputHandler.displayLine("\nFound " + results.size() + " items!");
            outputHandler.displayLine("");
        }

        displaySearchResults(results);
    }

    // Helper methods
    private List<String> parseTags(String tagsInput) {
        return Arrays.stream(tagsInput.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private void displayNotesList(List<Note> notes) {
        DisplayFormatter.displaySection(outputHandler, "QUEST LOGS",
                notes.stream()
                        .map(note -> String.format("#%d: %s (Created: %s)",
                                notes.indexOf(note) + 1,
                                note.getTitle(),
                                note.getCreatedAt().format(DISPLAY_DATE_FORMATTER)))
                        .collect(Collectors.toList()));

        for (int i = 0; i < notes.size(); i++) {
            Note note = notes.get(i);

            // Use displayHeader for each note title instead of manual formatting
            outputHandler.displayHeader("NOTE #" + (i + 1) + ": " + note.getTitle());

            outputHandler.displayLine("Created:  " + note.getCreatedAt().format(DISPLAY_DATE_FORMATTER));
            outputHandler.displayLine("Modified: " + note.getUpdatedAt().format(DISPLAY_DATE_FORMATTER));

            if (!note.getTags().isEmpty()) {
                outputHandler.displayLine("Tags:     " + String.join(", ", note.getTags()));
            }

            outputHandler.displayLine("");
            outputHandler.displayLine("PREVIEW:");
            outputHandler.displayLine("─".repeat(62));
            String preview = generatePreview(note.getContent());
            outputHandler.displayLine(preview);

            outputHandler.displayLine("");
            outputHandler.displayLine("═".repeat(62));
            outputHandler.displayLine("");
        }
    }

    private void displayNoteContent(Note note) {
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("  " + note.getTitle());
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("");

        outputHandler.displayLine("DETAILS:");
        outputHandler.displayLine("─".repeat(62));
        outputHandler.displayLine("Created:    " + note.getCreatedAt().format(DISPLAY_DATE_FORMATTER));
        outputHandler.displayLine("Modified:   " + note.getUpdatedAt().format(DISPLAY_DATE_FORMATTER));

        if (!note.getTags().isEmpty()) {
            String tagStr = String.join(", ", note.getTags());
            outputHandler.displayLine("Tags:       " + tagStr);
        }
        outputHandler.displayLine("");

        outputHandler.displayLine("CONTENT:");
        outputHandler.displayLine("─".repeat(62));
        outputHandler.displayLine("");

        String[] lines = note.getContent().split("\n");
        for (String line : lines) {
            if (line.length() > 60) {
                String[] words = line.split(" ");
                StringBuilder currentLine = new StringBuilder();

                for (String word : words) {
                    if (currentLine.length() + word.length() + 1 > 60) {
                        outputHandler.displayLine(currentLine.toString());
                        currentLine = new StringBuilder(word);
                    } else {
                        if (currentLine.length() > 0)
                            currentLine.append(" ");
                        currentLine.append(word);
                    }
                }

                if (currentLine.length() > 0) {
                    outputHandler.displayLine(currentLine.toString());
                }
            } else {
                outputHandler.displayLine(line);
            }
        }

        outputHandler.displayLine("");
        outputHandler.displayLine("═".repeat(62));
    }

    private void displayDeleteWarning(Note note) {
        uiRenderer.displayDeleteHeader();

        outputHandler.displayLine("DELETION TARGET:");
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("Title:    " + note.getTitle());
        outputHandler.displayLine("Created:  " + note.getCreatedAt().format(DISPLAY_DATE_FORMATTER));
        outputHandler.displayLine("Status:   Marked for digital obliteration");
        outputHandler.displayLine("═".repeat(62));
        outputHandler.displayLine("");
        outputHandler.showWarning("This action cannot be undone!");
        outputHandler.displayLine("");
    }

    private void performDeletion(Note note, String filename) throws IOException {
        Path filePath = Paths.get(NOTES_DIRECTORY, filename);

        Files.delete(filePath);
        outputHandler.displayLine("");
        outputHandler.showSuccess("CRITICAL HIT!");
        outputHandler.displayLine("");
        outputHandler.displayLine(note.getTitle() + "' has been banished to the void.");
    }

    private void displaySearchResults(List<Note> results) {
        List<String> resultStrings = results.stream()
                .map(note -> String.format("%s (Created: %s, Tags: %s)",
                        note.getTitle(),
                        note.getCreatedAt().format(DISPLAY_DATE_FORMATTER),
                        note.getTags().isEmpty() ? "None" : String.join(", ", note.getTags())))
                .collect(Collectors.toList());

        DisplayFormatter.displaySection(outputHandler, "SEARCH RESULTS", resultStrings);

        for (int i = 0; i < results.size(); i++) {
            Note note = results.get(i);
            outputHandler.displayLine((i + 1) + ". " + note.getTitle());
            outputHandler.displayLine("   Created: " + note.getCreatedAt().format(DISPLAY_DATE_FORMATTER));
            outputHandler.displayLine("   Last Saved: " + note.getUpdatedAt().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                outputHandler.displayLine("   Tags: " + String.join(", ", note.getTags()));
            }
            outputHandler.displayLine(
                    "   Preview: " + generatePreview(note.getContent()));
            outputHandler.displayLine("");
        }
    }

    // Add the generatePreview method used in showNotesListForSelection
    private String generatePreview(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "No content";
        }

        // Remove extra whitespace and newlines for preview
        String cleaned = content.replaceAll("\\s+", " ").trim();

        // Return first 50 characters or until first sentence
        int maxLength = Math.min(50, cleaned.length());
        String preview = cleaned.substring(0, maxLength);

        // Try to end at a word boundary
        int lastSpace = preview.lastIndexOf(' ');
        if (lastSpace > 20 && lastSpace < maxLength) {
            preview = preview.substring(0, lastSpace);
        }

        return preview;
    }

    private List<Note> simpleSearch(List<Note> notes, String query) {
        if (query == null || query.trim().isEmpty()) {
            return notes;
        }

        String lowerQuery = query.toLowerCase().trim();

        return notes.stream()
                .filter(note -> {
                    // Search in title
                    if (note.getTitle().toLowerCase().contains(lowerQuery)) {
                        return true;
                    }

                    // Search in content
                    if (note.getContent().toLowerCase().contains(lowerQuery)) {
                        return true;
                    }

                    // Search in tags
                    return note.getTags().stream()
                            .anyMatch(tag -> tag.toLowerCase().contains(lowerQuery));
                })
                .collect(Collectors.toList());
    }

    private static class NoteWithFilename {
        private final Note note;
        private final String filename;

        public NoteWithFilename(Note note, String filename) {
            this.note = note;
            this.filename = filename;
        }

        public Note note() {
            return note;
        }

        public String filename() {
            return filename;
        }
    }
}
