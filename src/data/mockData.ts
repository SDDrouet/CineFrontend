import type { Movie, Room, Section, Showtime } from "@/types";

export const CURRENT_USER_ID = "user-demo-1";

export const SECTION_PRICES: Record<"VIP" | "DBOX" | "GENERAL", number> = {
  VIP: 15,
  DBOX: 10,
  GENERAL: 5,
};

export const movies: Movie[] = [
  {
    id: "mv-1",
    name: "Estación Eterna",
    description:
      "Una tripulación despierta de un largo criosueño y descubre que la nave ya no viaja sola por el espacio.",
    duration: 128,
    classification: "+13",
    genres: ["Ciencia ficción", "Drama"],
    status: "CARTELERA",
    posterUrl: "https://picsum.photos/seed/estacion-eterna/400/600",
  },
  {
    id: "mv-2",
    name: "Risas en el Bulevar",
    description:
      "Dos vecinos rivales terminan compartiendo un food truck y, sin querer, un negocio... y algo más.",
    duration: 96,
    classification: "ATP",
    genres: ["Comedia", "Romance"],
    status: "CARTELERA",
    posterUrl: "https://picsum.photos/seed/bulevar/400/600",
  },
  {
    id: "mv-3",
    name: "Sombra Carmesí",
    description:
      "Una familia se muda a una casa con un sótano que nadie recuerda haber sellado.",
    duration: 104,
    classification: "+16",
    genres: ["Terror", "Suspenso"],
    status: "CARTELERA",
    posterUrl: "https://picsum.photos/seed/sombra-carmesi/400/600",
  },
  {
    id: "mv-4",
    name: "El Último Vuelo",
    description:
      "Un piloto retirado tiene una última misión: aterrizar lo que ya nadie cree que pueda volar.",
    duration: 132,
    classification: "+13",
    genres: ["Acción", "Aventura"],
    status: "CARTELERA",
    posterUrl: "https://picsum.photos/seed/ultimo-vuelo/400/600",
  },
  {
    id: "mv-5",
    name: "Pequeños Grandes Sueños",
    description:
      "Un juguete olvidado emprende un viaje por la ciudad para volver con su dueño antes del amanecer.",
    duration: 89,
    classification: "ATP",
    genres: ["Animación", "Familiar"],
    status: "CARTELERA",
    posterUrl: "https://picsum.photos/seed/pequenos-suenos/400/600",
  },
  {
    id: "mv-6",
    name: "Frontera Silenciosa",
    description: "Aún en postproducción. Próximamente en cartelera.",
    duration: 118,
    classification: "+16",
    genres: ["Drama", "Bélico"],
    status: "PROXIMAMENTE",
    posterUrl: "https://picsum.photos/seed/frontera-silenciosa/400/600",
  },
];

export const rooms: Room[] = [
  { id: "room-1", name: "Sala 1" },
  { id: "room-2", name: "Sala 2" },
  { id: "room-3", name: "Sala 3" },
];

// Todas las salas comparten la misma estructura física (requisito del negocio)
function buildSectionsTemplate(): Section[] {
  const layout: {
    type: "VIP" | "DBOX" | "GENERAL";
    name: string;
    description: string;
    rowLabels: string[];
    seatsPerRow: number;
  }[] = [
    {
      type: "VIP",
      name: "Sección VIP",
      description: "Butacas reclinables con mesa lateral",
      rowLabels: ["A", "B"],
      seatsPerRow: 8,
    },
    {
      type: "DBOX",
      name: "Sección DBOX",
      description: "Asientos con movimiento sincronizado a la película",
      rowLabels: ["C", "D"],
      seatsPerRow: 8,
    },
    {
      type: "GENERAL",
      name: "Sección General",
      description: "Butacas estándar",
      rowLabels: ["E", "F"],
      seatsPerRow: 10,
    },
  ];

  return layout.map((sec) => {
    const sectionId = `sec-${sec.type.toLowerCase()}`;
    const rows = sec.rowLabels.map((label) => ({
      label,
      seats: Array.from({ length: sec.seatsPerRow }, (_, i) => ({
        id: `${sectionId}-${label}${i + 1}`,
        rowLabel: label,
        number: i + 1,
        sectionId,
        status: "DISPONIBLE" as const,
      })),
    }));

    return {
      id: sectionId,
      name: sec.name,
      description: sec.description,
      type: sec.type,
      price: SECTION_PRICES[sec.type],
      capacity: rows.reduce((acc, r) => acc + r.seats.length, 0),
      rows,
    };
  });
}

const ROOM_SECTIONS_TEMPLATE = buildSectionsTemplate();

// Cada función tiene su propio mapa de asientos (independiente de otras funciones)
export function generateSeatMap(): Section[] {
  return ROOM_SECTIONS_TEMPLATE.map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      label: row.label,
      seats: row.seats.map((seat) => ({
        ...seat,
        status: Math.random() < 0.15 ? "OCUPADO" : "DISPONIBLE",
      })),
    })),
  }));
}

function dateStr(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function addMinutesToTime(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const TIME_SLOTS = ["14:00", "17:00", "20:00", "22:30"];

export const showtimes: Showtime[] = [];
let stCounter = 1;

movies
  .filter((m) => m.status === "CARTELERA")
  .forEach((movie, mIdx) => {
    [0, 1, 2].forEach((offset) => {
      TIME_SLOTS.forEach((time, tIdx) => {
        if ((mIdx + tIdx) % 2 === 0) {
          const room = rooms[(mIdx + tIdx + offset) % rooms.length];
          showtimes.push({
            id: `st-${stCounter++}`,
            movieId: movie.id,
            roomId: room.id,
            date: dateStr(offset),
            startTime: time,
            endTime: addMinutesToTime(time, movie.duration),
          });
        }
      });
    });
  });

// Mapa de asientos pre-generado por función (evita generar durante el render)
export const initialSeatMaps: Record<string, Section[]> = Object.fromEntries(
  showtimes.map((st) => [st.id, generateSeatMap()])
);