import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as Blockly from "blockly";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";
import WorkspacePage from "@/app/workspace/page";
import type { BlocklyWorkspaceProps } from "@/components/workspace/blockly-workspace";

const canvas = vi.hoisted(() => ({ props: {} as BlocklyWorkspaceProps }));
vi.mock("@/components/workspace/blockly-workspace", () => ({
  default: (props: BlocklyWorkspaceProps) => {
    canvas.props = props;
    return null;
  },
}));

describe("Live workspace page integration (T024)", () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    workspace = new Blockly.Workspace();
    new ArduinoGenerator();
  });

  afterEach(() => {
    cleanup();
    workspace.dispose();
    vi.restoreAllMocks();
  });

  function ready() {
    act(() => canvas.props.onReady?.(workspace as Blockly.WorkspaceSvg));
  }

  function change() {
    act(() => canvas.props.onChange?.(workspace as Blockly.WorkspaceSvg));
  }

  it("generates the initial Arduino skeleton as soon as the canvas is ready", () => {
    const { container } = render(<WorkspacePage />);
    ready();
    expect(container.querySelector("code")?.textContent).toContain("void setup() {");
    expect(container.querySelector("code")?.textContent).toContain("void loop() {");
  });

  it("updates the preview synchronously when a student inserts, edits, or deletes blocks", () => {
    const { container } = render(<WorkspacePage />);
    ready();
    expect(screen.getByText("Seu primeiro bloco mora aqui!")).toBeInTheDocument();
    const declaration = workspace.newBlock("variables_declare");
    declaration.setFieldValue("velocidade", "VAR");
    const number = workspace.newBlock("math_number");
    number.setFieldValue("100", "NUM");
    declaration.getInput("VALUE")!.connection!.connect(number.outputConnection!);
    change();
    expect(screen.queryByText("Seu primeiro bloco mora aqui!")).not.toBeInTheDocument();
    expect(screen.getByText("2 blocos")).toBeInTheDocument();
    expect(container.querySelector("code")?.textContent).toContain("int velocidade = 100;");
    number.setFieldValue("80", "NUM");
    change();
    expect(container.querySelector("code")?.textContent).toContain("int velocidade = 80;");
    declaration.dispose();
    change();
    expect(container.querySelector("code")?.textContent).not.toContain("velocidade");
    expect(screen.getByText("Seu primeiro bloco mora aqui!")).toBeInTheDocument();
  });

  it("shows generator diagnostics and clears them after the invalid block is removed", () => {
    render(<WorkspacePage />);
    ready();
    const invalid = workspace.newBlock("controls_flow_statements");
    change();
    expect(screen.getByRole("alert")).toHaveTextContent("precisa ficar dentro de uma repetição");
    invalid.dispose();
    change();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears stale source on unexpected failures and recovers after another edit", () => {
    const { container } = render(<WorkspacePage />);
    ready();
    vi.spyOn(ArduinoGenerator.prototype, "generateCode").mockImplementationOnce(() => {
      throw new Error("private internal details");
    });
    change();
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível gerar");
    expect(screen.queryByText("private internal details")).not.toBeInTheDocument();
    expect(container.querySelector("code")?.textContent).toBe("");
    change();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(container.querySelector("code")?.textContent).toContain("void loop()");
  });
});
