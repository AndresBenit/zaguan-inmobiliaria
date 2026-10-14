"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { precioCorto, precioPin, type Inmueble } from "./data";

// Mapa real (OpenStreetMap) con un pin de precio por inmueble; sigue los filtros del listado
export default function Mapa({ lista, onOpen }: { lista: Inmueble[]; onOpen: (i: Inmueble) => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const mapa = useRef<LMap | null>(null);
  const pines = useRef<Marker[]>([]);
  const [sel, setSel] = useState<Inmueble | null>(null);
  const [listo, setListo] = useState(false);
  const encuadre = useRef<Inmueble[] | null>(null);

  useEffect(() => {
    let vivo = true;
    import("leaflet").then((L) => {
      if (!vivo || !caja.current || mapa.current) return;
      const m = L.map(caja.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([4.68, -74.06], 12);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(m);
      m.on("click", () => setSel(null));
      mapa.current = m;
      setListo(true);
    });
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  // Pines: se rehacen cuando cambian los filtros
  useEffect(() => {
    if (!listo || !mapa.current) return;
    import("leaflet").then((L) => {
      const m = mapa.current!;
      pines.current.forEach((p) => p.remove());
      pines.current = lista.map((i) => {
        const icon = L.divIcon({
          className: "",
          html: `<span class="pin${sel?.id === i.id ? " pin-on" : ""}">${precioPin(i)}</span>`,
          iconSize: [0, 0],
        });
        return L.marker(i.pos, { icon, title: i.titulo, riseOnHover: true })
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            setSel(i);
          })
          .addTo(m);
      });
      // Re-encuadra solo cuando cambian los filtros, no al tocar un pin
      if (lista.length && encuadre.current !== lista) {
        // Encuadra Bogotá; la Sabana (Chía) solo cuando es lo único en la lista
        const urbanos = lista.filter((i) => i.pos[0] < 4.8);
        const base = urbanos.length ? urbanos : lista;
        m.fitBounds(L.latLngBounds(base.map((i) => i.pos)), { padding: [50, 50], maxZoom: 14 });
      }
      encuadre.current = lista;
    });
  }, [lista, listo, sel]);

  const visible = sel && lista.some((i) => i.id === sel.id) ? sel : null;

  return (
    <div className="relative h-[70svh] min-h-[460px] overflow-hidden rounded-[12px] bg-suave">
      <div ref={caja} className="absolute inset-0 z-0" data-lenis-prevent />
      {!listo && <div className="absolute inset-0 grid place-items-center text-[14px] text-gris">Cargando mapa…</div>}
      {visible && (
        <div className="absolute inset-x-3 bottom-3 z-[500] flex gap-3 rounded-[10px] bg-white p-3 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.4)] sm:inset-x-auto sm:left-4 sm:top-4 sm:bottom-auto sm:w-[340px] sm:flex-col">
          <span className="relative block aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-[6px] sm:w-full">
            <Image src={visible.fotos[0]} alt={visible.titulo} fill sizes="340px" className="object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="display text-[19px]">{precioCorto(visible)}</p>
            <p className="mt-0.5 line-clamp-2 text-[14px] font-medium leading-snug">{visible.titulo}</p>
            <p className="mt-0.5 text-[13px] text-gris">
              {visible.barrio} · {visible.area} m² · {visible.hab} habs.
            </p>
            <button
              onClick={() => onOpen(visible)}
              className="mt-2 h-9 rounded-[6px] bg-marca px-4 text-[13.5px] font-semibold text-white hover:bg-marca-hondo sm:mt-3 sm:h-10 sm:w-full"
            >
              Ver ficha
            </button>
          </div>
          <button onClick={() => setSel(null)} aria-label="Cerrar" className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-[18px]">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
