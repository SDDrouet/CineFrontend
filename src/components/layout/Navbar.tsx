import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="border-b p-4">

            <nav className="flex gap-4">

                <Link to="/">Inicio</Link>

                <Link to="/auth/login">
                    Login
                </Link>

                <Link to="/auth/register">
                    Registro
                </Link>

                <Link to="/app/dashboard">
                    Dashboard
                </Link>

                <Button onClick={handleLogout}>
                    Cerrar sesión
                </Button>

            </nav>

        </header>
    );
}