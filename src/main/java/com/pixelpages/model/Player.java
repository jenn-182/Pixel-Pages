package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.persistence.PrePersist;

@Entity
@Table(name = "players")
public class Player {
    @Id
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "level", nullable = false)
    private Integer level = 1;
    
    @Column(name = "experience", nullable = false)
    private Integer experience = 0;
    
    @Column(name = "rank")
    private String rank = "NOVICE SCRIBE";
    
    @Column(name = "join_date", nullable = false)
    private LocalDateTime joinDate;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // Constructors
    public Player() {
        this.joinDate = LocalDateTime.now();
        this.lastLogin = LocalDateTime.now();
    }

    public Player(String username) {
        this();
        this.username = username;
    }

    @PrePersist
    public void prePersist() {
        // Generate ID if not already set
        if (this.id == null) {
            this.id = System.currentTimeMillis();
        }
        
        // Keep any existing code for dates, etc.
        if (this.joinDate == null) {
            this.joinDate = LocalDateTime.now();
        }
        if (this.lastLogin == null) {
            this.lastLogin = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastLogin = LocalDateTime.now();
    }

    @Transient
    public Integer getNextLevelExp() {
        return level * 100; // 100 XP per level
    }

    // Calculate level from experience
    @Transient
    public void updateLevelFromExperience() {
        this.level = (experience / 100) + 1;
        
        // Update rank based on level
        if (level >= 50) {
            this.rank = "LEGENDARY CHRONICLER";
        } else if (level >= 25) {
            this.rank = "MASTER STORYTELLER";
        } else if (level >= 15) {
            this.rank = "EXPERT SCRIBE";
        } else if (level >= 10) {
            this.rank = "SKILLED WRITER";
        } else if (level >= 5) {
            this.rank = "APPRENTICE SCRIBE";
        } else {
            this.rank = "NOVICE SCRIBE";
        }
    }

    // All getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }

    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
