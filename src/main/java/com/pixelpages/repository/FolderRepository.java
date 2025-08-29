package com.pixelpages.repository;

import com.pixelpages.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    
    // Find root folders (no parent)
    List<Folder> findByParentFolderIdIsNull();
    
    // Find subfolders of a parent
    List<Folder> findByParentFolderId(Long parentFolderId);
    
    // Find folders by name (case insensitive search)
    List<Folder> findByNameContainingIgnoreCase(String name);
    
    // Find folder by exact name and parent ID (changed from parentFolder to parentFolderId)
    Optional<Folder> findByNameAndParentFolderId(String name, Long parentFolderId);
    
    // Find folder by exact name with no parent (root folder)
    Optional<Folder> findByNameAndParentFolderIdIsNull(String name);
}
