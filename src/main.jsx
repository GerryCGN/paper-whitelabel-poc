import React from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);
