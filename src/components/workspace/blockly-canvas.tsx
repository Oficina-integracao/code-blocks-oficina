"use client";

import * as React from "react";
import * as Blockly from "blockly";
import Portuguese from "blockly/msg/pt-br";
import { defineVariableBlocks } from "@/core/generator/blocks/variables";
import { toolbox } from "@/core/generator/toolbox";
import type { BlocklyWorkspaceProps } from "./blockly-workspace";

export default function BlocklyCanvas({ onReady, onChange }: BlocklyWorkspaceProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const callbacks = React.useRef({ onReady, onChange });
  callbacks.current = { onReady, onChange };

  React.useEffect(() => {
    if (!container.current) return;
    Blockly.setLocale(Portuguese);
    defineVariableBlocks();
    const workspace = Blockly.inject(container.current, {
      toolbox,
      media: "/blockly/media/",
      sounds: false,
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 0.9 },
      grid: { spacing: 24, length: 2, colour: "#cbd5e1", snap: false },
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
      className="relative h-full min-h-[28rem] w-full overflow-hidden"
    />
  );
}
