import { useAuth as useClerkAuth, useUser as useClerkUser, useClerk, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { api } from '../../../lib/api'

/* ─── Clerk-based auth context ─── */

interface AuthUser {
  id: string
  backendId?: string
  username: string
  displayName: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  githubUsername?: string
  createdAt?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  getToken: () => Promise<string | null>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  backendToken: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth()
  const { user: clerkUser } = useClerkUser()
  const clerk = useClerk()
  const [backendToken, setBackendToken] = useState<string | null>(() => localStorage.getItem('access_token'))
  const [backendUser, setBackendUser] = useState<AuthUser | null>(null)
  const [syncError, setSyncError] = useState(false)

  // Sync with backend when Clerk user changes
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) {
      if (!isSignedIn && isLoaded) {
        localStorage.removeItem('access_token')
        setBackendToken(null)
        setBackendUser(null)
        setSyncError(false)
      }
      return
    }

    let cancelled = false

    async function syncWithBackend() {
      if (!clerkUser) return
      try {
        setSyncError(false)
        const clerkToken = await getToken()
        if (!clerkToken || cancelled) return

        // Get GitHub info from Clerk external accounts if available
        const githubAccount = clerkUser.externalAccounts?.find(
          (acc: any) => acc.provider === 'github'
        )
        let githubUsername: string | undefined
        let githubUserId: string | undefined

        if (githubAccount) {
          githubUsername = githubAccount.username
          githubUserId = githubAccount.providerUserId
        }

        const { data } = await api.post('/auth/clerk/sync', {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress ?? '',
          name: clerkUser.fullName ?? clerkUser.firstName ?? '',
          avatarUrl: clerkUser.imageUrl,
          githubUsername,
          githubUserId,
        })

        if (cancelled) return

        const token = data.data.token
        localStorage.setItem('access_token', token)
        setBackendToken(token)
        setBackendUser({
          id: clerkUser.id,
          backendId: data.data.user.id,
          username: data.data.user.username,
          displayName: data.data.user.name ?? clerkUser.firstName ?? '',
          email: data.data.user.email,
          avatar: clerkUser.imageUrl,
          githubUsername: data.data.user.githubUsername,
        })
      } catch (err) {
        console.error('Failed to sync with backend:', err)
        if (!cancelled) setSyncError(true)
      }
    }

    syncWithBackend()

    return () => { cancelled = true }
  }, [isLoaded, isSignedIn, clerkUser, getToken])

  const user: AuthUser | null = backendUser ?? (clerkUser ? {
    id: clerkUser.id,
    username: clerkUser.username ?? clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '',
    displayName: clerkUser.fullName ?? clerkUser.firstName ?? '',
    email: clerkUser.emailAddresses?.[0]?.emailAddress ?? '',
    avatar: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined,
  } : null)

  const logout = useCallback(async () => {
    localStorage.removeItem('access_token')
    setBackendToken(null)
    setBackendUser(null)
    await clerk.signOut()
  }, [clerk])

  const refreshUser = useCallback(async () => {
    await clerk.user?.reload()
  }, [clerk])

  // When Clerk is loaded and signed in but backend sync failed, still allow
  // the user to proceed with Clerk-only data so the UI doesn't get stuck.
  const isLoading = !isLoaded || (isSignedIn && !backendUser && !syncError)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!isSignedIn,
        getToken,
        logout,
        refreshUser,
        backendToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton }
