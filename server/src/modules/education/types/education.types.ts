export type EducationEntry = {
  id: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEducationInput = {
  institution: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startYear: number;
  endYear?: number | null;
  description?: string | null;
  sortOrder?: number;
};

export type UpdateEducationInput = {
  institution?: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startYear?: number;
  endYear?: number | null;
  description?: string | null;
  sortOrder?: number;
};

export type ReorderEducationInput = {
  ids: string[];
};
