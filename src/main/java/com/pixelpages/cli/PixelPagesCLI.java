package com.pixelpages.cli;

import java.io.IOException;

public class PixelPagesCLI {

    public static void main(String[] args) throws IOException {
        CLIApplication app = new CLIApplication();

        if (args.length == 0) {
            app.runInteractiveMode();
        } else {
            app.processCommandLineArgs(args);
        }
    }
}
