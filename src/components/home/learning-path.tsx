import React from "react";

const steps = [
  {
    title: "Monte sua ideia",
    description:
      "Escolha e conecte os blocos no Workspace para construir a sequência do seu algoritmo.",
  },
  {
    title: "Entenda o código",
    description:
      "Acompanhe o C/C++ correspondente e perceba o que muda quando você altera os blocos.",
  },
  {
    title: "Explore com Arduino",
    description: "Leve o código para a IDE do Arduino para compilar e enviar à sua placa.",
  },
];

const concepts = ["Sequências", "Variáveis", "Operadores", "Condicionais", "Repetições"];

export function LearningPath() {
  return (
    <section id="como-funciona" className="scroll-mt-6 border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-arduino-dark">
          Como funciona
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Construa. Observe. Aprenda.
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-teal-100 pt-5">
              <span className="text-sm font-semibold text-arduino-dark">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-700">
            Os fundamentos que você vai praticar
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {concepts.map((concept) => (
              <li
                key={concept}
                className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600"
              >
                {concept}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
