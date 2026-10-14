"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { wa } from "@/lib/site";
import { cop, inmuebles, zonas, precioCorto, type Inmueble, type Op } from "./data";
import Ficha from "./Ficha";
import Calculadora from "./Calculadora";
import HeroSlides from "./HeroSlides";
import Mapa from "./Mapa";
import llaves from "@/public/img/llaves.jpg";
import asesora from "@/public/img/asesora.jpg";
import bogota from "@/public/img/bogota.jpg";
import torres from "@/public/img/torres.jpg";

const PRESUPUESTOS: Record<Op, { label: string; max: number }[]> = {
  venta: [
    { label: "Cualquier precio", max: Infinity },
    { label: "Hasta $500 millones", max: 500_000_000 },
    { label: "Hasta $800 millones", max: 800_000_000 },
    { label: "Hasta $1.200 millones", max: 1_200_000_000 },
  ],
  arriendo: [
    { label: "Cualquier canon", max: Infinity },
    { label: "Hasta $2.500.000", max: 2_500_000 },
    { label: "Hasta $4.000.000", max: 4_000_000 },
    { label: "Hasta $7.000.000", max: 7_000_000 },
  ],
};

const ORDEN = {
  recientes: "Más recientes",
  menor: "Menor precio",
  mayor: "Mayor precio",
  area: "Mayor área",
} as const;
type Orden = keyof typeof ORDEN;

const PASOS: Record<Op, { t: string; quien: string; d: string; recibe: string }[]> = {
  venta: [
    { t: "Conversación inicial", quien: "Su asesor", d: "Definimos zona, presupuesto, cuota inicial y si necesita crédito. Sin esto, cualquier visita es tiempo perdido.", recibe: "Una lista corta de inmuebles que sí cumplen" },
    { t: "Visitas acompañadas", quien: "Su asesor", d: "Vamos con usted. Revisamos humedades, ruido, luz, parqueadero y lo que no sale en las fotos.", recibe: "Una ficha con lo bueno y lo malo de cada visita" },
    { t: "Estudio de títulos", quien: "Abogado de Zaguán", d: "Revisamos el certificado de tradición y libertad, embargos, hipotecas, impuestos y la cadena de propietarios de los últimos 20 años.", recibe: "Un concepto jurídico por escrito" },
    { t: "Negociación y promesa", quien: "Su asesor y el abogado", d: "Negociamos precio y fechas, y redactamos la promesa de compraventa con las cláusulas que lo protegen a usted.", recibe: "La promesa revisada antes de firmar" },
    { t: "Crédito y avalúo", quien: "Su asesor", d: "Comparamos ofertas de bancos, radicamos los documentos y acompañamos la visita del avaluador.", recibe: "La aprobación del crédito" },
    { t: "Notaría y entrega", quien: "Su asesor", d: "Firma de la escritura, registro en la Oficina de Instrumentos Públicos y entrega del inmueble con inventario.", recibe: "Las llaves y el acta de entrega" },
  ],
  arriendo: [
    { t: "Búsqueda a su medida", quien: "Su asesor", d: "Canon máximo, zona, mascotas, parqueadero y fecha de mudanza. Le mostramos solo lo que cumple.", recibe: "Opciones disponibles esa misma semana" },
    { t: "Visitas acompañadas", quien: "Su asesor", d: "Vamos con usted y le contamos cuánto se paga de administración y servicios en ese edificio.", recibe: "Costos reales del mes, no solo el canon" },
    { t: "Estudio de arrendamiento", quien: "Zaguán con la aseguradora", d: "Estudio con póliza de arrendamiento: en la mayoría de casos no necesita codeudor con finca raíz.", recibe: "Respuesta en 24 a 48 horas hábiles" },
    { t: "Contrato y entrega", quien: "Su asesor", d: "Contrato firmado desde el celular y entrega con inventario fotográfico, para que nadie le cobre daños que no hizo.", recibe: "Las llaves y el inventario firmado" },
  ],
};

const GARANTIAS = [
  ["Estudio de títulos", "en cada compra, antes de que usted pague"],
  ["Un solo asesor", "del primer mensaje a la entrega de llaves"],
  ["Visitas de lunes a sábado", "en el horario que a usted le sirve"],
  ["Contratos digitales", "firmados desde el celular"],
];

const SERVICIOS = [
  ["Avalúo comercial", "Cuánto vale su inmueble hoy, con comparables reales de la zona."],
  ["Fotos y video profesionales", "Su inmueble se ve como es en su mejor día, no con fotos de celular."],
  ["Publicación en portales y redes", "Fincaraíz, Metrocuadrado, Ciencuadras, Instagram y nuestra base de clientes."],
  ["Filtro de interesados", "Solo visitan personas con presupuesto y crédito verificados."],
  ["Contrato y póliza", "Estudio del inquilino y póliza que cubre el canon si deja de pagar."],
  ["Pago puntual", "Si lo administramos, el canon llega a su cuenta los primeros días de cada mes."],
];

const FAQS = [
  ["¿Cobran por mostrarme inmuebles?", "No. Si usted compra o arrienda, la comisión la paga el propietario. Para usted el acompañamiento no tiene costo."],
  ["¿Qué es el estudio de títulos y por qué importa?", "Es la revisión legal del inmueble antes de pagar un peso: quién es el dueño, si tiene embargos, hipotecas o deudas. Es la principal protección contra estafas y la hacemos en cada compra."],
  ["¿Qué documentos necesito para arrendar?", "Cédula, certificado laboral o extractos si es independiente, y los dos últimos desprendibles de pago. Con eso hacemos el estudio con la aseguradora."],
  ["¿Cuánto cobran por vender o arrendar mi inmueble?", "Venta: 3 % del valor de cierre más IVA, solo si se vende. Arriendo: el primer canon por conseguir el inquilino, y 10 % mensual si además lo administramos."],
  ["¿Me ayudan si ya encontré el inmueble por mi cuenta?", "Sí. Podemos hacer solo el estudio de títulos, la promesa y el acompañamiento a notaría por una tarifa fija."],
];

const POR_PAGINA = 9;

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return s;
}

function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid size-8 place-items-center rounded-[6px] ${claro ? "bg-white text-marca" : "bg-marca text-white"}`} aria-hidden>
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M3 9.5 10 3.5l7 6V17H3z" />
          <path d="M8 17v-5h4v5" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="display block text-[20px] tracking-[-0.02em]">Zaguán</span>
        <span className={`mt-0.5 block text-[11px] ${claro ? "text-white/70" : "text-gris"}`}>Propiedad raíz · Bogotá</span>
      </span>
    </span>
  );
}

function Tarjeta({ i, onOpen }: { i: Inmueble; onOpen: (i: Inmueble) => void }) {
  return (
    <button onClick={() => onOpen(i)} className="group block w-full text-left">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[8px] bg-suave">
        <Image
          src={i.fotos[0]}
          alt={i.titulo}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]"
        />
        <span className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-[4px] bg-white px-2 py-1 text-[12px] font-semibold">{i.op === "venta" ? "Venta" : "Arriendo"}</span>
          {i.nuevo && <span className="rounded-[4px] bg-marca px-2 py-1 text-[12px] font-semibold text-white">Nuevo</span>}
        </span>
        <span className="absolute bottom-3 right-3 rounded-[4px] bg-black/55 px-2 py-1 text-[12px] text-white backdrop-blur">
          {i.fotos.length} fotos
        </span>
      </span>
      <span className="mt-4 block">
        <span className="display block text-[22px]">{precioCorto(i)}</span>
        <span className="mt-0.5 block text-[13.5px] text-gris">
          {i.admin ? `Adm. ${cop(i.admin)}` : "Sin administración"}
        </span>
      </span>
      <span className="mt-2 block text-[15.5px] font-medium leading-snug group-hover:underline group-hover:underline-offset-4">{i.titulo}</span>
      <span className="mt-1 block text-[14px] text-gris">
        {i.barrio}, {i.zona}
      </span>
      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-linea pt-3 text-[13.5px]">
        <span>{i.area} m²</span>
        <span>
          {i.hab} {i.hab === 1 ? "hab." : "habs."}
        </span>
        <span>{i.banos} baños</span>
        {i.parq > 0 && <span>{i.parq} parq.</span>}
        <span className="text-gris">Estrato {i.estrato}</span>
      </span>
    </button>
  );
}

export default function Zaguan() {
  const root = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled();

  const [op, setOp] = useState<Op>("venta");
  const [zona, setZona] = useState<string>("todas");
  const [pres, setPres] = useState(0);
  const [hab, setHab] = useState(0);
  const [orden, setOrden] = useState<Orden>("recientes");
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [abierto, setAbierto] = useState<Inmueble | null>(null);
  const [via, setVia] = useState<Op>("venta");
  const [menu, setMenu] = useState(false);

  const max = PRESUPUESTOS[op][pres]?.max ?? Infinity;
  const lista = useMemo(() => {
    const l = inmuebles.filter((i) => i.op === op && (zona === "todas" || i.zona === zona) && i.precio <= max && i.hab >= hab);
    if (orden === "menor") l.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") l.sort((a, b) => b.precio - a.precio);
    if (orden === "area") l.sort((a, b) => b.area - a.area);
    if (orden === "recientes") l.sort((a, b) => Number(!!b.nuevo) - Number(!!a.nuevo));
    return l;
  }, [op, zona, max, hab, orden]);

  const cambiarOp = (o: Op) => {
    setOp(o);
    setPres(0);
    setVisibles(POR_PAGINA);
  };
  const irA = (sel: string) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.3 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  const cerrar = useCallback(() => setAbierto(null), []);

  const [pOp, setPOp] = useState<"vender" | "arrendar">("vender");
  const [pTipo, setPTipo] = useState("Apartamento");
  const [pBarrio, setPBarrio] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "house" } });
        tl.set("[data-hide]", { visibility: "visible" })
          .from("[data-fade]", { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.08 }, 0.25);
        gsap.utils.toArray<HTMLElement>("[data-rv]").forEach((el) =>
          gsap.from(el, { autoAlpha: 0, y: 28, duration: 1, ease: "house", scrollTrigger: { trigger: el, start: "top 90%" } }),
        );
      });
    },
    { scope: root },
  );

  const nav: [string, string][] = [
    ["Comprar", "#inmuebles"],
    ["Arrendar", "#inmuebles"],
    ["Cómo trabajamos", "#acompanamiento"],
    ["Propietarios", "#propietarios"],
    ["Crédito", "#credito"],
  ];
  const navClick = (t: string) => {
    if (t === "Comprar") cambiarOp("venta");
    if (t === "Arrendar") cambiarOp("arriendo");
    setMenu(false);
  };
  const sobreFoto = !scrolled && !menu;

  return (
    <div ref={root} className="overflow-x-clip">
      {/* Encabezado */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,color,box-shadow] duration-300 ${sobreFoto ? "text-white" : "bg-white text-tinta shadow-[0_1px_0_var(--linea)]"}`}
      >
        <div className="gutter mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4">
          <a href="#" aria-label="Zaguán, inicio" className="inline-flex min-h-11 items-center">
            <Logo claro={sobreFoto} />
          </a>
          <nav className="hidden items-center gap-1 text-[15px] font-medium lg:flex">
            {nav.map(([t, h]) => (
              <a key={t} href={h} onClick={() => navClick(t)} className={`rounded-[6px] px-3 py-2 transition-colors ${sobreFoto ? "hover:bg-white/15" : "hover:bg-suave"}`}>
                {t}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={wa("Hola, quiero hablar con un asesor de Zaguán.")}
              target="_blank"
              rel="noopener"
              className={`hidden h-11 items-center rounded-[6px] px-5 text-[14.5px] font-semibold transition-colors sm:inline-flex ${sobreFoto ? "bg-white text-tinta hover:bg-white/90" : "bg-marca text-white hover:bg-marca-hondo"}`}
            >
              Hablar con un asesor
            </a>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-label="Menú"
              className={`inline-flex h-11 items-center rounded-[6px] border px-4 text-[14px] font-medium lg:hidden ${sobreFoto ? "border-white/40" : "border-linea"}`}
            >
              {menu ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="gutter grid gap-1 border-t border-linea bg-white pb-5 pt-2 lg:hidden">
            {nav.map(([t, h]) => (
              <a key={t} href={h} onClick={() => navClick(t)} className="display border-b border-linea py-3.5 text-[22px]">
                {t}
              </a>
            ))}
            <a
              href={wa("Hola, quiero hablar con un asesor de Zaguán.")}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex h-12 items-center justify-center rounded-[6px] bg-marca text-[15px] font-semibold text-white"
            >
              Hablar con un asesor por WhatsApp
            </a>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section data-hero className="relative">
        <div className="relative h-[92svh] min-h-[640px] overflow-hidden bg-oscuro" data-hide>
          <HeroSlides onOpen={setAbierto} />
          <div className="gutter pointer-events-none relative mx-auto max-w-[1440px] pt-[120px] text-white sm:pt-[132px]">
            <p data-hide data-fade className="text-[15px] font-medium text-white/85">
              Venta y arriendo de vivienda en Bogotá y la Sabana
            </p>
            <h1 data-hide data-fade className="display mt-3 max-w-[760px] text-[clamp(34px,4.3vw,62px)] leading-[1.04]">
              Compre o arriende con un asesor a su lado, de la primera visita a la entrega de llaves.
            </h1>
          </div>
        </div>

        {/* Buscador */}
        <div className="gutter relative z-10 mx-auto -mt-28 max-w-[1440px] sm:-mt-24">
          <div data-hide data-fade className="rounded-[10px] bg-white p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] sm:p-4">
            <div className="flex gap-1" role="tablist" aria-label="Operación">
              {(["venta", "arriendo"] as Op[]).map((o) => (
                <button
                  key={o}
                  role="tab"
                  aria-selected={op === o}
                  onClick={() => cambiarOp(o)}
                  className={`relative h-10 px-4 text-[15px] font-semibold transition-colors ${op === o ? "text-tinta" : "text-gris hover:text-tinta"}`}
                >
                  {o === "venta" ? "Comprar" : "Arrendar"}
                  <span className={`absolute inset-x-4 bottom-0 h-[2px] bg-marca transition-transform duration-300 ${op === o ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="block">
                <span className="mb-1 block px-1 text-[12.5px] text-gris">Zona</span>
                <select
                  value={zona}
                  onChange={(e) => {
                    setZona(e.target.value);
                    setVisibles(POR_PAGINA);
                  }}
                  className="campo h-12 w-full rounded-[6px] border border-linea bg-suave px-4 text-[15px]"
                >
                  <option value="todas">Todas las zonas</option>
                  {zonas.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block px-1 text-[12.5px] text-gris">{op === "venta" ? "Presupuesto" : "Canon mensual"}</span>
                <select
                  value={pres}
                  onChange={(e) => {
                    setPres(Number(e.target.value));
                    setVisibles(POR_PAGINA);
                  }}
                  className="campo h-12 w-full rounded-[6px] border border-linea bg-suave px-4 text-[15px]"
                >
                  {PRESUPUESTOS[op].map((p, k) => (
                    <option key={p.label} value={k}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block px-1 text-[12.5px] text-gris">Habitaciones</span>
                <select
                  value={hab}
                  onChange={(e) => {
                    setHab(Number(e.target.value));
                    setVisibles(POR_PAGINA);
                  }}
                  className="campo h-12 w-full rounded-[6px] border border-linea bg-suave px-4 text-[15px]"
                >
                  <option value={0}>Cualquier cantidad</option>
                  <option value={1}>1 o más</option>
                  <option value={2}>2 o más</option>
                  <option value={3}>3 o más</option>
                  <option value={4}>4 o más</option>
                </select>
              </label>
              <button
                onClick={() => irA("#inmuebles")}
                className="h-12 self-end rounded-[6px] bg-marca px-7 text-[15px] font-semibold text-white transition-colors hover:bg-marca-hondo"
              >
                Ver {lista.length} {lista.length === 1 ? "inmueble" : "inmuebles"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section className="gutter mx-auto max-w-[1440px] pt-12">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-linea pb-12 lg:grid-cols-4">
          {GARANTIAS.map(([t, d]) => (
            <li key={t} data-rv className="flex gap-3">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-marca/10 text-marca" aria-hidden>
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
              </span>
              <span className="text-[15px] leading-snug">
                <span className="block font-semibold">{t}</span>
                <span className="text-gris">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Inmuebles */}
      <section id="inmuebles" className="gutter mx-auto max-w-[1440px] scroll-mt-20 py-16 md:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 data-rv className="display text-[clamp(32px,3.6vw,48px)] leading-[1.05]">
              {op === "venta" ? "Inmuebles en venta" : "Inmuebles en arriendo"}
              {zona !== "todas" && <span className="text-gris"> en {zona}</span>}
            </h2>
            <p data-rv className="mt-2 text-[15px] text-gris">
              {lista.length} {lista.length === 1 ? "resultado" : "resultados"} · Todos revisados por nuestro equipo antes de publicarse
            </p>
          </div>
          <div data-rv className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-[6px] bg-suave p-1">
              {(["venta", "arriendo"] as Op[]).map((o) => (
                <button
                  key={o}
                  onClick={() => cambiarOp(o)}
                  aria-pressed={op === o}
                  className={`h-9 rounded-[4px] px-4 text-[14px] font-semibold transition-colors ${op === o ? "bg-white shadow-sm" : "text-gris hover:text-tinta"}`}
                >
                  {o === "venta" ? "Comprar" : "Arrendar"}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[14px] text-gris">
              Ordenar
              <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className="campo h-11 rounded-[6px] border border-linea bg-white px-3 text-[14px] text-tinta">
                {Object.entries(ORDEN).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div data-rv className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" data-lenis-prevent>
          {["todas", ...zonas].map((z) => (
            <button
              key={z}
              onClick={() => {
                setZona(z);
                setVisibles(POR_PAGINA);
              }}
              aria-pressed={zona === z}
              className={`h-10 shrink-0 rounded-[6px] border px-4 text-[14px] transition-colors ${zona === z ? "border-tinta bg-tinta text-white" : "border-linea hover:border-tinta/40"}`}
            >
              {z === "todas" ? "Todas las zonas" : z}
            </button>
          ))}
          {(pres !== 0 || hab !== 0) && (
            <button
              onClick={() => {
                setPres(0);
                setHab(0);
              }}
              className="h-10 shrink-0 px-3 text-[14px] text-gris underline underline-offset-4"
            >
              Quitar filtros de precio y habitaciones
            </button>
          )}
        </div>

        {lista.length ? (
          <>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {lista.slice(0, visibles).map((i) => (
                <Tarjeta key={i.id} i={i} onOpen={setAbierto} />
              ))}
            </div>
            {visibles < lista.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibles((v) => v + POR_PAGINA)}
                  className="h-12 rounded-[6px] border border-tinta px-8 text-[15px] font-semibold transition-colors hover:bg-tinta hover:text-white"
                >
                  Mostrar más inmuebles ({lista.length - visibles})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-[10px] bg-suave px-6 py-16 text-center">
            <p className="display text-[26px]">No hay inmuebles publicados con esos filtros.</p>
            <p className="mx-auto mt-2 max-w-[460px] text-gris">
              Muchos inmuebles no llegan a los portales. Cuéntenos qué busca y su asesor le avisa cuando aparezca uno.
            </p>
            <a
              href={wa(`Hola, busco ${op === "venta" ? "comprar" : "arrendar"} en ${zona === "todas" ? "Bogotá" : zona}, ${PRESUPUESTOS[op][pres].label.toLowerCase()}${hab ? `, ${hab} o más habitaciones` : ""}.`)}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex h-12 items-center rounded-[6px] bg-marca px-6 text-[15px] font-semibold text-white"
            >
              Dejar mi búsqueda por WhatsApp
            </a>
          </div>
        )}
      </section>

      {/* Mapa */}
      <section id="mapa" className="gutter mx-auto max-w-[1440px] scroll-mt-20 pb-16 md:pb-24">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 data-rv className="display text-[clamp(28px,3vw,40px)] leading-[1.05]">Véalos en el mapa</h2>
            <p data-rv className="mt-1.5 text-[15px] text-gris">
              El mapa sigue sus filtros. Toque un precio para ver el inmueble. Ubicaciones aproximadas por barrio.
            </p>
          </div>
        </div>
        <div data-rv>
          <Mapa lista={lista} onOpen={setAbierto} />
        </div>
      </section>

      {/* Acompañamiento */}
      <section id="acompanamiento" className="scroll-mt-16 bg-suave">
        <div className="gutter mx-auto max-w-[1440px] py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p data-rv className="etiqueta">
                Cómo trabajamos
              </p>
              <h2 data-rv className="display mt-2 text-[clamp(32px,3.8vw,52px)] leading-[1.05]">
                Acompañamiento total: un mismo asesor en cada paso.
              </h2>
            </div>
            <div data-rv className="flex rounded-[6px] bg-white p-1 lg:justify-self-end" role="tablist" aria-label="Proceso">
              {(["venta", "arriendo"] as Op[]).map((o) => (
                <button
                  key={o}
                  role="tab"
                  aria-selected={via === o}
                  onClick={() => setVia(o)}
                  className={`h-10 flex-1 rounded-[4px] px-5 text-[14.5px] font-semibold transition-colors lg:flex-none ${via === o ? "bg-marca text-white" : "text-gris hover:text-tinta"}`}
                >
                  {o === "venta" ? "Si va a comprar" : "Si va a arrendar"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div data-rv className="relative hidden overflow-hidden rounded-[10px] lg:block">
              <Image src={llaves} alt="Entrega de llaves de un apartamento" fill sizes="35vw" placeholder="blur" className="object-cover" />
            </div>
            <ol key={via} className="grid gap-3 sm:grid-cols-2">
              {PASOS[via].map((p, k) => (
                <li key={p.t} className="flex flex-col rounded-[10px] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-marca text-[14px] font-semibold text-white">{k + 1}</span>
                    <span className="text-[13px] text-gris">{p.quien}</span>
                  </div>
                  <h3 className="display mt-4 text-[21px]">{p.t}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-tinta/75">{p.d}</p>
                  <p className="mt-4 border-t border-linea pt-3 text-[13.5px]">
                    <span className="text-gris">Usted recibe:</span> <span className="font-medium">{p.recibe}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Asesor */}
      <section className="gutter mx-auto grid max-w-[1440px] items-center gap-10 py-16 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-24">
        <div data-rv className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[10px]">
          <Image src={asesora} alt="Valentina Ruiz, asesora de Zaguán" fill sizes="(min-width: 768px) 32vw, 100vw" placeholder="blur" className="object-cover object-top" />
        </div>
        <div>
          <p data-rv className="etiqueta">
            Su asesora
          </p>
          <blockquote data-rv className="display mt-3 text-[clamp(28px,3.2vw,44px)] leading-[1.12] tracking-[-0.025em]">
            “Usted no habla con cinco personas distintas. Habla conmigo, del primer mensaje a la entrega de llaves.”
          </blockquote>
          <p data-rv className="mt-5 text-[15px]">
            <span className="font-semibold">Valentina Ruiz</span> <span className="text-gris">· Asesora en Chapinero, Chicó y Usaquén</span>
          </p>
          <div data-rv className="mt-8 flex flex-wrap gap-3">
            <a
              href={wa("Hola Valentina, quiero asesoría para comprar o arrendar.")}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center rounded-[6px] bg-marca px-6 text-[15px] font-semibold text-white transition-colors hover:bg-marca-hondo"
            >
              Escribirle por WhatsApp
            </a>
            <button onClick={() => irA("#inmuebles")} className="inline-flex h-12 items-center rounded-[6px] border border-linea px-6 text-[15px] font-semibold hover:border-tinta">
              Ver inmuebles
            </button>
          </div>
        </div>
      </section>

      {/* Propietarios */}
      <section id="propietarios" className="scroll-mt-16 bg-marca text-white">
        <div className="gutter mx-auto grid max-w-[1440px] gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <p data-rv className="text-[14px] font-medium text-marca-claro">
              Para propietarios
            </p>
            <h2 data-rv className="display mt-2 text-[clamp(32px,3.8vw,52px)] leading-[1.05]">
              ¿Va a vender o arrendar su inmueble? Nosotros nos encargamos de todo.
            </h2>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {SERVICIOS.map(([t, d]) => (
                <li key={t} data-rv className="border-t border-white/15 py-5">
                  <p className="text-[16.5px] font-semibold">{t}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-white/70">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <form
            data-rv
            onSubmit={(e) => {
              e.preventDefault();
              window.open(wa(`Hola, quiero ${pOp} mi ${pTipo.toLowerCase()}${pBarrio ? ` en ${pBarrio}` : ""} y me gustaría un avalúo.`), "_blank", "noopener");
            }}
            className="grid content-start gap-4 self-start rounded-[10px] bg-white p-5 text-tinta sm:p-7"
          >
            <p className="display text-[24px]">Solicite el avalúo de su inmueble</p>
            <p className="-mt-2 text-[14px] text-gris">Sin costo. Le respondemos el mismo día hábil.</p>
            <div className="flex rounded-[6px] bg-suave p-1">
              {(["vender", "arrendar"] as const).map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setPOp(o)}
                  aria-pressed={pOp === o}
                  className={`h-10 flex-1 rounded-[4px] text-[14.5px] font-semibold transition-colors ${pOp === o ? "bg-white shadow-sm" : "text-gris"}`}
                >
                  Quiero {o}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-[13px] text-gris">Tipo de inmueble</span>
              <select value={pTipo} onChange={(e) => setPTipo(e.target.value)} className="campo mt-1 h-12 w-full rounded-[6px] border border-linea bg-suave px-4 text-[15px]">
                {["Apartamento", "Casa", "Apartaestudio", "Oficina", "Local"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[13px] text-gris">Barrio</span>
              <input
                value={pBarrio}
                onChange={(e) => setPBarrio(e.target.value)}
                placeholder="Ej.: Chicó Navarra"
                className="mt-1 h-12 w-full rounded-[6px] border border-linea bg-suave px-4 text-[16px] outline-none placeholder:text-gris/70 focus:border-marca"
              />
            </label>
            <button className="mt-1 h-12 rounded-[6px] bg-marca text-[15px] font-semibold text-white transition-colors hover:bg-marca-hondo">
              Solicitar avalúo por WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* Crédito */}
      <section id="credito" className="gutter mx-auto max-w-[1440px] scroll-mt-16 py-16 md:py-24">
        <div className="mb-10 max-w-[720px]">
          <p data-rv className="etiqueta">
            Crédito hipotecario
          </p>
          <h2 data-rv className="display mt-2 text-[clamp(32px,3.8vw,52px)] leading-[1.05]">¿Cuánto pagaría al mes?</h2>
          <p data-rv className="mt-4 text-[16.5px] leading-relaxed text-tinta/75">
            Mueva los valores y vea la cuota aproximada y los ingresos que le pedirá el banco. Si le sirve, su asesor le ayuda con el resto.
          </p>
        </div>
        <div data-rv>
          <Calculadora />
        </div>
      </section>

      {/* Zonas */}
      <section className="gutter mx-auto max-w-[1440px] pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[12px] text-white">
          <Image src={bogota} alt="Bogotá con los cerros orientales al fondo" fill sizes="(min-width: 1440px) 1340px, 100vw" placeholder="blur" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.55),rgb(0_0_0/0.25)_45%,rgb(0_0_0/0.75))]" />
          <div className="relative px-5 py-14 sm:px-10 md:py-20">
            <h2 data-rv className="display max-w-[760px] text-[clamp(30px,3.6vw,50px)] leading-[1.05]">
              Trabajamos donde conocemos cada cuadra.
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
              {zonas.map((z) => {
                const n = inmuebles.filter((i) => i.zona === z).length;
                return (
                  <li key={z} data-rv>
                    <button
                      onClick={() => {
                        setZona(z);
                        setPres(0);
                        setHab(0);
                        setVisibles(POR_PAGINA);
                        if (!inmuebles.some((i) => i.zona === z && i.op === op)) cambiarOp(op === "venta" ? "arriendo" : "venta");
                        irA("#inmuebles");
                      }}
                      className="w-full rounded-[8px] bg-white/12 p-4 text-left backdrop-blur-md transition-colors hover:bg-white/25"
                    >
                      <span className="display block text-[19px]">{z}</span>
                      <span className="mt-1 block text-[13px] text-white/75">
                        {n} {n === 1 ? "inmueble" : "inmuebles"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section className="bg-suave">
        <div className="gutter mx-auto grid max-w-[1440px] gap-10 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p data-rv className="etiqueta">
              Preguntas frecuentes
            </p>
            <h2 data-rv className="display mt-2 text-[clamp(32px,3.6vw,48px)] leading-[1.05]">Lo que todos preguntan antes de firmar.</h2>
          </div>
          <div>
            {FAQS.map(([q, a]) => (
              <details key={q} data-rv className="group border-b border-linea py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold">
                  {q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[18px] transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[640px] text-[15.5px] leading-relaxed text-tinta/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden bg-oscuro text-white">
        <Image src={torres} alt="Edificios de ladrillo de las Torres del Parque en Bogotá" fill sizes="100vw" placeholder="blur" className="object-cover opacity-55" />
        <div className="gutter relative mx-auto max-w-[1440px] py-20 md:py-28">
          <h2 data-rv className="display max-w-[820px] text-[clamp(36px,4.8vw,68px)] leading-[1.02]">Hablemos de su próxima casa.</h2>
          <p data-rv className="mt-4 max-w-[520px] text-[17px] text-white/80">
            Cuéntenos qué busca por WhatsApp. Un asesor le responde hoy mismo con opciones reales.
          </p>
          <div data-rv className="mt-8 flex flex-wrap gap-3">
            <a
              href={wa("Hola, quiero hablar con un asesor de Zaguán.")}
              target="_blank"
              rel="noopener"
              className="inline-flex h-13 items-center rounded-[6px] bg-white px-7 py-4 text-[16px] font-semibold text-tinta transition-colors hover:bg-white/90"
            >
              Escribir por WhatsApp
            </a>
            <button onClick={() => irA("#inmuebles")} className="inline-flex h-13 items-center rounded-[6px] border border-white/40 px-7 py-4 text-[16px] font-semibold hover:border-white">
              Ver inmuebles
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-oscuro text-white/70">
        <div className="gutter mx-auto grid max-w-[1440px] gap-8 border-t border-white/10 py-10 pb-20 text-[14px] sm:grid-cols-4">
          <div className="text-white">
            <Logo claro />
          </div>
          <p>
            <span className="block text-white">Oficina</span>
            Chapinero, Bogotá (dirección de ejemplo)
          </p>
          <p>
            <span className="block text-white">Horario</span>
            Lunes a viernes 8:00 a. m. a 6:00 p. m.
            <br />
            Sábados 9:00 a. m. a 2:00 p. m.
          </p>
          <p>
            <span className="block text-white">Aviso</span>
            Zaguán es un negocio ficticio. Inmuebles, precios y personas son de ejemplo.
          </p>
        </div>
      </footer>

      <Ficha inm={abierto} onClose={cerrar} />
    </div>
  );
}
