import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { showtimes, movies, rooms } from "@/data/mockData";
import { useBooking, MAX_SEATS_PER_PURCHASE } from "@/context/BookingContext";
import SeatMap from "@/components/booking/SeatMap";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatCurrency } from "@/lib/format";

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { setCurrentShowtime, getSeatMap, selectedSeatIds, toggleSeat } = useBooking();

  useEffect(() => {
    if (showtimeId) setCurrentShowtime(showtimeId);
  }, [showtimeId, setCurrentShowtime]);

  const showtime = showtimes.find((s) => s.id === showtimeId);
  const movie = movies.find((m) => m.id === showtime?.movieId);
  const room = rooms.find((r) => r.id === showtime?.roomId);
  const sections = showtimeId ? getSeatMap(showtimeId) : [];

  const total = useMemo(() => {
    const allSeats = sections.flatMap((sec) => sec.rows.flatMap((r) => r.seats.map((s) => ({ ...s, price: sec.price }))));
    return selectedSeatIds.reduce((sum, id) => {
      const seat = allSeats.find((s) => s.id === id);
      return sum + (seat?.price ?? 0);
    }, 0);
  }, [sections, selectedSeatIds]);

  if (!showtime || !movie) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-500">Esta función ya no está disponible.</p>
        <Link to="/" className="text-amber-600 underline">Volver a cartelera</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{movie.name}</h1>
        <p className="text-sm text-zinc-500 capitalize">
          {formatDateLong(showtime.date)} · {showtime.startTime} · {room?.name}
        </p>
      </div>

      <SeatMap sections={sections} selectedSeatIds={selectedSeatIds} onToggle={toggleSeat} />

      <div className="sticky bottom-0 mt-8 flex items-center justify-between rounded-xl border bg-white/95 p-4 backdrop-blur">
        <div>
          <p className="text-sm text-zinc-500">
            {selectedSeatIds.length} / {MAX_SEATS_PER_PURCHASE} asientos seleccionados
          </p>
          <p className="text-lg font-semibold">{formatCurrency(total)}</p>
        </div>
        <Button disabled={selectedSeatIds.length === 0} onClick={() => navigate(`/app/reserva/${showtimeId}/resumen`)}>
          Continuar
        </Button>
      </div>
    </div>
  );
}