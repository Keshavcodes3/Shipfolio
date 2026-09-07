import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

const experienceSelect = {
  id: true,
  company: true,
  role: true,
  startDate: true,
  endDate: true,
  description: true,
  technologies: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ExperienceSelect;

export const experienceRepository = {
  findByUserId: (userId: string) =>
    prisma.experience.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
      select: experienceSelect,
    }),

  findById: (id: string) =>
    prisma.experience.findUnique({
      where: { id },
      select: { ...experienceSelect, userId: true },
    }),

  create: (userId: string, data: Omit<Prisma.ExperienceCreateInput, "user">) =>
    prisma.experience.create({
      data: { ...data, user: { connect: { id: userId } } },
      select: experienceSelect,
    }),

  update: (id: string, data: Prisma.ExperienceUpdateInput) =>
    prisma.experience.update({
      where: { id },
      data,
      select: experienceSelect,
    }),

  delete: (id: string) =>
    prisma.experience.delete({ where: { id } }),

  count: (userId: string) =>
    prisma.experience.count({ where: { userId } }),

  reorder: async (userId: string, orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) =>
      prisma.experience.update({
        where: { id, userId },
        data: { sortOrder: index },
      })
    );
    await prisma.$transaction(updates);
  },

  getMaxSortOrder: (userId: string) =>
    prisma.experience.aggregate({
      where: { userId },
      _max: { sortOrder: true },
    }),
};

export default experienceRepository;
