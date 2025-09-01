package com.pixelpages.repository;

import com.pixelpages.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    List<Note> findByUsernameOrderByUpdatedAtDesc(String username);
    
    long countByUsername(String username);
    
    // Search notes by title, content, or tags (loose search)
    @org.springframework.data.jpa.repository.Query("SELECT n FROM Note n WHERE n.username = :username AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.tagsString) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Note> searchByUsernameAndKeyword(@org.springframework.data.repository.query.Param("username") String username, @org.springframework.data.repository.query.Param("search") String search);

    // Find notes by folder
    List<Note> findByUsernameAndFolderId(String username, Long folderId);

    // Find notes not in any folder or notebook (loose notes)
    List<Note> findByUsernameAndFolderIdIsNullAndNotebookIdIsNull(String username);

    // Find notes in a specific notebook
    List<Note> findByUsernameAndNotebookId(String username, Long notebookId);

    // Find note by ID and username (for security)
    Optional<Note> findByIdAndUsername(Long id, String username);

    List<Note> findByFolderId(Long folderId);
    List<Note> findByNotebookId(Long notebookId); // ✅ Make sure this exists
    List<Note> findByFolderIdIsNull();
    List<Note> findByNotebookIdIsNull();
    List<Note> findByTitleContainingIgnoreCase(String title);
    List<Note> findByContentContainingIgnoreCase(String content);
    
    // Combined searches
    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
}
