package com.pixelpages.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private AchievementService achievementService;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Checking if test data needs to be loaded...");
        
        // Check if test data already exists
        try {
            Integer noteCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM notes", Integer.class);
            Integer taskCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tasks", Integer.class);
            Integer focusCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM focus_sessions", Integer.class);
            
            if (noteCount == null) noteCount = 0;
            if (taskCount == null) taskCount = 0;
            if (focusCount == null) focusCount = 0;
            
            System.out.println("📊 Current data counts: Notes=" + noteCount + ", Tasks=" + taskCount + ", Focus=" + focusCount);
            
            // Load test data if tables are empty or have minimal data
            if (noteCount < 4 || taskCount < 15 || focusCount < 10) {
                System.out.println("📥 Loading test data...");
                loadTestData();
                
                // Recalculate achievements for test user after loading data
                System.out.println("🏆 Calculating achievements for test user...");
                achievementService.recalculateAllAchievements("user");
                
                System.out.println("✅ Test data loaded and achievements calculated!");
            } else {
                System.out.println("✅ Test data already exists, skipping load.");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error during data initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void loadTestData() throws Exception {
        try {
            // Load test_data.sql from classpath
            ClassPathResource resource = new ClassPathResource("test_data.sql");
            
            if (!resource.exists()) {
                // Try loading from project root
                java.io.File file = new java.io.File("test_data.sql");
                if (file.exists()) {
                    String sql = java.nio.file.Files.readString(file.toPath(), StandardCharsets.UTF_8);
                    executeSqlScript(sql);
                } else {
                    System.err.println("⚠️ test_data.sql not found in classpath or project root");
                }
            } else {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                    String sql = reader.lines().collect(Collectors.joining("\n"));
                    executeSqlScript(sql);
                }
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error loading test data: " + e.getMessage());
            throw e;
        }
    }
    
    private void executeSqlScript(String sql) {
        try {
            // Split by semicolons and execute each statement
            String[] statements = sql.split(";");
            
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    try {
                        jdbcTemplate.execute(statement);
                        System.out.println("✓ Executed: " + statement.substring(0, Math.min(50, statement.length())) + "...");
                    } catch (Exception e) {
                        // Log but continue with other statements
                        System.err.println("⚠️ Failed to execute: " + statement.substring(0, Math.min(50, statement.length())) + "... Error: " + e.getMessage());
                    }
                }
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error executing SQL script: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
