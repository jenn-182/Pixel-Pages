package com.pixelpages.model;

public enum FocusCategory {
    WORK("Work"),
    LEARNING("Learning"), 
    PERSONAL("Personal"),
    HEALTH("Health"),
    CREATIVE("Creative"),
    OTHER("Other");
    
    private final String displayName;
    
    FocusCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
