import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'info': return <Info size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-400 border-green-600 text-black';
      case 'error': return 'bg-red-400 border-red-600 text-black';
      case 'warning': return 'bg-yellow-400 border-yellow-600 text-black';
      case 'info': return 'bg-blue-400 border-blue-600 text-black';
      default: return 'bg-green-400 border-green-600 text-black';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className={`
                p-4 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                font-mono text-sm max-w-sm cursor-pointer
                ${getColors(notification.type)}
              `}
              onClick={() => removeNotification(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{notification.message}</p>
                  <p className="text-xs mt-1 opacity-75">Click to dismiss</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};