import type { Reservation } from "@/types";
import { formatDateLong, formatCurrency } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export default function TicketDetails({ reservation }: { reservation: Reservation }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-6 w-6" />
        <h2 className="text-xl font-bold text-zinc-900">Reserva confirmada</h2>
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
    </div>
  );
}