import { describe, it, expect } from "vitest";
import {
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  GeneratorError,
} from "@/core/domain/errors/domain-errors";

describe("Domain Errors Hierarchy", () => {
  it("NotFoundError should format entity name and id", () => {
    const err = new NotFoundError("Project", "proj-123");
    expect(err).toBeInstanceOf(DomainError);
    expect(err.name).toBe("NotFoundError");
    expect(err.message).toContain("Project with ID 'proj-123' was not found.");
  });

  it("UnauthorizedError should have appropriate default message", () => {
    const err = new UnauthorizedError();
    expect(err).toBeInstanceOf(DomainError);
    expect(err.name).toBe("UnauthorizedError");
    expect(err.message).toContain("Access denied");
  });

  it("ValidationError should store fieldErrors payload", () => {
    const err = new ValidationError("Invalid inputs", { title: ["Title is required"] });
    expect(err).toBeInstanceOf(DomainError);
    expect(err.name).toBe("ValidationError");
    expect(err.fieldErrors?.title).toEqual(["Title is required"]);
  });

  it("GeneratorError should store blockId and message", () => {
    const err = new GeneratorError("Syntax missing", "block_42");
    expect(err).toBeInstanceOf(DomainError);
    expect(err.name).toBe("GeneratorError");
    expect(err.blockId).toBe("block_42");
    expect(err.message).toContain("block [block_42]");
  });
});
