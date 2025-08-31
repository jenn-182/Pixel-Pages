package com.pixelpages.service;

import com.pixelpages.model.Notebook;
import com.pixelpages.repository.NotebookRepository;
import com.pixelpages.repository.FolderRepository;
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
        notebook.setFolderId(folderId); // Use Long instead of entity
        
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
            //if (tags != null) notebook.setTags(tags);  // Assuming you have a tags field
            notebook.setFolderId(folderId);  // ✅ Set the folderId
            return notebookRepository.save(notebook);
        } else {
            throw new RuntimeException("Notebook not found with ID: " + id);
        }
    }

    // Delete notebook
    public void deleteNotebook(Long id) {
        if (notebookRepository.existsById(id)) {
            notebookRepository.deleteById(id);
        } else {
            throw new RuntimeException("Notebook not found with ID: " + id);
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

    // Check if notebook name is unique in folder - simplified
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
