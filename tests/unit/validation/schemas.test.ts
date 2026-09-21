import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  createStudentSchema,
  safeRedirectSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas (Zod)", () => {
  describe("createProjectSchema", () => {
    it("should accept valid project creation input", () => {
      const res = createProjectSchema.safeParse({
        title: "Meu Algoritmo",
        workspace_state: { blocks: { languageVersion: 0, blocks: [] } },
      });
      expect(res.success).toBe(true);
    });

    it("should reject empty or whitespace-only title", () => {
      const res = createProjectSchema.safeParse({
        title: "   ",
      });
      expect(res.success).toBe(false);
    });

    it("should reject titles longer than 100 characters", () => {
      const res = createProjectSchema.safeParse({
        title: "A".repeat(101),
      });
      expect(res.success).toBe(false);
    });
  });

  describe("createStudentSchema", () => {
    it("should accept valid email address and normalize to lowercase", () => {
      const res = createStudentSchema.safeParse({
        email: "Aluno@UTFPR.edu.br",
        full_name: "Aluno Teste",
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.email).toBe("aluno@utfpr.edu.br");
      }
    });

    it("should reject invalid email strings", () => {
      const res = createStudentSchema.safeParse({
        email: "not-an-email",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("safeRedirectSchema", () => {
    it("should accept internal relative paths", () => {
      expect(safeRedirectSchema.safeParse("/workspace").success).toBe(true);
      expect(safeRedirectSchema.safeParse("/projects/123").success).toBe(true);
    });

    it("should reject external or protocol-relative URLs", () => {
      expect(safeRedirectSchema.safeParse("https://evil.com").success).toBe(false);
      expect(safeRedirectSchema.safeParse("//evil.com").success).toBe(false);
      expect(safeRedirectSchema.safeParse("javascript:alert(1)").success).toBe(false);
    });
  });
});
