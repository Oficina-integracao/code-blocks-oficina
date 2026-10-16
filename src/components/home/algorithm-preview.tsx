import React from "react";
import { ArrowDown, Code2 } from "lucide-react";

const exampleCode = `int contador = 0;

void setup() {}

void loop() {
  for (int i = 0; i < 3; i++) {
    contador += 1;
  }
}`;

export function AlgorithmPreview() {
  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="text-sm font-semibold text-slate-800">
          Uma ideia, duas formas de escrever
        </span>
        <Code2 size={20} className="shrink-0 text-arduino-dark" aria-hidden="true" />
      </div>
      <div className="px-5 py-5 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Blocos visuais
        </p>
        <div className="space-y-2 text-sm font-medium">
          <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 px-4 py-2.5 text-teal-900">
            definir contador = 0
          </div>
          <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 px-4 py-2.5 text-amber-900">
            repetir 3 vezes
            <div className="mt-2 rounded-md bg-white px-3 py-2 text-teal-900">
              alterar contador em 1
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 border-y border-slate-100 bg-slate-50 py-2 text-xs text-slate-500">
        <ArrowDown size={14} aria-hidden="true" />A mesma lógica em C/C++
      </div>
      <div className="bg-slate-900 px-5 py-5 sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
          Arduino
        </p>
        <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-100 sm:text-sm">
          <code>{exampleCode}</code>
        </pre>
      </div>
      <figcaption className="px-5 py-3 text-xs leading-relaxed text-slate-500">
        Exemplo ilustrativo: uma variável e uma repetição, dos blocos ao código.
      </figcaption>
    </figure>
  );
}
