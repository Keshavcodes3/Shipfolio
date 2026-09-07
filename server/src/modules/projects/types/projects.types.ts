// ---------------------------------------------------------------------------
// Enums (mirroring Prisma enums for runtime use)
// ---------------------------------------------------------------------------

export const ProjectStatus = {
  BUILDING: "BUILDING",
  SHIPPED: "SHIPPED",
  MAINTAINING: "MAINTAINING",
  PAUSED: "PAUSED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProjectStatusType = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type ProjectVisibilityType = (typeof ProjectVisibility)[keyof typeof ProjectVisibility];

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateProjectInput = {
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  status?: ProjectStatusType;
  visibility?: ProjectVisibilityType;
  liveUrl?: string | null;
  demoUrl?: string | null;
  githubRepoId?: string | null;
  startedAt?: string | null;
  isFeatured?: boolean;
  isCurrentlyBuilding?: boolean;
  technologyIds?: string[];
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  status?: ProjectStatusType;
  visibility?: ProjectVisibilityType;
  liveUrl?: string | null;
  demoUrl?: string | null;
  githubRepoId?: string | null;
  startedAt?: string | null;
  isFeatured?: boolean;
  isCurrentlyBuilding?: boolean;
  technologyIds?: string[];
};

// ---------------------------------------------------------------------------
// Response types — public (safe for any caller)
// ---------------------------------------------------------------------------

export type ProjectResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  status: ProjectStatusType;
  visibility: ProjectVisibilityType;
  liveUrl: string | null;
  demoUrl: string | null;
  startedAt: Date | null;
  lastUpdatedAt: Date | null;
  isFeatured: boolean;
  isCurrentlyBuilding: boolean;
  createdAt: Date;
  updatedAt: Date;
  technologies: ProjectTechnologyResponse[];
  user?: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  _count?: {
    activities: number;
  };
};

export type ProjectTechnologyResponse = {
  technology: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
  };
  isPrimary: boolean;
};

// ---------------------------------------------------------------------------
// Response types — detail (includes owner-only fields)
// ---------------------------------------------------------------------------

export type ProjectDetailResponse = ProjectResponse & {
  userId: string;
  githubRepoId: string | null;
  githubRepo?: {
    id: string;
    name: string;
    fullName: string;
    htmlUrl: string;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
  } | null;
  activities?: ProjectActivityResponse[];
};

export type ProjectActivityResponse = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  url: string | null;
  actorUsername: string | null;
  actorAvatarUrl: string | null;
  occurredAt: Date;
};

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

export type ProjectListQuery = {
  page?: number;
  limit?: number;
  status?: ProjectStatusType;
  visibility?: ProjectVisibilityType;
  sortBy?: "createdAt" | "updatedAt" | "name" | "startedAt";
  order?: "asc" | "desc";
  search?: string;
  userId?: string;
  featured?: boolean;
  technology?: string;
};

export type ProjectParams = {
  id: string;
};
