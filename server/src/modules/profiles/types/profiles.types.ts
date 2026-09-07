// ---------------------------------------------------------------------------
// Public types — safe for any caller, never leaks secrets
// ---------------------------------------------------------------------------

export type PublicProfile = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  githubUsername: string | null;
  // Aggregated data
  currentlyBuilding: PublicProfileProject | null;
  featuredProjects: PublicProfileProject[];
  projects: PublicProfileProject[];
  projectStatuses: ProjectStatusSummary;
  technologies: PublicProfileTechnology[];
  technologyStack: TechnologyStackItem[];
  githubRepos: PublicProfileGithubRepo[];
  githubActivity: GithubActivitySummary[];
  buildTimeline: BuildTimelineItem[];
  education: ProfileEducationEntry[];
  experience: ProfileExperienceEntry[];
  counts: {
    followers: number;
    following: number;
    projects: number;
  };
  isFollowing?: boolean;
  isOwnProfile: boolean;
};

export type ProfileEducationEntry = {
  id: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  sortOrder: number;
};

export type ProfileExperienceEntry = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  technologies: string[];
  sortOrder: number;
};

export type PublicProfileProject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  status: string;
  visibility: string;
  liveUrl: string | null;
  demoUrl: string | null;
  isFeatured: boolean;
  isCurrentlyBuilding: boolean;
  startedAt: Date | null;
  updatedAt: Date;
  technologies: { id: string; name: string; slug: string }[];
  githubRepo?: {
    id: string;
    name: string;
    fullName: string;
    htmlUrl: string;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
  } | null;
};

export type PublicProfileTechnology = {
  id: string;
  name: string;
  slug: string;
  isPrimary: boolean;
};

export type TechnologyStackItem = {
  id: string;
  name: string;
  slug: string;
  projectCount: number;
  isPrimary: boolean;
};

export type ProjectStatusSummary = {
  building: number;
  shipped: number;
  maintaining: number;
  paused: number;
  archived: number;
  total: number;
};

export type PublicProfileGithubRepo = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  isArchived: boolean;
};

export type GithubActivitySummary = {
  type: string;
  count: number;
  latestAt: Date | null;
};

export type BuildTimelineItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  startedAt: Date | null;
  updatedAt: Date;
};

// ---------------------------------------------------------------------------
// Private types — only returned to the authenticated owner
// ---------------------------------------------------------------------------

export type PrivateProfile = PublicProfile & {
  email: string;
  updatedAt: Date;
  recentActivity: PrivateProfileActivity[];
};

export type PrivateProfileActivity = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  url: string | null;
  occurredAt: Date;
  project: { id: string; name: string; slug: string } | null;
};

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type UpdateProfileInput = {
  name?: string;
  username?: string;
  bio?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
};

export type UsernameAvailabilityResult = {
  available: boolean;
  username: string;
};

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

export type ProfilesListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "username" | "createdAt" | "projects";
  order?: "asc" | "desc";
};

export type ProfileFollowersQuery = {
  page?: number;
  limit?: number;
};

export type ProfileFollowingQuery = {
  page?: number;
  limit?: number;
};
