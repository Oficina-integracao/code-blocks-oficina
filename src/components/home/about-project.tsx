import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutProject() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:py-16 md:grid-cols-[1fr_2fr] md:gap-12">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-arduino-dark">
          ELLP + UTFPR
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Tecnologia a serviço do aprendizado.
        </h2>
      </div>
      <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
        <p>
          O Code Blocks Arduino é um projeto acadêmico da disciplina Oficina de Integração 2,
          associado ao ELLP — Ensino Lúdico de Lógica e Programação — da Universidade Tecnológica
          Federal do Paraná.
        </p>
        <p>
          A proposta é apoiar quem está começando: tornar a lógica visível e aproximar a programação
          em blocos da escrita de código, com foco nos fundamentos de algoritmos.
        </p>
        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 rounded-md font-semibold text-arduino-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          Começar no Workspace <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
