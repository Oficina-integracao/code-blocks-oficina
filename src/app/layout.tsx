import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Blocks Arduino | ELLP UTFPR",
  description:
    "Plataforma educacional para transição da lógica visual em blocos para código Arduino C/C++.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
