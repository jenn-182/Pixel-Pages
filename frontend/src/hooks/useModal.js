import { useState, useCallback } from 'react';

export const useModal = () => {
  const [modals, setModals] = useState({});

  const openModal = useCallback((modalType, data = {}) => {
    setModals(prev => ({
      ...prev,
      [modalType]: {
        isOpen: true,
        data: data
      }
    }));
  }, []);

  const closeModal = useCallback((modalType) => {
    setModals(prev => ({
      ...prev,
      [modalType]: {
        isOpen: false,
        data: {}
      }
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({});
  }, []);

  const isModalOpen = useCallback((modalType) => {
    return modals[modalType]?.isOpen || false;
  }, [modals]);

  const getModalData = useCallback((modalType) => {
    return modals[modalType]?.data || {};
  }, [modals]);

  const updateModalData = useCallback((modalType, newData) => {
    setModals(prev => ({
      ...prev,
      [modalType]: {
        ...prev[modalType],
        data: { ...prev[modalType]?.data, ...newData }
      }
    }));
  }, []);

  return {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,
    updateModalData,
    modals
  };
};