package com.pixelpages.cli;

import com.pixelpages.io.InputHandler;
import com.pixelpages.io.OutputHandler;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Random;

public class CLIInputHandler implements InputHandler {
    private final BufferedReader reader;
    private final OutputHandler outputHandler;

    public CLIInputHandler(BufferedReader reader, OutputHandler outputHandler) {
        this.reader = reader;
        this.outputHandler = outputHandler;
    }

    @Override
    public String readLine(String prompt) throws IOException {
        System.out.print(prompt);
        String input = reader.readLine();
        return input != null ? input.trim() : "";
    }

    @Override
    public String readLine() throws IOException {
        String input = reader.readLine();
        return input != null ? input.trim() : "";
    }

    @Override
    public String readMultilineUntil(String terminator) throws IOException {
        StringBuilder contentBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.equalsIgnoreCase(terminator)) {
                break;
            }
            contentBuilder.append(line).append("\n");
        }
        return contentBuilder.toString().trim();
    }

    @Override
    public String promptWithRetry(String prompt, String errorMessage) throws IOException {
        String[] funnyRetryMessages = {
                "Try again, but with more brain cells this time...",
                "That was... underwhelming. Care to try again?",
                "Error 404: Brain.exe has stopped working. Try again.",
                "ACCESS DENIED! You shall not pass!",
                "Please reevaluate your life choices and try again.",
                "Welp, that didn't work. It's probably user error...just saying."
        };

        Random random = new Random();
        int attempts = 0;

        while (true) {
            String input = readLine(prompt);

            if (input != null && !input.trim().isEmpty()) {
                return input.trim();
            }

            if (attempts == 0) {
                outputHandler.showError(errorMessage);
            } else {
                String message = (attempts - 1) < funnyRetryMessages.length 
                    ? funnyRetryMessages[attempts - 1]
                    : funnyRetryMessages[random.nextInt(funnyRetryMessages.length)];
                outputHandler.showError(message);
            }

            attempts++;
            
            String retry = readLine("\nWant to redeem yourself? (y/n): ");
            if (!retry.toLowerCase().startsWith("y")) {
                return null;
            }

            if (attempts >= 5) {
                outputHandler.showError("Okay, I give up. You win this round.");
                return null;
            }

            outputHandler.clear();
            outputHandler.displayCreateHeader();
        }
    }

    @Override
    public boolean confirm(String question) throws IOException {
        String response = readLine(question + " (y/n): ");
        return response.toLowerCase().startsWith("y");
    }
}
