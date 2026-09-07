import { usersRepository } from "../repository/users.repository.js";
import { toUserListItem, toUserDetail } from "../dto/users.dto.js";
import type { UpdateUserInput, UsersListQuery } from "../types/users.types.js";
import { NotFoundError, ConflictError, BadRequestError } from "../../../shared/errors/index.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";

export const usersService = {
  /**
   * Get a user by ID — returns the private detail shape.
   * Caller must enforce authorization.
   */
  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return toUserDetail(user);
  },

  /**
   * List users (paginated).
   */
  async list(query: UsersListQuery): Promise<PaginatedResponse<ReturnType<typeof toUserListItem>>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { username: { contains: query.search, mode: "insensitive" as const } },
            { name: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const orderBy = { [query.sortBy ?? "createdAt"]: query.order ?? "desc" } as const;

    const [users, total] = await Promise.all([
      usersRepository.findAll({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      usersRepository.count(where),
    ]);

    return {
      data: users.map(toUserListItem),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Update the authenticated user's account fields.
   * Validates uniqueness of username and email before saving.
   */
  async updateOwn(userId: string, input: UpdateUserInput) {
    const existing = await usersRepository.findById(userId);
    if (!existing) throw new NotFoundError("User not found");

    const data: Record<string, unknown> = {};

    if (input.username !== undefined && input.username !== existing.username) {
      const taken = await usersRepository.usernameExistsForOtherUser(input.username, userId);
      if (taken) throw new ConflictError("Username already taken");
      data.username = input.username;
    }

    if (input.email !== undefined && input.email !== existing.email) {
      const taken = await usersRepository.emailExistsForOtherUser(input.email, userId);
      if (taken) throw new ConflictError("Email already in use");
      data.email = input.email;
    }

    if (input.name !== undefined) data.name = input.name;

    if (Object.keys(data).length === 0) throw new BadRequestError("No fields to update");

    await usersRepository.update(userId, data);
  },

  /**
   * Delete the authenticated user's account.
   */
  async deleteOwn(userId: string) {
    const deleted = await usersRepository.deleteByOwner(userId);
    if (!deleted) throw new NotFoundError("User not found");
  },
};

export default usersService;
