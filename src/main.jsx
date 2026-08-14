// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👑 アプリ全体で動的OGP/タイトル変更を可能にするシールド */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)