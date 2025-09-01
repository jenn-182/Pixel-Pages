import { useState, useCallback } from 'react';

export const useNavigation = () => {
  const [navigationState, setNavigationState] = useState({
    currentView: 'dashboard',
    selectedFolder: null,
    selectedNotebook: null,
    selectedNote: null,
    breadcrumbs: []
  });

  const navigateToFolder = useCallback((folder, onTabChange) => {
    if (onTabChange) {
      // Navigate to library tab with specific folder view
      onTabChange('library', { 
        view: 'folder',
        selectedFolder: folder,
        folderId: folder.id,
        breadcrumbs: [
          { label: 'Storage Vault', view: 'library' },
          { label: folder.name, view: 'folder', data: folder }
        ]
      });
    }
    
    setNavigationState(prev => ({
      ...prev,
      currentView: 'folder',
      selectedFolder: folder,
      breadcrumbs: [
        { label: 'Storage Vault', view: 'library' },
        { label: folder.name, view: 'folder', data: folder }
      ]
    }));
  }, []);

  const navigateToNoteView = useCallback((options = {}, onTabChange) => {
    if (onTabChange) {
      // Navigate to noteview tab
      onTabChange('noteview', {
        view: 'allNotes',
        selectedNote: options.selectedNote || null,
        folderId: options.folderId || null,
        ...options
      });
    }
    
    setNavigationState(prev => ({
      ...prev,
      currentView: 'noteview',
      selectedNote: options.selectedNote || null
    }));
  }, []);

  const navigateToNotebook = useCallback((notebook, onTabChange) => {
    if (onTabChange) {
      onTabChange('library', { 
        view: 'notebook',
        selectedNotebook: notebook,
        notebookId: notebook.id,
        breadcrumbs: [
          { label: 'Storage Vault', view: 'library' },
          { label: notebook.name, view: 'notebook', data: notebook }
        ]
      });
    }
    
    setNavigationState(prev => ({
      ...prev,
      currentView: 'notebook',
      selectedNotebook: notebook,
      breadcrumbs: [
        { label: 'Storage Vault', view: 'library' },
        { label: notebook.name, view: 'notebook', data: notebook }
      ]
    }));
  }, []);

  const navigateBack = useCallback((onTabChange) => {
    const newBreadcrumbs = [...navigationState.breadcrumbs];
    newBreadcrumbs.pop(); // Remove current view
    
    const previousView = newBreadcrumbs[newBreadcrumbs.length - 1];
    
    if (previousView) {
      if (onTabChange) {
        onTabChange('library', { 
          view: previousView.view,
          breadcrumbs: newBreadcrumbs
        });
      }
      
      setNavigationState(prev => ({
        ...prev,
        currentView: previousView.view,
        breadcrumbs: newBreadcrumbs,
        selectedFolder: previousView.view === 'folder' ? previousView.data : null,
        selectedNotebook: previousView.view === 'notebook' ? previousView.data : null
      }));
    } else {
      // Go back to main library view
      if (onTabChange) {
        onTabChange('library');
      }
      
      setNavigationState(prev => ({
        ...prev,
        currentView: 'library',
        selectedFolder: null,
        selectedNotebook: null,
        breadcrumbs: []
      }));
    }
  }, [navigationState.breadcrumbs]);

  const resetNavigation = useCallback(() => {
    setNavigationState({
      currentView: 'dashboard',
      selectedFolder: null,
      selectedNotebook: null,
      selectedNote: null,
      breadcrumbs: []
    });
  }, []);

//   const handleAccessAllLogs = () => {
//     navigateToNoteView({ view: 'allNotes' }, onTabChange);
//   };

  return {
    navigationState,
    navigateToFolder,
    navigateToNoteView,
    navigateToNotebook,
    navigateBack,
    resetNavigation,
   // handleAccessAllLogs
  };
};