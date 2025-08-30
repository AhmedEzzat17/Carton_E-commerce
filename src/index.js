import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import Dashboard from './components/dashboard/Dashboard.jsx'; // استيراد مكون لوحة التحكم

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Dashboard /> */}
  </React.StrictMode>
);