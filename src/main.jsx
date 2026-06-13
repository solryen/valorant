import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RootLanguageProvider } from './contexts/RootLanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootLanguageProvider>
      <App />
    </RootLanguageProvider>
  </StrictMode>,
)
