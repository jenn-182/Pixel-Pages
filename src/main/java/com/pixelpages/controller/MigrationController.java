package com.pixelpages.controller;

import com.pixelpages.service.MigrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/migration")
@CrossOrigin(origins = "http://localhost:3000")
public class MigrationController {
    
    private final MigrationService migrationService;
    
    public MigrationController(MigrationService migrationService) {
        this.migrationService = migrationService;
    }
    
    @PostMapping("/import-notes")
    public ResponseEntity<Map<String, Object>> importExistingNotes(
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        try {
            Map<String, Object> result = migrationService.importNotesFromDirectory(username);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Migration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/create-sample")
    public ResponseEntity<Map<String, Object>> createSampleData(
            @RequestParam(defaultValue = "PixelAdventurer") String username) {
        try {
            Map<String, Object> result = migrationService.createSampleNotes(username);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Sample creation failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getMigrationStatus() {
        Map<String, Object> status = migrationService.checkMigrationStatus();
        return ResponseEntity.ok(status);
    }
}
