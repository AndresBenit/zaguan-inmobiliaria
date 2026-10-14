export type Op = "venta" | "arriendo";

export type Inmueble = {
  id: string;
  code: string;
  op: Op;
  tipo: string;
  titulo: string;
  barrio: string;
  zona: string;
  precio: number;
  admin: number;
  area: number;
  hab: number;
  banos: number;
  parq: number;
  estrato: number;
  piso: string;
  antiguedad: string;
  fotos: string[];
  resumen: string;
  destacados: string[];
  nuevo?: boolean;
  /** Ubicación aproximada (barrio), para el mapa */
  pos: [number, number];
};

const fotos = (n: number) => ["a", "b", "c"].map((l) => `/img/p${n}-${l}.jpg`);

// EDITABLE: inmuebles de ejemplo (negocio ficticio)
export const inmuebles: Inmueble[] = [
  {
    id: "chapinero-alto", pos: [4.6486, -74.056], code: "ZG-1042", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento con chimenea y vista a los cerros", barrio: "Chapinero Alto", zona: "Chapinero",
    precio: 890_000_000, admin: 620_000, area: 112, hab: 3, banos: 2, parq: 2, estrato: 5,
    piso: "Piso 6 de 8", antiguedad: "12 años", fotos: fotos(1),
    resumen: "Sala comedor amplia con chimenea a gas, cocina abierta remodelada y estudio. Edificio con portería 24 horas, gimnasio y salón comunal. A cuatro cuadras de la Circunvalar.",
    destacados: ["Chimenea", "Cocina remodelada", "Estudio", "Portería 24 h"],
  },
  {
    id: "usaquen-santa-barbara", pos: [4.698, -74.04], code: "ZG-2118", op: "arriendo", tipo: "Apartamento",
    titulo: "Apartamento iluminado cerca al parque de Usaquén", barrio: "Santa Bárbara", zona: "Usaquén",
    precio: 4_800_000, admin: 480_000, area: 84, hab: 2, banos: 2, parq: 1, estrato: 5,
    piso: "Piso 4 de 7", antiguedad: "8 años", fotos: fotos(2), nuevo: true,
    resumen: "Ventanales de piso a techo, piso en madera y cocina integral. Caminando al Parque de Usaquén, Unicentro y la carrera Séptima. Disponible desde el 1 del próximo mes.",
    destacados: ["Ventanales", "Balcón", "Depósito", "Acepta mascotas"],
  },
  {
    id: "rosales-penthouse", pos: [4.656, -74.05], code: "ZG-1007", op: "venta", tipo: "Penthouse",
    titulo: "Penthouse con terraza privada en Los Rosales", barrio: "Los Rosales", zona: "Chapinero",
    precio: 2_350_000_000, admin: 1_450_000, area: 238, hab: 3, banos: 4, parq: 3, estrato: 6,
    piso: "Piso 10 (último)", antiguedad: "5 años", fotos: fotos(3),
    resumen: "Terraza privada de 60 m² con vista a la ciudad, doble altura en la sala, baño principal con tina y ascensor directo al apartamento. Edificio de cuatro unidades.",
    destacados: ["Terraza 60 m²", "Doble altura", "Ascensor privado", "3 parqueaderos"],
  },
  {
    id: "cedritos-estrenar", pos: [4.723, -74.042], code: "ZG-2140", op: "arriendo", tipo: "Apartamento",
    titulo: "Apartamento para estrenar con piscina en el conjunto", barrio: "Cedritos", zona: "Usaquén",
    precio: 2_900_000, admin: 310_000, area: 62, hab: 2, banos: 2, parq: 1, estrato: 4,
    piso: "Piso 3 de 12", antiguedad: "Nuevo", fotos: fotos(4),
    resumen: "Conjunto nuevo con piscina climatizada, BBQ y zona de coworking. Cerca a la calle 140 y a la Autopista Norte, con TransMilenio a seis cuadras.",
    destacados: ["Para estrenar", "Piscina", "Coworking", "Cerca a TransMilenio"],
  },
  {
    id: "teusaquillo-casa", pos: [4.638, -74.075], code: "ZG-1031", op: "venta", tipo: "Casa",
    titulo: "Casa de ladrillo restaurada en Teusaquillo", barrio: "Teusaquillo", zona: "Teusaquillo",
    precio: 1_480_000_000, admin: 0, area: 290, hab: 5, banos: 4, parq: 2, estrato: 4,
    piso: "Tres niveles", antiguedad: "Restaurada en 2023", fotos: fotos(5),
    resumen: "Casa de los años cuarenta con fachada en ladrillo original, patio interior y terraza. Redes eléctricas e hidráulicas nuevas. Uso residencial o de oficina.",
    destacados: ["Patio interior", "Ladrillo original", "Uso mixto", "Sin administración"],
  },
  {
    id: "ciudad-salitre", pos: [4.65, -74.108], code: "ZG-1056", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento familiar cerca al Parque Simón Bolívar", barrio: "Ciudad Salitre", zona: "Salitre",
    precio: 520_000_000, admin: 390_000, area: 78, hab: 3, banos: 2, parq: 1, estrato: 4,
    piso: "Piso 8 de 14", antiguedad: "15 años", fotos: fotos(6),
    resumen: "Tres habitaciones, balcón y cocina abierta. Conjunto con parque infantil y cancha. A diez minutos del aeropuerto y cerca al Parque Simón Bolívar y Gran Estación.",
    destacados: ["Balcón", "Parque infantil", "Cerca al aeropuerto", "Crédito aplicable"],
  },
  {
    id: "chico-navarra", pos: [4.68, -74.045], code: "ZG-1063", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento remodelado en Chicó Navarra", barrio: "Chicó Navarra", zona: "Chicó",
    precio: 1_150_000_000, admin: 780_000, area: 128, hab: 3, banos: 3, parq: 2, estrato: 6,
    piso: "Piso 5 de 6", antiguedad: "20 años, remodelado", fotos: fotos(7), nuevo: true,
    resumen: "Remodelación completa en 2024: pisos, cocina, baños y redes. Sala con luz de la mañana, estudio y cuarto de servicio. A dos cuadras del Parque de la 93.",
    destacados: ["Remodelado 2024", "Estudio", "Cuarto de servicio", "Cerca al Parque 93"],
  },
  {
    id: "chapinero-apartaestudio", pos: [4.638, -74.064], code: "ZG-2152", op: "arriendo", tipo: "Apartaestudio",
    titulo: "Apartaestudio amoblado en Chapinero Central", barrio: "Chapinero Central", zona: "Chapinero",
    precio: 1_900_000, admin: 220_000, area: 38, hab: 1, banos: 1, parq: 0, estrato: 3,
    piso: "Piso 7 de 10", antiguedad: "6 años", fotos: fotos(8),
    resumen: "Amoblado y listo para llegar. A pasos de la Javeriana, la calle 53 y TransMilenio. Ideal para estudiante o profesional que vive solo.",
    destacados: ["Amoblado", "Cerca a universidades", "Lavandería comunal", "Sin parqueadero"],
  },
  {
    id: "colina-campestre", pos: [4.733, -74.064], code: "ZG-1071", op: "venta", tipo: "Casa",
    titulo: "Casa en conjunto cerrado en Colina Campestre", barrio: "Colina Campestre", zona: "Suba",
    precio: 780_000_000, admin: 450_000, area: 160, hab: 4, banos: 3, parq: 2, estrato: 4,
    piso: "Dos niveles", antiguedad: "18 años", fotos: fotos(9),
    resumen: "Casa esquinera con jardín, estudio en el primer piso y chimenea. Conjunto con vigilancia, parque y salón comunal. Cerca a la Avenida Boyacá y al Centro Comercial Santafé.",
    destacados: ["Esquinera", "Jardín", "Chimenea", "Conjunto cerrado"],
  },
  {
    id: "chia-campestre", pos: [4.86, -74.035], code: "ZG-1078", op: "venta", tipo: "Casa",
    titulo: "Casa campestre con terraza en Chía", barrio: "Vereda Bojacá", zona: "Chía",
    precio: 1_250_000_000, admin: 680_000, area: 245, hab: 4, banos: 4, parq: 3, estrato: 5,
    piso: "Dos niveles", antiguedad: "4 años", fotos: fotos(10),
    resumen: "Casa en condominio con terraza cubierta, zona BBQ y vista a la sabana. A 15 minutos de la calle 170 por la Autopista Norte. Colegios campestres cerca.",
    destacados: ["Terraza cubierta", "Vista a la sabana", "Condominio", "Colegios cerca"],
  },
  {
    id: "usaquen-venta", pos: [4.695, -74.031], code: "ZG-1082", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento con balcón en Usaquén", barrio: "Usaquén", zona: "Usaquén",
    precio: 690_000_000, admin: 520_000, area: 92, hab: 2, banos: 2, parq: 2, estrato: 5,
    piso: "Piso 3 de 5", antiguedad: "10 años", fotos: fotos(11),
    resumen: "Balcón cubierto, cocina abierta y estudio que se puede usar como tercera habitación. Edificio pequeño de diez apartamentos, cerca al pueblo de Usaquén.",
    destacados: ["Balcón cubierto", "Estudio", "Edificio pequeño", "2 parqueaderos"],
  },
  {
    id: "cedritos-venta", pos: [4.727, -74.046], code: "ZG-1090", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento de tres habitaciones en Cedritos", barrio: "Cedritos", zona: "Usaquén",
    precio: 450_000_000, admin: 340_000, area: 70, hab: 3, banos: 2, parq: 1, estrato: 4,
    piso: "Piso 9 de 12", antiguedad: "14 años", fotos: fotos(12),
    resumen: "Buena distribución, cocina cerrada y vista despejada hacia el norte. A tres cuadras de la calle 147 y del Centro Comercial Cedritos 151.",
    destacados: ["Vista despejada", "3 habitaciones", "Crédito aplicable", "Gimnasio"],
  },
  {
    id: "modelia", pos: [4.668, -74.122], code: "ZG-2163", op: "arriendo", tipo: "Apartamento",
    titulo: "Apartamento con dos parqueaderos en Modelia", barrio: "Modelia", zona: "Salitre",
    precio: 2_600_000, admin: 290_000, area: 74, hab: 3, banos: 2, parq: 2, estrato: 4,
    piso: "Piso 2 de 5", antiguedad: "22 años", fotos: fotos(13), nuevo: true,
    resumen: "Barrio tranquilo y residencial, a diez minutos del aeropuerto. Tres habitaciones, cocina integral y patio de ropas cubierto.",
    destacados: ["2 parqueaderos", "Cerca al aeropuerto", "Barrio residencial", "Patio de ropas"],
  },
  {
    id: "la-soledad", pos: [4.633, -74.077], code: "ZG-2171", op: "arriendo", tipo: "Apartamento",
    titulo: "Apartamento en edificio de ladrillo en La Soledad", barrio: "La Soledad", zona: "Teusaquillo",
    precio: 3_300_000, admin: 260_000, area: 96, hab: 3, banos: 2, parq: 1, estrato: 4,
    piso: "Piso 3 de 4", antiguedad: "45 años", fotos: fotos(14),
    resumen: "Techos altos, ventanas grandes y piso en madera original. Frente al Park Way, con cafés, librerías y ciclorruta a la puerta.",
    destacados: ["Techos altos", "Frente al Park Way", "Madera original", "Ciclorruta"],
  },
  {
    id: "chico-alto-penthouse", pos: [4.676, -74.04], code: "ZG-2180", op: "arriendo", tipo: "Penthouse",
    titulo: "Penthouse amoblado con vista en Chicó Alto", barrio: "Chicó Alto", zona: "Chicó",
    precio: 12_000_000, admin: 1_600_000, area: 210, hab: 3, banos: 4, parq: 3, estrato: 6,
    piso: "Piso 12 (último)", antiguedad: "7 años", fotos: fotos(15),
    resumen: "Amoblado por diseñador, cocina con isla y terraza con vista panorámica. Ideal para ejecutivos o familias en asignación temporal. Contrato mínimo de un año.",
    destacados: ["Amoblado", "Vista panorámica", "Isla en la cocina", "3 parqueaderos"],
  },
  {
    id: "chapinero-alto-arriendo", pos: [4.653, -74.054], code: "ZG-2188", op: "arriendo", tipo: "Apartamento",
    titulo: "Apartamento de dos habitaciones en Chapinero Alto", barrio: "Chapinero Alto", zona: "Chapinero",
    precio: 6_500_000, admin: 690_000, area: 105, hab: 2, banos: 3, parq: 2, estrato: 6,
    piso: "Piso 8 de 9", antiguedad: "9 años", fotos: fotos(16),
    resumen: "Habitación principal con vista a la ciudad, vestier y baño con ducha doble. Edificio con gimnasio, sauna y planta eléctrica.",
    destacados: ["Vista a la ciudad", "Vestier", "Sauna", "Planta eléctrica"],
  },
  {
    id: "suba-venta", pos: [4.748, -74.087], code: "ZG-1095", op: "venta", tipo: "Apartamento",
    titulo: "Apartamento con zonas verdes en Suba", barrio: "Pinar de Suba", zona: "Suba",
    precio: 380_000_000, admin: 260_000, area: 64, hab: 3, banos: 2, parq: 1, estrato: 3,
    piso: "Piso 4 de 6", antiguedad: "11 años", fotos: fotos(17),
    resumen: "Conjunto rodeado de zonas verdes, con parque infantil y salón social. Aplica para subsidio y crédito con Fondo Nacional del Ahorro.",
    destacados: ["Zonas verdes", "Aplica subsidio", "Parque infantil", "Crédito FNA"],
  },
  {
    id: "usaquen-casa-arriendo", pos: [4.689, -74.029], code: "ZG-2195", op: "arriendo", tipo: "Casa",
    titulo: "Casa con balcones en Santa Ana", barrio: "Santa Ana", zona: "Usaquén",
    precio: 8_500_000, admin: 0, area: 220, hab: 4, banos: 4, parq: 2, estrato: 6,
    piso: "Tres niveles", antiguedad: "25 años", fotos: fotos(18),
    resumen: "Casa en calle cerrada con balcones, jardín trasero y estudio. Cerca al Club Los Lagartos y colegios del norte. Admite mascotas.",
    destacados: ["Calle cerrada", "Jardín", "Estudio", "Admite mascotas"],
  },
];

// Zonas en el orden en que aparecen en los datos
export const zonas = [...new Set(inmuebles.map((i) => i.zona))];

export const cop = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;

// $890.000.000 -> "$890 millones"; $2.350.000.000 -> "$2.350 millones"
export const millones = (n: number) => `$${Math.round(n / 1_000_000).toLocaleString("es-CO")} millones`;

export const precioCorto = (i: Inmueble) => (i.op === "venta" ? millones(i.precio) : `${cop(i.precio)} /mes`);

// "$890 M" o "$4,8 M/mes": etiqueta corta para los pines del mapa
export const precioPin = (i: Inmueble) => {
  const m = i.precio / 1_000_000;
  const t = m >= 100 ? Math.round(m).toLocaleString("es-CO") : m.toLocaleString("es-CO", { maximumFractionDigits: 1 });
  return i.op === "venta" ? `$${t} M` : `$${t} M/mes`;
};
