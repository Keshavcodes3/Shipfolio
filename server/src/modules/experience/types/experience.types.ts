export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  technologies: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateExperienceInput = {
  company: string;
  role: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description?: string | null;
  technologies?: string[];
  sortOrder?: number;
};

export type UpdateExperienceInput = {
  company?: string;
  role?: string;
  startDate?: string | Date;
  endDate?: string | Date | null;
  description?: string | null;
  technologies?: string[];
  sortOrder?: number;
};

export type ReorderExperienceInput = {
  ids: string[];
};
