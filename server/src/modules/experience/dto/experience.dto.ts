import type { ExperienceEntry } from "../types/experience.types.js";

type RawExperience = {
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

export const toExperienceEntry = (raw: RawExperience): ExperienceEntry => ({
  id: raw.id,
  company: raw.company,
  role: raw.role,
  startDate: raw.startDate,
  endDate: raw.endDate,
  description: raw.description,
  technologies: raw.technologies,
  sortOrder: raw.sortOrder,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const toExperienceEntries = (raws: RawExperience[]): ExperienceEntry[] =>
  raws.map(toExperienceEntry);
