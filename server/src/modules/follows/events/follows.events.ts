// ---------------------------------------------------------------------------
// Follow domain events
// ---------------------------------------------------------------------------

export const FollowEvents = {
  USER_FOLLOWED: "user.followed",
  USER_UNFOLLOWED: "user.unfollowed",
} as const;

export type UserFollowedPayload = {
  followerId: string;
  followingId: string;
};

export type UserUnfollowedPayload = {
  followerId: string;
  followingId: string;
};
