"use client";

import * as React from "react";
import { Check, Code2, Copy, Sparkles } from "lucide-react";
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
    <section aria-labelledby={titleId} className="playground-panel playground-code-panel">
      <header className="playground-panel-header playground-code-header">
        <span className="panel-step lilac" aria-hidden="true">
          <Code2 size={24} />
        </span>
        <div className="panel-heading">
          <h2 id={titleId}>Olha o seu código!</h2>
          <p>Seus blocos na língua do Arduino.</p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          disabled={!code}
          aria-label="Copiar código"
          className="playground-copy-button"
        >
          {status === "copied" ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          {status === "copied" ? "Copiado!" : "Copiar"}
        </button>
      </header>
      <div
        role="region"
        aria-label="Código Arduino C++"
        tabIndex={0}
        className="playground-code-source"
      >
        <pre aria-hidden="true" data-testid="line-numbers" className="playground-line-numbers">
          {Array.from({ length: lineCount }, (_, index) => index + 1).join("\n")}
        </pre>
        <pre className="playground-code-text">
          <code>{highlightCpp(code)}</code>
        </pre>
      </div>
      <div className="playground-code-footer">
        {status === "error" ? (
          <p role="alert" className="text-amber-900">
            Não foi possível copiar. Selecione o código e copie manualmente.
          </p>
        ) : (
          <p role="status">
            <Sparkles size={15} aria-hidden="true" />
            {status === "copied" ? "Código copiado" : "Mexeu nos blocos? Seu código muda junto!"}
          </p>
        )}
      </div>
    </section>
  );
}
