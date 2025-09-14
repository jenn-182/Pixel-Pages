-- Achievement tables for database-only storage

-- Player Achievements table to store unlocked achievements
CREATE TABLE player_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL,
    achievement_id VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0,
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username, achievement_id)
);

CREATE INDEX idx_player_achievements_username ON player_achievements (username);
CREATE INDEX idx_player_achievements_achievement_id ON player_achievements (achievement_id);
CREATE INDEX idx_player_achievements_unlocked ON player_achievements (unlocked);

-- Player Stats table to cache calculated statistics
CREATE TABLE player_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    total_notes INT DEFAULT 0,
    total_words INT DEFAULT 0,
    unique_tags INT DEFAULT 0,
    notes_today INT DEFAULT 0,
    note_streak INT DEFAULT 0,
    max_words_in_note INT DEFAULT 0,
    max_tags_in_note INT DEFAULT 0,
    total_edits INT DEFAULT 0,
    notes_this_week INT DEFAULT 0,
    weekend_notes INT DEFAULT 0,
    
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    tasks_today INT DEFAULT 0,
    task_streak INT DEFAULT 0,
    high_priority_tasks INT DEFAULT 0,
    early_completions INT DEFAULT 0,
    tasks_this_week INT DEFAULT 0,
    tasks_this_month INT DEFAULT 0,
    task_categories INT DEFAULT 0,
    priority_usage INT DEFAULT 0,
    due_date_usage INT DEFAULT 0,
    
    total_sessions INT DEFAULT 0,
    total_focus_time INT DEFAULT 0,
    total_focus_minutes INT DEFAULT 0,
    max_session_duration INT DEFAULT 0,
    focus_streak INT DEFAULT 0,
    unique_categories INT DEFAULT 0,
    
    days_active INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    completed_achievements INT DEFAULT 0,
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_player_stats_username ON player_stats (username);
