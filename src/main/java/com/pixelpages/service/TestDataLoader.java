package com.pixelpages.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class TestDataLoader implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("🔄 Checking if test data needs to be loaded...");
            
            // Check if test data already exists by looking for our test user
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notes WHERE username = 'Jroc_182'", 
                Integer.class
            );
            
            if (count != null && count > 0) {
                System.out.println("📚 Test data already exists, skipping automatic load");
                return;
            }
            
            System.out.println("🚀 Loading test data for Jroc_182...");
            
            // Try to load from project root first
            String testDataPath = "test_data.sql";
            if (Files.exists(Paths.get(testDataPath))) {
                System.out.println("📄 Found test_data.sql in project root");
                loadSqlFile(testDataPath);
            } else {
                // Try to load from classpath
                try {
                    Resource resource = new ClassPathResource("test_data.sql");
                    if (resource.exists()) {
                        System.out.println("📄 Found test_data.sql in classpath");
                        loadSqlFromResource(resource);
                    } else {
                        System.out.println("⚠️ test_data.sql not found in project root or classpath");
                        System.out.println("💡 You can manually load test data by running the SQL script");
                        return;
                    }
                } catch (Exception e) {
                    System.out.println("⚠️ Could not load test_data.sql: " + e.getMessage());
                    return;
                }
            }
            
            System.out.println("✅ Test data loaded successfully for Jroc_182!");
            System.out.println("🏆 Achievement calculations will be triggered automatically");
            
        } catch (Exception e) {
            System.err.println("❌ Error loading test data: " + e.getMessage());
            System.out.println("💡 You can manually load test data by running the SQL script");
        }
    }
    
    private void loadSqlFile(String filePath) throws Exception {
        String content = new String(Files.readAllBytes(Paths.get(filePath)));
        executeSqlStatements(content);
    }
    
    private void loadSqlFromResource(Resource resource) throws Exception {
        try (InputStream inputStream = resource.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            
            executeSqlStatements(content.toString());
        }
    }
    
    private void executeSqlStatements(String sqlContent) {
        // Split by semicolon and execute each statement
        String[] statements = sqlContent.split(";");
        
        for (String statement : statements) {
            String trimmed = statement.trim();
            if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                try {
                    jdbcTemplate.execute(trimmed);
                } catch (Exception e) {
                    // Log but continue with other statements
                    System.out.println("⚠️ Error executing statement: " + e.getMessage());
                }
            }
        }
    }
}
