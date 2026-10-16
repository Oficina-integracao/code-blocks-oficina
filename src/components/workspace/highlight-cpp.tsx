import * as React from "react";

const KEYWORD =
  /^(?:void|int|float|double|bool|boolean|String|char|long|short|if|else|for|while|do|break|continue|return|true|false|NULL)$/;
const TOKENS =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:void|int|float|double|bool|boolean|String|char|long|short|if|else|for|while|do|break|continue|return|true|false|NULL)\b|\b\d+(?:\.\d+)?\b)/g;

function tokenColor(token: string): string | undefined {
  if (token.startsWith("//") || token.startsWith("/*")) return "text-emerald-700";
  if (/^["']/.test(token)) return "text-amber-800";
  if (/^\d/.test(token)) return "text-violet-700";
  if (KEYWORD.test(token)) return "text-sky-700";
}

/** React escapes source text, including text inside strings and comments. */
export function highlightCpp(code: string): React.ReactNode[] {
  return code.split(TOKENS).map((token, index) => (
    <span key={index} className={tokenColor(token)}>
      {token}
    </span>
  ));
}
