package com.pixelpages.service;

import com.pixelpages.model.Task;
import com.pixelpages.model.Player;
import com.pixelpages.model.TaskList;
import com.pixelpages.repository.TaskRepository;
import com.pixelpages.repository.PlayerRepository;
import com.pixelpages.repository.TaskListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final PlayerRepository playerRepository;
    private final TaskListRepository taskListRepository;
    
    public TaskService(TaskRepository taskRepository, PlayerRepository playerRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.playerRepository = playerRepository;
        this.taskListRepository = taskListRepository;
    }
    
    // Get all tasks for user (ordered by priority)
    public List<Task> getAllTasks(String username) {
        return taskRepository.findByUsernameOrderByPriorityAndCreatedAt(username);
    }
    
    // Create new task
    public Task createTask(Task task, String username) {
        task.setUsername(username);
        Task savedTask = taskRepository.save(task);
        
        System.out.println("✅ Created task: " + savedTask.getTitle() + " for " + username);
        return savedTask;
    }
    
    // Update task (mainly for toggling completion)
    public Task updateTask(Long taskId, Task updatedTask, String username) {
        Optional<Task> existingTask = taskRepository.findById(taskId);
        
        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            
            // Security check - only allow user to update their own tasks
            if (!task.getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized: Cannot update task belonging to another user");
            }
            
            // Update ALL fields
            task.setTitle(updatedTask.getTitle());
            task.setCompleted(updatedTask.isCompleted());
            task.setPriority(updatedTask.getPriority());
            
            // 🆕 UPDATE NEW FIELDS
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setTags(updatedTask.getTags());
            task.setTaskListId(updatedTask.getTaskListId());
            
            Task savedTask = taskRepository.save(task);
            
            System.out.println("🔄 Updated task: " + savedTask.getTitle());
            return savedTask;
        }
        
        throw new RuntimeException("Task not found with id: " + taskId);
    }
    
    // Delete task
    public void deleteTask(Long taskId, String username) {
        Optional<Task> task = taskRepository.findById(taskId);
        
        if (task.isPresent()) {
            // Security check
            if (!task.get().getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized: Cannot delete task belonging to another user");
            }
            
            taskRepository.deleteById(taskId);
            System.out.println("🗑️ Deleted task: " + task.get().getTitle());
        } else {
            throw new RuntimeException("Task not found with id: " + taskId);
        }
    }
    
    // Get task by ID
    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }
    
    // Simple stats class
    public static class TaskStats {
        private final long totalTasks;
        private final long completedTasks;
        
        public TaskStats(long totalTasks, long completedTasks) {
            this.totalTasks = totalTasks;
            this.completedTasks = completedTasks;
        }
        
        public long getTotalTasks() { return totalTasks; }
        public long getCompletedTasks() { return completedTasks; }
        public double getCompletionRate() { 
            return totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0; 
        }
    }
    
    // 🆕 TASK LIST METHODS
    public List<TaskList> getAllTaskLists(String username) {
        return taskListRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    public TaskList createTaskList(TaskList taskList, String username) {
        taskList.setUsername(username);
        TaskList savedTaskList = taskListRepository.save(taskList);
        
        System.out.println("📁 Created task list: " + savedTaskList.getName() + " for " + username);
        return savedTaskList;
    }

    public void deleteTaskList(Long taskListId, String username) {
        Optional<TaskList> taskList = taskListRepository.findById(taskListId);
        
        if (taskList.isPresent()) {
            if (!taskList.get().getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized: Cannot delete task list belonging to another user");
            }
            
            // Move tasks from this list to general (null taskListId)
            List<Task> tasksInList = taskRepository.findByTaskListId(taskListId);
            for (Task task : tasksInList) {
                task.setTaskListId(null);
                taskRepository.save(task);
            }
            
            taskListRepository.deleteById(taskListId);
            System.out.println("🗑️ Deleted task list: " + taskList.get().getName());
        }
    }

    // 🆕 ENHANCED TASK METHODS
    public List<Task> getTasksByList(String username, Long taskListId) {
        if (taskListId == null) {
            return taskRepository.findByUsernameAndTaskListIdIsNullOrderByPriorityAndCreatedAt(username);
        } else {
            return taskRepository.findByUsernameAndTaskListIdOrderByPriorityAndCreatedAt(username, taskListId);
        }
    }

    public List<Task> getOverdueTasks(String username) {
        return taskRepository.findOverdueTasks(username, LocalDateTime.now());
    }

    public List<Task> getDueSoonTasks(String username) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);
        return taskRepository.findDueSoonTasks(username, now, tomorrow);
    }

    // 🆕 TASK STATS METHOD
    public TaskStats getTaskStats(String username) {
        long totalTasks = taskRepository.countByUsernameAndCompleted(username, true) + 
                         taskRepository.countByUsernameAndCompleted(username, false);
        long completedTasks = taskRepository.countByUsernameAndCompleted(username, true);
        
        return new TaskStats(totalTasks, completedTasks);
    }
}