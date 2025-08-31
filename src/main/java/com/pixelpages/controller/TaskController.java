package com.pixelpages.controller;

import com.pixelpages.model.Task;
import com.pixelpages.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    
    private final TaskService taskService;
    
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam(defaultValue = "user") String username) {
        List<Task> tasks = taskService.getAllTasks(username);
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, @RequestParam(defaultValue = "user") String username) {
        Task createdTask = taskService.createTask(task, username);
        return ResponseEntity.ok(createdTask);
    }
    
    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task task, @RequestParam(defaultValue = "user") String username) {
        Task updatedTask = taskService.updateTask(taskId, task, username);
        return ResponseEntity.ok(updatedTask);
    }
    
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId, @RequestParam(defaultValue = "user") String username) {
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
    public ResponseEntity<List<Task>> getOverdueTasks(@RequestParam(defaultValue = "user") String username) {
        List<Task> tasks = taskService.getOverdueTasks(username);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks due soon
    @GetMapping("/due-soon")
    public ResponseEntity<List<Task>> getDueSoonTasks(@RequestParam(defaultValue = "user") String username) {
        List<Task> tasks = taskService.getDueSoonTasks(username);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by list
    @GetMapping("/by-list")
    public ResponseEntity<List<Task>> getTasksByList(
            @RequestParam(defaultValue = "user") String username,
            @RequestParam(required = false) Long taskListId) {
        List<Task> tasks = taskService.getTasksByList(username, taskListId);
        return ResponseEntity.ok(tasks);
    }
}