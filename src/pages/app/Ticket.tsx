import { useParams, Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatCurrency } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export default function Ticket() {
  const { reservationId } = useParams();
  const { getReservation } = useBooking();
  const reservation = reservationId ? getReservation(reservationId) : undefined;

  if (!reservation) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-500">No encontramos esta reserva.</p>
        <Link to="/app/mis-reservas" className="text-amber-600 underline">Ver mis reservas</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold text-zinc-900">Reserva confirmada</h1>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-zinc-500">Código de reserva</p>
        <p className="mb-4 font-mono text-lg font-semibold tracking-wider">{reservation.code}</p>

        <p className="font-semibold">{reservation.movieName}</p>
        <p className="mb-4 text-sm text-zinc-500 capitalize">
          {formatDateLong(reservation.date)} · {reservation.startTime} · {reservation.roomName}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {reservation.tickets.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(t.qrData)}`}
                alt={`QR asiento ${t.seatLabel}`}
                className="h-20 w-20 rounded"
              />
              <div className="text-sm">
                <p className="font-medium">{t.sectionName}</p>
                <p className="text-zinc-500">Asiento {t.seatLabel}</p>
                <p className="text-zinc-500">{formatCurrency(t.price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4 font-semibold">
          <span>Total pagado</span>
          <span>{formatCurrency(reservation.total)}</span>
        </div>
      </div>

      <Link to="/app/mis-reservas" className="mt-6 block">
        <Button variant="outline" className="w-full">Ver todas mis reservas</Button>
      </Link>
    </div>
  );
}