import type * as Blockly from "blockly";

type ToolboxCategory = {
  kind: "category";
  name: string;
  colour: string;
  contents: (Blockly.utils.toolbox.BlockInfo | { kind: "label"; text: string })[];
};

function numericInput(value: number) {
  return { shadow: { type: "math_number", fields: { NUM: value } } };
}

function booleanInput(value: "TRUE" | "FALSE" = "TRUE") {
  return { shadow: { type: "logic_boolean", fields: { BOOL: value } } };
}

/** JSON toolbox for the five foundational concepts; sequences use connected statements. */
export const toolbox: { kind: "categoryToolbox"; contents: ToolboxCategory[] } = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "↕ Sequência",
      colour: "#607D8B",
      contents: [
        { kind: "label", text: "Conecte as instruções de cima para baixo" },
        {
          kind: "block",
          type: "variables_declare",
          fields: { VAR: "contador", TYPE: "int" },
          inputs: { VALUE: numericInput(0) },
          next: {
            block: {
              type: "variables_change",
              fields: { VAR: "contador" },
              inputs: { DELTA: numericInput(1) },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "𝑥 Variáveis",
      colour: "#A65C81",
      contents: [
        { kind: "block", type: "variables_declare", inputs: { VALUE: numericInput(0) } },
        { kind: "block", type: "variables_set", inputs: { VALUE: numericInput(0) } },
        { kind: "block", type: "variables_change", inputs: { DELTA: numericInput(1) } },
        { kind: "block", type: "variables_get" },
        { kind: "block", type: "math_number" },
        { kind: "block", type: "logic_boolean" },
        { kind: "block", type: "text" },
      ],
    },
    {
      kind: "category",
      name: "＋ Operadores",
      colour: "#5C68A6",
      contents: [
        {
          kind: "block",
          type: "math_arithmetic",
          inputs: { A: numericInput(1), B: numericInput(1) },
        },
        {
          kind: "block",
          type: "logic_compare",
          inputs: { A: numericInput(0), B: numericInput(0) },
        },
        {
          kind: "block",
          type: "logic_operation",
          inputs: { A: booleanInput(), B: booleanInput() },
        },
        { kind: "block", type: "logic_negate", inputs: { BOOL: booleanInput() } },
      ],
    },
    {
      kind: "category",
      name: "◇ Condicionais",
      colour: "#5C81A6",
      contents: [
        { kind: "block", type: "controls_if", inputs: { IF0: booleanInput() } },
        {
          kind: "block",
          type: "controls_if",
          extraState: { hasElse: true },
          inputs: { IF0: booleanInput() },
        },
      ],
    },
    {
      kind: "category",
      name: "↻ Laços",
      colour: "#5CA65C",
      contents: [
        { kind: "block", type: "controls_repeat_ext", inputs: { TIMES: numericInput(10) } },
        {
          kind: "block",
          type: "controls_for",
          inputs: { FROM: numericInput(1), TO: numericInput(10), BY: numericInput(1) },
        },
        { kind: "block", type: "controls_whileUntil", inputs: { BOOL: booleanInput() } },
        { kind: "block", type: "controls_flow_statements" },
      ],
    },
  ],
};
