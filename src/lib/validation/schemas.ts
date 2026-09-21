import { z } from "zod";

/**
 * Boundary Validation Schemas (Zod)
 * Validates untrusted external requests before reaching application core.
 */

// Schema for creating a project
export const createProjectSchema = z.object({
  title: z
    .string({ required_error: "O título do projeto é obrigatório." })
    .trim()
    .min(1, { message: "O título não pode estar em branco." })
    .max(100, { message: "O título deve ter no máximo 100 caracteres." }),
  workspace_state: z.record(z.unknown()).default({
    blocks: { languageVersion: 0, blocks: [] },
  }),
  generated_code: z.string().optional().default(""),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Schema for updating a project
export const updateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "O título não pode estar em branco." })
    .max(100, { message: "O título deve ter no máximo 100 caracteres." })
    .optional(),
  workspace_state: z.record(z.unknown()).optional(),
  generated_code: z.string().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Schema for administrative student pre-authorization
export const createStudentSchema = z.object({
  email: z
    .string({ required_error: "O e-mail do aluno é obrigatório." })
    .trim()
    .email({ message: "Formato de e-mail inválido." })
    .toLowerCase(),
  full_name: z.string().trim().max(255).optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

// Schema for safe internal redirection (prevents open-redirect attacks)
export const safeRedirectSchema = z
  .string()
  .refine((val) => val.startsWith("/") && !val.startsWith("//"), {
    message: "Destino de redirecionamento inválido.",
  });
