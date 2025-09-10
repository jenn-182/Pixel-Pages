package com.pixelpages.controller;

import com.pixelpages.model.FocusSession;
import com.pixelpages.model.FocusCategory;
import com.pixelpages.service.FocusSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/focus/sessions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FocusSessionController {
    
    private final FocusSessionService focusSessionService;
    
    @Autowired
    public FocusSessionController(FocusSessionService focusSessionService) {
        this.focusSessionService = focusSessionService;
    }
    
    // GET /api/focus/sessions?username=user
    @GetMapping
    public ResponseEntity<List<FocusSession>> getFocusSessions(
            @RequestParam String username,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "true") boolean activeOnly) {
        
        try {
            List<FocusSession> sessions;
            
            if (category != null) {
                try {
                    FocusCategory focusCategory = FocusCategory.valueOf(category.toUpperCase());
                    sessions = focusSessionService.getSessionsByCategory(username, focusCategory);
                } catch (IllegalArgumentException e) {
                    // Invalid category provided
                    return ResponseEntity.badRequest().build();
                }
            } else if (activeOnly) {
                sessions = focusSessionService.getActiveSessionsByUser(username);
            } else {
                sessions = focusSessionService.getSessionsByUser(username);
            }
            
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/sessions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<FocusSession> getFocusSession(@PathVariable Long id) {
        try {
            Optional<FocusSession> session = focusSessionService.getSessionById(id);
            return session.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // POST /api/focus/sessions
    @PostMapping
    public ResponseEntity<FocusSession> createFocusSession(@RequestBody Map<String, Object> sessionData) {
        try {
            String name = (String) sessionData.get("name");
            String description = (String) sessionData.get("description");
            String colorCode = (String) sessionData.get("colorCode");
            String categoryStr = (String) sessionData.get("category");
            Integer workDuration = (Integer) sessionData.get("workDuration");
            Integer breakDuration = (Integer) sessionData.get("breakDuration");
            Integer cycles = (Integer) sessionData.get("cycles");
            String ownerUsername = (String) sessionData.get("ownerUsername");
            
            if (name == null || ownerUsername == null) {
                return ResponseEntity.badRequest().build();
            }
            
            FocusCategory category = null;
            if (categoryStr != null) {
                try {
                    category = FocusCategory.valueOf(categoryStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid category provided
                    return ResponseEntity.badRequest().build();
                }
            }
            
            FocusSession session = focusSessionService.createSession(
                name, description, colorCode, category, workDuration, 
                breakDuration, cycles, ownerUsername
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(session);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // PUT /api/focus/sessions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<FocusSession> updateFocusSession(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> sessionData) {
        try {
            String name = (String) sessionData.get("name");
            String description = (String) sessionData.get("description");
            String colorCode = (String) sessionData.get("colorCode");
            String categoryStr = (String) sessionData.get("category");
            Integer workDuration = (Integer) sessionData.get("workDuration");
            Integer breakDuration = (Integer) sessionData.get("breakDuration");
            Integer cycles = (Integer) sessionData.get("cycles");
            Boolean isActive = (Boolean) sessionData.get("isActive");
            
            FocusCategory category = null;
            if (categoryStr != null) {
                try {
                    category = FocusCategory.valueOf(categoryStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid category provided
                    return ResponseEntity.badRequest().build();
                }
            }
            
            FocusSession session = focusSessionService.updateSession(
                id, name, description, colorCode, category, 
                workDuration, breakDuration, cycles, isActive
            );
            
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // DELETE /api/focus/sessions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFocusSession(@PathVariable Long id) {
        try {
            boolean deleted = focusSessionService.deleteSession(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Session deactivated"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // GET /api/focus/sessions/stats?username=user
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSessionStats(@RequestParam String username) {
        try {
            Long totalSessions = focusSessionService.getTotalSessionCount(username);
            List<FocusSession> activeSessions = focusSessionService.getActiveSessionsByUser(username);
            
            Map<String, Object> stats = Map.of(
                "totalSessions", totalSessions,
                "activeSessions", activeSessions.size(),
                "sessions", activeSessions
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}