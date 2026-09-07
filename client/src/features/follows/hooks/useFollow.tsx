import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FollowRelationship } from '../types/follows'
import { defaultFollowing } from '../data/followsData'

interface FollowsContextValue {
  following: string[]
  isFollowing: (username: string) => boolean
  toggleFollow: (username: string, displayName?: string) => void
}

const FollowsContext = createContext<FollowsContextValue | null>(null)

export function FollowsProvider({ children }: { children: ReactNode }) {
  const [followingList, setFollowingList] = useState<FollowRelationship[]>(defaultFollowing)

  const following = followingList.map((f) => f.username)

  const isFollowing = useCallback(
    (username: string) => following.includes(username),
    [following],
  )

  const toggleFollow = useCallback((username: string, displayName?: string) => {
    setFollowingList((prev) => {
      const exists = prev.find((f) => f.username === username)
      if (exists) {
        return prev.filter((f) => f.username !== username)
      }
      return [...prev, { username, displayName: displayName ?? username, followedAt: 'just now' }]
    })
  }, [])

  return (
    <FollowsContext.Provider value={{ following, isFollowing, toggleFollow }}>
      {children}
    </FollowsContext.Provider>
  )
}

export function useFollows() {
  const ctx = useContext(FollowsContext)
  if (!ctx) throw new Error('useFollows must be used within FollowsProvider')
  return ctx
}
