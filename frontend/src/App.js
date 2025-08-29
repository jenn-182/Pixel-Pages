// src/App.js
import React from 'react';
import PixelPages from './components/PixelPages';
import './index.css';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <div className="App">
        <PixelPages />
      </div>
    </NotificationProvider>
  );
}

export default App;