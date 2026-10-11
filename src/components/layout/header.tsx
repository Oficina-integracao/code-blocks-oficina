"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blocks, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-arduino-light text-arduino-dark">
            <Blocks size={20} aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            Code Blocks <span className="text-arduino-dark">Arduino</span>
          </span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="main-navigation"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-3 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 md:hidden"
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={cn(
            "w-full flex-col gap-2 border-t border-slate-100 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:border-0 md:pt-0",
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
