import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { UnifiedThemeProvider } from '../shared/components/UnifiedThemeProvider'
import App from './App.tsx'
import './index.css'
import '../shared/styles/globals.css'
import { inject } from '@vercel/analytics'

inject()

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY} appearance={{
      variables: {
        colorBackground: '#0f0f0f',
        colorInputBackground: '#1a1a1a',
        colorInputText: '#e0e0e0',
        colorText: '#e0e0e0',
        colorTextSecondary: '#e0e0e0',
        colorPrimary: '#7c3aed',
        colorDanger: '#ef4444',
        colorSuccess: '#22c55e',
        colorNeutral: '#e0e0e0',
        colorTextOnPrimaryBackground: '#ffffff',
        borderRadius: '0.5rem',
      },
      elements: {
        // Modal / card
        card: { background: '#0f0f0f', border: '1px solid #2a2a2a', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' },
        cardBox: { background: '#0f0f0f' },
        modalContent: { background: '#0f0f0f' },
        // Header
        headerTitle: { color: '#ffffff' },
        headerSubtitle: { color: '#cccccc' },
        // Nav / profile sidebar
        navbarButton: { color: '#cccccc' },
        navbarButtonIcon: { color: '#cccccc' },
        profileSectionTitle: { color: '#ffffff' },
        profileSectionTitleText: { color: '#ffffff' },
        profileSectionContent: { color: '#cccccc' },
        profileSectionPrimaryButton: { color: '#a78bfa' },
        accordionTriggerButton: { color: '#cccccc' },
        // Page title and subtitle
        pageScrollBox: { background: '#0f0f0f' },
        page: { background: '#0f0f0f' },
        // Navbar / sidebar
        navbar: { background: '#111111', borderRight: '1px solid #2a2a2a' },
        navbarMobileMenuButton: { color: '#cccccc' },
        // Breadcrumb
        breadcrumbsItem: { color: '#cccccc' },
        breadcrumbsItemDivider: { color: '#555555' },
        // Social buttons
        socialButtonsBlockButton: { background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#e0e0e0' },
        socialButtonsBlockButtonText: { color: '#e0e0e0' },
        // Divider
        dividerLine: { background: '#2a2a2a' },
        dividerText: { color: '#888888' },
        // Form
        formFieldLabel: { color: '#cccccc' },
        formFieldInput: { background: '#1a1a1a', color: '#e0e0e0', borderColor: '#333333' },
        formFieldHintText: { color: '#888888' },
        formFieldErrorText: { color: '#ef4444' },
        // Footer
        footerActionLink: { color: '#a78bfa' },
        footerActionText: { color: '#cccccc' },
        footer: { color: '#cccccc', background: '#0f0f0f' },
        footerPages: { background: '#0f0f0f' },
        // Badges / tags
        badge: { background: '#1a1a1a', color: '#cccccc', borderColor: '#333333' },
        // General text
        identityPreviewText: { color: '#cccccc' },
        identityPreviewEditButton: { color: '#a78bfa' },
        // User name / email in profile rows
        userPreviewMainIdentifier: { color: '#ffffff' },
        userPreviewSecondaryIdentifier: { color: '#cccccc' },
        userButtonPopoverActionButtonText: { color: '#cccccc' },
        // Profile section content (email, connected accounts)
        profileSectionItem: { color: '#cccccc' },
        profileSectionItemText: { color: '#cccccc' },
        profileSectionPrimaryButton__connectedAccounts: { color: '#a78bfa' },
        // Page subtitle ("Manage your account info.")
        pageHeaderSubtitle: { color: '#cccccc' },
        // Menu items (... button dropdowns)
        menuItem: { color: '#cccccc', background: '#1a1a1a' },
        menuList: { background: '#1a1a1a', border: '1px solid #2a2a2a' },
        // Tags / badges inside sections
        formFieldInputGroup: { background: '#1a1a1a', borderColor: '#333' },
        // Rows in profile sections
        accordionContent: { color: '#cccccc' },
        tableHead: { color: '#888888' },
      },
    }}>
      <UnifiedThemeProvider defaultTheme="dark">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UnifiedThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
