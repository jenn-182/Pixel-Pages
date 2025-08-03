package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import com.pixelpages.storage.NoteStorage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class CLIApplication {
    private static final String NOTES_DIRECTORY = "pixel_pages_notes";
    
    private final NoteStorage noteStorage;
    private final BufferedReader reader;
    private final InputHandler inputHandler;
    private final OutputHandler outputHandler;
    private final CommandHandler commandHandler;
    private final InteractiveMenu interactiveMenu;
    private final UIRenderer ui;

    public CLIApplication() {
        this.noteStorage = new NoteStorage(NOTES_DIRECTORY);
        this.reader = new BufferedReader(new InputStreamReader(System.in));
        this.ui = new UIRenderer();
        
        // Create handlers
        this.outputHandler = new CLIOutputHandler(ui);
        this.inputHandler = new CLIInputHandler(reader, outputHandler);
        
        // Create NewFeatureHandler
        NewFeatureHandler newFeatureHandler = new NewFeatureHandler(noteStorage, inputHandler, outputHandler, ui);

        // NewFeatureHandler to UIRenderer for random facts
        this.ui.setNewFeatureHandler(newFeatureHandler);

        this.commandHandler = new CommandHandler(noteStorage, inputHandler, outputHandler, ui);
        this.interactiveMenu = new InteractiveMenu(commandHandler, inputHandler, outputHandler);
    }

    public void runInteractiveMode() throws IOException {
        try {
            interactiveMenu.start();
        } finally {
            cleanup();
        }
    }

    public void processCommandLineArgs(String[] args) throws IOException {
        try {
            outputHandler.clear();
            
            if (args[0].equals("--help")) {
                outputHandler.displayHeader("GAME MANUAL");
                commandHandler.executeCommand("help", "");
                return;
            }

            String command = args[0];
            String argument = String.join(" ", Arrays.copyOfRange(args, 1, args.length)).trim();
            
            commandHandler.executeCommand(command, argument);
            
        } catch (IOException e) {
            outputHandler.showError("Error: " + e.getMessage());
        } finally {
            cleanup();
        }
    }

    private void cleanup() throws IOException {
        reader.close();
    }
}
