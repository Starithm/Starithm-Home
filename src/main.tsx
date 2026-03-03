import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UnifiedThemeProvider } from '../shared/components/UnifiedThemeProvider'
import App from './App.tsx'
import './index.css'
import '../shared/styles/globals.css'
import { inject } from '@vercel/analytics'

inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UnifiedThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UnifiedThemeProvider>
  </React.StrictMode>,
)
