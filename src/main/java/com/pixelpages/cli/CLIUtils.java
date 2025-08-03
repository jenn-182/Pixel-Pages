package com.pixelpages.cli;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Random;

public class CLIUtils {

    public static String readUserInput(BufferedReader reader, String prompt) throws IOException {
        System.out.print(prompt);
        return reader.readLine().trim();
    }

    public static String promptWithRetry(BufferedReader reader, UIRenderer ui,
            String prompt, String errorMessage) throws IOException {
        String[] funnyRetryMessages = {
                "That was... underwhelming. Care to try again?",
                "Error 404: Brain.exe has stopped working. Try again.",
                "ACCESS DENIED! You shall not pass!",
                "ERROR: Invalid input. Please try again.",
        };

        Random random = new Random();
        int attempts = 0;

        while (true) {
            String input = readUserInput(reader, prompt);

            if (input != null && !input.trim().isEmpty()) {
                return input.trim();
            }

            if (attempts == 0) {
                ui.displayErrorMessage(errorMessage);
            } else {

                // Use different error messages for multiple attempts
                String message = (attempts - 1) < funnyRetryMessages.length ? funnyRetryMessages[attempts - 1]
                        : funnyRetryMessages[random.nextInt(funnyRetryMessages.length)];

                ui.displayErrorMessage(message);
                System.out.println();
            }

            attempts++;

            System.out.println();
            String retry = readUserInput(reader, "Want to redeem yourself? (y/n): ");

            if (!retry.toLowerCase().startsWith("y")) {
                return null;
            }

            System.out.println();

            if (attempts >= 5) {
                ui.displayErrorMessage("Okay, I give up. You win this round.");
                return null;
            }

            ui.flushScreen();
            ui.displayCreateHeader();
            System.out.println();
        }
    }
}