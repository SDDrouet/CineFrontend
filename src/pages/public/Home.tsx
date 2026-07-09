import MovieCatalog from "@/components/movies/MovieCatalog";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <MovieCatalog
        title="Reserva tu butaca antes de que se apaguen las luces"
        subtitle="Elige película, función y asiento en pocos pasos. VIP, DBOX o General: tú decides cómo ver la historia."
      />
    </div>
  );
}