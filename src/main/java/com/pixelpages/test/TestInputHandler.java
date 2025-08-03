package com.pixelpages.test;

import com.pixelpages.io.InputHandler;
import java.util.LinkedList;
import java.util.Queue;

public class TestInputHandler implements InputHandler {
    private final Queue<String> responses = new LinkedList<>();
    
    public void addResponse(String response) {
        responses.offer(response);
    }
    
    @Override
    public String readLine(String prompt) {
        return responses.poll();
    }
    
    @Override
    public String readLine() {
        return responses.poll();
    }
    
    @Override
    public String readMultilineUntil(String terminator) {
        return responses.poll(); // Simplified for testing
    }
    
    @Override
    public String promptWithRetry(String prompt, String errorMessage) {
        return responses.poll();
    }
    
    @Override
    public boolean confirm(String question) {
        String response = responses.poll();
        return response != null && response.toLowerCase().startsWith("y");
    }
}
