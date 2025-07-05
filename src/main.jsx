import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MiyawakiForestPlanner from './MiyawakiForestPlanner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MiyawakiForestPlanner />
  </StrictMode>,
)
