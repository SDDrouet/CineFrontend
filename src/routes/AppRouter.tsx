import { Routes, Route } from "react-router-dom";

import PublicLayout from "@/templates/PublicLayout";
import AuthLayout from "@/templates/AuthLayout";
import AppLayout from "@/templates/AppLayout";

import Home from "@/pages/public/Home";
import MovieDetail from "@/pages/public/MovieDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/app/Dashboard";
import BookingWizard from "@/pages/app/BookingWizard";
import Ticket from "@/pages/app/Ticket";
import MyReservations from "@/pages/app/MyReservations";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={
        <PublicRoute>
          <PublicLayout />
        </PublicRoute>
      }
      >
        <Route index element={<Home />} />
        <Route path="peliculas/:movieId" element={<MovieDetail />} />
      </Route>

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reserva/:movieId" element={<BookingWizard />} />
        <Route path="boletos/:reservationId" element={<Ticket />} />
        <Route path="mis-reservas" element={<MyReservations />} />
        <Route path="peliculas/:movieId" element={<MovieDetail />} />
      </Route>
    </Routes>
  );
}