export interface FollowRelationship {
  username: string
  displayName: string
  followedAt: string
}

export type FollowAction = 'FOLLOW' | 'UNFOLLOW'
