import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";

afterEach(cleanup);

describe("Home page", () => {
  it("provides a main heading and workspace entry points for beginners", () => {
    render(<HomePage />);
    const main = screen.getByRole("main");

    expect(within(main).getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(within(main).getByRole("link", { name: "Acessar Workspace" })).toHaveAttribute(
      "href",
      "/workspace",
    );
    expect(within(main).getByRole("link", { name: "Começar no Workspace" })).toHaveAttribute(
      "href",
      "/workspace",
    );
  });

  it("connects the how-it-works link to the explanation on the same page", () => {
    render(<HomePage />);
    const link = screen.getByRole("link", { name: "Como funciona" });
    const href = link.getAttribute("href");

    expect(href).toMatch(/^#.+/);
    const destination = document.getElementById(href!.slice(1));
    expect(destination).not.toBeNull();
    expect(within(destination!).getByRole("heading", { level: 2 })).toBeVisible();
    expect(within(destination!).getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0);
  });
});
