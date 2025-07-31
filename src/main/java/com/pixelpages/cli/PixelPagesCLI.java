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

    // ----------- Constants -----------

    // Define the directory where notes will be stored
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";
    private NoteStorage noteStorage;
    private BufferedReader reader;
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // ----------- Constructors -----------

    public PixelPagesCLI() {
        this.noteStorage = new NoteStorage(NOTES_DIRECTORY);
        this.reader = new BufferedReader(new InputStreamReader(System.in));
    }

    private void flushScreen() {
        // ANSI escape code to clear screen and move cursor to top-left
        System.out.print("\033[2J\033[H");
        System.out.flush();
    }

    public static void main(String[] args) throws IOException {

        // Initialize the CLI application
        PixelPagesCLI app = new PixelPagesCLI();

        // Check if the user provided any command-line arguments
        // If no arguments are provided, start interactive mode
        if (args.length == 0) {
            app.runInteractiveMode();
            return;
        }

        // if help, show help
        if (args[0].equals("--help")) {
            app.displayHelp();
            return;
        }

        // Process the command-line arguments
        String command = args[0];
        String[] commandArgs = Arrays.copyOfRange(args, 1, args.length);
        String argument = String.join(" ", commandArgs).trim();

        // Handle the command based on user input
        // Use a try-catch block to handle potential IOExceptions
        // if user provides a command, process it this way so it still works no matter
        // what
        app.flushScreen();
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
                        System.out.println("Please provide a filename to read...I'm not a mind reader!");
                    } else {
                        app.handleReadCommand(argument);
                    }
                    break;
                case "edit":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a filename to edit...I'm not a mind reader!");
                    } else {
                        app.handleEditCommand(argument);
                    }
                    break;
                case "delete":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a filename to delete...I'm not a mind reader!");
                    } else {
                        app.handleDeleteCommand(argument);
                    }
                    break;
                case "search":
                    if (argument.isEmpty()) {
                        System.out.println("Please provide a search query...I'm not a mind reader!");
                    } else {
                        app.handleSearchCommand(argument);
                    }
                    break;
                case "stats": // implement later
                    System.out.println("Statistics feature is not implemented yet! Just you wait...");
                    break;
                case "help":
                    app.displayHelp();
                    break;
                case "exit":
                case "quit":
                case "bye":
                    app.printExitMessage();
                    return;
                default:
                    System.out.println("404 ERROR: What is this?: " + command);
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
            System.out.println();
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
        flushScreen();
        printCreateHeader();

        // Use promptWithRetry for title input
        String title = promptWithRetry(
                "A wild note appeared! What will you name it?: ",
                "Title cannot be empty. Even grocery lists need names!");

        if (title == null) {
            flushScreen();
            System.out.println("Okay...Fine. Nevermind! I didn't want to help you anyway.");
            return;
        }

        // Read tags from user input
        String tagsInput = readUserInput("How will future you find this later? (Enter some tags): ");

        // Split tags by comma and trim whitespace, ensuring no empty tags
        List<String> tags = Arrays.stream(tagsInput.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        // Read content from user input
        System.out.println("Unleash your inner philosopher (type 'END' when done being profound): ");

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
        Note newNote = new Note(title, content, tags);
        String filename = noteStorage.generateUniqueFilename(title);

        // Save the note to storage
        noteStorage.saveNote(newNote, filename);

        // Display success message
        System.out.println("\nBehold! '" + title + "' now exists in digital eternity!");
    }

    private void handleListCommand(String query) {
        // List all notes, optionally filtered by query
        flushScreen();
        printListHeader();
        System.out.println();

        List<Note> allNotes = noteStorage.listAllNotes();

        List<Note> notesToDisplay = allNotes;
        if (!query.isEmpty()) {
            notesToDisplay = simpleSearch(allNotes, query);
            System.out.println("Searching through your digital brain for '" + query + "' ...");
        }

        if (notesToDisplay.isEmpty()) {
            printErrorMessage("404 ERROR. Nothing found. Your digital brain is empty.");
            return;
        }

        // Sort notes by title
        notesToDisplay.sort(Comparator.comparing(Note::getTitle));

        // Display the notes
        AtomicInteger index = new AtomicInteger(1);
        System.out.println("YOUR ARCHIVED MEMORIES:");
        System.out.println("━".repeat(60));
        System.out.println();

        notesToDisplay.forEach(note -> {
            String filename = noteStorage.getFilenameForNote(note); // temporary way to get filename
            System.out.println(index.getAndIncrement() + ". " + note.getTitle());
            System.out.println("   Born: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("   Last Touched: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                System.out.println("   Tags: " + String.join(", ", note.getTags()));
            }
            System.out.println(
                    "   Preview: " + (note.getContent().length() > 50 ? note.getContent().substring(0, 50) + "..."
                            : note.getContent()));
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
            System.out.println("Born: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("Last Touched: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
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

            // Enter new tagsInput
            System.out.println("Current tags: "
                    + (originalNote.getTags().isEmpty() ? "None" : String.join(", ", originalNote.getTags())));
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
                filenameToSave = noteStorage.generateUniqueFilename(originalNote.getTitle()); // Generate a new filename
                                                                                              // if title changed
                Files.deleteIfExists(Paths.get(NOTES_DIRECTORY, originalFilename)); // Delete the old file if it exists
                System.out.println("Renamed from '" + originalFilename + "' to '" + filenameToSave + "'");
            }

            originalNote.updateModifiedTimestamp(); // Update the modified timestamp
            // Save the updated note
            noteStorage.saveNote(originalNote, filenameToSave);
            System.out
                    .println("Note '" + originalNote.getTitle() + "' has been updated and saved as " + filenameToSave);

        } else {
            System.out.println("Note '" + noteIdentifier + "' not found for editing.");
        }
    }

    private void handleDeleteCommand(String noteIdentifier) throws IOException {
        System.out.println("--- Delete Your Note ---");
        Optional<NoteWithFilename> foundNote = findNoteByIdentifier(noteIdentifier);

        if (foundNote.isPresent()) {
            Note noteToDelete = foundNote.get().note();
            String filenameToDelete = foundNote.get().filename();

            // Confirm deletion
            System.out
                    .println("Are you sure you want to delete the note '" + noteToDelete.getTitle() + "'? (yes/no): ");
            String confirmation = readUserInput("").toLowerCase();

            if (confirmation.equals("yes")) {
                // Delete the note file
                Path filePath = Paths.get(NOTES_DIRECTORY, filenameToDelete);
                // simple backup before deletion
                String backupFilename = filenameToDelete + ".backup." + System.currentTimeMillis();
                Path backupPath = Paths.get(NOTES_DIRECTORY, backupFilename);
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
        flushScreen();
        printSearchHeader();
        System.out.println();
        // Search for notes containing the query in their title or content
        System.out.println("--- Searching for Notes with '" + query + "' ---");
        List<Note> allNotes = noteStorage.listAllNotes();
        List<Note> results = simpleSearch(allNotes, query);

        if (results.isEmpty()) {
            printErrorMessage("No notes found matching the query: " + query);
            return;
        }

        results.sort(Comparator.comparing(Note::getTitle)); // Sort results by title
        AtomicInteger index = new AtomicInteger(1);
        results.forEach(note -> {
            String filename = noteStorage.getFilenameForNote(note);
            System.out.println(index.getAndIncrement() + ". " + note.getTitle());
            System.out.println("   Born: " + note.getCreated().format(DISPLAY_DATE_FORMATTER));
            System.out.println("   Last Touched: " + note.getModified().format(DISPLAY_DATE_FORMATTER));
            if (!note.getTags().isEmpty()) {
                System.out.println("   Tags: " + String.join(", ", note.getTags()));
            }
            System.out.println(
                    "   Preview: " + (note.getContent().length() > 100 ? note.getContent().substring(0, 100) + "..."
                            : note.getContent()));
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
                if (filename.equalsIgnoreCase(identifier)
                        || note.getTitle().toLowerCase().contains(identifier.toLowerCase())) {
                    return Optional.of(new NoteWithFilename(note, filename));
                }
            } catch (IOException e) {
                System.err.println("Warning: Could not read " + filename + " for lookup: " + e.getMessage());
            }
        }
        return Optional.empty();
    }

    // Temporary record to hold a note and its filename together
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

    // simple search
    private List<Note> simpleSearch(List<Note> notes, String query) {
        String lowerQuery = query.toLowerCase();
        return notes.stream()
                .filter(note -> note.getTitle().toLowerCase().contains(lowerQuery) ||
                        note.getContent().toLowerCase().contains(lowerQuery) ||
                        note.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(lowerQuery)))
                .collect(Collectors.toList());
    }

    // Display help information for the CLI commands
    public void displayHelp() {
        flushScreen();
        printWelcomeHeader();
        System.out.println();
        System.out.println("             --- Lost? Confused? Questioning your life choices?? ---");
        System.out.println("                   --- You've come to the right place! ---");
        System.out.println();
        System.out.println();
        System.out.println("Try one of these commands:");
        System.out.println();
        System.out.println(
                "  ./notes create               - Conjures a fresh parchment from the ether to write your thoughts.");
        System.out.println("  ./notes list                 - Displays all your enchanted (or mundane) notes.");
        System.out.println(
                "  ./notes search <query>       - Unleashes the data bloodhounds to sniff out tags and keywords.");
        System.out.println(
                "  ./notes read <note-id>       - Peering into the abyss of your mind... or just reading a note.");
        System.out.println("  ./notes edit <note-id>       - Summons the sacred quil to rewrite destiny.");
        System.out.println("  ./notes delete <note-id>     - Banishes a note to the digital void. Are you sure?");
        System.out.println(
                "  ./notes stats                - (Coming Soon) Unleash the data goblins to analyze your note-taking habits.");
        System.out.println();
        System.out.println("  ./notes exit                 - Exits the digital realm and returns to reality.");
        System.out.println("  ./notes --help               - Summons the ancient scrolls of guidance. Use wisely!");
        System.out.println();
        System.out.println();
    }

    private void printWelcomeHeader() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                                                  ║");
        System.out.println("║                                                                                  ║");
        System.out.println("║ ██████╗ ██╗██╗  ██╗███████╗██╗         ██████╗  █████╗  ██████╗ ███████╗███████╗ ║");
        System.out.println("║ ██╔══██╗██║╚██╗██╔╝██╔════╝██║         ██╔══██╗██╔══██╗██╔════╝ ██╔════╝██╔════╝ ║");
        System.out.println("║ ██████╔╝██║ ╚███╔╝ █████╗  ██║         ██████╔╝███████║██║  ███╗█████╗  ███████╗ ║");
        System.out.println("║ ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║         ██╔═══╝ ██╔══██║██║   ██║██╔══╝  ╚════██║ ║");
        System.out.println("║ ██║     ██║██╔╝ ██╗███████╗███████╗    ██║     ██║  ██║╚██████╔╝███████╗███████║ ║");
        System.out.println("║ ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝ ║");
        System.out.println("║                                                                                  ║");
        System.out.println("║                          Your Digital Junk Drawer                                ║");
        System.out.println("║                                                                                  ║");
        System.out.println("╚══════════════════════════════════════════════════════════════════════════════════╝");
        System.out.println();
    }

    private void printMenuHeader() {
        flushScreen();
        printWelcomeHeader();
        System.out.println();
        System.out.println("             --- Lost? Confused? Questioning your life choices?? ---");
        System.out.println("                   --- You've come to the right place! ---");
        System.out.println();
        System.out.println();
        System.out.println("Welcome to Interactive Mode!");
        System.out.println("Try one of these commands:");
        System.out.println();
        System.out.println("   1.   CREATE: Conjures a fresh parchment from the ether to write your thoughts.");
        System.out.println("   2.   LIST ALL: Displays all your enchanted (or mundane) notes.");
        System.out.println("   3.   SEARCH: Unleashes the data bloodhounds to sniff out tags and keywords.");
        System.out.println("   4.   READ: Peering into the abyss of your mind... or just reading a note.");
        System.out.println("   5.   EDIT: Summons the sacred quil to rewrite destiny.");
        System.out.println("   6.   DELETE: Banishes a note to the digital void. Are you sure?");
        System.out.println("   na.  (Coming Soon) Unleash the data goblins to analyze your note-taking habits.");
        System.out.println();
        System.out.println("   7.   HELP: Summons the ancient scrolls of guidance. Use wisely!");
        System.out.println("   8.   QUIT: Exits the digital realm and returns to reality.");
        System.out.println();
    }

    private void printCreateHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                  CREATING A MASTER PIECE                    │");
        System.out.println("│                (or just a grocery list...)                  │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    private void printListHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                   FORGOTTEN THOUGHTS                        │");
        System.out.println("│                    & UNSENT EMAILS                          │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    private void printDeleteHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                 INITIATING DOOMSDAY PROTOCOL                │");
        System.out.println("│                  THIS IS FINE. (Probably...)                │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    private void printSearchHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│            YOUR NOTES ARE OUT THERE. SOMEWHERE.             │");
        System.out.println("│  Tell me what to look for, and I shall find it (probably).  │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    private void printErrorMessage(String message) {
        flushScreen();
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                YOU'VE FOUND A SECRET LEVEL!                 │");
        System.out.println("│             Just kidding. This is just an error...          │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
        System.out.println(String.format("%-43s", message));
    }

    // Add this method for interactive menu mode
    private void runInteractiveMode() throws IOException {
        while (true) {
            flushScreen();
            printMenuHeader();
            System.out.println();
            String choice = readUserInput("What's your poison? (Enter a number 1-8): ");

            try {
                switch (choice.trim()) {
                    case "1":
                        handleCreateCommand();
                        pauseForUser();
                        break;

                    case "2":
                        String listQuery = readUserInput(
                                "Looking for anything in particular? (Enter title or just press Enter for all): ");
                        handleListCommand(listQuery);
                        pauseForUser();
                        break;

                    case "3":
                        String readId = promptWithRetry(
                                "Which note shall we decode? (note ID): ",
                                "A note ID would be helpful... I'm not a mind reader!");
                        if (readId != null) {
                            handleReadCommand(readId);
                        } else {
                            System.out.println("Okay...Fine. Nevermind! Your thoughts remain mysterious.");
                        }
                        pauseForUser();
                        break;

                    case "4":
                        String editId = promptWithRetry(
                                "Which masterpiece needs editing? (note ID): ",
                                "Which note exactly? I'm not a psychic...");
                        if (editId != null) {
                            handleEditCommand(editId);
                        } else {
                            System.out.println("Okay...Fine. Nevermind!. Perfection preserved.");
                        }
                        pauseForUser();
                        break;

                    case "5":
                        String deleteId = promptWithRetry(
                                "Which thought shall we banish? (note ID): ",
                                "Specify a target for digital annihilation...");
                        if (deleteId != null) {
                            handleDeleteCommand(deleteId);
                        } else {
                            System.out.println("Okay...Fine. Nevermind! Your notes live to see another day.");
                        }
                        pauseForUser();
                        break;

                    case "6":
                        String searchQuery = promptWithRetry(
                                "What's the secret password? (aka search term): ",
                                "Searching for nothing returned no results (because there's nothing to find, genius).");
                        if (searchQuery != null) {
                            handleSearchCommand(searchQuery);
                        } else {
                            System.out.println("Okay...Fine. Nevermind! The mystery remains unsolved.");
                        }
                        pauseForUser();
                        break;

                    case "7":
                        displayHelp();
                        pauseForUser();
                        break;

                    case "8":
                    case "0":
                    case "exit":
                    case "quit":
                        printExitMessage();
                        return;

                    default:
                        printErrorMessage("That's not on the menu, bud. Try again with an actual number...");
                        pauseForUser();
                }
            } catch (IOException e) {
                System.err.println("404 ERROR: " + e.getMessage());
                pauseForUser();
            }
        }
    }

    // Add a pause method for better UX
    private void pauseForUser() throws IOException {
        System.out.println();
        System.out.println("Press Enter to return to the main menu...");
        reader.readLine();
    }

    private void printExitMessage() {
        flushScreen();
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│            INITIATING SELF DESTRUCT SEQUENCE...             │");
        System.out.println("│                                                             │");
        System.out.println("│                      Just kidding.                          │");
        System.out.println("│                   Log out successful!                       │");
        System.out.println("│                                                             │");
        System.out.println("│           You may now return to your human life.            │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
    }

    // Simple retry wrapper - add this to your PixelPagesCLI class
    private String promptWithRetry(String prompt, String errorMessage) throws IOException {
        while (true) {
            String input = readUserInput(prompt);

            if (!input.isEmpty()) {
                return input;
            }

            printErrorMessage(errorMessage);
            System.out.println();
            String retry = readUserInput("Want to try that again? (y/n): ");

            if (!retry.toLowerCase().startsWith("y")) {
                return null; // User cancelled
            }
        }
    }
}
