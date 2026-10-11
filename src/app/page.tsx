export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-start px-6 py-10 text-center sm:justify-center sm:py-24">
      <div className="max-w-2xl space-y-6">
        <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-800">
          Oficina de Integração 2 — ELLP UTFPR
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          #Code Blocks Arduino
        </h1>
        <p className="text-lg text-slate-600">
          Aprenda os fundamentos de algoritmos através de programação visual em blocos com tradução
          simultânea para código Arduino (C/C++).
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/workspace"
            className="rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-teal-700 transition"
          >
            Abrir Workspace
          </a>
        </div>
      </div>
    </main>
  );
}
