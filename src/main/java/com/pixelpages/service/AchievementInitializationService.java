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
            System.out.println("Initializing achievements from frontend definitions...");

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
                // COMMON TIER (6 achievements)
                new Achievement("first_scroll", "FIRST SCROLL", "Create your first note log",
                        "BookOpen", "common", "notes", 50, "#10B981", "note_count", 1),
                new Achievement("apprentice_scribe", "APPRENTICE SCRIBE", "Create 5 note logs",
                        "BookOpen", "common", "notes", 100, "#10B981", "note_count", 5),
                new Achievement("word_warrior", "WORD WARRIOR", "Write 100 words total in logs",
                        "Edit3", "common", "notes", 75, "#10B981", "word_count", 100),
                new Achievement("tag_rookie", "TAG ROOKIE", "Use your first tag in a log",
                        "Tag", "common", "notes", 50, "#10B981", "tag_count", 1),
                new Achievement("daily_logger", "DAILY LOGGER", "Create a log today",
                        "Calendar", "common", "notes", 25, "#10B981", "daily_notes", 1),
                new Achievement("basic_editor", "BASIC EDITOR", "Edit your first log",
                        "Edit", "common", "notes", 50, "#10B981", "note_edits", 1),

                // UNCOMMON TIER (8 achievements)
                new Achievement("journeyman_writer", "JOURNEYMAN WRITER", "Collect 10 logs",
                        "BookOpen", "uncommon", "notes", 200, "#3B82F6", "note_count", 10),
                new Achievement("verbose_victor", "VERBOSE VICTOR", "Write 500 words total in logs",
                        "Edit3", "uncommon", "notes", 250, "#3B82F6", "word_count", 500),
                new Achievement("tag_apprentice", "TAG APPRENTICE", "Use 5 different tags in logs",
                        "Tag", "uncommon", "notes", 200, "#3B82F6", "unique_tags", 5),
                new Achievement("night_owl", "NIGHT OWL", "Write a log between 11 PM and 5 AM",
                        "Moon", "uncommon", "notes", 150, "#3B82F6", "time_range", 1),
                new Achievement("early_bird", "EARLY BIRD", "Write a log between 5 AM and 8 AM",
                        "Sun", "uncommon", "notes", 150, "#3B82F6", "time_range", 1),
                new Achievement("weekend_warrior", "WEEKEND WARRIOR", "Create 5 logs on weekends",
                        "Calendar", "uncommon", "notes", 200, "#3B82F6", "weekend_notes", 5),
                new Achievement("speed_writer", "SPEED WRITER", "Write 100 words in under 5 minutes",
                        "Zap", "uncommon", "notes", 300, "#3B82F6", "speed_writing", 1),
                new Achievement("revision_master", "REVISION MASTER", "Edit the same log 5 times",
                        "RotateCcw", "uncommon", "notes", 250, "#3B82F6", "single_note_edits", 5),

                // RARE TIER (7 achievements)
                new Achievement("master_chronicler", "MASTER CHRONICLER", "Collect 25 logs",
                        "BookOpen", "rare", "notes", 500, "#8B5CF6", "note_count", 25),
                new Achievement("wordsmith_supreme", "WORDSMITH SUPREME", "Write 2000 words total",
                        "Edit3", "rare", "notes", 750, "#8B5CF6", "word_count", 2000),
                new Achievement("tag_master", "TAG MASTER", "Use 15 different tags",
                        "Tag", "rare", "notes", 600, "#8B5CF6", "unique_tags", 15),
                new Achievement("consistent_writer", "CONSISTENT WRITER", "Write logs for 7 consecutive days",
                        "Calendar", "rare", "notes", 800, "#8B5CF6", "streak", 7),
                new Achievement("marathon_scribe", "MARATHON SCRIBE", "Write 500+ words in one log",
                        "FileText", "rare", "notes", 700, "#8B5CF6", "single_note_words", 500),
                new Achievement("weekly_champion", "WEEKLY CHAMPION", "Create 10 logs in one week",
                        "Trophy", "rare", "notes", 600, "#8B5CF6", "weekly_notes", 10),
                new Achievement("organization_guru", "ORGANIZATION GURU", "Use 3+ tags in a single log",
                        "Tags", "rare", "notes", 500, "#8B5CF6", "single_note_tags", 3),

                // LEGENDARY TIER (4 achievements)
                new Achievement("legendary_archivist", "LEGENDARY ARCHIVIST", "Create 100 logs",
                        "Archive", "legendary", "notes", 2000, "#F59E0B", "note_count", 100),
                new Achievement("epic_novelist", "EPIC NOVELIST", "Write 1000+ words in one log",
                        "Book", "legendary", "notes", 2500, "#F59E0B", "single_note_words", 1000),
                new Achievement("tag_grandmaster", "TAG GRANDMASTER", "Use 25 different tags",
                        "Tags", "legendary", "notes", 2000, "#F59E0B", "unique_tags", 25),
                new Achievement("archive_emperor", "ARCHIVE EMPEROR", "Write 10,000 words total",
                        "Crown", "legendary", "notes", 5000, "#F59E0B", "word_count", 10000)
        );
    }

    private List<Achievement> createTaskAchievements() {
        return Arrays.asList(
                // COMMON TIER (7 achievements)
                new Achievement("task_rookie", "TASK ROOKIE", "Complete your first mission",
                        "CheckSquare", "common", "tasks", 75, "#10B981", "task_count", 1),
                new Achievement("daily_warrior", "DAILY WARRIOR", "Complete 3 missions",
                        "CheckSquare", "common", "tasks", 100, "#10B981", "task_count", 3),
                new Achievement("checkbox_champion", "CHECKBOX CHAMPION", "Complete 2 missions in one day",
                        "CheckSquare", "common", "tasks", 100, "#10B981", "daily_tasks", 2),
                new Achievement("priority_learner", "PRIORITY LEARNER", "Set your first mission priority",
                        "Flag", "common", "tasks", 50, "#10B981", "priority_usage", 1),
                new Achievement("due_date_setter", "DUE DATE SETTER", "Set your first mission due date",
                        "Calendar", "common", "tasks", 50, "#10B981", "due_date_usage", 1),
                new Achievement("category_starter", "CATEGORY STARTER", "Create missions in 2 different operations",
                        "Folder", "common", "tasks", 75, "#10B981", "task_categories", 2),
                new Achievement("task_creator", "TASK CREATOR", "Create 5 total missions",
                        "Plus", "common", "tasks", 100, "#10B981", "tasks_created", 5),

                // UNCOMMON TIER (9 achievements)
                new Achievement("mission_commander", "MISSION COMMANDER", "Complete 15 missions",
                        "Shield", "uncommon", "tasks", 300, "#3B82F6", "task_count", 15),
                new Achievement("efficiency_expert", "EFFICIENCY EXPERT", "Complete 5 missions in one day",
                        "Zap", "uncommon", "tasks", 400, "#3B82F6", "daily_tasks", 5),
                new Achievement("priority_master", "PRIORITY MASTER", "Complete 10 high-priority missions",
                        "Flag", "uncommon", "tasks", 350, "#3B82F6", "high_priority_tasks", 10),
                new Achievement("deadline_defender", "DEADLINE DEFENDER", "Complete 10 missions before their due date",
                        "Clock", "uncommon", "tasks", 400, "#3B82F6", "early_completions", 10),
                new Achievement("weekly_crusher", "WEEKLY CRUSHER", "Complete 10 missions in one week",
                        "Calendar", "uncommon", "tasks", 350, "#3B82F6", "weekly_tasks", 10),
                new Achievement("overachiever", "OVERACHIEVER", "Complete 20% more missions than created",
                        "TrendingUp", "uncommon", "tasks", 300, "#3B82F6", "completion_ratio", 1),
                new Achievement("category_master", "CATEGORY MASTER", "Use 5 different operations",
                        "Folder", "uncommon", "tasks", 250, "#3B82F6", "task_categories", 5),
                new Achievement("morning_achiever", "MORNING ACHIEVER", "Complete 10 missions before noon",
                        "Sun", "uncommon", "tasks", 300, "#3B82F6", "morning_completions", 10),
                new Achievement("evening_finisher", "EVENING FINISHER", "Complete 10 missions after 6 PM",
                        "Moon", "uncommon", "tasks", 300, "#3B82F6", "evening_completions", 10),

                // RARE TIER (8 achievements)
                new Achievement("quest_conqueror", "QUEST CONQUEROR", "Complete 50 missions",
                        "Sword", "rare", "tasks", 1000, "#8B5CF6", "task_count", 50),
                new Achievement("productivity_titan", "PRODUCTIVITY TITAN", "Complete 10 missions in one day",
                        "Zap", "rare", "tasks", 1200, "#8B5CF6", "daily_tasks", 10),
                new Achievement("organization_overlord", "ORGANIZATION OVERLORD", "Maintain 5 different active operations",
                        "List", "rare", "tasks", 800, "#8B5CF6", "active_lists", 5),
                new Achievement("streak_sentry", "STREAK SENTRY", "Complete missions 7 days in a row",
                        "Flame", "rare", "tasks", 1000, "#8B5CF6", "completion_streak", 7),
                new Achievement("urgent_responder", "URGENT RESPONDER", "Complete 20 urgent-priority missions",
                        "AlertTriangle", "rare", "tasks", 800, "#8B5CF6", "urgent_tasks", 20),
                new Achievement("monthly_dominator", "MONTHLY DOMINATOR", "Complete 50 missions in one month",
                        "Calendar", "rare", "tasks", 1200, "#8B5CF6", "monthly_tasks", 50),
                new Achievement("perfectionist", "PERFECTIONIST", "Complete 100 missions with 95%+ on-time rate",
                        "Star", "rare", "tasks", 1500, "#8B5CF6", "ontime_rate", 1),
                new Achievement("task_juggler", "TASK JUGGLER", "Have 20+ active missions at once",
                        "Layers", "rare", "tasks", 700, "#8B5CF6", "concurrent_tasks", 20),

                // LEGENDARY TIER (4 achievements)
                new Achievement("mission_emperor", "MISSION EMPEROR", "Complete 200 missions",
                        "Crown", "legendary", "tasks", 3000, "#F59E0B", "task_count", 200),
                new Achievement("ultimate_achiever", "ULTIMATE ACHIEVER", "Complete 25 missions in one day",
                        "Zap", "legendary", "tasks", 4000, "#F59E0B", "daily_tasks", 25),
                new Achievement("grandmaster_planner", "GRANDMASTER PLANNER", "Maintain a 30-day mission completion streak",
                        "Calendar", "legendary", "tasks", 5000, "#F59E0B", "completion_streak", 30),
                new Achievement("legendary_executor", "LEGENDARY EXECUTOR", "Complete 500 total missions",
                        "Sword", "legendary", "tasks", 7500, "#F59E0B", "task_count", 500)
        );
    }

    private List<Achievement> createFocusAchievements() {
        return Arrays.asList(
                // COMMON TIER (8 achievements)
                new Achievement("focused_initiate", "FOCUSED INITIATE", "Complete your first grind",
                        "Target", "common", "focus", 100, "#10B981", "session_count", 1),
                new Achievement("micro_master", "MICRO MASTER", "Complete 3 micro grinds (5-15 min)",
                        "Clock", "common", "focus", 150, "#10B981", "session_duration_range", 3),
                new Achievement("hour_apprentice", "HOUR APPRENTICE", "Spend 1 hour total grinding",
                        "Clock", "common", "focus", 200, "#10B981", "total_time", 60),
                new Achievement("quick_burst", "QUICK BURST", "Complete a 5-minute grind",
                        "Zap", "common", "focus", 75, "#10B981", "single_session_duration", 5),
                new Achievement("pomodoro_starter", "POMODORO STARTER", "Complete your first 25-minute grind",
                        "Target", "common", "focus", 150, "#10B981", "single_session_duration", 25),
                new Achievement("break_taker", "BREAK TAKER", "Take a 5-minute grind break",
                        "Coffee", "common", "focus", 50, "#10B981", "break_session", 5),
                new Achievement("morning_focus", "MORNING FOCUS", "Complete a grind before 10 AM",
                        "Sun", "common", "focus", 100, "#10B981", "time_before", 10),
                new Achievement("category_explorer", "CATEGORY EXPLORER", "Try 2 different grind skills",
                        "Compass", "common", "focus", 100, "#10B981", "unique_categories", 2),

                // UNCOMMON TIER (10 achievements)
                new Achievement("pomodoro_warrior", "POMODORO WARRIOR", "Complete 10 Pomodoro grinds",
                        "Target", "uncommon", "focus", 300, "#3B82F6", "pomodoro_count", 10),
                new Achievement("focus_streak", "FOCUS STREAK", "Grind for 3 days in a row",
                        "Calendar", "uncommon", "focus", 400, "#3B82F6", "daily_streak", 3),
                new Achievement("deep_diver", "DEEP DIVER", "Complete a 60+ minute grind",
                        "Brain", "uncommon", "focus", 350, "#3B82F6", "single_session_duration", 60),
                new Achievement("dedication_keeper", "DEDICATION KEEPER", "Grind for 5 hours total",
                        "Clock", "uncommon", "focus", 500, "#3B82F6", "total_time", 300),
                new Achievement("evening_scholar", "EVENING SCHOLAR", "Complete 5 grinds after 6 PM",
                        "Moon", "uncommon", "focus", 250, "#3B82F6", "time_after", 5),
                new Achievement("study_buddy", "STUDY BUDDY", "Complete 10 study skill grinds",
                        "BookOpen", "uncommon", "focus", 300, "#3B82F6", "category_sessions", 10),
                new Achievement("code_ninja", "CODE NINJA", "Complete 10 code skill grinds",
                        "Code", "uncommon", "focus", 300, "#3B82F6", "category_sessions", 10),
                new Achievement("work_horse", "WORK HORSE", "Complete 10 work skill grinds",
                        "Briefcase", "uncommon", "focus", 300, "#3B82F6", "category_sessions", 10),
                new Achievement("creative_soul", "CREATIVE SOUL", "Complete 10 creative skill grinds",
                        "Palette", "uncommon", "focus", 300, "#3B82F6", "category_sessions", 10),
                new Achievement("session_variety", "SESSION VARIETY", "Grind in 5 different durations",
                        "Shuffle", "uncommon", "focus", 250, "#3B82F6", "duration_variety", 5),

                // RARE TIER (8 achievements)
                new Achievement("concentration_king", "CONCENTRATION KING", "Complete 50 grind sessions",
                        "Crown", "rare", "focus", 1000, "#8B5CF6", "session_count", 50),
                new Achievement("flow_state_master", "FLOW STATE MASTER", "Grind for 7 days in a row",
                        "Waves", "rare", "focus", 800, "#8B5CF6", "daily_streak", 7),
                new Achievement("marathon_mind", "MARATHON MIND", "Spend 20 hours total grinding",
                        "Brain", "rare", "focus", 1200, "#8B5CF6", "total_time", 1200),
                new Achievement("category_crusher", "CATEGORY CRUSHER", "Reach 10 hours grinding any skill",
                        "Target", "rare", "focus", 800, "#8B5CF6", "category_time", 600),
                new Achievement("deep_work_legend", "DEEP WORK LEGEND", "Complete 5 grinds of 90+ minutes",
                        "Brain", "rare", "focus", 1000, "#8B5CF6", "long_sessions", 5),
                new Achievement("monthly_warrior", "MONTHLY WARRIOR", "Complete 30 grinds in one month",
                        "Calendar", "rare", "focus", 800, "#8B5CF6", "monthly_sessions", 30),
                new Achievement("super_streaker", "SUPER STREAKER", "Complete grinds 14 days in a row",
                        "Flame", "rare", "focus", 1200, "#8B5CF6", "daily_streak", 14),
                new Achievement("time_optimizer", "TIME OPTIMIZER", "Complete grinds at 6 different times of day",
                        "Clock", "rare", "focus", 700, "#8B5CF6", "time_variety", 6),

                // LEGENDARY TIER (4 achievements)
                new Achievement("focus_legend", "FOCUS LEGEND", "Complete 200 grinds",
                        "Crown", "legendary", "focus", 3000, "#F59E0B", "session_count", 200),
                new Achievement("zen_master", "ZEN MASTER", "Complete grinds 30 days in a row",
                        "Lotus", "legendary", "focus", 5000, "#F59E0B", "daily_streak", 30),
                new Achievement("time_lord", "TIME LORD", "Spend 100 hours total grinding",
                        "Clock", "legendary", "focus", 4000, "#F59E0B", "total_time", 6000),
                new Achievement("omnifocus_sage", "OMNIFOCUS SAGE", "Grind for 20 hours in all skills",
                        "Star", "legendary", "focus", 6000, "#F59E0B", "all_categories_time", 1200)
    );
    }

    private List<Achievement> createSpecialAchievements() {
        return Arrays.asList(
                // UNCOMMON TIER (6 achievements)
                new Achievement("triple_threat", "TRIPLE THREAT", "Create a log, mission and grind in one day",
                        "Star", "uncommon", "combo", 500, "#3B82F6", "daily_combo", 1),
                new Achievement("balanced_user", "BALANCED USER", "Complete a log, mission and grind in one week",
                        "Scale", "uncommon", "combo", 300, "#3B82F6", "weekly_combo", 1),
                new Achievement("productivity_stack", "PRODUCTIVITY STACK", "Complete 5 missions + 1 grind + 1 log in one day",
                        "Layers", "uncommon", "combo", 600, "#3B82F6", "super_combo", 1),
                new Achievement("weekend_grinder", "WEEKEND GRINDER", "Complete a log, mission and grind on both weekend days",
                        "Calendar", "uncommon", "combo", 400, "#3B82F6", "weekend_activity", 2),
                new Achievement("midnight_oil", "MIDNIGHT OIL", "Be productive after midnight",
                        "Moon", "uncommon", "combo", 300, "#3B82F6", "late_night_activity", 1),
                new Achievement("early_riser", "EARLY RISER", "Be productive before 6 AM",
                        "Sun", "uncommon", "combo", 300, "#3B82F6", "early_morning_activity", 1),

                // RARE TIER (10 achievements)
                new Achievement("power_user", "POWER USER", "Complete a log, mission and grind for 7 consecutive days",
                        "Zap", "rare", "combo", 1000, "#8B5CF6", "combo_streak", 7),
                new Achievement("completionist", "COMPLETIONIST", "Reach 25% completion in all achievement categories",
                        "Award", "rare", "meta", 800, "#8B5CF6", "category_completion", 1),
                new Achievement("habit_master", "HABIT MASTER", "Complete a log, mission and grind for 14 days",
                        "Repeat", "rare", "combo", 1200, "#8B5CF6", "daily_activity_streak", 14),
                new Achievement("feature_explorer", "FEATURE EXPLORER", "Use every major feature at least once",
                        "Compass", "rare", "meta", 600, "#8B5CF6", "feature_usage", 1),
                new Achievement("consistency_king", "CONSISTENCY KING", "Be productive every day for 21 days",
                        "Crown", "rare", "combo", 1500, "#8B5CF6", "activity_consistency", 21),
                new Achievement("productivity_beast", "PRODUCTIVITY BEAST", "Be productive 10+ times in one day",
                        "Zap", "rare", "combo", 1000, "#8B5CF6", "daily_activity_count", 10),
                new Achievement("monthly_master", "MONTHLY MASTER", "Be productive 100+ times in one month",
                        "Calendar", "rare", "combo", 1200, "#8B5CF6", "monthly_activity_count", 100),
                new Achievement("level_climber", "LEVEL CLIMBER", "Reach level 10",
                        "TrendingUp", "rare", "meta", 1000, "#8B5CF6", "player_level", 10),
                new Achievement("xp_hunter", "XP HUNTER", "Earn 5000 total XP",
                        "Target", "rare", "meta", 500, "#8B5CF6", "total_xp", 5000),
                new Achievement("achievement_hunter", "ACHIEVEMENT HUNTER", "Unlock 25 achievement badges",
                        "Trophy", "rare", "meta", 1000, "#8B5CF6", "achievement_count", 25),

                // LEGENDARY TIER (6 achievements)
                new Achievement("pixel_master", "PIXEL MASTER", "Unlock 50 total achievement badges",
                        "Crown", "legendary", "meta", 3000, "#F59E0B", "achievement_count", 50),
                new Achievement("gaming_legend", "GAMING LEGEND", "Reach level 25 overall",
                        "Star", "legendary", "meta", 5000, "#F59E0B", "player_level", 25),
                new Achievement("ultimate_completionist", "ULTIMATE COMPLETIONIST", "Unlock 75% of all achievement badges",
                        "Award", "legendary", "meta", 4000, "#F59E0B", "completion_percentage", 1),
                new Achievement("eternal_grinder", "ETERNAL GRINDER", "Be productive for 100 consecutive days",
                        "Infinity", "legendary", "meta", 10000, "#F59E0B", "activity_consistency", 100),
                new Achievement("omnipotent_user", "OMNIPOTENT USER", "Master all skills (top 10% in each)",
                        "Crown", "legendary", "meta", 7500, "#F59E0B", "category_mastery", 1),
                new Achievement("legendary_completionist", "LEGENDARY COMPLETIONIST", "Unlock 95% of all achievement badges",
                        "Gem", "legendary", "meta", 15000, "#F59E0B", "completion_percentage", 1)
    );
    }

    @Transactional
    public void forceUpdateAchievements() {
        System.out.println("🔄 Force updating achievement descriptions...");
        
        try {
            // Clear all existing data
            achievementRepository.deleteAll();
            achievementRepository.flush(); // Force immediate deletion
            
            System.out.println("🗑️ Deleted all existing achievements");
            
            // Re-initialize with new descriptions
            List<Achievement> allAchievements = new ArrayList<>();
            allAchievements.addAll(createNoteAchievements());
            allAchievements.addAll(createTaskAchievements());
            allAchievements.addAll(createFocusAchievements());
            allAchievements.addAll(createSpecialAchievements());
            
            // Save all new achievements
            achievementRepository.saveAllAndFlush(allAchievements); // Force immediate save
            
            System.out.println("✅ Force updated " + allAchievements.size() + " achievements!");
            
            // Verify the update worked
            long count = achievementRepository.count();
            System.out.println("📊 Total achievements in database: " + count);
            
        } catch (Exception e) {
            System.err.println("❌ Error during force update: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}