import { describe, it, expect } from "vitest";
import { isValidProjectTitle, isValidUserRole } from "@/core/domain/entities/models";

describe("Domain Models Invariants", () => {
  describe("isValidProjectTitle", () => {
    it("should accept valid trimmed titles between 1 and 100 characters", () => {
      expect(isValidProjectTitle("Meu Projeto")).toBe(true);
      expect(isValidProjectTitle("A")).toBe(true);
      expect(isValidProjectTitle("X".repeat(100))).toBe(true);
    });

    it("should reject empty or whitespace-only titles", () => {
      expect(isValidProjectTitle("")).toBe(false);
      expect(isValidProjectTitle("   ")).toBe(false);
    });

    it("should reject titles exceeding 100 characters", () => {
      expect(isValidProjectTitle("X".repeat(101))).toBe(false);
    });
  });

  describe("isValidUserRole", () => {
    it("should accept 'ALUNO' and 'ADMIN'", () => {
      expect(isValidUserRole("ALUNO")).toBe(true);
      expect(isValidUserRole("ADMIN")).toBe(true);
    });

    it("should reject any other role string", () => {
      expect(isValidUserRole("TEACHER")).toBe(false);
      expect(isValidUserRole("GUEST")).toBe(false);
      expect(isValidUserRole("")).toBe(false);
    });
  });
});
