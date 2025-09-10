package com.pixelpages.service;

import com.pixelpages.model.FocusSession;
import com.pixelpages.model.FocusCategory;
import com.pixelpages.repository.FocusSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FocusSessionService {
    
    private final FocusSessionRepository focusSessionRepository;
    
    @Autowired
    public FocusSessionService(FocusSessionRepository focusSessionRepository) {
        this.focusSessionRepository = focusSessionRepository;
    }
    
    // Create a new focus session
    public FocusSession createSession(String name, String description, String colorCode, 
                                    FocusCategory category, Integer workDuration, 
                                    Integer breakDuration, Integer cycles, String ownerUsername) {
        FocusSession session = new FocusSession();
        session.setName(name);
        session.setDescription(description);
        session.setColorCode(colorCode != null ? colorCode : "#8B5CF6");
        session.setCategory(category != null ? category : FocusCategory.WORK);
        session.setWorkDuration(workDuration != null ? workDuration : 25);
        session.setBreakDuration(breakDuration != null ? breakDuration : 5);
        session.setCycles(cycles != null ? cycles : 1);
        session.setOwnerUsername(ownerUsername);
        session.setIsActive(true);
        session.setTotalTimeLogged(0);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        
        return focusSessionRepository.save(session);
    }
    
    // Update an existing session
    public FocusSession updateSession(Long sessionId, String name, String description, 
                                    String colorCode, FocusCategory category, 
                                    Integer workDuration, Integer breakDuration, 
                                    Integer cycles, Boolean isActive) {
        Optional<FocusSession> sessionOpt = focusSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Focus session not found with ID: " + sessionId);
        }
        
        FocusSession session = sessionOpt.get();
        if (name != null) session.setName(name);
        if (description != null) session.setDescription(description);
        if (colorCode != null) session.setColorCode(colorCode);
        if (category != null) session.setCategory(category);
        if (workDuration != null) session.setWorkDuration(workDuration);
        if (breakDuration != null) session.setBreakDuration(breakDuration);
        if (cycles != null) session.setCycles(cycles);
        if (isActive != null) session.setIsActive(isActive);
        session.setUpdatedAt(LocalDateTime.now());
        
        return focusSessionRepository.save(session);
    }
    
    // Delete (deactivate) a session
    public boolean deleteSession(Long sessionId) {
        Optional<FocusSession> sessionOpt = focusSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return false;
        }
        
        FocusSession session = sessionOpt.get();
        session.setIsActive(false);
        session.setUpdatedAt(LocalDateTime.now());
        focusSessionRepository.save(session);
        return true;
    }
    
    // Get all sessions for a user
    public List<FocusSession> getSessionsByUser(String username) {
        return focusSessionRepository.findByOwnerUsername(username);
    }
    
    // Get active sessions for a user
    public List<FocusSession> getActiveSessionsByUser(String username) {
        return focusSessionRepository.findByOwnerUsernameAndIsActive(username, true);
    }
    
    // Get sessions by category
    public List<FocusSession> getSessionsByCategory(String username, FocusCategory category) {
        return focusSessionRepository.findByOwnerUsernameAndCategory(username, category);
    }
    
    // Get session by ID
    public Optional<FocusSession> getSessionById(Long sessionId) {
        return focusSessionRepository.findById(sessionId);
    }
    
    // Update total time logged for a session
    public void updateSessionTimeLogged(Long sessionId, Integer additionalMinutes) {
        Optional<FocusSession> sessionOpt = focusSessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            FocusSession session = sessionOpt.get();
            session.setTotalTimeLogged(session.getTotalTimeLogged() + additionalMinutes);
            session.setUpdatedAt(LocalDateTime.now());
            focusSessionRepository.save(session);
        }
    }
    
    // Get total session count for achievements
    public Long getTotalSessionCount(String username) {
        return focusSessionRepository.countSessionsByUsername(username);
    }
}