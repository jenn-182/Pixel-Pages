package com.pixelpages.service;

import com.pixelpages.model.Notebook;
import com.pixelpages.model.Note;
import com.pixelpages.repository.NotebookRepository;
import com.pixelpages.repository.FolderRepository;
import com.pixelpages.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotebookService {

    @Autowired
    private NotebookRepository notebookRepository;
    
    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private NoteRepository noteRepository;

    // Get all notebooks
    public List<Notebook> getAllNotebooks() {
        return notebookRepository.findAll();
    }

    // Get notebooks in a specific folder
    public List<Notebook> getNotebooksInFolder(Long folderId) {
        if (folderId == null) {
            return notebookRepository.findByFolderIdIsNull();
        }
        return notebookRepository.findByFolderId(folderId);
    }

    // Get notebook by ID
    public Optional<Notebook> getNotebookById(Long id) {
        return notebookRepository.findById(id);
    }

    // Create new notebook
    public Notebook createNotebook(String name, String description, String colorCode, Long folderId) {
        Notebook notebook = new Notebook(name, description, colorCode);
        notebook.setFolderId(folderId);
        
        return notebookRepository.save(notebook);
    }

    // Update notebook
    public Notebook updateNotebook(Long id, String name, String description, String colorCode, Long folderId) {
        Optional<Notebook> optionalNotebook = notebookRepository.findById(id);
        if (optionalNotebook.isPresent()) {
            Notebook notebook = optionalNotebook.get();
            
            if (name != null) notebook.setName(name);
            if (description != null) notebook.setDescription(description);
            if (colorCode != null) notebook.setColorCode(colorCode);
            if (folderId != null) notebook.setFolderId(folderId);
            notebook.setUpdatedAt(java.time.LocalDateTime.now().toString());
            
            return notebookRepository.save(notebook);
        } else {
            throw new RuntimeException("Notebook not found with ID: " + id);
        }
    }

    // Update notebook with tags
    public Notebook updateNotebook(Long id, String name, String description, String colorCode, String tags, Long folderId) {
        Optional<Notebook> optionalNotebook = notebookRepository.findById(id);
        if (optionalNotebook.isPresent()) {
            Notebook notebook = optionalNotebook.get();
            if (name != null) notebook.setName(name);
            if (description != null) notebook.setDescription(description);
            if (colorCode != null) notebook.setColorCode(colorCode);
            notebook.setFolderId(folderId);
            return notebookRepository.save(notebook);
        } else {
            throw new RuntimeException("Notebook not found with ID: " + id);
        }
    }

    // ✅ Fixed Delete notebook method
    public void deleteNotebook(Long id) {
        try {
            System.out.println("Attempting to delete notebook with ID: " + id);
            
            if (!notebookRepository.existsById(id)) {
                throw new RuntimeException("Notebook not found with ID: " + id);
            }

            // ✅ Handle notes in this notebook - set their notebookId to null
            List<Note> notesInNotebook = noteRepository.findByNotebookId(id);
            System.out.println("Found " + notesInNotebook.size() + " notes in notebook " + id);
            
            for (Note note : notesInNotebook) {
                System.out.println("Updating note " + note.getId() + " to remove notebook association");
                note.setNotebookId(null);
                noteRepository.save(note);
            }
            
            // ✅ Now delete the notebook
            System.out.println("Deleting notebook " + id);
            notebookRepository.deleteById(id);
            System.out.println("Successfully deleted notebook " + id);
            
        } catch (Exception e) {
            System.err.println("Error deleting notebook " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete notebook: " + e.getMessage(), e);
        }
    }

    // Search notebooks
    public List<Notebook> searchNotebooks(String query) {
        return notebookRepository.findByNameContainingIgnoreCase(query);
    }

    // Move notebook to different folder
    public Notebook moveNotebookToFolder(Long notebookId, Long targetFolderId) {
        return updateNotebook(notebookId, null, null, null, targetFolderId);
    }

    // Check if notebook name is unique in folder
    public boolean isNotebookNameUniqueInFolder(String name, Long folderId) {
        List<Notebook> existingNotebooks;
        if (folderId == null) {
            existingNotebooks = notebookRepository.findByFolderIdIsNull();
        } else {
            existingNotebooks = notebookRepository.findByFolderId(folderId);
        }
        
        return existingNotebooks.stream().noneMatch(notebook -> notebook.getName().equals(name));
    }
}
