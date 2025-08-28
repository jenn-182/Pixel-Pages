package com.pixelpages.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    private String id; // e.g., "first_note", "word_warrior_100"
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "icon")
    private String icon;
    
    @Column(name = "rarity")
    private String rarity; // "common", "rare", "epic", "legendary"
    
    @Column(name = "category")
    private String category; // "writing", "organization", "consistency", "secret"
    
    @Column(name = "points")
    private int points;
    
    @Column(name = "unlock_criteria")
    private String unlockCriteria;
    
    // Constructors, getters, setters
    public Achievement() {}
    
    public Achievement(String id, String name, String description, String icon, 
                      String rarity, String category, int points, String unlockCriteria) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.rarity = rarity;
        this.category = category;
        this.points = points;
        this.unlockCriteria = unlockCriteria;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getUnlockCriteria() { return unlockCriteria; }
    public void setUnlockCriteria(String unlockCriteria) { this.unlockCriteria = unlockCriteria; }
}