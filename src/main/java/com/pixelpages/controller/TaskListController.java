package com.pixelpages.controller;

import com.pixelpages.model.TaskList;
import com.pixelpages.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/task-lists")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskListController {
    
    private final TaskService taskService;
    
    public TaskListController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    // Get all task lists for user
    @GetMapping
    public ResponseEntity<List<TaskList>> getAllTaskLists(@RequestParam(defaultValue = "Jroc_182") String username) {
        List<TaskList> taskLists = taskService.getAllTaskLists(username);
        return ResponseEntity.ok(taskLists);
    }
    
    // Create new task list
    @PostMapping
    public ResponseEntity<TaskList> createTaskList(@RequestBody TaskList taskList, @RequestParam(defaultValue = "Jroc_182") String username) {
        TaskList createdTaskList = taskService.createTaskList(taskList, username);
        return ResponseEntity.ok(createdTaskList);
    }
    
    // Delete task list
    @DeleteMapping("/{taskListId}")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long taskListId, @RequestParam(defaultValue = "Jroc_182") String username) {
        taskService.deleteTaskList(taskListId, username);
        return ResponseEntity.ok().build();
    }
    
    // Get tasks by list
    @GetMapping("/{taskListId}/tasks")
    public ResponseEntity<List<com.pixelpages.model.Task>> getTasksByList(
            @PathVariable Long taskListId, 
            @RequestParam(defaultValue = "Jroc_182") String username) {
        List<com.pixelpages.model.Task> tasks = taskService.getTasksByList(username, taskListId);
        return ResponseEntity.ok(tasks);
    }
    
    // Get general tasks (not in any list)
    @GetMapping("/general/tasks")
    public ResponseEntity<List<com.pixelpages.model.Task>> getGeneralTasks(@RequestParam(defaultValue = "Jroc_182") String username) {
        List<com.pixelpages.model.Task> tasks = taskService.getTasksByList(username, null);
        return ResponseEntity.ok(tasks);
    }
}