import { SITE_URL } from "@/lib/site";

// Cada demo dice claramente que el negocio es ficticio y quién la hizo.
// En el celular se oculta (tapaba el buscador) y el crédito va en el pie de página.
export default function ConceptBadge() {
  return (
    <a
      href={SITE_URL}
      className="fixed bottom-3 left-3 z-[60] hidden sm:inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3.5 py-2 text-[12px] leading-none text-black/75 backdrop-blur-md transition-transform duration-500 hover:-translate-y-0.5 sm:bottom-5 sm:left-5"
    >
      <span className="size-1.5 rounded-full bg-[#ff5a14]" />
      Proyecto concepto · hecho por <span className="font-semibold">Andrés Benítez</span>
    </a>
  );
}
