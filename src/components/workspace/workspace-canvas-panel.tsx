"use client";

import * as React from "react";
import { ArrowLeft, Puzzle, Sparkles } from "lucide-react";
import BlocklyWorkspace, { type BlocklyWorkspaceProps } from "./blockly-workspace";

export default function WorkspaceCanvasPanel({
  blockCount,
  onReady,
  onChange,
}: BlocklyWorkspaceProps & { blockCount: number }) {
  return (
    <section aria-labelledby="blocks-title" className="playground-panel playground-blocks-panel">
      <header className="playground-panel-header playground-blocks-header">
        <span className="panel-step peach" aria-hidden="true">
          <Puzzle size={24} />
        </span>
        <div className="panel-heading">
          <h2 id="blocks-title">Monte sua ideia</h2>
          <p>O que vamos inventar hoje?</p>
        </div>
        <span className="block-count" aria-live="polite">
          {blockCount} {blockCount === 1 ? "bloco" : "blocos"}
        </span>
      </header>
      <div className="playground-canvas">
        <BlocklyWorkspace onReady={onReady} onChange={onChange} />
        {blockCount === 0 && (
          <div className="playground-empty">
            <div className="playground-empty-card">
              <span className="empty-puzzle">
                <Puzzle size={35} aria-hidden="true" />
                <Sparkles size={17} aria-hidden="true" />
              </span>
              <h3>Seu primeiro bloco mora aqui!</h3>
              <p>Escolha uma categoria ao lado e arraste uma peça para cá.</p>
              <span className="empty-arrow">
                <ArrowLeft size={17} aria-hidden="true" /> Vamos começar?
              </span>
            </div>
          </div>
        )}
      </div>
      <footer className="playground-canvas-footer">
        <Sparkles size={15} aria-hidden="true" /> Pode experimentar. É assim que a gente aprende!
      </footer>
    </section>
  );
}
