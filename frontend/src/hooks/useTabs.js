import { useState, useEffect, useCallback } from 'react';

const TAB_STORAGE_KEY = 'pixelPages_activeTab';
const DEFAULT_TAB = 'notes';

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Load from localStorage on initialization
    try {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
      return savedTab || DEFAULT_TAB;
    } catch (error) {
      console.warn('Failed to load tab from localStorage:', error);
      return DEFAULT_TAB;
    }
  });

  // Save to localStorage whenever tab changes
  useEffect(() => {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, activeTab);
    } catch (error) {
      console.warn('Failed to save tab to localStorage:', error);
    }
  }, [activeTab]);

  const changeTab = useCallback((newTab) => {
    setActiveTab(newTab);
  }, []);

  const resetTabs = useCallback(() => {
    setActiveTab(DEFAULT_TAB);
    try {
      localStorage.removeItem(TAB_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear tab from localStorage:', error);
    }
  }, []);

  return {
    activeTab,
    changeTab,
    resetTabs
  };
};