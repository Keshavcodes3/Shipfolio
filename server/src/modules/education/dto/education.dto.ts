import type { EducationEntry } from "../types/education.types.js";

type RawEducation = {
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

export const toEducationEntry = (raw: RawEducation): EducationEntry => ({
  id: raw.id,
  institution: raw.institution,
  degree: raw.degree,
  fieldOfStudy: raw.fieldOfStudy,
  startYear: raw.startYear,
  endYear: raw.endYear,
  description: raw.description,
  sortOrder: raw.sortOrder,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const toEducationEntries = (raws: RawEducation[]): EducationEntry[] =>
  raws.map(toEducationEntry);
