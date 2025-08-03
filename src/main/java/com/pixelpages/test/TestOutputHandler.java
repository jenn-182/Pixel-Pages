package com.pixelpages.test;

import com.pixelpages.io.OutputHandler;
import java.util.ArrayList;
import java.util.List;

public class TestOutputHandler implements OutputHandler {
    private final List<String> messages = new ArrayList<>();
    private final List<String> errors = new ArrayList<>();
    
    @Override
    public void display(String message) {
        messages.add(message);
    }
    
    @Override
    public void displayLine(String message) {
        messages.add(message);
    }
    
    @Override
    public void showError(String error) {
        errors.add(error);
    }
    
    @Override
    public void showSuccess(String success) {
        messages.add("SUCCESS: " + success);
    }
    
    @Override
    public void showWarning(String warning) {
        messages.add("WARNING: " + warning);
    }
    
    @Override
    public void clear() {
        // Do nothing in tests
    }
    
    // All the display methods do nothing in tests
    @Override public void displayHeader(String title) {}
    @Override public void displayMenuHeader() {}
    @Override public void displayCreateHeader() {}
    @Override public void displayListHeader() {}
    @Override public void displaySearchHeader() {}
    @Override public void displayReadHeader() {}
    @Override public void displayEditHeader() {}
    @Override public void displayDeleteHeader() {}
    @Override public void displayExitMessage() {}
    @Override public void displayEasterEggsHeader() {}
    
    // Test helper methods
    public List<String> getMessages() { return new ArrayList<>(messages); }
    public List<String> getErrors() { return new ArrayList<>(errors); }
    public boolean hasMessage(String message) { return messages.contains(message); }
    public boolean hasError(String error) { return errors.contains(error); }
}
