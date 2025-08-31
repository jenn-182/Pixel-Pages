package com.pixelpages.controller;

import com.pixelpages.model.Notebook;
import com.pixelpages.service.NotebookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notebooks")
public class NotebookController {

    private final NotebookService notebookService;

    public NotebookController(NotebookService notebookService) {
        this.notebookService = notebookService;
    }

    // Get all notebooks
    @GetMapping
    public ResponseEntity<List<Notebook>> getAllNotebooks() {
        try {
            List<Notebook> notebooks = notebookService.getAllNotebooks();
            return ResponseEntity.ok(notebooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get notebooks in a specific folder
    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<Notebook>> getNotebooksInFolder(@PathVariable Long folderId) {
        try {
            List<Notebook> notebooks = notebookService.getNotebooksInFolder(folderId);
            return ResponseEntity.ok(notebooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get notebooks not in any folder
    @GetMapping("/no-folder")
    public ResponseEntity<List<Notebook>> getNotebooksWithoutFolder() {
        try {
            List<Notebook> notebooks = notebookService.getNotebooksInFolder(null);
            return ResponseEntity.ok(notebooks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get notebook by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notebook> getNotebookById(@PathVariable Long id) {
        try {
            Optional<Notebook> notebook = notebookService.getNotebookById(id);
            return notebook.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create new notebook
    @PostMapping("/create")
    public ResponseEntity<Notebook> createNotebook(@RequestBody CreateNotebookRequest request) {
        try {
            Notebook notebook = notebookService.createNotebook(
                request.getName(),
                request.getDescription(),
                request.getColorCode(),
                request.getFolderId()
            );
            return ResponseEntity.ok(notebook);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update existing notebook
    @PutMapping("/{id}")
    public ResponseEntity<Notebook> updateNotebook(@PathVariable Long id, @RequestBody UpdateNotebookRequest request) {
        try {
            Notebook notebook = notebookService.updateNotebook(
                id,
                request.getName(),
                request.getDescription(),
                request.getColorCode(),
                request.getTags(),
                request.getFolderId()  // Add folderId parameter
            );
            return ResponseEntity.ok(notebook);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public static class CreateNotebookRequest {
        private String name;
        private String description;
        private String colorCode;
        private Long folderId;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getColorCode() { return colorCode; }
        public void setColorCode(String colorCode) { this.colorCode = colorCode; }
        
        public Long getFolderId() { return folderId; }
        public void setFolderId(Long folderId) { this.folderId = folderId; }
    }

    public static class UpdateNotebookRequest {
        private String name;
        private String description;
        private String colorCode;
        private String tags;
        private Long folderId;  // Add folderId field

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getColorCode() { return colorCode; }
        public void setColorCode(String colorCode) { this.colorCode = colorCode; }

        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }

        public Long getFolderId() { return folderId; }  // Add getter
        public void setFolderId(Long folderId) { this.folderId = folderId; }  // Add setter
    }
}
