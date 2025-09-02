import { useState, useEffect } from 'react';

const useNotebooks = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const fetchNotebooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notebooks');
      if (response.ok) {
        const data = await response.json();
        setNotebooks(data);
      } else {
        console.error('Failed to fetch notebooks:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE NOTEBOOK - Add this method
  const createNotebook = async (notebookData) => {
    try {
      const response = await fetch('/api/notebooks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: notebookData.name,
          description: notebookData.description,
          colorCode: notebookData.colorCode,
          folderId: notebookData.folderId || null
        })
      });

      if (response.ok) {
        const newNotebook = await response.json();
        setNotebooks(prevNotebooks => [...prevNotebooks, newNotebook]);
        return newNotebook;
      } else {
        const errorText = await response.text();
        console.error('Failed to create notebook:', response.status, errorText);
        throw new Error(`Failed to create notebook: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating notebook:', error);
      throw error;
    }
  };

  // UPDATE NOTEBOOK - Fixed to include folderId explicitly
  const updateNotebook = async (id, notebookData) => {
    try {
      console.log('updateNotebook called with:', { id, notebookData });
      
      const payload = {
        name: notebookData.name,
        description: notebookData.description,
        colorCode: notebookData.colorCode,
        tags: notebookData.tags,
        folderId: notebookData.folderId || null
      };
      
      console.log('Sending payload to API:', payload);
      
      const response = await fetch(`/api/notebooks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedNotebook = await response.json();
        console.log('Received updated notebook from API:', updatedNotebook);
        
        setNotebooks(prevNotebooks => 
          prevNotebooks.map(notebook => notebook.id === id ? updatedNotebook : notebook)
        );
        return updatedNotebook;
      } else {
        const errorText = await response.text();
        console.error('Failed to update notebook:', response.status, errorText);
        throw new Error(`Failed to update notebook: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating notebook:', error);
      throw error;
    }
  };

  const deleteNotebook = async (id) => {
    try {
      const response = await fetch(`/api/notebooks/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotebooks(prevNotebooks => prevNotebooks.filter(notebook => notebook.id !== id));
      } else {
        throw new Error(`Failed to delete notebook: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting notebook:', error);
      throw error;
    }
  };

  return {
    notebooks,
    loading,
    createNotebook,
    updateNotebook,
    deleteNotebook, 
    refreshNotebooks: fetchNotebooks
  };
};

export default useNotebooks;