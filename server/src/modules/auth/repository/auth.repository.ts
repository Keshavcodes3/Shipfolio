import { prisma } from "../../../config/database.js";

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findByUsername: (username: string) =>
    prisma.user.findUnique({ where: { username } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  findByClerkId: (clerkId: string) =>
    prisma.user.findUnique({ where: { clerkId } }),

  create: (data: { email: string; username: string; password?: string; name?: string; avatarUrl?: string; clerkId?: string }) =>
    prisma.user.create({ data }),

  update: (id: string, data: { name?: string; avatarUrl?: string }) =>
    prisma.user.update({ where: { id }, data }),

  updatePassword: (id: string, password: string) =>
    prisma.user.update({ where: { id }, data: { password } }),

  createSession: (data: { userId: string; tokenHash: string; expiresAt: Date }) =>
    prisma.session.create({ data }),

  findSessionByTokenHash: (tokenHash: string) =>
    prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    }),

  findSessionsByUserId: (userId: string) =>
    prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),

  deleteSession: (id: string) =>
    prisma.session.delete({ where: { id } }),

  deleteSessionByTokenHash: (tokenHash: string) =>
    prisma.session.delete({ where: { tokenHash } }),

  deleteSessionsByUserId: (userId: string) =>
    prisma.session.deleteMany({ where: { userId } }),

  deleteExpiredSessions: (before: Date) =>
    prisma.session.deleteMany({ where: { expiresAt: { lt: before } } }),
};

export default authRepository;

