import MovieCatalog from "@/components/movies/MovieCatalog";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MovieCatalog
        badge="Bienvenido"
        title="¿Qué película veremos hoy?"
        subtitle="Explora la cartelera, encuentra la función ideal y reserva tus asientos favoritos."
      />
    </div>
  );
}