import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExecutionDashboard } from './views/ExecutionDashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExecutionDashboard />
  </React.StrictMode>
);