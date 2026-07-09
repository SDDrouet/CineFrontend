import { useMemo, useState } from "react";
import { movies, showtimes } from "@/data/mockData";
import MovieCard from "./MovieCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const GENRES = Array.from(new Set(movies.flatMap((m) => m.genres))).sort();
const CLASSIFICATIONS = Array.from(
  new Set(movies.map((m) => m.classification))
);

type TimeBucket = "" | "mañana" | "tarde" | "noche";

function bucketOf(time: string): TimeBucket {
  const h = Number(time.split(":")[0]);

  if (h < 12) return "mañana";
  if (h < 18) return "tarde";

  return "noche";
}

interface MovieCatalogProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export default function MovieCatalog({
  title,
  subtitle,
  badge = "En cartelera",
}: MovieCatalogProps) {
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [classification, setClassification] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeBucket>("");

  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => m.status === "CARTELERA")
      .filter((m) => m.name.toLowerCase().includes(name.toLowerCase()))
      .filter((m) => !genre || m.genres.includes(genre))
      .filter((m) => !classification || m.classification === classification)
      .filter((m) => {
        if (!date && !time) return true;

        return showtimes.some(
          (st) =>
            st.movieId === m.id &&
            (!date || st.date === date) &&
            (!time || bucketOf(st.startTime) === time)
        );
      });
  }, [name, genre, classification, date, time]);

  return (
    <>
      <section className="mb-10 rounded-2xl bg-linear-to-br from-zinc-900 via-zinc-900 to-amber-950 px-8 py-14 text-white">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          {badge}
        </p>

        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-zinc-300">
          {subtitle}
        </p>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Buscar por título"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">Todos los géneros</option>

          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="">Toda clasificación</option>

          {CLASSIFICATIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="rounded-md border px-3 py-2 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={time}
          onChange={(e) => setTime(e.target.value as TimeBucket)}
        >
          <option value="">Todo horario</option>
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </section>

      {filteredMovies.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">
          No encontramos películas con esos filtros.
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isAuthenticated={isAuthenticated} />
          ))}
        </section>
      )}
    </>
  );
}