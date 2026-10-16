import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import WorkspaceEditor from "@/components/workspace/workspace-editor";

export const metadata: Metadata = {
  title: "Workspace | Code Blocks Arduino",
  description: "Monte algoritmos em blocos e acompanhe a tradução para código Arduino C/C++.",
};

export default function WorkspacePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded text-sm text-slate-600 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Code Blocks Arduino
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              Laboratório de algoritmos
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Do bloco ao código.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Escolha uma categoria e conecte os blocos. Acompanhe seu algoritmo ganhar forma em
              C/C++.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800">
            <Sparkles size={14} aria-hidden="true" />
            Código em tempo real
          </span>
        </div>
      </header>
      <WorkspaceEditor />
    </main>
  );
}
