import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import SiteContextProvider from './Components/context/SiteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <SiteContextProvider>
        <App />
      </SiteContextProvider>
    </Router>
  </React.StrictMode>
);