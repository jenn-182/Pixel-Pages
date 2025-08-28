package com.pixelpages.repository;

import com.pixelpages.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    List<Note> findByUsernameOrderByUpdatedAtDesc(String username);
    
    long countByUsername(String username);
    
    @Query("SELECT n FROM Note n WHERE n.username = :username AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.tagsString) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Note> searchByUsernameAndKeyword(@Param("username") String username, @Param("search") String search);
}
