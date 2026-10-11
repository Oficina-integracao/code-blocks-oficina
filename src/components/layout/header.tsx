"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstitutionalLogos } from "@/components/layout/institutional-logos";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white" onKeyDown={handleKeyDown}>
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6 lg:grid-cols-[auto_auto_1fr] lg:gap-x-6">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="justify-self-start rounded-md text-base font-bold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          Code Blocks <span className="text-arduino-dark">Arduino</span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-3 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <div className="col-span-2 flex justify-center lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <InstitutionalLogos />
        </div>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={cn(
            "col-span-2 flex-col gap-2 border-t border-slate-100 pt-3 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:flex lg:flex-row lg:items-center lg:justify-self-end lg:border-0 lg:pt-0",
            isOpen ? "flex" : "hidden",
          )}
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 aria-[current=page]:text-arduino-dark"
          >
            Início
          </Link>
          <Link
            href="/workspace"
            aria-current={pathname === "/workspace" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-arduino-dark px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Acessar Workspace
          </Link>
        </nav>
      </div>
    </header>
  );
}
