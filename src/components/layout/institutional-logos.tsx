import React from "react";
import Image from "next/image";

export function InstitutionalLogos() {
  return (
    <div className="flex shrink-0 items-center justify-center gap-6 sm:gap-8">
      <Image
        src="/images/logo-ellp.png"
        alt="ELLP — Ensino Lúdico de Lógica e Programação"
        width={300}
        height={216}
        className="h-auto w-24"
      />
      <Image
        src="/images/logo-utfpr.png"
        alt="UTFPR — Universidade Tecnológica Federal do Paraná"
        width={1024}
        height={407}
        className="h-auto w-36"
      />
    </div>
  );
}
