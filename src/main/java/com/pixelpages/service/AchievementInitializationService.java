package com.pixelpages.service;

import com.pixelpages.model.Achievement;
import com.pixelpages.repository.AchievementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AchievementInitializationService {
    
    private final AchievementRepository achievementRepository;
    
    public AchievementInitializationService(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }
    
    @PostConstruct
    @Transactional
    public void initializeAchievements() {
        if (achievementRepository.count() == 0) {
            System.out.println("🚀 Initializing achievements from frontend definitions...");
            
            List<Achievement> allAchievements = new ArrayList<>();
            
            // Add all achievement categories
            allAchievements.addAll(createNoteAchievements());
            allAchievements.addAll(createTaskAchievements());
            allAchievements.addAll(createFocusAchievements());
            allAchievements.addAll(createSpecialAchievements());
            
            achievementRepository.saveAll(allAchievements);
            System.out.println("✅ Initialized " + allAchievements.size() + " achievements!");
        } else {
            System.out.println("📚 Achievements already exist, skipping initialization");
        }
    }
    
    private List<Achievement> createNoteAchievements() {
        return Arrays.asList(
            // COMMON TIER - Note Count Achievements
            new Achievement("first_scroll", "FIRST SCROLL", "Create your first mission log", 
                          "BookOpen", "common", "notes", 50, "#06B6D4", "note_count", 1),
            
            new Achievement("apprentice_scribe", "APPRENTICE SCRIBE", "Collect 5 quest scrolls", 
                          "BookOpen", "common", "notes", 100, "#06B6D4", "note_count", 5),
            
            new Achievement("journeyman_writer", "JOURNEYMAN WRITER", "Document 10 adventures", 
                          "BookOpen", "common", "notes", 150, "#06B6D4", "note_count", 10),
            
            new Achievement("dedicated_chronicler", "DEDICATED CHRONICLER", "Amass 15 chronicles", 
                          "BookOpen", "common", "notes", 200, "#06B6D4", "note_count", 15),
            
            new Achievement("master_archivist", "MASTER ARCHIVIST", "Curate 25 documents", 
                          "BookOpen", "common", "notes", 250, "#06B6D4", "note_count", 25),
            
            // COMMON TIER - Word Count Achievements  
            new Achievement("word_warrior", "WORD WARRIOR", "Write 100 words total", 
                          "Edit3", "common", "notes", 75, "#06B6D4", "word_count", 100),
            
            new Achievement("verbose_victor", "VERBOSE VICTOR", "Compose 500 words", 
                          "Edit3", "common", "notes", 125, "#06B6D4", "word_count", 500),
            
            new Achievement("prolific_penman", "PROLIFIC PENMAN", "Author 1,000 words", 
                          "Edit3", "common", "notes", 200, "#06B6D4", "word_count", 1000),
            
            // UNCOMMON TIER
            new Achievement("lore_keeper", "LORE KEEPER", "Maintain 50 sacred texts", 
                          "BookOpen", "uncommon", "notes", 400, "#EC4899", "note_count", 50),
            
            new Achievement("epic_novelist", "EPIC NOVELIST", "Craft 2,500 words of legend", 
                          "Edit3", "uncommon", "notes", 350, "#EC4899", "word_count", 2500),
            
            new Achievement("daily_chronicler", "DAILY CHRONICLER", "Write for 7 consecutive days", 
                          "Calendar", "uncommon", "notes", 300, "#EC4899", "daily_streak", 7),
            
            new Achievement("weekend_warrior", "WEEKEND WARRIOR", "Write 5 notes on weekend days", 
                          "Zap", "uncommon", "notes", 250, "#EC4899", "weekend_notes", 5),
            
            new Achievement("midnight_scribe", "MIDNIGHT SCRIBE", "Write a note after 11 PM", 
                          "Moon", "uncommon", "notes", 200, "#EC4899", "late_night_note", 1),
            
            // RARE TIER
            new Achievement("grand_librarian", "GRAND LIBRARIAN", "Oversee 100 volumes", 
                          "BookOpen", "rare", "notes", 750, "#8B5CF6", "note_count", 100),
            
            new Achievement("master_wordsmith", "MASTER WORDSMITH", "Pen 5,000 words of wisdom", 
                          "Edit3", "rare", "notes", 600, "#8B5CF6", "word_count", 5000),
            
            new Achievement("dedication_sage", "DEDICATION SAGE", "Maintain 14-day writing streak", 
                          "Calendar", "rare", "notes", 500, "#8B5CF6", "daily_streak", 14),
            
            new Achievement("category_explorer", "CATEGORY EXPLORER", "Use 5 different note categories", 
                          "FolderOpen", "rare", "notes", 400, "#8B5CF6", "unique_categories", 5),
            
            // LEGENDARY TIER
            new Achievement("immortal_chronicler", "IMMORTAL CHRONICLER", "Archive 250 eternal records", 
                          "BookOpen", "legendary", "notes", 1500, "#FFCB2E", "note_count", 250),
            
            new Achievement("legendary_wordsmith", "LEGENDARY WORDSMITH", "Compose 10,000 words of power", 
                          "Edit3", "legendary", "notes", 1200, "#FFCB2E", "word_count", 10000),
            
            new Achievement("eternal_dedication", "ETERNAL DEDICATION", "Achieve 30-day writing mastery", 
                          "Calendar", "legendary", "notes", 1000, "#FFCB2E", "daily_streak", 30)
        );
    }
    
    private List<Achievement> createTaskAchievements() {
        return Arrays.asList(
            // COMMON TIER - Task Completion
            new Achievement("task_rookie", "TASK ROOKIE", "Complete your first mission", 
                          "CheckSquare", "common", "tasks", 75, "#06B6D4", "task_count", 1),
            
            new Achievement("mission_apprentice", "MISSION APPRENTICE", "Finish 5 quests", 
                          "CheckSquare", "common", "tasks", 125, "#06B6D4", "task_count", 5),
            
            new Achievement("quest_journeyman", "QUEST JOURNEYMAN", "Complete 10 objectives", 
                          "CheckSquare", "common", "tasks", 175, "#06B6D4", "task_count", 10),
            
            new Achievement("duty_guardian", "DUTY GUARDIAN", "Fulfill 25 responsibilities", 
                          "CheckSquare", "common", "tasks", 225, "#06B6D4", "task_count", 25),
            
            // COMMON TIER - Daily Tasks
            new Achievement("daily_warrior", "DAILY WARRIOR", "Complete 3 tasks in one day", 
                          "Zap", "common", "tasks", 100, "#06B6D4", "daily_tasks", 3),
            
            new Achievement("morning_champion", "MORNING CHAMPION", "Complete a task before 9 AM", 
                          "Sun", "common", "tasks", 150, "#06B6D4", "morning_task", 1),
            
            // UNCOMMON TIER
            new Achievement("task_master", "TASK MASTER", "Achieve 50 completions", 
                          "CheckSquare", "uncommon", "tasks", 400, "#EC4899", "task_count", 50),
            
            new Achievement("priority_expert", "PRIORITY EXPERT", "Complete 10 high-priority tasks", 
                          "AlertTriangle", "uncommon", "tasks", 300, "#EC4899", "high_priority_tasks", 10),
            
            new Achievement("speed_demon", "SPEED DEMON", "Finish 5 tasks in 30 minutes", 
                          "Zap", "uncommon", "tasks", 350, "#EC4899", "speed_completion", 5),
            
            new Achievement("consistency_king", "CONSISTENCY KING", "Complete tasks 5 days straight", 
                          "Calendar", "uncommon", "tasks", 300, "#EC4899", "task_streak", 5),
            
            // RARE TIER
            new Achievement("centurion_completer", "CENTURION COMPLETER", "Conquer 100 tasks", 
                          "CheckSquare", "rare", "tasks", 750, "#8B5CF6", "task_count", 100),
            
            new Achievement("list_liquidator", "LIST LIQUIDATOR", "Clear an entire task list", 
                          "List", "rare", "tasks", 500, "#8B5CF6", "complete_list", 1),
            
            new Achievement("deadline_destroyer", "DEADLINE DESTROYER", "Beat 10 deadlines", 
                          "Clock", "rare", "tasks", 400, "#8B5CF6", "deadline_tasks", 10),
            
            // LEGENDARY TIER
            new Achievement("task_emperor", "TASK EMPEROR", "Rule over 250 completed tasks", 
                          "CheckSquare", "legendary", "tasks", 1500, "#FFCB2E", "task_count", 250),
            
            new Achievement("productivity_god", "PRODUCTIVITY GOD", "Complete 10 tasks daily for a week", 
                          "Zap", "legendary", "tasks", 1200, "#FFCB2E", "intense_productivity", 7)
        );
    }
    
    private List<Achievement> createFocusAchievements() {
        return Arrays.asList(
            // COMMON TIER - Session Count
            new Achievement("focused_initiate", "FOCUSED INITIATE", "Complete your first focus session", 
                          "Target", "common", "focus", 100, "#06B6D4", "session_count", 1),
            
            new Achievement("concentration_cadet", "CONCENTRATION CADET", "Finish 5 focus sessions", 
                          "Target", "common", "focus", 150, "#06B6D4", "session_count", 5),
            
            new Achievement("attention_apprentice", "ATTENTION APPRENTICE", "Complete 10 sessions", 
                          "Target", "common", "focus", 200, "#06B6D4", "session_count", 10),
            
            new Achievement("mindfulness_rookie", "MINDFULNESS ROOKIE", "Achieve 25 sessions", 
                          "Target", "common", "focus", 250, "#06B6D4", "session_count", 25),
            
            // COMMON TIER - Time Based
            new Achievement("hour_apprentice", "HOUR APPRENTICE", "Focus for 1 hour total", 
                          "Clock", "common", "focus", 125, "#06B6D4", "total_time", 60),
            
            new Achievement("steady_studier", "STEADY STUDIER", "Accumulate 3 hours of focus", 
                          "Clock", "common", "focus", 200, "#06B6D4", "total_time", 180),
            
            // UNCOMMON TIER
            new Achievement("focus_veteran", "FOCUS VETERAN", "Complete 50 sessions", 
                          "Target", "uncommon", "focus", 400, "#EC4899", "session_count", 50),
            
            new Achievement("deep_work_warrior", "DEEP WORK WARRIOR", "Focus for 10 hours total", 
                          "Clock", "uncommon", "focus", 500, "#EC4899", "total_time", 600),
            
            new Achievement("long_distance_runner", "LONG DISTANCE RUNNER", "Complete a 2-hour session", 
                          "Zap", "uncommon", "focus", 300, "#EC4899", "long_session", 120),
            
            new Achievement("daily_focuser", "DAILY FOCUSER", "Focus daily for 5 days straight", 
                          "Calendar", "uncommon", "focus", 350, "#EC4899", "focus_streak", 5),
            
            new Achievement("category_specialist", "CATEGORY SPECIALIST", "Focus 5 hours in one category", 
                          "FolderOpen", "uncommon", "focus", 300, "#EC4899", "category_time", 300),
            
            // RARE TIER
            new Achievement("concentration_master", "CONCENTRATION MASTER", "Achieve 100 sessions", 
                          "Target", "rare", "focus", 750, "#8B5CF6", "session_count", 100),
            
            new Achievement("marathon_mind", "MARATHON MIND", "Focus for 20 hours total", 
                          "Clock", "rare", "focus", 800, "#8B5CF6", "total_time", 1200),
            
            new Achievement("zen_master", "ZEN MASTER", "Complete a 4-hour deep session", 
                          "Zap", "rare", "focus", 600, "#8B5CF6", "long_session", 240),
            
            new Achievement("weekly_warrior", "WEEKLY WARRIOR", "Focus daily for 7 days straight", 
                          "Calendar", "rare", "focus", 500, "#8B5CF6", "focus_streak", 7),
            
            // LEGENDARY TIER
            new Achievement("focus_legend", "FOCUS LEGEND", "Complete 250 sessions", 
                          "Target", "legendary", "focus", 1500, "#FFCB2E", "session_count", 250),
            
            new Achievement("time_lord", "TIME LORD", "Focus for 100 hours total", 
                          "Clock", "legendary", "focus", 2000, "#FFCB2E", "total_time", 6000),
            
            new Achievement("omnifocus_sage", "OMNIFOCUS SAGE", "Master all focus categories with 20+ hours each", 
                          "Crown", "legendary", "focus", 2500, "#FFCB2E", "all_categories_time", 1200)
        );
    }
    
    private List<Achievement> createSpecialAchievements() {
        return Arrays.asList(
            // UNCOMMON TIER - Combo Achievements
            new Achievement("triple_threat", "TRIPLE THREAT", "Complete a note, task, and focus session in one day", 
                          "Star", "uncommon", "combo", 500, "#EC4899", "daily_combo", 1),
            
            new Achievement("balanced_warrior", "BALANCED WARRIOR", "Achieve weekly goals in all categories", 
                          "Scale", "uncommon", "combo", 400, "#EC4899", "weekly_balance", 1),
            
            new Achievement("productivity_trifecta", "PRODUCTIVITY TRIFECTA", "Triple combo for 3 days", 
                          "Zap", "uncommon", "combo", 600, "#EC4899", "combo_streak", 3),
            
            // RARE TIER - Meta Achievements
            new Achievement("achievement_hunter", "ACHIEVEMENT HUNTER", "Unlock 10 achievements", 
                          "Trophy", "rare", "meta", 500, "#8B5CF6", "achievement_count", 10),
            
            new Achievement("badge_collector", "BADGE COLLECTOR", "Earn 25 achievements", 
                          "Award", "rare", "meta", 750, "#8B5CF6", "achievement_count", 25),
            
            new Achievement("rare_finder", "RARE FINDER", "Unlock your first rare achievement", 
                          "Gem", "rare", "meta", 400, "#8B5CF6", "rare_achievement", 1),
            
            // LEGENDARY TIER - Ultimate Achievements
            new Achievement("legendary_achiever", "LEGENDARY ACHIEVER", "Unlock your first legendary achievement", 
                          "Crown", "legendary", "meta", 1000, "#FFCB2E", "legendary_achievement", 1),
            
            new Achievement("completionist", "COMPLETIONIST", "Unlock 50 achievements", 
                          "Trophy", "legendary", "meta", 2000, "#FFCB2E", "achievement_count", 50),
            
            new Achievement("pixel_pages_master", "PIXEL PAGES MASTER", "Achieve mastery in all areas", 
                          "Crown", "legendary", "meta", 5000, "#FFCB2E", "complete_mastery", 1)
        );
    }
}