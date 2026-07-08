import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { movies, showtimes, rooms } from "@/data/mockData";
import { useBooking, MAX_SEATS_PER_PURCHASE } from "@/context/BookingContext";
import SeatMap from "@/components/booking/SeatMap";
import Stepper from "@/components/booking/Stepper";
import TicketDetails from "@/components/booking/TicketDetails";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatCurrency, formatCountdown } from "@/lib/format";
import { Clock, Calendar } from "lucide-react";

const STEPS = ["Función", "Asientos", "Confirmar", "Confirmación"];

export default function BookingWizard() {
  const { movieId } = useParams();
  const {
    setCurrentShowtime,
    getSeatMap,
    selectedSeatIds,
    toggleSeat,
    clearSelection,
    createPendingReservation,
    confirmReservation,
    cancelReservation,
    getReservation,
  } = useBooking();

  const movie = movies.find((m) => m.id === movieId);
  const movieShowtimes = showtimes.filter((st) => st.movieId === movieId);
  const byDate = movieShowtimes.reduce<Record<string, typeof movieShowtimes>>((acc, st) => {
    (acc[st.date] ??= []).push(st);
    return acc;
  }, {});

  const [step, setStep] = useState(1);
  const [showtimeId, setShowtimeId] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const showtime = showtimes.find((s) => s.id === showtimeId);
  const room = rooms.find((r) => r.id === showtime?.roomId);
  const sections = showtimeId ? getSeatMap(showtimeId) : [];
  const reservation = reservationId ? getReservation(reservationId) : undefined;

  const total = useMemo(() => {
    const allSeats = sections.flatMap((sec) => sec.rows.flatMap((r) => r.seats.map((s) => ({ ...s, price: sec.price }))));
    return selectedSeatIds.reduce((sum, id) => {
      const seat = allSeats.find((s) => s.id === id);
      return sum + (seat?.price ?? 0);
    }, 0);
  }, [sections, selectedSeatIds]);

  // El contador solo corre mientras se está confirmando (paso 3)
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Auto-cancelación si expiran los 5 minutos sin confirmar
  useEffect(() => {
    if (reservation && reservation.status === "PENDIENTE" && now >= reservation.expiresAt) {
      cancelReservation(reservation.id);
      clearSelection();
      setReservationId(null);
      setStep(1);
    }
  }, [now, reservation, cancelReservation, clearSelection]);

  if (!movie) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-500">No encontramos esta película.</p>
        <Link to="/" className="text-amber-600 underline">Volver a cartelera</Link>
      </div>
    );
  }

  const handleSelectShowtime = (id: string) => {
    setShowtimeId(id);
    setCurrentShowtime(id);
    setStep(2);
  };

  const handleGoToConfirm = () => {
    if (!showtimeId) return;
    const newReservation = createPendingReservation(showtimeId, selectedSeatIds);
    setReservationId(newReservation.id);
    setStep(3);
  };

  const handleConfirm = () => {
    if (!reservation) return;
    confirmReservation(reservation.id);
    clearSelection();
    setStep(4);
  };

  const handleCancelConfirmStep = () => {
    if (reservation) cancelReservation(reservation.id);
    clearSelection();
    setReservationId(null);
    setStep(2);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">{movie.name}</h1>
        <p className="text-sm text-zinc-500">Reserva tus boletos en unos simples pasos</p>
      </div>

      <Stepper steps={STEPS} currentStep={step} />

      {step === 1 && (
        <div className="space-y-6">
          {Object.keys(byDate).length === 0 && (
            <p className="text-sm text-zinc-500">Aún no hay funciones programadas para esta película.</p>
          )}
          {Object.entries(byDate).map(([date, sts]) => (
            <div key={date}>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium capitalize text-zinc-700">
                <Calendar className="h-4 w-4" /> {formatDateLong(date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {sts.map((st) => {
                  const stRoom = rooms.find((r) => r.id === st.roomId);
                  return (
                    <Button key={st.id} variant="outline" className="gap-2" onClick={() => handleSelectShowtime(st.id)}>
                      <Clock className="h-4 w-4" /> {st.startTime} · {stRoom?.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && showtime && (
        <div>
          <p className="mb-6 text-sm text-zinc-500 capitalize">
            {formatDateLong(showtime.date)} · {showtime.startTime} · {room?.name}
          </p>

          <SeatMap sections={sections} selectedSeatIds={selectedSeatIds} onToggle={toggleSeat} />

          <div className="sticky bottom-0 mt-8 flex items-center justify-between rounded-xl border bg-white/95 p-4 backdrop-blur">
            <div>
              <p className="text-sm text-zinc-500">
                {selectedSeatIds.length} / {MAX_SEATS_PER_PURCHASE} asientos seleccionados
              </p>
              <p className="text-lg font-semibold">{formatCurrency(total)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
              <Button disabled={selectedSeatIds.length === 0} onClick={handleGoToConfirm}>
                Continuar
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && reservation && showtime && (
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl border p-5">
            <p className="font-semibold">{movie.name}</p>
            <p className="text-sm text-zinc-500 capitalize">
              {formatDateLong(showtime.date)} · {showtime.startTime} · {room?.name}
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
            <span className="font-mono text-base font-semibold">
              {formatCountdown(reservation.expiresAt - now)}
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancelConfirmStep}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Confirmar reserva
            </Button>
          </div>
        </div>
      )}

      {step === 4 && reservation && (
        <div className="mx-auto max-w-xl">
          <TicketDetails reservation={reservation} />
          <div className="mt-6 flex gap-3">
            <Link to="/app/mis-reservas" className="flex-1">
              <Button variant="outline" className="w-full">Ver mis reservas</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}