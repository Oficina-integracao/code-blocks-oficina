import type * as Blockly from "blockly";

export const VARIABLE_DEFAULTS = {
  int: "0",
  float: "0.0",
  bool: "false",
  String: '""',
  char: "'\\0'",
};
export type VariableType = keyof typeof VARIABLE_DEFAULTS;
export type InferredType = VariableType | "conflict";
type VariableTypeOf = (block: Blockly.Block) => InferredType | undefined;

export function mergeTypes(a?: InferredType, b?: InferredType): InferredType | undefined {
  if (!a || a === b) return b ?? a;
  if (!b) return a;
  if (a === "conflict" || b === "conflict" || a === "String" || b === "String") return "conflict";
  return a === "float" || b === "float" ? "float" : "int";
}

function numericType(
  block: Blockly.Block,
  variableTypeOf: VariableTypeOf,
): InferredType | undefined {
  const operands = block
    .getChildren(false)
    .filter((child) => child.outputConnection)
    .map((child) => (child.isEnabled() ? inferExpressionType(child, variableTypeOf) : "int"));
  if (operands.some((type) => type === "String" || type === "conflict")) return "conflict";
  if (operands.some((type) => !type)) return;
  if (block.type === "math_arithmetic" && block.getFieldValue("OP") !== "POWER") {
    return operands.reduce<InferredType | undefined>(mergeTypes, "int");
  }
  if (block.type === "math_single" && block.getFieldValue("OP") === "NEG")
    return mergeTypes("int", operands[0]);
  if (block.type === "math_modulo") return operands.includes("float") ? "conflict" : "int";
  return block.type === "math_random_int" ? "int" : "float";
}

export function inferExpressionType(
  block: Blockly.Block | null,
  variableTypeOf: VariableTypeOf,
): InferredType | undefined {
  if (!block || !block.isEnabled()) return;
  if (block.type === "math_number")
    return Number.isInteger(Number(block.getFieldValue("NUM"))) ? "int" : "float";
  if (block.type === "variables_get") return variableTypeOf(block);
  if (block.type === "logic_ternary") {
    return mergeTypes(
      inferExpressionType(block.getInputTargetBlock("THEN"), variableTypeOf),
      inferExpressionType(block.getInputTargetBlock("ELSE"), variableTypeOf),
    );
  }
  const output = block.outputConnection?.getCheck() ?? [];
  if (output.includes("String")) return "String";
  if (output.includes("Boolean")) return "bool";
  if (output.includes("Number")) return numericType(block, variableTypeOf);
}
