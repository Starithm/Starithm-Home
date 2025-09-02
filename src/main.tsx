import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../shared/components/ThemeProvider'
import App from './App.tsx'
import './index.css'
import '../shared/styles/globals.css'
import { StyledThemeProviderNew } from '../shared/components/StyledThemeProviderNew'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <StyledThemeProviderNew>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StyledThemeProviderNew>
    </ThemeProvider>
  </React.StrictMode>,
)
