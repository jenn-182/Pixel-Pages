package com.pixelpages.io;

public interface OutputHandler {
    void display(String message);
    void displayLine(String message);
    void showError(String error);
    void showSuccess(String success);
    void showWarning(String warning);
    void clear();
    void displayHeader(String title);
    void displayMenuHeader();
    void displayCreateHeader();
    void displayListHeader();
    void displaySearchHeader();
    void displayReadHeader();
    void displayEditHeader();
    void displayDeleteHeader();
    void displayExitMessage();
    void displayEasterEggsHeader(); 
}
