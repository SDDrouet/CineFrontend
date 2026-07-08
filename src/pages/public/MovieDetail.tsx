import { useParams, useNavigate, Link } from "react-router-dom";
import { movies, showtimes, rooms } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatDuration, formatDateLong } from "@/lib/format";
import { Clock, Calendar } from "lucide-react";

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-zinc-500">No encontramos esta película.</p>
        <Link to="/" className="text-amber-600 underline">Volver a cartelera</Link>
      </div>
    );
  }

  const movieShowtimes = showtimes.filter((st) => st.movieId === movie.id);
  const byDate = movieShowtimes.reduce<Record<string, typeof movieShowtimes>>((acc, st) => {
    (acc[st.date] ??= []).push(st);
    return acc;
  }, {});
  const hasShowtimes = movieShowtimes.length > 0;

  const handleReservar = () => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: `/app/reserva/${movie.id}` } });
      return;
    }
    navigate(`/app/reserva/${movie.id}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 sm:grid-cols-[280px_1fr]">
        <img src={movie.posterUrl} alt={movie.name} className="w-full rounded-xl object-cover" />

        <div>
          <h1 className="text-3xl font-bold">{movie.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{movie.classification}</Badge>
            {movie.genres.map((g) => (
              <Badge key={g} variant="outline">{g}</Badge>
            ))}
            <Badge variant="secondary">{formatDuration(movie.duration)}</Badge>
          </div>
          <p className="mt-4 text-zinc-600">{movie.description}</p>

          <Button className="mt-6" size="lg" disabled={!hasShowtimes} onClick={handleReservar}>
            {hasShowtimes ? "Reservar boletos" : "Sin funciones disponibles"}
          </Button>

          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Funciones programadas</h2>
            {!hasShowtimes && (
              <p className="text-sm text-zinc-500">Aún no hay funciones programadas.</p>
            )}
            {Object.entries(byDate).map(([date, sts]) => (
              <div key={date}>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium capitalize text-zinc-700">
                  <Calendar className="h-4 w-4" /> {formatDateLong(date)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sts.map((st) => {
                    const room = rooms.find((r) => r.id === st.roomId);
                    return (
                      <span key={st.id} className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-zinc-600">
                        <Clock className="h-3.5 w-3.5" /> {st.startTime} · {room?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}