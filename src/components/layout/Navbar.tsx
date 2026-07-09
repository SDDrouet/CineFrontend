import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Clapperboard } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Clapperboard className="h-5 w-5 text-amber-600" />
          CineReserva
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Button size="sm" variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Link to="/auth/login">Iniciar sesión</Link>
              <Link to="/auth/register">Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}