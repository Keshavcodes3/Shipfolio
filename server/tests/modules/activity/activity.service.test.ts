import { describe, it, expect, vi, beforeEach } from "vitest";
import { activityRepository } from "../../../src/modules/activity/repository/activity.repository.js";
import { activityService } from "../../../src/modules/activity/service/activity.service.js";
import { prisma } from "../../../src/config/database.js";

vi.mock("../../../src/modules/activity/repository/activity.repository.js");

const mockRepo = vi.mocked(activityRepository);
const mockPrisma = vi.mocked(prisma);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeActivity = (overrides = {}) => ({
  id: "act-1",
  type: "COMMIT",
  externalId: "ext-1",
  title: "feat: add login",
  description: null,
  url: "https://github.com/owner/repo/commit/abc123",
  occurredAt: new Date("2024-06-01"),
  metadata: {},
  createdAt: new Date("2024-06-01"),
  updatedAt: new Date("2024-06-01"),
  projectId: "proj-1",
  githubRepoId: "repo-1",
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("activityService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // list
  // =========================================================================

  describe("list", () => {
    it("calls findAll with PUBLIC project visibility filter", async () => {
      const activities = [makeActivity(), makeActivity({ id: "act-2" })];
      mockRepo.findAll.mockResolvedValue(activities as any);

      const query = { page: 1, limit: 10 };
      const result = await activityService.list(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith({
        ...query,
        where: { project: { visibility: "PUBLIC" } },
      });
      expect(result).toEqual(activities);
      expect(result).toHaveLength(2);
    });

    it("merges visibility filter with existing where clause", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const query = { where: { type: "COMMIT" } };
      await activityService.list(query);

      expect(mockRepo.findAll).toHaveBeenCalledWith({
        ...query,
        where: { type: "COMMIT", project: { visibility: "PUBLIC" } },
      });
    });

    it("passes empty query when none provided", async () => {
      mockRepo.findAll.mockResolvedValue([]);

      const result = await activityService.list({});

      expect(mockRepo.findAll).toHaveBeenCalledWith({
        where: { project: { visibility: "PUBLIC" } },
      });
      expect(result).toEqual([]);
    });
  });

  // =========================================================================
  // getById
  // =========================================================================

  describe("getById", () => {
    it("returns activity when found and project is PUBLIC", async () => {
      const activity = makeActivity();
      mockRepo.findById.mockResolvedValue(activity as any);
      mockPrisma.project.findUnique.mockResolvedValue({ visibility: "PUBLIC" } as any);

      const result = await activityService.getById("act-1");

      expect(mockRepo.findById).toHaveBeenCalledWith("act-1");
      expect(result).toEqual(activity);
    });

    it("throws NotFoundError when activity not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        activityService.getById("nonexistent")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("throws NotFoundError when project is PRIVATE", async () => {
      const activity = makeActivity({ projectId: "proj-private" });
      mockRepo.findById.mockResolvedValue(activity as any);
      mockPrisma.project.findUnique.mockResolvedValue({ visibility: "PRIVATE" } as any);

      await expect(
        activityService.getById("act-1")
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // =========================================================================
  // create
  // =========================================================================

  describe("create", () => {
    it("creates and returns the activity", async () => {
      const activity = makeActivity();
      mockRepo.create.mockResolvedValue(activity as any);

      const data = { type: "COMMIT", title: "feat: add login", projectId: "proj-1" };
      const result = await activityService.create(data);

      expect(mockRepo.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(activity);
    });
  });

  // =========================================================================
  // update
  // =========================================================================

  describe("update", () => {
    it("updates the activity by owner", async () => {
      const updated = makeActivity({ title: "Updated title" });
      mockRepo.updateByOwner.mockResolvedValue(true);
      mockRepo.findById.mockResolvedValue(updated as any);

      const result = await activityService.update("act-1", "user-1", { title: "Updated title" });

      expect(mockRepo.updateByOwner).toHaveBeenCalledWith("act-1", "user-1", { title: "Updated title" });
      expect(result.title).toBe("Updated title");
    });

    it("throws NotFoundError when activity not found or not owned", async () => {
      mockRepo.updateByOwner.mockResolvedValue(false);

      await expect(
        activityService.update("nonexistent", "user-1", { title: "X" })
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(mockRepo.findById).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // remove
  // =========================================================================

  describe("remove", () => {
    it("deletes the activity by owner", async () => {
      mockRepo.deleteByOwner.mockResolvedValue(true);

      await activityService.remove("act-1", "user-1");

      expect(mockRepo.deleteByOwner).toHaveBeenCalledWith("act-1", "user-1");
    });

    it("throws NotFoundError when activity not found or not owned", async () => {
      mockRepo.deleteByOwner.mockResolvedValue(false);

      await expect(
        activityService.remove("nonexistent", "user-1")
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
