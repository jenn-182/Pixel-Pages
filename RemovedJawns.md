Date UTIL: 

package com.pixelpages.util;

// import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;
// import java.time.format.DateTimeParseException;

// public class DateUtil {

// //-------Constants-------

//     // ISO 8601 date/time format (2024-07-29T10:30:00)
//     private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

//     //Formatter for extracting just the year and the month (2024-07)
//     private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

//     //-------CONSTRUCTOR-------

//     private DateUtil() {
//         // Prevent instantiation
//     }


//     public static String formatDate(final LocalDateTime dateTime) {
//         if (dateTime == null) {
//             return null;
//         }
//         return dateTime.format(ISO_FORMATTER);
//     }

//     // Add this method that NoteService is calling
//     public static String formatDateTime(final LocalDateTime dateTime) {
//         return formatDate(dateTime); // Delegate to existing method
//     }


//     public static LocalDateTime parseDate(final String dateTimeString) {
//         if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
//             return null;
//         }
//         try {
//             return LocalDateTime.parse(dateTimeString, ISO_FORMATTER);
//         } catch (DateTimeParseException e) {
//             // Handle parsing error
//             System.err.println("Invalid date format: " + dateTimeString);
//             return null;
//         }
//     }

//     // Add this method that NoteService is calling
//     public static LocalDateTime parseDateTime(final String dateTimeString) {
//         return parseDate(dateTimeString); // Delegate to existing method
//     }


//     public static String formatMonth(final LocalDateTime date) {
//         if (date == null) {
//             return null;
//         }
//         return date.format(MONTH_FORMATTER);
//     }
// }








FILE UTIL

package com.pixelpages.util;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.util.List;
// import java.util.stream.Stream;
// import java.util.stream.Collectors;
// import java.util.Comparator; // For recursive directory deletion


// public class FileUtil {

//     //-------CONSTRUCTOR--------

//     private FileUtil() {
//         // Prevent instantiation

//     }

//     //reads the content of a file and returns it as a String
//     public static String readFromFile(final String filename) throws IOException {
//         final Path path = Paths.get(filename);
//         return Files.readString(path);
//     }


//     //writes content into a specified file
//     public static void writeToFile(final String filename, final String content) throws IOException {
//         final Path path = Paths.get(filename);
//         Files.writeString(path, content);
//     }

//     //list all regular files within specified directory
//     public static List<String> listFilesInDirectory(final String directory) throws IOException {
//         final Path dirPath = Paths.get(directory);
//         try (Stream<Path> walk = Files.walk(dirPath, 1)) {
//             return walk.filter(Files::isRegularFile)
//                     .map(Path::toString)
//                     .sorted(Comparator.naturalOrder())
//                     .collect(Collectors.toList());
//         }
//     }

//     //deletes a specified file
//     public static void deleteFile(final String filename) throws IOException {
//         Files.delete(Paths.get(filename));
//     }

//     //copies a file from a source path to a destination path
//     public static void copyFile(final String source, final String destination) throws IOException {
//         Files.copy(Paths.get(source), Paths.get(destination), StandardCopyOption.REPLACE_EXISTING);
//     }


//     //ensure the notes directory exists
//     public static void ensureNotesDirectoryExists(final String directoryPath) {
//         Path path = Paths.get(directoryPath);
//         if (!Files.exists(path)) {
//             try {
//                 Files.createDirectories(path);
//                 System.out.println("Created notes directory: " + directoryPath);
//             } catch (IOException e) {
//                 System.err.println("Failed to create notes directory: " + e.getMessage());
//             }
//         }
//     }

//     public static String generateUniqueFilename(String title, String directory) {
//         // Create a safe filename from the title
//         String safeTitle = title.replaceAll("[^a-zA-Z0-9\\s]", "")
//                                .replaceAll("\\s+", "_")
//                                .toLowerCase();
        
//         // Ensure the directory exists
//         ensureNotesDirectoryExists(directory);
        
//         String baseFilename = directory + "/" + safeTitle + ".note";
//         String filename = baseFilename;
//         int counter = 1;
        
//         // If file exists, add a number to make it unique
//         while (new java.io.File(filename).exists()) {
//             filename = directory + "/" + safeTitle + "_" + counter + ".note";
//             counter++;
//         }
        
//         return filename;
//     }
// }









//MAIN 
package com.pixelpages;

// import com.pixelpages.model.Note;
// import com.pixelpages.model.SearchQuery;
// import com.pixelpages.model.Statistics;
// import com.pixelpages.service.NoteStorage;
// import com.pixelpages.util.FileUtil;

// import java.io.IOException;     // For handling file system errors
// import java.util.ArrayList;     // For dynamic lists
// import java.util.Arrays;        // For array utilities
// import java.util.HashSet;      // For using HashSet (a type of Set)
// import java.util.List;          // Interface for lists
// import java.util.Scanner;       // For reading user input from the console
// import java.util.Set;           // Interface for sets (unique collections)


// public class Main {
//     // Class constants
//     private static final String NOTES_DIRECTORY = "pixel_pages_notes";
//     private static final Scanner scanner = new Scanner(System.in);
//     private static NoteStorage noteService;

//     // --- Application-wide Resources ---

//     // private static NoteService noteService; // An object to perform all note-related operations
//     // private static Scanner scanner;         // An object to read input from the user via the console


//     public static void main(final String[] args) {

//         noteService = new NoteStorage(); // Create an instance of our NoteService
//         // scanner = new Scanner(System.in); // Create a Scanner object to read from standard input (keyboard)

//         // Step 2: Process command-line arguments.

//         // Check if no arguments were provided or if the user asked for general help.
//         if (args.length == 0 || args[0].equalsIgnoreCase("--help")) {
//             displayGeneralHelp(); // Show the main help message
//             closeResources();     // Close the scanner before exiting
//             return;               // Exit the application
//         }

//         // The first argument is always the command name (e.g., "create", "list").
//         final String commandName = args[0].toLowerCase(); // Convert to lowercase for case-insensitivity

//         // Collect all arguments *after* the command name.
//         // For example, if args is ["list", "tag:work", "meeting"], commandArgs will be ["tag:work", "meeting"].
//         final List<String> commandArgs = (args.length > 1) ?
//                                          new ArrayList<>(Arrays.asList(args).subList(1, args.length)) :
//                                          new ArrayList<>(); // If no other args, create an empty list

//         // Check for command-specific help (e.g., "notes list --help").
//         if (commandArgs.contains("--help")) {
//             displayCommandHelp(commandName); // Show help specific to this command
//             closeResources();
//             return;
//         }

//         // Step 3: Dispatch the command to the appropriate handler method.
//         // A 'try-catch' block is used to gracefully handle any errors (exceptions)
//         // that might occur during the execution of a command.
//         try {
//             // The 'switch' statement checks the command name and calls the corresponding method.
//             switch (commandName) {
//                 case "create":
//                     handleCreate();
//                     break;
//                 case "list":
//                     handleList(commandArgs);
//                     break;
//                 case "edit":
//                     handleEdit(commandArgs);
//                     break;
//                 case "delete":
//                     handleDelete(commandArgs);
//                     break;
//                 case "view":
//                     handleView(commandArgs);
//                     break;
//                 case "stats":
//                     handleStats();
//                     break;
//                 case "tags":
//                     handleTags();
//                     break;
//                 case "clear": // A bonus command for clearing the console screen
//                     handleClear();
//                     break;
//                 default:
//                     // If the command is not recognized, print an error and show general help.
//                     System.err.println("Error: Unknown command '" + commandName + "'");
//                     displayGeneralHelp();
//                     break;
//             }
//         } catch (final IllegalArgumentException e) {
//             // Catch specific errors related to invalid arguments (e.g., missing search term).
//             System.err.println("Error: " + e.getMessage());
//             displayCommandHelp(commandName); // Show usage help for the command that failed.
//         } catch (final Exception e) {
//             // Catch any other unexpected errors that might occur during command execution.
//             System.err.println("An unexpected error occurred during '" + commandName + "' command: " + e.getMessage());
//             // For debugging, you can uncomment e.printStackTrace() to see the full error stack.
//             // e.printStackTrace();
//             displayCommandHelp(commandName); // Still show help for the command in case it's a usage issue.
//         } finally {
//             // The 'finally' block ensures that this code always runs, regardless of whether
//             // an error occurred or not. It's crucial for closing resources.
//             closeResources(); // Close the scanner to prevent resource leaks.
//         }
//     }

//     /**
//      * Displays a friendly welcome message and general help information about
//      * all available commands and their basic usage.
//      */
//     private static void displayGeneralHelp() {
//         System.out.println("******************************************");
//         System.out.println("* Welcome to Your Personal Notes Manager *");
//         System.out.println("******************************************");
//         System.out.println();
//         System.out.println("Manage your thoughts and ideas right from your terminal!");
//         System.out.println();
//         System.out.println("Usage: notes <command> [options]");
//         System.out.println();
//         System.out.println("Available Commands:");
//         // List each command with a short description.
//         System.out.println("  create                  # Create a new note interactively.");
//         System.out.println("  list [query]            # List all notes or search with filters.");
//         System.out.println("  edit <search-term>      # Edit an existing note by title or search term.");
//         System.out.println("  delete <search-term>    # Delete a note by title or search term.");
//         System.out.println("  view <search-term>      # Display the full content of a single note.");
//         System.out.println("  stats                   # Show statistics about your note collection.");
//         System.out.println("  tags                    # List all unique tags used in your notes.");
//         System.out.println("  clear                   # Clear the terminal screen.");
//         System.out.println();
//         System.out.println("For more detailed help on a specific command: notes <command> --help");
//         System.out.println();
//         System.out.println("Quick Examples:");
//         System.out.println("  notes create");
//         System.out.println("  notes list");
//         System.out.println("  notes list meeting tag:work");
//         System.out.println("  notes edit \"My first note\"");
//         System.out.println("  notes delete draft");
//         System.out.println("  notes stats");
//     }

//     /**
//      * Displays detailed help specific to a particular command.
//      * This explains its usage, arguments, and provides concrete examples.
//      *
//      * @param commandName The name of the command for which help is requested.
//      */
//     private static void displayCommandHelp(final String commandName) {
//         System.out.println("--- Help for Command: " + commandName.toUpperCase() + " ---");
//         System.out.println();

//         // Use a switch statement to provide specific help messages for each command.
//         switch (commandName) {
//             case "create":
//                 System.out.println("Usage: notes create");
//                 System.out.println("Description: Starts an interactive session to create a new note.");
//                 System.out.println("  You will be prompted to enter the title, optional tags, and the content.");
//                 System.out.println("  For content, input is taken as a single line.");
//                 System.out.println("Example: notes create");
//                 break;
//             case "list":
//                 System.out.println("Usage: notes list [query]");
//                 System.out.println("Description: Displays your notes. Can list all notes or filter them using a search query.");
//                 System.out.println("Arguments:");
//                 System.out.println("  [query] (optional): A search string which can include special filters:");
//                 System.out.println("    - Basic text search (case-insensitive): `notes list meeting`");
//                 System.out.println("    - Search for notes with a specific tag: `tag:work` (e.g., `notes list tag:work`)");
//                 System.out.println("    - Exclude notes with a specific tag: `-tag:draft` (e.g., `notes list -tag:draft`)");
//                 System.out.println("    - Find notes created after a date: `after:YYYY-MM-DD` (e.g., `notes list after:2024-01-01`)");
//                 System.out.println("    - Find notes created before a date: `before:YYYY-MM-DD` (e.g., `notes list before:2024-12-31`)");
//                 System.out.println("    - Search only in the note's title: `title:` (e.g., `notes list title: project`)");
//                 System.out.println("    - Combine multiple filters: `notes list meeting tag:work after:2024-07-01`");
//                 System.out.println("Example: notes list tag:urgent after:2024-07-01 \"important details\"");
//                 break;
//             case "edit":
//                 System.out.println("Usage: notes edit <search-term>");
//                 System.out.println("Description: Allows you to modify an existing note.");
//                 System.out.println("  If your search term matches multiple notes, you'll be asked to choose one.");
//                 System.out.println("Arguments:");
//                 System.out.println("  <search-term> (required): A unique part of the note's title, content, or tags to identify it.");
//                 System.out.println("Example: notes edit \"My first note\"");
//                 break;
//             case "delete":
//                 System.out.println("Usage: notes delete <search-term>");
//                 System.out.println("Description: Permanently removes a note. A backup file is created before deletion for safety.");
//                 System.out.println("Arguments:");
//                 System.out.println("  <search-term> (required): A unique part of the note's title, content, or tags to identify it.");
//                 System.out.println("Example: notes delete \"drafts\"");
//                 break;
//             case "view":
//                 System.out.println("Usage: notes view <search-term>");
//                 System.out.println("Description: Displays the full content and all metadata (created/modified dates, tags) of a specific note.");
//                 System.out.println("Arguments:");
//                 System.out.println("  <search-term> (required): A unique part of the note's title, content, or tags to identify it.");
//                 System.out.println("Example: notes view \"Daily Journal Entry\"");
//                 break;
//             case "stats":
//                 System.out.println("Usage: notes stats");
//                 System.out.println("Description: Provides an overview of your note collection, including total notes, word counts, and tag usage.");
//                 System.out.println("Example: notes stats");
//                 break;
//             case "tags":
//                 System.out.println("Usage: notes tags");
//                 System.out.println("Description: Lists every unique tag (keyword) that you have used across all your notes, sorted alphabetically.");
//                 System.out.println("Example: notes tags");
//                 break;
//             case "clear":
//                 System.out.println("Usage: notes clear");
//                 System.out.println("Description: Attempts to clear the terminal screen for a cleaner view.");
//                 System.out.println("Example: notes clear");
//                 break;
//             default:
//                 System.err.println("No specific help available for command: " + commandName + ". Try 'notes --help'.");
//                 break;
//         }
//     }

//     /**
//      * A helper method to find and (if necessary) allow the user to select a single note.
//      * This is commonly used by 'edit', 'delete', and 'view' commands to identify the target note.
//      *
//      * @param searchTerm The combined search string from command-line arguments (can be empty).
//      * @return The selected {@link Note} object, or {@code null} if no note is found or selection is cancelled.
//      */
//     private static Note getSelectedNote(final String searchTerm) {
//         final List<Note> allNotes = noteService.listAllNotes(); // Get all available notes
//         List<Note> results = new ArrayList<>(); // List to store notes matching the search term

//         if (searchTerm == null || searchTerm.trim().isEmpty()) {
//             // If no search term is provided, show all notes for interactive selection.
//             System.out.println("No specific search term provided. Listing all notes for interactive selection:");
//             results = allNotes;
//         } else {
//             // If a search term is provided, use advanced search to find matching notes.
//             final SearchQuery query = noteService.parseSearchQuery(searchTerm); // Parse the search term
//             results = noteService.advancedSearch(allNotes, query); // Get notes matching the parsed query

//             if (results.isEmpty()) {
//                 System.out.println("No notes found matching: '" + searchTerm + "'.");
//                 return null; // Return null if no matches
//             } else if (results.size() == 1) {
//                 return results.get(0); // If exactly one match, return it directly
//             } else {
//                 // If multiple matches, inform the user and proceed to interactive selection.
//                 System.out.println("Multiple notes found matching '" + searchTerm + "'. Please be more specific or select one:");
//             }
//         }

//         // If multiple notes match (or no search term was given), let the user choose interactively.
//         return selectNoteInteractively(results);
//     }


//      //Displays a numbered list of {@link Note} objects to the user and prompts them
//      //to select one by entering its corresponding number.

//     private static Note selectNoteInteractively(final List<Note> notes) {
//         if (notes.isEmpty()) {
//             System.out.println("No notes available for interactive selection.");
//             return null;
//         }
//         noteService.displayNoteList(notes); // Show the numbered list of notes

//         System.out.print("Enter note number (1-" + notes.size() + ") or 0 to cancel: ");
//         try {
//             final String inputLine = scanner.nextLine(); // Read the user's input line
//             if (inputLine.trim().isEmpty()) {
//                 System.out.println("No input provided. Operation cancelled.");
//                 return null;
//             }
//             final int userInput = Integer.parseInt(inputLine); // Convert input string to an integer

//             if (userInput == 0) {
//                 System.out.println("Operation cancelled by user.");
//                 return null;
//             }

//             final int noteIndex = userInput - 1; // Convert user's 1-based number to a 0-based array/list index

//             // Validate that the entered number is within the valid range.
//             if (noteIndex >= 0 && noteIndex < notes.size()) {
//                 return notes.get(noteIndex); // Return the selected note
//             } else {
//                 System.out.println("That's not a valid number. Please enter a number from the list or 0 to cancel.");
//                 return null;
//             }
//         } catch (final NumberFormatException e) {
//             // Handle cases where the user types non-numeric input.
//             System.out.println("Invalid input. Please enter a number (e.g., 1, 2, or 0 to cancel).");
//             return null;
//         }
//     }


//     private static void closeResources() {
//         if (scanner != null) {
//             scanner.close(); // Close the Scanner object
//         }
//     }

//     // --- Command Handler Methods ---

    
//     //Handles the 'create' command. Prompts the user for note title, tags, and content,
//     //then creates and saves the new note to a file.
    
//     private static void handleCreate() {
//         System.out.println("--- Creating New Note ---");

//         // Prompt for and read the note title.
//         System.out.print("Please enter the Note Title: ");
//         final String title = scanner.nextLine().trim(); // Read input and remove leading/trailing spaces

//         if (title.isEmpty()) {
//             // Throw an IllegalArgumentException if the title is empty.
//             // This will be caught by the 'try-catch' in 'main' for graceful handling.
//             throw new IllegalArgumentException("Note title cannot be empty. Note creation cancelled.");
//         }

//         // Prompt for and read tags.
//         System.out.print("Enter Tags (e.g., work, personal, idea - optional, comma-separated): ");
//         final String tagInput = scanner.nextLine().trim();
//         final Set<String> tags = new HashSet<>(); // Change to Set<String> to match NoteService.createNote()
//         if (!tagInput.isEmpty()) {
//             // Split the input string by commas, trim each tag, and filter out empty tags.
//             Arrays.stream(tagInput.split(","))
//                 .map(String::trim)
//                 .filter(s -> !s.isEmpty())
//                 .forEach(tags::add);
//         }

//         // Prompt for and read the note content (single line for simplicity).
//         System.out.print("Enter Content (single line): ");
//         final String content = scanner.nextLine().trim();

//         try {
//             // Create the Note object in memory.
//             final Note note = noteService.createNote(title, content, tags);
//             // Generate a unique filename for the note.
//             final String filename = FileUtil.generateUniqueFilename(note.getTitle(), NOTES_DIRECTORY);
//             // Save the note object to the generated file.
//             noteService.saveNoteToFile(note, filename);
//             System.out.println("Success! Note '" + note.getTitle() + "' created and saved to: " + filename);

//             // Automatically list notes after creation for immediate feedback.
//             System.out.println("\n--- Your Notes After Creation ---");
//             handleList(new ArrayList<>()); // Call list command with empty arguments (show all)

//         } catch (final IOException e) {
//             System.err.println("Failed to create and save note: " + e.getMessage());
//         }
//     }


//      //Handles the 'list' command. Displays all notes or filters them based on a search query.
//     private static void handleList(final List<String> queryArgs) {
//         final List<Note> allNotes = noteService.listAllNotes(); // Get all notes from storage
//         List<Note> results; // List to hold notes after filtering/searching

//         if (queryArgs.isEmpty()) {
//             // If no search query arguments are provided, show all notes.
//             results = allNotes;
//             System.out.println("--- All Your Notes ---");
//         } else {
//             // If search query arguments exist, perform an advanced search.
//             final String queryStr = String.join(" ", queryArgs); // Combine all args into a single query string
//             final SearchQuery searchQuery = noteService.parseSearchQuery(queryStr); // Parse the query string
//             results = noteService.advancedSearch(allNotes, searchQuery); // Perform the filtered search
//             System.out.println("--- Search Results for: '" + queryStr + "' ---");
//         }
//         noteService.displayNoteList(results); // Display the resulting list of notes
//     }


//      //Handles the 'edit' command. Allows the user to select and modify an existing note.
     
//     private static void handleEdit(final List<String> searchArgs) {
//         if (searchArgs.isEmpty()) {
//             // If no search term is provided, it's an invalid usage.
//             throw new IllegalArgumentException("Missing search term. Please provide a term to find the note you want to edit.");
//         }

//         final String searchTerm = String.join(" ", searchArgs); // Combine search arguments into a single string
//         // Use the helper method to find and (if needed) allow the user to select a specific note.
//         final Note noteToEdit = getSelectedNote(searchTerm);
//         if (noteToEdit == null) {
//             return; // Exit if no note was selected or found.
//         }

//         try {
//             // Call NoteService's edit method, which guides the user through modifying the note's fields in memory.
//             final Note editedNote = noteService.editNote(noteToEdit, scanner);
//             // After editing in memory, save the updated Note object back to its original file on disk.
//             noteService.saveNoteToFile(editedNote, editedNote.getFilename());
//             System.out.println("Success! Note '" + editedNote.getTitle() + "' updated.");

//             // Automatically list notes after editing for immediate feedback.
//             System.out.println("\n--- Your Notes After Editing ---");
//             handleList(new ArrayList<>());

//         } catch (final IOException e) {
//             System.err.println("Failed to update note: " + e.getMessage());
//         }
//     }


//      //Handles the 'delete' command. Prompts for user confirmation and then deletes the selected note,
//      //ensuring a backup copy is created beforehand.

//     private static void handleDelete(final List<String> searchArgs) {
//         if (searchArgs.isEmpty()) {
//             // If no search term is provided, it's an invalid usage.
//             throw new IllegalArgumentException("Missing search term. Please provide a term to find the note you want to delete.");
//         }

//         final String searchTerm = String.join(" ", searchArgs);
//         final Note noteToDelete = getSelectedNote(searchTerm); // Find and select the note to be deleted.
//         if (noteToDelete == null) {
//             return; // Exit if no note was selected or found.
//         }

//         // Confirm deletion with the user, emphasizing the backup.
//         System.out.print("Are you sure you want to delete '" + noteToDelete.getTitle() + "'? This action creates a backup but is otherwise permanent (y/N): ");
//         final String confirmation = scanner.nextLine().trim();
//         if (confirmation.equalsIgnoreCase("y")) { // Proceed only if user confirms with 'y' or 'Y'
//             try {
//                 noteService.deleteNote(noteToDelete); // Call NoteService to perform backup and deletion.
//                 System.out.println("Success! Note '" + noteToDelete.getTitle() + "' deleted.");

//                 // Automatically list notes after deletion for immediate feedback.
//                 System.out.println("\n--- Your Notes After Deletion ---");
//                 handleList(new ArrayList<>());

//             } catch (final IOException e) {
//                 System.err.println("Failed to delete note: " + e.getMessage());
//             }
//         } else {
//             System.out.println("Deletion cancelled by user.");
//         }
//     }


//      //Handles the 'view' command. Displays the full content and metadata of a selected note.

//     private static void handleView(final List<String> searchArgs) {
//         if (searchArgs.isEmpty()) {
//             // If no search term is provided, it's an invalid usage.
//             throw new IllegalArgumentException("Missing search term. Please provide a term to find the note you want to view.");
//         }

//         final String searchTerm = String.join(" ", searchArgs);
//         final Note noteToView = getSelectedNote(searchTerm); // Find and select the note to be viewed.
//         if (noteToView != null) {
//             noteService.displayNote(noteToView); // Display the note's full details.
//         }
//     }

//      //Handles the 'stats' command. Generates and displays comprehensive statisticalinformation about the entire note collection, including total notes, word counts,
//      //tag frequencies, and recent activity.

//     private static void handleStats() {
//         final List<Note> allNotes = noteService.listAllNotes(); // Get all notes for analysis
//         final Statistics stats = noteService.generateStatistics(allNotes); // Generate the statistics object
//         noteService.displayStatistics(stats); // Display the main statistics report

//         // --- Display additional analytical reports ---
//         System.out.println("\n--- Notes Needing Attention ---");

//         // Find and display notes that have no tags (might need categorization).
//         final List<Note> orphanedNotes = noteService.findOrphanedNotes(allNotes);
//         if (!orphanedNotes.isEmpty()) {
//             System.out.println("\nOrphaned Notes (notes without any tags):");
//             noteService.displayNoteList(orphanedNotes);
//         } else {
//             System.out.println("\nNo orphaned notes found. All your notes are tagged!");
//         }

//         // Find and display the oldest notes. Only show if there are enough notes to make sense.
//         if (allNotes.size() > 2) {
//             System.out.println("\nTop 3 Oldest Notes (by creation date):");
//             final List<Note> oldestNotes = noteService.findOldestNotes(allNotes, 3);
//             noteService.displayNoteList(oldestNotes);
//         } else {
//             System.out.println("\nNot enough notes to show the oldest notes.");
//         }

//         // Find and display notes that have been modified recently.
//         System.out.println("\nNotes with Recent Activity (modified in last 30 days):");
//         final List<Note> recentNotes = noteService.findRecentActivity(allNotes, 30);
//         if (!recentNotes.isEmpty()) {
//             noteService.displayNoteList(recentNotes);
//         } else {
//             System.out.println("No recent note activity found in the last 30 days.");
//         }
//     }


//     //Handles the 'tags' command. Retrieves and displays all unique tags used across the entire note collection, sorted alphabetically.
//     private static void handleTags() {
//         final List<Note> allNotes = noteService.listAllNotes(); // Get all notes
//         final Set<String> allTags = noteService.getAllTags(allNotes); // Get all unique tags from notes

//         if (allTags.isEmpty()) {
//             System.out.println("No tags found in your notes. Start tagging your notes!");
//         } else {
//             System.out.println("--- All Unique Tags ---");
//             // Iterate through the sorted set of tags and print each one.
//             allTags.forEach(tag -> System.out.println("  - " + tag));
//             System.out.println("-----------------------\n");
//         }
//     }

//     // Handles the 'clear' command. Attempts to clear the terminal screen for a cleaner view.
//     private static void handleClear() {
//         try {
//             final String os = System.getProperty("os.name"); // Get the operating system name

//             if (os.contains("Windows")) {
//                 // For Windows, execute the 'cls' command.
//                 new ProcessBuilder("cmd", "/c", "cls")
//                     .inheritIO() // Inherit input/output streams of the parent process
//                     .start()     // Start the process
//                     .waitFor();  // Wait for the process to complete
//             } else {
//                 // For Unix-like systems (Linux, macOS), use ANSI escape codes.
//                 // "\033[H" moves cursor to home position (top-left).
//                 // "\033[2J" clears the screen from cursor to end.
//                 System.out.print("\033[H\033[2J");
//                 System.out.flush(); // Ensure the output is sent immediately
//             }
//         } catch (final Exception e) {
//             // If clearing fails (e.g., unsupported terminal), print a message and then
//             // just print a bunch of newlines to simulate clearing.
//             System.out.println("Could not clear screen. Reason: " + e.getMessage());
//             for (int i = 0; i < 50; ++i) System.out.println(); // Print 50 blank lines
//         }
//     }
// }







STATISTICS:
package com.pixelpages.model;

// import java.util.Map;

// public class Statistics {
//     private int totalNotes;
//     private int totalWords;
//     private int totalTags;
//     private Map<String, Integer> tagFrequency;

//     // Constructor
//     public Statistics(int totalNotes, int totalWords, int totalTags, Map<String, Integer> tagFrequency) {
//         this.totalNotes = totalNotes;
//         this.totalWords = totalWords;
//         this.totalTags = totalTags;
//         this.tagFrequency = tagFrequency;
//     }

//     // Getters
//     public int getTotalNotes() { return totalNotes; }
//     public int getTotalWords() { return totalWords; }
//     public int getTotalTags() { return totalTags; }
//     public Map<String, Integer> getTagFrequency() { return tagFrequency; }
// }







SEARCH QUERY
package com.pixelpages.model;

// import java.time.LocalDate;
// import java.util.Set;

// public class SearchQuery {
//     private String textQuery;
//     private Set<String> includeTags;
//     private Set<String> excludeTags;
//     private LocalDate afterDate;
//     private LocalDate beforeDate;
//     private boolean titleOnly;

//     // Constructor
//     public SearchQuery() {
//         this.includeTags = new java.util.HashSet<>();
//         this.excludeTags = new java.util.HashSet<>();
//     }

//     // Getters and setters
//     public String getTextQuery() { return textQuery; }
//     public void setTextQuery(String textQuery) { this.textQuery = textQuery; }
    
//     public Set<String> getIncludeTags() { return includeTags; }
//     public void setIncludeTags(Set<String> includeTags) { this.includeTags = includeTags; }
    
//     public Set<String> getExcludeTags() { return excludeTags; }
//     public void setExcludeTags(Set<String> excludeTags) { this.excludeTags = excludeTags; }
    
//     public LocalDate getAfterDate() { return afterDate; }
//     public void setAfterDate(LocalDate afterDate) { this.afterDate = afterDate; }
    
//     public LocalDate getBeforeDate() { return beforeDate; }
//     public void setBeforeDate(LocalDate beforeDate) { this.beforeDate = beforeDate; }
    
//     public boolean isTitleOnly() { return titleOnly; }
//     public void setTitleOnly(boolean titleOnly) { this.titleOnly = titleOnly; }
// }


NOTE: 
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;


public class Note {
	private String title;
	private String content;
	private LocalDateTime created;
	private LocalDateTime modified;
    private List<String> tags;
    private String filename;


    //----------- Constructors -----------

	public Note(String title, String content) {
		this.title = title;
		this.content = content;
		this.created = LocalDateTime.now();
		this.modified = LocalDateTime.now();
		this.tags = new ArrayList<>();
		//this.filename = title.replaceAll(" ", "_") + ".txt";
	}


    //Edge case -> Notes with full metadata
    public Note(String title, String content, LocalDateTime created, LocalDateTime modified, List<String> tags) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.content = Objects.requireNonNull(content, "Content cannot be null");
        this.created = Objects.requireNonNull(created, "Created date cannot be null");
        this.modified = Objects.requireNonNull(modified, "Modified date cannot be null");
        this.tags = (tags != null) ? new ArrayList<>(tags) : new ArrayList<>();
    }

    // Add this constructor to support Set<String> tags
    public Note(final String title, final String content, final LocalDateTime created,
                final LocalDateTime modified, final Set<String> tags) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.content = Objects.requireNonNull(content, "Content cannot be null");
        this.created = Objects.requireNonNull(created, "Created date cannot be null");
        this.modified = Objects.requireNonNull(modified, "Modified date cannot be null");
        // Convert Set<String> to List<String> for internal storage
        this.tags = (tags != null) ? new ArrayList<>(tags) : new ArrayList<>();
    }



    //----------- Getters and Setters -----------

	public String getTitle() {
		return title;
	}

    public void setTitle(String title) {
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.modified = LocalDateTime.now(); // Update the modified timestamp
	}


	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = Objects.requireNonNull(content, "Content cannot be null");
	}

	public LocalDateTime getCreated() {
		return created;
	}

    public void setCreated(LocalDateTime created) {
    this.created = Objects.requireNonNull(created, "Created date cannot be null");
    }

	public LocalDateTime getModified() {
		return modified;
	}

    public void setModified(LocalDateTime modified) {
        this.modified = Objects.requireNonNull(modified, "Modified date cannot be null");
    }

    public List<String> getTags() {
        return new ArrayList<>(tags);
    }

    public void setTags (List<String> tags) {
        this.tags = (tags == null) ? new ArrayList<>() : new ArrayList<>(tags);
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    // use override for debugging purposes
    @Override 
    public String toString() {
        return "Note{" +
                "title='" + title + '\'' +
                ", created=" + created +
                ", modified=" + modified +
                ", tags=" + tags +
                ", filename='" + filename + '\'' +
                '}';
    }

    @Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Note note = (Note) o;
		return Objects.equals(title, note.title) &&
				Objects.equals(content, note.content) &&
				Objects.equals(created, note.created) &&
				Objects.equals(modified, note.modified) &&
				Objects.equals(tags, note.tags) &&
				Objects.equals(filename, note.filename);
	}

    @Override
    public int hashCode() {
        return Objects.hash(title, content, created, modified, tags, filename);
    }

}







COMMAND LINE INTERFACE
package com.pixelpages.cli;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

//Represents a command in the command-line interface.
//Each command has a name, description, a list of arguments it expects,
// and an action (a functional interface) to be executed when the command is called.
public class PixelPagesCLI {

    private String name;
    private String description;
    private List<Argument> arguments;
    private Consumer<List<String>> action; // The method to call when this command is executed


    public PixelPagesCLI(String name, String description, Consumer<List<String>> action) {
        this.name = name;
        this.description = description;
        this.action = action;
        this.arguments = new ArrayList<>();
    }

    // --- Getters ---

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<Argument> getArguments() {
        return arguments; // Returns the direct list for internal modification by addArgument
    }


    public void addArgument(Argument argument) {
        this.arguments.add(argument);
    }

    public Consumer<List<String>> getAction() {
        return action;
    }

    // Argument for commands
    public static class Argument {
        private String name;
        private boolean required;
        private String description;
        private String type; // e.g., "string", "number", "boolean"


        // Constructs a new Argument

        public Argument(String name, boolean required, String description, String type) {
            this.name = name;
            this.required = required;
            this.description = description;
            this.type = type;
        }

        // --- Getters ---

        public String getName() {
            return name;
        }

        public boolean isRequired() {
            return required;
        }

        public String getDescription() {
            return description;
        }

        public String getType() {
            return type;
        }
    }
}







STORAGE: 
package src.main.java.com.pixelpages.storage;

import com.pixelpages.model.Note;
import com.pixelpages.model.SearchQuery;
import com.pixelpages.model.Statistics;
import com.pixelpages.util.DateUtil;
import com.pixelpages.util.FileUtil;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.*;

public class NoteStorage {
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";

    public NoteStorage() {
        FileUtil.ensureNotesDirectoryExists(NOTES_DIRECTORY);
    }

    public Note createNote(String title, String content, Set<String> tags) {
        return new Note(title, content, LocalDateTime.now(), LocalDateTime.now(), tags);
    }

    /**
     * Saves a {@link Note} object to a file on disk with YAML frontmatter.
     * This method formats the note's metadata into a YAML header
     * and combines it with the note's content before writing to the file.
     *
     * @param note     The {@link Note} object to save.
     * @param filename The full file path where the note should be saved.
     * @throws IOException If an error occurs during the file writing process.
     */
    public void saveNoteToFile(final Note note, final String filename) throws IOException {
        // Step 1: Prepare the note's metadata for conversion to YAML
        final Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("title", note.getTitle());
        metadata.put("created", DateUtil.formatDateTime(note.getCreated()));
        metadata.put("modified", DateUtil.formatDateTime(note.getModified()));
        metadata.put("tags", note.getTags());
        metadata.put("author", System.getProperty("user.name", "Unknown")); // Get system username
        metadata.put("status", "draft"); // Default status
        metadata.put("priority", 1); // Default priority

        // Step 2: Convert the metadata map into a YAML string
        final StringWriter writer = new StringWriter();
        yaml.dump(metadata, writer);
        final String yamlHeader = "---\n" + writer.toString() + "---\n\n";

        // Step 3: Combine the YAML header and the note's content
        final String fileContent = yamlHeader + note.getContent();

        // Step 4: Write the complete content to file with .md extension
        FileUtil.writeToFile(filename, fileContent);
        note.setFilename(filename);
    }

    public List<Note> listAllNotes() {
        // For now, return empty list - you can implement file reading later
        return new ArrayList<>();
    }

    public void displayNoteList(List<Note> notes) {
        if (notes.isEmpty()) {
            System.out.println("No notes found.");
            return;
        }
        
        for (int i = 0; i < notes.size(); i++) {
            Note note = notes.get(i);
            System.out.println((i + 1) + ". " + note.getTitle());
        }
    }

    // Stub methods - implement these later
    public SearchQuery parseSearchQuery(String query) { return new SearchQuery(); }
    public List<Note> advancedSearch(List<Note> notes, SearchQuery query) { return notes; }
    public Note editNote(Note note, Scanner scanner) { return note; }
    public void deleteNote(Note note) throws IOException { }
    public void displayNote(Note note) { 
        System.out.println("Title: " + note.getTitle());
        System.out.println("Content: " + note.getContent());
    }
    public Statistics generateStatistics(List<Note> notes) { 
        return new Statistics(0, 0, 0, new HashMap<>());
    }
    public void displayStatistics(Statistics stats) { 
        System.out.println("Total notes: " + stats.getTotalNotes());
    }
    public List<Note> findOrphanedNotes(List<Note> notes) { return new ArrayList<>(); }
    public List<Note> findOldestNotes(List<Note> notes, int limit) { return new ArrayList<>(); }
    public List<Note> findRecentActivity(List<Note> notes, int days) { return new ArrayList<>(); }
    public Set<String> getAllTags(List<Note> notes) { return new HashSet<>(); }

    public static String generateUniqueFilename(String title, String directory) {
        // Create a safe filename from the title
        String safeTitle = title.replaceAll("[^a-zA-Z0-9\\s]", "")
                               .replaceAll("\\s+", "_")
                               .toLowerCase();
        
        // Ensure the directory exists
        FileUtil.ensureNotesDirectoryExists(directory);
        
        String baseFilename = directory + "/" + safeTitle + ".md"; // Changed to .md
        String filename = baseFilename;
        int counter = 1;
        
        // If file exists, add a number to make it unique
        while (new java.io.File(filename).exists()) {
            filename = directory + "/" + safeTitle + "_" + counter + ".md"; // Changed to .md
            counter++;
        }
        
        return filename;
    }
}
