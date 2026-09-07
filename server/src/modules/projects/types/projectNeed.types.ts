// ---------------------------------------------------------------------------
// Enums (mirroring Prisma enums for runtime use)
// ---------------------------------------------------------------------------

export const ProjectNeedType = {
  FEEDBACK: "FEEDBACK",
  BETA_TESTERS: "BETA_TESTERS",
  EARLY_USERS: "EARLY_USERS",
  COLLABORATOR: "COLLABORATOR",
  DESIGNER: "DESIGNER",
  DEVELOPER: "DEVELOPER",
  TECHNICAL_ADVICE: "TECHNICAL_ADVICE",
  PRODUCT_ADVICE: "PRODUCT_ADVICE",
  OPEN_SOURCE_CONTRIBUTORS: "OPEN_SOURCE_CONTRIBUTORS",
  OTHER: "OTHER",
} as const;

export type ProjectNeedTypeValue = (typeof ProjectNeedType)[keyof typeof ProjectNeedType];

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateProjectNeedInput = {
  type: ProjectNeedTypeValue;
  note?: string | null;
};

export type UpdateProjectNeedInput = {
  note?: string | null;
};

export type ExpressInterestInput = {
  message?: string | null;
};

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export type ProjectNeedResponse = {
  id: string;
  projectId: string;
  type: ProjectNeedTypeValue;
  note: string | null;
  interestCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectNeedWithInterestsResponse = ProjectNeedResponse & {
  interests: NeedInterestResponse[];
};

export type NeedInterestResponse = {
  id: string;
  needId: string;
  userId: string;
  message: string | null;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

// ---------------------------------------------------------------------------
// Discover needs (public)
// ---------------------------------------------------------------------------

export type DiscoverNeedItem = {
  need: ProjectNeedResponse;
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImageUrl: string | null;
    status: string;
    technologies: { id: string; name: string; slug: string }[];
  };
  owner: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

export type ProjectNeedsQuery = {
  type?: ProjectNeedTypeValue;
  page?: number;
  limit?: number;
};

export type DiscoverNeedsQuery = {
  type?: ProjectNeedTypeValue;
  technology?: string;
  search?: string;
  page?: number;
  limit?: number;
};
