/**
 * Domain-specific Error Hierarchy
 * Pure domain classes - Independent of HTTP status codes or framework types.
 */

export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier?: string) {
    super(
      identifier
        ? `${entityName} with ID '${identifier}' was not found.`
        : `${entityName} was not found.`
    );
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = "Access denied: insufficient permissions or unauthenticated.") {
    super(message);
  }
}

export class ValidationError extends DomainError {
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export class GeneratorError extends DomainError {
  public readonly blockId?: string;

  constructor(message: string, blockId?: string) {
    super(blockId ? `Code generation error on block [${blockId}]: ${message}` : message);
    this.blockId = blockId;
  }
}
