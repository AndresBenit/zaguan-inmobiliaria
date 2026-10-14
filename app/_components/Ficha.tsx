"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { wa } from "@/lib/site";
import { useMinute } from "../_lib/useMinute";
import { cop, precioCorto, type Inmueble } from "./data";
import asesora from "@/public/img/asesora.jpg";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const HORAS = ["8:00 a. m.", "10:00 a. m.", "12:00 m.", "3:00 p. m.", "5:00 p. m."];

export default function Ficha({ inm, onClose }: { inm: Inmueble | null; onClose: () => void }) {
  // Keep the last property mounted while the sheet animates closed
  const [shown, setShown] = useState<Inmueble | null>(inm);
  if (inm && inm !== shown) setShown(inm);
  const open = !!inm;
  const i = inm ?? shown;

  const [foto, setFoto] = useState(0);
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  if (i && i.id !== lastId) {
    setLastId(i.id);
    setFoto(0);
    setDia(null);
    setHora(null);
  }

  const minute = useMinute();
  // Next six days with visits; Sundays are closed
  const dias = useMemo(() => {
    if (!minute) return [];
    const out: Date[] = [];
    const d = new Date(minute);
    while (out.length < 6) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }, [minute]);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const msg =
    i && dia && hora
      ? `Hola, quiero agendar una visita al inmueble ${i.code} (${i.titulo}, ${i.barrio}) el ${dia} a las ${hora}.`
      : i
        ? `Hola, me interesa el inmueble ${i.code} (${i.titulo}, ${i.barrio}).`
        : "";

  return (
    <div className="ficha-root fixed inset-0 z-[70]" data-open={open} aria-hidden={!open}>
      <div className="ficha-fondo absolute inset-0 bg-[#1b1714]/55 backdrop-blur-[2px]" onClick={onClose} />
      {i && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={i.titulo}
          className="ficha-panel absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-[16px] bg-fondo min-[900px]:inset-x-auto min-[900px]:left-1/2 min-[900px]:top-1/2 min-[900px]:bottom-auto min-[900px]:w-[min(1080px,calc(100vw-64px))] min-[900px]:-translate-x-1/2 min-[900px]:-translate-y-1/2 min-[900px]:rounded-[10px]"
          data-lenis-prevent
        >
          <div className="grid min-[900px]:grid-cols-[1.15fr_1fr]">
            {/* Galería */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-suave min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[560px]">
                {i.fotos.map((f, k) => (
                  <Image
                    key={k}
                    src={f}
                    alt={k === 0 ? i.titulo : ""}
                    fill
                    sizes="(min-width: 900px) 600px, 100vw"
                    className={`object-cover transition-opacity duration-500 ${k === foto ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>
              <div className="absolute inset-x-3 bottom-3 flex gap-2">
                {i.fotos.map((f, k) => (
                  <button
                    key={k}
                    onClick={() => setFoto(k)}
                    aria-label={`Ver foto ${k + 1}`}
                    className={`relative h-14 w-20 overflow-hidden rounded-[6px] border-2 transition-colors ${k === foto ? "border-fondo" : "border-transparent opacity-80"}`}
                  >
                    <Image src={f} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-fondo/90 text-[20px] text-tinta backdrop-blur"
              >
                ×
              </button>
            </div>

            {/* Datos */}
            <div className="p-5 sm:p-8">
              <p className="etiqueta text-marca">
                {i.op === "venta" ? "En venta" : "En arriendo"} · {i.code}
              </p>
              <h3 className="display mt-2 text-[28px] leading-[1.08] sm:text-[32px]">{i.titulo}</h3>
              <p className="mt-2 text-gris">
                {i.barrio}, {i.zona} · Estrato {i.estrato}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-linea py-4">
                <span className="display text-[34px] leading-none">{precioCorto(i)}</span>
                <span className="text-[14px] text-gris">{i.admin ? `Administración ${cop(i.admin)}` : "Sin administración"}</span>
              </div>
              <dl className="grid grid-cols-4 gap-2 py-4 text-center">
                {[
                  [`${i.area}`, "m²"],
                  [`${i.hab}`, i.hab === 1 ? "habitación" : "habitaciones"],
                  [`${i.banos}`, "baños"],
                  [`${i.parq}`, i.parq === 1 ? "parqueadero" : "parqueaderos"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-[8px] bg-suave px-1 py-3">
                    <dt className="sr-only">{k}</dt>
                    <dd className="display text-[28px] leading-none">{v}</dd>
                    <dd className="mt-1 text-[11.5px] text-gris">{k}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[15px] leading-relaxed text-tinta/85">{i.resumen}</p>
              <p className="mt-2 text-[13px] text-gris">
                {i.piso} · {i.antiguedad}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {i.destacados.map((d) => (
                  <li key={d} className="rounded-[4px] bg-suave px-2.5 py-1 text-[13px]">
                    {d}
                  </li>
                ))}
              </ul>

              {/* Agendar visita */}
              <div className="mt-7 rounded-[12px] bg-tinta p-5 text-fondo">
                <div className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={asesora} alt="" fill sizes="44px" className="object-cover object-top" />
                  </span>
                  <p className="text-[14px] leading-snug">
                    <span className="font-semibold">Valentina Ruiz</span> le muestra este inmueble y lo acompaña hasta la entrega de
                    llaves.
                  </p>
                </div>
                <p className="mt-5 text-[13px] text-fondo/60">Agendar visita</p>
                <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
                  {dias.map((d) => {
                    const k = `${DIAS[d.getDay()].toLowerCase()} ${d.getDate()}`;
                    return (
                      <button
                        key={k}
                        onClick={() => setDia(k)}
                        className={`w-[52px] shrink-0 rounded-[8px] border py-2 text-center transition-colors ${dia === k ? "border-marca-claro bg-marca-claro text-tinta" : "border-fondo/15 hover:border-fondo/40"}`}
                      >
                        <span className="block text-[11px] opacity-70">{DIAS[d.getDay()]}</span>
                        <span className="display block text-[22px] leading-tight">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {HORAS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHora(h)}
                      disabled={!dia}
                      className={`rounded-[6px] border px-3 py-1.5 text-[13px] transition-colors disabled:opacity-30 ${hora === h ? "border-marca-claro bg-marca-claro text-tinta" : "border-fondo/15 hover:border-fondo/40"}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <a
                  href={wa(msg)}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 flex h-12 items-center justify-center rounded-[6px] bg-fondo text-[15px] font-semibold text-tinta transition-colors hover:bg-white"
                >
                  {dia && hora ? `Confirmar visita · ${dia}, ${hora}` : "Preguntar por WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
