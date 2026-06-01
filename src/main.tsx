import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { FavoritosProvider } from './contexts/FavoritosContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </React.StrictMode>,
);