import * as Blockly from "blockly";
import { toolbox } from "@/core/generator/toolbox";

const categories = [
  { name: "↕ Passo a passo", colour: "#8756c9" },
  { name: "𝑥 Variáveis", colour: "#c24b86" },
  { name: "＋ Continhas", colour: "#be6b22" },
  { name: "◇ Decisões", colour: "#347ac5" },
  { name: "↻ Repetições", colour: "#278365" },
];

export const playgroundToolbox = {
  ...toolbox,
  contents: toolbox.contents.map((category, index) => ({ ...category, ...categories[index] })),
};

const themeOptions = {
  name: "playground",
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: "#4b89ce",
      colourSecondary: "#3b74b7",
      colourTertiary: "#2c609e",
    },
    math_blocks: {
      colourPrimary: "#be6b22",
      colourSecondary: "#a65b1a",
      colourTertiary: "#914c12",
    },
    loop_blocks: {
      colourPrimary: "#278365",
      colourSecondary: "#207254",
      colourTertiary: "#195c43",
    },
    variable_blocks: {
      colourPrimary: "#bd4a85",
      colourSecondary: "#a53b71",
      colourTertiary: "#8e2d5e",
    },
    text_blocks: {
      colourPrimary: "#8756c9",
      colourSecondary: "#7144b3",
      colourTertiary: "#5d359b",
    },
  },
  componentStyles: {
    workspaceBackgroundColour: "#fffef9",
    toolboxBackgroundColour: "#ffffff",
    toolboxForegroundColour: "#463364",
    flyoutBackgroundColour: "#f3edff",
    flyoutForegroundColour: "#463364",
    flyoutOpacity: 0.98,
    scrollbarColour: "#b6a2cd",
    scrollbarOpacity: 0.45,
    insertionMarkerColour: "#8756c9",
    insertionMarkerOpacity: 0.35,
  },
  fontStyle: { family: '"Trebuchet MS", sans-serif', weight: "bold", size: 13 },
};

export function createPlaygroundTheme(): Blockly.Theme {
  return Blockly.Theme.defineTheme("playground", themeOptions);
}
