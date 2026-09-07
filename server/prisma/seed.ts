import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---------------------------------------------------------------------------
  // Technologies
  // ---------------------------------------------------------------------------

  const technologies = await Promise.all(
    [
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "JavaScript", slug: "javascript", category: "Language" },
      { name: "Python", slug: "python", category: "Language" },
      { name: "Go", slug: "go", category: "Language" },
      { name: "Rust", slug: "rust", category: "Language" },
      { name: "React", slug: "react", category: "Frontend" },
      { name: "Next.js", slug: "nextjs", category: "Frontend" },
      { name: "Vue.js", slug: "vuejs", category: "Frontend" },
      { name: "Node.js", slug: "nodejs", category: "Runtime" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "Redis", slug: "redis", category: "Database" },
      { name: "MongoDB", slug: "mongodb", category: "Database" },
      { name: "Docker", slug: "docker", category: "DevOps" },
      { name: "Kubernetes", slug: "kubernetes", category: "DevOps" },
      { name: "AWS", slug: "aws", category: "Cloud" },
      { name: "Tailwind CSS", slug: "tailwindcss", category: "Frontend" },
      { name: "GraphQL", slug: "graphql", category: "API" },
      { name: "Prisma", slug: "prisma", category: "ORM" },
      { name: "Express", slug: "express", category: "Backend" },
      { name: "Deno", slug: "deno", category: "Runtime" },
    ].map((t) =>
      prisma.technology.upsert({
        where: { slug: t.slug },
        update: {},
        create: t,
      })
    )
  );

  console.log(`Seeded ${technologies.length} technologies`);

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------

  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: {
      username: "alice",
      email: "alice@example.com",
      password: passwordHash,
      name: "Alice Chen",
      bio: "Full-stack developer passionate about developer tools and open source.",
      location: "San Francisco, CA",
      websiteUrl: "https://alicechen.dev",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  });

  const bob = await prisma.user.upsert({
    where: { username: "bob" },
    update: {},
    create: {
      username: "bob",
      email: "bob@example.com",
      password: passwordHash,
      name: "Bob Martinez",
      bio: "Backend engineer building scalable systems. Rust enthusiast.",
      location: "Austin, TX",
      websiteUrl: "https://bobmartinez.io",
      avatarUrl: "https://avatars.githubusercontent.com/u/2?v=4",
    },
  });

  const carol = await prisma.user.upsert({
    where: { username: "carol" },
    update: {},
    create: {
      username: "carol",
      email: "carol@example.com",
      password: passwordHash,
      name: "Carol Nguyen",
      bio: "DevOps engineer and cloud infrastructure nerd.",
      location: "Seattle, WA",
      websiteUrl: "https://carolnguyen.dev",
      avatarUrl: "https://avatars.githubusercontent.com/u/3?v=4",
    },
  });

  console.log("Seeded 3 users");

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------

  const shipfolio = await prisma.project.upsert({
    where: { userId_slug: { userId: alice.id, slug: "shipfolio" } },
    update: {},
    create: {
      userId: alice.id,
      name: "ShipFolio",
      slug: "shipfolio",
      description: "A developer portfolio platform for showcasing what you actually build.",
      status: "BUILDING",
      visibility: "PUBLIC",
      isFeatured: true,
      isCurrentlyBuilding: true,
      liveUrl: "https://shipfolio.dev",
      startedAt: new Date("2024-01-15"),
    },
  });

  const cliTool = await prisma.project.upsert({
    where: { userId_slug: { userId: alice.id, slug: "devflow-cli" } },
    update: {},
    create: {
      userId: alice.id,
      name: "DevFlow CLI",
      slug: "devflow-cli",
      description: "A command-line tool for streamlining development workflows.",
      status: "SHIPPED",
      visibility: "PUBLIC",
      isFeatured: true,
      isCurrentlyBuilding: false,
      liveUrl: "https://npmjs.com/package/devflow-cli",
      startedAt: new Date("2023-06-01"),
      lastUpdatedAt: new Date("2024-03-15"),
    },
  });

  const rustApi = await prisma.project.upsert({
    where: { userId_slug: { userId: bob.id, slug: "rust-api-gateway" } },
    update: {},
    create: {
      userId: bob.id,
      name: "Rust API Gateway",
      slug: "rust-api-gateway",
      description: "High-performance API gateway written in Rust.",
      status: "MAINTAINING",
      visibility: "PUBLIC",
      isFeatured: true,
      isCurrentlyBuilding: false,
      startedAt: new Date("2023-09-01"),
      lastUpdatedAt: new Date("2024-05-20"),
    },
  });

  const infraTool = await prisma.project.upsert({
    where: { userId_slug: { userId: carol.id, slug: "k8s-auto-scaler" } },
    update: {},
    create: {
      userId: carol.id,
      name: "K8s Auto Scaler",
      slug: "k8s-auto-scaler",
      description: "Intelligent auto-scaling for Kubernetes deployments based on custom metrics.",
      status: "BUILDING",
      visibility: "PUBLIC",
      isFeatured: true,
      isCurrentlyBuilding: true,
      startedAt: new Date("2024-03-01"),
    },
  });

  const pausedProject = await prisma.project.upsert({
    where: { userId_slug: { userId: alice.id, slug: "old-blog" } },
    update: {},
    create: {
      userId: alice.id,
      name: "Old Blog",
      slug: "old-blog",
      description: "My previous personal blog. Paused indefinitely.",
      status: "PAUSED",
      visibility: "PUBLIC",
      isFeatured: false,
      isCurrentlyBuilding: false,
      startedAt: new Date("2022-01-01"),
    },
  });

  const privateProject = await prisma.project.upsert({
    where: { userId_slug: { userId: alice.id, slug: "secret-project" } },
    update: {},
    create: {
      userId: alice.id,
      name: "Secret Project",
      slug: "secret-project",
      description: "Not ready for public viewing.",
      status: "BUILDING",
      visibility: "PRIVATE",
      isFeatured: false,
      isCurrentlyBuilding: false,
    },
  });

  console.log("Seeded 6 projects");

  // ---------------------------------------------------------------------------
  // User-Technology associations
  // ---------------------------------------------------------------------------

  const [ts, react, node, pg, rust, docker, nextjs] = technologies;

  await prisma.userTechnology.createMany({
    data: [
      { userId: alice.id, technologyId: ts.id, isPrimary: true },
      { userId: alice.id, technologyId: react.id, isPrimary: false },
      { userId: alice.id, technologyId: node.id, isPrimary: false },
      { userId: alice.id, technologyId: pg.id, isPrimary: false },
      { userId: bob.id, technologyId: rust.id, isPrimary: true },
      { userId: bob.id, technologyId: pg.id, isPrimary: false },
      { userId: bob.id, technologyId: docker.id, isPrimary: false },
      { userId: carol.id, technologyId: docker.id, isPrimary: true },
      { userId: carol.id, technologyId: ts.id, isPrimary: false },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded user-technology associations");

  // ---------------------------------------------------------------------------
  // Project-Technology associations
  // ---------------------------------------------------------------------------

  await prisma.projectTechnology.createMany({
    data: [
      { projectId: shipfolio.id, technologyId: ts.id, isPrimary: true },
      { projectId: shipfolio.id, technologyId: nextjs.id, isPrimary: false },
      { projectId: shipfolio.id, technologyId: pg.id, isPrimary: false },
      { projectId: cliTool.id, technologyId: ts.id, isPrimary: true },
      { projectId: cliTool.id, technologyId: node.id, isPrimary: false },
      { projectId: rustApi.id, technologyId: rust.id, isPrimary: true },
      { projectId: rustApi.id, technologyId: pg.id, isPrimary: false },
      { projectId: infraTool.id, technologyId: ts.id, isPrimary: true },
      { projectId: infraTool.id, technologyId: docker.id, isPrimary: false },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded project-technology associations");

  // ---------------------------------------------------------------------------
  // Follows
  // ---------------------------------------------------------------------------

  await prisma.follow.createMany({
    data: [
      { followerId: alice.id, followingId: bob.id },
      { followerId: alice.id, followingId: carol.id },
      { followerId: bob.id, followingId: alice.id },
      { followerId: carol.id, followingId: alice.id },
      { followerId: carol.id, followingId: bob.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded follows");

  // ---------------------------------------------------------------------------
  // Project Activities
  // ---------------------------------------------------------------------------

  await prisma.projectActivity.createMany({
    data: [
      {
        projectId: shipfolio.id,
        type: "COMMIT",
        externalId: "seed-commit-1",
        title: "feat: initial project setup",
        url: "https://github.com/example/shipfolio/commit/1",
        actorUsername: "alice",
        occurredAt: new Date("2024-01-15T10:00:00Z"),
      },
      {
        projectId: shipfolio.id,
        type: "COMMIT",
        externalId: "seed-commit-2",
        title: "feat: add authentication module",
        url: "https://github.com/example/shipfolio/commit/2",
        actorUsername: "alice",
        occurredAt: new Date("2024-02-01T14:30:00Z"),
      },
      {
        projectId: shipfolio.id,
        type: "PULL_REQUEST",
        externalId: "seed-pr-1",
        title: "Add project management CRUD",
        url: "https://github.com/example/shipfolio/pull/1",
        actorUsername: "alice",
        occurredAt: new Date("2024-03-10T09:00:00Z"),
      },
      {
        projectId: cliTool.id,
        type: "RELEASE",
        externalId: "seed-release-1",
        title: "v1.0.0",
        description: "First stable release of DevFlow CLI.",
        url: "https://github.com/example/devflow-cli/releases/tag/v1.0.0",
        actorUsername: "alice",
        occurredAt: new Date("2023-12-01T12:00:00Z"),
      },
      {
        projectId: rustApi.id,
        type: "STAR",
        externalId: "seed-star-1",
        title: "Starred by user",
        actorUsername: "carol",
        occurredAt: new Date("2024-04-05T16:00:00Z"),
      },
      {
        projectId: rustApi.id,
        type: "FORK",
        externalId: "seed-fork-1",
        title: "Forked by user",
        actorUsername: "alice",
        occurredAt: new Date("2024-04-06T08:00:00Z"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded project activities");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
