import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CodeViewer from "@/components/workspace/code-viewer";

describe("Arduino code viewer (T023)", () => {
  const writeText = vi.fn();
  const code = "void setup() {\n  int velocidade = 100; // exemplo\n}\n";

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(cleanup);

  it("shows the exact source as selectable read-only text, with syntax colors and line numbers", () => {
    const { container } = render(<CodeViewer code={code} />);
    expect(container.querySelector("code")?.textContent).toBe(code);
    expect(container.querySelector("textarea, input, [contenteditable=true]")).toBeNull();
    expect(screen.getByLabelText("Código Arduino C++")).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("void")).toHaveClass("text-sky-300");
    expect(screen.getByText("100")).toHaveClass("text-violet-300");
    expect(screen.getByText("// exemplo")).toHaveClass("text-emerald-300");
    expect(screen.getByTestId("line-numbers").textContent).toBe("1\n2\n3");
  });

  it("copies the original source and confirms success only after the clipboard accepts it", async () => {
    render(<CodeViewer code={code} />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Código copiado"));
    expect(writeText).toHaveBeenCalledWith(code);
  });

  it("reports clipboard failure while keeping the source available for manual copying", async () => {
    writeText.mockRejectedValue(new Error("Permission denied"));
    const { container } = render(<CodeViewer code={code} />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("copie manualmente");
    expect(container.querySelector("code")?.textContent).toBe(code);
  });

  it("clears old copy feedback when the generated program changes", async () => {
    const { rerender } = render(<CodeViewer code={code} />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar código" }));
    await screen.findByText("Código copiado");
    rerender(<CodeViewer code="void loop() {}\n" />);
    expect(screen.queryByText("Código copiado")).not.toBeInTheDocument();
  });

  it("renders HTML-like source as text without creating executable markup", () => {
    const source = 'String texto = "<img src=x onerror=alert(1)>";';
    const { container } = render(<CodeViewer code={source} />);
    expect(container.querySelector("code")?.textContent).toBe(source);
    expect(container.querySelector("img, script")).toBeNull();
  });
});
