import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatCurrency } from "@/lib/format";
import { CURRENT_USER_ID } from "@/data/mockData";

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700",
  CONFIRMADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export default function MyReservations() {
  const { reservations } = useBooking();
  const myReservations = reservations
    .filter((r) => r.userId === CURRENT_USER_ID)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (myReservations.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-zinc-500">Todavía no tienes reservas.</p>
        <Link to="/" className="text-amber-600 underline">Explorar cartelera</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Mis reservas</h1>

      {myReservations.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="font-semibold">{r.movieName}</p>
            <p className="text-sm text-zinc-500 capitalize">
              {formatDateLong(r.date)} · {r.startTime} · {r.roomName}
            </p>
            <p className="text-sm text-zinc-500">
              {r.seatIds.length} boleto(s) · {formatCurrency(r.total)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge className={STATUS_STYLES[r.status]}>{r.status}</Badge>
            {r.status === "CONFIRMADA" && (
              <Link to={`/app/boletos/${r.id}`}>
                <Button size="sm" variant="outline">Ver boleto</Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}