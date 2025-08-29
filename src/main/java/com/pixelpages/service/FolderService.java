package com.pixelpages.service;

import com.pixelpages.model.Folder;
import com.pixelpages.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FolderService {

    @Autowired
    private FolderRepository folderRepository;

    // Get all root folders
    public List<Folder> getRootFolders() {
        return folderRepository.findByParentFolderIdIsNull();
    }

    // Get folder by ID
    public Optional<Folder> getFolderById(Long id) {
        return folderRepository.findById(id);
    }

    // Create new folder
    @Transactional
    public Folder createFolder(String name, String description, String colorCode, Long parentFolderId) {
        // Check if folder name is unique in parent
        if (!isFolderNameUniqueInParent(name, parentFolderId)) {
            throw new RuntimeException("Folder name already exists in this location");
        }

        Folder folder = new Folder(name, description, colorCode);
        folder.setParentFolderId(parentFolderId);

        return folderRepository.save(folder);
    }

    // Update folder
    public Folder updateFolder(Long id, String name, String description, String colorCode) {
        Optional<Folder> optionalFolder = folderRepository.findById(id);
        if (optionalFolder.isPresent()) {
            Folder folder = optionalFolder.get();
            if (name != null) folder.setName(name);
            if (description != null) folder.setDescription(description);
            if (colorCode != null) folder.setColorCode(colorCode);
            folder.setUpdatedAt(java.time.LocalDateTime.now().toString());

            return folderRepository.save(folder);
        } else {
            throw new RuntimeException("Folder not found with ID: " + id);
        }
    }

    // Delete folder (simplified for SQLite)
    public void deleteFolder(Long id, boolean moveContentsToParent) {
        Optional<Folder> optionalFolder = folderRepository.findById(id);
        if (optionalFolder.isPresent()) {
            Folder folder = optionalFolder.get();

            if (moveContentsToParent) {
                // Move subfolders to parent (using Long IDs)
                List<Folder> subFolders = folderRepository.findByParentFolderId(id);
                for (Folder subFolder : subFolders) {
                    subFolder.setParentFolderId(folder.getParentFolderId());
                    folderRepository.save(subFolder);
                }

                // Note: We'll handle moving notebooks and notes in their respective services
            }

            folderRepository.delete(folder);
        } else {
            throw new RuntimeException("Folder not found with ID: " + id);
        }
    }

    // Search folders
    public List<Folder> searchFolders(String query) {
        return folderRepository.findByNameContainingIgnoreCase(query);
    }

    // Get folder hierarchy (breadcrumb path) - simplified
    public List<Folder> getFolderPath(Long folderId) {
        List<Folder> path = new java.util.ArrayList<>();
        Long currentId = folderId;

        while (currentId != null) {
            Optional<Folder> folder = folderRepository.findById(currentId);
            if (folder.isPresent()) {
                path.add(0, folder.get()); // Add to beginning
                currentId = folder.get().getParentFolderId();
            } else {
                break;
            }
        }

        return path;
    }

    // Check if folder name is unique in parent - fixed for SQLite
    @Transactional
    public boolean isFolderNameUniqueInParent(String name, Long parentFolderId) {
        Optional<Folder> existingFolder;
        if (parentFolderId == null) {
            existingFolder = folderRepository.findByNameAndParentFolderIdIsNull(name);
        } else {
            existingFolder = folderRepository.findByNameAndParentFolderId(name, parentFolderId);
        }

        return existingFolder.isEmpty();
    }
}
