import type {
  PublicProfile,
  PublicProfileProject,
  PublicProfileTechnology,
  PublicProfileGithubRepo,
  PrivateProfile,
  PrivateProfileActivity,
  TechnologyStackItem,
  ProjectStatusSummary,
  GithubActivitySummary,
  BuildTimelineItem,
  ProfileEducationEntry,
  ProfileExperienceEntry,
} from "../types/profiles.types.js";

// ---------------------------------------------------------------------------
// Prisma result types — the shapes returned by our repository queries.
// ---------------------------------------------------------------------------

type RepoUser = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  projects: RepoProject[];
  technologies: RepoUserTech[];
  education: RepoEducation[];
  experience: RepoExperience[];
  githubAccount: RepoGithubAccount | null;
  _count: { followers: number; following: number; projects: number };
};

type RepoProject = {
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
  technologies: { technology: { id: string; name: string; slug: string } }[];
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

type RepoUserTech = {
  isPrimary: boolean;
  technology: { id: string; name: string; slug: string };
};

type RepoEducation = {
  id: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  sortOrder: number;
};

type RepoExperience = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  technologies: string[];
  sortOrder: number;
};

type RepoGithubAccount = {
  username: string;
  repositories: {
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
    isArchived: boolean;
  }[];
};

type RepoActivity = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  url: string | null;
  occurredAt: Date;
  project: { id: string; name: string; slug: string } | null;
};

type AggregationData = {
  isFollowing?: boolean;
  isOwnProfile: boolean;
  currentlyBuilding: RepoProject | null;
  featuredProjects: RepoProject[];
  projectStatuses: ProjectStatusSummary;
  technologyStack: TechnologyStackItem[];
  githubActivity: GithubActivitySummary[];
  buildTimeline: BuildTimelineItem[];
};

// ---------------------------------------------------------------------------
// Project mapper
// ---------------------------------------------------------------------------

const toPublicProfileProject = (p: RepoProject): PublicProfileProject => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  coverImageUrl: p.coverImageUrl,
  status: p.status,
  visibility: p.visibility,
  liveUrl: p.liveUrl,
  demoUrl: p.demoUrl,
  isFeatured: p.isFeatured,
  isCurrentlyBuilding: p.isCurrentlyBuilding,
  startedAt: p.startedAt,
  updatedAt: p.updatedAt,
  technologies: p.technologies.map((t) => ({
    id: t.technology.id,
    name: t.technology.name,
    slug: t.technology.slug,
  })),
  githubRepo: p.githubRepo ?? undefined,
});

// ---------------------------------------------------------------------------
// Education mapper
// ---------------------------------------------------------------------------

const toProfileEducationEntry = (e: RepoEducation): ProfileEducationEntry => ({
  id: e.id,
  institution: e.institution,
  degree: e.degree,
  fieldOfStudy: e.fieldOfStudy,
  startYear: e.startYear,
  endYear: e.endYear,
  description: e.description,
  sortOrder: e.sortOrder,
});

// ---------------------------------------------------------------------------
// Experience mapper
// ---------------------------------------------------------------------------

const toProfileExperienceEntry = (e: RepoExperience): ProfileExperienceEntry => ({
  id: e.id,
  company: e.company,
  role: e.role,
  startDate: e.startDate,
  endDate: e.endDate,
  description: e.description,
  technologies: e.technologies,
  sortOrder: e.sortOrder,
});

// ---------------------------------------------------------------------------
// Public profile DTO — safe for any caller
// ---------------------------------------------------------------------------

export const toPublicProfile = (
  user: RepoUser,
  agg: AggregationData,
): PublicProfile => ({
  id: user.id,
  username: user.username,
  name: user.name,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
  location: user.location,
  websiteUrl: user.websiteUrl,
  linkedinUrl: user.linkedinUrl,
  createdAt: user.createdAt,
  githubUsername: user.githubAccount?.username ?? null,
  currentlyBuilding: agg.currentlyBuilding ? toPublicProfileProject(agg.currentlyBuilding) : null,
  featuredProjects: agg.featuredProjects.map(toPublicProfileProject),
  projects: user.projects.map(toPublicProfileProject),
  projectStatuses: agg.projectStatuses,
  technologies: user.technologies.map(toPublicProfileTechnology),
  technologyStack: agg.technologyStack,
  githubRepos: (user.githubAccount?.repositories ?? []).map(toPublicProfileGithubRepo),
  githubActivity: agg.githubActivity,
  buildTimeline: agg.buildTimeline,
  education: user.education.map(toProfileEducationEntry),
  experience: user.experience.map(toProfileExperienceEntry),
  counts: {
    followers: user._count.followers,
    following: user._count.following,
    projects: user._count.projects,
  },
  ...(agg.isFollowing !== undefined ? { isFollowing: agg.isFollowing } : {}),
  isOwnProfile: agg.isOwnProfile,
});

const toPublicProfileTechnology = (t: RepoUserTech): PublicProfileTechnology => ({
  id: t.technology.id,
  name: t.technology.name,
  slug: t.technology.slug,
  isPrimary: t.isPrimary,
});

const toPublicProfileGithubRepo = (r: RepoGithubAccount["repositories"][0]): PublicProfileGithubRepo => ({
  id: r.id,
  name: r.name,
  fullName: r.fullName,
  description: r.description,
  htmlUrl: r.htmlUrl,
  primaryLanguage: r.primaryLanguage,
  stars: r.stars,
  forks: r.forks,
  isArchived: r.isArchived,
});

// ---------------------------------------------------------------------------
// Private profile DTO — only returned to the authenticated owner
// ---------------------------------------------------------------------------

export const toPrivateProfile = (
  user: RepoUser,
  recentActivity: RepoActivity[],
  agg: Omit<AggregationData, "isFollowing">,
): PrivateProfile => ({
  ...toPublicProfile(user, { ...agg, isFollowing: undefined }),
  email: user.email,
  updatedAt: user.updatedAt,
  recentActivity: recentActivity.map(toPrivateProfileActivity),
});

const toPrivateProfileActivity = (a: RepoActivity): PrivateProfileActivity => ({
  id: a.id,
  type: a.type,
  title: a.title,
  description: a.description,
  url: a.url,
  occurredAt: a.occurredAt,
  project: a.project,
});
