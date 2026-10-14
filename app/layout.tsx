import type { Metadata, Viewport } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import ConceptBadge from "./_components/ConceptBadge";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], weight: ["500", "600", "700"] });

const title = "Zaguán Propiedad Raíz · Comprar y arrendar en Bogotá (proyecto concepto)";
const description =
  "Inmobiliaria ficticia diseñada y construida por Andrés Benítez: venta y arriendo de vivienda en Bogotá con acompañamiento de principio a fin.";

// En Vercel usa el dominio de producción para que la imagen al compartir el link funcione
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : "http://localhost:3024"),
  title,
  description,
  openGraph: { title, description, locale: "es_CO", type: "website", images: ["/img/hero.jpg"] },
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${schibsted.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Oculta lo que GSAP va a revelar antes de hidratar; se omite con movimiento reducido */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <ConceptBadge />
      </body>
    </html>
  );
}
