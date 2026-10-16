import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Blocks, Code2, Hand, Puzzle, Sparkles } from "lucide-react";
import WorkspaceMascot from "./workspace-mascot";

const steps = [
  { icon: Puzzle, label: "Escolha um bloco", color: "peach" },
  { icon: Hand, label: "Arraste e encaixe", color: "mint" },
  { icon: Code2, label: "Veja seu código!", color: "lilac" },
];

export default function WorkspaceIntro() {
  return (
    <header>
      <nav className="playground-nav" aria-label="Navegação do workspace">
        <Link href="/" className="playground-brand">
          <span className="playground-brand-icon">
            <Blocks size={25} aria-hidden="true" />
          </span>
          <span>
            Code Blocks <span className="playground-brand-arduino">Arduino</span>
          </span>
        </Link>
        <Link href="/" className="playground-back">
          <ArrowLeft size={16} aria-hidden="true" /> Início
        </Link>
      </nav>
      <div className="playground-hero">
        <div>
          <p className="playground-eyebrow">
            <Sparkles size={17} aria-hidden="true" /> Um espaço para imaginar e inventar
          </p>
          <h1>
            Pequenos blocos,
            <br />
            <span>grandes ideias!</span>
          </h1>
          <p className="playground-description">
            Junte as peças, solte a imaginação e descubra o que você consegue criar.
          </p>
        </div>
        <WorkspaceMascot />
      </div>
      <ol className="playground-steps" aria-label="Como criar seu algoritmo">
        {steps.map(({ icon: Icon, label, color }, index) => (
          <li key={label} className={`playground-step ${color}`}>
            <span className="playground-step-number">{index + 1}</span>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </li>
        ))}
      </ol>
    </header>
  );
}
