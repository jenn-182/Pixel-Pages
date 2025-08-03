package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import java.io.IOException;

public class InteractiveMenu {
    private final CommandHandler commandHandler;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;

    public InteractiveMenu(CommandHandler commandHandler, InputHandler inputHandler, OutputHandler outputHandler) {
        this.commandHandler = commandHandler;
        this.inputHandler = inputHandler;
        this.outputHandler = outputHandler;
    }

    public void start() throws IOException {
        while (true) {
            displayMainMenu();
            String choice = inputHandler.readLine("Choose your adventure! (Enter a number 0-10): ");

            try {
                if (handleMenuChoice(choice)) {
                    return; // Exit requested
                }
                pauseForUser();
            } catch (IOException e) {
                outputHandler.showError("404 ERROR: " + e.getMessage());
                pauseForUser();
            }
        }
    }

    private void displayMainMenu() {
        outputHandler.clear();
        outputHandler.displayMenuHeader();
    }

    private boolean handleMenuChoice(String choice) throws IOException {
        switch (choice.trim()) {
            case "1":
                return handleCreateNote();
            case "2":
                return handleListNotes();
            case "3":
                return handleSearchNotes();
            case "4":
                return handleReadNote();
            case "5":
                return handleEditNote();
            case "6":
                return handleDeleteNote();
            case "7":
                return handlePlayerStats();
            case "8":
                return handleAchievements();
            case "9":
                return handleBackup();
            case "10":
                return handleRefreshMenu();
            case "0":
                return handleExit();
            case "secret":
            case "eggs":
            case "eastereggs":
                return handleEasterEggs();
            default:
                outputHandler.showError("That's not on the menu, bud. Try again with an actual number...");
                return false;
        }
    }

    // Individual handler methods for cleaner code
    private boolean handleCreateNote() throws IOException {
        outputHandler.clear();
        outputHandler.displayCreateHeader();
        commandHandler.handleCreate();
        return false;
    }

    private boolean handleListNotes() throws IOException {
        outputHandler.clear();
        outputHandler.displayListHeader();
        String listQuery = inputHandler.readLine("Which log are you looking for? (Enter title or just press Enter for all): ");
        commandHandler.handleList(listQuery);
        return false;
    }

    private boolean handleSearchNotes() throws IOException {
        outputHandler.clear();
        outputHandler.displaySearchHeader();
        String searchQuery = inputHandler.promptWithRetry(
                "What are you scanning for? (Enter keyword): ",
                "Searching for nothing returned no results...");
        
        if (searchQuery != null) {
            commandHandler.handleSearch(searchQuery);
        } else {
            showReturnMessage();
        }
        return false;
    }

    private boolean handleReadNote() throws IOException {
        outputHandler.clear();
        outputHandler.displayReadHeader();
        String readId = inputHandler.promptWithRetry(
                "Which note do you want to open? (Enter note): ",
                "A note ID would be helpful... I'm not a mind reader!");
        
        if (readId != null) {
            commandHandler.handleRead(readId);
        } else {
            showReturnMessage();
        }
        return false;
    }

    private boolean handleEditNote() throws IOException {
        outputHandler.clear();
        outputHandler.displayEditHeader();
        String editId = inputHandler.promptWithRetry(
                "Which log needs editing? (Enter note title): ",
                "Which log exactly? I'm not a psychic...");
        
        if (editId != null) {
            commandHandler.handleEdit(editId);
        } else {
            showReturnMessage();
        }
        return false;
    }

    private boolean handleDeleteNote() throws IOException {
        outputHandler.clear();
        outputHandler.displayDeleteHeader();
        String deleteId = inputHandler.promptWithRetry(
                "Which note should we banish to the void? (Enter title): ",
                "Please specify a target for digital annihilation...");
        
        if (deleteId != null) {
            commandHandler.handleDelete(deleteId);
        } else {
            showReturnMessage();
        }
        return false;
    }

    private boolean handlePlayerStats() throws IOException {
        outputHandler.clear();
        commandHandler.executeCommand("stats", "");
        return false;
    }

    private boolean handleAchievements() throws IOException {
        outputHandler.clear();
        commandHandler.executeCommand("achievements", "");
        return false;
    }

    private boolean handleBackup() throws IOException {
        outputHandler.clear();
        commandHandler.executeCommand("backup", "");
        return false;
    }

    private boolean handleRefreshMenu() throws IOException {
        // Just refresh the menu - returning false will loop back to display
        return false;
    }

    private boolean handleExit() throws IOException {
        outputHandler.clear();
        outputHandler.displayLine("");
        outputHandler.displayLine("Exiting the digital realm...");
        outputHandler.displayLine("Farewell, brave digital explorer!");
        outputHandler.displayLine("");
        outputHandler.displayExitMessage();
        return true; // Exit requested
    }

    private boolean handleEasterEggs() throws IOException {
        try {
            outputHandler.clear();
            commandHandler.executeCommand("eastereggs", "");
        } catch (Exception e) {
            outputHandler.clear();
            outputHandler.displayEasterEggsHeader();
            outputHandler.showError("The secrets are too powerful for mere mortals... " + e.getMessage());
        }
        return false;
    }

    // Helper methods
    private void showReturnMessage() {
        outputHandler.displayLine("\n Returning to the last checkpoint...");
    }

    private void pauseForUser() throws IOException {
        outputHandler.displayLine("");
        outputHandler.displayLine("Press Enter to return to the last check point...");
        inputHandler.readLine();
    }
}
