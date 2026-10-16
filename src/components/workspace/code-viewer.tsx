"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { highlightCpp } from "./highlight-cpp";

export default function CodeViewer({ code }: { code: string }) {
  const titleId = React.useId();
  const [feedback, setFeedback] = React.useState<{
    code: string;
    status: "copied" | "error";
  } | null>(null);
  const status = feedback?.code === code ? feedback.status : null;
  const lineCount = code.replace(/\n$/, "").split("\n").length;

  React.useEffect(() => {
    if (feedback?.status !== "copied") return;
    const timeout = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  async function copyCode() {
    setFeedback(null);
    try {
      await navigator.clipboard.writeText(code);
      setFeedback({ code, status: "copied" });
    } catch {
      setFeedback({ code, status: "error" });
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className="flex h-full min-w-0 flex-col bg-slate-950 text-slate-100"
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <h2 id={titleId} className="font-semibold">
            Código Arduino
          </h2>
          <p className="mt-1 text-xs text-slate-400">C/C++ · somente leitura</p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          disabled={!code}
          aria-label="Copiar código"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:opacity-50"
        >
          {status === "copied" ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          Copiar
        </button>
      </header>
      <div
        role="region"
        aria-label="Código Arduino C++"
        tabIndex={0}
        className="flex min-h-[22rem] flex-1 overflow-auto py-5 text-sm leading-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
      >
        <pre
          aria-hidden="true"
          data-testid="line-numbers"
          className="select-none border-r border-slate-800 px-4 text-right text-slate-500"
        >
          {Array.from({ length: lineCount }, (_, index) => index + 1).join("\n")}
        </pre>
        <pre className="min-w-0 flex-1 px-5">
          <code>{highlightCpp(code)}</code>
        </pre>
      </div>
      <div className="min-h-12 border-t border-slate-800 px-5 py-3 text-xs">
        {status === "error" ? (
          <p role="alert" className="text-amber-200">
            Não foi possível copiar. Selecione o código e copie manualmente.
          </p>
        ) : (
          <p role="status" className="text-slate-400">
            {status === "copied" ? "Código copiado" : "Copie e cole na IDE do Arduino."}
          </p>
        )}
      </div>
    </section>
  );
}
