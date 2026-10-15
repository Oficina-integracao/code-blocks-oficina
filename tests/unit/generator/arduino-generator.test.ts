// @vitest-environment node
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as Blockly from "blockly";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";
import { registerVariableBlocks } from "@/core/generator/blocks/variables";

function connectValue(block: Blockly.Block, input: string, value: Blockly.Block): void {
  block.getInput(input)!.connection!.connect(value.outputConnection!);
}

function number(workspace: Blockly.Workspace, value: number): Blockly.Block {
  const block = workspace.newBlock("math_number");
  block.setFieldValue(String(value), "NUM");
  return block;
}

function declare(workspace: Blockly.Workspace, name: string, value = 0): Blockly.Block {
  const block = workspace.newBlock("variables_declare");
  block.setFieldValue(name, "VAR");
  connectValue(block, "VALUE", number(workspace, value));
  return block;
}

function assign(workspace: Blockly.Workspace, name: string, value: number): Blockly.Block {
  const variable = workspace.getVariable(name) ?? workspace.createVariable(name);
  const block = workspace.newBlock("variables_set");
  block.setFieldValue(variable.getId(), "VAR");
  connectValue(block, "VALUE", number(workspace, value));
  return block;
}

describe("ArduinoGenerator integration (T015)", () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeAll(() => {
    // Define the custom blocks without registering handlers on the instance under test.
    registerVariableBlocks(new ArduinoGenerator());
    Blockly.common.defineBlocksWithJsonArray([
      { type: "test_setup", message0: "setup", previousStatement: null, nextStatement: null },
      {
        type: "test_unsupported",
        message0: "unknown",
        previousStatement: null,
        nextStatement: null,
      },
      { type: "test_unsupported_value", message0: "unknown value", output: null },
    ]);
  });

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
  });

  afterEach(() => workspace.dispose());

  it("always emits a complete Arduino skeleton for an empty workspace", () => {
    expect(generator.generateCode(workspace)).toEqual({
      code: "void setup() {\n  // Inicializações\n}\n\nvoid loop() {\n  // Lógica Principal\n}\n",
      definitions: [],
      setupCode: [],
      loopCode: [],
      isValid: true,
    });
  });

  it("registers every existing block family on construction", () => {
    const families = [
      "variables_declare",
      "variables_get",
      "variables_set",
      "variables_change",
      "text",
      "math_number",
      "math_arithmetic",
      "logic_compare",
      "logic_operation",
      "logic_negate",
      "controls_if",
      "controls_repeat_ext",
      "controls_whileUntil",
      "controls_for",
    ];
    for (const type of families) expect(generator.forBlock[type]).toBeTypeOf("function");
  });

  it("places explicit declarations before setup and keeps assignments inside loop", () => {
    const declaration = declare(workspace, "velocidade", 100);
    declaration.nextConnection!.connect(assign(workspace, "velocidade", 80).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual(["int velocidade = 100;"]);
    expect(result.loopCode).toEqual(["velocidade = 80;\n"]);
    expect(result.code.indexOf("int velocidade")).toBeLessThan(result.code.indexOf("void setup()"));
    expect(result.code).toContain("void loop() {\n  velocidade = 80;\n}");
  });

  it("preserves declared types and safe defaults", () => {
    for (const [name, type] of [
      ["temperatura", "float"],
      ["ativo", "bool"],
      ["mensagem", "String"],
    ]) {
      const block = workspace.newBlock("variables_declare");
      block.setFieldValue(name, "VAR");
      block.setFieldValue(type, "TYPE");
    }
    expect(generator.generateCode(workspace).definitions).toEqual([
      "float temperatura = 0.0;",
      "bool ativo = false;",
      'String mensagem = "";',
    ]);
  });

  it("declares Blockly variables used without an explicit declaration only once", () => {
    const first = assign(workspace, "contador", 1);
    first.nextConnection!.connect(assign(workspace, "contador", 2).previousConnection!);
    workspace.createVariable("nao_utilizada");
    expect(generator.generateCode(workspace).definitions).toEqual(["int contador = 0;"]);
  });

  it("keeps nested declarations local to their control structure", () => {
    const conditional = workspace.newBlock("controls_if");
    const truth = workspace.newBlock("logic_boolean");
    connectValue(conditional, "IF0", truth);
    conditional
      .getInput("DO0")!
      .connection!.connect(declare(workspace, "local", 5).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual([]);
    expect(result.code).toContain("  if (true) {\n    int local = 5;\n  }");
  });

  it("separates setup contributions from loop and normalizes trailing newlines", () => {
    generator.forBlock["test_setup"] = () => {
      generator.definitions_["include"] = "#include <Arduino.h>";
      generator.setupCode_.push("Serial.begin(9600);", "pinMode(13, OUTPUT);\n");
      return "";
    };
    workspace
      .newBlock("test_setup")
      .nextConnection!.connect(assign(workspace, "x", 1).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.code).toContain(
      "void setup() {\n  Serial.begin(9600);\n  pinMode(13, OUTPUT);\n}",
    );
    expect(result.loopCode).toEqual(["x = 1;\n"]);
    expect(result.definitions).toContain("#include <Arduino.h>");
  });

  it("assembles variables, operators, conditionals and repetition without manual registration", () => {
    const declaration = declare(workspace, "velocidade", 100);
    const conditional = workspace.newBlock("controls_if");
    const comparison = workspace.newBlock("logic_compare");
    comparison.setFieldValue("GT", "OP");
    connectValue(comparison, "A", number(workspace, 100));
    connectValue(comparison, "B", number(workspace, 80));
    connectValue(conditional, "IF0", comparison);
    const repeat = workspace.newBlock("controls_repeat_ext");
    connectValue(repeat, "TIMES", number(workspace, 3));
    repeat
      .getInput("DO")!
      .connection!.connect(assign(workspace, "velocidade", 0).previousConnection!);
    conditional.getInput("DO0")!.connection!.connect(repeat.previousConnection!);
    declaration.nextConnection!.connect(conditional.previousConnection!);
    expect(generator.generateCode(workspace).code).toContain(
      "void loop() {\n  if (100 > 80) {\n    for (int count = 0; count < 3; count++) {\n      velocidade = 0;\n    }\n  }\n}",
    );
  });

  it("discards orphan values before invoking their generators", () => {
    workspace.newBlock("math_number");
    const variable = workspace.createVariable("orfao");
    workspace.newBlock("variables_get").setFieldValue(variable.getId(), "VAR");
    generator.forBlock["math_number"] = () => {
      throw new Error("Orphan was generated");
    };
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual([]);
    expect(result.loopCode).toEqual([]);
    expect(result.isValid).toBe(true);
  });

  it("skips disabled statements while retaining the enabled statements after them", () => {
    const disabled = declare(workspace, "ignorada", 99);
    disabled.nextConnection!.connect(assign(workspace, "ativa", 7).previousConnection!);
    disabled.setDisabledReason(true, "test");
    const result = generator.generateCode(workspace);
    expect(result.code).not.toContain("ignorada");
    expect(result.loopCode).toEqual(["ativa = 7;\n"]);
  });

  it("reports unsupported blocks and still emits the supported statements", () => {
    const unsupported = workspace.newBlock("test_unsupported");
    unsupported.nextConnection!.connect(assign(workspace, "ativa", 7).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.isValid).toBe(false);
    expect(result.errors?.join(" ")).toContain("test_unsupported");
    expect(result.loopCode).toEqual(["ativa = 7;\n"]);
  });

  it("does not emit break outside a loop", () => {
    workspace.newBlock("controls_flow_statements");
    const result = generator.generateCode(workspace);
    expect(result.code).not.toContain("break;");
    expect(result.isValid).toBe(false);
  });

  it("uses a safe fallback for unsupported value inputs and reports the block", () => {
    const statement = assign(workspace, "ativa", 7);
    statement.getInputTargetBlock("VALUE")!.dispose();
    connectValue(statement, "VALUE", workspace.newBlock("test_unsupported_value"));
    const result = generator.generateCode(workspace);
    expect(result.loopCode).toEqual(["ativa = 0;\n"]);
    expect(result.isValid).toBe(false);
    expect(result.errors?.join(" ")).toContain("test_unsupported_value");
  });

  it("retains the existing safe defaults for incomplete control inputs", () => {
    workspace.newBlock("controls_if");
    const result = generator.generateCode(workspace);
    expect(result.code).toContain("  if (false) {\n  }\n");
    expect(result.isValid).toBe(true);
  });

  it("retains valid flow statements inside repetition", () => {
    const repeat = workspace.newBlock("controls_repeat_ext");
    connectValue(repeat, "TIMES", number(workspace, 3));
    repeat
      .getInput("DO")!
      .connection!.connect(workspace.newBlock("controls_flow_statements").previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.code).toContain("    break;\n");
    expect(result.isValid).toBe(true);
  });

  it("produces identical results without changing the serialized workspace", () => {
    declare(workspace, "total", 10);
    const before = Blockly.serialization.workspaces.save(workspace);
    const first = generator.generateCode(workspace);
    expect(generator.generateCode(workspace)).toEqual(first);
    expect(Blockly.serialization.workspaces.save(workspace)).toEqual(before);
  });

  it("clears buffers and diagnostics between workspaces and preserves previous results", () => {
    generator.forBlock["test_setup"] = () => {
      generator.setupCode_.push("Serial.begin(9600);");
      return "";
    };
    workspace.newBlock("test_setup");
    workspace.newBlock("test_unsupported");
    assign(workspace, "antiga", 9);
    const first = generator.generateCode(workspace);
    workspace.clear();
    const second = generator.generateCode(workspace);
    expect(second.definitions).toEqual([]);
    expect(second.setupCode).toEqual([]);
    expect(second.loopCode).toEqual([]);
    expect(second.isValid).toBe(true);
    expect(second.errors).toBeUndefined();
    expect(first.definitions).toEqual(["int antiga = 0;"]);
    expect(first.setupCode).toEqual(["Serial.begin(9600);"]);
    expect(first.errors?.join(" ")).toContain("test_unsupported");
  });

  it("supports the standard Blockly workspaceToCode entry point", () => {
    declare(workspace, "total", 10);
    expect(generator.workspaceToCode(workspace)).toBe(generator.generateCode(workspace).code);
  });

  it("uses valid C++ identifiers for numeric prefixes and reserved names", () => {
    declare(workspace, "123 nome", 1);
    declare(workspace, "setup", 2);
    const emptyName = declare(workspace, "", 3);
    emptyName.nextConnection!.connect(assign(workspace, "variavel", 4).previousConnection!);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toContain("int var_123_nome = 1;");
    expect(result.definitions).not.toContain("int setup = 2;");
    expect(result.definitions.filter((definition) => definition.includes("variavel"))).toEqual([
      "int variavel = 3;",
    ]);
    expect(generator.generateCode(workspace)).toEqual(result);
  });

  it("keeps distinct names distinct after sanitization and protects C++ keywords", () => {
    declare(workspace, "sensor-a", 1);
    declare(workspace, "sensor_a", 2);
    declare(workspace, "class", 3);
    const result = generator.generateCode(workspace);
    expect(result.definitions).toEqual([
      "int sensor_a = 1;",
      "int sensor_a2 = 2;",
      "int class2 = 3;",
    ]);
    expect(generator.generateCode(workspace)).toEqual(result);
  });
});
