// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export type CreateTechnologyInput = {
  name: string;
  category?: string | null;
};

export type UpdateTechnologyInput = {
  name?: string;
  category?: string | null;
};

export type AttachUserTechnologyInput = {
  technologyId: string;
  isPrimary?: boolean;
};

export type AttachProjectTechnologyInput = {
  technologyId: string;
  isPrimary?: boolean;
};

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export type TechnologyResponse = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  createdAt: Date;
};

export type UserTechnologyResponse = {
  technology: TechnologyResponse;
  isPrimary: boolean;
};

export type ProjectTechnologyResponse = {
  technology: TechnologyResponse;
  isPrimary: boolean;
};

// ---------------------------------------------------------------------------
// Query types
// ---------------------------------------------------------------------------

export type TechnologyListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "name" | "createdAt" | "category";
  order?: "asc" | "desc";
};

export type TechnologySearchParams = {
  q: string;
  limit?: number;
};
