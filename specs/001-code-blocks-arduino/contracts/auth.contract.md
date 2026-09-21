# Auth Contract: Google OAuth & Session Management

**Feature**: [spec.md](file:///home/lucas/code-blocks-arduino/specs/001-code-blocks-arduino/spec.md) | **Date**: 2026-09-19

Describes the contract for user authentication, Google OAuth redirection, and session resolution.

---

## 1. Endpoints & Server Actions

### 1.1 Initiate Google OAuth Login
- **Route**: `GET /api/auth/login` (or Server Action `signInWithGoogle()`)
- **Query Parameters**:
  - `redirectTo` (optional, string): Path to return after login (default: `/workspace`).
- **Behavior**:
  - Initiates OAuth2 authorization flow with Google via Supabase Auth.
  - Redirects browser to Google's sign-in screen.
- **Response**: HTTP 302 Redirect to Google OAuth consent page.

---

### 1.2 OAuth Callback
- **Route**: `GET /api/auth/callback`
- **Query Parameters**:
  - `code` (required, string): OAuth authorization code returned by Google.
  - `next` (optional, string): Destination path.
- **Behavior**:
  - Exchanges authorization code for a Supabase session (access & refresh tokens).
  - Stores tokens in secure `HttpOnly`, `SameSite=Lax` cookies.
  - Ensures a `profiles` record exists for the authenticated user.
- **Success Response**: HTTP 302 Redirect to `/workspace` (or `/admin` if user role is `ADMIN`).
- **Error Response**: HTTP 302 Redirect to `/?error=auth_failed`.

---

### 1.3 Sign Out
- **Route**: `POST /api/auth/logout` (or Server Action `signOut()`)
- **Behavior**:
  - Revokes current Supabase session.
  - Clears authentication cookies.
- **Response**: HTTP 302 Redirect to `/`.

---

### 1.4 Get Current User Session
- **Internal Contract**: `getCurrentUser(): Promise<UserProfile | null>`
- **Behavior**:
  - Reads session cookie on the server.
  - Returns sanitized profile (`id`, `email`, `role`, `fullName`) or `null` if unauthenticated.
