import { Routes, Route } from "react-router-dom";

import PublicLayout from "@/templates/PublicLayout";
import AuthLayout from "@/templates/AuthLayout";
import AppLayout from "@/templates/AppLayout";

import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/app/Dashboard";

export default function AppRouter() {
  return (
    <Routes>

      {/* Públicas */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Login */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Usuario autenticado */}
      <Route path="/app" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}