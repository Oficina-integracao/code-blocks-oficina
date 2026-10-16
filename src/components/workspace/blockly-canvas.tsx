"use client";

import * as React from "react";
import * as Blockly from "blockly";
import * as Portuguese from "blockly/msg/pt-br";
import { defineVariableBlocks } from "@/core/generator/blocks/variables";
import { createPlaygroundTheme, playgroundToolbox } from "./playground-theme";
import type { BlocklyWorkspaceProps } from "./blockly-workspace";

export default function BlocklyCanvas({ onReady, onChange }: BlocklyWorkspaceProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const callbacks = React.useRef({ onReady, onChange });
  callbacks.current = { onReady, onChange };

  React.useEffect(() => {
    if (!container.current) return;
    const messages = Object.entries(Portuguese).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    );
    Blockly.setLocale(Object.fromEntries(messages));
    defineVariableBlocks();
    const workspace = Blockly.inject(container.current, {
      toolbox: playgroundToolbox,
      theme: createPlaygroundTheme(),
      renderer: "zelos",
      media: "/blockly/media/",
      sounds: false,
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 0.9 },
      grid: { spacing: 26, length: 2, colour: "#ded1ed", snap: false },
    });
    const handleChange = (event: Blockly.Events.Abstract) => {
      if (!event.isUiEvent) callbacks.current.onChange?.(workspace);
    };
    const resize = () => Blockly.svgResize(workspace);
    const observer = new ResizeObserver(resize);
    observer.observe(container.current);
    workspace.addChangeListener(handleChange);
    resize();
    callbacks.current.onReady?.(workspace);

    return () => {
      workspace.removeChangeListener(handleChange);
      observer.disconnect();
      workspace.dispose();
    };
  }, []);

  return (
    <div
      ref={container}
      role="region"
      aria-label="Área de blocos"
      className="relative h-full min-h-[20rem] w-full overflow-hidden"
    />
  );
}
