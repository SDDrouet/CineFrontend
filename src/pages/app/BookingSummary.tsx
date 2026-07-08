import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { showtimes, movies, rooms } from "@/data/mockData";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatCurrency, formatCountdown } from "@/lib/format";

export default function BookingSummary() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const {
    selectedSeatIds,
    createPendingReservation,
    confirmReservation,
    cancelReservation,
    clearSelection,
    getReservation,
  } = useBooking();

  const [reservationId, setReservationId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const created = useRef(false);

  useEffect(() => {
    if (!created.current && showtimeId && selectedSeatIds.length > 0) {
      created.current = true;
      const reservation = createPendingReservation(showtimeId, selectedSeatIds);
      setReservationId(reservation.id);
    }
  }, [showtimeId, selectedSeatIds, createPendingReservation]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const reservation = reservationId ? getReservation(reservationId) : undefined;

  useEffect(() => {
    if (reservation && reservation.status === "PENDIENTE" && now >= reservation.expiresAt) {
      cancelReservation(reservation.id);
    }
  }, [now, reservation, cancelReservation]);

  if (!showtimeId || selectedSeatIds.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-500">No hay asientos seleccionados.</p>
        <Link to="/" className="text-amber-600 underline">Volver a cartelera</Link>
      </div>
    );
  }

  if (!reservation) return null;

  const showtime = showtimes.find((s) => s.id === showtimeId);
  const movie = movies.find((m) => m.id === showtime?.movieId);
  const room = rooms.find((r) => r.id === showtime?.roomId);

  if (reservation.status === "CANCELADA") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-semibold text-red-600">Reserva cancelada</h1>
        <p className="mt-2 text-sm text-zinc-500">
          El tiempo para confirmar tu reserva expiró y los asientos fueron liberados.
        </p>
        <Link to={`/peliculas/${movie?.id}`} className="mt-4 inline-block">
          <Button>Elegir otra función</Button>
        </Link>
      </div>
    );
  }

  const remainingMs = reservation.expiresAt - now;

  const handleConfirm = () => {
    confirmReservation(reservation.id);
    clearSelection();
    navigate(`/app/boletos/${reservation.id}`);
  };

  const handleCancel = () => {
    cancelReservation(reservation.id);
    clearSelection();
    navigate(`/peliculas/${movie?.id}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Confirma tu reserva</h1>

      <div className="mt-4 rounded-xl border p-5">
        <p className="font-semibold">{movie?.name}</p>
        <p className="text-sm text-zinc-500 capitalize">
          {showtime && formatDateLong(showtime.date)} · {showtime?.startTime} · {room?.name}
        </p>

        <div className="my-4 border-t pt-4">
          <p className="mb-2 text-sm font-medium">Boletos</p>
          <ul className="space-y-1 text-sm">
            {reservation.tickets.map((t) => (
              <li key={t.id} className="flex justify-between">
                <span>{t.sectionName} · Asiento {t.seatLabel}</span>
                <span>{formatCurrency(t.price)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t pt-4 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(reservation.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span>Confirma antes de que expire tu reserva</span>
        <span className="font-mono text-base font-semibold">{formatCountdown(remainingMs)}</span>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleCancel}>Cancelar</Button>
        <Button className="flex-1" onClick={handleConfirm}>Confirmar reserva</Button>
      </div>
    </div>
  );
}