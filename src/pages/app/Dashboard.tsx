import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { movies } from "@/data/mockData";
import MovieCard from "@/components/movies/MovieCard";

export default function Dashboard() {
  const nowShowing = movies.filter((m) => m.status === "CARTELERA").slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Hola de nuevo 👋</h1>
        <p className="text-zinc-500">Elige una película o revisa tus reservas activas.</p>
      </div>

      <div className="flex gap-3">
        <Link to="/"><Button variant="outline">Ver cartelera</Button></Link>
        <Link to="/app/mis-reservas"><Button>Mis reservas</Button></Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">En cartelera</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {nowShowing.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>
    </div>
  );
}