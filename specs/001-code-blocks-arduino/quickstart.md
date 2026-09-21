# Quickstart Validation Guide: Code Blocks Arduino Platform (MVP)

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

This guide describes the end-to-end validation scenarios to verify that the Code Blocks Arduino MVP meets its functional requirements, architectural boundaries, and DoD.

---

## 1. Prerequisites & Environment Setup

- **Node.js**: `v20.x` or later
- **Package Manager**: `npm`
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project endpoint
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (strictly server-side, never exposed to client)
  - `NEXT_PUBLIC_SITE_URL`: Application origin (e.g. `http://localhost:3000`)

---

## 2. Setup & Execution Commands

```bash
# 1. Install dependencies
npm install

# 2. Run static analysis & typechecking
npm run lint
npm run typecheck

# 3. Run automated tests (Unit & Integration)
npm run test

# 4. Verify test coverage thresholds
npm run test:coverage

# 5. Start local development server
npm run dev
```

---

## 3. End-to-End Validation Scenarios

### Scenario 1: Visual Block Assembly & Instant Arduino C/C++ Generation (P1)
1. Navigate to `http://localhost:3000/workspace`.
2. From the Blockly toolbox, drag a **Variável** block (`criar variável idade = 18`).
3. Drag a **Condicional** block (`se idade >= 18 entao ... senao ...`).
4. **Expected Outcome**:
   - The code panel to the right renders in `< 1s` the deterministic Arduino code:
     ```cpp
     int idade = 18;
     void setup() {}
     void loop() {
       if (idade >= 18) {
       } else {
       }
     }
     ```
   - No browser console errors.
   - Disconnecting blocks immediately updates the code without syntax errors.

### Scenario 2: Google Authentication & Project Persistence (P2)
1. On the landing page (`/`), click **Entrar com Google**.
2. Complete Google OAuth authorization.
3. In `/workspace`, create an algorithm, click **Salvar Projeto**, and name it `"Projeto Teste 1"`.
4. Navigate to `/projects`. Verify `"Projeto Teste 1"` is listed.
5. Click to open `"Projeto Teste 1"`. Verify the workspace restores the exact blocks and connections.
6. Make a change and save again. Verify the updated timestamp reflects the change.
7. Click **Excluir** on `"Projeto Teste 1"`. Verify it is removed from the list.
8. **Expected Outcome**:
   - Data is stored in Supabase with `owner_id = auth.uid()`.
   - Projects of Student A are invisible and inaccessible to Student B.

### Scenario 3: Admin Student Management (P3)
1. Sign in with an account having role `ADMIN` in `profiles`.
2. Navigate to `/admin`.
3. In the student management section, add a new student e-mail (`aluno.novo@utfpr.edu.br`).
4. Verify the student appears in the active roster.
5. Attempt to navigate to `/admin` using a regular `ALUNO` account; verify the system redirects to `/workspace` with access denied.
6. **Expected Outcome**:
   - Only authorized admins can manage students.
   - Non-admin attempts return HTTP 403 Forbidden.

---

## 4. Quality Gate Verification (Definition of Done)

Prior to opening a Pull Request:
- [ ] Automated tests pass: `npm run test` (all suites green).
- [ ] Code coverage does not regress: `npm run test:coverage`.
- [ ] Typechecking is clean: `npm run typecheck` (zero `any` without justification).
- [ ] Complexity limits respected:
  - React components $\le 100$ lines
  - Services / Use cases $\le 150$ lines
  - Route handlers $\le 60$ lines
  - Functions $\le 20$ lines
- [ ] No secrets, debug logs, or temporary comments commited.
