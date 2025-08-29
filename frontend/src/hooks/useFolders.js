import { useState, useEffect } from 'react';

const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/folders');
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        console.error('Failed to fetch folders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE FOLDER - This is where your fetch call goes
  const createFolder = async (folderData) => {
    try {
      const response = await fetch('/api/folders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderData)
      });

      if (response.ok) {
        const newFolder = await response.json();
        // Add the new folder to the state
        setFolders(prevFolders => [...prevFolders, newFolder]);
        return newFolder;
      } else {
        throw new Error(`Failed to create folder: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  // UPDATE FOLDER
  const updateFolder = async (id, folderData) => {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(folderData)
      });

      if (response.ok) {
        const updatedFolder = await response.json();
        setFolders(prevFolders => 
          prevFolders.map(folder => folder.id === id ? updatedFolder : folder)
        );
        return updatedFolder;
      } else {
        throw new Error(`Failed to update folder: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  };

  return {
    folders,
    loading,
    createFolder,
    updateFolder
  };
};

export default useFolders;