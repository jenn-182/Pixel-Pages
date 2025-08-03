package com.pixelpages.cli;

public class UIRenderer {
    private NewFeatureHandler newFeatureHandler; // Add this field

    // Add setter method to inject NewFeatureHandler
    public void setNewFeatureHandler(NewFeatureHandler newFeatureHandler) {
        this.newFeatureHandler = newFeatureHandler;
    }

    public void flushScreen() {
        System.out.print("\033[2J\033[H");
        System.out.flush();
    }

    public void displayWelcomeHeader() {
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                                                  ║");
        System.out.println("║ ██████╗ ██╗██╗  ██╗███████╗██╗         ██████╗  █████╗  ██████╗ ███████╗███████╗ ║");
        System.out.println("║ ██╔══██╗██║╚██╗██╔╝██╔════╝██║         ██╔══██╗██╔══██╗██╔════╝ ██╔════╝██╔════╝ ║");
        System.out.println("║ ██████╔╝██║ ╚███╔╝ █████╗  ██║         ██████╔╝███████║██║  ███╗█████╗  ███████╗ ║");
        System.out.println("║ ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║         ██╔═══╝ ██╔══██║██║   ██║██╔══╝  ╚════██║ ║");
        System.out.println("║ ██║     ██║██╔╝ ██╗███████╗███████╗    ██║     ██║  ██║╚██████╔╝███████╗███████║ ║");
        System.out.println("║ ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝ ║");
        System.out.println("║                                                                                  ║");
        System.out.println("║                          Your Digital Quest Log                                  ║");
        System.out.println("║                                                                                  ║");
        System.out.println("╚══════════════════════════════════════════════════════════════════════════════════╝");
        System.out.println();
    }

    public void displayMenuHeader() {
        flushScreen();
        displayWelcomeHeader();

        // Display user rank
        if (newFeatureHandler != null) {
            String userRank = newFeatureHandler.getUserRank();
            String rankText = "CURRENT RANK: " + userRank;
            int totalWidth = 82;
            int leftPadding = (totalWidth - rankText.length()) / 2;

            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.printf("%" + leftPadding + "s%s%" + (totalWidth - leftPadding - rankText.length()) + "s%n", "",
                    rankText, "");
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println();
        } else {
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.printf("%" + 40 + "s%s%" + 40 + "s%n", "", "CURRENT RANK: UNRANKED", "");
            System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            System.out.println();
        }

        System.out.println();
        System.out.println("Welcome to Campaign Mode!");
        System.out.println();
        System.out.println("Pick a console command, but choose wisely!: ");
        System.out.println();
        System.out.println("   1.   CRAFT: Forge a new note to help you with a quest.");
        System.out.println("   2.   INVENTORY: Review all of your past mission logs.");
        System.out.println("   3.   SEARCH: Use magnifying glass to find specific keywords.");
        System.out.println("   4.   OPEN LOG: Re-read one of your quest log entries.");
        System.out.println("   5.   UPGRADE: Summon a sacred quil to edit notes and rewrite destiny.");
        System.out.println("   6.   DELETE: Banish one of your log entries to the digital void.");
        System.out.println("   7.   PLAYER PROFILE: View your player rank and detailed statistics.");
        System.out.println("   8.   ACHIEVEMENTS: Check completed achievements & easter eggs found.");
        System.out.println("   9.   SAVE GAME: Backup your logs before the final boss fight.");
        System.out.println("  10.   TUTORIAL: Feeling lost? Check the game manual.");
        System.out.println();
        System.out.println("   0.   RAGE QUIT: Exits the digital realm and returns to reality.");
        System.out.println();
        System.out.println();
        System.out.println("(psst... try typing 'secret' if you're feeling adventurous...)");
        System.out.println();
        System.out.println();
    }

    // Display help information for the CLI commands
    public void displayHelp() {
        flushScreen();
        displayWelcomeHeader();
        System.out.println();
        System.out.println("                 --- Try running ./notes for Interactive Mode! ---");
        System.out.println();
        System.out.println();
        System.out.println("Try one of these commands:");
        System.out.println();
        System.out.println("  ./notes create               - Forge a new note to help you with a quest.");
        System.out.println("  ./notes list                 - Review all of your past mission logs.");
        System.out.println("  ./notes search <query>       - Use magnifying glass to find specific keywords.");
        System.out.println("  ./notes read <note-id>       - Re-read one of your quest log entries.");
        System.out.println("  ./notes edit <note-id>       - Summon a sacred quil to edit notes and rewrite destiny.");
        System.out.println("  ./notes delete <note-id>     - Banish one of your log entries to the digital void");
        System.out.println(
                "  ./notes stats                - Unleash the data goblins to analyze your note-taking habits.");
        System.out.println("  ./notes achievements         - View your player rank and detailed statistics.");
        System.out.println("  ./notes backup               - Save your logs before the final boss fight.");
        System.out.println("  ./notes --help               - Summons the ancient scrolls of guidance. Use wisely!");
        System.out.println();
        System.out.println("  ./notes exit                 - Exits the digital realm and returns to reality.");
        System.out.println();
        System.out.println("  ./notes secret               - Uncover hidden achievements and easter eggs!");
        System.out.println();
    }

    public void displayCreateHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                  ENTERING CREATIVE MODE...                  │");
        System.out.println("│          (Create a new note to help you with a quest)       │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayListHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                   INVENTORY MANAGEMENT                      │");
        System.out.println("│                   & QUEST LOG ARCHIVES                      │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayDeleteHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│              INITIALIZING DOOMSDAY PROTOCOL                 │");
        System.out.println("│                THIS IS FINE. (Probably...)                  │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displaySearchHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│            YOUR NOTES ARE OUT THERE. SOMEWHERE.             │");
        System.out.println("│                Using magnifying glass....                   │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayErrorMessage(String message) {
        flushScreen();
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                YOU'VE FOUND A SECRET LEVEL!                 │");
        System.out.println("│             Just kidding. This is just an error...          │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
        System.out.println(String.format("%-43s", message));
    }

    public void displayReadHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                      OPEN LOG AND                           │");
        System.out.println("│                   REVIEW PAST MISSIONS                      │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayEditHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                ENCHANTMENT TABLE ACTIVATED                  │");
        System.out.println("│                  Lets upgrade your logs!                    │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayExitMessage() {
        flushScreen();
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│               RAGE QUIT SEQUENCE INITIATED...               │");
        System.out.println("│                                                             │");
        System.out.println("│                       Just kidding.                         │");
        System.out.println("│                  Game saved successfully!                   │");
        System.out.println("│                                                             │");
        System.out.println("│           You may now return to your human life.            │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
        System.out.println("            Thank you for playing Pixel Pages!                 ");
        System.out.println();
        System.out.println("            Farewell, brave digital explorer!                  ");

    }

    public void displayEasterEggsHeader() {
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                              ║");
        System.out.println("║        SECRET LEVEL UNLOCKED - EASTER EGG DISCOVERIES        ║");
        System.out.println("║                                                              ║");
        System.out.println("║    You've uncovered hidden achievements and easter eggs!     ║");
        System.out.println("║          These secrets are known only to legends...          ║");
        System.out.println("║                                                              ║");
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
        System.out.println();
    }

    public void displayPlayerProfileHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                PLAYER PROFILE & LVL RANKING                 │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayAchievementsHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                CURRENT PLAYER ACHIEVEMENTS                  │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

    public void displayBackupHeader() {
        System.out.println("╭─────────────────────────────────────────────────────────────╮");
        System.out.println("│                                                             │");
        System.out.println("│                GAME SAVE BACKUP PROTOCOL                    │");
        System.out.println("│         Protecting your progress from corruption...         │");
        System.out.println("│                                                             │");
        System.out.println("╰─────────────────────────────────────────────────────────────╯");
        System.out.println();
    }

}
