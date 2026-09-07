import { describe, it, expect } from "vitest";
import { updateUserSchema, usersQuerySchema } from "../../../src/modules/users/schema/users.schema.js";

// ---------------------------------------------------------------------------
// updateUserSchema
// ---------------------------------------------------------------------------

describe("updateUserSchema", () => {
  it("accepts valid input with all fields", () => {
    const result = updateUserSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      username: "janedoe",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Jane Doe",
        email: "jane@example.com",
        username: "janedoe",
      });
    }
  });

  it("accepts empty object (all fields optional)", () => {
    const result = updateUserSchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("accepts partial updates", () => {
    expect(updateUserSchema.safeParse({ name: "Only Name" }).success).toBe(true);
    expect(updateUserSchema.safeParse({ email: "only@email.com" }).success).toBe(true);
    expect(updateUserSchema.safeParse({ username: "onlyuser" }).success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = updateUserSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = updateUserSchema.safeParse({ name: "A".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = updateUserSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects username shorter than 3 characters", () => {
    const result = updateUserSchema.safeParse({ username: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects username longer than 30 characters", () => {
    const result = updateUserSchema.safeParse({ username: "a".repeat(31) });
    expect(result.success).toBe(false);
  });

  it("rejects username with invalid characters", () => {
    expect(updateUserSchema.safeParse({ username: "user name" }).success).toBe(false);
    expect(updateUserSchema.safeParse({ username: "user@name" }).success).toBe(false);
    expect(updateUserSchema.safeParse({ username: "user.name" }).success).toBe(false);
  });

  it("accepts valid username with allowed characters", () => {
    expect(updateUserSchema.safeParse({ username: "john_doe" }).success).toBe(true);
    expect(updateUserSchema.safeParse({ username: "john-doe" }).success).toBe(true);
    expect(updateUserSchema.safeParse({ username: "John123" }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// usersQuerySchema
// ---------------------------------------------------------------------------

describe("usersQuerySchema", () => {
  it("applies defaults for missing fields", () => {
    const result = usersQuerySchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortBy).toBe("createdAt");
      expect(result.data.order).toBe("desc");
      expect(result.data.search).toBeUndefined();
    }
  });

  it("parses string query params to numbers", () => {
    const result = usersQuerySchema.safeParse({ page: "3", limit: "50" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it("accepts valid sortBy values", () => {
    expect(usersQuerySchema.safeParse({ sortBy: "username" }).success).toBe(true);
    expect(usersQuerySchema.safeParse({ sortBy: "createdAt" }).success).toBe(true);
  });

  it("rejects invalid sortBy", () => {
    const result = usersQuerySchema.safeParse({ sortBy: "email" });
    expect(result.success).toBe(false);
  });

  it("accepts valid order values", () => {
    expect(usersQuerySchema.safeParse({ order: "asc" }).success).toBe(true);
    expect(usersQuerySchema.safeParse({ order: "desc" }).success).toBe(true);
  });

  it("rejects invalid order", () => {
    const result = usersQuerySchema.safeParse({ order: "random" });
    expect(result.success).toBe(false);
  });

  it("enforces min page of 1", () => {
    const result = usersQuerySchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("enforces min limit of 1", () => {
    const result = usersQuerySchema.safeParse({ limit: 0 });
    expect(result.success).toBe(false);
  });

  it("enforces max limit of 100", () => {
    const result = usersQuerySchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });

  it("accepts limit at boundary (100)", () => {
    const result = usersQuerySchema.safeParse({ limit: 100 });
    expect(result.success).toBe(true);
  });

  it("accepts valid search string", () => {
    const result = usersQuerySchema.safeParse({ search: "john" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.search).toBe("john");
    }
  });

  it("rejects search exceeding 100 characters", () => {
    const result = usersQuerySchema.safeParse({ search: "a".repeat(101) });
    expect(result.success).toBe(false);
  });
});
