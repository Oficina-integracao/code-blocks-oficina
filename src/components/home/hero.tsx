import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AlgorithmPreview } from "@/components/home/algorithm-preview";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-arduino-dark">
          Aprenda programação, uma ideia de cada vez
        </p>
        <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Da lógica em blocos ao <span className="text-arduino-dark">código Arduino.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Conecte blocos, construa algoritmos e descubra como cada decisão se transforma em C/C++.
          Um primeiro passo para aprender a programar, mesmo começando do zero.
        </p>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-arduino-dark px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Acessar Workspace <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a
            href="#como-funciona"
            className="rounded-md py-2 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-arduino-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Como funciona
          </a>
        </div>
        <p className="mt-7 text-xs leading-5 text-slate-500">
          Code Blocks Arduino · Uma iniciativa educacional do ELLP / UTFPR
        </p>
      </div>
      <AlgorithmPreview />
    </section>
  );
}
