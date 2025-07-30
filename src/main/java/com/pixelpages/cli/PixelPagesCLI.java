package com.pixelpages.cli;

import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


public class PixelPagesCLI {

    //----------- Constants -----------

    // Define the directory where notes will be stored
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";
    private NoteStorage noteStorage;
    private BufferedReader reader;
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    //----------- Constructors -----------

    public PixelPagesCLI() {
        this.noteStorage = new NoteStorage(NOTES_DIRECTORY);
        this.reader = new BufferedReader(new InputStreamReader(System.in));
    }

    public static void main (String[] args) {

        // Initialize the CLI application
        PixelPagesCLI app = new PixelPagesCLI();

        // Check if the user provided any command-line arguments
        // If no arguments are provided, display help
        if (args.length==0||args[0].equals("--help")) {
            app.displayHelp();
            return;
        }

        // Process the command-line arguments
        String command = args[0];
        String[] commandArgs=Arrays.copyOfRange(args, 1, args.length);
        String argument=String.join(" ", commandArgs).trim();

        // Handle the command based on user input
        // Use a try-catch block to handle potential IOExceptions
        try {
            switch (command) {
                case "create":
                    app.handleCreateCommand();
                    break;
                case "list":
                    app.handleListCommand(argument);
                    break;
                case "read":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a filename to read.");
                    } else {
                        app.handleReadCommand(argument);
                    }
                    break;
                case "edit":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a filename to edit.");
                    } else {
                        app.handleEditCommand(argument);
                    }
                    break;
                case "delete":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a filename to delete.");
                    } else {
                        app.handleDeleteCommand(argument);
                    }
                    break;
                case "search":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a search query.");
                    } else {
                        app.handleSearchCommand(argument);
                    }
                    break;
                case "stats": //implement later
                    System.out.println("Statistics feature is not implemented yet! Just you wait...");
                    break;
                default:
                    System.out.println("Unknown command: " + command);
                    app.displayHelp();
            }
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            try {
                // Close the reader to release resources
                app.reader.close();
            } catch (IOException e) {
                System.err.println("Error closing input reader: " + e.getMessage());
            }
        }
    }

    // Read user input from the console
    private String readUserInput(String prompt) throws IOException {
        System.out.print(prompt);
        return reader.readLine().trim();
    }

    // Handle the create command
    private void handleCreateCommand() throws IOException {
        // Prompt the user for note title and content
        System.out.println("--- Create a New Thought (I believe in you!) ---");
        String title = readUserInput("Enter note title: ");

        if (title.isEmpty()) {
            System.out.println("chile...the title cannot be empty (obviously).");
            return;
        }

        // Read tags from user input
        String tagsInput = readUserInput("Enter tags (comma-separated, optional): ");

        // Split tags by comma and trim whitespace, ensuring no empty tags
        List<String> tags = Arrays.stream(tagsInput.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .collect(Collectors.toList());


        // Read content from user input - remove the initial prompt
        System.out.println("Enter your thought provoking idea here (type 'END' on a new line to finish):");

        // Use StringBuilder to collect multiple lines of content
        StringBuilder contentBuilder = new StringBuilder();

        // Read lines until the user types "END"
        String line;
        while ((line = reader.readLine()) != null) { 
            if (line.equalsIgnoreCase("END")) {
                break; // Stop reading when user types "END"
            }
            contentBuilder.append(line).append("\n"); // Append each line to the content
        }

        String content = contentBuilder.toString().trim(); 

        // Create a new Note object
        Note newNote = new Note(title, content,tags);
        String filename = noteStorage.generateUniqueFilename(title);

        // Save the note to storage
        noteStorage.saveNote(newNote, filename);

        // Display success message
        System.out.println("Congrats girly, you created '" + title + "' and successfully saved it as " + filename);
    }

    private void handleListCommand(String query) {
        // List all notes, optionally filtered by query
        System.out.println("--- Look At All These Notes! ---");

        List<Note> allNotes = noteStorage.listAllNotes();

        List<Note> notesToDisplay = allNotes;
        if (!query.isEmpty()) {
            notesToDisplay = simpleSearch(allNotes, query);
            System.out.println("Hold on bestie... I'm searching for notes with '" + query + "' in the title...");
        }

        if (notesToDisplay.isEmpty()) {
            System.out.println("No notes found... :( Maybe you should create one?");
            return;
        }

        // Sort notes by title
        notesToDisplay.sort(Comparator.comparing(Note::getTitle)); 

        // Display the notes
        AtomicInteger index = new AtomicInteger(1);
        notesToDisplay.forEach(note -> {
            String filename = noteStorage.getFilenameForNote(note); // temporary way to get filename
            System.out.println(index.getAndIncrement() + ". " + note.getTitle());
            System.out.println("   Created: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("   Modified: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                System.out.println("   Tags: " + String.join(", ", note.getTags()));
            }
            System.out.println("   Content snippet: " + (note.getContent().length() > 50 ? note.getContent().substring(0, 50) + "..." : note.getContent()));
            System.out.println();
        });
    }

    // Handle the read command
    private void handleReadCommand(String noteIdentifier) throws IOException {

        // Find the note by its identifier (filename or title)
        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        // If the note is found, display its content
        // If not found, display an error message
        if (foundNote.isPresent()) {
            Note note = foundNote.get().note();
            System.out.println("\n--- Reading Note: " + note.getTitle() + " ---");
            System.out.println("Title: " + note.getTitle());
            System.out.println("Created: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("Modified: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                System.out.println("Tags: " + String.join(", ", note.getTags()));
            }
            System.out.println("\nContent:\n" + note.getContent());
        } else {
            System.out.println("Note '" + noteIdentifier + "' not found.");
            System.out.println("You can list all notes using 'list' command.");
        }
    }


    private void handleEditCommand(String noteIdentifier) throws IOException {
        System.out.println("--- Edit Your Note ---");
        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        // Check if the note was found
        if (foundNote.isPresent()) {
            Note originalNote = foundNote.get().note();
            String originalFilename = foundNote.get().filename();

            // Display the current title and content
            System.out.println("Current Title: " + originalNote.getTitle());
            String newTitle = readUserInput("Enter new title (or press Enter to keep current): ");
            if (!newTitle.isEmpty()) {
                originalNote.setTitle(newTitle);
            }

            // Display the current content
            System.out.println("Current Content:\n" + originalNote.getContent());
            System.out.println("Enter new content (type 'END' on a new line to finish, or Enter to keep current):");
            
            StringBuilder newContentBuilder = new StringBuilder();
            String line;
            boolean contentEntered = false;
            
            // Read content until user types "END"
            while ((line = reader.readLine()) != null) {
                if (line.equals("END")) {
                    break; // Stop reading when user types "END"
                }
                newContentBuilder.append(line).append("\n"); // Append each line to the content
                contentEntered = true; // Mark that content was entered
            }

            // Update content if new content was entered
            if (contentEntered && newContentBuilder.length() > 0) {
                originalNote.setContent(newContentBuilder.toString().trim()); // Trim any trailing newlines
            }

            //Enter new tagsInput
            System.out.println("Current tags: " + (originalNote.getTags().isEmpty() ? "None" : String.join(", ", originalNote.getTags())));
            String newTagsInput = readUserInput("Enter new tags (comma-separated, or Enter to keep current): ");
            if (!newTagsInput.isEmpty()) {
                List<String> newTags = Arrays.stream(newTagsInput.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
                originalNote.setTags(newTags);
            }


            // Determine filename for saving
            String filenameToSave = originalFilename; // Use the original filename for saving
            if (!newTitle.isEmpty() && !newTitle.equals(originalNote.getTitle())) {
                filenameToSave = noteStorage.generateUniqueFilename(originalNote.getTitle()); // Generate a new filename if title changed
                Files.deleteIfExists(Paths.get(NOTES_DIRECTORY, originalFilename)); // Delete the old file if it exists
                System.out.println("Renamed from '" + originalFilename + "' to '" + filenameToSave + "'");
            }

            originalNote.updateModifiedTimestamp(); // Update the modified timestamp
            // Save the updated note
            noteStorage.saveNote(originalNote, filenameToSave);
            System.out.println("Note '" + originalNote.getTitle() + "' has been updated and saved as " + filenameToSave);

        } else {
            System.out.println("Note '" + noteIdentifier + "' not found for editing.");
        }
    }

    private void handleDeleteCommand(String noteIdentifier) throws IOException {
        System.out.println("--- Delete Your Note ---");
        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        if(foundNote.isPresent()) {
            Note noteToDelete = foundNote.get().note();
            String filenameToDelete = foundNote.get().filename();

            // Confirm deletion
            System.out.println("Are you sure you want to delete the note '" + noteToDelete.getTitle() + "'? (yes/no): ");
            String confirmation = readUserInput("").toLowerCase();

            if (confirmation.equals("yes")) {
                // Delete the note file
                Path filePath = Paths.get(NOTES_DIRECTORY, filenameToDelete);
                //simple backup before deletion
                String backupFilename = filenameToDelete + ".backup." + System.currentTimeMillis();
                Path backupPath=Paths.get(NOTES_DIRECTORY, backupFilename);
                Files.copy(filePath, backupPath);
                System.out.println("Backup created: " + backupFilename);


                Files.delete(filePath);
                System.out.println("Note '" + noteToDelete.getTitle() + "' has been deleted.");
            } else {
                System.out.println("Deletion cancelled.");
            }
        } else {
            System.out.println("Note '" + noteIdentifier + "' not found for deletion.");
        }
    }

    private void handleSearchCommand(String query) {
        // Search for notes containing the query in their title or content
        System.out.println("--- Searching for Notes with '" + query + "' ---");
        List<Note> allNotes = noteStorage.listAllNotes();
        List<Note> results = simpleSearch(allNotes, query);

        if (results.isEmpty()) {
            System.out.println("No notes found matching the query: " + query);
            return;
        }

        results.sort(Comparator.comparing(Note::getTitle)); // Sort results by title
        AtomicInteger index = new AtomicInteger(1);
        results.forEach(note -> {
            String filename = noteStorage.getFilenameForNote(note);
            System.out.println(index.getAndIncrement() + ". " + note.getTitle());
            System.out.println("   Created: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("   Modified: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                System.out.println("   Tags: " + String.join(", ", note.getTags()));
            }
            System.out.println("   Content snippet: " + (note.getContent().length() > 100 ? note.getContent().substring(0, 100) + "..." : note.getContent()));
            System.out.println();
        });
    }

    // Simple search method to filter notes by title or content
    private Optional<NoteWithFilename> findNoteByIdentifier(String identifier) {
        List<Path> allNoteFiles = noteStorage.getNoteFiles();
        for (Path filePath : allNoteFiles) {
            String filename = filePath.getFileName().toString();
            try {
                Note note = noteStorage.readNote(filename);
                // Check if identifier matches filename or part of the title
                if (filename.equalsIgnoreCase(identifier) || note.getTitle().toLowerCase().contains(identifier.toLowerCase())) {
                    return Optional.of(new NoteWithFilename(note, filename));
                }
            } catch (IOException e) {
                System.err.println("Warning: Could not read " + filename + " for lookup: " + e.getMessage());
            }
        }
        return Optional.empty();
    }
    
    //Temporary record to hold a note and its filename together
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

    //simple search
    private List<Note> simpleSearch(List<Note> notes, String query) {
        String lowerQuery = query.toLowerCase();
        return notes.stream()
                .filter(note -> note.getTitle().toLowerCase().contains(lowerQuery) ||
                                note.getContent().toLowerCase().contains(lowerQuery)||
                                note.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(lowerQuery)))
                .collect(Collectors.toList());
    }

    // Display help information for the CLI commands
    public void displayHelp(){
        System.out.println("--- PixelPages CLI Help ---");
        System.out.println("Usage: java -jar PixelPages.jar <command> [arguments]");
        System.out.println();
        System.out.println("Commands:");
        System.out.println("  create               - Create a new note interactively (with title, content, tags).");
        System.out.println("  list                 - List all notes. Can be followed by a search query.");
        System.out.println("  read <note-id>       - Display the full content and metadata of a specific note.");
        System.out.println("  edit <note-id>       - Edit the title, content, and tags of a specific note.");
        System.out.println("  delete <note-id>     - Delete a specific note with confirmation and backup.");
        System.out.println("  search <query>       - Search notes by title, content, or tags.");
        System.out.println("  stats                - (Coming Soon) Display statistics about your notes.");
        System.out.println("  --help               - Display this help message.");
        System.out.println();
        System.out.println("Note ID can be the exact filename (e.g., 'my-first-note.note') or a unique part of the title.");
        System.out.println("Example: java -jar PixelPages.jar create");
        System.out.println("Example: java -jar PixelPages.jar list");
        System.out.println("Example: java -jar PixelPages.jar list work"); // List notes with "work" in title/content/tags
        System.out.println("Example: java -jar PixelPages.jar read my-first-note.note");
        System.out.println("Example: java -jar PixelPages.jar edit 'Meeting Notes'");
        System.out.println("Example: java -jar PixelPages.jar search important");
        System.out.println();
    }
}
