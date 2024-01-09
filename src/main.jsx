import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { adminApi } from './services/api.jsx';
import { ApiProvider } from '@reduxjs/toolkit/query/react';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider api={adminApi}>
        <App />
    </ApiProvider>
  </React.StrictMode>
)
