package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

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
                if (argument.isEmpty()) {
                    outputHandler.showError("Please provide a filename to edit...I'm not a mind reader!");
                } else {
                    handleEdit(argument);
                }
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
            case "secrets":
            case "secret":
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
        outputHandler.clear();
        outputHandler.displayReadHeader();

        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        if (foundNote.isPresent()) {
            outputHandler.clear();
            outputHandler.displayReadHeader();
            outputHandler.displayLine("\nSearching digital archives for '" + noteIdentifier + "'...");
            outputHandler.displayLine("");

            Note note = foundNote.get().note();
            displayNoteContent(note);
        } else {
            outputHandler.showError("Note '" + noteIdentifier + "' seems to have vanished into the digital void.");
            outputHandler.displayLine("(\n You can list all notes using the 'list' command)");
        }
    }

    public void handleEdit(String noteIdentifier) throws IOException {
        outputHandler.clear();
        outputHandler.displayEditHeader();

        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        if (foundNote.isPresent()) {
            Note originalNote = foundNote.get().note();
            String originalFilename = foundNote.get().filename();

            outputHandler.displayLine("Loading " + originalFilename + " for modification...");
            outputHandler.displayLine("");
            outputHandler.displayLine("Current Title: " + originalNote.getTitle());
            outputHandler.displayLine("");

            String newTitle = inputHandler.readLine("Enter new quest title (or press Enter to keep current): ");
            if (!newTitle.isEmpty()) {
                originalNote.setTitle(newTitle);
            }

            outputHandler.displayLine("\nCurrent Log Entry:");
            outputHandler.displayLine("");
            outputHandler.displayLine(originalNote.getContent());
            outputHandler.displayLine(
                    "\nRewrite your adventure! (type 'END' on a new line to finish, or press enter to keep current):");
            outputHandler.displayLine("");

            String newContent = inputHandler.readMultilineUntil("END");
            if (newContent != null && !newContent.trim().isEmpty()) {
                originalNote.setContent(newContent);
                outputHandler.displayLine("");
                outputHandler.displayLine("Quest log updated! Your legend grows stronger.");
            } else {
                outputHandler.displayLine("");
                outputHandler.displayLine("Content unchanged. Your original adventure remains!");
            }

            outputHandler.displayLine("\nCurrent tags: " +
                    (originalNote.getTags().isEmpty() ? "None" : String.join(", ", originalNote.getTags())));

            outputHandler.displayLine("");
            String newTagsInput = inputHandler
                    .readLine("Update your tags (comma-separated, or Enter to keep current): ");
            if (!newTagsInput.isEmpty()) {
                originalNote.setTags(parseTags(newTagsInput));
            }

            String filenameToSave = originalFilename;
            if (!newTitle.isEmpty() && !newTitle.equals(originalNote.getTitle())) {
                filenameToSave = noteStorage.generateUniqueFilename(originalNote.getTitle());
                Files.deleteIfExists(Paths.get(NOTES_DIRECTORY, originalFilename));
                outputHandler.displayLine("");
                outputHandler.displayLine("Log renamed from '" + originalFilename + "' to '" + filenameToSave + "'");
            }

            originalNote.updateModifiedTimestamp();
            noteStorage.saveNote(originalNote, filenameToSave);
            outputHandler.displayLine("");
            outputHandler
                    .showSuccess("Log '" + originalNote.getTitle() + "' has been saved as " + filenameToSave + ".");
            outputHandler.displayLine("");
            outputHandler.displayLine("ACHIEVEMENT UNLOCKED: Master Editor!");

        } else {
            outputHandler.showError("ERROR 404: Note '" + noteIdentifier + "' not found for editing.");
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
                                note.getCreated().format(DISPLAY_DATE_FORMATTER)))
                        .collect(Collectors.toList()));

        for (int i = 0; i < notes.size(); i++) {
            Note note = notes.get(i);

            // Use displayHeader for each note title instead of manual formatting
            outputHandler.displayHeader("NOTE #" + (i + 1) + ": " + note.getTitle());

            outputHandler.displayLine("Created:  " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            outputHandler.displayLine("Modified: " + note.getModified().format(DISPLAY_DATE_FORMATTER));

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
        outputHandler.displayLine("Created:    " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
        outputHandler.displayLine("Modified:   " + note.getModified().format(DISPLAY_DATE_FORMATTER));

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
        outputHandler.displayLine("Created:  " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
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
                        note.getCreated().format(DISPLAY_DATE_FORMATTER),
                        note.getTags().isEmpty() ? "None" : String.join(", ", note.getTags())))
                .collect(Collectors.toList());

        DisplayFormatter.displaySection(outputHandler, "SEARCH RESULTS", resultStrings);

        for (int i = 0; i < results.size(); i++) {
            Note note = results.get(i);
            outputHandler.displayLine((i + 1) + ". " + note.getTitle());
            outputHandler.displayLine("   Created: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            outputHandler.displayLine("   Last Saved: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                outputHandler.displayLine("   Tags: " + String.join(", ", note.getTags()));
            }
            outputHandler.displayLine(
                    "   Preview: " + generatePreview(note.getContent()));
            outputHandler.displayLine("");
        }
    }

    private Optional<NoteWithFilename> findNoteByIdentifier(String identifier) {
        List<Path> allNoteFiles = noteStorage.getNoteFiles();
        for (Path filePath : allNoteFiles) {
            String filename = filePath.getFileName().toString();
            try {
                Note note = noteStorage.readNote(filename);
                if (filename.equalsIgnoreCase(identifier)
                        || note.getTitle().toLowerCase().contains(identifier.toLowerCase())) {
                    return Optional.of(new NoteWithFilename(note, filename));
                }
            } catch (IOException e) {
                if (filename.equalsIgnoreCase(identifier)) {
                    outputHandler.showWarning("Failed to read note file: " + filename);
                }
            }
        }
        return Optional.empty();
    }

    private List<Note> simpleSearch(List<Note> notes, String query) {
        String lowerQuery = query.toLowerCase();
        return notes.stream()
                .filter(note -> note.getTitle().toLowerCase().contains(lowerQuery) ||
                        note.getContent().toLowerCase().contains(lowerQuery) ||
                        note.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(lowerQuery)))
                .collect(Collectors.toList());
    }

    private String generatePreview(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "(empty note)";
        }

        String cleanContent = content.replaceAll("\\s+", " ").trim();
        int maxLength = 200; // Increased from 100 to allow for two lines
        
        if (cleanContent.length() <= maxLength) {
            return formatPreviewLines(cleanContent);
        }

        String truncated = cleanContent.substring(0, maxLength);
        int lastSentence = Math.max(
                truncated.lastIndexOf(". "),
                Math.max(truncated.lastIndexOf("! "), truncated.lastIndexOf("? ")));

        if (lastSentence > maxLength * 0.7) {
            return formatPreviewLines(cleanContent.substring(0, lastSentence + 1));
        }

        int lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            return formatPreviewLines(cleanContent.substring(0, lastSpace) + "...");
        }

        return formatPreviewLines(truncated + "...");
    }

    private String formatPreviewLines(String content) {
        // Split content into two lines, each max 60 characters
        if (content.length() <= 60) {
            return content;
        }
        
        String[] words = content.split(" ");
        StringBuilder line1 = new StringBuilder();
        StringBuilder line2 = new StringBuilder();
        
        for (String word : words) {
            if (line1.length() + word.length() + 1 <= 60) {
                if (line1.length() > 0) line1.append(" ");
                line1.append(word);
            } else if (line2.length() + word.length() + 1 <= 60) {
                if (line2.length() > 0) line2.append(" ");
                line2.append(word);
            } else {
                break; // Stop if we can't fit more words
            }
        }
        
        if (line2.length() > 0) {
            return line1.toString() + "\n" + line2.toString();
        } else {
            return line1.toString();
        }
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
