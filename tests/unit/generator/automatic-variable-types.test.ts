// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as Blockly from "blockly";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";

function connect(block: Blockly.Block, input: string, value: Blockly.Block): void {
  block.getInput(input)!.connection!.connect(value.outputConnection!);
}

function literal(workspace: Blockly.Workspace, value: string | number | boolean): Blockly.Block {
  const type =
    typeof value === "string"
      ? "text"
      : typeof value === "boolean"
        ? "logic_boolean"
        : "math_number";
  const block = workspace.newBlock(type);
  const field = type === "text" ? "TEXT" : type === "logic_boolean" ? "BOOL" : "NUM";
  block.setFieldValue(
    typeof value === "boolean" ? String(value).toUpperCase() : String(value),
    field,
  );
  return block;
}

function variableBlock(
  workspace: Blockly.Workspace,
  name: string,
  type = "variables_set",
): Blockly.Block {
  const variable = workspace.getVariable(name) ?? workspace.createVariable(name);
  const block = workspace.newBlock(type);
  block.setFieldValue(variable.getId(), "VAR");
  return block;
}

function assign(
  workspace: Blockly.Workspace,
  name: string,
  value: string | number | boolean,
): Blockly.Block {
  const block = variableBlock(workspace, name);
  connect(block, "VALUE", literal(workspace, value));
  return block;
}

describe("Automatic Arduino variable types (follow-up to #20)", () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;
  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
  });
  afterEach(() => workspace.dispose());

  it.each([
    [7, "int valor = 0;"],
    [2.5, "float valor = 0.0;"],
    [true, "bool valor = false;"],
    ["Ola", 'String valor = "";'],
  ] as const)(
    "infers the declaration for %s without moving the assignment out of loop",
    (value, declaration) => {
      assign(workspace, "valor", value);
      const result = generator.generateCode(workspace);
      expect(result.definitions).toEqual([declaration]);
      expect(result.loopCode).toEqual([
        `valor = ${typeof value === "string" ? JSON.stringify(value) : String(value)};\n`,
      ]);
      expect(result.isValid).toBe(true);
    },
  );

  it("widens integer assignments to float when a later assignment has decimals", () => {
    const first = assign(workspace, "valor", 1);
    first.nextConnection!.connect(assign(workspace, "valor", 2.5).previousConnection!);
    expect(generator.generateCode(workspace).definitions).toEqual(["float valor = 0.0;"]);
  });

  it("infers a boolean result from a comparison", () => {
    const assignment = variableBlock(workspace, "ativo");
    const comparison = workspace.newBlock("logic_compare");
    connect(comparison, "A", literal(workspace, 1));
    connect(comparison, "B", literal(workspace, 2));
    connect(assignment, "VALUE", comparison);
    expect(generator.generateCode(workspace).definitions).toEqual(["bool ativo = false;"]);
  });

  it("infers arithmetic without truncating decimal results", () => {
    const assignment = variableBlock(workspace, "total");
    const sum = workspace.newBlock("math_arithmetic");
    connect(sum, "A", literal(workspace, 1));
    connect(sum, "B", literal(workspace, 2.5));
    connect(assignment, "VALUE", sum);
    expect(generator.generateCode(workspace).definitions).toEqual(["float total = 0.0;"]);
  });

  it("resolves copies before the original variable is assigned", () => {
    const first = variableBlock(workspace, "copia");
    connect(first, "VALUE", variableBlock(workspace, "origem", "variables_get"));
    first.nextConnection!.connect(assign(workspace, "origem", "Ola").previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(
      expect.arrayContaining(['String copia = "";', 'String origem = "";']),
    );
    expect(result.isValid).toBe(true);
  });

  it("resolves longer reference chains independently of assignment order", () => {
    for (const [target, source] of [
      ["a", "b"],
      ["b", "c"],
    ]) {
      const assignment = variableBlock(workspace, target);
      connect(assignment, "VALUE", variableBlock(workspace, source, "variables_get"));
    }
    assign(workspace, "c", "Ola");
    expect(generator.generateCode(workspace).definitions).toEqual(
      expect.arrayContaining(['String a = "";', 'String b = "";', 'String c = "";']),
    );
  });

  it("keeps an explicit String declaration authoritative even when it follows an assignment", () => {
    const assignment = assign(workspace, "mensagem", "Ola");
    const declaration = workspace.newBlock("variables_declare");
    declaration.setFieldValue("mensagem", "VAR");
    declaration.setFieldValue("String", "TYPE");
    assignment.nextConnection!.connect(declaration.previousConnection!);
    expect(generator.generateCode(workspace).definitions).toEqual(['String mensagem = "";']);
  });

  it.each([
    [1, "Ola"],
    ["Ola", 1],
  ] as const)("reports conflicting automatic types for %s then %s", (first, second) => {
    assign(workspace, "misturada", first).nextConnection!.connect(
      assign(workspace, "misturada", second).previousConnection!,
    );
    const result = generator.generateCode(workspace);
    expect(result.isValid).toBe(false);
    expect(result.errors?.join(" ")).toContain("misturada");
    expect(result.errors?.join(" ")).toMatch(/type/i);
    expect(result.loopCode).toEqual([]);
  });

  it("does not infer types from disabled assignments", () => {
    const disabled = assign(workspace, "valor", "Ola");
    disabled.setDisabledReason(true, "test");
    disabled.nextConnection!.connect(assign(workspace, "valor", 1).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(["int valor = 0;"]);
    expect(result.isValid).toBe(true);
  });

  it("ignores assignments inside disabled control structures", () => {
    const conditional = workspace.newBlock("controls_if");
    conditional
      .getInput("DO0")!
      .connection!.connect(assign(workspace, "valor", "Ola").previousConnection!);
    conditional.setDisabledReason(true, "test");
    assign(workspace, "valor", 1);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(["int valor = 0;"]);
    expect(result.isValid).toBe(true);
  });

  it("recalculates types after edits without mutating the workspace or previous results", () => {
    const assignment = assign(workspace, "valor", "Ola");
    const first = generator.generateCode(workspace);
    assignment.getInputTargetBlock("VALUE")!.dispose();
    connect(assignment, "VALUE", literal(workspace, 2.5));
    const before = Blockly.serialization.workspaces.save(workspace);
    const second = generator.generateCode(workspace);
    expect(second.definitions).toEqual(["float valor = 0.0;"]);
    expect(first.definitions).toEqual(['String valor = "";']);
    expect(Blockly.serialization.workspaces.save(workspace)).toEqual(before);
    expect(generator.generateCode(workspace)).toEqual(second);
  });

  it("does not loop forever on unresolved circular references", () => {
    for (const [target, source] of [
      ["a", "b"],
      ["b", "a"],
    ]) {
      connect(
        variableBlock(workspace, target),
        "VALUE",
        variableBlock(workspace, source, "variables_get"),
      );
    }
    expect(generator.generateCode(workspace).definitions).toEqual(
      expect.arrayContaining(["int a = 0;", "int b = 0;"]),
    );
  });

  it("infers text from both branches of a conditional expression", () => {
    const choice = workspace.newBlock("logic_ternary");
    connect(choice, "IF", literal(workspace, true));
    connect(choice, "THEN", literal(workspace, "Ola"));
    connect(choice, "ELSE", literal(workspace, "Tchau"));
    connect(variableBlock(workspace, "mensagem"), "VALUE", choice);
    expect(generator.generateCode(workspace).definitions).toEqual(['String mensagem = "";']);
  });

  it("promotes a boolean operand to int for unary minus", () => {
    const first = assign(workspace, "flag", true);
    const result = variableBlock(workspace, "total");
    first.nextConnection!.connect(result.previousConnection!);
    const negative = workspace.newBlock("math_single");
    negative.setFieldValue("NEG", "OP");
    connect(negative, "NUM", variableBlock(workspace, "flag", "variables_get"));
    connect(result, "VALUE", negative);
    expect(generator.generateCode(workspace).definitions).toContain("int total = 0;");
  });

  it("uses numeric fallbacks for disabled expression operands", () => {
    const sum = workspace.newBlock("math_arithmetic");
    const disabled = literal(workspace, 10);
    connect(sum, "A", disabled);
    connect(sum, "B", literal(workspace, 2.5));
    disabled.setDisabledReason(true, "test");
    connect(variableBlock(workspace, "total"), "VALUE", sum);
    expect(generator.generateCode(workspace).definitions).toEqual(["float total = 0.0;"]);
  });

  it("resolves a local declaration without confusing it with a global of the same name", () => {
    const global = workspace.newBlock("variables_declare");
    global.setFieldValue("valor", "VAR");
    const conditional = workspace.newBlock("controls_if");
    global.nextConnection!.connect(conditional.previousConnection!);
    const local = workspace.newBlock("variables_declare");
    local.setFieldValue("valor", "VAR");
    local.setFieldValue("String", "TYPE");
    conditional.getInput("DO0")!.connection!.connect(local.previousConnection!);
    const copy = variableBlock(workspace, "copia");
    local.nextConnection!.connect(copy.previousConnection!);
    connect(copy, "VALUE", variableBlock(workspace, "valor", "variables_get"));
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(
      expect.arrayContaining(["int valor = 0;", 'String copia = "";']),
    );
    expect(result.isValid).toBe(true);
  });

  it("uses float for a mathematical function result", () => {
    const root = workspace.newBlock("math_single");
    root.setFieldValue("ROOT", "OP");
    connect(root, "NUM", literal(workspace, 9));
    connect(variableBlock(workspace, "raiz"), "VALUE", root);
    expect(generator.generateCode(workspace).definitions).toEqual(["float raiz = 0.0;"]);
  });

  it("preserves char when copying an explicitly typed variable", () => {
    const declaration = workspace.newBlock("variables_declare");
    declaration.setFieldValue("letra", "VAR");
    declaration.setFieldValue("char", "TYPE");
    const copy = variableBlock(workspace, "copia");
    declaration.nextConnection!.connect(copy.previousConnection!);
    connect(copy, "VALUE", variableBlock(workspace, "letra", "variables_get"));
    expect(generator.generateCode(workspace).definitions).toContain("char copia = '\\0';");
  });

  it("infers text inside nested control flow while retaining valid break statements", () => {
    const repeat = workspace.newBlock("controls_repeat_ext");
    connect(repeat, "TIMES", literal(workspace, 3));
    const conditional = workspace.newBlock("controls_if");
    connect(conditional, "IF0", literal(workspace, true));
    repeat.getInput("DO")!.connection!.connect(conditional.previousConnection!);
    const assignment = assign(workspace, "mensagem", "Ola");
    conditional.getInput("DO0")!.connection!.connect(assignment.previousConnection!);
    assignment.nextConnection!.connect(
      workspace.newBlock("controls_flow_statements").previousConnection!,
    );
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(['String mensagem = "";']);
    expect(result.code).toContain("break;");
    expect(result.isValid).toBe(true);
  });
});
