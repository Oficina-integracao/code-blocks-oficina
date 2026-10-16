import type * as Blockly from "blockly";
import {
  inferExpressionType,
  mergeTypes,
  type InferredType,
  type VariableType,
} from "./expression-types";
export { VARIABLE_DEFAULTS } from "./expression-types";
type Types = Map<string, InferredType>;
export interface VariableTypeAnalysis {
  types: Map<string, VariableType>;
  errors: Map<string, string>;
}

function variableName(block: Blockly.Block): string {
  return block.getField("VAR")?.getText().trim() || "variavel";
}

function declaredType(block: Blockly.Block): VariableType {
  return block.getFieldValue("TYPE") as VariableType;
}

function inScopeType(block: Blockly.Block): VariableType | undefined {
  const name = variableName(block);
  for (let scope: Blockly.Block | null = block; scope; scope = scope.getSurroundParent()) {
    for (let prev = scope.getPreviousBlock(); prev; prev = prev.getPreviousBlock()) {
      if (prev.isEnabled() && prev.type === "variables_declare" && variableName(prev) === name) {
        return declaredType(prev);
      }
    }
  }
}

function active(block: Blockly.Block): boolean {
  for (let parent: Blockly.Block | null = block; parent; parent = parent.getSurroundParent()) {
    if (!parent.isEnabled() || parent.isInsertionMarker()) return false;
  }
  return true;
}

function updateTypes(assignments: Blockly.Block[], types: Types): boolean {
  let changed = false;
  const variableTypeOf = (reference: Blockly.Block) =>
    inScopeType(reference) ?? types.get(variableName(reference));
  for (const block of assignments) {
    const name = variableName(block);
    const value = block.getInputTargetBlock(block.type === "variables_set" ? "VALUE" : "DELTA");
    const type = mergeTypes(
      types.get(name),
      value?.isEnabled() ? inferExpressionType(value, variableTypeOf) : "int",
    );
    if (type && types.get(name) !== type) {
      types.set(name, type);
      changed = true;
    }
  }
  return changed;
}

function resultFor(blocks: Blockly.Block[], types: Types): VariableTypeAnalysis {
  const result: VariableTypeAnalysis = { types: new Map(), errors: new Map() };
  for (const [name, type] of types) if (type !== "conflict") result.types.set(name, type);
  for (const block of blocks) {
    const name = variableName(block);
    if (
      /^variables_(get|set|change)$/.test(block.type) &&
      types.get(name) === "conflict" &&
      !inScopeType(block)
    ) {
      result.errors.set(
        block.id,
        `Cannot infer one type for variable "${name}". Add an explicit typed declaration.`,
      );
    }
  }
  return result;
}

function initialTypes(blocks: Blockly.Block[]): Types {
  const declarations = blocks.filter(
    (block) => block.type === "variables_declare" && !block.getSurroundParent(),
  );
  return new Map(declarations.map((block) => [variableName(block), declaredType(block)]));
}

function automaticAssignments(blocks: Blockly.Block[], types: Types): Blockly.Block[] {
  return blocks.filter(
    (block) =>
      /^variables_(set|change)$/.test(block.type) &&
      !types.has(variableName(block)) &&
      !inScopeType(block),
  );
}

function seedReadOnlyVariables(
  blocks: Blockly.Block[],
  assignments: Blockly.Block[],
  types: Types,
): void {
  const assigned = new Set(assignments.map(variableName));
  for (const block of blocks.filter(
    (block) => block.type === "variables_get" && !inScopeType(block),
  )) {
    const name = variableName(block);
    if (!assigned.has(name) && !types.has(name)) types.set(name, "int");
  }
}

/** Resolve live assignment constraints before emitting globals, including forward references. */
export function analyzeVariableTypes(workspace: Blockly.Workspace): VariableTypeAnalysis {
  const blocks = workspace
    .getTopBlocks(true)
    .filter((block) => !block.outputConnection)
    .flatMap((block) => block.getDescendants(false))
    .filter(active);
  const types = initialTypes(blocks);
  const assignments = automaticAssignments(blocks, types);
  seedReadOnlyVariables(blocks, assignments, types);
  for (let pass = 0; pass <= assignments.length; pass++) {
    if (!updateTypes(assignments, types)) break;
  }
  return resultFor(blocks, types);
}
