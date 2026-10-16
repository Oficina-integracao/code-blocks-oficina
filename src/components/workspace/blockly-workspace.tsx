"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { WorkspaceSvg } from "blockly";

export interface BlocklyWorkspaceProps {
  onReady?: (workspace: WorkspaceSvg) => void;
  onChange?: (workspace: WorkspaceSvg) => void;
}

const BlocklyCanvas = dynamic(() => import("./blockly-canvas"), {
  ssr: false,
  loading: () => (
    <p role="status" className="p-6 text-sm text-slate-500">
      Carregando os blocos…
    </p>
  ),
});

export default function BlocklyWorkspace(props: BlocklyWorkspaceProps) {
  return <BlocklyCanvas {...props} />;
}
