import { prisma } from "../../../config/database.js";
import type { Prisma } from "@prisma/client";

export const usersRepository = {
  findAll: (args?: Prisma.UserFindManyArgs) =>
    prisma.user.findMany(args),

  findById: (id: string, include?: Prisma.UserInclude) =>
    prisma.user.findUnique({ where: { id }, include }),

  findByUsername: (username: string, include?: Prisma.UserInclude) =>
    prisma.user.findUnique({ where: { username }, include }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: Prisma.UserCreateInput) =>
    prisma.user.create({ data }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),

  /**
   * Updates a user only when the requesting user matches the target user.
   * Returns `false` when the user does not exist or ownership check fails.
   */
  updateByOwner: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.updateMany({
      where: { id },
      data,
    }).then((result) => result.count > 0),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),

  /**
   * Deletes a user only when the requesting user matches the target user.
   * Returns `false` when the user does not exist or ownership check fails.
   */
  deleteByOwner: (id: string) =>
    prisma.user.deleteMany({
      where: { id },
    }).then((result) => result.count > 0),

  count: (where?: Prisma.UserWhereInput) =>
    prisma.user.count({ where }),

  /**
   * Check if a username is already taken.
   */
  usernameExists: (username: string) =>
    prisma.user.findUnique({
      where: { username },
      select: { id: true },
    }).then(Boolean),

  /**
   * Check if a username is already taken, excluding a specific user.
   */
  usernameExistsForOtherUser: (username: string, excludeUserId: string) =>
    prisma.user.findFirst({
      where: { username, id: { not: excludeUserId } },
      select: { id: true },
    }).then(Boolean),

  /**
   * Check if an email is already taken, excluding a specific user.
   */
  emailExistsForOtherUser: (email: string, excludeUserId: string) =>
    prisma.user.findFirst({
      where: { email, id: { not: excludeUserId } },
      select: { id: true },
    }).then(Boolean),

  search: (query: string, limit?: number) =>
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit ?? 20,
      select: { id: true, username: true, name: true, avatarUrl: true },
    }),
};

export default usersRepository;
