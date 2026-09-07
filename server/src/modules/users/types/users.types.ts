// ---------------------------------------------------------------------------
// Users module types — account-level operations (private)
// ---------------------------------------------------------------------------

export type UserListItem = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

export type UserDetail = UserListItem & {
  email: string;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
  updatedAt: Date;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  username?: string;
};

export type UsersListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "username" | "createdAt";
  order?: "asc" | "desc";
};
