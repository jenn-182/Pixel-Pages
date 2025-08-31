package com.pixelpages.repository;

import com.pixelpages.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Original method - tasks ordered by priority then creation date
    @Query("SELECT t FROM Task t WHERE t.username = ?1 ORDER BY " +
           "CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, " +
           "t.createdAt DESC")
    List<Task> findByUsernameOrderByPriorityAndCreatedAt(String username);
    
    // Count completed tasks for achievements
    long countByUsernameAndCompleted(String username, boolean completed);
    
    // Find tasks by completion status
    List<Task> findByUsernameAndCompleted(String username, boolean completed);
    
    // 🆕 NEW METHODS FOR PHASE 2
    
    // Find tasks by task list ID
    List<Task> findByTaskListId(Long taskListId);
    
    // Find general tasks (not in any list) for a user
    @Query("SELECT t FROM Task t WHERE t.username = ?1 AND t.taskListId IS NULL ORDER BY " +
           "CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, " +
           "t.createdAt DESC")
    List<Task> findByUsernameAndTaskListIdIsNullOrderByPriorityAndCreatedAt(String username);
    
    // Find tasks in a specific list for a user
    @Query("SELECT t FROM Task t WHERE t.username = ?1 AND t.taskListId = ?2 ORDER BY " +
           "CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, " +
           "t.createdAt DESC")
    List<Task> findByUsernameAndTaskListIdOrderByPriorityAndCreatedAt(String username, Long taskListId);
    
    // Find overdue tasks
    @Query("SELECT t FROM Task t WHERE t.username = :username AND t.dueDate < :now AND t.completed = false ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasks(@Param("username") String username, @Param("now") LocalDateTime now);
    
    // Find tasks due soon (within next 24 hours)
    @Query("SELECT t FROM Task t WHERE t.username = :username AND t.dueDate BETWEEN :now AND :tomorrow AND t.completed = false ORDER BY t.dueDate ASC")
    List<Task> findDueSoonTasks(@Param("username") String username, @Param("now") LocalDateTime now, @Param("tomorrow") LocalDateTime tomorrow);
    
    // Find tasks by tags (contains search)
    @Query("SELECT t FROM Task t WHERE t.username = :username AND t.tags LIKE %:tag% ORDER BY " +
           "CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END, " +
           "t.createdAt DESC")
    List<Task> findByUsernameAndTagsContaining(@Param("username") String username, @Param("tag") String tag);
}
