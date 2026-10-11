import { InstitutionalLogos } from "@/components/layout/institutional-logos";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">Aprender, criar e compartilhar.</p>
          <p className="text-xs leading-relaxed text-slate-500">
            Projeto de extensão ELLP · Oficina de Integração 2
          </p>
        </div>
        <InstitutionalLogos />
      </div>
    </footer>
  );
}
