package com.pixelpages.controller;

import com.pixelpages.model.Folder;
import com.pixelpages.service.FolderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    // Get all root folders
    @GetMapping
    public List<Folder> getRootFolders() {
        return folderService.getRootFolders();
    }

    // CREATE endpoint - put this BEFORE the {id} mapping
    @PostMapping("/create")
    public ResponseEntity<Folder> createFolder(@RequestBody CreateFolderRequest request) {
        try {
            Folder folder = folderService.createFolder(
                request.getName(), 
                request.getDescription(), 
                request.getColorCode(), 
                request.getParentFolderId()
            );
            return ResponseEntity.ok(folder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get folder by ID - put this AFTER the /create mapping
    @GetMapping("/{id}")
    public ResponseEntity<Folder> getFolderById(@PathVariable Long id) {
        Optional<Folder> folder = folderService.getFolderById(id);
        return folder.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Update folder
    @PutMapping("/{id}")
    public ResponseEntity<Folder> updateFolder(
            @PathVariable Long id,
            @RequestBody UpdateFolderRequest request) {
        try {
            Folder folder = folderService.updateFolder(id, request.getName(), 
                request.getDescription(), request.getColorCode());
            return ResponseEntity.ok(folder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete folder
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id, 
            @RequestParam(defaultValue = "false") boolean moveContentsToParent) {
        try {
            folderService.deleteFolder(id, moveContentsToParent);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Search folders
    @GetMapping("/search")
    public List<Folder> searchFolders(@RequestParam String query) {
        return folderService.searchFolders(query);
    }

    // Request DTOs
    public static class CreateFolderRequest {
        private String name;
        private String description;
        private String colorCode;
        private Long parentFolderId;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getColorCode() { return colorCode; }
        public void setColorCode(String colorCode) { this.colorCode = colorCode; }

        public Long getParentFolderId() { return parentFolderId; }
        public void setParentFolderId(Long parentFolderId) { this.parentFolderId = parentFolderId; }
    }

    public static class UpdateFolderRequest {
        private String name;
        private String description;
        private String colorCode;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getColorCode() { return colorCode; }
        public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    }
}
