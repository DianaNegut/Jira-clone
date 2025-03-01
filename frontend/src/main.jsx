import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import SiteContextProvider from './Components/context/SiteContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
    <SiteContextProvider>
      <App />
    </SiteContextProvider>
  </BrowserRouter>
)
