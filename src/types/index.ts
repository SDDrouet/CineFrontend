export type SeatStatus = "DISPONIBLE" | "RESERVADO" | "OCUPADO";
export type SectionType = "VIP" | "DBOX" | "GENERAL";
export type MovieStatus = "CARTELERA" | "PROXIMAMENTE" | "FINALIZADA";
export type ReservationStatus = "PENDIENTE" | "CONFIRMADA" | "CANCELADA";

export interface Movie {
  id: string;
  name: string;
  description: string;
  duration: number; // minutos
  classification: string; // "ATP" | "+13" | "+16" | "+18"
  genres: string[];
  status: MovieStatus;
  posterUrl: string;
}

export interface Seat {
  id: string;
  rowLabel: string;
  number: number;
  sectionId: string;
  status: SeatStatus;
}

export interface Row {
  label: string; // A, B, C...
  seats: Seat[];
}

export interface Section {
  id: string;
  name: string;
  description: string;
  type: SectionType;
  price: number;
  capacity: number;
  rows: Row[];
}

export interface Room {
  id: string;
  name: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface Ticket {
  id: string;
  seatId: string;
  seatLabel: string;
  sectionName: string;
  price: number;
  qrData: string;
}

export interface Reservation {
  id: string;
  code: string;
  userId: string;
  functionId: string; // showtimeId
  movieName: string;
  roomName: string;
  date: string;
  startTime: string;
  seatIds: string[];
  tickets: Ticket[];
  total: number;
  status: ReservationStatus;
  createdAt: number;
  expiresAt: number;
}