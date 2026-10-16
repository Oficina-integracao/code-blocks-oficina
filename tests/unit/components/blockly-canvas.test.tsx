import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type * as Blockly from "blockly";
import BlocklyCanvas from "@/components/workspace/blockly-canvas";

const mocks = vi.hoisted(() => ({
  inject: vi.fn(),
  resize: vi.fn(),
  locale: vi.fn(),
  defineBlocks: vi.fn(),
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("blockly", () => ({
  inject: mocks.inject,
  svgResize: mocks.resize,
  setLocale: mocks.locale,
}));
vi.mock("blockly/msg/pt-br", () => ({
  default: {},
  CONTROLS_REPEAT_TITLE: "repita %1 vezes",
}));
vi.mock("@/core/generator/blocks/variables", () => ({
  defineVariableBlocks: mocks.defineBlocks,
}));
vi.mock("@/components/workspace/playground-theme", () => ({
  createPlaygroundTheme: () => ({}),
  playgroundToolbox: {},
}));

describe("Blockly canvas lifecycle (T022)", () => {
  let listener: (event: { isUiEvent: boolean }) => void;
  let resize: ResizeObserverCallback;
  const workspace = {
    addChangeListener: vi.fn((callback) => {
      listener = callback;
    }),
    removeChangeListener: vi.fn(),
    dispose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.inject.mockReturnValue(workspace);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = callback;
        }
        observe = mocks.observe;
        disconnect = mocks.disconnect;
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("defines custom blocks before injection and reports the ready workspace", () => {
    const onReady = vi.fn();
    render(<BlocklyCanvas onReady={onReady} />);
    expect(mocks.locale).toHaveBeenCalledWith({ CONTROLS_REPEAT_TITLE: "repita %1 vezes" });
    expect(mocks.defineBlocks.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.inject.mock.invocationCallOrder[0],
    );
    expect(onReady).toHaveBeenCalledWith(workspace);
    expect(mocks.observe).toHaveBeenCalledWith(mocks.inject.mock.calls[0][0]);
    act(() => resize([], {} as ResizeObserver));
    expect(mocks.resize).toHaveBeenCalledWith(workspace);
  });

  it("reports block edits while ignoring selection and other UI-only events", () => {
    const onChange = vi.fn();
    render(<BlocklyCanvas onChange={onChange} />);
    act(() => listener({ isUiEvent: true }));
    expect(onChange).not.toHaveBeenCalled();
    act(() => listener({ isUiEvent: false }));
    expect(onChange).toHaveBeenCalledWith(workspace);
  });

  it("uses the latest callback without resetting the student's blocks", () => {
    const previous = vi.fn();
    const next = vi.fn();
    const { rerender } = render(<BlocklyCanvas onChange={previous} />);
    rerender(<BlocklyCanvas onChange={next} />);
    act(() => listener({ isUiEvent: false }));
    expect(previous).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(workspace as unknown as Blockly.WorkspaceSvg);
    expect(mocks.inject).toHaveBeenCalledTimes(1);
  });

  it("removes listeners, resize observation, and the SVG workspace on unmount", () => {
    const { unmount } = render(<BlocklyCanvas />);
    unmount();
    expect(workspace.removeChangeListener).toHaveBeenCalledWith(listener);
    expect(mocks.disconnect).toHaveBeenCalledOnce();
    expect(workspace.dispose).toHaveBeenCalledOnce();
  });
});
