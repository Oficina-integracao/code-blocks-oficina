"use client";

import * as React from "react";
import type { WorkspaceSvg } from "blockly";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";
import type { ArduinoCodeResult } from "@/core/domain/entities/generator";
import WorkspaceCanvasPanel from "./workspace-canvas-panel";
import CodeViewer from "./code-viewer";

export default function WorkspaceEditor() {
  const generator = React.useRef<ArduinoGenerator | null>(null);
  const [result, setResult] = React.useState<ArduinoCodeResult | null>(null);
  const [failure, setFailure] = React.useState<string | null>(null);
  const [blockCount, setBlockCount] = React.useState(0);

  const updateCode = React.useCallback((workspace: WorkspaceSvg) => {
    setBlockCount(workspace.getAllBlocks(false).filter((block) => !block.isShadow()).length);
    try {
      generator.current ??= new ArduinoGenerator();
      setResult(generator.current.generateCode(workspace));
      setFailure(null);
    } catch {
      setResult(null);
      setFailure("Não foi possível gerar o código desta vez. Confira os encaixes e tente de novo.");
    }
  }, []);
  const errors = failure
    ? [failure]
    : (result?.errors ?? []).map((error) =>
        error.includes("break/continue")
          ? "O bloco de sair ou continuar precisa ficar dentro de uma repetição. Vamos encaixar?"
          : "Um dos blocos precisa de um ajuste. Confira as peças e tente de novo.",
      );

  return (
    <>
      {errors.length > 0 && (
        <div role="alert" className="playground-notice">
          <p className="font-bold">Vamos tentar de outro jeito?</p>
          <ul className="mt-1 list-inside list-disc">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="playground-editor">
        <WorkspaceCanvasPanel blockCount={blockCount} onReady={updateCode} onChange={updateCode} />
        <CodeViewer code={result?.code ?? ""} />
      </div>
    </>
  );
}
