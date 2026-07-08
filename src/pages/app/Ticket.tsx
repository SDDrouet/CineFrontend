import { useParams, Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import TicketDetails from "@/components/booking/TicketDetails";

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
      <TicketDetails reservation={reservation} />
      <Link to="/app/mis-reservas" className="mt-6 block">
        <Button variant="outline" className="w-full">Ver todas mis reservas</Button>
      </Link>
    </div>
  );
}