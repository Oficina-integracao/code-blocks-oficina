"use client";

import * as React from "react";
import { Blocks } from "lucide-react";
import type { WorkspaceSvg } from "blockly";
import { ArduinoGenerator } from "@/core/generator/arduino-generator";
import type { ArduinoCodeResult } from "@/core/domain/entities/generator";
import BlocklyWorkspace from "./blockly-workspace";
import CodeViewer from "./code-viewer";

export default function WorkspaceEditor() {
  const generator = React.useRef<ArduinoGenerator | null>(null);
  const [result, setResult] = React.useState<ArduinoCodeResult | null>(null);
  const [failure, setFailure] = React.useState<string | null>(null);

  const updateCode = React.useCallback((workspace: WorkspaceSvg) => {
    try {
      generator.current ??= new ArduinoGenerator();
      setResult(generator.current.generateCode(workspace));
      setFailure(null);
    } catch {
      setResult(null);
      setFailure("Não foi possível gerar o código. Revise os blocos e tente novamente.");
    }
  }, []);
  const errors = failure ? [failure] : (result?.errors ?? []);

  return (
    <>
      {errors.length > 0 && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <p className="font-semibold">Confira seu algoritmo</p>
          <ul className="mt-1 list-inside list-disc">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-5 lg:h-[calc(100vh-15rem)] lg:min-h-[36rem] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="blocks-title"
          className="flex h-[34rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[40rem] lg:h-full"
        >
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
              <Blocks size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="blocks-title" className="font-semibold text-slate-900">
                Seu algoritmo
              </h2>
              <p className="mt-1 text-xs text-slate-500">Arraste, conecte e experimente.</p>
            </div>
          </header>
          <div className="min-h-0 flex-1">
            <BlocklyWorkspace onReady={updateCode} onChange={updateCode} />
          </div>
        </section>
        <div className="h-[34rem] min-w-0 overflow-hidden rounded-2xl border border-slate-800 shadow-sm sm:h-[40rem] lg:h-full">
          <CodeViewer code={result?.code ?? ""} />
        </div>
      </div>
    </>
  );
}
