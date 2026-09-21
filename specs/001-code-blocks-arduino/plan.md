# Implementation Plan: Code Blocks Arduino Platform (MVP)

**Branch**: `001-code-blocks-arduino` | **Date**: 2026-09-19 | **Spec**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md)

**Input**: Feature specification from [`/specs/001-code-blocks-arduino/spec.md`](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md)

---

## Summary

Build the MVP of **Code Blocks Arduino**, an educational web platform enabling beginner students to assemble visual algorithm blocks (sequence, variables, operators, conditionals, loops) and witness instantaneous, deterministic translation into clean, readable Arduino C/C++ code. The system provides Google OAuth authentication, individual student workspaces with project persistence, strict data isolation via Supabase PostgreSQL Row Level Security (RLS), and an administrative console for teacher management of student accounts.

---

## Technical Context

- **Language / Runtime**: TypeScript 5.x (Strict mode enabled, no unannotated `any`), Node.js 20+
- **Frontend Framework**: Next.js 14+ (App Router, Server Components + focused Client Components), React 18+, Tailwind CSS
- **Visual Engine**: Google Blockly (`blockly` official npm package, dynamically imported on client with `ssr: false`)
- **Code Generator**: Custom domain `ArduinoGenerator` extending Blockly Generator, emitting standard Arduino `setup()` and `loop()` structures
- **Storage & Auth**: Supabase (PostgreSQL 15+, Supabase Auth via Google OAuth, Row Level Security)
- **Validation**: Zod schemas at application boundary (Route Handlers / Server Actions)
- **Testing**: Vitest (Unit & Integration test runner), `@testing-library/react`
- **Target Platform**: Modern Web Browsers (Chrome, Edge, Firefox) on desktop/laptop displays
- **Performance Goals**: Generator updates in $< 1$ second; API CRUD responses in $< 500$ ms
- **Scale / Scope**: Academic classroom scale (~50-200 students per cohort, 2 sprints of development)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle / Rule | Requirement | Plan Status | Verification Details |
| :--- | :--- | :---: | :--- |
| **I. Simplicity First** | Minimal viable system, no premature abstractions or unused infrastructure | **PASS** | Monorepo structure, standard Next.js + Supabase; no separate microservices or heavy message queues. |
| **II. Test-First (TDD)** | Red-Green-Refactor cycle, CI gates, coverage regression checks | **PASS** | Vitest configured for generator unit tests and API integration tests; CI blocks failing builds. |
| **III. Dependency Direction** | `UI -> App -> Domain -> Infrastructure` strictly enforced | **PASS** | Domain & Generator in `src/core` with zero UI/HTTP/DB deps. Repositories in `src/lib`. |
| **IV. Validation Boundary** | External data never trusted; boundary validation via schemas | **PASS** | Zod schemas in `src/lib/validation` validate incoming API requests before touching domain. |
| **V. Server Security & RLS** | Server-side auth, Google OAuth only, DB-level isolation via RLS | **PASS** | Cookie-based session via `@supabase/ssr`, RLS policies on `projects` and `profiles`. Zero service role on client. |
| **VI. Vertical Slices** | End-to-end epic division and commit traceability | **PASS** | Epics mapped directly to User Stories P1 (Workspace/Generator), P2 (Auth/Projects), and P3 (Admin). |
| **Complexity Bounds** | React $\le 100$ lines, Service $\le 150$ lines, Route $\le 60$ lines, Function $\le 20$ lines | **PASS** | Modular decomposition with small components and dedicated custom hooks. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-code-blocks-arduino/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 architectural decisions
├── data-model.md        # Phase 1 data architecture & RLS
├── quickstart.md        # Phase 1 end-to-end validation guide
├── contracts/           # Phase 1 interface contracts
│   ├── auth.contract.md
│   ├── projects.contract.md
│   ├── generator.contract.md
│   └── admin.contract.md
└── checklists/
    └── requirements.md  # Quality verification checklist
```

### Source Code Architecture (repository root)

```text
src/
├── app/                                # Next.js App Router (UI routes & endpoints)
│   ├── (auth)/
│   │   ├── login/page.tsx             # Google Sign-in landing screen
│   │   └── callback/route.ts          # OAuth exchange & profile initialization
│   ├── (dashboard)/
│   │   ├── projects/page.tsx          # Student project listing & management
│   │   └── projects/new/page.tsx      # Create new project redirection
│   ├── admin/
│   │   └── page.tsx                   # Admin student roster management
│   ├── workspace/
│   │   └── [id]/page.tsx              # Workspace editor (new or existing project)
│   ├── api/                           # Application Route Handlers (Boundary Validation)
│   │   ├── projects/route.ts          # GET (list), POST (create)
│   │   ├── projects/[id]/route.ts     # GET, PUT, DELETE
│   │   └── admin/students/route.ts    # GET, POST, DELETE
│   ├── layout.tsx                     # Global navigation & theme provider
│   └── page.tsx                       # Public landing page
├── components/                         # Presentation Layer (<= 100 lines each)
│   ├── ui/                            # Button, Modal, Input, Badge primitives
│   ├── workspace/
│   │   ├── blockly-workspace.tsx      # Dynamic client-only Blockly container
│   │   ├── code-viewer.tsx            # Formatted C/C++ read-only preview panel
│   │   └── workspace-toolbar.tsx      # Save, Run, Export actions
│   ├── projects/
│   │   ├── project-card.tsx           # Individual project card with action menu
│   │   └── save-project-modal.tsx     # Title input & save confirmation modal
│   └── admin/
│       ├── student-table.tsx          # Student list table
│       └── add-student-modal.tsx      # Pre-authorization dialog
├── core/                               # Clean Architecture Domain Layer (Zero UI/DB deps)
│   ├── domain/
│   │   ├── entities/                  # User, Project, WorkspaceState interfaces
│   │   └── errors/                    # Domain-specific exception types
│   └── generator/                     # Arduino C/C++ Code Generator
│       ├── arduino-generator.ts       # Main generator coordinator
│       ├── blocks/                    # Block definitions & C/C++ code emitters
│       │   ├── variables.ts           # Declaration, assignment, read
│       │   ├── operators.ts           # Math (+, -, *, /) and Logic (==, >, &&)
│       │   ├── conditionals.ts        # if, if-else structures
│       │   └── loops.ts               # repeat N times, while loops
│       └── toolbox.ts                 # Blockly XML/JSON toolbox definition
├── lib/                                # Infrastructure Layer (<= 150 lines per service)
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client
│   │   ├── server.ts                  # Server-side Supabase client (cookies)
│   │   └── middleware.ts              # Route protection middleware
│   ├── repositories/
│   │   ├── project-repository.ts      # Supabase persistence for projects
│   │   └── profile-repository.ts      # Supabase persistence for profiles/roles
│   └── validation/
│       └── schemas.ts                 # Zod boundary schemas for API requests
└── tests/                              # Automated Testing Suite
    ├── unit/
    │   ├── generator/                 # Test suites for every block code emission
    │   └── domain/                    # Invariant and validation unit tests
    ├── integration/
    │   └── api/                       # Route handler tests with mocked DB
    └── setup.ts                       # Test runner configuration
```

**Structure Decision**: Monorepo using Next.js App Router adhering strictly to Clean Architecture (`src/components` $\to$ `src/app/api` $\to$ `src/core` $\to$ `src/lib`). Separating `src/core` guarantees that the Blockly Arduino Generator can be tested and evolved as a pure domain engine without coupling to React or Supabase.

---

## Complexity Tracking

> **Constitution Check Violations**: None. All principles, security standards, and complexity thresholds are strictly adhered to.

| Area | Planned Approach | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| Database & Auth | Supabase BaaS (PostgreSQL + Auth + RLS) | Custom Node/Express server + self-managed PostgreSQL would add unnecessary infrastructure overhead and maintenance burden for the team. |
| Code Generator | Domain Generator extending `Blockly.Generator` | String concatenation inside React components would violate Clean Architecture and render automated unit testing impossible. |
| State Management | Blockly canonical workspace + local React state | Redux / MobX would introduce redundant duplicate state layers, violating Anti-Pattern 18 of the Constitution. |

---

## Constitution Post-Design Re-Evaluation

Following the generation of `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`, the design maintains full compliance:
1. **Purity of Generator:** Verified in `generator.contract.md`.
2. **Security & RLS:** Verified in `data-model.md` and `auth.contract.md`.
3. **No premature abstractions:** Verified in `quickstart.md` and repository tree.
4. **Testability:** High isolation of domain logic enables >90% code coverage.
