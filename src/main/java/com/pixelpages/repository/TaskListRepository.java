package com.pixelpages.repository;

import com.pixelpages.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long> {

    List<TaskList> findByUsernameOrderByCreatedAtDesc(String username);

    List<TaskList> findByUsernameAndNameContainingIgnoreCase(String username, String name);
}
