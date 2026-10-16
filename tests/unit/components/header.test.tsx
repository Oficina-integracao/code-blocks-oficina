import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

afterEach(cleanup);

describe("Header", () => {
  it("identifies the project and provides the main navigation destinations", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: /Code Blocks Arduino/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Acessar Workspace" })).toHaveAttribute(
      "href",
      "/workspace",
    );
  });

  it("opens and closes the mobile navigation using its toggle", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Fechar menu");
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toHaveAttribute(
      "id",
      toggle.getAttribute("aria-controls"),
    );
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns keyboard focus to the toggle", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(toggle);
    const home = screen.getByRole("link", { name: "Início" });
    home.focus();

    fireEvent.keyDown(home, { key: "Escape" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes the mobile navigation when a destination is selected", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(toggle);

    fireEvent.click(screen.getByRole("link", { name: "Início" }));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
