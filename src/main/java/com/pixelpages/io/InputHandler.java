package com.pixelpages.io;

import java.io.IOException;

public interface InputHandler {
    String readLine(String prompt) throws IOException;
    String readLine() throws IOException;
    String readMultilineUntil(String terminator) throws IOException;
    String promptWithRetry(String prompt, String errorMessage) throws IOException;
    boolean confirm(String question) throws IOException;
}
