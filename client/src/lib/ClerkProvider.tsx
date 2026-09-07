import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — add it to .env')
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <BaseClerkProvider
      publishableKey={publishableKey}
      afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/register"
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: '#B6F34A',
          colorBackground: '#0C0F0C',
          colorText: '#F5F7F2',
          colorInputBackground: 'transparent',
          colorInputText: '#F5F7F2',
          borderRadius: '6px',
          fontFamily: 'inherit',
        },
        elements: {
          rootBox: { width: '100%' },
          card: {
            backgroundColor: '#0C0F0C',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'none',
          },
          formFieldInput: {
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            color: '#F5F7F2',
            borderRadius: 0,
            padding: '12px 0',
            fontSize: '14px',
            '&:focus': { borderBottomColor: '#B6F34A' },
          },
          formFieldLabel: {
            color: '#8A8F89',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          },
          socialButtonsBlockButton: {
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8A8F89',
            fontSize: '12px',
            borderRadius: '4px',
            padding: '10px 16px',
            transition: 'all 200ms',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: '#F5F7F2',
              borderColor: 'rgba(255,255,255,0.15)',
            },
          },
          socialButtonsProviderIcon: { filter: 'none' },
          dividerLine: { backgroundColor: 'rgba(255,255,255,0.06)' },
          dividerText: {
            color: '#555B55',
            fontSize: '8px',
            letterSpacing: '0.25em',
          },
          formButtonPrimary: {
            backgroundColor: '#F5F7F2',
            color: '#080A08',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            borderRadius: 0,
            padding: '14px 20px',
            boxShadow: 'none',
            transition: 'all 200ms',
            '&:hover': {
              backgroundColor: '#E9ECE5',
              transform: 'translateY(-1px)',
            },
          },
          footerActionLink: {
            color: '#8A8F89',
            fontSize: '11px',
            '&:hover': { color: '#F5F7F2' },
          },
          headerTitle: {
            color: '#F5F7F2',
            fontSize: '24px',
            fontWeight: 500,
          },
          headerSubtitle: {
            color: '#555B55',
            fontSize: '13px',
          },
          formFieldSuccessText: { color: '#B6F34A' },
          formFieldErrorText: { color: '#ef4444' },
          logoBox: { display: 'none' },
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}
