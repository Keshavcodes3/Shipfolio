import type {
  TechnologyResponse,
  UserTechnologyResponse,
  ProjectTechnologyResponse,
} from "../types/technologies.types.js";

// ---------------------------------------------------------------------------
// Technology DTO
// ---------------------------------------------------------------------------

export const toTechnologyResponse = (tech: {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: Date;
}): TechnologyResponse => ({
  id: tech.id,
  name: tech.name,
  slug: tech.slug,
  category: tech.category,
  createdAt: tech.createdAt,
});

// ---------------------------------------------------------------------------
// UserTechnology DTO
// ---------------------------------------------------------------------------

export const toUserTechnologyResponse = (ut: {
  isPrimary: boolean;
  technology: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    createdAt: Date;
  };
}): UserTechnologyResponse => ({
  technology: toTechnologyResponse(ut.technology),
  isPrimary: ut.isPrimary,
});

// ---------------------------------------------------------------------------
// ProjectTechnology DTO
// ---------------------------------------------------------------------------

export const toProjectTechnologyResponse = (pt: {
  isPrimary: boolean;
  technology: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    createdAt: Date;
  };
}): ProjectTechnologyResponse => ({
  technology: toTechnologyResponse(pt.technology),
  isPrimary: pt.isPrimary,
});
