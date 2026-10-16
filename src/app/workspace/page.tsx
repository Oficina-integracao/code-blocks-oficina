import * as React from "react";
import type { Metadata } from "next";
import { Heart } from "lucide-react";
import WorkspaceEditor from "@/components/workspace/workspace-editor";
import WorkspaceIntro from "@/components/workspace/workspace-intro";
import "./workspace.css";

export const metadata: Metadata = {
  title: "Workspace | Code Blocks Arduino",
  description: "Monte algoritmos em blocos e acompanhe a tradução para código Arduino C/C++.",
};

export default function WorkspacePage() {
  return (
    <main className="kid-workspace">
      <div className="playground-shell">
        <WorkspaceIntro />
        <WorkspaceEditor />
        <p className="playground-encouragement">
          <Heart size={15} aria-hidden="true" />
          Aqui, tentar de novo faz parte da diversão.
        </p>
      </div>
    </main>
  );
}
