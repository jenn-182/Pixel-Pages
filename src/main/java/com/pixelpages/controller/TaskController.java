package com.pixelpages.controller;

import com.pixelpages.model.Task;
import com.pixelpages.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime; // ✅ ADD THIS LINE
import org.springframework.http.HttpStatus;
import com.pixelpages.dto.CreateTaskRequest;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    
    private final TaskService taskService;
    
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam(defaultValue = "Jroc_182") String username) {
        List<Task> tasks = taskService.getAllTasks(username);
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskRequest request, @RequestParam(defaultValue = "Jroc_182") String username) {
        try {
            Task task = new Task();
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setPriority(request.getPriority());
            task.setTags(request.getTags());
            task.setTaskListId(request.getTaskListId());
            
            // ✅ FIX: Convert date string to LocalDateTime
            if (request.getDueDate() != null && !request.getDueDate().trim().isEmpty()) {
                try {
                    // Parse YYYY-MM-DD and set to end of day
                    LocalDate dueDate = LocalDate.parse(request.getDueDate());
                    task.setDueDate(dueDate.atTime(23, 59, 59)); // Set to end of day
                    System.out.println("✅ Parsed due date: " + request.getDueDate() + " -> " + task.getDueDate());
                } catch (Exception e) {
                    System.err.println("❌ Failed to parse due date: " + request.getDueDate());
                    task.setDueDate(null);
                }
            }
            
            Task createdTask = taskService.createTask(task, username);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            System.err.println("Error creating task: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody CreateTaskRequest request, @RequestParam(defaultValue = "Jroc_182") String username) {
        try {
            Task task = new Task();
            task.setId(taskId);
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setPriority(request.getPriority());
            task.setTags(request.getTags());
            task.setTaskListId(request.getTaskListId());
            task.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
            
            // ✅ FIX: Convert date string to LocalDateTime for updates too
            if (request.getDueDate() != null && !request.getDueDate().trim().isEmpty()) {
                try {
                    LocalDate dueDate = LocalDate.parse(request.getDueDate());
                    task.setDueDate(dueDate.atTime(23, 59, 59));
                    System.out.println("✅ Updated due date: " + request.getDueDate() + " -> " + task.getDueDate());
                } catch (Exception e) {
                    System.err.println("❌ Failed to parse due date on update: " + request.getDueDate());
                    task.setDueDate(null);
                }
            }
            
            Task updatedTask = taskService.updateTask(taskId, task, username);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            System.err.println("Error updating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId, @RequestParam(defaultValue = "Jroc_182") String username) {
        taskService.deleteTask(taskId, username);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        return taskService.getTaskById(taskId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get overdue tasks
    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks(@RequestParam(defaultValue = "Jroc_182") String username) {
        List<Task> tasks = taskService.getOverdueTasks(username);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks due soon
    @GetMapping("/due-soon")
    public ResponseEntity<List<Task>> getDueSoonTasks(@RequestParam(defaultValue = "Jroc_182") String username) {
        List<Task> tasks = taskService.getDueSoonTasks(username);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by list
    @GetMapping("/by-list")
    public ResponseEntity<List<Task>> getTasksByList(
            @RequestParam(defaultValue = "Jroc_182") String username,
            @RequestParam(required = false) Long taskListId) {
        List<Task> tasks = taskService.getTasksByList(username, taskListId);
        return ResponseEntity.ok(tasks);
    }
}