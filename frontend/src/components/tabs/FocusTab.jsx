import React from 'react';
import { motion } from 'framer-motion';

const FocusTab = ({ tabColor = '#6366F1' }) => {
  return (
    <div className="focus-tab-container p-6 flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="font-mono text-6xl font-bold text-white">
          Coming soon!
        </h1>
      </motion.div>
    </div>
  );
};

export default FocusTab;