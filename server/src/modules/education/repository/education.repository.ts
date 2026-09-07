import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

const educationSelect = {
  id: true,
  institution: true,
  degree: true,
  fieldOfStudy: true,
  startYear: true,
  endYear: true,
  description: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EducationSelect;

export const educationRepository = {
  findByUserId: (userId: string) =>
    prisma.education.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
      select: educationSelect,
    }),

  findById: (id: string) =>
    prisma.education.findUnique({
      where: { id },
      select: { ...educationSelect, userId: true },
    }),

  create: (userId: string, data: Omit<Prisma.EducationCreateInput, "user">) =>
    prisma.education.create({
      data: { ...data, user: { connect: { id: userId } } },
      select: educationSelect,
    }),

  update: (id: string, data: Prisma.EducationUpdateInput) =>
    prisma.education.update({
      where: { id },
      data,
      select: educationSelect,
    }),

  delete: (id: string) =>
    prisma.education.delete({ where: { id } }),

  count: (userId: string) =>
    prisma.education.count({ where: { userId } }),

  reorder: async (userId: string, orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) =>
      prisma.education.update({
        where: { id, userId },
        data: { sortOrder: index },
      })
    );
    await prisma.$transaction(updates);
  },

  getMaxSortOrder: (userId: string) =>
    prisma.education.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    }),
};

export default educationRepository;
