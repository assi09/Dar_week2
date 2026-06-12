import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FeedbackPage from './components/FeedbackPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {window.location.pathname === '/feedback' ? <FeedbackPage /> : <App />}
  </StrictMode>,
)
