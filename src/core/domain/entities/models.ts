/**
 * Core Domain Entities for Code Blocks Arduino
 * Pure domain representations - ZERO dependencies on UI, HTTP or database drivers.
 */

export type UserRole = "ALUNO" | "ADMIN";

export interface UserProfile {
  id: string; // UUID referencing auth.users
  email: string;
  fullName: string | null;
  role: UserRole; // Must strictly be one of ['ALUNO', 'ADMIN']
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface WorkspaceState {
  blocks?: {
    languageVersion?: number;
    blocks?: unknown[];
  };
  variables?: unknown[];
  [key: string]: unknown;
}

export interface Project {
  id: string; // UUID
  ownerId: string; // UUID referencing UserProfile
  title: string; // Length between 1 and 100 characters, trimmed
  workspaceState: WorkspaceState; // Must be valid JSON matching Blockly serialization
  generatedCode: string; // Cached Arduino C/C++ code
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Validates domain constraints for project title:
 * Length between 1 and 100 characters, non-empty after trim.
 */
export function isValidProjectTitle(title: string): boolean {
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Validates domain constraints for user role:
 * Must strictly be 'ALUNO' or 'ADMIN'.
 */
export function isValidUserRole(role: string): role is UserRole {
  return role === "ALUNO" || role === "ADMIN";
}
