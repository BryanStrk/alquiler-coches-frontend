<div align="center">

# 🏎️ Garage Premium — Frontend

**Premium car rental management web application.**

Single-page application for managing a fleet of premium and sports cars, with a public catalog and an admin panel for full CRUD operations including direct-to-CDN image uploads.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Backend repo](https://github.com/BryanStrk/alquiler-coches-app) · [Features](#-features) · [Architecture](#-architecture) · [Getting started](#-getting-started)

</div>

---

## 📑 Table of contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project structure](#-project-structure)
- [Design system](#-design-system)
- [Data flow](#-data-flow)
- [Routing & access control](#-routing--access-control)
- [Image upload pipeline](#-image-upload-pipeline)
- [Getting started](#-getting-started)
- [Environment variables](#-environment-variables)
- [Available scripts](#-available-scripts)
- [Conventions](#-conventions)
- [Architectural decisions (ADRs)](#-architectural-decisions-adrs)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 📖 Overview

**Garage Premium** is a full-stack application built as the final project of a Higher Vocational Training course (FP Superior DAW), and used as case study material for teaching backend integration and modern frontend architecture.

This repository contains **the frontend only**. The backend (Spring Boot 4 + Java 25 + MySQL + Cloudinary) lives in a [separate repository](https://github.com/BryanStrk/alquiler-coches-app), and both deploy independently.

The frontend communicates exclusively with the backend through a typed REST API; no third-party service is contacted directly from the browser, which keeps credentials and business logic on the server.

---

## ✨ Features

### Public

- 🚗 **Car catalog** with grid view, image gallery and detailed information.
- 🔍 **Filtering** by brand, fuel type, status and availability.
- 🔐 **Login** with JWT-based authentication.

### Admin panel (role `ADMIN`)

- 📝 **Full CRUD** on cars (create, read, update, delete).
- 📤 **Image upload** from the user's device to Cloudinary, mediated by the backend.
- 🖼️ **Editable image gallery** per car with delete-from-form support.
- 🧪 **Isolated test page** (`/test-upload`) to validate the upload flow independently of any form.
- 🛡️ **Role-protected routes** with redirect to login when unauthenticated.

---

## 🛠️ Tech stack

| Layer            | Technology                                                                |
|------------------|---------------------------------------------------------------------------|
| Framework        | [React 19](https://react.dev)                                             |
| Language         | [TypeScript](https://www.typescriptlang.org) (strict mode)                |
| Bundler          | [Vite 6](https://vitejs.dev)                                              |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com) with custom design tokens      |
| Routing          | [React Router 7](https://reactrouter.com) with protected routes by role   |
| Server state     | [TanStack Query](https://tanstack.com/query) (caching, refetch, mutations)|
| Client state     | [Zustand](https://zustand-demo.pmnd.rs) (auth store with persist)         |
| Form validation  | [Zod](https://zod.dev) (shared client-side schemas)                       |
| HTTP             | Native `fetch` (deliberate choice — see [ADRs](#-architectural-decisions-adrs)) |
| Icons            | [Lucide React](https://lucide.dev)                                        |
| Linter           | ESLint with `@typescript-eslint`                                          |
| CDN / images     | [Cloudinary](https://cloudinary.com) (proxied through the backend)        |

---

## 🏛️ Architecture

The application follows a **feature-first** organization rather than the traditional layer-first split. Each domain (`auth`, `coches`) owns its own pages, components, hooks and schemas, which keeps related code colocated and makes the boundaries between features explicit.

Cross-cutting concerns (HTTP client, query client, design tokens, layout shell, UI primitives, route guards) live at the `src/` root.

### Layered responsibilities inside a feature

```
features/<domain>/
├── pages/         # Route entry points; orchestrate hooks + components
├── components/    # Domain-specific presentational components
├── hooks/         # Query/mutation hooks wrapping the API client
├── schemas/       # Zod schemas (validation + inferred types)
└── stores/        # Zustand stores (when feature requires global state)
```

This mirrors patterns used by production codebases at companies like Vercel and Linear, and scales well to dozens of features without circular-dependency hell.

---

## 📂 Project structure

```
alquiler-coches-frontend/
├── public/                          # Static assets served as-is
│   └── vite.svg
├── src/
│   ├── assets/                      # Imported assets (hero image, logos)
│   │   └── hero.png
│   │
│   ├── components/                  # Cross-cutting components
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx      # Wrapper for admin routes (navbar + outlet)
│   │   │   ├── Footer.tsx
│   │   │   ├── MainLayout.tsx       # Wrapper for public routes
│   │   │   └── Navbar.tsx           # Top navigation with auth-aware actions
│   │   ├── ui/                      # Reusable presentational primitives
│   │   │   ├── Badge.tsx            # Variants: success | warning | danger | neutral
│   │   │   ├── Button.tsx           # Variants: primary | outline | ghost | danger
│   │   │   ├── Card.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Toast.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── ProtectedRoute.tsx       # Guards routes by auth + required role
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts       # Selectors over the auth store
│   │   │   │   └── useLogin.ts      # Mutation wrapping POST /api/auth/login
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   └── schemas/
│   │   │       └── loginSchema.ts   # Zod schema + inferred type
│   │   │
│   │   └── coches/
│   │       ├── components/
│   │       │   ├── CocheCard.tsx           # Card used in catalog grid
│   │       │   ├── CocheFilters.tsx        # Filter bar (brand, fuel, status…)
│   │       │   ├── CocheForm.tsx           # Shared create/edit form
│   │       │   ├── CocheGallery.tsx        # Image carousel in detail page
│   │       │   ├── CocheGrid.tsx           # Responsive grid of cards
│   │       │   ├── CocheHero.tsx           # Hero section of detail page
│   │       │   ├── CocheStatusBadge.tsx    # Visual status indicator
│   │       │   ├── CombustibleBadge.tsx    # Fuel type indicator
│   │       │   └── UploadImage.tsx         # File input + preview + upload
│   │       ├── hooks/
│   │       │   ├── cocheKeys.ts            # Centralized React Query keys
│   │       │   ├── useCoche.ts             # GET /api/coches/{id}
│   │       │   ├── useCoches.ts            # GET /api/coches
│   │       │   ├── useCochesDisponibles.ts # GET /api/coches/disponibles
│   │       │   ├── useCreateCoche.ts       # POST /api/coches
│   │       │   ├── useDeleteCoche.ts       # DELETE /api/coches/{id}
│   │       │   └── useUpdateCoche.ts       # PUT /api/coches/{id}
│   │       ├── pages/
│   │       │   ├── CocheCreatePage.tsx     # Admin: create
│   │       │   ├── CocheDetailPage.tsx     # Public: detail view
│   │       │   ├── CocheEditPage.tsx       # Admin: edit
│   │       │   ├── CocheListPage.tsx       # Public: catalog
│   │       │   └── TestUploadPage.tsx      # Dev: isolated upload validator
│   │       └── schemas/
│   │           └── cocheSchema.ts          # Zod schema for create/update
│   │
│   ├── hooks/
│   │   └── useToast.ts              # Lightweight toast notifications
│   │
│   ├── lib/
│   │   ├── api.ts                   # HTTP client (fetch + JWT injection)
│   │   ├── cloudinary.ts            # URL-level transformation helper
│   │   ├── queryClient.ts           # TanStack Query global config
│   │   └── utils.ts                 # cn() and small helpers
│   │
│   ├── routes/
│   │   └── router.tsx               # Route tree with ProtectedRoute wrappers
│   │
│   ├── stores/
│   │   └── authStore.ts             # Zustand store: token + user + actions
│   │
│   ├── types/
│   │   ├── api.types.ts             # UploadResponse, DeleteResponse, ErrorResponse
│   │   ├── auth.types.ts            # User, Role, AuthResponse
│   │   └── coche.types.ts           # Coche, EstadoCoche, TipoCombustible
│   │
│   ├── index.css                    # Tailwind directives + CSS variables (tokens)
│   ├── main.tsx                     # App bootstrap (QueryClient + Router)
│   └── vite-env.d.ts                # Vite-injected env types
│
├── .env.example                     # Template for required env vars
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json                # App-side TS config (DOM, JSX)
├── tsconfig.json                    # Root TS config with project references
├── tsconfig.node.json               # Node-side TS config (vite.config.ts)
└── vite.config.ts                   # Vite + alias `@/` + Tailwind plugin
```

---

## 🎨 Design system

Aesthetic inspired by Aston Martin and McLaren marketing surfaces: deep blacks, restrained accents, generous spacing.

### Color tokens

Declared as CSS custom properties in `src/index.css` and mapped to Tailwind utilities through `tailwind.config`.

| Token             | Hex       | Role                                           |
|-------------------|-----------|------------------------------------------------|
| `--bg`            | `#0A0A0B` | Carbon black — base background                 |
| `--surface`       | `#141416` | Elevated surface — cards, inputs               |
| `--surface-2`     | `#1C1C20` | Higher elevation — hover, dropdowns, modals    |
| `--border`        | `#2A2A30` | Subtle borders                                 |
| `--border-strong` | `#3A3A42` | Emphasized borders                             |
| `--text`          | `#F5F2EC` | Primary text — bone white / cream              |
| `--text-muted`    | `#8A8A92` | Secondary text                                 |
| `--text-dim`      | `#5A5A62` | Tertiary text                                  |
| `--accent`        | `#C9A86A` | Champagne / brushed copper — primary action    |
| `--accent-hover`  | `#D9BB7C` | Accent hover                                   |
| `--success`       | `#6B9F71` | Muted English green — available state          |
| `--danger`        | `#B85450` | Burgundy red — destructive actions             |

### Typography

| Family             | Use                                  |
|--------------------|--------------------------------------|
| **Bebas Neue**     | Display, headings, hero, badges      |
| **Inter**          | UI, body text, forms                 |
| **JetBrains Mono** | Numeric data (prices, plates, km)    |

### Component primitives

All sit in `src/components/ui/`. Each follows the variant-prop pattern, accepts `className` for overrides via `cn()`, and forwards refs where it makes sense:

- `Button` — primary, outline, ghost, danger
- `Input`, `Textarea`, `Select` — themed form controls with focus rings on `--accent`
- `Badge` — colored variants for car status and fuel type
- `Card` — base container with `--surface` background
- `Modal` — accessible dialog with backdrop
- `Spinner`, `Toast`, `PriceTag`, `ImageGallery`

---

## 🔄 Data flow

The frontend follows a strict separation between **server state** and **client state**.

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Components                        │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               │ reads                         │ reads
               ▼                               ▼
   ┌─────────────────────┐         ┌──────────────────────┐
   │   TanStack Query    │         │     Zustand store    │
   │   (server state)    │         │    (client state)    │
   │                     │         │                      │
   │  - coches list      │         │  - JWT token         │
   │  - coche detail     │         │  - current user      │
   │  - mutations cache  │         │  - login/logout      │
   └──────────┬──────────┘         └──────────┬───────────┘
              │                               │
              │ calls                         │ injects token
              ▼                               ▼
        ┌──────────────────────────────────────────┐
        │      lib/api.ts (fetch wrapper)          │
        │                                          │
        │  - Bearer header from authStore          │
        │  - JSON / FormData body handling         │
        │  - Centralized error normalization       │
        └────────────────────┬─────────────────────┘
                             │
                             ▼
                       ┌──────────────┐
                       │   Backend    │
                       │  (Spring 4)  │
                       └──────────────┘
```

**Rules of thumb:**

- If data lives on the server → **TanStack Query**. No `useEffect + useState` patterns.
- If data is the session (token, user) → **Zustand**. Persisted to `localStorage`.
- If data is ephemeral UI state (modal open, form draft) → **`useState`** locally.

---

## 🔐 Routing & access control

Defined in `src/routes/router.tsx`. Route guards live in `src/components/ProtectedRoute.tsx`.

| Path                       | Layout         | Access                | Page                  |
|----------------------------|----------------|-----------------------|-----------------------|
| `/`                        | `MainLayout`   | Public                | `CocheListPage`       |
| `/coches`                  | `MainLayout`   | Public                | `CocheListPage`       |
| `/coches/:id`              | `MainLayout`   | Public                | `CocheDetailPage`     |
| `/login`                   | `MainLayout`   | Public (redirect if authed) | `LoginPage`     |
| `/admin/coches/nuevo`      | `AdminLayout`  | `ADMIN` only          | `CocheCreatePage`     |
| `/admin/coches/:id/editar` | `AdminLayout`  | `ADMIN` only          | `CocheEditPage`       |
| `/test-upload`             | `AdminLayout`  | `ADMIN` only (dev)    | `TestUploadPage`      |
| `*`                        | —              | Any                   | `NotFoundPage`        |

`ProtectedRoute` accepts a `requiredRole` prop:

```tsx
<ProtectedRoute requiredRole={Role.ADMIN}>
  <CocheEditPage />
</ProtectedRoute>
```

If the user is not authenticated → redirect to `/login`. If authenticated but lacks the role → redirect to `/`.

---

## 📤 Image upload pipeline

A key constraint: **the browser never contacts Cloudinary directly**. All credentials live on the backend.

```
┌─────────┐  1. file select   ┌──────────┐
│  User   │ ───────────────▶  │  React   │
└─────────┘                   └────┬─────┘
                                   │ 2. FormData + JWT
                                   ▼
                            ┌──────────────┐
                            │   Backend    │
                            │  /api/media  │ 3. cloudinary SDK + secret
                            └──────┬───────┘────────────────┐
                                   │                        ▼
                                   │ 4. { publicId, url } ┌────────────┐
                                   ◀──────────────────────│ Cloudinary │
                                   ▼                      └────────────┘
                            ┌──────────────┐
                            │  React state │  5. push url into coche.imageUrls
                            └──────────────┘
                                   │
                                   ▼ 6. PUT /api/coches/{id}
                            ┌──────────────┐
                            │    MySQL     │
                            │ coche_imgs   │
                            └──────────────┘
```

The flow is implemented by `UploadImage.tsx` + `api.ts::uploadImage`. The `Content-Type` header is **deliberately omitted** so the browser sets the correct `multipart/form-data; boundary=...` itself — a common mistake with axios that motivated the choice of native `fetch`.

---

## 🚀 Getting started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Backend running at `http://localhost:8080`

### Setup

```bash
git clone https://github.com/BryanStrk/alquiler-coches-frontend.git
cd alquiler-coches-frontend
npm install
cp .env.example .env.local
# edit .env.local
npm run dev
```

The app starts at `http://localhost:5174`.

### Seeded admin account

If the backend has loaded its seed data:

| Username  | Password     | Role     |
|-----------|--------------|----------|
| `admin`   | `admin123`   | `ADMIN`  |
| `cliente` | `cliente123` | `CLIENT` |

---

## 🔧 Environment variables

| Variable                     | Required | Description                                              |
|------------------------------|----------|----------------------------------------------------------|
| `VITE_API_URL`               | yes      | Base URL of the backend (e.g. `http://localhost:8080`)   |
| `VITE_CLOUDINARY_CLOUD_NAME` | no       | Used only for client-side URL transformations            |

> Cloudinary `api_key` and `api_secret` **must never** appear in this project. They live exclusively in the backend's environment.

---

## 📜 Available scripts

| Script            | Description                                          |
|-------------------|------------------------------------------------------|
| `npm run dev`     | Start Vite dev server with HMR on port 5174          |
| `npm run build`   | Type-check with `tsc -b` and produce production build|
| `npm run preview` | Preview the production build locally                 |
| `npm run lint`    | Run ESLint over the whole project                    |

---

## 📐 Conventions

### Imports

Path alias `@/` resolves to `src/`. Use it for any import that crosses feature or layer boundaries:

```ts
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { api } from '@/lib/api';
```

### Components

- **PascalCase** for component names and files (`CocheCard.tsx`).
- **camelCase** for hooks (`useCoches.ts`) and utilities.
- Component default export at the bottom of the file; named exports for helpers.
- Props typed inline with `interface`; no `React.FC` (modern React doesn't need it).

### State

- Server data → **TanStack Query** with query keys in `cocheKeys.ts`.
- Session data → **Zustand** in `authStore.ts`.
- Local UI state → `useState` / `useReducer` colocated with the component.

### Commits

This repository follows [Conventional Commits](https://www.conventionalcommits.org/) with scopes:

```
feat(coches): add image deletion from edit form
fix(cloudinary): preserve version segment in optimized URLs
refactor(layout): apply new design system to MainLayout
chore(deps): bump react-router to 7.2
docs: replace Vite default README with project documentation
```

---

## 🧭 Architectural decisions (ADRs)

Short rationale for the choices that shaped this codebase:

### 1. Native `fetch` instead of `axios`

Axios defaults to `Content-Type: application/json`, which breaks multipart uploads unless explicitly overridden. Native `fetch` makes the absence of `Content-Type` natural (the browser generates the correct one with its boundary). Smaller bundle, fewer footguns, one less dependency to track.

### 2. Feature-first folder organization

Layer-first (`/components`, `/pages`, `/hooks` at root) scales badly: a single domain change touches files scattered across the tree. Feature-first keeps each domain self-contained and surfaces real boundaries.

### 3. TanStack Query as single source of truth for server state

Hand-rolling `useEffect + useState + isLoading + isError + invalidation` leads to bugs, stale data and re-fetch storms. TanStack Query handles caching, dedup, refetch-on-focus, optimistic updates and mutation invalidation declaratively.

### 4. Image upload via backend, never direct-to-Cloudinary

Browser-side uploads would require exposing an upload preset or a signed URL endpoint. Either approach leaks attack surface and gives less control over validation, virus-scanning, and quota management. Backend mediation costs one extra hop but keeps secrets on the server.

### 5. No external URL input for car images

A previous version of the edit form allowed pasting external image URLs. It was removed deliberately. Reasons: copyright risk, asset lifecycle out of our control, inconsistent dimensions and formats, and the *paradox of choice* — every extra input that does "almost the same thing" doubles the bug surface. Patterns followed by Airbnb, Booking, Idealista, Wallapop and Amazon Sellers.

### 6. Design tokens before raw Tailwind classes

Hard-coding colors (`bg-zinc-900`, `text-amber-500`) makes rebranding a global find-and-replace nightmare. Tokens (`bg-surface`, `text-accent`) push that work to a single source of truth and make the design system reviewable.

### 7. `UploadImage` was tested in isolation before integration

The `/test-upload` route exists not as a stale dev-only artifact but as documentation of how to validate a component independently of any form. It is intentionally kept in the codebase as a learning artifact and a regression checkpoint.

---

## 🗺️ Roadmap

- [ ] Booking system with calendar picker and date-range availability
- [ ] Search by date range with real availability checks
- [ ] User management from the admin panel
- [ ] Soft-delete + restore for cars
- [ ] Bulk image upload with progress bar
- [ ] i18n (Spanish / English)
- [ ] E2E tests with Playwright
- [ ] Unit tests with Vitest + React Testing Library
- [ ] Storybook for the UI primitives
- [ ] CI pipeline with GitHub Actions (lint + typecheck + build)
- [ ] Lighthouse budget enforcement

---



## 👤 Author

**Bryan Paico Albines**

[![GitHub](https://img.shields.io/badge/GitHub-BryanStrk-181717?logo=github)](https://github.com/BryanStrk)

---

<div align="center">

⭐ If you find this project useful, consider giving it a star.

</div>
