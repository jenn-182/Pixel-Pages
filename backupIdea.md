import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.Scanner;
import org.yaml.snakeyaml.Yaml;

public class PixelPagesManager {

    // ------Configuration and Initialization------

    // // Notes Directory:
    // public static final String NOTES_DIRECTORY = "pixel_pages_notes";

    // // Default Editor: Linux/mac
    // public static final String DEFAULT_EDITOR_MAC = "nano %";

    // // Default Editor: Windows
    // public static final String DEFAULT_EDITOR_WINDOWS = "notepad.exe %";

    // // Editor command for mac
    // // public static String editorCommand;

    // // Scanner used to read input
    // public static Scanner scanner = new Scanner(System.in);

    // // Yaml -> used for parsing YAML strings into java Maps and back into YAML strings
    // public static Yaml yaml = new Yaml();



    // Inner class to represent a Page
    public static class Page {
        private String id;
        private String title;
        private List<String> tags;
        private Instant createdAt;
        private Instant updatedAt;
        private String content;
        
        // Default constructor for creating new pages
        public Page() {
            this.id = UUID.randomUUID().toString(); // Generate unique ID
            this.createdAt = Instant.now(); // Set creation time to now
            this.updatedAt = Instant.now(); // Set update time to now
            this.title = "New Page"; // Default title for new pages
            this.tags = new ArrayList<>(); // Initialize tags as an empty list
            this.content = ""; // Default as an empty string
        }

        // Parameterized constructor for creating a Page object from pre-existing data.
        // This is primarily used when parsing a page from a file.
        // It includes `Objects.requireNonNull` for basic null checks on critical fields,
        // contributing to basic error handling/robustness.
        // @param id The unique identifier.
        // @param title The page's title.
        // @param tags A list of tags.
        // @param createdAt The creation timestamp.
        // @param updatedAt The last update timestamp.
        // @param content The page's body content.
        public Page(String id, String title, List<String> tags, Instant createdAt, Instant updatedAt, String content) {
            this.id = Objects.requireNonNull(id, "Page ID cannot be null");
            this.title = Objects.requireNonNull(title, "Page title cannot be null");
            this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
            this.createdAt = Objects.requireNonNull(createdAt, "Page creation timestamp cannot be null");
            this.updatedAt = Objects.requireNonNull(updatedAt, "Page update timestamp cannot be null");
            this.content = Objects.requireNonNull(content, "Page content cannot be null");
        }

        //-------Getters--------

        public String getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }
        
        // Add other getters as needed
        public List<String> getTags() {
            return new ArrayList<>(tags); // Return defensive copy
        }
        
        public Instant getCreatedAt() {
            return createdAt;
        }
        
        public Instant getUpdatedAt() {
            return updatedAt;
        }
        
        public String getContent() {
            return content;
        }

        //-------Setters--------

        public void setTitle(String title) {
            this.title = title;
            this.updatedAt = Instant.now(); // Update the timestamp whenever the title is changed
        }

        public void setTags(List<String> tags) {
            this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>(); // Ensure tags is not null, initialize as empty if it is
            this.updatedAt = Instant.now(); // Update the timestamp whenever tags are changed
        }

        public void setContent(String content) {
            this.content = content;
            this.updatedAt = Instant.now(); // Update the timestamp whenever content is changed
        }

        // Static factory method to create a Page object from a raw string representing the page file's content.
        // This method parses the YAML header and the main content body.

        public static Page fromFileContent(String fileContent) {
            
            // Find the index of the YAML header separator "\n---\n".
            // We specifically look for newlines around '---' to distinguish it from '---' within content.
            int separatorIndex = fileContent.indexOf("\n---\n");
            if (separatorIndex == -1) {
                // If the separator is not found, the file is malformed.
                throw new IllegalArgumentException("Invalid page format: Missing YAML header separator (---).");
            }

            // Extract the YAML header part (from beginning to separator) and trim whitespace.
            String yamlHeader = fileContent.substring(0, separatorIndex).trim();
            // Extract the content body (after the separator) and trim whitespace.
            String contentBody = fileContent.substring(separatorIndex + "\n---\n".length()).trim();

            Map<String, Object> metadata = null;
            try {
                // Use SnakeYAML to parse the YAML header string into a Java Map.
                metadata = yaml.load(yamlHeader);
            } catch (Exception e) {
                // Catch any exceptions during YAML parsing (e.g., syntax errors in YAML).
                throw new IllegalArgumentException("Invalid YAML header: " + e.getMessage(), e);
            }

            if (metadata == null) {
                // If YAML parsing results in a null map, the header was empty or unparseable.
                throw new IllegalArgumentException("Invalid page format: YAML header is empty or malformed.");
            }

            // Extract fields from the metadata map, ensuring they are not null.
            String id = (String) metadata.get("id");
            String title = (String) metadata.get("title");

            // Use @SuppressWarnings to avoid unchecked cast warning for tags.
            @SuppressWarnings("unchecked")

            List<String> tags = (List<String>) metadata.getOrDefault("tags", Collections.emptyList());

            Instant createdAt = Instant.parse((String) metadata.get("createdAt"));
            Instant updatedAt = Instant.parse((String) metadata.get("updatedAt"));

            if (id == null || title == null || tags == null || createdAt == null || updatedAt == null) {
                throw new IllegalArgumentException("Missing required metadata fields (id, title, created_at, updated_at).");
            }

            // Create and return a new Page object using the extracted fields.
            return new Page(id, title, tags, createdAt, updatedAt, contentBody);
        }
    }
    
    // Main method - entry point of the application
    public static void main(String[] args) {
        System.out.println("Pixel Pages Manager started!");
        
        // TODO: Add your application logic here
        
        // Close scanner when done
        scanner.close();
    }
}