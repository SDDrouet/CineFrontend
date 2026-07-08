import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types";
import { formatDuration } from "@/lib/format";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/peliculas/${movie.id}`}
      className="group overflow-hidden rounded-xl border transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[2/3] overflow-hidden bg-zinc-100">
        <img
          src={movie.posterUrl}
          alt={movie.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-1 font-semibold">{movie.name}</h3>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{movie.classification}</Badge>
          <Badge variant="outline">{formatDuration(movie.duration)}</Badge>
        </div>
        <p className="line-clamp-1 text-xs text-zinc-500">{movie.genres.join(" · ")}</p>
      </div>
    </Link>
  );
}