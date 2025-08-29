package com.pixelpages.repository;

import com.pixelpages.model.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    
    // Find notebooks in a specific folder
    List<Notebook> findByFolderId(Long folderId);
    
    // Find notebooks not in any folder
    List<Notebook> findByFolderIdIsNull();
    
    // Find notebooks by name (case insensitive search)
    List<Notebook> findByNameContainingIgnoreCase(String name);
    
    // Find notebook by exact name and folder ID
    Optional<Notebook> findByNameAndFolderId(String name, Long folderId);
    
    // Find notebook by exact name with no folder
    Optional<Notebook> findByNameAndFolderIdIsNull(String name);
}
