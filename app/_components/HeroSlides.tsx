"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { inmuebles, precioCorto, type Inmueble } from "./data";

// EDITABLE: inmuebles que rotan en la portada
const DESTACADOS = ["rosales-penthouse", "chico-navarra", "chia-campestre", "usaquen-santa-barbara"].map(
  (id) => inmuebles.find((i) => i.id === id)!,
);
const DURACION = 6500;

export default function HeroSlides({ onOpen }: { onOpen: (i: Inmueble) => void }) {
  const [n, setN] = useState(0);
  const [pausa, setPausa] = useState(false);
  const inicio = useRef(0);
  const [prog, setProg] = useState(0);

  // Avance automático con barra de progreso; se pausa al pasar el mouse o con la pestaña oculta
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let acumulado = 0;
    inicio.current = performance.now();
    const tick = (t: number) => {
      if (pausa || document.hidden) {
        inicio.current = t - acumulado;
      } else {
        acumulado = t - inicio.current;
        setProg(Math.min(1, acumulado / DURACION));
        if (acumulado >= DURACION) {
          setN((x) => (x + 1) % DESTACADOS.length);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, pausa]);

  const ir = (k: number) => {
    setProg(0);
    setN((k + DESTACADOS.length) % DESTACADOS.length);
  };
  const i = DESTACADOS[n];

  return (
    <div className="absolute inset-0" onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}>
      {DESTACADOS.map((d, k) => (
        <div
          key={d.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${k === n ? "opacity-100" : "opacity-0"}`}
          aria-hidden={k !== n}
        >
          <Image
            src={d.fotos[0]}
            alt={k === n ? d.titulo : ""}
            fill
            priority={k === 0}
            sizes="100vw"
            className={`object-cover ${k === n ? "kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.12)_30%,rgb(0_0_0/0.25)_55%,rgb(0_0_0/0.8)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.45)_0%,transparent_65%)]" />

      {/* Ficha corta del destacado y controles */}
      <div className="gutter absolute inset-x-0 bottom-32 mx-auto flex max-w-[1440px] flex-col gap-5 text-white sm:bottom-36 md:flex-row md:items-end md:justify-between">
        <div key={i.id} className="slide-in max-w-[560px]">
          <p className="text-[14px] font-medium text-white/80">
            Destacado · {i.op === "venta" ? "Venta" : "Arriendo"} · {i.barrio}
          </p>
          <p className="display mt-1 text-[clamp(22px,2.2vw,30px)] leading-tight">{i.titulo}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="display text-[clamp(26px,2.6vw,36px)]">{precioCorto(i)}</span>
            <span className="text-[14px] text-white/80">
              {i.area} m² · {i.hab} habs. · {i.banos} baños
            </span>
            <button
              onClick={() => onOpen(i)}
              className="h-11 rounded-[6px] bg-white px-5 text-[14.5px] font-semibold text-tinta transition-colors hover:bg-white/90"
            >
              Ver inmueble
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {DESTACADOS.map((d, k) => (
              <button key={d.id} onClick={() => ir(k)} aria-label={`Destacado ${k + 1}: ${d.titulo}`} className="py-3">
                <span className="block h-[3px] w-12 overflow-hidden rounded-full bg-white/30 sm:w-16">
                  <span
                    className="block h-full bg-white"
                    style={{ width: k < n ? "100%" : k === n ? `${prog * 100}%` : "0%" }}
                  />
                </span>
              </button>
            ))}
          </div>
          <span className="w-12 text-right text-[13px] tabular-nums text-white/80">
            {n + 1} / {DESTACADOS.length}
          </span>
          <div className="hidden gap-1.5 sm:flex">
            <button onClick={() => ir(n - 1)} aria-label="Anterior" className="grid size-10 place-items-center rounded-full border border-white/40 hover:bg-white/15">
              ←
            </button>
            <button onClick={() => ir(n + 1)} aria-label="Siguiente" className="grid size-10 place-items-center rounded-full border border-white/40 hover:bg-white/15">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
