export const getPagination = (page = 1, limit = 10) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, skip, take: safeLimit };
};

export const buildPaginatedResponse = <T>(data: T[], total: number, page: number, limit: number) => ({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
