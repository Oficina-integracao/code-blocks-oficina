# Implementation Tasks: Code Blocks Arduino Platform (MVP)

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Plan**: [plan.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/plan.md) | **Branch**: `001-code-blocks-arduino`

This document defines the dependency-ordered, test-driven implementation tasks for the Code Blocks Arduino MVP.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, monorepo configuration, tooling, and CI pipeline setup.

- [X] T001 Initialize Next.js 14 project with TypeScript, Tailwind CSS, and App Router configuration in package.json, tsconfig.json, tailwind.config.ts, and next.config.js
- [X] T002 [P] Configure Vitest test runner, coverage reporting, and React Testing Library in vitest.config.ts and tests/setup.ts
- [X] T003 [P] Configure ESLint and Prettier rules enforcing strict TypeScript (no unannotated any) and line limit warnings in .eslintrc.json and .prettierrc
- [X] T004 [P] Configure GitHub Actions CI workflow (lint, typecheck, test with coverage, build) in .github/workflows/ci.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure, database migrations, authentication clients, and domain primitives that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Setup Supabase client infrastructure for browser and server cookies in src/lib/supabase/client.ts, src/lib/supabase/server.ts, and src/lib/supabase/middleware.ts
- [X] T006 [P] Define core domain entity types (UserProfile, Project, WorkspaceState) in src/core/domain/entities/models.ts with verbatim constraints: role in ['ALUNO', 'ADMIN'], title length between 1 and 100 characters trimmed, workspace_state valid JSON
- [X] T007 [P] Define domain error classes (NotFoundError, UnauthorizedError, ValidationError, GeneratorError) in src/core/domain/errors/domain-errors.ts
- [X] T008 [P] Create PostgreSQL database migration with tables profiles and projects and RLS policies enabled in supabase/migrations/20260919000000_initial_schema.sql
- [X] T009 [P] Create Zod boundary validation schemas for authentication, project payloads, and admin operations in src/lib/validation/schemas.ts
- [X] T010 [P] Implement base UI primitives (Button, Modal, Input, Badge) in src/components/ui/button.tsx, src/components/ui/modal.tsx, src/components/ui/input.tsx, and src/components/ui/badge.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Construção Visual de Algoritmos e Tradução para C/C++ em Tempo Real (Priority: P1) 🎯 MVP

**Goal**: Permitir que o aluno acesse a área de trabalho (Workspace), monte algoritmos com blocos de fundamentos lógicos (sequência, variáveis, operadores, condicionais e repetições) e visualize instantaneamente a geração do código C/C++ compatível com Arduino (< 1s).

**Independent Test**: Navegar para `/workspace`, montar um algoritmo com bloco de variável e bloco de condicional Se/Senão, e verificar que o painel de código textual exibe imediatamente o código Arduino C/C++ estruturado com `setup()` e `loop()`, sem depender de autenticação ou banco de dados.

### Tests for User Story 1 (TDD - Write FIRST, ensure FAIL before implementation) ⚠️

- [X] T011 [P] [US1] Unit test for foundational variable blocks code generation in tests/unit/generator/variables.test.ts
- [X] T012 [P] [US1] Unit test for arithmetic and logical operator blocks code generation in tests/unit/generator/operators.test.ts
- [X] T013 [P] [US1] Unit test for conditional (if/else) blocks code generation in tests/unit/generator/conditionals.test.ts
- [X] T014 [P] [US1] Unit test for repetition loop blocks code generation in tests/unit/generator/loops.test.ts
- [ ] T015 [P] [US1] Unit test for full ArduinoGenerator integration (skeleton, definitions, setup, loop, orphan blocks) in tests/unit/generator/arduino-generator.test.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement custom Blockly variable block definitions and C/C++ code generators in src/core/generator/blocks/variables.ts
- [X] T017 [P] [US1] Implement arithmetic and logical operator block definitions and C/C++ generators in src/core/generator/blocks/operators.ts
- [X] T018 [P] [US1] Implement conditional (if / if-else) block definitions and C/C++ generators in src/core/generator/blocks/conditionals.ts
- [X] T019 [P] [US1] Implement repetition loop block definitions and C/C++ generators in src/core/generator/blocks/loops.ts
- [ ] T020 [US1] Implement core ArduinoGenerator class extending Blockly.Generator assembling setup() and loop() skeleton in src/core/generator/arduino-generator.ts (depends on T016-T019)
- [ ] T021 [P] [US1] Define Blockly toolbox configuration containing fundamental algorithm categories in src/core/generator/toolbox.ts
- [X] T022 [US1] Implement dynamic client-side Blockly workspace container component with SVG injection in src/components/workspace/blockly-workspace.tsx
- [ ] T023 [P] [US1] Implement formatted C/C++ read-only code viewer panel with syntax highlighting and copy action in src/components/workspace/code-viewer.tsx
- [ ] T024 [US1] Implement Workspace page integrating Blockly canvas, code viewer, and real-time generation listener in src/app/workspace/page.tsx

**Checkpoint**: At this point, User Story 1 is fully functional and delivers the core educational value (MVP) independently.

---

## Phase 4: User Story 2 - Autenticação e Gestão de Projetos do Aluno (Priority: P2)

**Goal**: Permitir que o aluno se autentique exclusivamente via Google OAuth, acesse seu painel individual de projetos, salve o progresso do Workspace no Supabase, recarregue projetos salvos e exclua projetos, com isolamento estrito de dados garantido por RLS.

**Independent Test**: Aluno autentica-se com Google, cria um projeto nomeado no Workspace, salva, faz logout/login, reabre o projeto e constata a restauração exata dos blocos e do código C/C++; Aluno B não consegue visualizar nem modificar projetos do Aluno A.

### Tests for User Story 2 (TDD - Write FIRST, ensure FAIL before implementation) ⚠️

- [ ] T025 [P] [US2] Contract and integration test for Google Auth login and callback flow in tests/integration/api/auth.test.ts
- [ ] T026 [P] [US2] Contract and integration test for Projects CRUD API endpoints with RLS ownership rules in tests/integration/api/projects.test.ts
- [ ] T027 [P] [US2] Unit test for ProjectRepository data operations and error handling in tests/unit/domain/project-repository.test.ts

### Implementation for User Story 2

- [ ] T028 [P] [US2] Implement ProjectRepository for Supabase CRUD operations enforcing owner_id = auth.uid() in src/lib/repositories/project-repository.ts
- [ ] T029 [P] [US2] Implement Google OAuth sign-in screen and OAuth callback route handler in src/app/(auth)/login/page.tsx and src/app/api/auth/callback/route.ts
- [ ] T030 [US2] Implement Projects API route handlers for list and create (GET, POST /api/projects) with Zod boundary validation in src/app/api/projects/route.ts
- [ ] T031 [US2] Implement Projects API route handlers for get, update, and delete (GET, PUT, DELETE /api/projects/[id]) in src/app/api/projects/[id]/route.ts
- [ ] T032 [P] [US2] Implement project card and save project modal dialog components in src/components/projects/project-card.tsx and src/components/projects/save-project-modal.tsx
- [ ] T033 [US2] Implement Student Projects Dashboard page with project list and delete confirmation in src/app/(dashboard)/projects/page.tsx
- [ ] T034 [US2] Integrate project persistence toolbar in Workspace editor (/workspace/[id]) supporting save, rename, and load in src/components/workspace/workspace-toolbar.tsx and src/app/workspace/[id]/page.tsx

**Checkpoint**: At this point, User Stories 1 and 2 work together independently.

---

## Phase 5: User Story 3 - Gestão de Acessos e Alunos pelo Administrador (Priority: P3)

**Goal**: Permitir que o professor ou administrador acesse o painel `/admin` para visualizar a lista de alunos cadastrados, autorizar novos alunos e remover cadastros, bloqueando o acesso de alunos comuns a estas funções.

**Independent Test**: Usuário com role `ADMIN` acessa `/admin`, lista os alunos e autoriza um novo e-mail; usuário com role `ALUNO` ao tentar acessar `/admin` é bloqueado com HTTP 403 e redirecionado para `/workspace`.

### Tests for User Story 3 (TDD - Write FIRST, ensure FAIL before implementation) ⚠️

- [ ] T035 [P] [US3] Contract and integration test for Admin student management API endpoints and role guards in tests/integration/api/admin.test.ts
- [ ] T036 [P] [US3] Unit test for ProfileRepository admin lookup and role updates in tests/unit/domain/profile-repository.test.ts

### Implementation for User Story 3

- [ ] T037 [P] [US3] Implement ProfileRepository for querying and updating user profiles and roles in src/lib/repositories/profile-repository.ts
- [ ] T038 [US3] Implement Admin Students API route handlers (GET, POST /api/admin/students and DELETE /api/admin/students/[id]) with role verification in src/app/api/admin/students/route.ts and src/app/api/admin/students/[id]/route.ts
- [ ] T039 [P] [US3] Implement student roster table and add student modal dialog in src/components/admin/student-table.tsx and src/components/admin/add-student-modal.tsx
- [ ] T040 [US3] Implement Admin Dashboard page with server-side role-guard in src/app/admin/page.tsx

**Checkpoint**: All three user stories are independently functional and fully implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: System integration, navigation layout, educational branding, and quickstart validation.

- [ ] T041 [P] Implement responsive navigation header with user profile menu and role-aware navigation links in src/components/layout/header.tsx and src/app/layout.tsx
- [ ] T042 [P] Create educational landing page highlighting ELLP/UTFPR academic context and Google login in src/app/page.tsx
- [ ] T043 [P] Create seed script and Supabase local configuration for initial admin account in supabase/seed.sql
- [ ] T044 Run all end-to-end validation scenarios per specs/001-code-blocks-arduino/quickstart.md
- [ ] T045 Execute full static analysis, typecheck, and test suite to verify 100% CI pass and line limits per Constitution DoD in src/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **Phase 3 (User Story 1 - P1)**: Depends on Phase 2. Can be delivered as standalone MVP.
- **Phase 4 (User Story 2 - P2)**: Depends on Phase 2. Integrates with US1 Workspace for persistence.
- **Phase 5 (User Story 3 - P3)**: Depends on Phase 2. Independent admin management.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### Parallel Opportunities

- **Setup Phase**: T002, T003, T004 can execute in parallel once T001 is initialized.
- **Foundational Phase**: T006, T007, T008, T009, T010 can execute in parallel.
- **User Story 1 (P1)**:
  - Tests T011, T012, T013, T014, T015 can run in parallel (TDD).
  - Generators T016, T017, T018, T019 can run in parallel before T020.
  - UI components T021 and T023 can run in parallel with generator development.
- **User Story 2 (P2)**:
  - Tests T025, T026, T027 can run in parallel.
  - Repository T028, Auth UI T029, and Project UI T032 can run in parallel.
- **User Story 3 (P3)**:
  - Tests T035, T036 can run in parallel.
  - Repository T037 and UI T039 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Focus)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1):
   - Write tests T011-T015 (verify failure).
   - Implement block generators and ArduinoGenerator (T016-T020).
   - Implement Blockly workspace canvas and code viewer (T021-T024).
   - Run tests T011-T015 (verify all pass).
3. **STOP and DEMO MVP**: The platform can now translate visual logic into Arduino C/C++ in real-time.

### Incremental Delivery (Sprint 1 & Sprint 2)

- **Sprint 1**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1 - MVP).
- **Sprint 2**: Phase 4 (User Story 2 - Auth & Persistence) + Phase 5 (User Story 3 - Admin) + Phase 6 (Polish & DoD).
