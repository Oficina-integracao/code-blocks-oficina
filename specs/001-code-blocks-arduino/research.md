# Research & Technical Decisions: Code Blocks Arduino Platform (MVP)

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

This document records the architectural investigations, pattern evaluations, and engineering decisions made for the MVP of Code Blocks Arduino, adhering to the project constitution.

---

## 1. Google Blockly Integration in Next.js (App Router)

### Decision
Render Google Blockly exclusively within a dedicated Client Component (`use client`) using dynamic imports (`next/dynamic` with `ssr: false`) and React `useRef` lifecycle hooks to manage the DOM injection of the SVG workspace.

### Rationale
- Google Blockly interacts directly with the browser DOM, window object, and SVG manipulation APIs, which are unavailable during Next.js Server-Side Rendering (SSR).
- Dynamic loading with `ssr: false` prevents SSR hydration mismatch errors.
- Encapsulating Blockly lifecycle inside a dedicated hook/component (`BlocklyWorkspace`) guarantees clean destruction (`workspace.dispose()`) on unmount, preventing memory leaks in single-page navigation.

### Alternatives Considered
- **React-Blockly wrapper library:** Evaluated npm packages like `react-blockly`. Rejected because they introduce stale React wrapper dependencies, lag behind upstream Blockly releases, and hinder custom toolbox/generator extensions. Direct usage of official `blockly` npm package conforms to the *Simplicity First* principle.
- **Server Component rendering with iframe:** Evaluated hosting Blockly in a standalone HTML iframe. Rejected due to poor inter-frame state synchronization, latency, and awkward UI layout integration.

---

## 2. Arduino C/C++ Code Generator Architecture

### Decision
Create a pure domain `ArduinoGenerator` extending Blockly's core `Generator` class (`Blockly.Generator`), generating standardized, deterministic C/C++ code formatted for the Arduino runtime (`void setup()` and `void loop()`).

### Rationale
- The Constitution strictly enforces: *Domain contains only business rules; Generator is solely responsible for `Blockly Workspace -> Arduino C/C++` with zero HTTP/UI/DB dependencies.*
- Deterministic code generation is directly verifiable with unit tests (Vitest) without needing a browser or active DOM workspace (using headless Blockly workspaces or serialized AST in tests).
- Clean code emission: Definitions (globals, pins), `setup()` initializations, and `loop()` body are tracked in separate generator buffers and assembled deterministically into the final C/C++ output string.

### Alternatives Considered
- **External Arduino generator packages (e.g. `blockly-arduino` forks):** Evaluated community forks. Rejected because they are outdated (built for Blockly v3/v4), contain excessive robotics-specific blocks, and violate our core educational requirement: teaching basic algorithm concepts (variables, conditions, loops, sequence) rather than proprietary robot commands.
- **Client-side AST tree walking via custom parser:** Writing our own AST parser from scratch. Rejected as premature abstraction; Blockly already provides the generator visitor pattern.

---

## 3. Supabase Auth & Google OAuth with Next.js SSR

### Decision
Implement authentication using `@supabase/ssr` with Next.js Server Actions and Route Handlers for cookie-based session management. Google OAuth is configured as the sole provider.

### Rationale
- Google OAuth is mandatory per project specification and constitution.
- `@supabase/ssr` securely stores session tokens in `HttpOnly`, `SameSite=Lax` cookies, preventing token exfiltration via client XSS and ensuring the server can authorize requests before rendering or executing database queries.
- Prevents exposing `SUPABASE_SERVICE_ROLE_KEY` to the browser (protects constitution Principle V: *Server-Side Security & Data Isolation*).

### Alternatives Considered
- **NextAuth.js (Auth.js):** Evaluated adding NextAuth. Rejected because Supabase native Auth already manages Google OAuth, session JWTs, and seamlessly attaches `auth.uid()` directly into PostgreSQL Row Level Security (RLS). Adding NextAuth would introduce redundant infrastructure.
- **Client-only Supabase SDK (`@supabase/supabase-js` with localStorage):** Rejected because storing JWTs in localStorage exposes tokens to XSS and violates the constitution's requirement that authentication/authorization must be server-verified.

---

## 4. PostgreSQL Schema & Row Level Security (RLS) Design

### Decision
Maintain two core tables in PostgreSQL: `profiles` (with role `ALUNO` or `ADMIN`) and `projects` (with foreign key `owner_id -> auth.users.id`). Enforce data isolation via PostgreSQL Row Level Security (RLS) policies based on `auth.uid()`.

### Rationale
- **Isolamento de Dados (Principle V):** RLS policies are applied at the database engine level, guaranteeing that even if an application bug occurs, a student cannot read or modify another student's projects.
- **Role Enforcement:** A security definer function or lookup table verifies admin privilege (`profiles.role = 'ADMIN'`) for student management endpoints.
- **Serialized Workspace Storage:** The Blockly workspace state is stored as a structured `jsonb` column (`workspace_state`), allowing fast persistence and retrieval without redundant parallel schemas.

### Alternatives Considered
- **Application-only authorization checks (in API route handlers):** Rejected because the Constitution explicitly forbids trusting client-driven security and mandates defense-in-depth via RLS.
- **Storing generated C/C++ string as primary source of truth:** Rejected because reverse translation from C/C++ to Blockly is out of scope and lossy; the serialized Blockly JSON is the canonical single source of truth.

---

## 5. Validation Boundary & Clean Architecture Separation

### Decision
Apply Zod schemas at the application boundary (Route Handlers / Server Actions) for structural validation of incoming payloads (project titles, student emails, workspace JSON structure). Domain invariants (e.g. valid variable identifier rules, block nesting constraints) are validated by domain helper functions.

### Rationale
- Aligns with Constitution Principle IV: *Validation Boundary: External data is never trusted. Structural validation occurs at the boundary; business validation occurs in the Domain.*
- Zod integrates seamlessly with TypeScript strict mode, inferring static types and stripping untrusted or malicious fields.

### Alternatives Considered
- **Manual conditional checks (`if (!name) ...`):** Error-prone, verbose, and difficult to keep consistent across routes.
- **Database constraints only:** While DB constraints are kept for foreign keys, waiting for database rejections produces opaque 500 errors instead of clear, user-friendly feedback.

---

## 6. Testing Strategy & CI Integration

### Decision
Use **Vitest** for fast unit and integration testing of Domain logic, Code Generator, and Validation schemas. Mock Supabase clients using dependency injection in repository services. Run linting, typechecking, tests, and build on GitHub Actions.

### Rationale
- Vitest provides native ESM and TypeScript support out of the box, executing generator test suites in milliseconds.
- TDD Red-Green-Refactor cycle (Principle II) can be executed rapidly during local development.
- Vitest's built-in coverage tool (v8) integrates with GitHub Actions CI to enforce coverage thresholds and prevent regressions.

### Alternatives Considered
- **Jest with ts-jest:** Heavier configuration, slower execution with ESM modules like modern Blockly.
- **Testing only via E2E (Playwright):** Slow feedback loop; contradicts the requirement for high-coverage unit testing of individual language structures (variables, loops, conditions). E2E will be supplementary for critical user journeys.
