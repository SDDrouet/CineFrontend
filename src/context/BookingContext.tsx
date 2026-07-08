import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Section, Seat, Reservation, Ticket } from "@/types";
import { initialSeatMaps, CURRENT_USER_ID, showtimes, movies, rooms } from "@/data/mockData";
import { generateReservationCode } from "@/lib/format";

export const MAX_SEATS_PER_PURCHASE = 6;
const HOLD_MINUTES = 5;

interface BookingContextType {
  selectedSeatIds: string[];
  setCurrentShowtime: (showtimeId: string) => void;
  getSeatMap: (showtimeId: string) => Section[];
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
  createPendingReservation: (showtimeId: string, seatIds: string[]) => Reservation;
  confirmReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  reservations: Reservation[];
  getReservation: (id: string) => Reservation | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [seatMaps, setSeatMaps] = useState<Record<string, Section[]>>(initialSeatMaps);
  const [currentShowtimeId, setCurrentShowtimeId] = useState<string | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const getSeatMap = useCallback(
    (showtimeId: string) => seatMaps[showtimeId] ?? [],
    [seatMaps]
  );

  // Al cambiar de función se limpia la selección: evita mezclar boletos
  // de películas/funciones distintas en una misma reserva.
  const setCurrentShowtime = useCallback((showtimeId: string) => {
    setCurrentShowtimeId((prev) => {
      if (prev !== showtimeId) setSelectedSeatIds([]);
      return showtimeId;
    });
  }, []);

  const toggleSeat = useCallback((seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) return prev.filter((id) => id !== seatId);
      if (prev.length >= MAX_SEATS_PER_PURCHASE) return prev; // límite de 6 boletos
      return [...prev, seatId];
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedSeatIds([]), []);

  const updateSeatStatus = useCallback(
    (showtimeId: string, seatIds: string[], status: Seat["status"]) => {
      setSeatMaps((prev) => {
        const map = prev[showtimeId];
        if (!map) return prev;
        const updated = map.map((section) => ({
          ...section,
          rows: section.rows.map((row) => ({
            ...row,
            seats: row.seats.map((seat) =>
              seatIds.includes(seat.id) ? { ...seat, status } : seat
            ),
          })),
        }));
        return { ...prev, [showtimeId]: updated };
      });
    },
    []
  );

  const createPendingReservation = useCallback(
    (showtimeId: string, seatIds: string[]) => {
      const showtime = showtimes.find((s) => s.id === showtimeId)!;
      const movie = movies.find((m) => m.id === showtime.movieId)!;
      const room = rooms.find((r) => r.id === showtime.roomId)!;
      const map = seatMaps[showtimeId] ?? [];
      const allSeats = map.flatMap((sec) => sec.rows.flatMap((r) => r.seats));

      const code = generateReservationCode();
      const tickets: Ticket[] = seatIds.map((seatId) => {
        const seat = allSeats.find((s) => s.id === seatId)!;
        const section = map.find((sec) => sec.rows.some((r) => r.seats.some((s) => s.id === seatId)))!;
        return {
          id: `tk-${seatId}-${Date.now()}`,
          seatId,
          seatLabel: `${seat.rowLabel}${seat.number}`,
          sectionName: section.name,
          price: section.price,
          qrData: `${code}|${seat.rowLabel}${seat.number}`,
        };
      });

      const now = Date.now();
      const reservation: Reservation = {
        id: `res-${now}`,
        code,
        userId: CURRENT_USER_ID,
        functionId: showtimeId,
        movieName: movie.name,
        roomName: room.name,
        date: showtime.date,
        startTime: showtime.startTime,
        seatIds,
        tickets,
        total: tickets.reduce((sum, t) => sum + t.price, 0),
        status: "PENDIENTE",
        createdAt: now,
        expiresAt: now + HOLD_MINUTES * 60 * 1000,
      };

      updateSeatStatus(showtimeId, seatIds, "RESERVADO");
      setReservations((prev) => [...prev, reservation]);
      return reservation;
    },
    [seatMaps, updateSeatStatus]
  );

  const confirmReservation = useCallback(
    (reservationId: string) => {
      setReservations((prev) => {
        const res = prev.find((r) => r.id === reservationId);
        if (res) updateSeatStatus(res.functionId, res.seatIds, "OCUPADO");
        return prev.map((r) => (r.id === reservationId ? { ...r, status: "CONFIRMADA" } : r));
      });
    },
    [updateSeatStatus]
  );

  const cancelReservation = useCallback(
    (reservationId: string) => {
      setReservations((prev) => {
        const res = prev.find((r) => r.id === reservationId);
        if (res) updateSeatStatus(res.functionId, res.seatIds, "DISPONIBLE");
        return prev.map((r) => (r.id === reservationId ? { ...r, status: "CANCELADA" } : r));
      });
    },
    [updateSeatStatus]
  );

  const getReservation = useCallback(
    (id: string) => reservations.find((r) => r.id === id),
    [reservations]
  );

  return (
    <BookingContext.Provider
      value={{
        selectedSeatIds,
        setCurrentShowtime,
        getSeatMap,
        toggleSeat,
        clearSelection,
        createPendingReservation,
        confirmReservation,
        cancelReservation,
        reservations,
        getReservation,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de <BookingProvider>");
  return ctx;
}