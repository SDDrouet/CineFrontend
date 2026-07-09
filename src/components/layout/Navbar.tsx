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
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur min-h-16">
      <nav className="flex items-center justify-between w-full h-16 px-4 md:px-6 lg:px-8">
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
              <Button size="sm" variant="outline">
                <Link to="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm">
                <Link to="/auth/register">Registrate</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}