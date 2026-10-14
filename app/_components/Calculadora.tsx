"use client";

import { useState } from "react";
import { wa } from "@/lib/site";
import { cop, millones } from "./data";

// Cuota fija mensual (sistema francés) a partir de una tasa efectiva anual
function cuota(monto: number, tasaEA: number, anos: number) {
  const im = Math.pow(1 + tasaEA, 1 / 12) - 1;
  const n = anos * 12;
  return (monto * im) / (1 - Math.pow(1 + im, -n));
}

function Rango({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
  onChange: (n: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] text-gris">{label}</span>
        <span className="text-[17px] font-medium tabular-nums">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rango mt-3 w-full"
        style={{ "--p": `${p}%` } as React.CSSProperties}
      />
    </label>
  );
}

export default function Calculadora() {
  const [valor, setValor] = useState(480_000_000);
  const [inicial, setInicial] = useState(30);
  const [anos, setAnos] = useState(20);
  const TASA = 0.125; // referencia de ejemplo, no es una oferta de crédito

  const monto = valor * (1 - inicial / 100);
  const c = cuota(monto, TASA, anos);
  // Los bancos suelen exigir que la cuota no pase del 30 % de los ingresos del hogar
  const ingresos = c / 0.3;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div className="grid content-start gap-8">
        <Rango label="Valor del inmueble" value={valor} min={150_000_000} max={2_500_000_000} step={10_000_000} fmt={millones} onChange={setValor} />
        <Rango label="Cuota inicial" value={inicial} min={10} max={70} step={5} fmt={(n) => `${n} % · ${millones((valor * n) / 100)}`} onChange={setInicial} />
        <Rango label="Plazo" value={anos} min={5} max={30} step={1} fmt={(n) => `${n} años`} onChange={setAnos} />
        <p className="text-[13px] leading-relaxed text-gris">
          Cálculo de referencia con una tasa de ejemplo del 12,5 % efectivo anual. La tasa real la define el banco según su perfil;
          su asesor le ayuda a comparar ofertas y a radicar la solicitud.
        </p>
      </div>
      <div className="rounded-[10px] bg-oscuro p-6 text-fondo sm:p-8">
        <p className="text-[14px] text-fondo/65">Cuota mensual aproximada</p>
        <p className="display mt-1 text-[clamp(44px,6vw,68px)] leading-none">{cop(c)}</p>
        <dl className="mt-8 grid gap-4 border-t border-fondo/15 pt-6 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-fondo/65">Monto a financiar</dt>
            <dd className="tabular-nums">{millones(monto)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fondo/65">Ingresos del hogar sugeridos</dt>
            <dd className="tabular-nums">{cop(ingresos)} /mes</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fondo/65">Total pagado al banco</dt>
            <dd className="tabular-nums">{millones(c * anos * 12)}</dd>
          </div>
        </dl>
        <a
          href={wa(`Hola, quiero ayuda con un crédito hipotecario para un inmueble de ${millones(valor)} con ${inicial} % de cuota inicial a ${anos} años.`)}
          target="_blank"
          rel="noopener"
          className="mt-8 flex h-12 items-center justify-center rounded-[6px] bg-fondo text-[15px] font-semibold text-tinta transition-colors hover:bg-white"
        >
          Quiero ayuda con el crédito
        </a>
      </div>
    </div>
  );
}
