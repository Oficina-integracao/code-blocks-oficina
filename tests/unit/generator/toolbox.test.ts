import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as Blockly from "blockly";
import { toolbox } from "@/core/generator/toolbox";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";
import { registerVariableBlocks } from "@/core/generator/blocks/variables";
import { registerOperatorBlocks } from "@/core/generator/blocks/operators";
import { registerConditionalBlocks } from "@/core/generator/blocks/conditionals";
import { registerLoopBlocks } from "@/core/generator/blocks/loops";

describe("Fundamental Blockly toolbox (T021)", () => {
  let workspace: Blockly.Workspace;
  let generator: ArduinoGenerator;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    generator = new ArduinoGenerator();
    // Keep this configuration independently usable with the existing block modules.
    registerVariableBlocks(generator);
    registerOperatorBlocks(generator);
    registerConditionalBlocks(generator);
    registerLoopBlocks(generator);
  });

  afterEach(() => workspace.dispose());

  it("provides the five educational categories with distinct colors and logical icons", () => {
    expect(toolbox.kind).toBe("categoryToolbox");
    expect(toolbox.contents.map((category) => category.name)).toEqual([
      "↕ Sequência",
      "𝑥 Variáveis",
      "＋ Operadores",
      "◇ Condicionais",
      "↻ Laços",
    ]);
    const colors = toolbox.contents.map((category) => category.colour);
    expect(new Set(colors).size).toBe(5);
    for (const color of colors) expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("uses valid block definitions and generators for every toolbox entry", () => {
    for (const category of toolbox.contents) {
      for (const entry of category.contents) {
        if (!("type" in entry) || !entry.type) continue;
        const block = Blockly.serialization.blocks.append(
          { ...entry, type: entry.type },
          workspace,
        );
        expect(Blockly.Blocks[block.type]).toBeDefined();
        expect(generator.forBlock[block.type]).toBeTypeOf("function");
        expect(() => generator.blockToCode(block)).not.toThrow();
        block.dispose();
      }
    }
  });

  it("teaches sequence using an executable stack of connected existing instructions", () => {
    const entry = toolbox.contents[0].contents.find((item) => "type" in item);
    if (!entry || !("type" in entry) || !entry.type) throw new Error("Missing sequence example");
    const block = Blockly.serialization.blocks.append({ ...entry, type: entry.type }, workspace);
    expect(block.getNextBlock()).not.toBeNull();
    const code = generator.blockToCode(block);
    expect(code).toContain("int contador = 0;");
    expect(code).toContain("contador = contador + 1;");
    expect(String(code).indexOf("int contador")).toBeLessThan(
      String(code).indexOf("contador = contador + 1"),
    );
  });

  it("contains declaration, assignment, change, reading and the basic literal types", () => {
    const types = toolbox.contents[1].contents.map((entry) =>
      "type" in entry ? entry.type : undefined,
    );
    expect(types).toEqual(
      expect.arrayContaining([
        "variables_declare",
        "variables_set",
        "variables_change",
        "variables_get",
        "math_number",
        "logic_boolean",
        "text",
      ]),
    );
  });

  it("provides arithmetic, comparison and boolean operators", () => {
    const types = toolbox.contents[2].contents.map((entry) =>
      "type" in entry ? entry.type : undefined,
    );
    expect(types).toEqual(
      expect.arrayContaining([
        "math_arithmetic",
        "logic_compare",
        "logic_operation",
        "logic_negate",
      ]),
    );
  });

  it("creates the if-else entry with its else input already present", () => {
    const entry = toolbox.contents[3].contents.find((item) => "extraState" in item);
    if (!entry || !("type" in entry) || !entry.type) throw new Error("Missing if-else entry");
    const block = Blockly.serialization.blocks.append({ ...entry, type: entry.type }, workspace);
    expect(block.getInput("IF0")).not.toBeNull();
    expect(block.getInput("DO0")).not.toBeNull();
    expect(block.getInput("ELSE")).not.toBeNull();
  });

  it("provides count, for and conditional loops plus flow statements", () => {
    const types = toolbox.contents[4].contents.map((entry) =>
      "type" in entry ? entry.type : undefined,
    );
    expect(types).toEqual(
      expect.arrayContaining([
        "controls_repeat_ext",
        "controls_for",
        "controls_whileUntil",
        "controls_flow_statements",
      ]),
    );
  });

  it("round-trips the configuration as JSON for safe Blockly injection", () => {
    const definition: Blockly.utils.toolbox.ToolboxInfo = toolbox;
    expect(definition.kind).toBe("categoryToolbox");
    expect(JSON.parse(JSON.stringify(toolbox))).toEqual(toolbox);
  });
});
