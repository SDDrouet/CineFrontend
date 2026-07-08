import { Routes, Route } from "react-router-dom";

import PublicLayout from "@/templates/PublicLayout";
import AuthLayout from "@/templates/AuthLayout";
import AppLayout from "@/templates/AppLayout";

import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/app/Dashboard";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <Routes>

            {/* Públicas */}
            <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
            </Route>

            {/* Login */}
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

            {/* Usuario autenticado */}
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
            </Route>

        </Routes>
    );
}