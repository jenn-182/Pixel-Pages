package com.pixelpages.cli;

import com.pixelpages.io.OutputHandler;

public class CLIOutputHandler implements OutputHandler {
    private final UIRenderer ui;

    public CLIOutputHandler(UIRenderer ui) {
        this.ui = ui;
    }

    @Override
    public void display(String message) {
        System.out.print(message);
    }

    @Override
    public void displayLine(String message) {
        System.out.println(message);
    }

    @Override
    public void showError(String error) {
        ui.displayErrorMessage(error);
    }

    @Override
    public void showSuccess(String success) {
        System.out.println("SUCCESS: " + success);
    }

    @Override
    public void showWarning(String warning) {
        System.out.println("ERROR 404: " + warning);
    }

    @Override
    public void clear() {
        ui.flushScreen();
    }

    @Override
    public void displayHeader(String title) {
        ui.displayWelcomeHeader();
        System.out.println();
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.printf("│%63s│%n", " ");
        System.out.printf("│%31s%32s│%n", title, " ");
        System.out.printf("│%63s│%n", " ");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    @Override
    public void displayMenuHeader() {
        ui.displayMenuHeader();
    }

    @Override
    public void displayCreateHeader() {
        ui.displayCreateHeader();
    }

    @Override
    public void displayListHeader() {
        ui.displayListHeader();
    }

    @Override
    public void displaySearchHeader() {
        ui.displaySearchHeader();
    }

    @Override
    public void displayReadHeader() {
        ui.displayReadHeader();
    }

    @Override
    public void displayEditHeader() {
        ui.displayEditHeader();
    }

    @Override
    public void displayDeleteHeader() {
        ui.displayDeleteHeader();  // Fixed: was printDeleteHeader()
    }

    @Override
    public void displayExitMessage() {
        ui.displayExitMessage();
    }

    @Override
    public void displayEasterEggsHeader() {
        ui.displayEasterEggsHeader();  // Fixed: was empty implementation
    }

    // @Override
    // public void displayPlayerProfileHeader() {
    //     ui.displayPlayerProfileHeader();  // Added missing method
    // }

    // @Override
    // public void displayAchievementsHeader() {
    //     ui.displayAchievementsHeader();  // Added missing method
    // }

    // @Override
    // public void displayBackupHeader() {
    //     ui.displayBackupHeader();  // Added missing method
    // }
}
