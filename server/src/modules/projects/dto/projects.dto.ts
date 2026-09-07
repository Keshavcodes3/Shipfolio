import type {
  ProjectResponse,
  ProjectDetailResponse,
  ProjectTechnologyResponse,
  ProjectActivityResponse,
} from "../types/projects.types.js";

// ---------------------------------------------------------------------------
// Prisma result types — shapes returned by repository queries.
// Defined inline to avoid runtime Prisma dependency in the DTO layer.
// ---------------------------------------------------------------------------

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
  startedAt: Date | null;
  lastUpdatedAt: Date | null;
  isFeatured: boolean;
  isCurrentlyBuilding: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  githubRepoId: string | null;
  technologies: {
    isPrimary: boolean;
    technology: {
      id: string;
      name: string;
      slug: string;
      category: string | null;
    };
  }[];
  user?: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
  githubRepo?: {
    id: string;
    name: string;
    fullName: string;
    htmlUrl: string;
    primaryLanguage: string | null;
    stars: number;
    forks: number;
  } | null;
  _count?: {
    activities: number;
  };
  activities?: {
    id: string;
    type: string;
    title: string | null;
    description: string | null;
    url: string | null;
    actorUsername: string | null;
    actorAvatarUrl: string | null;
    occurredAt: Date;
  }[];
};

// ---------------------------------------------------------------------------
// Public response — safe for any caller
// ---------------------------------------------------------------------------

export const toProjectResponse = (project: RepoProject): ProjectResponse => ({
  id: project.id,
  name: project.name,
  slug: project.slug,
  description: project.description,
  coverImageUrl: project.coverImageUrl,
  status: project.status as ProjectResponse["status"],
  visibility: project.visibility as ProjectResponse["visibility"],
  liveUrl: project.liveUrl,
  demoUrl: project.demoUrl,
  startedAt: project.startedAt,
  lastUpdatedAt: project.lastUpdatedAt,
  isFeatured: project.isFeatured,
  isCurrentlyBuilding: project.isCurrentlyBuilding,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  technologies: project.technologies.map(toProjectTechnologyResponse),
  ...(project.user ? { user: { id: project.user.id, username: project.user.username, displayName: project.user.name, avatarUrl: project.user.avatarUrl } } : {}),
  ...(project._count ? { _count: project._count } : {}),
});

// ---------------------------------------------------------------------------
// Detail response — includes owner-only fields (githubRepoId, activities)
// ---------------------------------------------------------------------------

export const toProjectDetailResponse = (project: RepoProject): ProjectDetailResponse => ({
  ...toProjectResponse(project),
  userId: project.userId,
  githubRepoId: project.githubRepoId,
  githubRepo: project.githubRepo
    ? {
        id: project.githubRepo.id,
        name: project.githubRepo.name,
        fullName: project.githubRepo.fullName,
        htmlUrl: project.githubRepo.htmlUrl,
        primaryLanguage: project.githubRepo.primaryLanguage,
        stars: project.githubRepo.stars,
        forks: project.githubRepo.forks,
      }
    : null,
  activities: project.activities?.map(toProjectActivityResponse),
});

// ---------------------------------------------------------------------------
// Sub-mappers
// ---------------------------------------------------------------------------

const toProjectTechnologyResponse = (t: RepoProject["technologies"][0]): ProjectTechnologyResponse => ({
  technology: {
    id: t.technology.id,
    name: t.technology.name,
    slug: t.technology.slug,
    category: t.technology.category,
  },
  isPrimary: t.isPrimary,
});

const toProjectActivityResponse = (a: NonNullable<RepoProject["activities"]>[number]): ProjectActivityResponse => ({
  id: a.id,
  type: a.type,
  title: a.title,
  description: a.description,
  url: a.url,
  actorUsername: a.actorUsername,
  actorAvatarUrl: a.actorAvatarUrl,
  occurredAt: a.occurredAt,
});
