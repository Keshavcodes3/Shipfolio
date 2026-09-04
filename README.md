<div align="center">

# ✦ Shipfolio

### A living portfolio for things you actually build.

<p>
  Minimal · Curated · Developer-first — Your best work, beautifully presented.
</p>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/yourusername/shipfolio/pulls)

<p>
  <a href="#-why-shipfolio"><strong>Why</strong></a> &nbsp;·&nbsp;
  <a href="#-features"><strong>Features</strong></a> &nbsp;·&nbsp;
  <a href="#-architecture"><strong>Architecture</strong></a> &nbsp;·&nbsp;
  <a href="#-tech-stack"><strong>Stack</strong></a> &nbsp;·&nbsp;
  <a href="#-project-structure"><strong>Structure</strong></a> &nbsp;·&nbsp;
  <a href="#-getting-started"><strong>Start</strong></a>
</p>

<img src="https://via.placeholder.com/1200x600/0a0a0a/ffffff?text=Shipfolio+%E2%80%94+Your+Work+Deserves+More" alt="Shipfolio Banner" width="100%" />

</div>

---

## ✨ Why Shipfolio?

<p>
Your GitHub contains <em>everything</em>: experiments, tutorials, college assignments, abandoned repos, half-finished ideas — and the occasional masterpiece.
</p>

<p>
<strong>Shipfolio is the curated layer on top.</strong> You decide what deserves to be seen. GitHub optionally keeps the technical details fresh.
</p>

<div align="center">

| | **GitHub** | **Shipfolio** |
| :---: | :--- | :--- |
| **Asks** | `What repositories does this developer have?` | `What is this developer building?` |
| **Shows** | Everything — 80 repos, noise included | Only the 4 projects you're proud of |
| **Vibe** | Archive | **Portfolio** |

</div>

```text
                         GitHub
                           │
              ┌────────────┴────────────┐
              │                         │
       Import repository          Add manually
              │                         │
              └────────────┬────────────┘
                           ▼
                    ◇ Creator curates ◇
                           │
                           ▼
                    Shipfolio Profile
                           │
               ┌───────────┼───────────┐
               ▼           ▼           ▼
            Projects    Activity      Stack
               │           │           │
               └───────────┼───────────┘
                           ▼
                     ✦ Public Profile ✦
```

> <p align="center"><em>GitHub shows everything you made.<br><strong>Shipfolio shows what you're proud of.</strong></em></p>

---

## 🌟 Features

### 🎯 Curated Projects

<p>
Add projects manually or connect them to GitHub. You control exactly what appears on your public profile — nothing goes live without you.
</p>

<table>
<tr>
<td>

**Every project can include:**

- 📛 Project name & description
- 🖼️ Cover image
- 🧩 Tech stack
- 🔗 GitHub / Live / Demo URLs
- 📅 Start date & last updated
- 🏷️ Project status & featured state

</td>
<td>

**Project Status**

| Status | Meaning |
| :---: | :--- |
| 🟡 Building | In active development |
| 🟢 Shipped | Launched & live |
| 🔵 Maintaining | Stable, updated |
| ⚪ Paused | On hold |
| 🔴 Archived | Retired |

</td>
</tr>
</table>

### 🔌 GitHub Integration — *Selective, not blind*

<p><strong>Shipfolio never imports your repos blindly.</strong> You pick what to showcase.</p>

```text
  GitHub Repositories — Select what to showcase

  ☑ Letterly          — async correspondence platform
  ☑ Perplexity        — AI search clone
  ☑ FounderHQ         — founder analytics

  ☐ college-assignment
  ☐ random-weather-app
  ☐ test-repository
  ☐ abandoned-project           ← stays private
```

<p>For connected projects, auto-display:</p>

<p>

`commit activity` · `stars` · `forks` · `contributors` · `latest release` · `last activity` · `primary language`

</p>

> <p>🤫 Nothing becomes public unless <em>you</em> choose it.</p>

### 🔨 Currently Building — <em>The Spotlight</em>

<p>Instead of a generic wall of tech:</p>

```text
React · Node.js · MongoDB · Docker
```

<p>Visitors see what you're <strong>actually</strong> building right now:</p>

```text
┌──────────────────────────────────────────────┐
│  🔨  Currently Building                      │
│                                              │
│  LETTERLY                                    │
│  An asynchronous correspondence platform      │
│  for meaningful conversations.               │
│                                              │
│  ◇ TypeScript  ◇ PostgreSQL  ◇ Redis        │
│                                              │
│  ── Building since June 2026 ──              │
└──────────────────────────────────────────────┘
```

<p><em>Because what you're building right now is more interesting than what you shipped two years ago.</em></p>

### ⚡ Live Project Information

<p>No more stale <code>"Last updated: 4 months ago"</code> while your repo has 40 new commits.</p>

```text
  LETTERLY  ● BUILDING

  184 commits  ·  23 pull requests  ·  2 contributors
  Last activity: 2 days ago

  ── Stack ──────────────────
  TypeScript  PostgreSQL  Redis  BullMQ
```

### 👤 Developer Profiles

<p>Every creator gets a beautiful public profile at <code>shipfolio.app/u/username</code></p>

<div align="center">

| Profile Element | Description |
| :--- | :--- |
| 📝 Bio | Who you are |
| 🔨 Currently Building | Your spotlight project |
| ⭐ Featured Projects | Best work first |
| 🧱 Tech Stack | Curated, not auto-dumped |
| 📈 Build Timeline | Evolution of your work |
| 🔗 Social Links | GitHub, Twitter, LinkedIn |

</div>

> <p align="center"><strong>Someone should understand what you build within 3 seconds.</strong></p>

### 🕰️ Build Timeline

<p>Not just cards — a <em>record</em> of what you've built.</p>

```text
  2026
  │
  ├─ September ── Letterly
  │               ├─ Redis queues
  │               ├─ PostgreSQL migration
  │               └─ 18 commits
  │
  ├─ August ───── Perplexity
  │               ├─ RAG pipeline
  │               └─ Hybrid search
  │
  └─ July ─────── FounderHQ
                  └─ Analytics engine
```

### 🧬 Tech Stack Showcase

<p>Auto-detected from GitHub, manually curated by you. <strong>You always have final say.</strong></p>

| Category | Stack |
| :--- | :--- |
| **Languages** | `TypeScript` `Python` `Go` |
| **Backend** | `Node.js` `PostgreSQL` `Redis` |
| **Frontend** | `React` `Next.js` `Tailwind CSS` |

---

## 🏗️ Architecture

<p align="center">
  <em>Modular monolith today — independently scalable workers tomorrow.</em>
</p>

```text
                         GitHub
                           │
                      OAuth / Webhooks
                           │
                           ▼
                  ┌──────────────────┐
                  │   API / Backend  │  ◀── Domain Events
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │     BullMQ       │
                  │      Redis       │  ── Queue
                  └────────┬─────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       GitHub Worker              Project Worker
       · sync stars               · process jobs
       · sync commits             · update cache
              │                         │
              └────────────┬────────────┘
                           ▼
                    ┌─────────────┐
                    │  PostgreSQL │  ◀── Prisma
                    └──────┬──────┘
                           │
                       API Layer (REST / Zod)
                           │
                           ▼
                    ┌─────────────┐
                    │   Next.js   │  ◀── Client
                    └─────────────┘
```

---

## ⚙️ Tech Stack

<div align="center">

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) `shadcn/ui` `Framer Motion` |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) `TypeScript` `REST API` `Zod` |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) |
| **Infra** | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) `BullMQ` `GitHub OAuth` `Webhooks` |
| **Deploy** | ![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel) `Managed Postgres` `Managed Redis` |

</div>

---

## 📁 Project Structure

<p>A clean <strong>client / server</strong> split — easy to reason about, easy to scale.</p>

```text
shipfolio/
│
├── client/                          # ◇ Frontend — Next.js 14 (App Router)
│   ├── app/                         #   Routes & layouts
│   │   ├── (auth)/                  #   ├─ login, signup
│   │   ├── (dashboard)/             #   ├─ private dashboard
│   │   ├── u/[username]/            #   ├─ public profiles  → /u/you
│   │   └── p/[project]/             #   └─ project pages    → /p/letterly
│   ├── components/
│   │   ├── ui/                      #   shadcn/ui primitives
│   │   ├── layout/                  #   navbar, footer, shell
│   │   ├── project/                 #   cards, badges, status
│   │   └── profile/                 #   timeline, stack, activity
│   ├── hooks/                       #   custom React hooks
│   ├── lib/
│   │   ├── api.ts                   #   API client
│   │   ├── auth.ts                  #   auth helpers
│   │   └── utils.ts                 #   cn(), formatters
│   ├── styles/globals.css
│   └── public/                      #   static assets
│
├── server/                          # ◇ Backend — Node.js + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/                #   sessions, JWT, OAuth
│   │   │   ├── user/                #   profiles & settings
│   │   │   ├── project/             #   CRUD, curation, status
│   │   │   ├── github/              #   repos, webhooks, sync
│   │   │   └── timeline/            #   build timeline logic
│   │   ├── middleware/              #   auth guard, error, logger
│   │   ├── workers/
│   │   │   ├── github.worker.ts     #   sync stars / commits / langs
│   │   │   └── project.worker.ts    #   BullMQ handlers
│   │   ├── queues/                  #   BullMQ + Redis defs
│   │   ├── utils/                   #   helpers & constants
│   │   ├── app.ts                   #   Fastify / Express bootstrap
│   │   └── index.ts                 #   entry point
│   └── prisma/
│       ├── schema.prisma            #   DB schema
│       └── migrations/              #   SQL migrations
│
├── packages/                        # ◇ Shared (monorepo)
│   ├── db/                          #   Prisma client singleton
│   ├── validation/                  #   Zod schemas
│   ├── types/                       #   shared TS types
│   └── config/                      #   eslint, tsconfig, tailwind presets
│
├── .env.example                     #   env template
├── docker-compose.yml               #   Postgres + Redis (local)
└── README.md                        #   you are here ✦
```

---

## 🔒 Data Ownership & Privacy

<div align="center">

### Import privately. Publish intentionally.

*Connecting GitHub should never mean exposing your entire GitHub.*

</div>

| You Control | GitHub Provides |
| :--- | :--- |
| ✅ Which projects are public | 📊 Commit activity |
| ✅ Which GitHub data is shown | ⭐ Stars / forks |
| ✅ Profile & project visibility | 👥 Contributors |
| ✅ Tech stack & descriptions | 💻 Languages |

> <p align="center"><em>GitHub provides data.<br><strong>You decide the story.</strong></em></p>

---

## 🗺️ Roadmap

| Phase | Theme | Status |
| :--- | :--- | :--- |
| **Phase 1** | 🏛️ Foundation — Auth, profiles, manual projects, statuses | `▓▓▓▓▓░░` In Progress |
| **Phase 2** | 🔌 GitHub — OAuth, repo import, webhooks, auto-sync | `▓▓░░░░` Planned |
| **Phase 3** | 🪪 Identity — Currently Building, stack, timeline, custom URLs | `░░░░░░` Planned |
| **Phase 4** | 🌐 Network — Follow, feed, reactions, discovery, trending | `░░░░░░` Planned |
| **Phase 5** | 🚀 Platform — Embeds, widgets, teams, custom domains, analytics | `░░░░░░` Planned |

<details>
<summary><strong>View detailed checklist</strong></summary>

<br>

**Phase 1 · Foundation**

- [x] Authentication
- [x] Developer profiles
- [ ] Manual project creation
- [ ] Project statuses & featured
- [ ] Public profiles & responsive UI

**Phase 2 · GitHub**

- [ ] GitHub OAuth
- [ ] Repository import & selection
- [ ] Metadata, commit activity
- [ ] Webhooks & auto-updates

**Phase 3 · Identity**

- [ ] Currently Building
- [ ] Tech stack & timeline
- [ ] Custom profile URLs & socials

**Phase 4 · Network**

- [ ] Follow developers
- [ ] Activity feed & reactions
- [ ] Discovery & trending

**Phase 5 · Platform**

- [ ] Embeddable cards & widgets
- [ ] Teams & organizations
- [ ] Custom domains & analytics

</details>

---

## 🎨 Design Philosophy

<p align="center">
  <em>Shipfolio should feel like a personal product page, not a résumé generator.</em>
</p>

<div align="center">

| Principle | Meaning |
| :--- | :--- |
| **Minimal** | No clutter, content first |
| **Developer-centric** | Built for builders |
| **Fast** | Instant load, subtle motion |
| **Dark-mode friendly** | Easy on the eyes |
| **Typography × Whitespace** | Breathable, editorial |
| **Projects are the hero** | Vanity metrics stay secondary |

</div>

> <p align="center">The interface should communicate one thing:<br><strong>✦ This person builds interesting things. ✦</strong></p>

#### Product Philosophy

```text
1. Curation over collection     — More repos ≠ better portfolio
2. Work over claims             — Building > listing technologies
3. Progress over perfection     — Active WIP > polished abandonware
4. Creator control              — Automation removes toil, not authorship
```

---

## 🚀 Getting Started

### 1 · Clone

```bash
git clone https://github.com/yourusername/shipfolio.git
cd shipfolio
```

### 2 · Install

```bash
pnpm install
```

### 3 · Environment

```bash
cp .env.example .env
# → fill in DATABASE_URL, GITHUB_CLIENT_ID, REDIS_URL, etc.
```

### 4 · Database

```bash
pnpm prisma migrate dev
pnpm prisma db seed   # optional: seed demo data
```

### 5 · Dev

```bash
pnpm dev
```

```text
✔ Client  → http://localhost:3000
✔ Server  → http://localhost:4000
✔ Prisma  → http://localhost:5555
```

<details>
<summary><strong>🐳 Docker alternative</strong></summary>

```bash
docker-compose up -d   # starts Postgres + Redis
pnpm dev
```

</details>

---

## 🤝 Contributing

<p>Contributions are welcome — bugs, ideas, and polish all count.</p>

```bash
# 1. Fork & branch
git checkout -b feature/my-feature

# 2. Commit
git commit -m "feat: add my feature"

# 3. Push & PR
git push origin feature/my-feature
```

<p>For large changes, please open an issue first to discuss the approach.</p>

---

## 📄 License

<p>Distributed under the <strong>MIT License</strong>.</p>

```text
MIT License — see LICENSE for details.
Copyright (c) 2026 Shipfolio
```

---

<div align="center">

<br>

### ✦ Ship what you build. ✦

**Shipfolio** — *Your work deserves more than a GitHub repository.*

<br>

[🌐 Website](https://shipfolio.app) · [🐦 Twitter](https://twitter.com) · [💬 Discussions](https://github.com/yourusername/shipfolio/discussions) · [🐛 Issues](https://github.com/yourusername/shipfolio/issues)

<br>

<sub>Built with care for developers who ship.</sub>

</div>
